// Build-time math rendering (ADR-0006): KaTeX on Astro 7's Sätteri pipeline.
// With `features.math` on, Sätteri parses `$…$`/`$$…$$` and emits `inlineMath`
// and `math` mdast nodes (mirroring remark-math) whose `.value` holds the raw
// TeX. This plugin renders that TeX to static HTML+MathML with KaTeX and returns
// it through Sätteri's `{ rawHtml }` escape hatch, which injects the markup
// verbatim. Build-time only — no client KaTeX — so zero-JS (ADR-0003) holds.
//
// Why mdast, not hast: display math converts to a `<pre><code class="language-
// math">` block, which Astro's Shiki highlighter then claims (re-wrapping it as
// `astro-code` plaintext and dropping the math class) before any hast plugin
// runs. Consuming the math nodes here — before the hast/Shiki phase — sidesteps
// that entirely. Kept in-repo as a pure render helper + a thin Sätteri wrapper,
// mirroring mdast-admonitions.ts, so the mapping is unit-testable without a build.

import { defineMdastPlugin } from "satteri";
import katex from "katex";

// Minimal structural mdast type — `inlineMath`/`math` are MdastLiteral nodes, so
// the raw TeX is on `.value`.
type MathLiteral = { value?: string };

// Render one TeX string to Sätteri's raw-HTML escape hatch, holding KaTeX's
// HTML+MathML output (htmlAndMathml is KaTeX's default — MathML rides along for
// screen readers, ADR-0006 decision 4). `throwOnError: false` renders a
// malformed formula in red inline (caught in preview) instead of failing an
// otherwise-unrelated build. Pure: a TeX string in, a `{ rawHtml }` value out.
export function renderMath(tex: string, displayMode: boolean): { rawHtml: string } {
  return { rawHtml: katex.renderToString(tex, { displayMode, throwOnError: false }) };
}

// Thin Sätteri wrapper: dispatch each math node to the pure renderer. `inlineMath`
// is `$…$` (rendered inline), `math` is `$$…$$` (rendered as a display block).
// Returning the `{ rawHtml }` object replaces the visited node with raw markup.
export default defineMdastPlugin({
  name: "katex-math",
  inlineMath: (node) => renderMath((node as MathLiteral).value ?? "", false),
  math: (node) => renderMath((node as MathLiteral).value ?? "", true),
});
