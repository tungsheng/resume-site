# Redesign the site in a Swiss-minimal style with monospace technical detailing

Status: accepted (amends ADR-0003 decision 5); decisions 3–5 (canvas, typography, accent) superseded by ADR-0010. The Swiss structure, system detailing, and zero-JS boundary (decisions 2, 6, 8, 9) still hold.

We are redesigning the site's visual language from the faithfully-ported MUI look into **Swiss-International minimalism** (strict grid, generous whitespace, typographic hierarchy, ruthless restraint, hairline rules) carried on a **light** canvas (white paper, near-black ink) with a single accent. This is a **deliberate reversal of ADR-0003 decision 5** ("Faithful port, design frozen… No redesign folded in") and of ADR-0003's rejection of "redesign during the migration" — that freeze existed to keep every page diff-verifiable against the pre-Astro site during the migration; the migration is done (ADR-0003, ADR-0004), so the freeze has served its purpose and is lifted. This is a **skin**: content, routes, the typed data/view-model modules, the Markdown/Sätteri pipeline (ADR-0004), and zero-JS static output (ADR-0003) are all unchanged.

The original brief was a "techie / hacker / terminal / pixel" look referencing the Mistral site; the grilling session resolved that into Swiss-minimal *discipline* with the techie character expressed as restrained **system detailing** rather than retro-terminal costume.

## Decisions (the resolved design tree)

1. **Sequencing** — A separate redesign effort on a branch off `main` (after the Astro-7 + Sätteri merge, PR #19). Not entangled with the migration, so the migration kept its parity verification.
2. **Foundation** — Swiss-International minimalism: a strict column grid, generous whitespace, clear typographic hierarchy, hairline/box-drawing rules, and ruthless restraint. The grid and whitespace do the work; ornament is removed.
3. **Canvas** — **Light.** White / near-white paper, near-black ink, one accent. Authentic Swiss and maximally legible for the blog and resume. The "dark hacker terminal" cue was considered and **dropped** in favour of light Swiss; the techie signal comes from type and detailing, not a dark CRT canvas.
4. **Typography** — **Inter** (a neutral neo-grotesque, already self-hosted in-repo for the resume PDF) for headings **and** body, so web type unifies with the PDF and adds no new font infrastructure. **JetBrains Mono** (already used in code blocks) for eyebrows, labels, metadata, tags, and code. The serif display face (Iowan Old Style) and the system-sans stack (Avenir Next) are **dropped**.
5. **Accent** — A single accent, **go-green `#00ab66`** (retained from the current brand). It carries brand continuity and reads as terminal-phosphor green, a fitting double meaning for an inference-performance portfolio.
6. **Motifs — "restrained system detailing"** — The techie/terminal character is expressed only as: monospace UPPERCASE letter-spaced eyebrows/labels, Swiss section numbering (`01 — 02 — 03`), hairline and box-drawing rules, tabular-figure data tables (the experiments/decisions surfaces are numeric-heavy), and monospace metadata (dates, tags, reading time). **Explicitly excluded:** command-prompt prefixes, blinking cursors, ASCII-art banners, CRT scanlines/glitch, a pixel/bitmap display font, and a dark canvas. The design reads as precise engineering, not costume.
7. **Scope / rollout** — **Staged tracer.** Establish the design system on the shared layout/nav + home page first; react to the real look; then roll it across projects, experiments, decisions, blog, and the resume web page one slice at a time. The resume **PDF** (`document-css`) is re-themed as a fast-follow, not part of the first slice (print design differs from web).
8. **Interactivity** — **Zero JavaScript retained** (ADR-0003 decision 7). Nothing in this redesign needs JS; all effects are CSS.
9. **Migration boundary** — Presentation-only. The typed data/view-model/content modules, the content collections, the Sätteri Markdown pipeline and its two transforms (ADR-0004), routing, redirects, RSS/sitemap/robots/SEO, and the build-time PDF generation are untouched. Only `astro/styles/global.css`, `BaseLayout.astro`, the `.astro` page/component presentation, and the design tokens change.

## Considered Options

- **Dark hacker-terminal maximalism** (phosphor-on-black, scanlines, ASCII art, monospace everything) — rejected: lower legibility for the blog/resume, and reads as costume rather than craft.
- **Mistral-style dark clean-corporate** — rejected: the reference's actual look, but the chosen direction is authentically Swiss (light, grid-led) rather than dark-corporate.
- **Monospace-forward or pixel/bitmap display font** — rejected: mono body harms long-form legibility; a pixel font fights Swiss restraint and dates quickly. Mono is confined to labels/metadata/code.
- **Classic Swiss red / terminal amber / pure-monochrome accent** — rejected in favour of retaining go-green for brand continuity.
- **Whole-site (or whole-site incl. PDF) big-bang** — rejected for a staged tracer to de-risk and let the design system be reacted to before full rollout.

## Consequences

- **The visual-parity oracle is retired.** ADR-0003/0004 verified every page by diffing against the pre-Astro / Astro-6 build; after this redesign there is no prior look to match. Verification pivots to **human visual review per tracer page**, while the structural build-output tests (0 `<script>`, routes built, RSS/sitemap/robots, draft/Outline exclusion, per-Post SEO head, and the Markdown-transform markup — callout/figure/table classes, which are content not theme) are **retained** and must stay green.
- **`CONTEXT.md` is unchanged:** "Swiss", "Inter", "monospace", "system detailing" are presentation/implementation terms, not ubiquitous domain language (consistent with ADR-0003/0004). The Blog/Post/Category/Tag/Status vocabulary is untouched.
- **The design is no longer frozen.** Future visual changes no longer need to justify themselves against a pre-Astro baseline; ADR-0003 decision 5 no longer applies.
- **Type infrastructure shrinks then grows slightly:** the serif and the system-sans stack are dropped; one self-hosted web `@font-face` for Inter (reusing the existing PDF woff2) is added.
