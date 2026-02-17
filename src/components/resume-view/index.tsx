// Resume view component - shared between Admin preview and public Resume page

import React from "react";
import type { ResumeData } from "../../types";
import { getResumeStyles } from "../../styles";
import {
  DEFAULT_RESUME_TEMPLATE,
  type ResumeLayoutTemplate,
} from "../../layouts";
import { escapeHtml, hexToRgba } from "../../utils";

interface ResumeViewProps {
  data: ResumeData;
  themeColor: string;
  layoutTemplate?: ResumeLayoutTemplate;
}

export function ResumeView({
  data,
  themeColor,
  layoutTemplate = DEFAULT_RESUME_TEMPLATE,
}: ResumeViewProps) {
  const resumeStyles = getResumeStyles(layoutTemplate);
  const isSingleColumnLayout = layoutTemplate === "single-column-ats";
  const isTimelineLayout = layoutTemplate === "minimal-timeline";
  const timelineRailColor = hexToRgba(themeColor, 0.45);
  const hasBadges = data.header.badges.length > 0;
  const hasEducation = data.education.length > 0;
  const hasSkills = Object.keys(data.skills).length > 0;
  const hasCertificates = data.certificates.length > 0;
  const hasSummary = data.header.summary.trim().length > 0;
  const hasExperience = data.experience.length > 0;

  const summarySection = hasSummary ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Professional Summary
      </h2>
      <p style={resumeStyles.summary}>{escapeHtml(data.header.summary.trim())}</p>
    </section>
  ) : null;

  const skillsSection = hasSkills ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Skills
      </h2>
      <div style={resumeStyles.skills}>
        {Object.entries(data.skills).map(([cat, items]) => (
          <div
            key={cat}
            style={isSingleColumnLayout ? resumeStyles.skillLine : resumeStyles.skillCat}
          >
            <div
              style={
                isSingleColumnLayout
                  ? resumeStyles.skillCategoryInline
                  : resumeStyles.skillTitle
              }
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </div>
            {isSingleColumnLayout ? ": " : null}
            <span style={resumeStyles.skillItems}>
              {items.map(escapeHtml).join(" • ")}
            </span>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const educationSection = hasEducation ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Education
      </h2>
      {data.education.map((edu, i) => {
        if (isSingleColumnLayout) {
          return (
            <div key={i} style={resumeStyles.eduLine}>
              {escapeHtml(edu.degree)} • {escapeHtml(edu.school)} •{" "}
              {escapeHtml(edu.startDate)} - {escapeHtml(edu.endDate)}
            </div>
          );
        }

        return (
          <div key={i} style={resumeStyles.eduItem}>
            <div style={resumeStyles.eduDegree}>{escapeHtml(edu.degree)}</div>
            <div style={resumeStyles.eduSchool}>{escapeHtml(edu.school)}</div>
            <div style={resumeStyles.eduDate}>
              {escapeHtml(edu.startDate)} - {escapeHtml(edu.endDate)}
            </div>
          </div>
        );
      })}
    </section>
  ) : null;

  const certificatesSection = hasCertificates ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Certifications
      </h2>
      {data.certificates.map((cert, i) => (
        <div key={i} style={resumeStyles.certItem}>
          <div style={resumeStyles.certTitle}>{escapeHtml(cert.title)}</div>
          <div style={resumeStyles.certIssuer}>{escapeHtml(cert.issuer)}</div>
          <div style={resumeStyles.certDate}>{escapeHtml(cert.date)}</div>
        </div>
      ))}
    </section>
  ) : null;

  const experienceSection = hasExperience ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Work Experience
      </h2>
      <div style={resumeStyles.expList}>
        {isTimelineLayout && (
          <div style={{ ...resumeStyles.expRail, background: timelineRailColor }} />
        )}
        {data.experience.map((exp, i) => (
          <div
            key={i}
            style={
              isTimelineLayout && i === data.experience.length - 1
                ? { ...resumeStyles.expItem, marginBottom: 0 }
                : resumeStyles.expItem
            }
          >
            {isTimelineLayout && (
              <span style={{ ...resumeStyles.expDot, borderColor: themeColor }} />
            )}
            <div style={resumeStyles.expContent}>
              <div style={resumeStyles.expHeader}>
                <span style={resumeStyles.expMeta}>
                  <span style={resumeStyles.expTitle}>{escapeHtml(exp.title)}</span>
                  <span style={resumeStyles.expSeparator}> • </span>
                  <span style={resumeStyles.expCompany}>{escapeHtml(exp.company)}</span>
                </span>
                <span style={resumeStyles.expDate}>
                  {escapeHtml(exp.startDate)} - {escapeHtml(exp.endDate)}
                </span>
              </div>
              {exp.highlights.length > 0 && (
                <ul style={resumeStyles.expHighlights}>
                  {exp.highlights.map((h, j) => (
                    <li key={j}>
                      <span style={{ color: themeColor, marginRight: 8 }}>•</span>
                      {escapeHtml(h)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <div style={resumeStyles.page}>
      <header style={{ ...resumeStyles.header, borderBottomColor: themeColor }}>
        <div style={resumeStyles.headerContent}>
          <div style={resumeStyles.headerLeft}>
            <h1 style={resumeStyles.name}>{escapeHtml(data.header.name)}</h1>
            {hasBadges && (
              <div style={resumeStyles.badges}>
                {data.header.badges.map((badge, i) => (
                  <span key={i} style={{ ...resumeStyles.badge, background: themeColor }}>
                    {escapeHtml(badge)}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={resumeStyles.contact}>
            {data.header.contacts.phone && (
              <div>{escapeHtml(data.header.contacts.phone)}</div>
            )}
            {data.header.contacts.email && (
              <div>
                <a href={`mailto:${data.header.contacts.email}`} style={resumeStyles.link}>
                  {escapeHtml(data.header.contacts.email)}
                </a>
              </div>
            )}
            {data.header.contacts.linkedin && (
              <div>
                <a
                  href={`https://linkedin.com/in/${data.header.contacts.linkedin}`}
                  style={resumeStyles.link}
                >
                  linkedin.com/in/{escapeHtml(data.header.contacts.linkedin)}
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={resumeStyles.body}>
        {isSingleColumnLayout ? (
          <div style={resumeStyles.singleColumnFlow}>
            {summarySection}
            {skillsSection}
            {experienceSection}
            {educationSection}
            {certificatesSection}
          </div>
        ) : (
          <>
            <div style={resumeStyles.sidebar}>
              {educationSection}
              {skillsSection}
              {certificatesSection}
            </div>

            <div style={resumeStyles.main}>
              {summarySection}
              {experienceSection}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
