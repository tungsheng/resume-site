import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectPage } from "../../src/features/project/page";

describe("ProjectPage", () => {
  test("renders the flagship project walkthrough", () => {
    const html = renderToStaticMarkup(<ProjectPage />);

    expect(html).toContain("Cloud Inference Platform");
    expect(html).toContain(
      "Today the lab proves three operator paths: zero-GPU cold start, policy comparison, and active-pressure target calibration."
    );
    expect(html).toContain("GitHub repo");
    expect(html).toContain("View experiments");
    expect(html).toContain("View resume");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).toContain("What matters most");
    expect(html).toContain("How the system is organized");
    expect(html).toContain("Where the design is strong and where it still needs work");
    expect(html).toContain("Current limitation and next step");
    expect(html).toContain("Implementation trail");
    expect(html).toContain("Active-pressure HPA");
    expect(html).toContain("April 20, 2026");
    expect(html).toContain("What changed");
    expect(html).toContain("What comes next");
    expect(html).toContain("Featured result");
    expect(html).toContain("Supporting readouts");
    expect(html).toContain("href=\"/experiments\"");
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
    expect(html).not.toContain("class=\"page-eyebrow\">Case Study<");
    expect(html).not.toContain("Case study focus");
    expect(html).not.toContain("What the repo proves now");
    expect(html).not.toContain("What this system is good for");
  });
});
