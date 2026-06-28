// Pre-render math detection for the conditional KaTeX stylesheet (#33 / ADR-0006
// decision 3). The KaTeX CSS is linked on a Post only when its source actually
// carries math, so non-math posts and all portfolio pages stay CSS-clean. We
// scan the raw markdown source rather than a frontmatter flag (a forgotten flag
// would silently break rendering) — math present ⇒ CSS linked, by construction.
//
// This mirrors how the renderer (features.math) treats delimiters, so the two
// can't desync: code spans/blocks are stripped first (a `$` inside `code` is not
// math, same as the parser), escaped `\$` is dropped (the literal-dollar
// convention), and only then are `$…$` / `$$…$$` delimiters matched. A regex,
// not Sätteri's parser, because this helper must stay unit-testable under Bun,
// which crashes on Sätteri's native binding.

// Display math `$$…$$` may span lines; inline math `$…$` is single-line with
// non-empty, dollar-free content (matching remark-math's single-dollar rule).
const DISPLAY_MATH = /\$\$[\s\S]+?\$\$/;
const INLINE_MATH = /\$[^$\n]+\$/;

export function hasMathDelimiter(markdown: string): boolean {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, "") // fenced code blocks
    .replace(/`[^`\n]*`/g, "") // inline code spans
    .replace(/\\\$/g, ""); // escaped literal dollars (`\$`)
  return DISPLAY_MATH.test(prose) || INLINE_MATH.test(prose);
}
