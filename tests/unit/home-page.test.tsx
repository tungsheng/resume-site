import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePage } from "../../src/features/home/page";

describe("HomePage", () => {
  test("renders the landing page with proof-first orientation and focused paths", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Tony Lee");
    expect(html).toContain("Staff Software Engineer — ML Inference &amp; Distributed Systems");
    expect(html).toContain("Read case study");
    expect(html).toContain("View resume");
    expect(html).toContain("Download PDF");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).toContain("What the work shows");
    expect(html).toContain("Case study");
    expect(html).toContain("Evidence");
    expect(html).toContain("What I optimize for");
    expect(html).toContain("Warm-1 first public response");
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
    expect(html).toContain("href=\"https://linkedin.com/in/tonyslee8\"");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).not.toContain("class=\"page-eyebrow\">Home<");
    expect(html).not.toContain("Failure Modes &amp; Limitations");
    expect(html).toContain("href=\"/resume/tony-lee\"");
  });
});
