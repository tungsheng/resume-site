import { describe, expect, test } from "bun:test";
import { generateHTML, listResumes, loadResume } from "../../src/services/resume";
import type { ResumeData } from "../../src/types";

describe("Resume Service", () => {
  test("listResumes returns array", async () => {
    const files = await listResumes();
    expect(files).toBeArray();
  });

  test("loadResume returns null for missing file", async () => {
    const data = await loadResume("nonexistent-xyz");
    expect(data).toBeNull();
  });

  test("loadResume returns null for path traversal", async () => {
    const data = await loadResume("../etc/passwd");
    expect(data).toBeNull();
  });

  test("loadResume supports v2 profile schema", async () => {
    const data = await loadResume("tony-lee");
    expect(data).not.toBeNull();
    expect(data?.header.name).toBe("Tony Lee");
    expect(data?.skills["Languages"]).toBeArray();
    expect(data?.certificates).toBeArray();
  });

  test("loadResume supports legacy string-based skills", async () => {
    const data = await loadResume("tony-lee-1");
    expect(data).not.toBeNull();
    expect(data?.skills["languages"]).toContain("Python");
    expect(data?.certificates).toBeArray();
  });

  test("generateHTML creates valid HTML", () => {
    const mockData: ResumeData = {
      header: {
        name: "John Doe",
        badges: ["Badge1"],
        contacts: {
          phone: "555-1234",
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
      skills: { frontend: ["React"], backend: ["Node.js"], management: ["Agile"] },
      education: [
        { school: "University", degree: "BS CS", startDate: "2016", endDate: "2020" },
      ],
      certificates: [{ title: "AWS", issuer: "Amazon", date: "2022" }],
    };

    const html = generateHTML(mockData);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("John Doe");
    expect(html).toContain("Developer");
  });

  test("generateHTML escapes XSS", () => {
    const xssData: ResumeData = {
      header: {
        name: '<script>alert("XSS")</script>',
        badges: [],
        contacts: { phone: "", linkedin: "", email: "" },
        summary: "",
      },
      experience: [],
      skills: { frontend: [], backend: [], management: [] },
      education: [],
      certificates: [],
    };

    const html = generateHTML(xssData);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  test("generateHTML single-column template uses ATS section order", () => {
    const mockData: ResumeData = {
      header: {
        name: "John Doe",
        badges: ["Badge1"],
        contacts: {
          phone: "555-1234",
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
      skills: { frontend: ["React"], backend: ["Node.js"], management: ["Agile"] },
      education: [
        { school: "University", degree: "BS CS", startDate: "2016", endDate: "2020" },
      ],
      certificates: [{ title: "AWS", issuer: "Amazon", date: "2022" }],
    };

    const html = generateHTML(mockData, "#c9a86c", "single-column-ats");
    const summaryIndex = html.indexOf("<h2 class=\"section-title\">Professional Summary</h2>");
    const skillsIndex = html.indexOf("<h2 class=\"section-title\">Skills</h2>");
    const experienceIndex = html.indexOf("<h2 class=\"section-title\">Work Experience</h2>");
    const educationIndex = html.indexOf("<h2 class=\"section-title\">Education</h2>");
    const certificationsIndex = html.indexOf("<h2 class=\"section-title\">Certifications</h2>");

    expect(html).toContain("<div class=\"single-column-flow\">");
    expect(summaryIndex).toBeGreaterThan(-1);
    expect(skillsIndex).toBeGreaterThan(summaryIndex);
    expect(experienceIndex).toBeGreaterThan(skillsIndex);
    expect(educationIndex).toBeGreaterThan(experienceIndex);
    expect(certificationsIndex).toBeGreaterThan(educationIndex);
    expect(html).toContain("class=\"education-line\">BS CS • University • 2016 - 2020</div>");
    expect(html).toContain("class=\"skill-line\"><span class=\"skill-category-inline\">Frontend:</span>");
  });

  test("generateHTML timeline template includes connected rail and job dots", () => {
    const mockData: ResumeData = {
      header: {
        name: "John Doe",
        badges: [],
        contacts: {
          phone: "555-1234",
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
      certificates: [],
    };

    const html = generateHTML(mockData, "#c9a86c", "minimal-timeline");
    const dotCount = html.match(/class="experience-dot"/g)?.length ?? 0;

    expect(html).toContain("<div class=\"experience-list\">");
    expect(html).toContain("<div class=\"experience-rail\"></div>");
    expect(dotCount).toBe(mockData.experience.length);
    expect(html).toContain(".page.layout-minimal-timeline .experience-item {\n  padding-left: 22px;");
    expect(html).toContain(".page.layout-minimal-timeline .badge {\n  border-radius: 999px;");
    expect(html).toContain(".page.layout-minimal-timeline .experience-title,\n.page.layout-minimal-timeline .education-degree,\n.page.layout-minimal-timeline .certificate-title {");
  });
});
