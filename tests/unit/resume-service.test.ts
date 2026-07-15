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

  // Asserts observable structure through renderResumeHtmlDocument's string
  // interface: every experience entry renders with its visible content, in
  // authored order. (This test previously asserted the decorative timeline
  // rail/dots — which document-css.ts hides per the ADR-0005 Swiss redesign —
  // and raw CSS substrings; both reached past the interface.)
  test("renderResumeHtmlDocument renders every experience entry, in order", () => {
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

    expect(html).toContain('class="resume-document"');
    // One rendered entry per experience item, carrying the visible content.
    const itemCount = html.match(/class="experience-item"/g)?.length ?? 0;
    expect(itemCount).toBe(mockData.experience.length);
    for (const job of mockData.experience) {
      expect(html).toContain(job.company);
      expect(html).toContain(job.title);
      for (const highlight of job.highlights) expect(html).toContain(highlight);
    }
    // Authored order is preserved: newest role renders before the older one.
    expect(html.indexOf("TechCorp")).toBeLessThan(html.indexOf("BuildCo"));
  });
});
