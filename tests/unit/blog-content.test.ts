import { describe, expect, test } from "bun:test";
import {
  POST_CATEGORIES,
  blogPostSchema,
  isPostVisible,
  readingTimeMinutes,
  selectLatest,
  sortByPublishedDesc,
} from "../../astro/content/blog-schema";
import {
  REGISTERED_TAG_SLUGS,
  isRegisteredTag,
  tagLabel,
} from "../../astro/content/tag-registry";

const validPost = {
  title: "Why Prefix Cache Hit Rate Is the First Number to Check",
  summary: "A short summary of the post.",
  category: "Inference",
  status: "Published",
  published: "2026-06-18",
};

describe("blog post frontmatter schema", () => {
  test("accepts a valid Published post and coerces the date", () => {
    const result = blogPostSchema.safeParse(validPost);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBeInstanceOf(Date);
    }
  });

  test("accepts optional tags/updated/related", () => {
    const result = blogPostSchema.safeParse({
      ...validPost,
      updated: "2026-06-20",
      tags: ["kv-cache", "prefill-decode"],
      related: { projects: ["gpu-inference-lab"] },
    });
    expect(result.success).toBe(true);
  });

  test("rejects a missing required field (title)", () => {
    const { title, ...withoutTitle } = validPost;
    expect(blogPostSchema.safeParse(withoutTitle).success).toBe(false);
  });

  test("rejects an unknown status", () => {
    expect(blogPostSchema.safeParse({ ...validPost, status: "Live" }).success).toBe(false);
  });

  test("rejects a Category outside the closed enum", () => {
    expect(blogPostSchema.safeParse({ ...validPost, category: "Inference internals" }).success).toBe(
      false,
    );
    expect(blogPostSchema.safeParse({ ...validPost, category: "Inference" }).success).toBe(true);
  });
});

describe("governed tag registry (ADR-0008 / #47)", () => {
  test("rejects an unregistered tag so the build fails instead of forking the vocabulary", () => {
    expect(blogPostSchema.safeParse({ ...validPost, tags: ["kv-cache", "kvcache"] }).success).toBe(
      false,
    );
  });

  test("rejects the pre-governance display-label spellings as tags", () => {
    // These were live forks in the corpus before #47 (`KV cache` vs `kv-cache`).
    for (const fork of ["KV cache", "Prefix cache", "Continuous batching", "SGLang"]) {
      expect(blogPostSchema.safeParse({ ...validPost, tags: [fork] }).success).toBe(false);
    }
  });

  test("accepts every registered slug", () => {
    expect(blogPostSchema.safeParse({ ...validPost, tags: [...REGISTERED_TAG_SLUGS] }).success).toBe(
      true,
    );
  });

  test("every slug is kebab-case and carries a non-empty display label", () => {
    for (const slug of REGISTERED_TAG_SLUGS) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(tagLabel(slug).length).toBeGreaterThan(0);
    }
  });

  test("no registered tag restates a Category (CONTEXT.md: Tags cross-cut Categories)", () => {
    for (const category of POST_CATEGORIES) {
      expect(isRegisteredTag(category.toLowerCase())).toBe(false);
    }
  });
});

describe("readingTimeMinutes (derived, not authored)", () => {
  test("returns at least 1 minute for short bodies", () => {
    expect(readingTimeMinutes("one two three")).toBe(1);
    expect(readingTimeMinutes("   ")).toBe(1);
  });

  test("computes ~220 wpm", () => {
    expect(readingTimeMinutes(Array(440).fill("word").join(" "))).toBe(2);
    expect(readingTimeMinutes(Array(1100).fill("word").join(" "))).toBe(5);
  });
});

describe("sortByPublishedDesc", () => {
  const post = (slug: string, iso: string) => ({ slug, data: { published: new Date(iso) } });

  test("orders newest Post first", () => {
    const ordered = sortByPublishedDesc([
      post("older", "2026-06-18"),
      post("newest", "2026-06-22"),
      post("middle", "2026-06-20"),
    ]);
    expect(ordered.map((p) => p.slug)).toEqual(["newest", "middle", "older"]);
  });

  test("does not mutate the input array", () => {
    const input = [post("a", "2026-01-01"), post("b", "2026-02-01")];
    const snapshot = input.map((p) => p.slug);
    sortByPublishedDesc(input);
    expect(input.map((p) => p.slug)).toEqual(snapshot);
  });
});

describe("selectLatest (home 'Latest writing' slice, #10)", () => {
  const post = (slug: string, iso: string) => ({ slug, data: { published: new Date(iso) } });

  test("returns the newest `limit` Posts, newest-first", () => {
    const latest = selectLatest(
      [
        post("older", "2026-06-18"),
        post("newest", "2026-06-22"),
        post("middle", "2026-06-20"),
        post("oldest", "2026-06-10"),
      ],
      2,
    );
    expect(latest.map((p) => p.slug)).toEqual(["newest", "middle"]);
  });

  test("returns all Posts when fewer than the limit, and never mutates input", () => {
    const input = [post("a", "2026-02-01"), post("b", "2026-01-01")];
    const snapshot = input.map((p) => p.slug);
    expect(selectLatest(input, 5).map((p) => p.slug)).toEqual(["a", "b"]);
    expect(input.map((p) => p.slug)).toEqual(snapshot);
  });
});

describe("isPostVisible (Status visibility, ADR-0003 §8)", () => {
  test("Published is visible in prod and dev", () => {
    expect(isPostVisible("Published", true)).toBe(true);
    expect(isPostVisible("Published", false)).toBe(true);
  });

  test("Outline/Drafting are hidden in prod, visible in dev", () => {
    expect(isPostVisible("Outline", true)).toBe(false);
    expect(isPostVisible("Drafting", true)).toBe(false);
    expect(isPostVisible("Outline", false)).toBe(true);
    expect(isPostVisible("Drafting", false)).toBe(true);
  });
});
