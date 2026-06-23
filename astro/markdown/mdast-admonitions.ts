// GitHub-style admonitions (`> [!NOTE]`, `> [!WARNING]`, …) become styled
// callout panels. Ported onto Astro 7's Sätteri Markdown pipeline (ADR-0004,
// #16) from the original remark transform. Kept in-repo so the mapping is
// unit-testable in isolation and the emitted markup/classes line up with the
// .post-body callout tokens in blog/[slug].astro.
//
// A GitHub alert is a blockquote whose first line is a bare `[!KIND]` marker:
//
//     > [!NOTE]
//     > Body of the note.
//
// Sätteri parses that as a blockquote → paragraph whose first text node starts
// with the marker. We strip the marker and return a replacement blockquote
// tagged so the mdast→hast step emits <div class="callout callout-…"> (Sätteri
// honors data.hName / data.hProperties), with a titled <p> prepended.

import { defineMdastPlugin, type MdastNode as SatteriMdastNode } from "satteri";

// Minimal structural mdast types — we only read/build the fields below, so
// importing the full @types/mdast surface would be overkill.
type MdastNode = {
  type: string;
  value?: string;
  children?: MdastNode[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
};

// GitHub supports five alert kinds; the site has two visual tones (accent +
// warning), so informational kinds collapse to "note" and cautionary kinds to
// "warning". `label` is the human-facing title rendered atop the panel.
const ALERTS: Record<string, { tone: "note" | "warning"; label: string }> = {
  NOTE: { tone: "note", label: "Note" },
  TIP: { tone: "note", label: "Tip" },
  IMPORTANT: { tone: "note", label: "Important" },
  WARNING: { tone: "warning", label: "Warning" },
  CAUTION: { tone: "warning", label: "Caution" },
};

const MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/;

// Pure, non-mutating: given a blockquote node, return the transformed callout
// blockquote (data.hName=div + tone classes + prepended title + marker stripped
// from the body), or null when the blockquote is not a GitHub admonition (in
// which case it is left untouched). Sätteri passes readonly nodes, so this never
// mutates the input — the visitor returns the replacement instead.
export function buildAdmonition(node: MdastNode): MdastNode | null {
  const firstPara = node.children?.[0];
  if (!firstPara || firstPara.type !== "paragraph" || !firstPara.children) return null;
  const firstText = firstPara.children[0];
  if (!firstText || firstText.type !== "text" || firstText.value === undefined) return null;

  const match = firstText.value.match(MARKER);
  if (!match) return null;
  const alert = ALERTS[match[1] as keyof typeof ALERTS];
  if (!alert) return null;

  // Strip the marker from the first text node. If that empties the text node,
  // drop it; if the leading paragraph then holds nothing, drop the paragraph —
  // so a marker on its own line leaves only the body behind.
  const stripped = firstText.value.slice(match[0]!.length);
  const body = node.children!.slice();
  if (stripped === "") {
    const rest = firstPara.children.slice(1);
    if (rest.length === 0) body.shift();
    else body[0] = { ...firstPara, children: rest };
  } else {
    const paraChildren = firstPara.children.slice();
    paraChildren[0] = { ...firstText, value: stripped };
    body[0] = { ...firstPara, children: paraChildren };
  }

  const title: MdastNode = {
    type: "paragraph",
    data: { hName: "p", hProperties: { className: ["callout-title"] } },
    children: [{ type: "text", value: alert.label }],
  };

  return {
    type: "blockquote",
    data: { hName: "div", hProperties: { className: ["callout", `callout-${alert.tone}`] } },
    children: [title, ...body],
  };
}

// Thin Sätteri wrapper: dispatch each blockquote to the pure builder. Returning
// a node replaces the visited blockquote; returning undefined leaves it as-is.
// A re-visit of the replacement is a no-op (its first child is the title, which
// carries no marker), so there is no risk of an infinite transform loop.
export default defineMdastPlugin({
  name: "admonitions",
  blockquote(node) {
    // The structural mdast shape we read/build is a subset of Sätteri's strict
    // node union; bridge the cast at this one boundary so the pure helper stays
    // dependency-free and unit-testable on plain objects.
    const built = buildAdmonition(node as unknown as MdastNode);
    return (built ?? undefined) as SatteriMdastNode | undefined;
  },
});
