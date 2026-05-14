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
    expect(html).toContain("request-pattern, cost, and FP4 quantization matrices still pending");
    expect(html).toContain("7 experiments");
    expect(html).toContain("Local render");
    expect(html).toContain("Live runners");
    expect(html).toContain("4 measured");
    expect(html).toContain("3 pending");
    expect(html).toContain("href=\"#experiment-catalog-list\"");
    expect(html).not.toContain("definition catalog");
    expect(html).not.toContain(">View resume<");
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
    expect(html).toContain("Run ready");
    expect(html).toContain("Result measured");
    expect(html).toContain("Result pending");
    expect(html).toContain("KV Cache vs Concurrency");
    expect(html).toContain("Prefill vs Decode Timing");
    expect(html).toContain("Batching Scheduler Tradeoffs");
    expect(html).toContain("Request Pattern Utilization");
    expect(html).toContain("Autoscaling and Queueing Behavior");
    expect(html).toContain("Cost per Useful Work");
    expect(html).toContain("FP4 Quantization Optimization");
    expect(html).toContain("href=\"/experiments/kv-cache\"");
    expect(html).toContain("href=\"/experiments/prefill-decode\"");
    expect(html).toContain("href=\"/experiments/batching\"");
    expect(html).toContain("href=\"/experiments/request-patterns\"");
    expect(html).toContain("href=\"/experiments/autoscaling\"");
    expect(html).toContain("href=\"/experiments/cost\"");
    expect(html).toContain("href=\"/experiments/fp4\"");
    expect(html).toContain("Related project evidence");
    expect(html).toContain("Platform decisions live with the project");
    expect(html).toContain("not catalog experiments");
    expect(html).toContain("href=\"/project/cloud-inference-platform/validation\"");
    expect(html).not.toContain("href=\"/experiments/platform-validation\"");
    expect(html).toContain("Full delivery can hide queueing.");
    expect(html).toContain("Concurrency");
    expect(html).toContain("KV memory");
    expect(html).toContain("knee refinement");
    expect(html).toContain("streaming split");
    expect(html).toContain("scheduler compare");
    expect(html).toContain("queueing behavior");
    expect(html).toContain("BF16 vs NVFP4 vs SmoothQuant.");
    expect(html).not.toContain("Evaluate evidence from the platform");
    expect(html).not.toContain("Choose an evaluate decision");
    expect(html).not.toContain("experiment-decision-workspace");
    expect(html).not.toContain("role=\"tablist\"");
    expect(html).not.toContain("Artifact contract");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
  });

  test("renders pending experiment detail pages with the shared template", () => {
    const slugs = [
      "request-patterns",
      "cost",
      "fp4",
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
      expect(html).toContain("Next runs to curate");
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
    expect(html).toContain("5 profiles");
    expect(html).toContain("512-8,192 prompt tokens");
    expect(html).toContain("prompt-512-output-100");
    expect(html).toContain("prompt-8192-output-300");
    expect(html).toContain("long-context");
    expect(html).toContain("long-context-seqs-24");
    expect(html).toContain("max stable concurrency");
    expect(html).toContain("KV Cache vs Concurrency example local command");
    expect(html).toContain("KV Cache vs Concurrency example live command");
    expect(html).toContain("Measured result");
    expect(html).toContain("Result evidence");
    expect(html).toContain("Full delivery is not enough");
    expect(html).toContain("Latest reports: 2026-05-13");
    expect(html).toContain("every request still completes");
    expect(html).toContain("Clean through");
    expect(html).toContain("1.10 req/s");
    expect(html).toContain("Queue starts");
    expect(html).toContain("1.15 req/s");
    expect(html).toContain("Practical edge");
    expect(html).toContain("100% delivered; p95 54.35s; 30 waiting");
    expect(html).toContain("8192/300 rate sweep");
    expect(html).toContain("Profile variants near the knee");
    expect(html).toContain("seqs-24 @ 1.15");
    expect(html).toContain("seqs-16 @ 1.15");
    expect(html).toContain("97.4% delivered");
    expect(html).toContain("14.31s");
    expect(html).toContain("21.67s");
    expect(html).toContain("35.35s");
    expect(html).toContain("54.35s");
    expect(html).toContain("93.78s");
    expect(html).toContain("180.27s");
    expect(html).toContain("Evidence boundary");
    expect(html).toContain("Selected reports");
    expect(html).toContain("1.20 req/s report");
    expect(html).toContain("Results summary");
    expect(html).not.toContain("Curated live results pending");
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/experiments/kv-cache/\"",
    );
  });

  test("renders measured batching detail content", () => {
    const html = renderToStaticMarkup(
      <ExperimentsPage initialPath="/experiments/batching" />,
    );

    expect(html).toContain("Batching Scheduler Tradeoffs");
    expect(html).toContain("Measured result");
    expect(html).toContain("Scheduler limits under steady load");
    expect(html).toContain("Latest reports: 2026-05-06");
    expect(html).toContain("vLLM dynamic-default scheduler delivered the full run");
    expect(html).toContain("Dynamic default");
    expect(html).toContain("7.41 req/s");
    expect(html).toContain("Limited batching");
    expect(html).toContain("80.1% delivered");
    expect(html).toContain("Constrained");
    expect(html).toContain("15.6% delivered");
    expect(html).toContain("Steady scheduler profile comparison");
    expect(html).toContain("Dynamic default report");
    expect(html).toContain("dynamic-default");
    expect(html).toContain("1.66s");
    expect(html).toContain("10.55s");
    expect(html).toContain("59.72s");
    expect(html).not.toContain("Curated live results pending");
  });

  test("renders measured prefill/decode detail content", () => {
    const html = renderToStaticMarkup(
      <ExperimentsPage initialPath="/experiments/prefill-decode" />,
    );

    expect(html).toContain("Prefill vs Decode Timing");
    expect(html).toContain("Measured result");
    expect(html).toContain("Mixed streaming shape split");
    expect(html).toContain("Latest reports: 2026-05-06");
    expect(html).toContain("640 requests at concurrency 24");
    expect(html).toContain("Mixed run");
    expect(html).toContain("12.52s p95");
    expect(html).toContain("Prefill shape");
    expect(html).toContain("1.52s p95");
    expect(html).toContain("Decode shape");
    expect(html).toContain("12.79s p95");
    expect(html).toContain("Mixed run shape split");
    expect(html).toContain("Isolated shape baseline");
    expect(html).toContain("1.37s");
    expect(html).toContain("149 ms");
    expect(html).toContain("Mixed profile follow-up");
    expect(html).toContain("max-seqs-8");
    expect(html).toContain("133.64s");
    expect(html).toContain("Mixed run report");
    expect(html).toContain("prefill-heavy");
    expect(html).toContain("decode-heavy");
    expect(html).not.toContain("Curated live results pending");
  });

  test("renders measured autoscaling detail content", () => {
    const html = renderToStaticMarkup(
      <ExperimentsPage initialPath="/experiments/autoscaling" />,
    );

    expect(html).toContain("Autoscaling and Queueing Behavior");
    expect(html).toContain("Measured result");
    expect(html).toContain("Scale-from-zero queue behavior");
    expect(html).toContain("Latest reports: 2026-05-07");
    expect(html).toContain("bounded-queue clients across burst and spike-to-zero cases");
    expect(html).toContain("GPU node ready");
    expect(html).toContain("35s");
    expect(html).toContain("Model ready");
    expect(html).toContain("425-439s");
    expect(html).toContain("Queued delivery");
    expect(html).toContain("100%");
    expect(html).toContain("Queue policy outcome");
    expect(html).toContain("burst-direct");
    expect(html).toContain("76.98% delivered");
    expect(html).toContain("787 dropped / 255 active");
    expect(html).toContain("burst-queued");
    expect(html).toContain("2.19s");
    expect(html).toContain("spike-direct");
    expect(html).toContain("237 dropped / 254 active");
    expect(html).toContain("spike-queued");
    expect(html).toContain("1.98s");
    expect(html).toContain("Spike cold-start timeline");
    expect(html).toContain("354s / 425s");
    expect(html).toContain("357s / 439s");
    expect(html).toContain("Spike queued report");
    expect(html).not.toContain("Curated live results pending");
  });

  test("does not render platform validation as an experiment detail route", () => {
    const html = renderToStaticMarkup(
      <ExperimentsPage initialPath="/experiments/platform-validation" />,
    );

    expect(html).toContain("Experiment not found");
    expect(html).toContain("No experiment is published for &quot;platform-validation&quot;.");
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
