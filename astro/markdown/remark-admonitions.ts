// Custom remark plugin: GitHub-style admonitions (`> [!NOTE]`, `> [!WARNING]`,
// …) become styled callout panels (issue #6). Kept in-repo rather than pulling
// an alerts plugin so the transform is unit-testable in isolation and the
// emitted markup/classes line up with the .post-body tokens in blog/[slug].astro.
//
// A GitHub alert is a blockquote whose first line is a bare `[!KIND]` marker:
//
//     > [!NOTE]
//     > Body of the note.
//
// remark parses that as a blockquote → paragraph whose first text node starts
// with the marker. We strip the marker, tag the blockquote so mdast-util-to-hast
// emits a <div class="callout callout-…">, and prepend a titled <p>.

// Minimal structural mdast types — we only touch the fields below, so importing
// the full @types/mdast surface (a transitive-only dep) would be overkill.
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

// Walk the tree converting every admonition blockquote in place; returns the
// same tree so it doubles as the plugin transformer and a unit-testable fn.
export function transformAdmonitions(tree: MdastNode): MdastNode {
  walk(tree);
  return tree;
}

function walk(node: MdastNode): void {
  if (!node.children) return;
  for (const child of node.children) {
    if (child.type === "blockquote") convert(child);
    walk(child);
  }
}

function convert(node: MdastNode): void {
  const firstPara = node.children?.[0];
  if (!firstPara || firstPara.type !== "paragraph" || !firstPara.children) return;
  const firstText = firstPara.children[0];
  if (!firstText || firstText.type !== "text" || firstText.value === undefined) return;

  const match = firstText.value.match(MARKER);
  if (!match) return;
  const alert = ALERTS[match[1] as keyof typeof ALERTS];
  if (!alert) return;

  // Strip the marker; drop the leading paragraph if it held only the marker.
  firstText.value = firstText.value.slice(match[0]!.length);
  if (firstText.value === "") firstPara.children.shift();
  if (firstPara.children.length === 0) node.children!.shift();

  node.data = node.data ?? {};
  node.data.hName = "div";
  node.data.hProperties = { className: ["callout", `callout-${alert.tone}`] };

  node.children!.unshift({
    type: "paragraph",
    data: { hName: "p", hProperties: { className: ["callout-title"] } },
    children: [{ type: "text", value: alert.label }],
  });
}

export default function remarkAdmonitions() {
  return (tree: MdastNode) => transformAdmonitions(tree);
}
