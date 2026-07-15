import { describe, expect, test } from "bun:test";
import { publicResumeData, renderResumeHtmlDocument, type ResumeData } from "@resume";

describe("Resume Service", () => {
  test("publicResumeData contains the checked-in public resume", () => {
    expect(publicResumeData.header.name).toBe("Tony Lee");
    // Honest repositioning: lead with the paid full-stack identity, frame ML
    // inference as an explicit transition (the goal, not a job title) via the arrow.
    expect(publicResumeData.header.badges).toContain("Staff Full-Stack Engineer → ML Inference");
    expect(publicResumeData.header.badges).not.toContain("ML Inference Performance Engineering");
    expect(publicResumeData.header.contacts.website).toBe("tonylee.bio");
    // Skills split into two buckets: Professional (paid) vs Self-Directed / Lab (unpaid).
    expect(Object.keys(publicResumeData.skills)).toEqual([
      "Professional (Production Experience)",
      "Self-Directed / Lab",
    ]);
    expect(publicResumeData.skills["Professional (Production Experience)"]).toContain("TypeScript");
    expect(publicResumeData.skills["Professional (Production Experience)"]).toContain("React");
    expect(publicResumeData.skills["Professional (Production Experience)"]).toContain("CI/CD Automation");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("AWS (VPC, IAM, EC2, ALB)");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("DCGM Exporter");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("vLLM");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("CUDA / Triton Benchmarking");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("Inference Load Testing (k6)");
    // Deep-mechanism specialties dropped from Skills (too scrutiny-heavy to assert as skills).
    const allSkills = Object.values(publicResumeData.skills).flat();
    expect(allSkills).not.toContain("Kernel Fusion");
    expect(allSkills).not.toContain("GPU Profiling");
    // Labs are a clearly-labeled self-directed section, with an honesty note.
    expect(publicResumeData.projects?.title).toBe("ML Inference — Self-Directed (2025–Present)");
    expect(publicResumeData.projects?.note).toContain("negative results");
    expect(publicResumeData.projects?.items[0]?.title).toContain("GPU Inference Decision Lab");
    expect(publicResumeData.projects?.items[0]?.highlights.length).toBe(2);
    expect(publicResumeData.projects?.items[1]?.title).toBe("CUDA/Triton GPU Kernel Lab (PyTorch baselines + A10G/H200)");
    expect(publicResumeData.projects?.items[1]?.highlights.length).toBe(2);
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
