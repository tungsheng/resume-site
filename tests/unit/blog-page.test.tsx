import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  getPostSlugFromPath,
  BlogPage,
} from "../../src/features/blog/page";

describe("BlogPage", () => {
  test("renders the blog index", () => {
    const html = renderToStaticMarkup(<BlogPage />);

    expect(html).toContain(">Blog<");
    expect(html).toContain("aria-current=\"page\">Blog<");
    expect(html).toContain(
      "Engineering posts on inference serving, scheduler behavior, and GPU kernel paths.",
    );
    expect(html).toContain("Working posts start as source-backed outlines");
    expect(html).toContain("2 posts");
    expect(html).toContain("2 categories");
    expect(html).toContain("8 tags");
    expect(html).toContain("SGLang Architecture Deep Dive");
    expect(html).toContain("Decode Process Deep Dive");
    expect(html).toContain(
      "href=\"/blog/sglang-architecture-request-lifecycle-scheduler-prefix-cache\"",
    );
    expect(html).toContain("href=\"/blog/decode-process-deep-dive\"");
    expect(html).toContain("Serving architecture");
    expect(html).toContain("Inference internals");
    expect(html).toContain("Prefix cache");
    expect(html).toContain("CUDA Graphs");
    expect(html).not.toContain("Request lifecycle map");
  });

  test("renders the SGLang architecture post detail", () => {
    const html = renderToStaticMarkup(
      <BlogPage initialPath="/blog/sglang-architecture-request-lifecycle-scheduler-prefix-cache" />,
    );

    expect(html).toContain("SGLang Architecture Deep Dive");
    expect(html).toContain("aria-label=\"Breadcrumb\"");
    expect(html).toContain("Updated");
    expect(html).toContain("2026-06-12");
    expect(html).toContain("12 min read");
    expect(html).toContain("Request intake and normalization");
    expect(html).toContain("Request lifecycle map");
    expect(html).toContain("Scheduler and prefix cache outline");
    expect(html).toContain("Evidence hooks to collect");
    expect(html).toContain("Drafting rule");
    expect(html).toContain("href=\"/projects/gpu-inference-lab\"");
    expect(html).toContain("href=\"/experiments/kv-cache\"");
    expect(html).toContain("href=\"/experiments/batching\"");
    expect(html).toContain("href=\"/experiments/prefill-decode\"");
    expect(html).toContain("href=\"/decisions/gpu-inference-lab\"");
    expect(html).not.toContain("Decode loop mental model");
  });

  test("renders the decode process post detail", () => {
    const html = renderToStaticMarkup(
      <BlogPage initialPath="/blog/decode-process-deep-dive" />,
    );

    expect(html).toContain("Decode Process Deep Dive");
    expect(html).toContain("Decode loop mental model");
    expect(html).toContain("KV cache reads and writes");
    expect(html).toContain("What to separate");
    expect(html).toContain("Pseudo decode step");
    expect(html).toContain("Portfolio angle");
    expect(html).toContain("href=\"/projects/gpu-inference-lab\"");
    expect(html).toContain("href=\"/projects/cuda-kernel-lab\"");
    expect(html).toContain("href=\"/experiments/kernel-decode-step-graph-replay\"");
    expect(html).toContain("href=\"/experiments/kernel-profiler-validation\"");
    expect(html).toContain("href=\"/decisions/cuda-kernel-lab\"");
    expect(html).not.toContain("Scheduler and prefix cache outline");
  });

  test("renders an unknown post route", () => {
    const html = renderToStaticMarkup(
      <BlogPage initialPath="/blog/missing-post" />,
    );

    expect(html).toContain("Post not found");
    expect(html).toContain("No blog post is published for");
    expect(html).toContain("missing-post");
    expect(html).toContain("href=\"/blog\"");
    expect(html).toContain("href=\"/projects\"");
  });

  test("resolves post slugs from paths", () => {
    expect(getPostSlugFromPath("/blog")).toBeNull();
    expect(getPostSlugFromPath("/blog/")).toBeNull();
    expect(
      getPostSlugFromPath(
        "/blog/sglang-architecture-request-lifecycle-scheduler-prefix-cache?from=nav",
      ),
    ).toBe("sglang-architecture-request-lifecycle-scheduler-prefix-cache");
    expect(getPostSlugFromPath("/blog/decode-process-deep-dive")).toBe(
      "decode-process-deep-dive",
    );
    expect(getPostSlugFromPath("/blog/too/deep")).toBeNull();
    expect(getPostSlugFromPath("/experiments/kv-cache")).toBeNull();
  });
});
