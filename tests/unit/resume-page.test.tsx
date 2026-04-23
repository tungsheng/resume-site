import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumePageContent } from "../../src/features/resume/page";
import type { ResumeData } from "../../src/types";

const sampleResume: ResumeData = {
  header: {
    name: "Tony Lee",
    badges: ["Platform", "Infrastructure"],
    contacts: {
      linkedin: "tonyslee8",
      email: "tony@example.com",
    },
    summary: "Builds reliable infrastructure.",
  },
  experience: [
    {
      title: "Staff Software Engineer",
      company: "Example Co",
      startDate: "2022",
      endDate: "Present",
      highlights: ["Led platform modernization."],
    },
  ],
  skills: {
    Infrastructure: ["AWS", "Kubernetes"],
  },
  education: [
    {
      school: "Example University",
      degree: "B.S. Computer Science",
      startDate: "2015",
      endDate: "2019",
    },
  ],
};

describe("ResumePageContent", () => {
  test("renders the streamlined web resume with PDF download available", () => {
    const html = renderToStaticMarkup(
        <ResumePageContent
          data={sampleResume}
        downloading={false}
        onDownload={() => {}}
        toasts={[]}
        onRemoveToast={() => {}}
      />
    );

    expect(html).toContain("class=\"site-header\"");
    expect(html).toContain("class=\"site-footer\"");
    expect(html).toContain("aria-current=\"page\">Resume<");
    expect(html).toContain("aria-label=\"Tony Lee home\"");
    expect(html).toContain("class=\"site-brand__logo\"");
    expect(html).toContain("T│L");
    expect(html).toContain("ML inference infrastructure");
    expect(html).toContain("Professional Summary");
    expect(html).toContain("View project");
    expect(html).toContain("View experiments");
    expect(html).toContain(">Email<");
    expect(html).toContain(">LinkedIn<");
    expect(html).toContain("title=\"Download resume PDF\"");
    expect(html).toContain("class=\"resume-download-button\"");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).toContain("Led platform modernization.");
  });
});
