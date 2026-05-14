import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectPage } from "../../src/features/project/page";

describe("ProjectPage", () => {
  test("renders the flagship project walkthrough", () => {
    const html = renderToStaticMarkup(<ProjectPage />);

    expect(html).toContain("GPU Inference Decision Lab");
    expect(html).toContain(
      "An EKS/vLLM lab that turns serving measurements into architecture decisions for admission, autoscaling, context limits, scheduling, and quantization."
    );
    expect(html).toContain("GitHub");
    expect(html).toContain("View experiments");
    expect(html).toContain("View resume");
    expect(html).toContain("At a glance");
    expect(html).toContain(
      "One public request path, one observable scale path, and an evidence gate that separates supported decisions from open work."
    );
    expect(html).toContain("AWS EKS + vLLM");
    expect(html).toContain("0 serving GPUs");
    expect(html).toContain("Verify / Evaluate / Experiment");
    expect(html).toContain("7 experiments");
    expect(html).toContain("Decided + open");
    expect(html).toContain("Pick the right workflow");
    expect(html).toContain("Verify the path, evaluate platform behavior, or run catalog experiments; each workflow feeds the decision record.");
    expect(html).toContain("Verify");
    expect(html).toContain("Evaluate");
    expect(html).toContain("Experiment");
    expect(html).toContain("Run after ./scripts/up for a fast path check.");
    expect(html).toContain("Use for scale signals, profile choices, and target tuning.");
    expect(html).toContain("Use validate/render locally; use run after ./scripts/up for live measurements.");
    expect(html).toContain("validate");
    expect(html).toContain("Public /v1 response");
    expect(html).toContain("Catalog validation");
    expect(html).toContain("Decision evidence");
    expect(html).toContain("Decision contract");
    expect(html).toContain("Workload");
    expect(html).toContain("Profile");
    expect(html).toContain("Run");
    expect(html).toContain("Evidence gate");
    expect(html).toContain("Decision");
    expect(html).toContain("Decision engine");
    expect(html).toContain("Experiment catalog");
    expect(html).toContain("Experiment runner");
    expect(html).toContain("Runbook");
    expect(html).toContain("How serving scales");
    expect(html).toContain("Default path");
    expect(html).toContain(
      "Bring up the platform, prove one public response, then clean it up."
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
      "Evidence gates"
    );
    expect(html).toContain("Generated reports are inputs; decisions are promoted only when the required fields support them.");
    expect(html).toContain("Bounded admission, the 8192/300 long-context boundary, and the g4dn FP8 KV-cache rejection are backed by measured runs.");
    expect(html).toContain("Each claim needs the right fields");
    expect(html).toContain("Active-pressure targets, request-pattern utilization, cost, and Blackwell FP4 stay open");
    expect(html).toContain("Evidence");
    expect(html).toContain("Decision engine");
    expect(html).toContain("Reports docs");
    expect(html).toContain("Experiment catalog");
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
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/docs/decision-engine.md\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/docs/experiment-catalog.md\""
    );
    expect(html).toContain(
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/docs/reports/README.md\""
    );
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
    expect(html).toContain("Architecture decisions");
    expect(html).toContain("href=\"/project/cloud-inference-platform/validation\"");
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
      "href=\"https://github.com/tungsheng/gpu-inference-lab/blob/main/docs/platform-reference.md\""
    );
    expect(html).toContain("href=\"/experiments\"");
    expect(html).toContain("href=\"https://github.com/tungsheng/gpu-inference-lab\"");
  });

  test("renders the platform decision record on the validation route", () => {
    const html = renderToStaticMarkup(
      <ProjectPage initialPath="/project/cloud-inference-platform/validation" />,
    );

    expect(html).toContain("Architecture Decisions");
    expect(html).toContain("What the EKS/vLLM evidence supports");
    expect(html).toContain("Decision readiness");
    expect(html).toContain("Supported");
    expect(html).toContain("Bounded admission");
    expect(html).toContain("Long-context boundary");
    expect(html).toContain("Rejected");
    expect(html).toContain("FP8 KV on g4dn");
    expect(html).toContain("Pending");
    expect(html).toContain("Active-pressure target");
    expect(html).toContain("Useful-work cost");
    expect(html).toContain("Blocked");
    expect(html).toContain("Blackwell FP4");
    expect(html).toContain("Portfolio-facing decision record");
    expect(html).toContain("Bound burst traffic");
    expect(html).toContain("100% vs 76.98-88.14%");
    expect(html).toContain("dropped 237-787 iterations");
    expect(html).toContain("Optimize readiness");
    expect(html).toContain("425-439s");
    expect(html).toContain("image, container, and model readiness drove the wait");
    expect(html).toContain("Gate 8192/300");
    expect(html).toContain("1.20 req/s, 54.35s p95");
    expect(html).toContain("still delivers 100% at 1.20");
    expect(html).toContain("Reject FP8 KV here");
    expect(html).toContain("47.58-69.12%");
    expect(html).toContain("Long-context SLO proof");
    expect(html).toContain("Delivery");
    expect(html).toContain("Queue starts");
    expect(html).toContain("Saturation");
    expect(html).toContain("72 waiting / 104 active");
    expect(html).toContain("Updated: May 13, 2026");
    expect(html).toContain("Workflow: ./scripts/evaluate + ./scripts/experiment");
    expect(html).toContain("Evidence type: Curated decisions");
    expect(html).toContain("Project overview");
    expect(html).toContain("Experiment catalog");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).toContain("href=\"/experiments\"");
  });
});
