import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectPage } from "../../src/features/project/page";

describe("ProjectPage", () => {
  test("renders the flagship project walkthrough", () => {
    const html = renderToStaticMarkup(<ProjectPage />);

    expect(html).toContain("Cloud Inference Platform");
    expect(html).toContain(
      "A GPU inference lab on EKS that turns vLLM serving pressure into autoscaling and GPU node provisioning, with checked-in runs for cold start, warm capacity, policy comparison, and target tuning."
    );
    expect(html).toContain("GitHub");
    expect(html).toContain("View experiments");
    expect(html).toContain("View resume");
    expect(html).toContain("At a glance");
    expect(html).toContain("How the platform serves and scales");
    expect(html).toContain("Quick start and measure");
    expect(html).toContain(
      "Bring the lab up, prove one real public response, and tear it down. Run evaluate only when you want comparison reports and tuning data."
    );
    expect(html).toContain("Default path");
    expect(html).toContain(
      "This is the shortest path to understand what the repo proves without going straight into the heavier measurement workflow."
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
    expect(html).toContain("Go deeper with evaluate");
    expect(html).toContain("./scripts/down");
    expect(html).toContain("./scripts/evaluate --profile zero-idle|warm-1");
    expect(html).toContain("Markdown report");
    expect(html).toContain("JSON report");
    expect(html).toContain("Quick start README");
    expect(html).toContain("Verify script");
    expect(html).toContain("Evaluate script");
    expect(html).toContain(
      "Run one end-to-end cold-start proof through the real public endpoint instead of a local-only smoke test."
    );
    expect(html).toContain(
      "Use the heavier measurement path when you want compare and tuning data instead of a single cold-start proof. It runs profile-based workflows and writes report artifacts you can inspect later."
    );
    expect(html).toContain(
      "A compact view of what the platform is, how it works, and why the measured results matter."
    );
    expect(html).toContain(
      "A reproducible GPU inference lab on AWS EKS for measuring cold start, warm capacity, and autoscaling behavior."
    );
    expect(html).toContain(
      "Serving pressure becomes scaling decisions through Prometheus, the adapter, HPA, pending GPU pods, and Karpenter."
    );
    expect(html).toContain(
      "It makes response-time tradeoffs and GPU scale-out behavior easy to understand with checked-in runs."
    );
    expect(html).toContain("Serve path");
    expect(html).toContain("Scale path");
    expect(html).toContain("Foundation");
    expect(html).toContain("Rejoin point");
    expect(html).toContain("Stable path");
    expect(html).toContain("Reactive path");
    expect(html).toContain("Added capacity");
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
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
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
