# Blog posts are authored as Markdown files

Status: accepted — preserved through ADR-0003/0004. Now implemented as Astro **content collections** (`content/blog/<slug>.md`, parsed at build time), not the server-startup parse the original text below describes.

Every other content surface on this site (projects, experiments, decisions, resume) is a typed TypeScript data module. Blog Posts deliberately break that pattern: each Post is a Markdown file in `content/blog/<slug>.md` (filename = slug) with YAML frontmatter, parsed and cached at server startup. We chose this for authoring speed and portability — the whole point of the blog is writing prose at a cadence, which hand-authored `blocks[]` arrays make painful, and Markdown keeps posts portable to any future platform.

## Considered Options

- **Typed `blocks[]` modules** (like the rest of the site) — rejected: type-safe and consistent, but too slow to write prose and not portable.
- **MDX** — rejected for v1: more tooling, and JSX-in-posts ties content to this codebase.

## Consequences

- The bespoke `flow` (numbered-step) and styled `table` block components do not carry over; posts use native GFM tables and ordered lists. Callouts are preserved via admonition syntax (`> [!WARNING]`) mapped to the existing accent/warning panels.
- Rendered Markdown is sanitized before injection, keeping the strict CSP intact even though the author is trusted.
- The blog's content model diverges from the rest of the site by design — readers of the codebase should not expect a typed module for Posts.
