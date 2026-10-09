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
    expect(publicResumeData.header.contacts.github).toBeUndefined();
    // The web /resume page renders this exact closing clause as an italic accent
    // and silently drops the accent if the phrase changes.
    expect(publicResumeData.header.summary.endsWith("repeated benchmarks, correctness checks, and documented trade-offs.")).toBe(true);
    // Skills distinguish production experience from self-directed labs.
    expect(Object.keys(publicResumeData.skills)).toEqual([
      "Production",
      "Self-Directed / Lab",
    ]);
    expect(publicResumeData.skills.Production).toContain("TypeScript");
    expect(publicResumeData.skills.Production).toContain("React");
    expect(publicResumeData.skills.Production).toContain("CI/CD Automation");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("AWS (VPC, IAM, EC2, ALB)");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("DCGM Exporter");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("vLLM / LLM Serving");
    // The kernels are Triton; "CUDA" is claimed only where it is literally true.
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("Triton Benchmarking / Tuning");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("CUDA Graphs");
    expect(publicResumeData.skills["Self-Directed / Lab"]).toContain("k6 Load Testing");
    // Keep broad expertise claims out of Skills; named lab tools have portfolio evidence.
    const allSkills = Object.values(publicResumeData.skills).flat();
    expect(allSkills).not.toContain("Kernel Fusion");
    expect(allSkills).not.toContain("GPU Profiling");
    // Nsight Compute counters exist for A10G only, so it lives in a bullet beside
    // the counters measured, not as a standalone (profiling-proficiency) skill.
    expect(allSkills).not.toContain("Nsight Compute");
    // Labs are a clearly-labeled self-directed section, with an honesty note.
    expect(publicResumeData.projects?.title).toBe("ML Inference — Self-Directed (2025–Present)");
    expect(publicResumeData.projects?.note).toContain("negative results");
    expect(publicResumeData.projects?.items[0]?.title).toContain("GPU Inference Decision Lab");
    expect(publicResumeData.projects?.items[0]?.highlights.length).toBe(4);
    expect(publicResumeData.projects?.items[1]?.title).toBe("Triton GPU Kernel Lab (NVIDIA A10G + H200)");
    expect(publicResumeData.projects?.items[1]?.highlights.length).toBe(3);
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
    // Static Inter instances (Regular, Medium, SemiBold, Italic, Display
    // SemiBold), not the variable font, which Chrome writes as Type 3.
    expect(embeddedFontCount).toBe(5);
    expect(html).not.toContain("'Avenir Next'");
  });

  test("every font-weight the PDF CSS uses has an embedded face", () => {
    // With static faces Chrome never fails on a missing weight: it synthesizes
    // bolder weights and maps lighter ones to the nearest face. This catches the
    // common slip (a new font-weight in the PDF CSS); it does not check
    // family/style combinations such as a 600 italic.
    const html = renderResumeHtmlDocument(publicResumeData);
    const faceBlocks = /@font-face \{[^}]*\}/g;
    const weights = (css: string) =>
      new Set([...css.matchAll(/font-weight: (\d+);/g)].map((match) => match[1]));
    const embedded = weights((html.match(faceBlocks) ?? []).join("\n"));
    const used = weights(html.replace(faceBlocks, ""));

    expect(used.size).toBeGreaterThan(0);
    expect([...used].filter((weight) => !embedded.has(weight))).toEqual([]);
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
