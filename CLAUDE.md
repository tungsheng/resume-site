---
description: Use Bun instead of Node.js, npm, pnpm, or vite.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

**Repo-specific caveat (overrides the generic Bun defaults below):** this site
is built by **Astro 7 on Vite** — `bun run build` runs `astro build` (plus the
PDF and Pagefind steps), and `@tailwindcss/vite` is wired into
`astro.config.mjs`. Do NOT replace the Astro/Vite build with `bun build`, and
ignore the "don't use vite" guidance for this repo's build pipeline. Bun is the
package manager, script runner, and test runner here; `Bun.serve()`/HTML-imports
guidance applies only to standalone tooling scripts, never to the site.

**Tailwind sources are scoped — two ways to silently generate no CSS.**
`astro/styles/global.css` uses `@import "tailwindcss" source(none)` plus an
explicit `@source` list (`../components`, `../layouts`, `../pages`). Automatic
detection is off deliberately: it walked the whole repo, so non-template files
fed the stylesheet — the word "lowercase" in a *test comment* once emitted a
real `.lowercase` utility, and ordinary prose in blog posts and ADRs was
generating `.fixed .grow .outline .rounded .shadow .transition` and more, ~11%
of the bundle. Two consequences when writing markup:

1. **Class names must appear as literal text.** Tailwind emits only what it can
   find as a string in a scanned file, so `` `md:${x}:col-span-2` `` produces no
   CSS. Write the full class and pick it with `class:list`.
2. **New markup outside those three directories is not scanned.** Add its
   directory to the `@source` list rather than removing the scoping.

Both fail *silently* — the page renders unstyled rather than erroring. The
reliable check is to build and diff `dist/` (or grep the built CSS for the
utility); `bun run check` will not catch either.

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build <file.html|file.ts|file.css>` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads .env, so don't use dotenv.

## APIs

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- Bun.$`ls` instead of execa.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

## Frontend

Use HTML imports with `Bun.serve()`. Don't use `vite`. HTML imports fully support React, CSS, Tailwind.

Server:

```ts#index.ts
import index from "./index.html"

Bun.serve({
  routes: {
    "/": index,
    "/api/users/:id": {
      GET: (req) => {
        return new Response(JSON.stringify({ id: req.params.id }));
      },
    },
  },
  // optional websocket support
  websocket: {
    open: (ws) => {
      ws.send("Hello, world!");
    },
    message: (ws, message) => {
      ws.send(message);
    },
    close: (ws) => {
      // handle close
    }
  },
  development: {
    hmr: true,
    console: true,
  }
})
```

HTML files can import .tsx, .jsx or .js files directly and Bun's bundler will transpile & bundle automatically. `<link>` tags can point to stylesheets and Bun's CSS bundler will bundle.

```html#index.html
<html>
  <body>
    <h1>Hello, world!</h1>
    <script type="module" src="./frontend.tsx"></script>
  </body>
</html>
```

With the following `frontend.tsx`:

```tsx#frontend.tsx
import React from "react";
import { createRoot } from "react-dom/client";

// import .css files directly and it works
import './index.css';

const root = createRoot(document.body);

export default function Frontend() {
  return <h1>Hello, world!</h1>;
}

root.render(<Frontend />);
```

Then, run index.ts

```sh
bun --hot ./index.ts
```

For more information, read the Bun API docs in `node_modules/bun-types/docs/**.mdx`.

## Agent skills

### Issue tracker

Issues are tracked in this repo's GitHub Issues via the `gh` CLI; external PRs are *not* a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical triage roles use their default label strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
