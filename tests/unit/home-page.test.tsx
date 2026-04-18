import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePage } from "../../src/features/home/page";

describe("HomePage", () => {
  test("renders the lighter landing page with core CTAs and featured cards", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Tony Lee");
    expect(html).toContain("Staff Software Engineer — ML Inference &amp; Distributed Systems");
    expect(html).toContain("View project");
    expect(html).toContain("View resume");
    expect(html).toContain("Cloud Inference Platform");
    expect(html).toContain("Experiments and Evidence");
    expect(html).toContain("Core stack");
    expect(html).toContain("What I’m building toward");
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
    expect(html).toContain("href=\"https://linkedin.com/in/tonyslee8\"");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).not.toContain("Failure Modes &amp; Limitations");
    expect(html).toContain("href=\"/resume/tony-lee\"");
  });
});
