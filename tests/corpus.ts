import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  blogPostSchema,
  sortByPublishedDesc,
  type BlogPostFrontmatter,
} from "../astro/content/blog-schema";

// The Blog corpus, read from the Markdown on disk and partitioned by Status.
//
// The build suite used to carry a hand-typed list of every Published Post —
// slug and title — plus parallel DRAFTS and OUTLINE arrays, and iterate them
// across eight assertions. That made *writing a Post* edit a test: the file's
// own history reads draft X → publish X → draft Y → publish Y, which is how it
// became the most-churned source file in the repo. Worse, DRAFTS and OUTLINE
// were maintained by hand and therefore empty, so the one rule the suite exists
// to protect — Status visibility, ADR-0003 §8 — was asserted over nothing.
//
// Deriving from frontmatter fixes both: publishing touches no test code, and
// the draft assertions arm themselves the moment a Drafting Post exists.
//
// Frontmatter is validated through the real blogPostSchema rather than trusted
// as raw YAML, so this also asserts that every Post on disk is schema-valid,
// and `published` arrives coerced to a Date exactly as the content collection
// would deliver it.

export type CorpusPost = {
  slug: string;
  data: BlogPostFrontmatter;
};

export type Corpus = {
  /** Newest first — the order the /blog index and the feed render. */
  published: CorpusPost[];
  drafting: CorpusPost[];
  outline: CorpusPost[];
};

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

// The glob loader's entry id is the filename without extension — that IS the
// slug (astro/content.config.ts), so this mirrors how Astro keys the collection.
function readPost(dir: string, filename: string): CorpusPost {
  const raw = readFileSync(join(dir, filename), "utf8");
  const block = raw.match(FRONTMATTER)?.[1];
  if (block === undefined) throw new Error(`${filename}: no frontmatter block`);
  return {
    slug: filename.replace(/\.md$/, ""),
    data: blogPostSchema.parse(Bun.YAML.parse(block)),
  };
}

export function readCorpus(dir = "content/blog"): Corpus {
  const posts = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readPost(dir, f));

  const byStatus = (status: BlogPostFrontmatter["status"]) =>
    sortByPublishedDesc(posts.filter((p) => p.data.status === status));

  return {
    published: byStatus("Published"),
    drafting: byStatus("Drafting"),
    outline: byStatus("Outline"),
  };
}
