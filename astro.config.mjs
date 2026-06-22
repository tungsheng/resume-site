// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkAdmonitions from "./astro/markdown/remark-admonitions.ts";
import rehypeBlogImages from "./astro/markdown/rehype-blog-images.ts";

// NOTE: ADR-0003 — the site is migrating to Astro zero-JS static output.
// During the migration the new Astro tree lives under ./astro so it does not
// collide with the existing Bun/React app in ./src. Once every page is ported
// and the Bun app is removed, srcDir flips back to the default ./src.
//
// `site` is the production origin — used for canonical URLs, the sitemap (#8/#9)
// and absolute RSS image URLs. No trailing slash (Astro convention).
export default defineConfig({
  site: "https://tonylee.bio",
  srcDir: "./astro",
  // Dedicated public dir during the migration: the default ./public still holds
  // the old Bun app's static HTML shells, which would otherwise shadow Astro's
  // generated pages. Flips back to ./public once the Bun app is removed (#12).
  publicDir: "./public-astro",
  output: "static",
  // Legacy paths from the pre-Astro site (the Notes prototype never shipped, but
  // these portfolio paths did). The /validation redirect targets the decisions
  // detail route, added with that slice.
  redirects: {
    "/project/cloud-inference-platform": "/projects/gpu-inference-lab",
    "/project/cloud-inference-platform/validation": "/decisions/gpu-inference-lab",
  },
  // Whole-site sitemap (#9): @astrojs/sitemap walks every built page and emits
  // sitemap-index.xml + sitemap-0.xml. Drafts never reach the build in prod
  // (getStaticPaths excludes them), so they can't appear here. Filter out the
  // legacy redirect stubs so the sitemap lists only canonical URLs.
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/project/cloud-inference-platform"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // ADR-0003 decision 6: Shiki highlighting matched to the dark code blocks.
    // GFM (incl. tables) is on by default. #6 adds in-repo transforms: GitHub
    // admonitions → callout panels (remark) and lazy/figure image handling (rehype).
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "github-dark" },
    remarkPlugins: [remarkAdmonitions],
    rehypePlugins: [rehypeBlogImages],
  },
});
