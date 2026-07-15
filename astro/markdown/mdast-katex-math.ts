// Build-time math rendering (ADR-0006): KaTeX on Astro 7's Sätteri pipeline.
// With `features.math` on, Sätteri parses `$…$`/`$$…$$` and emits `inlineMath`
// and `math` mdast nodes (mirroring remark-math) whose `.value` holds the raw
// TeX. This plugin renders that TeX to static HTML+MathML with KaTeX at build
// time — no client KaTeX, so zero-JS (ADR-0003) holds.
//
// Why mdast, not hast: display math converts to a `<pre><code class="language-
// math">` block, which Astro's Shiki highlighter then claims (re-wrapping it as
// `astro-code` plaintext and dropping the math class) before any hast plugin
// runs. Consuming the math nodes here — before the hast/Shiki phase — sidesteps
// that entirely.
//
// Why NOT inject the KaTeX HTML directly via `{ raw }`: Sätteri's `{ raw }`
// escape hatch *re-parses* its string as Markdown, which mangles KaTeX's MathML
// `<annotation encoding="application/x-tex">` (the copy-as-LaTeX / MathML-source
// payload) two ways: (1) backslash-escapes like `\!` are eaten by the Markdown
// parser (`\!` → `!`), and (2) a literal `{` is JSX-escaped to `{'{'}` at
// serialize time (smartPunctuation then curls the quotes → `{‘{’}`). Plain prose
// braces are untouched — only re-parsed plugin output is. `{ rawHtml }`,
// `{ type:'html' }`, and `data.hChildren` injections all routed through the same
// serializer and corrupted identically.
//
// The fix (Path B): don't hand KaTeX's HTML to a re-parser at all. Stash each
// rendered fragment in the document-scoped `ctx.data` bag and inject a brace-
// and-backslash-free placeholder comment `<!--katex:N-->` instead. The companion
// hast plugin (hast-katex-math.ts) swaps every placeholder for a verbatim hast
// `raw` node, so KaTeX's markup reaches the serializer untouched and the
// annotation TeX is byte-identical to KaTeX's output — clean on-page and in the
// RSS feed. The comment survives the Markdown re-parse as a single `raw` node
// and, for display math, is not a code block, so Shiki never claims it.
//
// The stash + placeholder handoff is OWNED by katex-protocol.ts — both plugins
// import it, so the format and the bag shape can't drift apart. This file keeps
// only the rendering (pure helper + thin Sätteri wrapper, mirroring
// mdast-admonitions.ts, so it is unit-testable).

import { defineMdastPlugin } from "satteri";
import katex from "katex";
import { stashKatexHtml, type KatexStash } from "./katex-protocol";

// Minimal structural mdast type — `inlineMath`/`math` are MdastLiteral nodes, so
// the raw TeX is on `.value`.
type MathLiteral = { value?: string };

// Render one TeX string to KaTeX's HTML+MathML markup (htmlAndMathml is KaTeX's
// default — MathML rides along for screen readers, ADR-0006 decision 4).
// `throwOnError: false` renders a malformed formula in red inline (caught in
// preview) instead of failing an otherwise-unrelated build. Pure string in/out.
export function renderMath(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, { displayMode, throwOnError: false });
}

// Render, stash the HTML on the document bag, and return its placeholder comment.
function injectMath(data: KatexStash, tex: string, displayMode: boolean): { raw: string } {
  return { raw: stashKatexHtml(data, renderMath(tex, displayMode)) };
}

// Thin Sätteri wrapper: dispatch each math node to the renderer + stash. `inlineMath`
// is `$…$` (rendered inline), `math` is `$$…$$` (rendered as a display block).
export default defineMdastPlugin({
  name: "katex-math",
  inlineMath: (node, ctx) => injectMath(ctx.data as KatexStash, (node as MathLiteral).value ?? "", false),
  math: (node, ctx) => injectMath(ctx.data as KatexStash, (node as MathLiteral).value ?? "", true),
});
