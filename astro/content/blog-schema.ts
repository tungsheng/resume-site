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
