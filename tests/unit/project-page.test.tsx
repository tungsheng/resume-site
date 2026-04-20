import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectPage } from "../../src/features/project/page";

describe("ProjectPage", () => {
  test("renders the flagship project walkthrough", () => {
    const html = renderToStaticMarkup(<ProjectPage />);

    expect(html).toContain("Cloud Inference Platform");
    expect(html).toContain("Case study focus");
    expect(html).toContain("GitHub repo");
    expect(html).toContain("View experiments");
    expect(html).toContain("View resume");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).toContain("What the project needed to prove");
    expect(html).toContain("Decisions that shaped the system");
    expect(html).toContain("How autoscaling works");
    expect(html).toContain("What happened under load");
    expect(html).toContain("Capacity Model");
    expect(html).toContain("Implementation trail");
    expect(html).toContain("href=\"/experiments\"");
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
    expect(html).not.toContain("class=\"page-eyebrow\">Case Study<");
  });
});
