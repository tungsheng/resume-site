import { describe, expect, test, beforeAll } from "bun:test";
import { $ } from "bun";

// Built-output assertions (PRD Seam 1) for Blog Status visibility (#5) and the
// index ordering (#4): a production `astro build` excludes drafts from dist/
// entirely. Gated behind RUN_INTEGRATION_TESTS because it runs a full build.
const RUN = process.env.RUN_INTEGRATION_TESTS === "1";
const itIf = RUN ? test : test.skip;

const PUBLISHED = [
  { slug: "prefix-cache-hit-rate-matters", title: "Why Prefix Cache Hit Rate Is the First Number to Check" },
  { slug: "continuous-batching-throughput", title: "Continuous Batching Changes What Throughput Means" },
  { slug: "kv-cache-is-the-batch-size-ceiling", title: "The KV Cache Is the Real Batch-Size Ceiling" },
];
const DRAFT = { slug: "sizing-admission-queues", title: "Sizing Admission Queues Without Guessing" };

// The two seed notes migrated to Markdown at status: Outline (#11) — dev-only,
// so a production build must emit no page and never reference them.
const OUTLINE = [
  { slug: "sglang-architecture-request-lifecycle-scheduler-prefix-cache", title: "SGLang Architecture Deep Dive" },
  { slug: "decode-process-deep-dive", title: "Decode Process Deep Dive" },
];

// The rich-markdown showcase Post (#6) exercises an admonition, a GFM table, and
// a self-hosted image; the assertions below check the rendered HTML + the copied
// asset. Keep its index position out of the ordering assertion (uses [0]/[1]).
const RICH = {
  slug: "kv-cache-is-the-batch-size-ceiling",
  asset: "assets/blog/kv-cache-is-the-batch-size-ceiling/kv-cache-layout.svg",
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

  itIf("lists every Published Post on the index, newest-first", () => {
    for (const post of PUBLISHED) expect(indexHtml).toContain(post.title);
    const newer = indexHtml.indexOf(PUBLISHED[1]!.title); // 2026-06-20
    const older = indexHtml.indexOf(PUBLISHED[0]!.title); // 2026-06-18
    expect(newer).toBeLessThan(older);
  });

  itIf("builds a detail page for each Published Post", async () => {
    for (const post of PUBLISHED) {
      const html = await Bun.file(`dist/blog/${post.slug}/index.html`).text();
      expect(html).toContain(post.title);
    }
  });

  itIf("excludes the draft from the index and emits no draft page", async () => {
    expect(indexHtml).not.toContain(DRAFT.title);
    expect(await Bun.file(`dist/blog/${DRAFT.slug}/index.html`).exists()).toBe(false);
  });

  // Issue #6 / ADR-0004: GFM tables, admonition callouts, and self-hosted images
  // render under the Astro 7 Sätteri pipeline. Admonitions are a Sätteri mdast
  // plugin (#16); the figure/lazy-image behavior is a hast plugin ported in #17.
  itIf("renders admonition callouts and a GFM table", async () => {
    const html = await Bun.file(`dist/blog/${RICH.slug}/index.html`).text();
    expect(html).toContain('class="callout callout-note"');
    expect(html).toContain('class="callout callout-warning"');
    expect(html).toContain('class="callout-title"');
    expect(html).toContain("<table>");
    expect(html).toContain(`src="/${RICH.asset}"`);
  });

  // TODO(#17): un-skip once the blog-image (hast) transform is ported onto
  // Sätteri's plugin API. Until then Sätteri renders a lone image as a bare
  // <img> with no <figure> wrap and no lazy/async attributes.
  test.skip("wraps lone images in lazy figures", async () => {
    const html = await Bun.file(`dist/blog/${RICH.slug}/index.html`).text();
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain("<figure");
    expect(html).toContain("<figcaption>");
  });

  itIf("copies the self-hosted blog image into dist/", async () => {
    expect(await Bun.file(`dist/${RICH.asset}`).exists()).toBe(true);
  });

  // Issue #7: metadata surfaces — auto-TOC past the threshold, an "Updated"
  // date when later than published, and resolved related links.
  itIf("renders a TOC, related links, and an Updated date on a rich Post", async () => {
    const html = await Bun.file(`dist/blog/${RICH.slug}/index.html`).text();
    expect(html).toContain('class="post-toc"'); // 3 headings ≥ threshold
    expect(html).toContain("On this page");
    expect(html).toContain("Updated"); // updated (2026-06-22) > published (2026-06-21)
    expect(html).toContain('class="post-related"');
    expect(html).toContain('href="/projects/gpu-inference-lab"');
    expect(html).toContain('href="/experiments/kv-cache"');
    expect(html).toContain('href="/decisions/gpu-inference-lab"');
  });

  itIf("omits the TOC and related block on a short standalone Post", async () => {
    // continuous-batching has 2 headings and no `related` frontmatter.
    const html = await Bun.file("dist/blog/continuous-batching-throughput/index.html").text();
    expect(html).not.toContain('class="post-toc"');
    expect(html).not.toContain('class="post-related"');
  });

  // Issue #8: per-Post SEO head — canonical, OG, article:*, twitter:card, and
  // og:image from the Post `cover`.
  itIf("emits article SEO head tags on a Post detail page", async () => {
    const html = await Bun.file(`dist/blog/${RICH.slug}/index.html`).text();
    expect(html).toContain("<title>The KV Cache Is the Real Batch-Size Ceiling | Tony Lee</title>");
    expect(html).toContain('name="description"');
    expect(html).toContain(`rel="canonical" href="https://tonylee.bio/blog/${RICH.slug}/"`);
    expect(html).toContain('property="og:type" content="article"');
    expect(html).toContain(`property="og:url" content="https://tonylee.bio/blog/${RICH.slug}/"`);
    expect(html).toContain('property="article:published_time" content="2026-06-21T00:00:00.000Z"');
    expect(html).toContain('property="article:modified_time" content="2026-06-22T00:00:00.000Z"');
    expect(html).toContain('property="article:section" content="Inference internals"');
    expect(html).toContain('property="article:tag"');
    expect(html).toContain("twitter:card");
    // og:image resolved from `cover` to an absolute, same-origin URL.
    expect(html).toContain(`property="og:image" content="https://tonylee.bio/${RICH.asset}"`);
  });

  itIf("uses og:type=website with no article tags on non-blog pages", async () => {
    const html = await Bun.file("dist/index.html").text();
    expect(html).toContain('rel="canonical" href="https://tonylee.bio/"');
    expect(html).toContain('property="og:type" content="website"');
    expect(html).not.toContain('property="og:type" content="article"');
    expect(html).not.toContain("article:published_time");
  });

  // Issue #9: RSS full-content feed — Published-only, newest-first, full body
  // with absolute image URLs, draft excluded.
  itIf("emits an RSS 2.0 full-content feed, Published-only newest-first", async () => {
    const rss = await Bun.file("dist/rss.xml").text();
    expect(rss).toContain('<rss version="2.0"');
    for (const post of PUBLISHED) expect(rss).toContain(`<title>${post.title}</title>`);

    // newest-first: kv-cache (06-21) before continuous (06-20) before prefix (06-18)
    const kv = rss.indexOf("The KV Cache Is the Real Batch-Size Ceiling");
    const cont = rss.indexOf("Continuous Batching Changes What Throughput Means");
    const prefix = rss.indexOf("Why Prefix Cache Hit Rate Is the First Number to Check");
    expect(kv).toBeLessThan(cont);
    expect(cont).toBeLessThan(prefix);

    // full content (not just summary): rendered body markup + a heading carry
    // through, and the #6 self-hosted image is absolutized to the origin. The
    // admonition callout (Sätteri mdast plugin, #16) renders into the feed body.
    expect(rss).toContain("callout callout-note");
    expect(rss).toContain("Compute is rarely what runs out first");
    expect(rss).toContain(`https://tonylee.bio/${RICH.asset}`);

    expect(rss).not.toContain(DRAFT.title);
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
    expect(sitemap).not.toContain(DRAFT.slug);
    expect(sitemap).not.toContain("/project/cloud-inference-platform"); // redirect stub filtered
  });

  // Issue #9: robots points crawlers at the sitemap.
  itIf("emits robots.txt referencing the sitemap", async () => {
    const robots = await Bun.file("dist/robots.txt").text();
    expect(robots).toContain("Sitemap: https://tonylee.bio/sitemap-index.xml");
  });

  // Issue #10: the home page bakes a "Latest writing" section into static HTML —
  // newest Published Posts linking into the blog, no draft, no client fetch.
  itIf("bakes a 'Latest writing' section into the home page, newest-first", async () => {
    const html = await Bun.file("dist/index.html").text();
    expect(html).toContain("Latest writing");
    for (const post of PUBLISHED) {
      expect(html).toContain(`href="/blog/${post.slug}"`);
    }
    // newest-first: kv-cache (06-21) before continuous (06-20) before prefix (06-18)
    const kv = html.indexOf("/blog/kv-cache-is-the-batch-size-ceiling");
    const cont = html.indexOf("/blog/continuous-batching-throughput");
    const prefix = html.indexOf("/blog/prefix-cache-hit-rate-matters");
    expect(kv).toBeLessThan(cont);
    expect(cont).toBeLessThan(prefix);

    expect(html).not.toContain(DRAFT.title);
    expect(html).not.toContain(`/blog/${DRAFT.slug}`);
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
