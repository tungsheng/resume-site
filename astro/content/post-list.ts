import type { PostEntry, BlogPostFrontmatter } from "./post";
import { isoDay, readingTimeMinutes, sortByPublishedDesc } from "./post";
import { toTagChips, type TagChip } from "./tag-registry";

// The Post-list Projection (CONTEXT.md): the one mapping from a collection
// entry to what the list surfaces render — PostList.astro, the /blog index, the
// tag pages, and the home "Latest writing" dates. Previously this mapping was
// copy-pasted across five .astro frontmatter blocks — where the unit suite
// can't reach — with the PostListItem shape hand-maintained in a sixth place.
// Pure + Astro-runtime-free, like the rest of astro/content.
//
// Its detail-surface twin is post-detail.ts. Helpers shared by both (the entry
// shape, isoDay) live in post.ts; helpers only one surface uses live
// with that surface's Projection.

// The entry shape is shared with the detail Projection.
export type PostListEntry = PostEntry;

export type PostListItem = {
  slug: string;
  data: BlogPostFrontmatter;
  minutes: number;
  iso: string;
  // Tags resolved to render-ready chips (ADR-0009). `data.tags` keeps the raw
  // authored slugs; `tagChips` is what a surface renders.
  tagChips: TagChip[];
};

// Newest first, with derived reading time and the ISO day for the meta rail.
export function toPostListItems(entries: PostListEntry[]): PostListItem[] {
  return sortByPublishedDesc(entries).map((entry) => ({
    slug: entry.id,
    data: entry.data,
    minutes: readingTimeMinutes(entry.body ?? ""),
    iso: isoDay(entry.data.published),
    tagChips: toTagChips(entry.data.tags),
  }));
}
