import { describe, expect, test, beforeAll } from "bun:test";
import { $ } from "bun";

// Built-output assertions (PRD Seam 1) for Blog Status visibility (#5) and the
// index ordering (#4): a production `astro build` excludes drafts from dist/
// entirely. Gated behind RUN_INTEGRATION_TESTS because it runs a full build.
const RUN = process.env.RUN_INTEGRATION_TESTS === "1";
const itIf = RUN ? test : test.skip;

// Every Published Post ships in the production build, newest first. The custom
// Sätteri transforms (admonition callouts #16, figure/lazy images #17) plus GFM
// tables and Shiki are exercised at the node level in the unit suite
// (tests/unit/blog-markdown.test.ts); here we assert they survive a real build
// and land in dist/. Keep this list newest-first — LATEST below slices it.
const PUBLISHED = [
  { slug: "scheduling-continuous-batching-paged-attention", title: "Scheduling: How Continuous Batching and Paged Attention Fill a GPU" },
  { slug: "moe-routing", title: "MoE: How the Mixture of Experts Routes a Token" },
  { slug: "why-transformers-need-the-mlp", title: "MLP: Why Transformers Need the Multilayer Perceptron" },
  { slug: "attention-how-to-shrink-it", title: "Attention, and How to Shrink It" },
  { slug: "attention-from-first-principles", title: "Attention, from First Principles" },
  { slug: "transformer-inference-prefill-and-decode", title: "LLM Inference: The Life of a Request" },
];

// The home "Latest writing" slice (#10) shows only the newest LATEST_COUNT (3,
// astro/pages/index.astro) Posts; older Published Posts live on /blog/ only.
const LATEST = PUBLISHED.slice(0, 3);
const OLDER_PUBLISHED = PUBLISHED.slice(3);

// status: Drafting — dev-only, excluded from a production build entirely.
// The corpus currently has no Drafting Posts (the 2026-07 stubs were retired),
// so these assertions are vacuous until the next draft lands — add it here.
const DRAFTS: { slug: string; title: string }[] = [];

// status: Outline — also dev-only; a production build emits no page and never
// references them anywhere public. Currently empty, same as DRAFTS.
const OUTLINE: { slug: string; title: string }[] = [];

// The launch Post exercises the rich pipeline end-to-end: an admonition callout
// (mdast plugin, #16), self-hosted figures with lazy/async images (hast plugin,
// #17), an auto-TOC past the heading threshold, and resolved related links. Its
// assets live under assets/blog/<slug>/.
const RICH = {
  slug: "transformer-inference-prefill-and-decode",
  title: "LLM Inference: The Life of a Request",
  asset: "assets/blog/transformer-inference-prefill-and-decode/request-lifecycle.svg",
};

describe("blog production build output", () => {
  let indexHtml = "";

  beforeAll(async () => {
    if (!RUN) return;
    // Force a production build: `bun test` sets NODE_ENV=test, which Astro/Vite
    // would otherwise treat as non-production (import.meta.env.PROD === false),
    // leaving drafts in. NODE_ENV=production makes import.meta.env.PROD true.
    await $`bunx astro build`.env({ ...process.env, NODE_ENV: "production" }).quiet();
    indexHtml = await Bun.file("dist/blog/index.html").text();
  });

  itIf("lists every Published Post on the index and omits drafts/outlines", () => {
    for (const post of PUBLISHED) expect(indexHtml).toContain(post.title);
    for (const post of [...DRAFTS, ...OUTLINE]) expect(indexHtml).not.toContain(post.title);
  });

  itIf("builds a detail page for each Published Post", async () => {
    for (const post of PUBLISHED) {
      const html = await Bun.file(`dist/blog/${post.slug}/index.html`).text();
      expect(html).toContain(post.title);
    }
  });

  itIf("excludes every draft from the index and emits no draft page", async () => {
    for (const post of DRAFTS) {
      expect(indexHtml).not.toContain(post.title);
      expect(await Bun.file(`dist/blog/${post.slug}/index.html`).exists()).toBe(false);
    }
  });

  // Issue #6 / ADR-0004: rich Markdown renders under the Astro 7 Sätteri
  // pipeline — admonition callouts (mdast plugin, #16) and figure/lazy images
  // (hast plugin, #17). GFM tables, Shiki, and the warning callout tone aren't
  // present in the single launch Post; their rendering is covered node-by-node
  // in tests/unit/blog-markdown.test.ts.
  itIf("renders an admonition callout and lazy figure images via the Sätteri plugins", async () => {
    const html = await Bun.file(`dist/blog/${RICH.slug}/index.html`).text();
    expect(html).toContain('class="callout callout-note"');
    expect(html).toContain('class="callout-title"');
    expect(html).toContain(`src="/${RICH.asset}"`);
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain("<figure");
    expect(html).toContain("<figcaption>");
  });

  itIf("copies the self-hosted blog image into dist/", async () => {
    expect(await Bun.file(`dist/${RICH.asset}`).exists()).toBe(true);
  });

  // Issue #7: metadata surfaces — auto-TOC past the heading threshold and
  // resolved related links. (The launch Post has no `updated` date, so the
  // "Updated" surface isn't exercised here; that path is unit-tested.)
  itIf("renders a TOC and resolved related links on the launch Post", async () => {
    const html = await Bun.file(`dist/blog/${RICH.slug}/index.html`).text();
    expect(html).toContain('class="post-toc"'); // 5 headings ≥ threshold
    expect(html).toContain("On this page");
    expect(html).toContain('class="post-related"');
    // Posts no longer declare related.projects (the same lab project on every
    // Post was boilerplate); the related surface carries experiments only.
    expect(html).not.toContain('href="/work/gpu-inference-lab"');
    expect(html).toContain('href="/experiments/prefill-decode"');
  });

  // Issue #8: per-Post SEO head — canonical, OG, article:*, twitter:card. The
  // launch Post has no `cover`, so no og:image, and no `updated`, so no
  // article:modified_time.
  itIf("emits article SEO head tags on a Post detail page", async () => {
    const html = await Bun.file(`dist/blog/${RICH.slug}/index.html`).text();
    expect(html).toContain(`<title>${RICH.title} | Tony Lee</title>`);
    expect(html).toContain('name="description"');
    expect(html).toContain(`rel="canonical" href="https://tonylee.bio/blog/${RICH.slug}/"`);
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain(`property="og:url" content="https://tonylee.bio/blog/${RICH.slug}/"`);
    expect(html).toContain('property="article:published_time" content="2026-06-24T00:00:00.000Z"');
    expect(html).toContain('property="article:section" content="Inference"');
    expect(html).toContain('property="article:tag"');
    expect(html).toContain("twitter:card");
  });

  itIf("uses og:type=website with no article tags on non-blog pages", async () => {
    const html = await Bun.file("dist/index.html").text();
    expect(html).toContain('rel="canonical" href="https://tonylee.bio/"');
    expect(html).toContain('property="og:type" content="website"');
    expect(html).not.toContain('property="og:type" content="article"');
    expect(html).not.toContain("article:published_time");
  });

  // Issue #9: RSS full-content feed — Published-only, full body with absolute
  // image URLs, drafts excluded.
  itIf("emits an RSS 2.0 full-content feed, Published-only", async () => {
    const rss = await Bun.file("dist/rss.xml").text();
    expect(rss).toContain('<rss version="2.0"');
    for (const post of PUBLISHED) expect(rss).toContain(`<title>${post.title}</title>`);

    // full content (not just summary): the rendered admonition callout (Sätteri
    // mdast plugin, #16) and a body phrase carry through, and the #6 self-hosted
    // image is absolutized to the origin.
    expect(rss).toContain("callout callout-note");
    expect(rss).toContain("memory bandwidth");
    expect(rss).toContain(`https://tonylee.bio/${RICH.asset}`);

    for (const post of [...DRAFTS, ...OUTLINE]) expect(rss).not.toContain(post.title);
  });

  // Issue #9: whole-site sitemap lists every public page + Published Post, no
  // drafts and no legacy redirect stubs.
  itIf("emits a sitemap covering public pages and Published Posts", async () => {
    expect(await Bun.file("dist/sitemap-index.xml").exists()).toBe(true);
    const sitemap = await Bun.file("dist/sitemap-0.xml").text();
    for (const path of ["/", "/blog/", "/work/", "/work/gpu-inference-lab/", "/resume/"]) {
      expect(sitemap).toContain(`<loc>https://tonylee.bio${path}</loc>`);
    }
    for (const post of PUBLISHED) {
      expect(sitemap).toContain(`<loc>https://tonylee.bio/blog/${post.slug}/</loc>`);
    }
    for (const post of [...DRAFTS, ...OUTLINE]) expect(sitemap).not.toContain(post.slug);
    // Redirect stubs are filtered — legacy paths and the pre-consolidation IA.
    expect(sitemap).not.toContain("/project/cloud-inference-platform");
    for (const stub of ["/projects/", "/decisions/", "/experiments/</loc>"]) {
      expect(sitemap).not.toContain(`<loc>https://tonylee.bio${stub}`);
    }
  });

  // #48 / ADR-0008 decision 2: static tag pages are the canonical tag surface.
  itIf("builds the /blog/tags overview with display labels and counts", async () => {
    const html = await Bun.file("dist/blog/tags/index.html").text();
    expect(html).toContain('href="/blog/tags/kv-cache"');
    expect(html).toContain("KV cache"); // display label, not the slug
    expect(html).toContain("4 posts"); // kv-cache count across the corpus
    expect(html).toContain('href="/blog/tags/swiglu"');
    expect(html).toContain("1 post");
  });

  itIf("builds a tag page listing exactly the Posts carrying the tag", async () => {
    const html = await Bun.file("dist/blog/tags/kv-cache/index.html").text();
    for (const slug of [
      "scheduling-continuous-batching-paged-attention",
      "attention-how-to-shrink-it",
      "attention-from-first-principles",
      "transformer-inference-prefill-and-decode",
    ]) {
      expect(html).toContain(`href="/blog/${slug}"`);
    }
    expect(html).not.toContain("why-transformers-need-the-mlp"); // no kv-cache tag
  });

  itIf("links tag chips (display labels) from the blog index and the Post detail page", async () => {
    expect(indexHtml).toContain('href="/blog/tags/kv-cache"');
    expect(indexHtml).toContain(">KV cache</a>"); // chip renders the label
    const postHtml = await Bun.file("dist/blog/why-transformers-need-the-mlp/index.html").text();
    expect(postHtml).toContain('href="/blog/tags/mlp"');
    expect(postHtml).toContain('href="/blog/tags/swiglu"');
    expect(postHtml).toContain(">SwiGLU</a>");
  });

  itIf("lists tag pages in the sitemap", async () => {
    const sitemap = await Bun.file("dist/sitemap-0.xml").text();
    expect(sitemap).toContain("<loc>https://tonylee.bio/blog/tags/</loc>");
    expect(sitemap).toContain("<loc>https://tonylee.bio/blog/tags/kv-cache/</loc>");
  });

  // Issue #9: robots points crawlers at the sitemap.
  itIf("emits robots.txt referencing the sitemap", async () => {
    const robots = await Bun.file("dist/robots.txt").text();
    expect(robots).toContain("Sitemap: https://tonylee.bio/sitemap-index.xml");
  });

  // Issue #10: the home page bakes a "Latest writing" section into static HTML —
  // Published Posts linking into the blog, no draft, no client fetch.
  itIf("bakes a 'Latest writing' section into the home page", async () => {
    const html = await Bun.file("dist/index.html").text();
    expect(html).toContain("Latest writing");
    for (const post of LATEST) {
      expect(html).toContain(`href="/blog/${post.slug}"`);
    }
    for (const post of [...OLDER_PUBLISHED, ...DRAFTS, ...OUTLINE]) {
      expect(html).not.toContain(post.title);
      expect(html).not.toContain(`/blog/${post.slug}`);
    }
  });

  // Issue #11: the migrated seed notes are Outline — excluded from the prod build
  // exactly like a draft (no page, and unreferenced anywhere public).
  itIf("emits no page for Outline seed Posts and never references them", async () => {
    const sitemap = await Bun.file("dist/sitemap-0.xml").text();
    const home = await Bun.file("dist/index.html").text();
    const rss = await Bun.file("dist/rss.xml").text();
    for (const post of OUTLINE) {
      expect(await Bun.file(`dist/blog/${post.slug}/index.html`).exists()).toBe(false);
      expect(indexHtml).not.toContain(post.title);
      expect(sitemap).not.toContain(post.slug);
      expect(home).not.toContain(post.slug);
      expect(rss).not.toContain(post.title);
    }
  });
});

// #32 / ADR-0006: build-time KaTeX math. The published attention post carries
// inline + display math, so it is the math target here. The render helper is
// unit-tested in tests/unit/blog-markdown.test.ts (the `\$` escaped-dollar
// convention is covered there too). This suite runs its own build, after the
// production-build suite above; Bun completes a describe before the next one's
// beforeAll, so the rebuild that clobbers dist/ is safe.
describe("build-time KaTeX math output (ADR-0006)", () => {
  const MATH_SLUG = "attention-from-first-principles";
  let mathHtml = "";

  beforeAll(async () => {
    if (!RUN) return;
    // The math target is a Published Post, so a normal production build renders it
    // (and this is the markup that actually ships).
    await $`bunx astro build`.env({ ...process.env, NODE_ENV: "production" }).quiet();
    mathHtml = await Bun.file(`dist/blog/${MATH_SLUG}/index.html`).text();
  });

  itIf("renders inline and display math to static KaTeX markup", () => {
    expect(mathHtml).toContain('class="katex"'); // inline + display both wrap in .katex
    expect(mathHtml).toContain("katex-display"); // $$…$$ becomes a display block
    expect(mathHtml).toContain("<math"); // htmlAndMathml: MathML rides along (a11y)
    // No unrendered math leaks through: the mdast plugin must consume the math
    // before the hast/Shiki phase, so no `language-math` code block survives.
    expect(mathHtml).not.toContain("language-math");
    expect(mathHtml).not.toContain("math-display");
  });

  // ADR-0006: the on-page MathML `<annotation>` carries the raw TeX byte-for-byte
  // (copy-as-LaTeX / MathML-source consumers). The plugins inject KaTeX's HTML as a
  // verbatim raw node so Sätteri's `{ raw }` Markdown re-parse never mangles it —
  // no eaten `\!`, no JSX-escaped `{` (`{‘{’}`). Guards the fix end-to-end.
  itIf("keeps the on-page <annotation> TeX byte-clean (no eaten \\! or escaped braces)", () => {
    expect(mathHtml).toContain(
      '<annotation encoding="application/x-tex">\\mathrm{Attention}(Q, K, V) = \\mathrm{softmax}\\!\\left(\\frac{Q K^\\top}{\\sqrt{d_\\text{head}}}\\right) V</annotation>',
    );
    expect(mathHtml).not.toContain("{‘{’}"); // no leftover JSX brace-escaping
    expect(mathHtml).not.toContain("<!--katex:"); // every placeholder was swapped
  });

  itIf("ships zero client JavaScript on a math page (KaTeX is build-time only)", () => {
    expect(mathHtml).not.toContain("<script");
  });

  // #33 / ADR-0006 decision 3: the self-hosted stylesheet links only on math
  // Posts; non-math Posts and portfolio pages stay CSS-clean.
  itIf("links the KaTeX stylesheet on a math Post", () => {
    expect(mathHtml).toContain('href="/katex/katex.min.css"');
  });

  itIf("links NO KaTeX stylesheet on a non-math Post or a portfolio page", async () => {
    // The launch Post (Published, no math) and the home page must stay clean.
    const launchHtml = await Bun.file(`dist/blog/${RICH.slug}/index.html`).text();
    const homeHtml = await Bun.file("dist/index.html").text();
    const workHtml = await Bun.file("dist/work/index.html").text();
    for (const html of [launchHtml, homeHtml, workHtml]) {
      expect(html).not.toContain("katex.min.css");
    }
  });

  // #33: the vendored stylesheet and WOFF2 fonts ship to dist/ (self-hosted,
  // CSP-clean — font-src 'self'). The CSS references fonts/ relatively, so it
  // sits alongside its fonts under /katex/.
  itIf("ships the vendored KaTeX CSS and WOFF2 fonts to dist/", async () => {
    expect(await Bun.file("dist/katex/katex.min.css").exists()).toBe(true);
    expect(await Bun.file("dist/katex/fonts/KaTeX_Main-Regular.woff2").exists()).toBe(true);
    expect(await Bun.file("dist/katex/fonts/KaTeX_Math-Italic.woff2").exists()).toBe(true);
  });

  // #34 / ADR-0006 decision 4: the feed (no KaTeX stylesheet) degrades math to
  // raw TeX. The published attention post carries the math in this feed.
  itIf("degrades math to raw TeX in the RSS feed, not CSS-less KaTeX markup", async () => {
    const rss = await Bun.file("dist/rss.xml").text();
    expect(rss).toContain("$Q = X W_q$"); // inline math, degraded to readable source
    expect(rss).toContain("\\mathrm{Attention}(Q, K, V)"); // display TeX, braces un-escaped
    expect(rss).not.toContain('class="katex"'); // no glyph-soup KaTeX HTML…
    expect(rss).not.toContain("katex-mathml"); // …and no orphaned MathML
    expect(rss).not.toContain("{‘{’}"); // …and no leftover JSX brace-escaping
    expect(rss).toContain('<rss version="2.0"'); // still a valid feed
  });
});
