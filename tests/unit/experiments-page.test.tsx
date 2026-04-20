import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ExperimentsPage } from "../../src/features/experiments/page";

describe("ExperimentsPage", () => {
  test("renders the experiments evidence page", () => {
    const html = renderToStaticMarkup(<ExperimentsPage />);

    expect(html).toContain("Experiment Archive");
    expect(html).toContain("How to use this page");
    expect(html).toContain("What each run family answers");
    expect(html).toContain("Profile baselines");
    expect(html).toContain("Policy compare");
    expect(html).toContain("Target calibration");
    expect(html).toContain("Zero Idle");
    expect(html).toContain("Warm-1");
    expect(html).toContain("View case study");
    expect(html).toContain("View resume");
    expect(html).toContain("Open profile comparison");
    expect(html).toContain("Warm-1 policy compare");
    expect(html).toContain("Zero-idle target calibration");
    expect(html).toContain("./scripts/evaluate --profile warm-1 --policy compare --active-target 8");
    expect(html).toContain("Burst TTFT (secondary metric)");
    expect(html).toContain("id=\"profile-comparison\"");
    expect(html).toContain("id=\"policy-compare\"");
    expect(html).toContain("id=\"target-calibration\"");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).not.toContain("class=\"page-eyebrow\">Evidence<");
    expect(html).not.toContain("Decision summary");
    expect(html).not.toContain("How to read these runs");
    expect(html).not.toContain("What these experiments show");
  });
});
