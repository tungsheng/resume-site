# Deployment Notes

The site is a static Astro build deployed to **Cloudflare Pages**. Cloudflare
only serves the prebuilt `dist/` bytes — it never runs Bun or Chromium. This
supersedes the old GHCR image + VPS/SSH/Docker flow (removed with the Bun
server; see `docs/adr/0003-migrate-to-astro-static-site.md`).

## Pipeline

`.github/workflows/pages.yml` runs on push to `main` (and `workflow_dispatch`):

1. `bun install --frozen-lockfile`
2. Set up headless Chrome (`browser-actions/setup-chrome`) — needed only for the
   **build-time** resume PDF, not at runtime.
3. `bun run check` — typecheck + unit tests.
4. `bun run build` — `build:pdf`, then `astro build`, then `pagefind --site dist`
   (builds the blog search index into `dist/pagefind/`), emitting `dist/`.
5. `wrangler pages deploy dist --project-name=resume-site`
   (`cloudflare/wrangler-action`).

The job targets the `production` GitHub Environment so it can read the deploy
secrets.

## Required Secrets

Set on the repository's `production` environment:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Build-Time PDF

`bun run build:pdf` renders `public/resume.pdf` with `puppeteer-core`,
which needs a Chrome/Chromium binary at build time:

- CI installs Chrome via `browser-actions/setup-chrome`.
- Locally, the build auto-detects common Chrome/Chromium paths; if detection
  fails, set `PUPPETEER_EXECUTABLE_PATH` to the executable.
- PDF typography is inlined into the render HTML, so output does not depend on
  host OS fonts.

## Local Build Check

Reproduce the deployed artifact locally:

```bash
bun run build      # build:pdf + astro build + pagefind -> dist/
bun run preview    # serve dist/ (astro preview) to spot-check, incl. search
```

## Security Headers & Search

`public/_headers` ships the CSP (copied verbatim into `dist/_headers`). Two
entries exist for the blog search island (#49 / ADR-0009): `script-src` allows
`'wasm-unsafe-eval'` because Pagefind's WebAssembly engine cannot instantiate
without it, and the island's initializer lives as a plain external file
(`public/js/search-init.js`) because the CSP has no `'unsafe-inline'`. Both
constraints are pinned by an integration test — a violation would break search
on Cloudflare only, never in local preview.

## Rollback

Roll back from the Cloudflare Pages dashboard (Deployments → promote a previous
build), or re-run the `pages` workflow from an earlier commit via
`workflow_dispatch`.
