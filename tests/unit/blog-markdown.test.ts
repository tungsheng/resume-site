import { describe, expect, test } from "bun:test";
import { buildAdmonition } from "../../astro/markdown/mdast-admonitions";
import { transformBlogImages } from "../../astro/markdown/rehype-blog-images";

// Issue #6 / ADR-0004 (#16): the two in-repo Markdown transforms are unit-tested
// directly against minimal mdast/hast nodes so the mapping is asserted without a
// full build. The admonition transform is now a Sätteri mdast plugin: a pure
// per-blockquote builder that returns the replacement callout node (or null).

// Build the blockquote a GitHub alert parses into: a paragraph whose first text
// node carries the `[!KIND]` marker (newline folded into the value).
const blockquote = (kind: string, body: string) => ({
  type: "blockquote",
  children: [{ type: "paragraph", children: [{ type: "text", value: `[!${kind}]\n${body}` }] }],
});

describe("buildAdmonition (mdast)", () => {
  test("maps [!NOTE] to a note callout panel with a title and the body kept", () => {
    const callout = buildAdmonition(blockquote("NOTE", "Body text."))!;
    expect(callout.data?.hName).toBe("div");
    expect(callout.data?.hProperties?.className).toEqual(["callout", "callout-note"]);

    const title = callout.children![0]!;
    expect(title.data?.hProperties?.className).toEqual(["callout-title"]);
    expect(title.children![0]!.value).toBe("Note");

    // marker stripped, body preserved as the next paragraph's text
    expect(callout.children![1]!.children![0]!.value).toBe("Body text.");
  });

  test("maps cautionary kinds to the warning tone with the right label", () => {
    const warning = buildAdmonition(blockquote("WARNING", "Careful."))!;
    expect(warning.data?.hProperties?.className).toEqual(["callout", "callout-warning"]);
    expect(warning.children![0]!.children![0]!.value).toBe("Warning");

    const caution = buildAdmonition(blockquote("CAUTION", "Careful."))!;
    expect(caution.data?.hProperties?.className).toEqual(["callout", "callout-warning"]);

    const tip = buildAdmonition(blockquote("TIP", "Hint."))!;
    expect(tip.data?.hProperties?.className).toEqual(["callout", "callout-note"]);
  });

  test("returns null for an ordinary blockquote (left untouched)", () => {
    const plain = {
      type: "blockquote",
      children: [{ type: "paragraph", children: [{ type: "text", value: "Just a quote." }] }],
    };
    expect(buildAdmonition(plain)).toBeNull();
  });

  test("does not mutate the input blockquote (Sätteri passes readonly nodes)", () => {
    const input = blockquote("NOTE", "Body text.");
    const before = JSON.stringify(input);
    buildAdmonition(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});

describe("transformBlogImages (rehype)", () => {
  const img = (alt: string) => ({
    type: "element",
    tagName: "img",
    properties: { src: "/assets/blog/x/y.svg", alt },
    children: [],
  });

  test("wraps a lone paragraph image as a figure with the alt as figcaption", () => {
    const tree = { type: "root", children: [{ type: "element", tagName: "p", properties: {}, children: [img("A diagram")] }] };
    const out = transformBlogImages(tree);

    const figure = out.children![0]!;
    expect(figure.tagName).toBe("figure");
    expect(figure.properties?.className).toEqual(["post-figure"]);

    const [image, caption] = figure.children!;
    expect(image!.tagName).toBe("img");
    expect(image!.properties?.loading).toBe("lazy");
    expect(image!.properties?.decoding).toBe("async");
    expect(caption!.tagName).toBe("figcaption");
    expect(caption!.children![0]!.value).toBe("A diagram");
  });

  test("omits the figcaption when the image has no alt text", () => {
    const tree = { type: "root", children: [{ type: "element", tagName: "p", properties: {}, children: [img("")] }] };
    const out = transformBlogImages(tree);
    const figure = out.children![0]!;
    expect(figure.tagName).toBe("figure");
    expect(figure.children!.length).toBe(1);
  });

  test("adds lazy/async to an inline image without rewrapping the paragraph", () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "p",
          properties: {},
          children: [{ type: "text", value: "before " }, img("inline"), { type: "text", value: " after" }],
        },
      ],
    };
    const out = transformBlogImages(tree);
    const para = out.children![0]!;
    expect(para.tagName).toBe("p");
    const inline = para.children!.find((c) => c.tagName === "img")!;
    expect(inline.properties?.loading).toBe("lazy");
    expect(inline.properties?.decoding).toBe("async");
  });
});
