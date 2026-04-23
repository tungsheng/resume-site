import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ExperimentsPage } from "../../src/features/experiments/page";

describe("ExperimentsPage", () => {
  test("renders the experiments evidence page", () => {
    const html = renderToStaticMarkup(<ExperimentsPage />);

    expect(html).toContain("Experiment Archive");
    expect(html).toContain("Decision summary");
    expect(html).toContain("How to use this page");
    expect(html).toContain("What to compare");
    expect(html).toContain("Choose what you&#x27;re deciding");
    expect(html).toContain("Artifacts updated");
    expect(html).toContain("First response");
    expect(html).toContain("Scale-out policy");
    expect(html).toContain("Target tuning");
    expect(html).toContain("April 21, 2026");
    expect(html).toContain("April 20, 2026");
    expect(html).toContain("Warm path");
    expect(html).toContain("Scale-out policy");
    expect(html).toContain("Target tuning");
    expect(html).toContain("Zero Idle");
    expect(html).toContain("Warm-1");
    expect(html).toContain("View project");
    expect(html).toContain("View resume");
    expect(html).toContain("role=\"tablist\"");
    expect(html).toContain("role=\"tab\"");
    expect(html).toContain("role=\"tabpanel\"");
    expect(html).toContain("Tabs are the only controls here.");
    expect(html).toContain("Zero-idle vs warm-1");
    expect(html).toContain("Question");
    expect(html).toContain("Observation");
    expect(html).toContain("Is warm capacity worth paying for?");
    expect(html).toContain("Warm-1 removes the main first-response bottleneck");
    expect(html).toContain("Where latency and cost move");
    expect(html).toContain("./scripts/evaluate --profile zero-idle --policy active-pressure");
    expect(html).toContain("Profile baseline comparison chart");
    expect(html).toContain("Use the sequence view to see where the first delay appears");
    expect(html).toContain("experiment-tab-profile-baselines");
    expect(html).toContain("experiment-panel-profile-baselines");
    expect(html).toContain("aria-selected=\"true\"");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
  });
});
