import { describe, expect, test } from "bun:test";
import { readCorpus } from "../corpus";

// The build suite derives its expectations from this reader, so the reader
// itself needs to be trustworthy. It runs against a fixture directory rather
// than content/blog so the Status partitioning is PROVEN even while the real
// corpus happens to hold no Drafting or Outline Posts — which is exactly the
// hole the hand-maintained DRAFTS/OUTLINE arrays left: empty, and asserting
// nothing, until someone remembered a manual step.

const FIXTURES = "tests/unit/fixtures/corpus";

describe("readCorpus", () => {
  test("partitions the corpus by Status", () => {
    const corpus = readCorpus(FIXTURES);
    expect(corpus.published.map((p) => p.slug)).toEqual([
      "published-newer",
      "published-older",
    ]);
    expect(corpus.drafting.map((p) => p.slug)).toEqual(["a-draft"]);
    expect(corpus.outline.map((p) => p.slug)).toEqual(["an-outline"]);
  });

  test("orders each bucket newest-first, like the index and the feed", () => {
    const { published } = readCorpus(FIXTURES);
    expect(published[0]?.data.published.getTime()).toBeGreaterThan(
      published[1]!.data.published.getTime(),
    );
  });

  test("derives the slug from the filename, as the glob loader does", () => {
    expect(readCorpus(FIXTURES).drafting[0]?.slug).toBe("a-draft");
  });

  test("parses frontmatter through the real schema, coercing published to a Date", () => {
    const post = readCorpus(FIXTURES).published[0];
    expect(post?.data.published).toBeInstanceOf(Date);
    expect(post?.data.title).toBe("Newer Published Post");
    expect(post?.data.tags).toEqual(["kv-cache"]);
  });

  test("every Post in the real corpus is schema-valid", () => {
    // readCorpus throws on an invalid frontmatter block, so reaching the
    // assertion is the assertion.
    const corpus = readCorpus();
    expect(corpus.published.length).toBeGreaterThan(0);
  });
});
