// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";
import mdastAdmonitions from "./astro/markdown/mdast-admonitions.ts";
import mdastKatexMath from "./astro/markdown/mdast-katex-math.ts";
import hastBlogImages from "./astro/markdown/hast-blog-images.ts";
import hastKatexMath from "./astro/markdown/hast-katex-math.ts";

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
    // ADR-0004: adopt Astro 7's native Sätteri Markdown pipeline in place of
    // remark/rehype. Shiki stays at the markdown level — Astro 7 applies syntax
    // highlighting itself, independent of the engine (ADR-0004 decision 4).
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "github-dark" },
    // Sätteri GFM (incl. tables) is on by default; smartPunctuation is opt-in,
    // enabled here for parity with Astro 6's smartypants (ADR-0004 decision 6).
    // In-repo transforms run as Sätteri plugins (ADR-0004 decision 3):
    // admonition callouts and build-time KaTeX math (#32 / ADR-0006) via
    // mdastPlugins; blog-image figures + lazy/async attrs and the KaTeX
    // placeholder swap via hastPlugins. @astrojs/markdown-remark is intentionally
    // NOT installed — these are native Sätteri plugins.
    //
    // ADR-0006: features.math makes `$…$`/`$$…$$` significant pipeline-wide
    // (single-dollar inline stays on, the remark-math default — a literal dollar
    // in prose is escaped `\$`); mdast-katex-math renders the parsed math nodes to
    // static HTML+MathML at build time, keeping the zero-JS guarantee (ADR-0003).
    // It stashes the markup and emits a placeholder so KaTeX's HTML never hits a
    // re-parser; hast-katex-math swaps each placeholder back in as a verbatim raw
    // node (so the `<annotation>` TeX stays byte-clean — see mdast-katex-math.ts).
    processor: satteri({
      features: { gfm: true, smartPunctuation: true, math: true },
      mdastPlugins: [mdastAdmonitions, mdastKatexMath],
      hastPlugins: [hastBlogImages, hastKatexMath],
    }),
  },
});
