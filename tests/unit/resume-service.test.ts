import { describe, expect, test } from "bun:test";
import { publicResumeData } from "../../src/features/resume/data";
import { renderResumeHtmlDocument } from "../../src/features/resume/render-static-html";
import type { ResumeData } from "../../src/types";

describe("Resume Service", () => {
  test("publicResumeData contains the checked-in public resume", () => {
    expect(publicResumeData.header.name).toBe("Tony Lee");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("vLLM");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("Inference Load Testing (k6)");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("Admission Control");
    expect(publicResumeData.skills["ML Infrastructure / Inference"]).toContain("Quantization Evaluation");
    expect(publicResumeData.skills["Infrastructure / Cloud"]).toContain("AWS (VPC, IAM, EC2, ALB)");
    expect(publicResumeData.skills["Infrastructure / Cloud"]).toContain("DCGM Exporter");
    expect(publicResumeData.skills["Languages"]).toBeArray();
    expect(publicResumeData.projects?.title).toBe("Selected Project");
    expect(publicResumeData.projects?.items[0]?.title).toContain("GPU Inference Decision Lab");
    expect(publicResumeData.projects?.items[0]?.highlights).toContain(
      "Built an AWS EKS/vLLM decision lab that turns serving measurements into supported, rejected, pending, or blocked architecture calls across autoscaling, admission control, long-context capacity, scheduling, and quantization.",
    );
    expect(publicResumeData.projects?.items[0]?.highlights).toContain(
      "Measured burst and spike-to-zero admission behavior: bounded queues kept 100% delivery at about 2s p95 while direct clients dropped 237-787 iterations.",
    );
    expect(publicResumeData.projects?.items[0]?.highlights).toContain(
      "Mapped the 8192/300 long-context boundary: 1.10 req/s had no queueing, 1.15 began waiting pressure, and 1.20 still delivered 100% but reached 54.35s p95 latency.",
    );
    expect(publicResumeData.projects?.items[0]?.highlights).toContain(
      "Rejected FP8 KV cache on g4dn/vLLM after variants cut delivery to 47.58-69.12% and generated throughput to 114-166 tokens/sec versus a 249.58 baseline.",
    );
    expect(publicResumeData.projects?.items[0]?.highlights).toContain(
      "Designed a Blackwell FP4 path for BF16, plain NVFP4, and SmoothQuant across accuracy, memory, latency, throughput, serving cost, and build cost; the first p6-b200 attempt was blocked by EC2 capacity.",
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
