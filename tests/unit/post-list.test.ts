import { describe, expect, test } from "bun:test";
import { toPostListItems, type PostListEntry } from "../../astro/content/post-list";
import type { BlogPostFrontmatter } from "../../astro/content/post";

// The Post-list Projection — previously copy-pasted across five .astro
// frontmatter blocks where no unit test could reach it. isoDay moved to
// post.ts (shared with the detail Projection and the home slice) and
// updatedIsoDay to post-detail.ts (its only consumer); both are asserted there.

const data = (over: Partial<BlogPostFrontmatter>): BlogPostFrontmatter => ({
  title: "T",
  summary: "S",
  category: "Inference",
  status: "Published",
  published: new Date("2026-07-01"),
  ...over,
});

const entry = (id: string, published: string, body = "one two three"): PostListEntry => ({
  id,
  body,
  data: data({ published: new Date(published) }),
});

describe("toPostListItems", () => {
  test("sorts newest first and derives slug/minutes/iso", () => {
    const items = toPostListItems([
      entry("older", "2026-06-18"),
      entry("newest", "2026-07-13", Array(440).fill("w").join(" ")),
    ]);
    expect(items.map((i) => i.slug)).toEqual(["newest", "older"]);
    expect(items[0]).toMatchObject({ slug: "newest", minutes: 2, iso: "2026-07-13" });
    expect(items[1]).toMatchObject({ minutes: 1, iso: "2026-06-18" });
  });

  test("treats a missing body as empty (minimum 1 minute)", () => {
    const items = toPostListItems([{ id: "a", data: data({}) }]);
    expect(items[0]?.minutes).toBe(1);
  });

  test("passes frontmatter through untouched for the meta rail (status, tags)", () => {
    const items = toPostListItems([
      { id: "a", body: "x", data: data({ status: "Drafting", tags: ["kv-cache"] }) },
    ]);
    expect(items[0]?.data.status).toBe("Drafting");
    expect(items[0]?.data.tags).toEqual(["kv-cache"]);
  });

  test("resolves tags to render-ready chips alongside the raw slugs", () => {
    const items = toPostListItems([
      { id: "a", body: "x", data: data({ tags: ["moe", "kv-cache"] }) },
    ]);
    expect(items[0]?.tagChips).toEqual([
      { slug: "moe", label: "MoE", href: "/blog/tags/moe" },
      { slug: "kv-cache", label: "KV cache", href: "/blog/tags/kv-cache" },
    ]);
  });

  test("chips are empty, not undefined, for an untagged Post", () => {
    const items = toPostListItems([{ id: "a", body: "x", data: data({}) }]);
    expect(items[0]?.tagChips).toEqual([]);
  });
});
