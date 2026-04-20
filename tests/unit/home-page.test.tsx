import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePage } from "../../src/features/home/page";

describe("HomePage", () => {
  test("renders the centered personal hero with minimal supporting links", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain(">I&#x27;m<");
    expect(html).toContain(">Tony Lee<");
    expect(html).toContain("I design and evaluate GPU-backed inference systems.");
    expect(html).toContain("Recently built a cloud inference platform on AWS and Kubernetes with queue-aware autoscaling, mixed-capacity GPU pools, and measured zero-idle vs warm-baseline behavior.");
    expect(html).toContain("class=\"page-hero page-hero--header page-hero--centered\"");
    expect(html).toContain("View System Design");
    expect(html).toContain("View resume");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).not.toContain("What I bring");
    expect(html).not.toContain("Results from recent platform work");
    expect(html).not.toContain("Cloud inference platform");
    expect(html).not.toContain("Measured evidence");
    expect(html).not.toContain("Warm path proven");
    expect(html).toContain("href=\"https://linkedin.com/in/tonyslee8\"");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).not.toContain("class=\"page-eyebrow\">Home<");
    expect(html).not.toContain("Failure Modes &amp; Limitations");
    expect(html).toContain("href=\"/resume/tony-lee\"");
    expect(html).not.toContain("Download PDF");
  });
});
