import { describe, expect, test } from "bun:test";
import { buildAdmonition } from "../../astro/markdown/mdast-admonitions";
import { figureForParagraph, withImgAttrs } from "../../astro/markdown/hast-blog-images";
import { renderMath } from "../../astro/markdown/mdast-katex-math";
import { hasMathDelimiter } from "../../astro/markdown/detect-math";
import { degradeMathToTeX } from "../../astro/markdown/degrade-math-rss";

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

describe("blog-images (hast)", () => {
  const img = (alt: string) => ({
    type: "element",
    tagName: "img",
    properties: { src: "/assets/blog/x/y.svg", alt } as Record<string, unknown>,
    children: [],
  });
  const para = (...children: any[]) => ({ type: "element", tagName: "p", properties: {}, children });

  test("wraps a lone paragraph image as a figure with the alt as figcaption", () => {
    const figure = figureForParagraph(para(img("A diagram")))!;
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
    const figure = figureForParagraph(para(img("")))!;
    expect(figure.tagName).toBe("figure");
    expect(figure.children!.length).toBe(1);
  });

  test("ignores whitespace-only text siblings when detecting a lone image", () => {
    const figure = figureForParagraph(para({ type: "text", value: "  \n" }, img("Diagram")))!;
    expect(figure.tagName).toBe("figure");
  });

  test("returns null for a paragraph that is not a lone image (inline image)", () => {
    const p = para({ type: "text", value: "before " }, img("inline"), { type: "text", value: " after" });
    expect(figureForParagraph(p)).toBeNull();
  });

  test("withImgAttrs adds lazy/async to an inline image without mutating the input", () => {
    const original = img("inline");
    const out = withImgAttrs(original);
    expect(out.properties?.loading).toBe("lazy");
    expect(out.properties?.decoding).toBe("async");
    // Sätteri passes readonly nodes — the original must be untouched.
    expect(original.properties?.loading).toBeUndefined();
  });
});

// #32 / ADR-0006: build-time KaTeX. The plugin renders `inlineMath`/`math` mdast
// nodes to KaTeX HTML at the mdast level. KaTeX output is deterministic, so the
// render helper is asserted directly here (the full pipeline — Sätteri parse +
// Shiki coexistence + zero-JS — is exercised in tests/integration/blog-build.test.ts).
describe("katex-math (mdast)", () => {
  test("renders inline math to a KaTeX span with MathML, not display mode", () => {
    const html = renderMath("E = mc^2", false);
    expect(html).toContain('class="katex"');
    expect(html).toContain("<math"); // htmlAndMathml: MathML for screen readers
    expect(html).toContain("annotation"); // the raw-TeX annotation rides along
    expect(html).not.toContain("katex-display");
  });

  test("renders display math as a block with the katex-display wrapper", () => {
    const html = renderMath("\\int_0^1 x^2 \\, dx", true);
    expect(html).toContain("katex-display");
    expect(html).toContain('display="block"');
  });

  test("does not throw on a malformed formula (throwOnError: false)", () => {
    // A bad formula renders in red inline rather than failing the build.
    let html = "";
    expect(() => (html = renderMath("\\frac{", false))).not.toThrow();
    expect(html.length).toBeGreaterThan(0);
  });
});

// #33 / ADR-0006: the KaTeX stylesheet is linked only when a Post's source
// carries math, detected pre-render by scanning the raw markdown (no frontmatter
// flag). The scan must agree with what the renderer treats as math, so `$` inside
// code and escaped `\$` must NOT count.
describe("hasMathDelimiter (math stylesheet auto-link, #33)", () => {
  test("detects inline and display math in prose", () => {
    expect(hasMathDelimiter("normalizes as $\\sum_i a_i = 1$ here")).toBe(true);
    expect(hasMathDelimiter("block:\n\n$$\n\\int_0^1 x\\,dx\n$$\n")).toBe(true);
  });

  test("returns false for prose with no math", () => {
    expect(hasMathDelimiter("# Title\n\nJust ordinary prose, no formulae.")).toBe(false);
  });

  test("ignores a `$` inside inline code or fenced code blocks", () => {
    expect(hasMathDelimiter("run `echo $HOME` then `echo $PATH`")).toBe(false);
    expect(hasMathDelimiter("```sh\nA=$1\nB=$2\necho $A $B\n```")).toBe(false);
  });

  test("ignores escaped literal dollars (`\\$`)", () => {
    expect(hasMathDelimiter("it costs \\$5, up from \\$3 last year")).toBe(false);
  });
});

// #34 / ADR-0006 decision 4: the RSS feed has no KaTeX stylesheet, so rendered
// formulas would be a glyph jumble. The feed degrades each `.katex` span back to
// raw TeX (from the MathML annotation KaTeX embeds). Fed real KaTeX output here.
describe("degradeMathToTeX (RSS feed, #34)", () => {
  test("replaces inline KaTeX with <code>$…$</code> and drops the span markup", () => {
    const html = `<p>before ${renderMath("E = mc^2", false)} after</p>`;
    const out = degradeMathToTeX(html);
    expect(out).toContain("<code>$E = mc^2$</code>");
    expect(out).not.toContain('class="katex"');
    expect(out).toContain("before");
    expect(out).toContain("after");
  });

  test("replaces display KaTeX with <code>$$…$$</code>", () => {
    const out = degradeMathToTeX(renderMath("\\int_0^1 x \\, dx", true));
    expect(out).toContain("<code>$$\\int_0^1 x \\, dx$$</code>");
    expect(out).not.toContain("katex-display");
    expect(out).not.toContain('class="katex"');
  });

  test("degrades multiple formulas in one document and leaves no KaTeX behind", () => {
    const html = `<p>${renderMath("a^2", false)}</p>` + renderMath("\\sum x", true);
    const out = degradeMathToTeX(html);
    expect(out).toContain("<code>$a^2$</code>");
    expect(out).toContain("<code>$$\\sum x$$</code>");
    expect(out).not.toContain("katex"); // no katex/katex-display/katex-mathml left
  });

  test("reverses Sätteri's JSX brace-escaping so feed TeX is readable", () => {
    // Simulate the annotation as it arrives post-build: `{` → `{‘{’}` (curled).
    const escaped =
      '<span class="katex"><span class="katex-mathml"><math><semantics>' +
      '<annotation encoding="application/x-tex">\\frac{‘{’}a{‘}’}{‘{’}b{‘}’}</annotation>' +
      "</semantics></math></span></span>";
    const out = degradeMathToTeX(escaped);
    expect(out).toBe("<code>$\\frac{a}{b}$</code>");
  });

  test("passes non-math HTML through untouched", () => {
    const html = '<p>Just prose with a <a href="/x">link</a> and <code>inline code</code>.</p>';
    expect(degradeMathToTeX(html)).toBe(html);
  });
});
