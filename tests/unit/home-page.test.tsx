import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HomePage } from "../../src/features/home/page";

describe("HomePage", () => {
  test("renders the platform infrastructure hero", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain(">Tony Lee<");
    expect(html).toContain("aria-label=\"Tony Lee home\"");
    expect(html).toContain("aria-current=\"page\">Home<");
    expect(html).toContain("Platform Infrastructure Engineer");
    expect(html).toContain(
      "I build Kubernetes-based ML inference systems where scaling, latency, throughput, and cost are measured under real GPU workloads."
    );
    expect(html).not.toContain("Selected inference proof points");
    expect(html).toContain("href=\"/project/cloud-inference-platform\"");
    expect(html).toContain(">View project<");
    expect(html).toContain("href=\"/resume\"");
    expect(html).toContain(">View resume<");
  });
});
