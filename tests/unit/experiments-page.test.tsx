import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ExperimentsPage } from "../../src/features/experiments/page";

describe("ExperimentsPage", () => {
  test("renders the experiments evidence page", () => {
    const html = renderToStaticMarkup(<ExperimentsPage />);

    expect(html).toContain("Zero-Idle vs Warm Baseline");
    expect(html).toContain("Zero Idle");
    expect(html).toContain("Warm-1");
    expect(html).toContain("Decision summary");
    expect(html).toContain("View case study");
    expect(html).toContain("View resume");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).toContain("Burst TTFT (secondary metric)");
    expect(html).toContain("./scripts/evaluate --profile zero-idle");
    expect(html).toContain("How to read these runs");
    expect(html).toContain("What these experiments show");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).not.toContain("class=\"page-eyebrow\">Evidence<");
  });
});
