import type { BlogPostFrontmatter, PostEntry, PostHeading } from "./blog-schema";
import { isoDay, readingTimeMinutes, selectTocHeadings, shouldShowToc } from "./blog-schema";
import { resolveRelatedLinks, type RelatedLink } from "./related-links";
import { toTagChips, type TagChip } from "./tag-registry";
import { hasMathDelimiter } from "../markdown/detect-math";

// The Post-detail Projection (CONTEXT.md): the one mapping from a collection
// entry to what /blog/<slug> renders — the twin of post-list.ts, for the
// surface that shows a single Post in full. Pure + Astro-runtime-free, so the
// composition is unit-testable; `headings` is passed in rather than obtained
// here because Astro's render() lives behind `astro:content`, which resolves
// only inside the build (see PostEntry in blog-schema.ts).
//
// This replaces eight derivations hand-wired in [slug].astro's frontmatter,
// where no unit test could reach them. Each individual rule was already
// covered — what was not covered, and is now, is that the right rule reaches
// the right field.
//
// The Projection owns what the Post decides. What the *site* decides — the
// "| Tony Lee" title suffix, the breadcrumb trail — stays in the page.

// The entry shape is shared with the list Projection.
export type PostDetailEntry = PostEntry;

export type PostDetail = {
  slug: string;
  data: BlogPostFrontmatter;
  minutes: number;
  iso: string;
  // The "Updated" surface (#7) in its two consumed forms, from ONE predicate:
  // the byline day, and the article:modified_time value. They were previously
  // derived independently — updatedIsoDay() here, `updatedLabel ? updated :
  // undefined` in the JSX — which is two chances to disagree about the same
  // rule. Deriving both here means they cannot.
  updatedIso: string | null;
  modifiedTime: Date | undefined;
  hasMath: boolean;
  // Tags resolved to render-ready chips (ADR-0009). `data.tags` keeps the raw
  // authored slugs; `tagChips` is what the page renders.
  tagChips: TagChip[];
  toc: PostHeading[];
  showToc: boolean;
  related: RelatedLink[];
};

// The "Updated" rule (#7): a Post shows an Updated day only when `updated` is
// meaningfully later than `published`. Returns the ISO day to render, or null
// to render nothing. Lives here because the detail surface is its only
// consumer — no list surface shows an Updated day.
export function updatedIsoDay(published: Date, updated: Date | undefined): string | null {
  return updated && updated.getTime() > published.getTime() ? isoDay(updated) : null;
}

export function toPostDetail(entry: PostDetailEntry, headings: PostHeading[]): PostDetail {
  const body = entry.body ?? "";
  const { published, updated } = entry.data;
  const updatedIso = updatedIsoDay(published, updated);

  return {
    slug: entry.id,
    data: entry.data,
    minutes: readingTimeMinutes(body),
    iso: isoDay(published),
    updatedIso,
    // Gated on the SAME predicate as the byline, not re-tested: no Updated day
    // means no article:modified_time.
    modifiedTime: updatedIso ? updated : undefined,
    // Scan the raw source rather than trust a frontmatter flag (#33 /
    // ADR-0006) — math present ⇒ KaTeX CSS linked, by construction.
    hasMath: hasMathDelimiter(body),
    tagChips: toTagChips(entry.data.tags),
    toc: selectTocHeadings(headings),
    showToc: shouldShowToc(headings),
    // Empty for standalone Posts; author typos in an id are skipped, not fatal.
    related: resolveRelatedLinks(entry.data.related),
  };
}
