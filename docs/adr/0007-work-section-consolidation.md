# Consolidate the work section into project-first case studies under /work

Status: accepted (implemented in PRs #43 and #44; referenced in page comments as "Plan A")

We are collapsing the work section's **three-lens IA** — parallel Projects / Experiments / Decisions indexes plus per-project subpages under each (25 pages) — into **project-first case studies** under `/work` (19 pages): one index at `/work`, one consolidated page per project (`/work/gpu-inference-lab`, `/work/cuda-kernel-lab`) carrying `#decisions` and `#experiments` sections, and the 16 `/experiments/<slug>` leaves retained as the evidence archive. The old taxonomy sliced the same two projects by **artifact type**, so reaching any concrete finding took 3–4 clicks (index → per-project subpage → leaf) and the same facts rendered on three parallel indexes that had to be kept in agreement by hand. A visitor thinks in projects, not in artifact types; the consolidation makes the project page the single place where a project's story, architecture calls, and measured runs meet. This is an **IA change, not a content change**: the typed data modules under `src/features/site/` and the `@site` facade are reused unchanged, and the Swiss-minimal presentation (ADR-0005) and zero-JS static output (ADR-0003) are untouched.

## Decisions (the resolved consolidation tree)

1. **Project-first IA** — `/work` is the single index and lists the projects directly (summary, evidence bullets, one primary CTA per project) — no Projects/Experiments/Decisions switchboard. Each project gets one consolidated case-study page under `/work/`; decisions and the per-project experiment list live as `#decisions` / `#experiments` sections on that page rather than as separate routes.
2. **Decisions are the single results section.** The former "headline results" grids were a strict subset of the decision records, so they are removed rather than merged: the decisions section *is* the results surface, and the one bold result sentence leads the project-page hero so nothing renders twice.
3. **Unified 3-value status display** — index and project pages show every decision and experiment on one scale a visitor can read at a glance: **Supported / Rejected / In progress**, mapped in `astro/components/status.ts`. The data modules keep their finer vocabularies (six decision statuses, five experiment-readiness tones); the nuance stays in each record's call/evidence copy. Display-only mapping — no data migration.
4. **Experiment leaves stay.** The 16 `/experiments/<slug>` pages remain as deep-linkable evidence pages; only the `/experiments` index and the per-project catalog pages that shared that path level fold into the project pages.
5. **Retired routes get real 301s.** `public-astro/_redirects` (evaluated by Cloudflare Pages before static assets) serves server-side 301s for the retired `/projects*`, `/decisions*`, and `/experiments`-index routes, including trailing-splat rules for stale deep links. The `redirects` map in `astro.config.mjs` still builds meta-refresh stubs as the fallback for local preview and non-CF hosts, and the sitemap filters those stubs so it lists only canonical URLs.

## Considered Options

- **Keep the three-lens IA** — rejected: the artifact-type taxonomy is the problem, not a presentation detail. Three parallel indexes render the same facts, and every finding sits 3–4 clicks deep.
- **Fold the experiment leaves into the project pages too** — rejected: 16 detail pages inlined would make the case studies unreadably long, and the leaves are the deep-linkable evidence the decisions cite.
- **Keep a separate headline-results grid alongside the decisions section** — rejected: the grid was a strict subset of the decision records, i.e. the same facts rendered twice on one page.
- **Collapse the data vocabularies to the 3-value scale** — rejected: the six decision statuses and five readiness tones carry real distinctions in the records themselves; only the at-a-glance display unifies.
- **Meta-refresh stubs only for retired routes** — rejected: crawlers and link equity need real 301s. The stubs are kept, but only as the non-Cloudflare fallback.

## Consequences

- **The work section shrinks from 25 pages to 19** and the nav carries a single "Work" entry. Old URLs keep working via 301s, so external links and search results don't break.
- **One source of truth per fact on the rendered site:** a project's results appear once (the decisions section), its experiment list once (the `#experiments` section), and the hero result sentence renders on the project page only.
- **The data layer is unchanged.** `src/features/site/` modules, the `@site` barrel, and the decision-content referential-integrity tests all carry over; the consolidation is expressed in routes, page composition, and the display-only status mapping.
- **Status nuance moves to prose.** A visitor sees Supported/Rejected/In progress; the distinction between e.g. *Measured* and *Supported*, or *Caveated* and *Blocked*, now lives only in each record's call/evidence copy and in the data types.
- **Redirect rules exist in two places** (`public-astro/_redirects` and the `astro.config.mjs` map) and must be kept mirrored by hand when a route is retired or renamed.
- **"Plan A" in page comments refers to this ADR.** Comments in `astro/pages/work.astro`, `astro/pages/experiments/[slug].astro`, `astro/components/ExperimentDetail.astro`, and `src/features/site/content.ts` cite the plan name; this document records what it resolved to.
