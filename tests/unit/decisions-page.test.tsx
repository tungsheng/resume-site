import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  DecisionsPage,
  getDecisionProjectIdFromPath,
} from "../../src/features/decisions/page";

describe("DecisionsPage", () => {
  test("renders the decision index with project cards", () => {
    const html = renderToStaticMarkup(<DecisionsPage />);

    expect(html).toContain(">Decisions<");
    expect(html).toContain("Project-level calls that separate serving architecture from kernel optimization evidence.");
    expect(html).toContain("Choose a project decision page for the status dashboard");
    expect(html).toContain("GPU Inference Decision Lab");
    expect(html).toContain("CUDA Kernel Lab");
    expect(html).toContain("9 decisions");
    expect(html).toContain("8 decisions");
    expect(html).toContain("href=\"/decisions/gpu-inference-lab\"");
    expect(html).toContain("href=\"/decisions/cuda-kernel-lab\"");
    expect(html).toContain("href=\"/experiments/gpu-inference-lab\"");
    expect(html).toContain("href=\"/experiments/cuda-kernel-lab\"");
    expect(html).not.toContain("Decision status dashboard");
    expect(html).not.toContain("Bounded admission");
  });

  test("renders the GPU inference decision record", () => {
    const html = renderToStaticMarkup(
      <DecisionsPage initialPath="/decisions/gpu-inference-lab" />,
    );

    expect(html).toContain("GPU Inference Decisions");
    expect(html).toContain("Architecture Decisions");
    expect(html).not.toContain("aria-label=\"Decision project tabs\"");
    expect(html).toContain("Decision status dashboard");
    expect(html).toContain("Admission + readiness");
    expect(html).toContain("Long-context scheduling");
    expect(html).toContain("Cost + autoscaling");
    expect(html).toContain("Quantization + hardware");
    expect(html).toContain("Bounded admission");
    expect(html).toContain("Cold-start readiness");
    expect(html).toContain("Blackwell FP4");
    expect(html).toContain("href=\"/experiments/kv-cache\"");
    expect(html).toContain("href=\"/experiments/autoscaling\"");
    expect(html).toContain("Decision evidence visuals");
    expect(html).toContain("href=\"/projects/gpu-inference-lab\"");
    expect(html).toContain("href=\"/experiments/gpu-inference-lab\"");
    expect(html).not.toContain("href=\"/projects/gpu-inference-lab/validation\"");
  });

  test("renders the CUDA kernel decision record", () => {
    const html = renderToStaticMarkup(
      <DecisionsPage initialPath="/decisions/cuda-kernel-lab" />,
    );

    expect(html).toContain("CUDA Kernel Lab Decisions");
    expect(html).toContain("Kernel Optimization Decisions");
    expect(html).toContain("Fusion wins");
    expect(html).toContain("Memory/reduction boundaries");
    expect(html).toContain("Matmul/Tensor Core gaps");
    expect(html).toContain("Decode replay caveats");
    expect(html).toContain("Fused RMSNorm");
    expect(html).toContain("Row softmax");
    expect(html).toContain("Decode graph replay");
    expect(html).toContain("Profiler-backed proof");
    expect(html).toContain("href=\"/experiments/kernel-normalization-fusion\"");
    expect(html).toContain("href=\"/experiments/kernel-decode-step-graph-replay\"");
    expect(html).toContain("href=\"/projects/cuda-kernel-lab\"");
    expect(html).toContain("href=\"/experiments/cuda-kernel-lab\"");
    expect(html).not.toContain("Architecture Decisions");
  });

  test("keeps the legacy GPU validation route mapped to GPU decisions", () => {
    const html = renderToStaticMarkup(
      <DecisionsPage initialPath="/projects/gpu-inference-lab/validation" />,
    );

    expect(html).toContain("GPU Inference Decisions");
    expect(html).toContain("Architecture Decisions");
    expect(html).toContain("Bounded admission");
  });

  test("resolves decision project routes", () => {
    expect(getDecisionProjectIdFromPath("/decisions")).toBeNull();
    expect(getDecisionProjectIdFromPath("/decisions/gpu-inference-lab")).toBe(
      "gpu-inference-lab",
    );
    expect(getDecisionProjectIdFromPath("/decisions/cuda-kernel-lab")).toBe(
      "cuda-kernel-lab",
    );
    expect(getDecisionProjectIdFromPath("/projects/gpu-inference-lab/validation")).toBe(
      "gpu-inference-lab",
    );
    expect(getDecisionProjectIdFromPath("/decisions/unknown")).toBeNull();
  });
});
