import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectPage } from "../../src/features/project/page";

describe("ProjectPage", () => {
  test("renders the flagship project walkthrough", () => {
    const html = renderToStaticMarkup(<ProjectPage />);

    expect(html).toContain("Cloud Inference Platform");
    expect(html).toContain("What this project explores");
    expect(html).toContain("Architecture");
    expect(html).toContain("How Autoscaling Works");
    expect(html).toContain("What happened under load");
    expect(html).toContain("Capacity Model");
    expect(html).toContain("Implementation");
    expect(html).toContain("href=\"/experiments\"");
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
  });
});
