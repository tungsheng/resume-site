import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectPage } from "../../src/features/project/page";

describe("ProjectPage", () => {
  test("renders the project index", () => {
    const html = renderToStaticMarkup(<ProjectPage />);

    expect(html).toContain("Projects");
    expect(html).toContain("Evidence-backed GPU systems work");
    expect(html).toContain("aria-label=\"Breadcrumb\"");
    expect(html).toContain("GPU Inference Decision Lab");
    expect(html).toContain("CUDA Kernel Lab");
    expect(html).toContain("Serving infrastructure");
    expect(html).toContain("Kernel optimization");
    expect(html).toContain("href=\"/projects/gpu-inference-lab\"");
    expect(html).toContain("href=\"/projects/cuda-kernel-lab\"");
    expect(html).toContain("href=\"/experiments\"");
  });

  test("renders the flagship project walkthrough", () => {
    const html = renderToStaticMarkup(
      <ProjectPage initialPath="/projects/gpu-inference-lab" />,
    );

    expect(html).toContain("GPU Inference Decision Lab");
    expect(html).toContain("aria-label=\"Breadcrumb\"");
    expect(html).toContain(
      "An EKS/vLLM lab that turns serving measurements into architecture decisions for admission, autoscaling, context limits, scheduling, and quantization."
    );
    expect(html).toContain("GitHub");
    expect(html).toContain("View experiments");
    expect(html).toContain("View decisions");
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
    expect(html).toContain("Architecture Readout");
    expect(html).toContain("Workload measurements map to direct serving calls");
    expect(html).toContain("Use bounded admission when traffic can arrive before the model is ready.");
    expect(html).toContain("Set a long-context boundary before failures appear.");
    expect(html).toContain("Do not use scheduler caps as the first fix for the 1.20 req/s long-context knee.");
    expect(html).toContain("Keep vLLM dynamic defaults for small steady and burst traffic.");
    expect(html).toContain("Treat cheap burst runs as incomplete unless latency passes.");
    expect(html).toContain("Keep active-pressure HPA in the matrix, but do not call target 8 production-optimal.");
    expect(html).toContain("Reject FP8 KV on the current g4dn/vLLM path.");
    expect(html).toContain("Hold Blackwell FP4 until B200 capacity produces comparable runs.");
    expect(html).toContain("Supported");
    expect(html).toContain("Caveated");
    expect(html).toContain("Partial");
    expect(html).toContain("Rejected");
    expect(html).toContain("Blocked");
    expect(html).not.toContain("Active-pressure targets, request-pattern utilization, cost, and Blackwell FP4 stay open");
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
    expect(html).toContain("href=\"/decisions/gpu-inference-lab\"");
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

  test("renders the CUDA Kernel Lab project route", () => {
    const html = renderToStaticMarkup(
      <ProjectPage initialPath="/projects/cuda-kernel-lab" />,
    );

    expect(html).toContain("CUDA Kernel Lab");
    expect(html).toContain("aria-label=\"Breadcrumb\"");
    expect(html).toContain("A CUDA/Triton optimization lab");
    expect(html).toContain("NVIDIA A10G");
    expect(html).toContain("115 + 27 rows");
    expect(html).toContain("5.901x");
    expect(html).toContain("~0.156 ms");
    expect(html).toContain("Optimization loop");
    expect(html).toContain("Profile first");
    expect(html).toContain("Identify bottleneck");
    expect(html).toContain("Optimize that bottleneck");
    expect(html).toContain("Re-profile");
    expect(html).toContain("A10G evidence");
    expect(html).toContain("Fused RMSNorm");
    expect(html).toContain("Fused SwiGLU");
    expect(html).toContain("Matmul tile sweep");
    expect(html).toContain("Decode graph replay");
    expect(html).toContain("Profiler-backed proof");
    expect(html).toContain("Strategy report");
    expect(html).toContain("Decode replay report");
    expect(html).toContain("Profiler reports");
    expect(html).not.toContain("Milestones");
    expect(html).not.toContain("docs/milestones.md");
    expect(html).not.toContain("Optimization ladder");
    expect(html).toContain("href=\"/projects\"");
    expect(html).toContain("href=\"/experiments/cuda-kernel-lab\"");
    expect(html).toContain("href=\"/decisions/cuda-kernel-lab\"");
    expect(html).toContain("href=\"https://github.com/tungsheng/cuda-kernel-lab\"");
  });
});
