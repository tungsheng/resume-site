import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePage } from "../../src/features/home/page";

describe("HomePage", () => {
  test("renders the minimal ML inference infrastructure hero", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain(">Tony Lee<");
    expect(html).toContain("aria-label=\"Tony Lee home\"");
    expect(html).toContain("aria-current=\"page\">Home<");
    expect(html).toContain("ML Inference Infrastructure Engineer");
    expect(html).toContain(
      "I design GPU-backed inference systems on Kubernetes, focused on scaling, latency, and cost under real workloads."
    );
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).toContain(">View project<");
    expect(html).toContain("href=\"/resume\"");
    expect(html).toContain(">View resume<");
  });
});
