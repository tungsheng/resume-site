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
// Thin Sätteri wrapper over the protocol module (katex-protocol.ts), which owns
// the placeholder format, the stash shape, and the decode — shared with the
// mdast plugin so the two halves can't drift apart.

import { defineHastPlugin } from "satteri";
import {
  expandKatexPlaceholders,
  hasKatexPlaceholder,
  katexStashOf,
  type KatexStash,
} from "./katex-protocol";

type RawNode = { type: "raw"; value: string };

export default defineHastPlugin({
  name: "katex-math-expand",
  raw(node, ctx) {
    const value = (node as RawNode).value ?? "";
    if (!hasKatexPlaceholder(value)) return undefined;
    const expanded = expandKatexPlaceholders(value, katexStashOf(ctx.data as KatexStash));
    return expanded === value ? undefined : ({ type: "raw", value: expanded } as never);
  },
});
