# Developer Guide

This project is a Bun server that serves Tony Lee's public site and one PDF export endpoint. The source of truth for the public resume is `src/features/resume/data.ts`.

## Stack

- Bun for the HTTP server, HTML imports, and test runner
- React 19 for page rendering
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
src/
  features/              page-specific React code
    experiments/
    home/
    project/
    resume/              typed resume data, shared resume document, and page UI
    site/                shared public-site content, layout, and styles
  server/
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
- `GET /resume`
- `POST /api/public-pdf`

Any other request falls through to `src/server/routes/static.ts`, which serves files from `public/` after path sanitization.

## Public Page Roles

- `/` introduces Tony Lee and highlights the flagship project.
- `/project/cloud-inference-platform` is the narrative case study.
- `/experiments` is the evidence archive for checked-in evaluation runs.
- `/resume` is the public resume route with a screen-first web view and PDF download path.

## Resume Content Flow

1. `src/features/resume/data.ts` exports the checked-in public `ResumeData` object.
2. `src/features/resume/view-model.ts` prepares display-only fields such as date ranges and skill text.
3. `src/features/resume/page.tsx` renders the screen resume and calls the PDF request helper.
4. PDF downloads call `/api/public-pdf`, which renders `src/features/resume/document.tsx` through React SSR and hands the HTML to Puppeteer.

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port for the Bun server |
| `TRUST_PROXY` | unset | When set to `1`, rate limiting trusts forwarded IP headers |
| `PUPPETEER_EXECUTABLE_PATH` | unset | Absolute path to Chrome or Chromium for PDF export |

## PDF Export

`POST /api/public-pdf` uses the checked-in public resume data.

Notes:

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
2. Add the page component and any page-local helpers.
3. Register the route in `src/index.ts` and `src/site.tsx`.
4. Add or update tests if the new page changes routing or content expectations.

To replace the public resume:

1. Update `src/features/resume/data.ts`.
2. Visit `/resume`.

## Testing Focus

Current tests cover:

- checked-in public resume data
- public page rendering and route shells
- PDF scaling helpers
- selected HTTP integration behavior for the home, project, experiments, and resume routes

What is not fully covered:

- successful PDF generation against a real Chrome/Chromium binary
- live browser interaction with the rendered pages
