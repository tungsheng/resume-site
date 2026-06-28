// Build-time math rendering (ADR-0006): KaTeX on Astro 7's Sätteri pipeline.
// With `features.math` on, Sätteri parses `$…$`/`$$…$$` and emits `inlineMath`
// and `math` mdast nodes (mirroring remark-math) whose `.value` holds the raw
// TeX. This plugin renders that TeX to static HTML+MathML with KaTeX and injects
// it via Sätteri's `{ raw }` escape hatch. Build-time only — no client KaTeX — so
// zero-JS (ADR-0003) holds.
//
// Why mdast, not hast: display math converts to a `<pre><code class="language-
// math">` block, which Astro's Shiki highlighter then claims (re-wrapping it as
// `astro-code` plaintext and dropping the math class) before any hast plugin
// runs. Consuming the math nodes here — before the hast/Shiki phase — sidesteps
// that entirely.
//
// Known quirk — the MathML `<annotation>` TeX: Sätteri serializes plugin-injected
// content through its MDX-aware path, which JSX-escapes a literal `{` (→ `{'{'}`,
// then smartPunctuation curls the quotes). This corrupts only the invisible
// LaTeX-source `<annotation>` inside the MathML; the visible render and the
// presentation MathML (`<mi>`/`<mo>`, what screen readers actually read) are both
// correct. No raw/hast injection shape avoids it without dropping MathML (which
// the ADR keeps for a11y). The RSS feed needs clean source, so degrade-math-rss
// reverses this escape there (#34). Kept in-repo as a pure render helper + a thin
// Sätteri wrapper, mirroring mdast-admonitions.ts, so it is unit-testable.

import { defineMdastPlugin } from "satteri";
import katex from "katex";

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

// Thin Sätteri wrapper: dispatch each math node to the pure renderer. `inlineMath`
// is `$…$` (rendered inline), `math` is `$$…$$` (rendered as a display block).
// `{ raw }` injects the markup at the mdast phase, ahead of the hast/Shiki step.
export default defineMdastPlugin({
  name: "katex-math",
  inlineMath: (node) => ({ raw: renderMath((node as MathLiteral).value ?? "", false) }),
  math: (node) => ({ raw: renderMath((node as MathLiteral).value ?? "", true) }),
});
