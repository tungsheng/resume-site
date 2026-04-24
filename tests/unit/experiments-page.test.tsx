import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ExperimentsPage } from "../../src/features/experiments/page";

describe("ExperimentsPage", () => {
  test("renders the experiments evidence page", () => {
    const html = renderToStaticMarkup(<ExperimentsPage />);

    expect(html).toContain("Experiment Archive");
    expect(html).toContain("Experiment purpose");
    expect(html).toContain("Why these experiments exist");
    expect(html).toContain("Choose what you&#x27;re deciding");
    expect(html).toContain("Scale-out signal");
    expect(html).toContain("April 20, 2026");
    expect(html).toContain("Warm baseline");
    expect(html).toContain("Active target");
    expect(html).toContain("Zero-idle");
    expect(html).toContain("Warm baseline (warm-1)");
    expect(html).toContain("View project");
    expect(html).toContain("View resume");
    expect(html).toContain("role=\"tablist\"");
    expect(html).toContain("role=\"tab\"");
    expect(html).toContain("role=\"tabpanel\"");
    expect(html).toContain(
      "Each run isolates one rollout trade-off. Choose one below for the current call and proof.",
    );
    expect(html).toContain("Trade-off");
    expect(html).toContain("Idle cost");
    expect(html).toContain("First response");
    expect(html).toContain("Burst spend");
    expect(html).toContain("Replica 2 speed");
    expect(html).toContain("Aggressive target");
    expect(html).toContain("Readable metrics");
    expect(html).toContain("Choose a decision. The current call and supporting detail appear underneath.");
    expect(html).toContain("Warm baseline");
    expect(html).toContain("Keep 1 warm path");
    expect(html).toContain("84s vs 447s");
    expect(html).toContain("Strong recommendation");
    expect(html).toContain("Scale-out signal");
    expect(html).toContain("Use active-pressure");
    expect(html).toContain("Active target");
    expect(html).toContain("Recommend target 6");
    expect(html).toContain("Current call");
    expect(html).toContain("warm-1 = 1 ready path");
    expect(html).toContain("Why");
    expect(html).toContain("Compact chart");
    expect(html).toContain("Measured proof");
    expect(html).toContain("Problem statement");
    expect(html).toContain("Observed outcome");
    expect(html).toContain("Does one warm path justify its idle cost?");
    expect(html).toContain("One warm path sharply reduces the first public wait");
    expect(html).toContain("Where latency and cost move");
    expect(html).toContain("./scripts/evaluate --profile zero-idle --policy active-pressure");
    expect(html).toContain("Profile baseline comparison chart");
    expect(html).toContain("Measured proof");
    expect(html).toContain("Sequence view shows where zero-idle waits before first response");
    expect(html).toContain("experiment-tab-profile-baselines");
    expect(html).toContain("experiment-panel");
    expect(html).toContain("aria-selected=\"true\"");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
  });
});
