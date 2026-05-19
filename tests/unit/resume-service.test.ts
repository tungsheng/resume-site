import { describe, expect, test } from "bun:test";
import { publicResumeData } from "../../src/features/resume/data";
import { renderResumeHtmlDocument } from "../../src/features/resume/render-static-html";
import type { ResumeData } from "../../src/types";

describe("Resume Service", () => {
  test("publicResumeData contains the checked-in public resume", () => {
    expect(publicResumeData.header.name).toBe("Tony Lee");
    expect(publicResumeData.header.badges).toContain("GPU Kernel Optimization");
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
      "Built an AWS EKS/vLLM decision lab that turns serving measurements into supported, rejected, pending, or blocked architecture calls across autoscaling, admission control, long-context capacity, scheduling, and quantization.",
    );
    expect(publicResumeData.projects?.items[0]?.highlights).toContain(
      "Measured burst and 8192/300 long-context behavior: bounded queues preserved 100% delivery near 2s p95 for bursts, 1.20 req/s long-context traffic repeated 62.66-63.40s p95 latency, and FP8 KV was rejected after delivery fell to 47.58-69.12%.",
    );
    expect(publicResumeData.projects?.items[1]?.title).toContain("CUDA Kernel Lab");
    expect(publicResumeData.projects?.items[1]?.highlights).toContain(
      "Built a CUDA/Triton optimization lab for LLM-shaped primitives and measured 38 A10G benchmark rows across memory primitives, reductions, softmax, normalization, SwiGLU, and vector-add variants, with all correctness checks passing.",
    );
    expect(publicResumeData.projects?.items[1]?.highlights).toContain(
      "Produced the strongest current kernel wins through fusion: Triton RMSNorm fp16 reached 5.539x over torch baseline and SwiGLU fp32 reached 3.112x, while memory primitives and row-softmax remain profiler follow-ups.",
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
    expect(html).toContain(".resume-document .experience-item {");
    expect(html).toContain(".resume-document .experience-dot {");
  });
});
