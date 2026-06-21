# Blog routes are server-rendered; the rest of the site is client-rendered

Status: superseded by [ADR-0003](0003-migrate-to-astro-static-site.md) — the site is moving to Astro with zero-JS static output, so the blog (and every page) is prerendered at build time rather than server-rendered per request. The reasoning below is retained for context; the "revisit later" noted under the zero-JS option is what ADR-0003 acts on.

The site is otherwise 100% client-rendered: Bun serves a static HTML shell per section and a React bundle hydrates an empty `#root`. That is fine for a portfolio but fails a blog — crawlers and link-unfurlers hit `/blog/<slug>` and see no title, description, or content. So the blog index and detail routes become function handlers (like the existing PDF route) that server-render React to HTML with Emotion critical-CSS extraction, ship that in the initial response, then hydrate. SEO, social-card unfurling, and a full-content RSS feed are the payoff.

## Considered Options

- **Static-site build** (pre-render posts to `.html` at build time) — rejected: there is already a long-running Bun server in Docker on a VPS, so request-time SSR fits the deploy without adding a build/output stage.
- **Stay CSR, inject `<head>` meta only** — rejected: gives correct link previews but still serves crawlers an empty body; half a blog.
- **Zero-JS static render (no hydration)** — rejected for v1: would force the shared MUI header's mobile-nav (`useState`) into a CSS-only rework, turning a blog task into a nav refactor. Revisit later as a perf optimization.

## Consequences

- The blog is an SSR "island" inside an otherwise-CSR site — an intentional inconsistency in rendering model.
- Requires Emotion SSR plumbing (`CacheProvider` + critical-CSS extraction); carries hydration-mismatch risk to watch for.
- Only `Published` posts are rendered/served in production; non-published slugs 404.
