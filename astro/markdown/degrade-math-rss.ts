// Degrade rendered KaTeX back to raw TeX for the RSS feed (#34 / ADR-0006
// decision 4). Feeds carry no KaTeX stylesheet, so the rendered span/MathML tree
// shows as a glyph jumble; a reader wants readable source instead. KaTeX embeds
// the original TeX in a `<annotation encoding="application/x-tex">` node, so we
// replace each top-level `.katex` / `.katex-display` span with `<code>$…$</code>`
// (inline) or `<code>$$…$$</code>` (display) carrying that TeX. On-page output is
// untouched — this runs only on the feed's already-rendered HTML string.
//
// Pure string → string so it is unit-testable without a build. A regex can't
// match the deep, self-nested KaTeX span tree, so we depth-scan `<span>` tags to
// find each block's matching close. A display block's outer span precedes its
// inner `.katex` span, so scanning left-to-right and taking the earliest opener
// consumes the whole block once (the inner span is never processed twice).

const ANNOTATION = /<annotation encoding="application\/x-tex">([\s\S]*?)<\/annotation>/;
const DISPLAY_OPEN = '<span class="katex-display">';
const INLINE_OPEN = '<span class="katex">';

// Defensive fallback. The KaTeX plugins (mdast-katex-math.ts + hast-katex-math.ts)
// now inject the rendered markup as a verbatim raw node, so the `<annotation>` TeX
// reaches this path clean and the unescape below is a no-op on current output. It
// stays as cheap insurance: Sätteri historically JSX-escaped a literal `{` in
// re-parsed plugin markup (`{` → `{'{'}`, then smartPunctuation curled the quotes),
// so if that injection regresses, the feed still degrades to readable source. Each
// brace maps to a 5-char `{<quote><brace><quote>}` run.
const BRACE_ESCAPES: [string, string][] = [
  ["{‘{’}", "{"], // curly-quoted open brace
  ["{‘}’}", "}"], // curly-quoted close brace
  ["{'{'}", "{"], // straight-quoted (smartPunctuation off)
  ["{'}'}", "}"],
];

function unescapeBraces(tex: string): string {
  let out = tex;
  for (const [from, to] of BRACE_ESCAPES) out = out.split(from).join(to);
  return out;
}

// Index just past the `</span>` that closes the `<span>` starting at `start`.
function matchingSpanEnd(html: string, start: number): number {
  let depth = 0;
  let i = start;
  while (i < html.length) {
    const open = html.indexOf("<span", i);
    const close = html.indexOf("</span>", i);
    if (close === -1) return html.length; // malformed — bail to end
    if (open !== -1 && open < close) {
      depth++;
      i = open + 5;
    } else {
      depth--;
      i = close + 7;
      if (depth === 0) return i;
    }
  }
  return html.length;
}

export function degradeMathToTeX(html: string): string {
  let out = "";
  let i = 0;
  while (i < html.length) {
    const display = html.indexOf(DISPLAY_OPEN, i);
    const inline = html.indexOf(INLINE_OPEN, i);
    if (display === -1 && inline === -1) {
      out += html.slice(i);
      break;
    }
    // Earliest opener wins; a display block's outer span sorts before its inner
    // `.katex`, so display is handled as one unit.
    const isDisplay = display !== -1 && (inline === -1 || display <= inline);
    const pos = isDisplay ? display : inline;

    out += html.slice(i, pos);
    const end = matchingSpanEnd(html, pos);
    const block = html.slice(pos, end);
    const raw = block.match(ANNOTATION)?.[1];
    const tex = raw === undefined ? undefined : unescapeBraces(raw);
    out += tex === undefined ? block : isDisplay ? `<code>$$${tex}$$</code>` : `<code>$${tex}$</code>`;
    i = end;
  }
  return out;
}
