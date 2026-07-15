import { describe, expect, test } from "bun:test";
import {
  isoDay,
  toPostListItems,
  updatedIsoDay,
  type PostListEntry,
} from "../../astro/content/post-list";
import type { BlogPostFrontmatter } from "../../astro/content/blog-schema";

// The Post-list view-model — previously copy-pasted across five .astro
// frontmatter blocks where no unit test could reach it.

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

describe("isoDay (UTC calendar-day slice)", () => {
  test("returns YYYY-MM-DD", () => {
    expect(isoDay(new Date("2026-07-13"))).toBe("2026-07-13");
  });

  test("cannot shift the day across timezones — UTC midnight stays the authored day", () => {
    // The off-by-one this guards: a local-time formatter west of UTC would
    // render 2026-06-17 for this instant.
    expect(isoDay(new Date("2026-06-18T00:00:00.000Z"))).toBe("2026-06-18");
    expect(isoDay(new Date("2026-06-18T23:59:59.999Z"))).toBe("2026-06-18");
  });
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
});

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
