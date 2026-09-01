import { describe, expect, test } from "bun:test";
import { toHeadTags, type HeadTag } from "../../astro/layouts/head-tags";

// The document head's rules. These were unreachable while they lived in
// BaseLayout.astro — every page on the site depends on them, and the only
// coverage was built HTML for the two pages the integration suite asserts.

const SITE = new URL("https://tonylee.bio");

const head = (input: Parameters<typeof toHeadTags>[0], path = "/blog/a-post/") =>
  toHeadTags(input, SITE, path);

const find = (tags: HeadTag[], key: "name" | "property" | "rel", value: string) =>
  tags.filter((t) => t.attrs[key] === value);

const content = (tags: HeadTag[], key: "name" | "property", value: string) =>
  find(tags, key, value)[0]?.attrs.content;

describe("canonical and image URLs are absolutized against the site", () => {
  test("canonical is the site origin plus the pathname", () => {
    const tags = head({ title: "T" }, "/work/gpu-inference-lab/");
    expect(find(tags, "rel", "canonical")[0]?.attrs.href).toBe(
      "https://tonylee.bio/work/gpu-inference-lab/",
    );
    expect(content(tags, "property", "og:url")).toBe(
      "https://tonylee.bio/work/gpu-inference-lab/",
    );
  });

  test("a root-relative image becomes absolute", () => {
    const tags = head({ title: "T", image: "/assets/cover.png" });
    expect(content(tags, "property", "og:image")).toBe("https://tonylee.bio/assets/cover.png");
    expect(content(tags, "name", "twitter:image")).toBe("https://tonylee.bio/assets/cover.png");
  });

  test("an already-absolute image is left alone", () => {
    const tags = head({ title: "T", image: "https://cdn.example.com/x.png" });
    expect(content(tags, "property", "og:image")).toBe("https://cdn.example.com/x.png");
  });

  test("no image means no og:image or twitter:image at all", () => {
    const tags = head({ title: "T" });
    expect(find(tags, "property", "og:image")).toHaveLength(0);
    expect(find(tags, "name", "twitter:image")).toHaveLength(0);
  });
});

// The reason this module exists. In BaseLayout these four tags were each gated
// by a separately-written `isArticle &&` in markup — four chances to forget the
// guard, on the file every page depends on. The gate is now written once.
describe("article:* tags are gated on ogType, once", () => {
  const articleData = {
    title: "T",
    ogType: "article" as const,
    publishedTime: new Date("2026-07-07"),
    modifiedTime: new Date("2026-08-28"),
    section: "Inference",
    tags: ["moe", "routing"],
  };

  test("an article emits published, modified, section and one tag each", () => {
    const tags = head(articleData);
    expect(content(tags, "property", "article:published_time")).toBe("2026-07-07T00:00:00.000Z");
    expect(content(tags, "property", "article:modified_time")).toBe("2026-08-28T00:00:00.000Z");
    expect(content(tags, "property", "article:section")).toBe("Inference");
    expect(find(tags, "property", "article:tag").map((t) => t.attrs.content)).toEqual([
      "moe",
      "routing",
    ]);
  });

  test("a website page emits NO article tag even when handed article data", () => {
    // The failure mode the four hand-written guards risked: one forgotten
    // `isArticle &&` leaks article metadata onto /work or /resume.
    const tags = head({ ...articleData, ogType: "website" });
    expect(tags.filter((t) => String(t.attrs.property ?? "").startsWith("article:"))).toEqual([]);
  });

  test("ogType defaults to website, so tags cannot leak by omission", () => {
    const { ogType, ...withoutType } = articleData;
    const tags = head(withoutType);
    expect(content(tags, "property", "og:type")).toBe("website");
    expect(tags.filter((t) => String(t.attrs.property ?? "").startsWith("article:"))).toEqual([]);
  });

  test("an article with no dates emits neither time tag", () => {
    const tags = head({ title: "T", ogType: "article", section: "CUDA" });
    expect(find(tags, "property", "article:published_time")).toHaveLength(0);
    expect(find(tags, "property", "article:modified_time")).toHaveLength(0);
    expect(content(tags, "property", "article:section")).toBe("CUDA");
  });
});

describe("description is optional and consistent across all three surfaces", () => {
  test("present: description, og:description and twitter:description agree", () => {
    const tags = head({ title: "T", description: "D" });
    expect(content(tags, "name", "description")).toBe("D");
    expect(content(tags, "property", "og:description")).toBe("D");
    expect(content(tags, "name", "twitter:description")).toBe("D");
  });

  test("absent: none of the three is emitted", () => {
    const tags = head({ title: "T" });
    for (const [key, value] of [
      ["name", "description"],
      ["property", "og:description"],
      ["name", "twitter:description"],
    ] as const) {
      expect(find(tags, key, value)).toHaveLength(0);
    }
  });
});

describe("the KaTeX stylesheet is linked only when asked for", () => {
  test("linked on a math page", () => {
    const tags = head({ title: "T", mathStylesheet: true });
    expect(find(tags, "rel", "stylesheet").map((t) => t.attrs.href)).toEqual([
      "/katex/katex.min.css",
    ]);
  });

  test("absent by default, so non-math pages stay CSS-clean", () => {
    expect(find(head({ title: "T" }), "rel", "stylesheet")).toHaveLength(0);
  });
});

describe("every tag is well-formed", () => {
  test("meta tags carry exactly one of name/property, plus content", () => {
    const tags = head({
      title: "T",
      description: "D",
      image: "/i.png",
      ogType: "article",
      publishedTime: new Date("2026-01-01"),
      tags: ["moe"],
      section: "Inference",
      mathStylesheet: true,
    });
    for (const t of tags.filter((t) => t.tag === "meta")) {
      expect(Number(!!t.attrs.name) + Number(!!t.attrs.property)).toBe(1);
      expect(typeof t.attrs.content).toBe("string");
    }
    for (const t of tags.filter((t) => t.tag === "link")) {
      expect(typeof t.attrs.href).toBe("string");
      expect(typeof t.attrs.rel).toBe("string");
    }
  });
});
