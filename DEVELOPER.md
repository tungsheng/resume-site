# Developer Guide

This project is a Bun server that serves Tony Lee's public site and a small JSON API used by the frontend. The source of truth for resume content is YAML under `resumes/`.

## Stack

- Bun for the HTTP server, HTML imports, and test runner
- React 19 for page rendering
- YAML for resume content
- `puppeteer-core` for PDF generation

## Commands

```bash
bun install
bun run dev
bun run start
bun run check
bun run test:unit
bun run test:integration
bun run test:all
bun run typecheck
```

`bun run test:integration` expects a running server at `http://localhost:3000` unless `TEST_BASE_URL` is set.

## Project Layout

```text
public/                  HTML entrypoints loaded directly by Bun
resumes/                 checked-in resume YAML files
src/
  components/            shared React UI pieces
  domain/resume/         resume loading, normalization, and view-model shaping
  features/              page-specific React code
    experiments/
    home/
    project/
    resume/              shared resume document, client hooks, and page UI
    site/                shared public-site content, layout, and styles
  server/
    http/                small HTTP helpers
    routes/              API handlers and static-file fallback
  services/              PDF generation helpers
  index.ts               Bun server entrypoint
tests/
  unit/                  Bun unit tests
  integration/           HTTP-level integration tests
```

## Runtime Model

`src/index.ts` uses Bun's `routes` API to serve:

- `GET /`
- `GET /project/cloud-inference-platform`
- `GET /experiments`
- `GET /resume/:name`
- `GET /api/resumes`
- `GET /api/resume/:name`
- `GET /api/settings/:name`
- `POST /api/public-pdf`

Any other request falls through to `src/server/routes/static.ts`, which serves files from `public/` after path sanitization.

## Public Page Roles

- `/` introduces Tony Lee and highlights the flagship project.
- `/project/cloud-inference-platform` is the narrative case study.
- `/experiments` is the evidence archive for checked-in evaluation runs.
- `/resume/:name` is the public resume route with a screen-first web view and a preserved print-preview/PDF path.

## Resume Content Flow

1. Resume files are discovered in `resumes/` by `src/domain/resume/load.ts`.
2. YAML is parsed and normalized into the internal `ResumeData` shape.
3. `src/features/resume/document.tsx` renders the canonical resume markup for both preview and PDF output.
4. The public resume page fetches `/api/resume/:name` and `/api/settings/:name`, then renders a screen-first resume view while keeping the print-preview document mounted.
5. PDF downloads call `/api/public-pdf`, which renders the same resume document through React SSR and hands it to Puppeteer.

The checked-in `tony-lee.yaml` uses the current v2-style format. Legacy YAML aliases remain covered by unit tests without exposing an extra public resume fixture.

## Presentation Settings

The checked-in presentation overrides and public-page helpers live in `src/features/resume/presentation.ts`.

- Unknown resumes fall back to the default theme color and layout.
- `tony-lee` is pinned to the green `minimal-timeline` presentation.
- There is no admin UI or persistence layer for editing settings at runtime.

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port for the Bun server |
| `RESUMES_DIR` | `resumes` | Directory scanned for `.yaml` and `.yml` resume files |
| `TRUST_PROXY` | unset | When set to `1`, rate limiting trusts forwarded IP headers |
| `PUPPETEER_EXECUTABLE_PATH` | unset | Absolute path to Chrome or Chromium for PDF export |

## PDF Export

`POST /api/public-pdf` accepts JSON with:

```json
{
  "name": "tony-lee",
  "themeColor": "#27ae60",
  "layoutTemplate": "minimal-timeline"
}
```

Notes:

- `themeColor` and `layoutTemplate` are optional.
- Requests are rate-limited per client IP.
- The route returns `429` when the rate limit is exceeded.
- If no browser binary can be launched, the route returns `500` with a PDF engine error.

## Docker

Local container run:

```bash
docker compose up --build
```

Production-oriented container run:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

The production compose file binds to `127.0.0.1:3000` and enables `TRUST_PROXY=1` for reverse-proxy deployments.

## Editing the Site

For a new public page with its own route:

1. Add a Bun HTML entrypoint in `public/`.
2. Add a React entry file in `src/features/<page>/index.tsx`.
3. Add the page component and any page-local helpers.
4. Register the route in `src/index.ts`.
5. Add or update tests if the new page changes routing or content expectations.

For a new resume:

1. Add `resumes/<slug>.yaml`.
2. Visit `/resume/<slug>`.
3. If the resume needs a non-default theme or layout, add a read-only entry in `src/features/resume/presentation.ts`.

## Testing Focus

Current tests cover:

- resume loading and normalization
- public page rendering and route shells
- PDF scaling helpers
- settings fallback behavior
- route security helpers
- selected HTTP integration behavior for the home, project, experiments, and resume routes

What is not fully covered:

- successful PDF generation against a real Chrome/Chromium binary
- live browser interaction with the rendered pages
