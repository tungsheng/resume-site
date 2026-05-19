import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePage } from "../../src/features/home/page";

describe("HomePage", () => {
  test("renders the concise home hero", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain(">Tony Lee<");
    expect(html).toContain("aria-label=\"Tony Lee home\"");
    expect(html).toContain("aria-current=\"page\">Home<");
    expect(html).toContain("ML Inference Performance Engineering");
    expect(html).toContain(
      "I optimize GPU serving paths from Kubernetes scheduling to CUDA kernels with reproducible latency, throughput, and cost measurements."
    );
    expect(html).not.toContain("Selected inference proof points");
    expect(html).toContain("href=\"/projects\"");
    expect(html).toContain(">View projects<");
    expect(html).toContain("href=\"/experiments\"");
    expect(html).toContain(">View experiments<");
    expect(html).not.toContain("GPU Inference Decision Lab");
    expect(html).not.toContain("CUDA Kernel Lab");
    expect(html).toContain("href=\"/resume\"");
    expect(html).toContain(">View resume<");
  });
});
