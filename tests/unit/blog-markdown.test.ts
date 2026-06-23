import { describe, expect, test } from "bun:test";
import { transformAdmonitions } from "../../astro/markdown/remark-admonitions";
import { transformBlogImages } from "../../astro/markdown/rehype-blog-images";

// Issue #6: the two in-repo Markdown transforms are unit-tested directly against
// minimal mdast/hast trees so the mapping is asserted without a full build.

// Build the mdast a GitHub alert parses into: a blockquote → paragraph whose
// first text node carries the `[!KIND]` marker (newline folded into the value).
const alert = (kind: string, body: string) => ({
  type: "root",
  children: [
    {
      type: "blockquote",
      children: [{ type: "paragraph", children: [{ type: "text", value: `[!${kind}]\n${body}` }] }],
    },
  ],
});

describe("transformAdmonitions (remark)", () => {
  test("maps [!NOTE] to a note callout panel with a title and the body kept", () => {
    const tree = transformAdmonitions(alert("NOTE", "Body text."));
    const callout = tree.children![0]!;
    expect(callout.data?.hName).toBe("div");
    expect(callout.data?.hProperties?.className).toEqual(["callout", "callout-note"]);

    const title = callout.children![0]!;
    expect(title.data?.hProperties?.className).toEqual(["callout-title"]);
    expect(title.children![0]!.value).toBe("Note");

    // marker stripped, body preserved as the next paragraph's text
    expect(callout.children![1]!.children![0]!.value).toBe("Body text.");
  });

  test("maps cautionary kinds to the warning tone with the right label", () => {
    const note = transformAdmonitions(alert("WARNING", "Careful."));
    expect(note.children![0]!.data?.hProperties?.className).toEqual(["callout", "callout-warning"]);
    expect(note.children![0]!.children![0]!.children![0]!.value).toBe("Warning");

    const caution = transformAdmonitions(alert("CAUTION", "Careful."));
    expect(caution.children![0]!.data?.hProperties?.className).toEqual(["callout", "callout-warning"]);

    const tip = transformAdmonitions(alert("TIP", "Hint."));
    expect(tip.children![0]!.data?.hProperties?.className).toEqual(["callout", "callout-note"]);
  });

  test("leaves an ordinary blockquote untouched", () => {
    const tree = {
      type: "root",
      children: [
        { type: "blockquote", children: [{ type: "paragraph", children: [{ type: "text", value: "Just a quote." }] }] },
      ],
    };
    const out = transformAdmonitions(tree);
    expect(out.children![0]!.data).toBeUndefined();
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
