import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ExperimentsPage,
  getExperimentSlugFromPath,
} from "../../src/features/experiments/page";

describe("ExperimentsPage", () => {
  test("renders the experiment catalog with dynamic detail links", () => {
    const html = renderToStaticMarkup(<ExperimentsPage />);

    expect(html).toContain("Experiment Catalog");
    expect(html).toContain("Focused GPU inference experiments");
    expect(html).toContain("Catalog ready");
    expect(html).toContain("Catalog ready; curated live results pending.");
    expect(html).toContain("experiment definitions");
    expect(html).toContain("Renderable locally");
    expect(html).toContain("Measurable with run commands");
    expect(html).toContain("Curated results pending");
    expect(html).toContain("How experiments work");
    expect(html).toContain("Browse experiments");
    expect(html).toContain("Question");
    expect(html).toContain("Cases");
    expect(html).toContain("Serving profile");
    expect(html).toContain("Metrics");
    expect(html).toContain("Result");
    expect(html).toContain("Memory pressure");
    expect(html).toContain("Streaming latency");
    expect(html).toContain("Scheduler behavior");
    expect(html).toContain("Purpose");
    expect(html).toContain("Definition ready");
    expect(html).toContain("KV Cache vs Concurrency");
    expect(html).toContain("Prefill vs Decode Timing");
    expect(html).toContain("Batching Scheduler Tradeoffs");
    expect(html).toContain("Request Pattern Utilization");
    expect(html).toContain("Autoscaling and Queueing Behavior");
    expect(html).toContain("Cost per Useful Work");
    expect(html).toContain("href=\"/experiments/kv-cache\"");
    expect(html).toContain("href=\"/experiments/prefill-decode\"");
    expect(html).toContain("href=\"/experiments/batching\"");
    expect(html).toContain("href=\"/experiments/request-patterns\"");
    expect(html).toContain("href=\"/experiments/autoscaling\"");
    expect(html).toContain("href=\"/experiments/cost\"");
    expect(html).toContain("Platform Validation");
    expect(html).toContain("Measured platform evidence");
    expect(html).toContain("href=\"/experiments/platform-validation\"");
    expect(html).toContain("Prompt length versus concurrency.");
    expect(html).toContain("Concurrency");
    expect(html).toContain("KV memory");
    expect(html).toContain("Curated results pending");
    expect(html).not.toContain("Evaluate evidence from the platform");
    expect(html).not.toContain("Choose an evaluate decision");
    expect(html).not.toContain("experiment-decision-workspace");
    expect(html).not.toContain("role=\"tablist\"");
    expect(html).not.toContain("Artifact contract");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
  });

  test("renders each individual experiment detail page with the shared template", () => {
    const slugs = [
      "kv-cache",
      "prefill-decode",
      "batching",
      "request-patterns",
      "autoscaling",
      "cost",
    ];

    for (const slug of slugs) {
      const html = renderToStaticMarkup(
        <ExperimentsPage initialPath={`/experiments/${slug}`} />,
      );

      expect(html).toContain("Why it matters");
      expect(html).toContain("Run shape");
      expect(html).toContain("Metrics to capture");
      expect(html).toContain("How to run");
      expect(html).toContain("Example local command");
      expect(html).toContain("Example live command");
      expect(html).toContain("Curated live results pending");
      expect(html).toContain("Result status");
      expect(html).toContain("Category");
      expect(html).toContain("Profiles");
      expect(html).toContain("Endpoint");
      expect(html).toContain("Source");
      expect(html).toContain("Results template");
      expect(html).toContain("Report rules");
      expect(html).toContain("href=\"/experiments\"");
      expect(html).toContain("command-token--program");
      expect(html).toContain("command-token--flag");
    }
  });

  test("renders experiment-specific detail content", () => {
    const html = renderToStaticMarkup(
      <ExperimentsPage initialPath="/experiments/kv-cache" />,
    );

    expect(html).toContain("KV Cache vs Concurrency");
    expect(html).toContain("How does longer prompt context reduce stable concurrency and throughput?");
    expect(html).toContain("2 profiles");
    expect(html).toContain("512-8,192 prompt tokens");
    expect(html).toContain("prompt-512-output-100");
    expect(html).toContain("prompt-8192-output-300");
    expect(html).toContain("long-context");
    expect(html).toContain("max stable concurrency");
    expect(html).toContain("KV Cache vs Concurrency example local command");
    expect(html).toContain("KV Cache vs Concurrency example live command");
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/experiments/kv-cache/\"",
    );
  });

  test("renders platform validation on its own detail route", () => {
    const html = renderToStaticMarkup(
      <ExperimentsPage initialPath="/experiments/platform-validation" />,
    );

    expect(html).toContain("Platform Validation Evidence");
    expect(html).toContain("Measured evaluate runs");
    expect(html).toContain("Evaluate evidence from the platform");
    expect(html).toContain("Choose an evaluate decision");
    expect(html).toContain("Warm baseline");
    expect(html).toContain("Scale-out signal");
    expect(html).toContain("Target tuning");
    expect(html).toContain("experiment-decision-workspace");
    expect(html).toContain("role=\"tablist\"");
    expect(html).toContain("role=\"tabpanel\"");
    expect(html).toContain("href=\"/experiments\"");
  });

  test("renders an unknown experiment state for unmatched slugs", () => {
    const html = renderToStaticMarkup(
      <ExperimentsPage initialPath="/experiments/not-real" />,
    );

    expect(html).toContain("Experiment not found");
    expect(html).toContain("No experiment is published for &quot;not-real&quot;.");
    expect(html).toContain("href=\"/experiments\"");
  });

  test("resolves experiment slugs from catalog paths", () => {
    expect(getExperimentSlugFromPath("/experiments")).toBeNull();
    expect(getExperimentSlugFromPath("/experiments/")).toBeNull();
    expect(getExperimentSlugFromPath("/experiments/kv-cache")).toBe("kv-cache");
    expect(getExperimentSlugFromPath("/experiments/cost?tab=run")).toBe("cost");
    expect(getExperimentSlugFromPath("/experiments/platform-validation/")).toBe("platform-validation");
    expect(getExperimentSlugFromPath("/project/cloud-inference-platform")).toBeNull();
    expect(getExperimentSlugFromPath("/experiments/kv-cache/extra")).toBeNull();
  });
});
