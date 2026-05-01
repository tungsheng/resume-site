import { describe, expect, test } from "bun:test";
import { publicResumeData } from "../../src/features/resume/data";
import { renderResumeHtmlDocument } from "../../src/features/resume/render-static-html";
import type { ResumeData } from "../../src/types";

describe("Resume Service", () => {
  test("publicResumeData contains the checked-in public resume", () => {
    expect(publicResumeData.header.name).toBe("Tony Lee");
    expect(publicResumeData.skills["Languages"]).toBeArray();
    expect(publicResumeData.skills["Infrastructure"]).toContain("AWS (VPC, IAM, EC2, ALB)");
    expect(publicResumeData.projects?.title).toBe("Selected Project");
    expect(publicResumeData.projects?.items[0]?.title).toContain("GPU Inference Lab");
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
