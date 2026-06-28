// Second half of the build-time KaTeX pipeline (ADR-0006); see mdast-katex-math.ts
// for the full rationale. The mdast plugin renders each formula, stashes the
// HTML on the document-scoped `ctx.data.__katex` array, and leaves a placeholder
// comment `<!--katex:N-->` in its place — because Sätteri's `{ raw }` re-parses
// its string as Markdown, which corrupts KaTeX's `<annotation>` TeX (eats `\!`,
// JSX-escapes `{`). This plugin swaps each placeholder for a verbatim hast `raw`
// node, which Sätteri serializes as-is, so the KaTeX markup reaches the output
// untouched.
//
// We visit `raw` nodes (the placeholder comment arrives as raw HTML, not an
// element) and rewrite the value in place: a single `raw` node can hold more than
// the bare comment (adjacent inline HTML), and inline math can pack several
// placeholders into one node, so we replace every `<!--katex:N-->` occurrence
// rather than the whole node. An unknown index (never happens — the mdast plugin
// always stashes before emitting) is left as-is so a regression is visible.
//
// Pure helper + thin Sätteri wrapper, mirroring the other markdown plugins.

import { defineHastPlugin } from "satteri";

type KatexData = { __katex?: string[] };
type RawNode = { type: "raw"; value: string };

const PLACEHOLDER = /<!--katex:(\d+)-->/g;

// Replace every `<!--katex:N-->` in `value` with its stashed KaTeX HTML. Returns
// the original string unchanged when it holds no (known) placeholder, so callers
// can skip untouched nodes. Pure.
export function expandKatexPlaceholders(value: string, stash: readonly string[]): string {
  return value.replace(PLACEHOLDER, (whole, id) => stash[Number(id)] ?? whole);
}

export default defineHastPlugin({
  name: "katex-math-expand",
  raw(node, ctx) {
    const value = (node as RawNode).value ?? "";
    if (!value.includes("<!--katex:")) return undefined;
    const stash = (ctx.data as KatexData).__katex ?? [];
    const expanded = expandKatexPlaceholders(value, stash);
    return expanded === value ? undefined : ({ type: "raw", value: expanded } as never);
  },
});
