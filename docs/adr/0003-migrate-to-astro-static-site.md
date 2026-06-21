# Migrate the whole site to Astro: zero-JS static output, Tailwind, build-time PDF, CDN-hosted

Status: accepted (supersedes ADR-0002)

We are migrating the entire site off the Bun.serve + client-rendered-React + MUI/Emotion stack (with an SSR blog "island") to **Astro with zero-JavaScript static output**: Tailwind for styling (dropping MUI and Emotion entirely), Markdown Posts via Astro **content collections**, the resume PDF generated once at **build time**, and the resulting `dist/` deployed as static files to **Cloudflare Pages**. This reverses ADR-0002's request-time-SSR-on-a-long-running-Bun-server model in favour of a static build, and is the "revisit later" that ADR-0002 explicitly deferred when it kept the MUI mobile-nav `useState` rather than do a zero-JS render. ADR-0001 (Posts authored as Markdown, MDX off) is **preserved** — only its implementation changes.

## Decisions (the resolved design tree)

1. **Scope & sequencing** — Halt the in-flight Bun-SSR blog (the uncommitted `feat/blog` tracer bullet for issue #3) and migrate the whole site at once, rebuilding the blog natively in Astro. The in-flight SSR plumbing (`post-loader`, `render-post-html`, `blog-post` route, the startup client bundle) is the least-sunk cost to discard; the Markdown content and frontmatter model carry over untouched.
2. **PDF export** — The resume PDF is a pure function of `resume/data.ts` and only changes on a code deploy, so generate it **once at build time** into `dist/resume.pdf`. The runtime `/api/public-pdf` endpoint, rate limiting, and concurrency cap are deleted. This is what lets the whole site go fully static.
3. **Hosting** — **Cloudflare Pages** (free tier: no bandwidth cap, commercial-use allowed, global CDN, free TLS, PR preview deploys). The owned Hostinger VPS is no longer in the serving path. Security headers move from server middleware to a Cloudflare `_headers` file.
4. **Build/CI** — Build in **GitHub Actions** (typecheck, tests, PDF generation via headless Chrome, `astro build`) and ship the finished folder with `wrangler pages deploy dist/`. Cloudflare never needs Chromium — it only serves bytes.
5. **Styling fidelity** — **Faithful port, design frozen.** `theme.ts` tokens (palette, font stacks, type scale) map 1:1 into Tailwind config; the look is identical so every page is verifiable against the old one. No redesign folded in.
6. **Markdown** — Astro's native Markdown pipeline: **Shiki** highlighting (matched to the current `#0d1117` code blocks), GFM tables/lists by default, a **remark alerts plugin** so the `> [!WARNING]` callout syntax from ADR-0001 keeps working, mapped to the accent/warning panels. **MDX stays off** (ADR-0001). Raw HTML stays disabled.
7. **Interactivity** — **Zero JavaScript, no islands.** The site's only interactive element was the mobile-nav toggle; it becomes a CSS-only `<details>`/`<summary>` nav. Nothing ships to the browser.
8. **Draft visibility** — Enforced at **build time**: production `astro build` filters the collection to `status === "Published"`, so `Outline`/`Drafting` Posts never enter `dist/`; `astro dev` renders all statuses for preview. The `status` enum (not Astro's `draft` boolean) stays the source of truth. Strictly more airtight than the old server 404 — drafts have no URL to guess.
9. **Migration boundary** — **Keep the typed TS data modules and view-model logic; rewrite only the presentation.** Blog Posts → Astro content collection; projects/experiments/decisions/resume → stay typed TS modules consumed by `.astro` pages. Both content models from ADR-0001 stay intact; all MUI coupling lives in the presentation layer being rewritten.
10. **Testing** — **`bun test` only** (honours the CLAUDE.md Bun mandate; no Vitest). Pure-logic units (Zod frontmatter schema, PDF generation, view-models) stay on bun:test; integration tests assert directly on the emitted `dist/*.html` (sound, because zero-JS means the static file *is* the page); the puppeteer PDF test stays, now validating the build artifact. MUI-internal component tests are deleted.
11. **Styling toolkit** — **Tailwind-first; DaisyUI minimal.** With the design frozen, Tailwind + a few `@apply` classes derived from `styles.ts` (`softPanelBaseSx`, `accentPanelBaseSx`, `accentChipSx`) match the look more closely than overriding DaisyUI's opinionated defaults. DaisyUI is reserved for genuinely-interactive-shaped widgets, not the design foundation.

## Considered Options

- **Keep MUI inside Astro as one `client:only` React island** — rejected: reintroduces the SPA, ships the full React + MUI + Emotion bundle, gives no SSR/SEO benefit, and defeats the entire reason to adopt Astro. Astro also exposes no hook for Emotion's per-request SSR style extraction, so a "real SSR" MUI path is fragile and undocumented.
- **Blog-only migration / two stacks side by side** — rejected: two frameworks, two build pipelines, the shared header implemented twice.
- **Finish the Bun-SSR blog first, migrate later** — rejected: that SSR plumbing is exactly what Astro replaces; it would be throwaway work.
- **On-demand PDF endpoint via `@astrojs/node`** — rejected: keeps the Chromium/Docker/long-running-server footprint to re-render content that only changes on deploy.
- **Keep serving `dist/` from the owned VPS** — rejected as the primary path (viable fallback): same $0 cost as Cloudflare Pages but keeps a server to patch and is single-region; Pages adds a CDN and preview deploys for free.
- **DaisyUI-first design foundation** — rejected: its default component styling fights the frozen, custom design.
- **Redesign during the migration** — rejected: loses the visual baseline that makes the migration verifiable ("different because of Astro, or because I redesigned?").

## Consequences

- **Ops deleted:** Dockerfile, docker-compose, GHCR publish, Tailscale auth, SSH deploy job, runtime Chromium, rate limiting, concurrency cap, and the security-header middleware (→ `_headers`). The deploy collapses to "build in Actions → `wrangler pages deploy`."
- **Build now depends on headless Chrome** for the build-time PDF step (in CI only, a solved problem) — the one new build-time dependency.
- **ADR-0001 holds:** Markdown Posts and MDX-off are preserved; the implementation moves to content collections + Zod + Shiki + a remark alerts plugin, replacing the hand-rolled `gray-matter` + `marked` loader.
- **`CONTEXT.md` is unchanged:** the ubiquitous language (Blog/Post/Category/Tag/Status) is implementation-agnostic. The `Status` "dev-only drafts" rule is now enforced at build rather than per request.
- **Issue re-triage needed:** #8 (SEO head), #9 (RSS/sitemap/robots), and #10 (latest-writing) become built-in Astro integrations rather than hand-rolled features; #3–#5 (Bun-SSR mechanics) are largely obsolete and should be reframed or closed against this ADR.
- **One-time cost:** a substantial rewrite of the presentation layer (~335 `sx` props and ~13 feature components → Tailwind/`.astro`). Concentrated in the view layer by decision 9, so the data layer stays stable.
- **No experimental Bun adapter risk:** because the output is static (no Astro server at runtime), the "Astro-on-Bun is experimental" caveat does not apply — Bun remains only the local package manager / task runner.
