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
      phone: "(555) 000-0000",
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
  certificates: [],
};

describe("ResumePageContent", () => {
  test("renders the shared header and right-side PDF control around the preview", () => {
    const html = renderToStaticMarkup(
      <ResumePageContent
        data={sampleResume}
        themeColor="#27ae60"
        layoutTemplate="minimal-timeline"
        previewScale={0.9}
        downloading={false}
        onDownload={() => {}}
        toasts={[]}
        onRemoveToast={() => {}}
      />
    );

    expect(html).toContain("class=\"site-header\"");
    expect(html).toContain("aria-current=\"page\">Resume<");
    expect(html).toContain("class=\"resume-preview-shell\"");
    expect(html).toContain("class=\"resume-preview-sidebar\"");
    expect(html).toContain("title=\"Download resume PDF\"");
    expect(html).not.toContain(">Print<");
  });
});
