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
];
const DRAFT = { slug: "sizing-admission-queues", title: "Sizing Admission Queues Without Guessing" };

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
});
