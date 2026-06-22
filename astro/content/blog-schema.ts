import { z } from "zod";

// Authored frontmatter for a Blog Post (ADR-0001 / CONTEXT.md vocabulary).
// Shared by the Astro content collection (astro/content.config.ts) and the unit
// tests so the schema is asserted directly, not only through the build.
export const POST_STATUSES = ["Outline", "Drafting", "Published"] as const;

export const blogPostSchema = z.object({
  title: z.string(),
  summary: z.string(),
  category: z.string(),
  status: z.enum(POST_STATUSES),
  published: z.coerce.date(),
  // optional — richer surfaces (#6/#7/#8) consume these later
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  cover: z.string().optional(),
  related: z
    .object({
      projects: z.array(z.string()).optional(),
      experiments: z.array(z.string()).optional(),
      decisions: z.array(z.string()).optional(),
    })
    .optional(),
});

export type BlogPostFrontmatter = z.infer<typeof blogPostSchema>;

// Derived (never authored): reading time from word count at ~220 wpm, min 1.
export function readingTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

// Blog index ordering: newest Post first by `published`. Generic over the
// collection entry shape so it is unit-testable without the Astro runtime.
export function sortByPublishedDesc<T extends { data: { published: Date } }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
}

// The home "Latest writing" slice (#10): the newest `limit` Posts. Non-mutating
// and generic so it is unit-testable without the Astro runtime.
export function selectLatest<T extends { data: { published: Date } }>(
  posts: T[],
  limit: number,
): T[] {
  return sortByPublishedDesc(posts).slice(0, limit);
}

// Auto table of contents (#7): Astro's render() returns headings as
// { depth, slug, text }. The TOC surfaces H2/H3 only, and the detail page shows
// it only once a Post has at least TOC_MIN_HEADINGS sections — short Posts get
// none. Pure + generic so the threshold is unit-testable without the Astro runtime.
export type PostHeading = { depth: number; slug: string; text: string };

export const TOC_MIN_HEADINGS = 3;

export function selectTocHeadings<T extends { depth: number }>(headings: T[]): T[] {
  return headings.filter((h) => h.depth === 2 || h.depth === 3);
}

export function shouldShowToc(headings: { depth: number }[]): boolean {
  return selectTocHeadings(headings).length >= TOC_MIN_HEADINGS;
}

// Post Status visibility (ADR-0003 §8): only Published Posts are public. In a
// production build, Outline/Drafting Posts are excluded entirely (no page in
// dist/); `astro dev` renders all statuses for preview. Single source of truth
// for both blog/index.astro and blog/[slug].astro.
export function isPostVisible(
  status: BlogPostFrontmatter["status"],
  isProd: boolean,
): boolean {
  return isProd ? status === "Published" : true;
}
