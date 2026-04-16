import { describe, expect, test } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ResumeView } from "../../src/components";
import type { ResumeData } from "../../src/types";

const sampleResume: ResumeData = {
  header: {
    name: "Tony & Lee",
    badges: ["Platform <Engineering>"],
    contacts: {
      phone: "(555) 000-0000",
      linkedin: "tony lee/dev",
      email: "tony+resume@example.com",
    },
    summary: "Builds resilient systems & reliable delivery.",
  },
  experience: [
    {
      title: "R&D Lead",
      company: "AT&T <Labs>",
      startDate: "2023",
      endDate: "Present",
      highlights: ["Scaled core services & reduced incidents."],
    },
  ],
  projects: {
    title: "Selected Projects",
    items: [
      {
        title: "GPU <Inference> Platform",
        highlights: ["Measured queue pressure & scaled nodes."],
      },
    ],
  },
  skills: {
    Languages: ["TypeScript", "SQL"],
  },
  education: [
    {
      school: "State University",
      degree: "B.S. Computer Science",
      startDate: "2015",
      endDate: "2019",
    },
  ],
  certificates: [],
};

describe("ResumeView", () => {
  test("escapes text once without double-encoding entities", () => {
    const html = renderToStaticMarkup(
      <ResumeView
        data={sampleResume}
        themeColor="#c9a86c"
        layoutTemplate="single-column-ats"
      />
    );

    expect(html).toContain("Tony &amp; Lee");
    expect(html).toContain("AT&amp;T &lt;Labs&gt;");
    expect(html).not.toContain("&amp;amp;");
  });

  test("encodes linkedin handle in link href while keeping display readable", () => {
    const html = renderToStaticMarkup(
      <ResumeView
        data={sampleResume}
        themeColor="#c9a86c"
        layoutTemplate="single-column-ats"
      />
    );

    expect(html).toContain("href=\"https://linkedin.com/in/tony%20lee%2Fdev\"");
    expect(html).toContain("linkedin.com/in/tony lee/dev");
  });

  test("renders project sections with escaped titles", () => {
    const html = renderToStaticMarkup(
      <ResumeView
        data={sampleResume}
        themeColor="#c9a86c"
        layoutTemplate="single-column-ats"
      />
    );

    expect(html).toContain("Selected Projects");
    expect(html).toContain("GPU &lt;Inference&gt; Platform");
    expect(html).toContain("Measured queue pressure &amp; scaled nodes.");
  });
});
