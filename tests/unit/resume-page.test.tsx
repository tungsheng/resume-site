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
  test("renders the streamlined web resume by default while keeping the print layout mounted", () => {
    const html = renderToStaticMarkup(
        <ResumePageContent
          data={sampleResume}
          themeColor="#27ae60"
          previewScale={0.9}
        downloading={false}
        showPrintPreview={false}
        onDownload={() => {}}
        onShowWebResume={() => {}}
        onShowPrintPreview={() => {}}
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
    expect(html).toContain("Web view");
    expect(html).toContain("Print preview");
    expect(html).toContain("View case study");
    expect(html).toContain("View evidence");
    expect(html).toContain(">Email<");
    expect(html).toContain(">LinkedIn<");
    expect(html).toContain("class=\"page-wrapper resume-page-wrapper resume-page-wrapper--screen-hidden\"");
    expect(html).toContain("class=\"resume-preview-shell\"");
    expect(html).toContain("title=\"Download resume PDF\"");
    expect(html).toContain("class=\"inline-links page-hero__links\"");
    expect(html).not.toContain(">Print<");
    expect(html).not.toContain("class=\"page-eyebrow\">Resume<");
    expect(html).not.toContain("Web view is the default. Print preview shows the unchanged one-page PDF layout.");
    expect(html).toContain("Led platform modernization.");
    expect(html).not.toContain("Preview notes");
  });

  test("shows the unchanged print preview when the preview toggle is active", () => {
    const html = renderToStaticMarkup(
        <ResumePageContent
          data={sampleResume}
          themeColor="#27ae60"
          previewScale={0.9}
        downloading={false}
        showPrintPreview={true}
        onDownload={() => {}}
        onShowWebResume={() => {}}
        onShowPrintPreview={() => {}}
        toasts={[]}
        onRemoveToast={() => {}}
      />
    );

    expect(html).toContain("Web view");
    expect(html).toContain("Print preview");
    expect(html).toContain("class=\"resume-preview-shell\"");
    expect(html).toContain("class=\"page-wrapper resume-page-wrapper resume-page-wrapper--preview\"");
    expect(html).toContain("class=\"site-footer\"");
    expect(html).not.toContain(
      "class=\"page-wrapper resume-page-wrapper resume-page-wrapper--screen-hidden\""
    );
    expect(html).not.toContain("Professional summary");
  });
});
