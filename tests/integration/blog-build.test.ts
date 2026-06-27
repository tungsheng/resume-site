import { describe, expect, test, beforeAll } from "bun:test";
import { $ } from "bun";

// Built-output assertions (PRD Seam 1) for Blog Status visibility (#5) and the
// index ordering (#4): a production `astro build` excludes drafts from dist/
// entirely. Gated behind RUN_INTEGRATION_TESTS because it runs a full build.
const RUN = process.env.RUN_INTEGRATION_TESTS === "1";
const itIf = RUN ? test : test.skip;

// Launch content (#29): a single Post is Published; everything else was demoted
// to Drafting/Outline for the blog launch, so the production build ships exactly
// one Post. The custom Sätteri transforms (admonition callouts #16, figure/lazy
// images #17) plus GFM tables and Shiki are exercised at the node level in the
// unit suite (tests/unit/blog-markdown.test.ts); here we assert they survive a
// real build and land in dist/ for the one Post that publishes.
const PUBLISHED = [
  { slug: "transformer-inference-prefill-and-decode", title: "LLM Inference: The Life of a Request" },
];

// status: Drafting — dev-only, excluded from a production build entirely.
const DRAFTS = [
  { slug: "prefix-cache-hit-rate-matters", title: "Why Prefix Cache Hit Rate Is the First Number to Check" },
  { slug: "continuous-batching-throughput", title: "Continuous Batching Changes What Throughput Means" },
  { slug: "kv-cache-is-the-batch-size-ceiling", title: "The KV Cache Is the Real Batch-Size Ceiling" },
  { slug: "sizing-admission-queues", title: "Sizing Admission Queues Without Guessing" },
];

// status: Outline — also dev-only; a production build emits no page and never
// references them anywhere public.
const OUTLINE = [
  { slug: "sglang-architecture-request-lifecycle-scheduler-prefix-cache", title: "SGLang Architecture Deep Dive" },
  { slug: "decode-process-deep-dive", title: "Decode Process Deep Dive" },
];

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
    expect(html).toContain('href="/projects/gpu-inference-lab"');
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
    for (const path of ["/", "/blog/", "/projects/", "/experiments/", "/decisions/", "/resume/"]) {
      expect(sitemap).toContain(`<loc>https://tonylee.bio${path}</loc>`);
    }
    for (const post of PUBLISHED) {
      expect(sitemap).toContain(`<loc>https://tonylee.bio/blog/${post.slug}/</loc>`);
    }
    for (const post of [...DRAFTS, ...OUTLINE]) expect(sitemap).not.toContain(post.slug);
    expect(sitemap).not.toContain("/project/cloud-inference-platform"); // redirect stub filtered
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
    for (const post of PUBLISHED) {
      expect(html).toContain(`href="/blog/${post.slug}"`);
    }
    for (const post of [...DRAFTS, ...OUTLINE]) {
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
