// Blog-post image handling, ported onto Astro 7's Sätteri pipeline (ADR-0004,
// #17) from the original rehype transform:
//   • every <img> gets loading="lazy" + decoding="async" so off-screen images
//     don't block paint and don't trigger layout shift on load;
//   • a paragraph that contains only an image is promoted to a <figure>, with
//     the image's alt text surfaced as a <figcaption>.
//
// Images are self-hosted static assets under /assets/blog/<slug>/… (same-origin,
// allowed by the img-src CSP in _headers); CSS in .post-body caps them to the
// container width. Kept in-repo so the transform is unit-testable without a build.

import { defineHastPlugin, type HastNode as SatteriHastNode } from "satteri";

// Minimal structural hast types — we only read/build the fields below.
type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

// Return a copy of an <img> with lazy/async loading attributes set. Pure /
// non-mutating — Sätteri passes readonly nodes, so the visitor returns the copy.
export function withImgAttrs(img: HastNode): HastNode {
  return { ...img, properties: { ...(img.properties ?? {}), loading: "lazy", decoding: "async" } };
}

// Is this paragraph "just an image"? Whitespace-only text siblings are ignored,
// so `<p>\n  <img>\n</p>` still counts. Named because two things need to agree
// on it: the paragraph visitor, which replaces such a paragraph with a figure,
// and the image visitor, which must NOT also transform the image inside one.
export function isLoneImageParagraph(node: HastNode): boolean {
  if (node.tagName !== "p") return false;
  const kids = (node.children ?? []).filter(
    (c) => !(c.type === "text" && (c.value ?? "").trim() === ""),
  );
  const only = kids[0];
  return kids.length === 1 && !!only && only.type === "element" && only.tagName === "img";
}

// Returns a <figure class="post-figure"> wrapping a lone-paragraph image (with
// lazy/async attrs, plus a <figcaption> from the alt text when present), or null
// if the paragraph is not "just an image". Pure / non-mutating.
export function figureForParagraph(p: HastNode): HastNode | null {
  if (!isLoneImageParagraph(p)) return null;
  const only = (p.children ?? []).find(
    (c) => c.type === "element" && c.tagName === "img",
  )!;
  const img = withImgAttrs(only);
  const alt = typeof only.properties?.alt === "string" ? only.properties.alt : "";
  const children: HastNode[] = [img];
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

// Thin Sätteri wrapper. The filter matches <p> and <img>; the visit branches on
// tag name. A lone-image paragraph is replaced by a <figure>, which sets the
// img attrs itself; any OTHER image — inline among text — is left in place with
// just the lazy/async attrs added.
//
// The image branch skips images inside a lone-image paragraph. Without that
// check both branches queue a transform for the same image, and since the
// paragraph is replaced wholesale the image's transform lands on a node that no
// longer exists — which Sätteri drops, with a warning, for EVERY image on the
// site. The output was correct (the figure already carried the attrs) but the
// build emitted 8 warnings covering all 30 images, which is exactly the noise
// that hides a real dropped transform.
export default defineHastPlugin({
  name: "blog-images",
  element: {
    filter: ["img", "p"],
    visit(node, ctx) {
      const n = node as unknown as HastNode;
      if (n.tagName === "p") return (figureForParagraph(n) ?? undefined) as SatteriHastNode | undefined;
      if (n.tagName === "img") {
        const parent = ctx.parent(node) as unknown as HastNode | undefined;
        if (parent && isLoneImageParagraph(parent)) return undefined;
        return withImgAttrs(n) as unknown as SatteriHastNode;
      }
      return undefined;
    },
  },
});
