# Developer Guide

This project is an [Astro 7](https://astro.build) static site (built and tested
with Bun) plus a build-time resume PDF generator. The source of truth for the
public resume is `src/features/resume/data.ts`.

## Stack

- Astro 7 (`output: "static"`) with the Sätteri Markdown engine — see `docs/adr/`
- React 19 for the shared resume document and PDF render
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `puppeteer-core` for build-time PDF generation
- Bun for installs, scripts, and the test runner

## Commands

```bash
bun run dev               # Astro dev server (builds the PDF first if missing)
bun run build             # build:pdf, then astro build -> dist/
bun run build:pdf         # render the resume PDF into public-astro/resume.pdf
bun run check             # typecheck + unit tests
bun run typecheck         # astro sync + tsc --noEmit
bun run test:unit         # unit tests
bun run test:integration  # integration tests (RUN_INTEGRATION_TESTS=1, needs a Chrome/Chromium binary)
bun run test:all          # unit + integration
```

## Project Layout

```text
astro/                     Astro source (configured as srcDir)
  pages/                   routes (.astro / .ts) -> static HTML
  components/              .astro UI components
  layouts/                 BaseLayout and shared shells
  content/                 content-collection schema + selectors (blog)
  content.config.ts        Astro content collections config
  markdown/                Sätteri AST plugins (admonitions, blog images)
  styles/                  global.css (Tailwind entry)
public-astro/              static assets served as-is (configured as publicDir)
src/
  features/
    resume/                typed resume data + shared document + PDF render
    site/                  portfolio content model (projects/decisions/experiments)
  services/
    pdf.ts                 generic HTML -> PDF service (puppeteer-core)
scripts/
  build-resume-pdf.ts      orchestrates the resume PDF build
tests/
  unit/                    Bun unit tests
  integration/             PDF rendering integration tests
```

`astro.config.mjs` sets `srcDir: "./astro"` and `publicDir: "./public-astro"`
while the data/services layer still lives under `./src` (migration in progress —
see `docs/adr/0003-migrate-to-astro-static-site.md`).

## Import Aliases

`tsconfig.json` defines path aliases so call sites do not hard-code the `src/`
layout (and the eventual `srcDir` flip is a one-line config change):

| Alias        | Resolves to                       |
| ------------ | --------------------------------- |
| `@site`      | `src/features/site/index.ts` (content facade barrel) |
| `@site/*`    | `src/features/site/*`             |
| `@resume/*`  | `src/features/resume/*`           |
| `@services/*`| `src/services/*`                  |

Pages and components import the portfolio content model from the `@site` barrel;
the resume pipeline and PDF service use `@resume/*` and `@services/*`.

## Pages

- `/` — intro and flagship-project highlight
- `/projects`, `/projects/gpu-inference-lab`, `/projects/cuda-kernel-lab`
- `/experiments`, `/experiments/<slug>`
- `/decisions`, `/decisions/<project>`
- `/blog`, `/blog/<slug>` (Markdown content collection), `/rss.xml`
- `/resume` — screen resume; the downloadable PDF is built at `public-astro/resume.pdf`

## Resume Content Flow

The screen resume (`astro/pages/resume.astro`) and the PDF share the same typed
data and view model, so the two renderings cannot drift:

1. `@resume/data` exports the checked-in public `ResumeData`.
2. `@resume/view-model` (`buildResumeViewModel`) prepares display-only fields
   (date ranges, skill text).
3. `@resume/document` (`ResumeDocument`) is the shared React document.
4. `@resume/render-static-html` renders the document to an HTML string with CSS
   and fonts inlined (`@resume/document-css`, `@resume/pdf-fonts`).
5. `scripts/build-resume-pdf.ts` hands that HTML to `generatePDF` in
   `@services/pdf` and writes `public-astro/resume.pdf`.

## PDF Service

`src/services/pdf.ts` is a content-agnostic HTML→PDF wrapper over a pooled
`puppeteer-core` browser. It measures the `.resume-document` element and scales
the output to Letter size.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PUPPETEER_EXECUTABLE_PATH` | auto-detected | Absolute path to Chrome/Chromium used for rendering |

The integration test (`tests/integration/pdf-rendering.test.ts`) exercises a real
browser and is gated behind `RUN_INTEGRATION_TESTS=1`.

## Editing the Site

To add a public page:

1. Add a `.astro` route under `astro/pages/`.
2. Add any new content to the relevant module under `src/features/site/` and
   re-export it from `src/features/site/index.ts` (the `@site` barrel).
3. Update tests if routing or content expectations change.

To replace the public resume:

1. Update `src/features/resume/data.ts`.
2. Run `bun run build:pdf` (or `bun run dev`) and review `/resume`.

## Testing Focus

Covered:

- checked-in public resume data and view model
- decision-content referential integrity
- PDF scaling helpers
- static HTML render of the resume document

Not covered by default:

- real-browser PDF generation (the optional integration test)
