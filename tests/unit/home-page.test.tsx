import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePage } from "../../src/features/home/page";

describe("HomePage", () => {
  test("renders the centered personal hero without extra project grouping", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain(">I&#x27;m<");
    expect(html).toContain(">Tony Lee<");
    expect(html).toContain("class=\"page-title home-hero-title\"");
    expect(html).toContain("ML inference, built to scale.");
    expect(html).toContain("class=\"home-hero-subtitle\"");
    expect(html).toContain("I build GPU serving platforms that turn traffic into measurable capacity.");
    expect(html).not.toContain("Recent proof");
    expect(html).not.toContain("class=\"home-hero-proof\"");
    expect(html).toContain("class=\"page-hero page-hero--header home-hero\"");
    expect(html).not.toContain("page-hero--centered");
    expect(html).not.toContain("View project");
    expect(html).not.toContain("View experiments");
    expect(html).not.toContain("class=\"inline-links page-hero__links\"");
    expect(html).not.toContain("Project</p>");
    expect(html).not.toContain("gpu-inference-lab");
    expect(html).not.toContain("GPU inference lab for comparing autoscaling policies from real serving pressure.");
    expect(html).not.toContain("class=\"card home-project-card home-project-card--link\"");
    expect(html).not.toContain("class=\"home-project-card__action\"");
    expect(html).not.toContain("class=\"home-projects-section__inner\"");
    expect(html).not.toContain("What I bring");
    expect(html).not.toContain("Results from recent platform work");
    expect(html).not.toContain("Measured evidence");
    expect(html).not.toContain("Warm path proven");
    expect(html).not.toContain("href=\"https://linkedin.com/in/tonyslee8\"");
    expect(html).not.toContain("class=\"page-eyebrow\">Home<");
    expect(html).not.toContain("Failure Modes &amp; Limitations");
    expect(html).not.toContain("Download PDF");
    expect(html).not.toContain("GitHub");
    expect(html).not.toContain("Projects");
    expect(html).not.toContain("Selected work");
    expect(html).not.toContain("Featured project");
  });
});
