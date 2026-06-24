import { describe, expect, test } from "bun:test";
import { publicResumeData } from "@resume/data";
import { renderResumeHtmlDocument } from "@resume/render-static-html";
import type { ResumeData } from "../../src/types";

describe("Resume Service", () => {
  test("publicResumeData contains the checked-in public resume", () => {
    expect(publicResumeData.header.name).toBe("Tony Lee");
    expect(publicResumeData.header.badges).toContain("ML Inference Performance Engineering");
    expect(publicResumeData.header.badges).toContain("GPU Serving Systems");
    expect(publicResumeData.header.badges).toContain("CUDA/Triton Optimization");
    expect(publicResumeData.header.badges).not.toContain("GPU Kernel Optimization");
    expect(publicResumeData.header.badges).not.toContain("GPU Kernel Experiments");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("vLLM");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("Inference Load Testing (k6)");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("Admission Control");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("Quantization Evaluation");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("CUDA / Triton Benchmarking");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("Kernel Fusion");
    expect(publicResumeData.skills["Infrastructure / Cloud"]).toContain("AWS (VPC, IAM, EC2, ALB)");
    expect(publicResumeData.skills["Infrastructure / Cloud"]).toContain("DCGM Exporter");
    expect(publicResumeData.skills["Languages"]).toBeArray();
    expect(publicResumeData.projects?.title).toBe("Selected Projects");
    expect(publicResumeData.projects?.items[0]?.title).toContain("GPU Inference Decision Lab");
    expect(publicResumeData.projects?.items[0]?.highlights).toContain(
      "Built an AWS EKS/vLLM inference performance lab that turns KV-cache/context-length behavior, autoscaling, admission control, scheduler/quantization probes, useful-work cost, and failure-mitigation drills into supported, rejected, or pending architecture evidence.",
    );
    expect(publicResumeData.projects?.items[0]?.highlights).toContain(
      "Measured burst and 8192/300 long-context behavior: bounded queues preserved 100% delivery near 2s p95 for bursts, 1.20 req/s long-context traffic repeated 62.66-63.40s p95 latency, and FP8 KV was rejected after delivery fell to 47.58-69.12%.",
    );
    expect(publicResumeData.projects?.items[1]?.title).toBe("CUDA/Triton GPU Kernel Lab (PyTorch baselines + A10G/H200)");
    expect(publicResumeData.projects?.items[1]?.highlights).toContain(
      "Built a reproducible CUDA/Triton benchmarking lab for LLM-shaped GPU primitives, comparing custom Triton kernels against PyTorch/cuBLAS baselines with correctness checks, latency percentiles, bandwidth, TFLOP/s, roofline analysis, and Nsight evidence.",
    );
    expect(publicResumeData.projects?.items[1]?.highlights).toContain(
      "Separated supported wins from caveats: RMSNorm fp16 reached 5.901x with 90.91% DRAM throughput, while same-stream dynamic decode replay reached about 0.156 ms p50 / 0.230 ms p95 as a synthetic resident-KV upper bound.",
    );
    expect(publicResumeData.projects?.items[1]?.highlights).toContain(
      "Extended the H200 matmul track with standard and persistent-wave Triton schedules; the focused 512x11008x4096 bf16 standard row reached 471.4 TFLOP/s (89.41% of PyTorch/cuBLAS), while persistent waves remained below the standard schedule.",
    );
  });

  test("renderResumeHtmlDocument creates valid HTML", () => {
    const mockData: ResumeData = {
      header: {
        name: "John Doe",
        badges: ["Badge1"],
        contacts: {
          linkedin: "johndoe",
          email: "john@example.com",
        },
        summary: "A summary.",
      },
      experience: [
        {
          title: "Developer",
          company: "TechCorp",
          startDate: "2020",
          endDate: "2023",
          highlights: ["Built things"],
        },
      ],
      projects: {
        title: "Selected Projects",
        items: [
          {
            title: "Inference Platform",
            highlights: ["Scaled GPU workloads"],
          },
        ],
      },
      skills: { frontend: ["React"], backend: ["Node.js"], management: ["Agile"] },
      education: [
        { school: "University", degree: "BS CS", startDate: "2016", endDate: "2020" },
      ],
    };

    const html = renderResumeHtmlDocument(mockData);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("John Doe");
    expect(html).toContain("Developer");
    expect(html).toContain("Selected Projects");
    expect(html).toContain("Inference Platform");
    expect(html).toContain("class=\"resume-document\"");
  });

  test("renderResumeHtmlDocument embeds deterministic PDF fonts", () => {
    const html = renderResumeHtmlDocument(publicResumeData);
    const embeddedFontCount = html.match(/data:font\/woff2;base64,/g)?.length ?? 0;

    expect(html).toContain("@font-face");
    expect(html).toContain("font-family: 'ResumePDFSans'");
    expect(embeddedFontCount).toBe(2);
    expect(html).not.toContain("'Avenir Next'");
  });

  test("renderResumeHtmlDocument escapes XSS", () => {
    const xssData: ResumeData = {
      header: {
        name: '<script>alert("XSS")</script>',
        badges: [],
        contacts: { linkedin: "", email: "" },
        summary: "",
      },
      experience: [],
      skills: { frontend: [], backend: [], management: [] },
      education: [],
    };

    const html = renderResumeHtmlDocument(xssData);
    expect(html).not.toContain("<script>alert(\"XSS\")</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  test("renderResumeHtmlDocument timeline template includes connected rail and job dots", () => {
    const mockData: ResumeData = {
      header: {
        name: "John Doe",
        badges: [],
        contacts: {
          linkedin: "johndoe",
          email: "john@example.com",
        },
        summary: "A summary.",
      },
      experience: [
        {
          title: "Lead Engineer",
          company: "TechCorp",
          startDate: "2021",
          endDate: "Present",
          highlights: ["Built platform"],
        },
        {
          title: "Engineer",
          company: "BuildCo",
          startDate: "2019",
          endDate: "2021",
          highlights: ["Improved performance"],
        },
      ],
      skills: { frontend: ["React"], backend: ["Node.js"], management: ["Agile"] },
      education: [
        { school: "University", degree: "BS CS", startDate: "2016", endDate: "2020" },
      ],
    };

    const html = renderResumeHtmlDocument(mockData);
    const dotCount = html.match(/class="experience-dot"/g)?.length ?? 0;

    expect(html).toContain("class=\"resume-document\"");
    expect(html).toContain("<div class=\"experience-rail\"></div>");
    expect(dotCount).toBe(mockData.experience.length);
    expect(html).toContain(".resume-document .header-subtitle {");
    expect(html).toContain("white-space: nowrap;");
    expect(html).toContain(".resume-document .experience-item {");
    expect(html).toContain(".resume-document .experience-dot {");
  });
});
