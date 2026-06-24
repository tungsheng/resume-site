# Resume Site

Tony Lee's public site — an Astro 7 static build (Bun runtime) deployed to Cloudflare Pages.

## Quick Start

```bash
bun install
bun run dev
```

Open `http://localhost:4321`. (`bun run dev` builds the resume PDF first if it is
missing, then starts the Astro dev server.)

## Common Commands

```bash
bun run dev      # Astro dev server
bun run build    # build resume PDF + static site into dist/
bun run check    # typecheck + unit tests
bun test         # unit tests only
```

## Docs

- [Developer guide](./DEVELOPER.md)
- [Deployment notes](./docs/deployment.md)
- [Architecture decisions](./docs/adr/)
