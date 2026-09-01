import { describe, expect, test } from "bun:test";
import {
  toPostDetail,
  updatedIsoDay,
  type PostDetailEntry,
} from "../../astro/content/post-detail";
import type { BlogPostFrontmatter, PostHeading } from "../../astro/content/post";

// The Post-detail Projection. Every rule it composes is already asserted
// elsewhere — readingTimeMinutes and isoDay in blog-content, hasMathDelimiter
// in blog-markdown, selectTocHeadings/shouldShowToc and resolveRelatedLinks in
// blog-metadata. What was NEVER covered, because it lived in [slug].astro's
// frontmatter, is the composition: that the right rule reaches the right field.
// These tests assert the wiring, not the rules.

const data = (over: Partial<BlogPostFrontmatter> = {}): BlogPostFrontmatter => ({
  title: "T",
  summary: "S",
  category: "Inference",
  status: "Published",
  published: new Date("2026-07-01"),
  ...over,
});

const entry = (over: Partial<PostDetailEntry> = {}): PostDetailEntry => ({
  id: "a-post",
  body: "one two three",
  data: data(),
  ...over,
});

const heading = (depth: number, slug: string): PostHeading => ({ depth, slug, text: slug });

describe("toPostDetail (composition)", () => {
  test("derives minutes from the body, not from frontmatter", () => {
    const detail = toPostDetail(entry({ body: Array(440).fill("w").join(" ") }), []);
    expect(detail.minutes).toBe(2);
  });

  test("treats a missing body as empty rather than throwing", () => {
    const detail = toPostDetail({ id: "a", data: data() }, []);
    expect(detail.minutes).toBe(1);
    expect(detail.hasMath).toBe(false);
  });

  test("derives hasMath by scanning the body — there is no frontmatter flag", () => {
    expect(toPostDetail(entry({ body: "prose $a+b$ prose" }), []).hasMath).toBe(true);
    expect(toPostDetail(entry({ body: "ordinary prose" }), []).hasMath).toBe(false);
  });

  test("carries frontmatter through untouched and derives slug from the entry id", () => {
    const frontmatter = data({ status: "Drafting", tags: ["kv-cache"], cover: "/c.png" });
    const detail = toPostDetail({ id: "the-slug", body: "x", data: frontmatter }, []);
    expect(detail.slug).toBe("the-slug");
    expect(detail.data).toBe(frontmatter);
  });

  test("resolves tags to render-ready chips, leaving the raw slugs on data", () => {
    const detail = toPostDetail(entry({ data: data({ tags: ["moe", "kv-cache"] }) }), []);
    expect(detail.tagChips).toEqual([
      { slug: "moe", label: "MoE", href: "/blog/tags/moe" },
      { slug: "kv-cache", label: "KV cache", href: "/blog/tags/kv-cache" },
    ]);
    expect(detail.data.tags).toEqual(["moe", "kv-cache"]);
  });

  test("chips are empty, not undefined, for an untagged Post", () => {
    expect(toPostDetail(entry(), []).tagChips).toEqual([]);
  });

  test("routes the published date to iso", () => {
    const detail = toPostDetail(entry({ data: data({ published: new Date("2026-06-18") }) }), []);
    expect(detail.iso).toBe("2026-06-18");
  });

  test("selects H2/H3 into toc and gates showToc on the same headings", () => {
    const headings = [heading(1, "h1"), heading(2, "a"), heading(3, "b"), heading(4, "h4")];
    const detail = toPostDetail(entry(), headings);
    expect(detail.toc.map((h) => h.slug)).toEqual(["a", "b"]);
    expect(detail.showToc).toBe(false); // 2 selected, below the threshold

    const more = toPostDetail(entry(), [...headings, heading(2, "c")]);
    expect(more.toc).toHaveLength(3);
    expect(more.showToc).toBe(true);
  });

  test("resolves related links, and is empty for a standalone Post", () => {
    expect(toPostDetail(entry(), []).related).toEqual([]);
    const related = toPostDetail(
      entry({ data: data({ related: { experiments: ["kv-cache"] } }) }),
      [],
    ).related;
    expect(related).toHaveLength(1);
    expect(related[0]?.href).toBe("/experiments/kv-cache");
  });
});

// The invariant this Projection exists to create. The byline day and the
// article:modified_time SEO value are two representations of ONE rule; before
// the Projection they were derived independently — updatedIsoDay() in the
// frontmatter, `updatedLabel ? updated : undefined` in the JSX — which is two
// chances to disagree about whether a Post counts as updated.
describe("toPostDetail: updatedIso and modifiedTime cannot disagree", () => {
  const published = new Date("2026-07-01");
  const withUpdated = (updated?: Date) =>
    toPostDetail(entry({ data: data({ published, updated }) }), []);

  test("both present when updated is meaningfully later", () => {
    const detail = withUpdated(new Date("2026-07-09"));
    expect(detail.updatedIso).toBe("2026-07-09");
    expect(detail.modifiedTime?.toISOString()).toBe("2026-07-09T00:00:00.000Z");
  });

  test("both absent when there is no updated date", () => {
    const detail = withUpdated(undefined);
    expect(detail.updatedIso).toBeNull();
    expect(detail.modifiedTime).toBeUndefined();
  });

  test("both absent when updated is equal to or earlier than published", () => {
    for (const updated of [new Date("2026-07-01"), new Date("2026-06-30")]) {
      const detail = withUpdated(updated);
      expect(detail.updatedIso).toBeNull();
      expect(detail.modifiedTime).toBeUndefined();
    }
  });
});

// Moved here from post-list.test.ts with the function itself — the detail
// surface is its only consumer; no list surface shows an Updated day.
describe("updatedIsoDay (the 'Updated' surface rule, #7)", () => {
  const published = new Date("2026-07-01");

  test("null when there is no updated date", () => {
    expect(updatedIsoDay(published, undefined)).toBeNull();
  });

  test("null when updated is not meaningfully later (equal or earlier)", () => {
    expect(updatedIsoDay(published, new Date("2026-07-01"))).toBeNull();
    expect(updatedIsoDay(published, new Date("2026-06-30"))).toBeNull();
  });

  test("the updated ISO day when later than published", () => {
    expect(updatedIsoDay(published, new Date("2026-07-09"))).toBe("2026-07-09");
  });
});
