import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectPage } from "../../src/features/project/page";

describe("ProjectPage", () => {
  test("renders the flagship project walkthrough", () => {
    const html = renderToStaticMarkup(<ProjectPage />);

    expect(html).toContain("Cloud Inference Platform");
    expect(html).toContain(
      "A GPU inference lab on EKS that turns vLLM serving pressure into autoscaling and GPU node provisioning, with platform validation runs and a catalog of focused serving experiments."
    );
    expect(html).toContain("GitHub");
    expect(html).toContain("View experiments");
    expect(html).toContain("View resume");
    expect(html).toContain("At a glance");
    expect(html).toContain(
      "The lab has one public serving path, one observable scale path, and three workflows for proving or measuring behavior."
    );
    expect(html).toContain("AWS EKS + vLLM");
    expect(html).toContain("0 serving GPUs");
    expect(html).toContain("Verify / Evaluate / Experiment");
    expect(html).toContain("6 experiments");
    expect(html).toContain("Validation measured");
    expect(html).toContain("Choose the right workflow");
    expect(html).toContain("Use verify for path proof, evaluate for platform comparisons, and experiment for catalog-defined serving questions.");
    expect(html).toContain("Verify");
    expect(html).toContain("Evaluate");
    expect(html).toContain("Experiment");
    expect(html).toContain("Use after ./scripts/up for a fast path check.");
    expect(html).toContain("Use for profile, scale signal, or target tuning decisions.");
    expect(html).toContain("Use locally to validate or render; use run after ./scripts/up for measurements.");
    expect(html).toContain("validate");
    expect(html).toContain("Public /v1 response");
    expect(html).toContain("Catalog validation");
    expect(html).toContain("Decision evidence");
    expect(html).toContain("Experiment contract");
    expect(html).toContain("Question");
    expect(html).toContain("Cases");
    expect(html).toContain("Serving profile");
    expect(html).toContain("Metrics");
    expect(html).toContain("Result");
    expect(html).toContain("Experiment summary");
    expect(html).toContain("Experiment runner");
    expect(html).toContain("How the platform serves and scales");
    expect(html).toContain("Default path");
    expect(html).toContain(
      "Shortest path: bring up the platform, prove one public response, then clean it up."
    );
    expect(html).toContain("Step 1");
    expect(html).toContain("Step 2");
    expect(html).toContain("Step 3");
    expect(html).toContain("Start the lab");
    expect(html).toContain("Prove the path");
    expect(html).toContain("Tear it down");
    expect(html).toContain("What the quick start proves");
    expect(html).toContain("GPU capacity appears");
    expect(html).toContain("Public inference works");
    expect(html).toContain("Cleanup returns to zero");
    expect(html).toContain("./scripts/down");
    expect(html).toContain("./scripts/evaluate");
    expect(html).toContain("--profile");
    expect(html).toContain("zero-idle");
    expect(html).toContain("command-token--program");
    expect(html).toContain("command-token--flag");
    expect(html).toContain("command-token--value");
    expect(html).toContain("command-token--separator");
    expect(html).toContain("Markdown report");
    expect(html).toContain("JSON report");
    expect(html).toContain(
      "Confirm one successful public /v1 inference response."
    );
    expect(html).toContain(
      "Evidence and outputs"
    );
    expect(html).toContain("Measured platform validation, generated reports, and catalog experiments are related, but they are not the same artifact.");
    expect(html).toContain("Measured evaluate runs support warm baseline, scale-out signal, and target tuning decisions.");
    expect(html).toContain("Experiment definitions and runners exist; curated live-cluster conclusions are still pending.");
    expect(html).toContain("Generated Markdown, JSON, and logs stay under docs/reports until selected for the project narrative.");
    expect(html).toContain("Reports docs");
    expect(html).toContain("Scaling docs");
    expect(html).toContain("Serve path");
    expect(html).toContain("Scale path");
    expect(html).toContain("Foundation");
    expect(html).toContain("Rejoin point");
    expect(html).toContain("Setup via scripts/up");
    expect(html).toContain("Public ingress hostname");
    expect(html).toContain("Adapter / custom metrics API");
    expect(html).toContain("GPU NodePools");
    expect(html).toContain("GPU nodes: 0");
    expect(html).toContain("Pending GPU pod");
    expect(html).toContain("Karpenter / NodeClaim");
    expect(html).toContain("Ready vLLM pod");
    expect(html).toContain("Second Ready vLLM pod");
    expect(html).toContain("NodeClaim");
    expect(html).toContain("Same Service");
    expect(html).toContain("ALB");
    expect(html).toContain("Ingress");
    expect(html).toContain("Service");
    expect(html).toContain("Prometheus");
    expect(html).toContain("Adapter");
    expect(html).toContain("HPA");
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/scripts/up\"");
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/scripts/verify\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/scripts/evaluate\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/scripts/experiment\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/docs/experiments-summary.md\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/docs/reports/README.md\""
    );
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
    expect(html).toContain("href=\"/experiments/platform-validation\"");
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/platform/inference/ingress.yaml\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/platform/inference/service.yaml\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/platform/inference/vllm-openai.yaml\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/platform/inference/hpa-active-pressure.yaml\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/docs/scaling.md\""
    );
    expect(html).toContain("href=\"/experiments\"");
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
  });
});
