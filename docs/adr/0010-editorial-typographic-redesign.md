# Re-skin the site in an editorial, typography-first style (supersedes ADR-0005 canvas/type/accent)

Status: accepted (supersedes ADR-0005 decisions 3–5)

We are re-skinning the site from the Swiss-minimal look (ADR-0005) into a **typography-first editorial** style: a warm paper canvas, a serif doing the display **and** body work, monospace confined to metadata, and a single green accent. This came from an external design handoff (`design_handoff_tonylee_redesign/`) and was filed as issues #55–#59 (foundation + one slice per view: Home, Work, Blog, Resume). Like ADR-0005 this is a **skin**: content, routes, the typed data/view-model modules, the Markdown/Sätteri pipeline (ADR-0004), and zero-JS static output (ADR-0003) are unchanged. ADR-0005's **structure** — strict measure, generous whitespace, hairline rules, monospace UPPERCASE labels, section numbering, tabular figures, zero JS (decisions 2, 6, 8, 9) — is **retained**; only its **canvas, typography, and accent** (decisions 3, 4, 5) are replaced.

## Decisions

1. **Sequencing / rollout** — Foundation first (shared tokens + layout chrome), then one page slice at a time (#56–#59), reacting to the real look. A separate branch off `main`.
2. **Canvas** — **Warm paper.** Paper `#FAF8F3`, ink `#1C1B17`, body `#3B3933`, secondary `#4A473F`, warm muted/faint greys, hairline `#E4E1DA`. Replaces ADR-0005's white/near-black.
3. **Typography** — **Newsreader** (serif, variable optical-size + weight, roman + italic) for display **and** body; **IBM Plex Mono** (400/500) for every eyebrow, label, date, tag, and code. This **reverses ADR-0005 decision 4** — the serif that ADR-0005 dropped returns as the primary face, and Inter / JetBrains Mono are retired from the web layer. Both faces are self-hosted woff2 (sourced from the `@fontsource` packages, copied into `public/fonts`), so the deployed CSP stays `font-src 'self'` — no Google Fonts CDN. The resume **PDF** keeps its own embedded Inter (`src/features/resume/fonts`), independent of the web type.
4. **Accent** — **`#2F7D3B`** (a brighter forest green), chosen over the handoff's `#1E6B4E` default. `--color-go-green` `#2F7D3B` is the mark/rule/active tone (4.81:1 on paper); `--color-go-green-dark` `#235E2C` is the text/hover tone (7.30:1). Both clear WCAG AA for normal text. Replaces ADR-0005's `#00ab66`.
5. **Measure** — A single centered content column at **1200px (75rem)** with a 24px desktop / 20px mobile gutter, matching the prior site's width. Structural rows (nav, footer, "Latest writing", section rules, date ranges) span the full measure; running prose is capped to a readable line length (≈40–44rem) so the wide canvas never produces over-long lines.
6. **Chrome** — `TL.` Newsreader wordmark with an accent period; title-case monospace nav with an accent active underline; accent breadcrumb separators; footer with the Newsreader name, monospace tagline, and a LinkedIn link.
7. **Interactivity** — **Zero JavaScript retained** (ADR-0003 decision 7 / ADR-0005 decision 8). All effects are CSS. The CSS-only mobile disclosure nav and the progressive-enhancement search island (ADR-0008/0009) are unchanged.
8. **Migration boundary** — Presentation-only. Only `astro/styles/global.css`, `BaseLayout.astro`, the four view `.astro` files, the shared `PostList.astro`, and `public/_headers` (font cache comment) change. Data, view-models, content collections, routing, redirects, RSS/sitemap/SEO, and the PDF pipeline are untouched.

## Considered Options

- **Keep the 780px handoff measure** — rejected: it stranded content on wide screens; the prior site's 1200px measure with capped prose reads as intentional, not narrow.
- **Google Fonts CDN for Newsreader / IBM Plex Mono** — rejected: it would loosen the deployed CSP (`style-src`/`font-src` for googleapis/gstatic) and add a third-party dependency. Self-hosting matches the existing Inter/KaTeX convention.
- **Handoff's `#1E6B4E` accent** — rejected in favour of the brighter `#2F7D3B` (owner preference); a darker `#235E2C` carries on-paper text to keep AA.
- **Omit blog tag chips (as the mock shows)** — rejected: the governed tag navigation (ADR-0009) is behaviour, not ornament. Chips are kept in a monospace row below each post card, outside the card link.

## Consequences

- **ADR-0005 decisions 3–5 are superseded**; its decisions 2, 6, 8, 9 (Swiss structure, system detailing, zero-JS, presentation-only boundary) still hold and are inherited here.
- **Web font infrastructure changes:** Inter + JetBrains Mono leave the web layer (the orphaned public Inter woff2 are deleted); Newsreader + IBM Plex Mono woff2 are added under `public/fonts`, with `@fontsource-variable/newsreader` and `@fontsource/ibm-plex-mono` as devDependencies recording provenance (not imported at build time). The resume PDF's type is unaffected.
- **Accessibility is documented in the token layer:** accent 4.81:1, accent-dark 7.30:1, muted 4.87:1 all clear AA; `--color-faint` (3.67:1) is a deliberate sub-AA de-emphasis tone reserved for supplementary meta (dates, dim counts, tag chips).
- **`CONTEXT.md` is unchanged:** "editorial", "Newsreader", "paper", "measure" are presentation terms, not ubiquitous domain language (consistent with ADR-0003/0004/0005). The Blog/Post/Category/Tag/Status vocabulary is untouched.
- **Verification stays human-visual per page** (ADR-0005) plus the retained structural build-output tests (zero `<script>`, routes, RSS/sitemap/robots, SEO head, draft exclusion, tag-chip links, Markdown-transform markup), which must stay green.
