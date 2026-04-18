import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ExperimentsPage } from "../../src/features/experiments/page";

describe("ExperimentsPage", () => {
  test("renders the experiments evidence page", () => {
    const html = renderToStaticMarkup(<ExperimentsPage />);

    expect(html).toContain("Zero-Idle vs Warm Baseline");
    expect(html).toContain("Zero Idle");
    expect(html).toContain("Warm-1");
    expect(html).toContain("Burst time to first token (TTFT)");
    expect(html).toContain("./scripts/evaluate --profile zero-idle");
    expect(html).toContain("What these experiments show");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
  });
});
