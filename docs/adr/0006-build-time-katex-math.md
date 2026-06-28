# Render blog math at build time with KaTeX (on the Sätteri pipeline)

Status: accepted (pre-implementation). This is the resolved design tree from a grilling session; nothing is built yet. The raw-HTML-injection **spike (Decision 5) is the first implementation task** and is the one open risk — if Sätteri exposes no clean injection path, we fall back to the remark/rehype + `rehype-katex` escape hatch that ADR-0004 already supports.

The blog renders math as prose + inline `` `code` `` today — the implicit prose-only-math house style behind the launch post and the in-progress attention post. As the writing turns math-dense (transformer internals, attention, CUDA kernels), that ceiling bites. We will add **KaTeX**, rendered **at build time** into static HTML, on Astro 7's native **Sätteri** Markdown pipeline (ADR-0004). This preserves the zero-JS guarantee (ADR-0003) and Markdown authoring (ADR-0001, MDX still off); it deliberately reverses the prose-only-math stance.

## Verified facts (primary sources)

- `katex` is **not yet a dependency**.
- Sätteri parses math natively behind an opt-in flag: `features.math` (default **false**), with `MathOptions.singleDollarTextMath` (default true). It emits **mdast** nodes `inlineMath` and `math` (both `MdastLiteral`; `.value` holds the raw TeX), mirroring remark-math. Sätteri only **parses** — it does not render math to HTML (same as remark-math; rendering is ours to add).
- The site CSP (`public-astro/_headers`, copied to `dist/_headers`) is `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; …`. KaTeX's inline span styles are covered by `style-src 'unsafe-inline'`; KaTeX fonts satisfy `font-src 'self'` **iff self-hosted**. **No CSP change is required.**
- `<head>`/`<link>` markup lives in `astro/layouts/BaseLayout.astro`. In-repo Markdown transforms live in `astro/markdown/` as Sätteri plugins (`mdast-admonitions.ts`, `hast-blog-images.ts`); the latter — a pure, unit-testable render helper + a thin `defineHastPlugin` wrapper — is the template for the math plugin.
- Zero-JS (ADR-0003) forces **build-time** rendering: `katex.renderToString` server-side, no client KaTeX.

## Decisions (the resolved design tree)

1. **Scope — capability only, opt-in per post.** Add the pipeline + fonts + tests so any post *can* use `$…$`; convert **no** existing posts in this change. The attention post (separate branch) keeps its inline-`code` math until converted in its own focused change. A post opts in simply by writing `$…$`; per-post use is the author's choice.
2. **Delimiter — single-dollar inline math stays on** (`singleDollarTextMath: true`): `$…$` inline, `$$…$$` display (the remark-math standard). Literal dollars in prose are escaped `\$`. Rationale: a single technical author; an accidental math span needs *two* unescaped `$` on one line and is glaring in preview; disabling single-dollar would tax every real formula forever. The `\$` convention is recorded in this ADR (and `DEVELOPER.md` authoring notes at implementation) — **not** `CONTEXT.md`, which is glossary-only.
3. **Delivery — self-host CSS + fonts; auto-link per post.** Vendor `katex.min.css` + the WOFF2 fonts under `public-astro/` (CDN-free, CSP-clean). Link the stylesheet **only** on blog posts whose source contains a math delimiter, detected by scanning the raw markdown **pre-render** so it cannot desync (math present ⇒ CSS linked); non-math posts and all portfolio pages stay clean. **No `math: true` frontmatter flag** — a forgotten flag would silently break rendering (glyphs, no CSS). Fonts are browser-lazy regardless, so only true math pages fetch WOFF2.
4. **Output — `htmlAndMathml` on-site; RSS degrades to raw TeX.** Keep KaTeX's default HTML+MathML output for on-page accessibility (screen-reader MathML). In the RSS render path, emit each formula's raw TeX `.value` (e.g. as `<code>$…$</code>`) instead of CSS-less KaTeX HTML, so feeds show readable source rather than a glyph jumble. The exact mechanism is an implementation detail; **fallback** = accept degraded math in feeds (documented), since math posts are opt-in and rare.
5. **Mechanism — build-time, in-repo Sätteri plugin; injection is the spike.** Set `features.math: true`; add `astro/markdown/<plugin>.ts` mirroring `hast-blog-images.ts` (pure helper + thin Sätteri wrapper) calling `katex.renderToString(value, { displayMode, throwOnError: false })`. `throwOnError: false` renders a bad formula in red inline (caught in preview) rather than failing unrelated builds. **The one open risk:** injecting KaTeX's raw HTML *string* into Sätteri's tree — the existing plugins set structured `data.hName`/`hProperties`, not raw HTML. **First implementation task is a spike** to find Sätteri's raw-HTML path (a raw node, parsing KaTeX output back into hast, or an `hChildren`/dangerous-HTML equivalent). If none is clean, **fall back** to `@astrojs/markdown-remark` + `remark-math` + `rehype-katex` — the remark/rehype escape hatch ADR-0004 already names — accepting that it reintroduces the remark pipeline **for math only**.
6. **Verification.** Extend `tests/integration/blog-build.test.ts`: a math post renders `.katex` markup on its detail page; the KaTeX stylesheet is linked **only** on math posts (not on non-math posts or portfolio pages); the WOFF2 fonts ship to `dist/`; RSS shows raw TeX (or the documented fallback); and a full prod build still emits **0 `<script>`** (zero-JS intact). Unit-test the render helper like the other plugin helpers.

## Considered Options

- **`$$…$$`-only (disable single-dollar)** — rejected: clunky inline syntax forever to defend against a rare, obvious footgun.
- **Site-wide / blog-wide stylesheet link** — rejected: makes non-math pages pay a CSS request; pre-render source-scan is nearly free and exact.
- **`math: true` frontmatter flag** — rejected: forgettable, and a forgotten flag silently breaks rendering.
- **Client-side KaTeX auto-render** — rejected: violates zero-JS (ADR-0003).
- **MathJax** — rejected: heavier; build-time KaTeX covers the need with smaller, faster output.
- **remark/rehype + `rehype-katex` as the primary path** — not chosen as primary (keeps the native Sätteri pipeline per ADR-0004), but **retained as the fallback** if the injection spike fails.
- **Do nothing (stay prose-only)** — rejected by the writing direction; this ADR is the deliberate reversal.

## Consequences

- New build-time dependency on `katex`; a vendored ~300 KB CSS + WOFF2 bundle under `public-astro/` (fonts fetched only on real math pages).
- New in-repo Sätteri math plugin + unit tests; `features.math` is on **pipeline-wide**, so `$…$` is significant in every post — hence the `\$` escape convention.
- **Zero-JS, CSP, and MDX-off all intact:** build-time render, self-hosted fonts under the existing CSP, still Markdown.
- **One open risk carried into implementation:** the raw-HTML-injection spike, with a named remark/rehype fallback — so the decision is safe even if the preferred mechanism doesn't pan out.
- **`CONTEXT.md` unchanged:** the Blog/Post/Category/Tag/Status vocabulary is untouched — "KaTeX/math/Sätteri" are implementation terms, not domain language (ADR-0004's stance). The `\$`/`$…$` authoring convention is recorded in this ADR and belongs in `DEVELOPER.md`, not the glossary.
- **Reverses the implicit prose-only-math house style.** Future math posts use `$…$`; the attention post can be converted in a follow-up.
- **Issue tracker:** file a slice — injection spike → plugin + render helper → fonts/CSS vendor + auto-link → RSS degrade → tests.
