import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePage } from "../../src/features/home/page";

describe("HomePage", () => {
  test("renders the centered personal hero and a featured project section", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain(">I&#x27;m<");
    expect(html).toContain(">Tony Lee<");
    expect(html).toContain("I design and evaluate GPU-backed inference systems.");
    expect(html).toContain("Recently built a cloud inference platform on AWS and Kubernetes with queue-aware autoscaling, mixed-capacity GPU pools, and measured zero-idle vs warm-baseline behavior.");
    expect(html).toContain("class=\"page-hero page-hero--header page-hero--centered\"");
    expect(html).toContain("View System Design");
    expect(html).toContain("View resume");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).toContain("Project");
    expect(html).toContain("gpu-inference-lab");
    expect(html).toContain(
      "GPU inference lab for comparing autoscaling policies from real serving pressure."
    );
    expect(html).toContain("View project");
    expect(html).toContain("class=\"card home-project-card home-project-card--link\"");
    expect(html).toContain("class=\"home-project-card__action\"");
    expect(html).toContain("class=\"home-projects-section__inner\"");
    expect(html).not.toContain("What I bring");
    expect(html).not.toContain("Results from recent platform work");
    expect(html).not.toContain("Measured evidence");
    expect(html).not.toContain("Warm path proven");
    expect(html).toContain("href=\"https://linkedin.com/in/tonyslee8\"");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).not.toContain("class=\"page-eyebrow\">Home<");
    expect(html).not.toContain("Failure Modes &amp; Limitations");
    expect(html).toContain("href=\"/resume/tony-lee\"");
    expect(html).not.toContain("Download PDF");
    expect(html).not.toContain("GitHub repo");
    expect(html).not.toContain("Projects");
    expect(html).not.toContain("Selected work");
    expect(html).not.toContain("Featured project");
  });
});
