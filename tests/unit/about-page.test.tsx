import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AboutPage } from "../../src/features/about/page";

describe("AboutPage", () => {
  test("reuses the home experience so about is no longer a separate profile page", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain(">Tony Lee<");
    expect(html).toContain("I design and evaluate GPU-backed inference systems.");
    expect(html).toContain(
      "Recently built a cloud inference platform on AWS and Kubernetes with queue-aware autoscaling, mixed-capacity GPU pools, and measured zero-idle vs warm-baseline behavior."
    );
    expect(html).toContain("class=\"page-hero page-hero--header page-hero--centered\"");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).toContain("href=\"/resume/tony-lee\"");
    expect(html).toContain("href=\"https://linkedin.com/in/tonyslee8\"");
    expect(html).not.toContain("About Tony Lee");
    expect(html).not.toContain("How I tend to show up on teams");
    expect(html).not.toContain("Download PDF");
  });
});
