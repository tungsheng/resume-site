// The handoff protocol between the two halves of the build-time KaTeX pipeline
// (ADR-0006). The mdast plugin renders each formula and must smuggle the HTML
// past Sätteri's `{ raw }` Markdown re-parse (which corrupts KaTeX markup — see
// mdast-katex-math.ts); the hast plugin swaps it back in verbatim. They talk
// through a document-scoped stash plus a brace- and backslash-free placeholder
// comment `<!--katex:N-->`. This module OWNS that protocol — the stash shape,
// the placeholder format, and both codec directions — so the two plugins can't
// silently disagree (previously the type was declared twice and the format was
// hardcoded three ways across the two files).

// Document-scoped stash carried on Sätteri's per-compile `ctx.data` bag; the
// array and its indices reset per document.
export type KatexStash = { __katex?: string[] };

const PLACEHOLDER_PREFIX = "<!--katex:";

export const katexPlaceholder = (id: number): string => `${PLACEHOLDER_PREFIX}${id}-->`;

const PLACEHOLDER_RE = /<!--katex:(\d+)-->/g;

// Cheap pre-test so the hast visitor can skip untouched raw nodes.
export function hasKatexPlaceholder(value: string): boolean {
  return value.includes(PLACEHOLDER_PREFIX);
}

// Encode: stash one rendered fragment, return the placeholder that stands in
// for it until the hast phase.
export function stashKatexHtml(data: KatexStash, html: string): string {
  const stash = (data.__katex ??= []);
  return katexPlaceholder(stash.push(html) - 1);
}

export function katexStashOf(data: KatexStash): readonly string[] {
  return data.__katex ?? [];
}

// Decode: replace every `<!--katex:N-->` in `value` with its stashed HTML.
// Returns the input unchanged when it holds no (known) placeholder, so callers
// can skip untouched nodes; an unknown index is left as-is so a regression is
// visible rather than silently swallowed.
export function expandKatexPlaceholders(value: string, stash: readonly string[]): string {
  return value.replace(PLACEHOLDER_RE, (whole, id) => stash[Number(id)] ?? whole);
}
