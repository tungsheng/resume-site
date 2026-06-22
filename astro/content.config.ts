import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { blogPostSchema } from "./content/blog-schema";

// Blog Posts are Markdown files in content/blog/<slug>.md (ADR-0001). The glob
// loader's entry id is the filename without extension — that IS the slug.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/blog" }),
  schema: blogPostSchema,
});

export const collections = { blog };
