# Adopt Astro 7 and its native Sätteri Markdown pipeline

Status: proposed (execution sequenced after the Astro-6 production launch; one item — build runtime — gated on a spike)

Astro 7.0.0 shipped 2026-06-22 (the same day this was scoped). We will move the site from Astro 6.4.8 to Astro 7 and, rather than do a minimal-parity bump, **adopt Astro 7's new native Markdown pipeline (Sätteri)** in place of the remark/rehype pipeline — porting our two in-repo Markdown transforms onto Sätteri's plugin API. This extends ADR-0003 (Astro zero-JS static site); ADR-0001 (Posts authored as Markdown, MDX off) is preserved.

This ADR is the resolved design tree from a grilling session, grounded in the npm registry and the official v7 upgrade guide + Sätteri docs (Astro 7 postdates the model's training data, so every claim below was verified against primary sources, not memory).

## Verified facts (primary sources)

- **astro@7.0.0** is `latest` on npm, published 2026-06-22. `engines.node` = **>=22.12.0**; bundles **Vite 8**.
- **Sätteri** (satteri.bruits.org) is Astro 7's native Rust Markdown/MDX engine, now the default in place of remark/rehype. Its AST shapes are the **same MDAST/HAST** as unified, but its **plugin API is not compatible** — "Existing remark/rehype plugins won't run unmodified." The deprecated `markdown.remarkPlugins`/`rehypePlugins`/`remarkRehype` options still work but now require installing `@astrojs/markdown-remark`.
- Sätteri honors `data.hName`/`data.hProperties` ("Plugins that do set `data.hName` work identically on both sides"). GFM (tables) is built-in but **opt-in**. Plugin API: `defineMdastPlugin({ name, <nodeType>(node, ctx) })` / `defineHastPlugin({ name, element: { filter, visit } })` with `ctx.replaceNode()` etc., registered via separate `mdastPlugins` / `hastPlugins` arrays.
- **Shiki is unaffected:** Astro 7 applies syntax highlighting itself, independent of the Markdown engine ("Astro's Markdown code blocks are styled by Shiki by default, preconfigured with the `github-dark` theme"). `markdown.syntaxHighlight` + `shikiConfig` stay.
- `@tailwindcss/vite@4.3.1` already declares Vite 8 support (`^5 || ^6 || ^7 || ^8`). `@astrojs/rss@4` / `@astrojs/sitemap@3` declare no astro peer constraint. No reserved `src/fetch.ts` in the repo. We use neither `@astrojs/db` nor `astro:transitions` (zero-JS).

## Decisions (the resolved design tree)

1. **Motivation** — Adopt the native pipeline, not just minimal parity. We will run the blog body through **Sätteri** and port our transforms to it, rather than keeping the remark/rehype path alive via `@astrojs/markdown-remark`. (Minimal-parity is retained only as the fallback if Sätteri blocks — see Considered Options.)
2. **Sequencing / launch risk** — **Ship the `feat/blog` migration on Astro 6 first.** Merge `feat/blog` → `main` and make the first-ever production launch on the proven Astro 6 build (the remaining #12 deploy work: Cloudflare secrets + merge). *Then* do the Astro 7 + Sätteri port on a fresh branch off `main`. Rationale: this keeps the first production deploy off a one-day-old Astro 7 + one-day-old Sätteri stack, and gives a **live Astro-6 baseline to diff the port against**.
3. **Markdown pipeline port** — Drop `markdown.remarkPlugins`/`rehypePlugins`. Rewrite the two in-repo transforms onto Sätteri:
   - `remark-admonitions` → `defineMdastPlugin` `blockquote(node, ctx)`. The marker-detect + `data.hName='div'`/`hProperties` classes + title-prepend logic survives verbatim (Sätteri honors `hName`); keep it as a pure node-level helper with a thin Sätteri wrapper.
   - `rehype-blog-images` → `defineHastPlugin` `element: { filter: ['img','p'], visit }`, using `ctx.replaceNode()` for the lone-image → `<figure>` wrap. `loading`/`decoding` attr-setting is unchanged.
   - Register via `mdastPlugins`/`hastPlugins`; **enable Sätteri GFM** (tables). Do **not** add `@astrojs/markdown-remark`.
4. **Syntax highlighting** — **No work.** Keep `markdown.syntaxHighlight: 'shiki'` + `shikiConfig` (`github-dark`); Astro applies it regardless of engine. The RSS container-render body stays highlighted.
5. **Build runtime** — Astro 7 requires Node ≥22.12; the build currently runs `astro build` under **Bun** (Bun-first per CLAUDE.md; `pages.yml` uses `setup-bun@v2`, no version pin). **Deferred to a spike:** the port branch's first action is `astro build` under Bun — stay Bun (and pin a known-good Bun version in `pages.yml`) if clean; move only the build step to Node ≥22.12 (`setup-node`) if it wobbles. Bun stays for install, `bun test`, and the PDF script regardless.
6. **Parity details to verify (not redesign)** —
   - **Smart punctuation:** Astro 6 had `smartypants` on; Sätteri's `smartPunctuation` is opt-in and pairs quotes/dashes differently. Enable it for parity; accept minor differences, verify visually.
   - **`compressHTML`** default changes to `'jsx'`: confirm the emitted HTML is unchanged and still ships **0 `<script>`**; pin `compressHTML` only if the output diff is problematic.
   - **Stricter HTML-nesting compiler:** the build surfaces any invalid nesting in our `.astro` (incl. `set:html` usages); fix what it flags.
   - **Container / RSS:** we do not use the now-deprecated `getContainerRenderer` integration-root import; verify `container.renderToString(render(post).Content)` still emits Sätteri-rendered + Shiki-highlighted + transformed HTML in `/rss.xml`.
   - **Frontmatter:** Sätteri "recognizes but does not parse" YAML; Astro's content layer parses Post frontmatter independently — confirm content collections still load.
7. **Verification** — typecheck + the existing 57 tests (rewrite the two plugin unit suites to the new node-level helpers; **keep** the integration build assertions for admonition panels / figure+lazy-img / GFM table / Shiki code / RSS full-content / sitemap / robots) + a full prod build (0 `<script>`) + the puppeteer **local-vs-live-Astro-6 visual diff** on the blog pages (admonition, table, figure, code block) and a spot-check of the portfolio pages.

## Considered Options

- **Minimal-parity bump (keep remark/rehype via `@astrojs/markdown-remark`)** — rejected as the end state (the goal is the native pipeline), but **retained as the fallback**: if porting a transform to Sätteri proves infeasible, install `@astrojs/markdown-remark` and keep the deprecated `remarkPlugins`/`rehypePlugins` working unchanged.
- **Port on `feat/blog` so the first prod deploy is Astro 7** — rejected: makes the initial production launch ride a day-old stack with no live baseline to diff against.
- **Stacked branch (7 off `feat/blog`, decide at merge)** — considered; superseded by "ship 6 first" once we accepted two deploys as cheap insurance.
- **Stay on Astro 6** — rejected by the upgrade goal; revisit only if the spike build fails under both Bun and Node.

## Consequences

- **Two deploys** instead of one: the proven Astro-6 launch, then the Astro-7 follow-up.
- Our two Markdown transforms are **rewritten** to Sätteri's visitor API; the transform *logic* and pure node-level helpers (and most of their unit coverage) carry over. New dev-time coupling to Sätteri's plugin API; `@astrojs/markdown-remark` is **not** taken on.
- **Runtime may be forced:** if Astro 7 won't build cleanly under Bun, CI gains a Node ≥22.12 step for the build only — a partial retreat from the Bun-everywhere stance (scoped to the build).
- **De-risked by sequencing:** a live Astro-6 site exists to diff the port against, and Shiki + the `hName` admonition mechanism are confirmed-supported before any code is written.
- **`CONTEXT.md` unchanged:** "Sätteri", "Vite", and "mdastPlugins/hastPlugins" are implementation terms, not ubiquitous domain language (per ADR-0003's stance); the Blog/Post/Category/Tag/Status vocabulary is untouched.
- **Issue tracker:** file an epic for the Astro-7 port with child slices (config/runtime spike, admonition port, image port, parity verify, visual-diff sign-off), blocked-by the Astro-6 launch.
