import { describe, expect, test } from "bun:test";
import {
  selectTocHeadings,
  shouldShowToc,
  TOC_MIN_HEADINGS,
} from "../../astro/content/blog-schema";
import { resolveRelatedLinks } from "../../astro/content/related-links";

// Issue #7: TOC threshold + related-link resolution are pure helpers, tested
// directly so the behaviour is asserted without a full build.

const h = (depth: number, text: string) => ({ depth, slug: text.toLowerCase().replace(/\s+/g, "-"), text });

describe("selectTocHeadings / shouldShowToc (auto-TOC, #7)", () => {
  test("keeps only H2 and H3 headings", () => {
    const headings = [h(1, "Title"), h(2, "One"), h(3, "Sub"), h(4, "Deep")];
    expect(selectTocHeadings(headings).map((x) => x.text)).toEqual(["One", "Sub"]);
  });

  test(`shows the TOC at the ${TOC_MIN_HEADINGS}-heading threshold`, () => {
    const three = [h(2, "a"), h(2, "b"), h(2, "c")];
    expect(shouldShowToc(three)).toBe(true);
    expect(shouldShowToc(three.slice(0, 2))).toBe(false);
  });

  test("ignores H1/H4 when counting toward the threshold", () => {
    // Three H2/H3 plus noise → shown; H1/H4 alone → not.
    expect(shouldShowToc([h(1, "t"), h(2, "a"), h(3, "b"), h(2, "c"), h(4, "d")])).toBe(true);
    expect(shouldShowToc([h(1, "t"), h(4, "a"), h(4, "b"), h(4, "c")])).toBe(false);
  });
});

describe("resolveRelatedLinks (#7)", () => {
  test("returns an empty list when related is absent", () => {
    expect(resolveRelatedLinks(undefined)).toEqual([]);
    expect(resolveRelatedLinks({})).toEqual([]);
  });

  test("resolves projects, experiments, and decisions to labelled links", () => {
    const links = resolveRelatedLinks({
      projects: ["gpu-inference-lab"],
      experiments: ["kv-cache"],
      decisions: ["gpu-inference-lab"],
    });

    const project = links.find((l) => l.kind === "Project");
    expect(project?.href).toBe("/work/gpu-inference-lab");
    expect(project?.label.length).toBeGreaterThan(0);

    const experiment = links.find((l) => l.kind === "Experiment");
    expect(experiment?.href).toBe("/experiments/kv-cache");

    const decision = links.find((l) => l.kind === "Decision");
    expect(decision?.href).toBe("/work/gpu-inference-lab#decisions");
    expect(decision?.label).toContain("decisions");
  });

  test("skips unknown ids/slugs instead of throwing", () => {
    const links = resolveRelatedLinks({
      projects: ["does-not-exist"],
      experiments: ["no-such-experiment"],
      decisions: ["nope"],
    });
    expect(links).toEqual([]);
  });
});
