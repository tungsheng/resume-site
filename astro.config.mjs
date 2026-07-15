// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { satteri } from "@astrojs/markdown-satteri";
import mdastAdmonitions from "./astro/markdown/mdast-admonitions.ts";
import mdastKatexMath from "./astro/markdown/mdast-katex-math.ts";
import hastBlogImages from "./astro/markdown/hast-blog-images.ts";
import hastKatexMath from "./astro/markdown/hast-katex-math.ts";

// Legacy paths. The /project/* pair predates Astro; the /projects, /experiments
// and /decisions trees were the pre-consolidation work-section IA (Plan A):
// indexes collapse into /work, project / catalog / decision pages collapse into
// the consolidated /work/<project> pages. /experiments/<slug> leaf pages
// survive unchanged, so only the two per-project catalog URLs redirect here.
const redirects = {
  "/project/cloud-inference-platform": "/work/gpu-inference-lab",
  "/project/cloud-inference-platform/validation": "/work/gpu-inference-lab",
  "/projects": "/work",
  "/projects/gpu-inference-lab": "/work/gpu-inference-lab",
  "/projects/cuda-kernel-lab": "/work/cuda-kernel-lab",
  "/experiments": "/work",
  "/experiments/gpu-inference-lab": "/work/gpu-inference-lab",
  "/experiments/cuda-kernel-lab": "/work/cuda-kernel-lab",
  "/decisions": "/work",
  "/decisions/gpu-inference-lab": "/work/gpu-inference-lab",
  "/decisions/cuda-kernel-lab": "/work/cuda-kernel-lab",
};

// NOTE: ADR-0003 — Astro zero-JS static output. The Astro tree lives under
// ./astro (a deliberate keeper from the Bun→Astro migration: ./src holds the
// shared feature libraries — resume/PDF, work-section content — reached via
// the tsconfig path aliases, so srcDir stays ./astro and the trees don't mix).
// The old Bun app and its ./public HTML shells are gone; publicDir is the
// default ./public again.
//
// `site` is the production origin — used for canonical URLs, the sitemap (#8/#9)
// and absolute RSS image URLs. No trailing slash (Astro convention).
export default defineConfig({
  site: "https://tonylee.bio",
  srcDir: "./astro",
  output: "static",
  redirects,
  // Whole-site sitemap (#9): @astrojs/sitemap walks every built page and emits
  // sitemap-index.xml + sitemap-0.xml. Drafts never reach the build in prod
  // (getStaticPaths excludes them), so they can't appear here. Filter out the
  // redirect stubs so the sitemap lists only canonical URLs.
  integrations: [
    sitemap({
      filter: (page) => !(new URL(page).pathname.replace(/\/$/, "") in redirects),
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
