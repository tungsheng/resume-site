import { describe, expect, test } from "bun:test";
import { blogPostSchema, readingTimeMinutes } from "../../astro/content/blog-schema";

const validPost = {
  title: "Why Prefix Cache Hit Rate Is the First Number to Check",
  summary: "A short summary of the post.",
  category: "Inference internals",
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
      tags: ["Prefix cache", "SGLang"],
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
