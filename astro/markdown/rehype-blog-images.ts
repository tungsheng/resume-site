// Custom rehype plugin for blog post images (issue #6):
//   • every <img> gets loading="lazy" + decoding="async" so off-screen images
//     don't block paint and don't trigger layout shift on load;
//   • a paragraph that contains only an image is promoted to a <figure>, with
//     the image's alt text surfaced as a <figcaption>.
//
// Images are self-hosted static assets under /assets/blog/<slug>/… (same-origin,
// allowed by the img-src CSP in _headers); CSS in .post-body caps them to the
// container width. Kept in-repo so the transform is unit-testable without a build.

// Minimal structural hast types — we only read/write the fields below.
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

export function transformBlogImages(tree: HastNode): HastNode {
  walk(tree);
  return tree;
}

function walk(node: HastNode): void {
  if (!node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i]!;
    if (child.type === "element" && child.tagName === "img") {
      addImgAttrs(child);
    } else if (child.type === "element" && child.tagName === "p") {
      const figure = figureFor(child);
      if (figure) node.children[i] = figure;
    }
    walk(node.children[i]!);
  }
}

// Returns a <figure> wrapping a lone paragraph image, or null if the paragraph
// is not "just an image" (whitespace-only text siblings are ignored).
function figureFor(p: HastNode): HastNode | null {
  const kids = (p.children ?? []).filter(
    (c) => !(c.type === "text" && (c.value ?? "").trim() === ""),
  );
  const only = kids[0];
  if (kids.length !== 1 || !only || only.type !== "element" || only.tagName !== "img") {
    return null;
  }
  addImgAttrs(only);
  const alt = typeof only.properties?.alt === "string" ? only.properties.alt : "";
  const children: HastNode[] = [only];
  if (alt.trim() !== "") {
    children.push({
      type: "element",
      tagName: "figcaption",
      properties: {},
      children: [{ type: "text", value: alt }],
    });
  }
  return { type: "element", tagName: "figure", properties: { className: ["post-figure"] }, children };
}

function addImgAttrs(img: HastNode): void {
  img.properties = img.properties ?? {};
  img.properties.loading = "lazy";
  img.properties.decoding = "async";
}

export default function rehypeBlogImages() {
  return (tree: HastNode) => transformBlogImages(tree);
}
