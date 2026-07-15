import type { BlogPostFrontmatter } from "./blog-schema";
import { readingTimeMinutes, sortByPublishedDesc } from "./blog-schema";

// The Post-list view-model: the one projection from a collection entry to what
// the list surfaces render (PostList.astro, the /blog index, the tag pages, the
// home "Latest writing" dates, and the Post detail meta line). Previously this
// mapping was copy-pasted across five .astro frontmatter blocks — where the
// unit suite can't reach — with the PostListItem shape hand-maintained in a
// sixth place. Pure + Astro-runtime-free, like the rest of astro/content.

// Structural subset of Astro's CollectionEntry<"blog"> so callers and tests
// don't need the generated astro:content types.
export type PostListEntry = {
  id: string;
  body?: string;
  data: BlogPostFrontmatter;
};

export type PostListItem = {
  slug: string;
  data: BlogPostFrontmatter;
  minutes: number;
  iso: string;
};

// Dates are authored as plain UTC calendar days — slice the ISO string directly
// so no local timezone can shift the day (the off-by-one four page comments
// used to warn about, now in one place).
export function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// Newest first, with derived reading time and the ISO day for the meta rail.
export function toPostListItems(entries: PostListEntry[]): PostListItem[] {
  return sortByPublishedDesc(entries).map((entry) => ({
    slug: entry.id,
    data: entry.data,
    minutes: readingTimeMinutes(entry.body ?? ""),
    iso: isoDay(entry.data.published),
  }));
}

// The "Updated" surface (#7) shows only when `updated` is meaningfully later
// than `published`; returns the ISO day to render, or null to render nothing.
export function updatedIsoDay(published: Date, updated: Date | undefined): string | null {
  return updated && updated.getTime() > published.getTime() ? isoDay(updated) : null;
}
