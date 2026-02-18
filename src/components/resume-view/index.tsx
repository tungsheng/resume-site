// Resume view component - shared between Admin preview and public Resume page

import React from "react";
import type { ResumeData } from "../../types";
import { getResumeStyles } from "../../styles";
import {
  DEFAULT_RESUME_TEMPLATE,
  type ResumeLayoutTemplate,
} from "../../layouts";
import { buildResumeViewModel } from "../../domain/resume/view-model";
import { hexToRgba } from "../../utils";

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
  const view = buildResumeViewModel(data, layoutTemplate);
  const timelineRailColor = hexToRgba(themeColor, 0.45);

  const summarySection = view.hasSummary ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Professional Summary
      </h2>
      <p style={resumeStyles.summary}>{view.summary}</p>
    </section>
  ) : null;

  const skillsSection = view.hasSkills ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Skills
      </h2>
      <div style={resumeStyles.skills}>
        {view.skills.map((skill) => (
          <div
            key={skill.category}
            style={view.isSingleColumnLayout ? resumeStyles.skillLine : resumeStyles.skillCat}
          >
            <div
              style={
                view.isSingleColumnLayout
                  ? resumeStyles.skillCategoryInline
                  : resumeStyles.skillTitle
              }
            >
              {skill.categoryLabel}
            </div>
            {view.isSingleColumnLayout ? ": " : null}
            <span style={resumeStyles.skillItems}>
              {skill.itemsText}
            </span>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const educationSection = view.hasEducation ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Education
      </h2>
      {view.education.map((edu, i) => {
        if (view.isSingleColumnLayout) {
          return (
            <div key={i} style={resumeStyles.eduLine}>
              {edu.lineText}
            </div>
          );
        }

        return (
          <div key={i} style={resumeStyles.eduItem}>
            <div style={resumeStyles.eduDegree}>{edu.degree}</div>
            <div style={resumeStyles.eduSchool}>{edu.school}</div>
            <div style={resumeStyles.eduDate}>{edu.dateRange}</div>
          </div>
        );
      })}
    </section>
  ) : null;

  const certificatesSection = view.hasCertificates ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Certifications
      </h2>
      {view.certificates.map((cert, i) => (
        <div key={i} style={resumeStyles.certItem}>
          <div style={resumeStyles.certTitle}>{cert.title}</div>
          <div style={resumeStyles.certIssuer}>{cert.issuer}</div>
          <div style={resumeStyles.certDate}>{cert.date}</div>
        </div>
      ))}
    </section>
  ) : null;

  const experienceSection = view.hasExperience ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        Work Experience
      </h2>
      <div style={resumeStyles.expList}>
        {view.isTimelineLayout && (
          <div style={{ ...resumeStyles.expRail, background: timelineRailColor }} />
        )}
        {view.experience.map((exp, i) => (
          <div
            key={i}
            style={
              view.isTimelineLayout && i === view.experience.length - 1
                ? { ...resumeStyles.expItem, marginBottom: 0 }
                : resumeStyles.expItem
            }
          >
            {view.isTimelineLayout && (
              <span style={{ ...resumeStyles.expDot, borderColor: themeColor }} />
            )}
            <div style={resumeStyles.expContent}>
              <div style={resumeStyles.expHeader}>
                <span style={resumeStyles.expMeta}>
                  <span style={resumeStyles.expTitle}>{exp.title}</span>
                  <span style={resumeStyles.expSeparator}> • </span>
                  <span style={resumeStyles.expCompany}>{exp.company}</span>
                </span>
                <span style={resumeStyles.expDate}>{exp.dateRange}</span>
              </div>
              {exp.highlights.length > 0 && (
                <ul style={resumeStyles.expHighlights}>
                  {exp.highlights.map((h, j) => (
                    <li key={j}>
                      <span style={{ color: themeColor, marginRight: 8 }}>•</span>
                      {h}
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
            <h1 style={resumeStyles.name}>{view.header.name}</h1>
            {view.hasBadges && (
              <div style={resumeStyles.badges}>
                {view.header.badges.map((badge, i) => (
                  <span key={i} style={{ ...resumeStyles.badge, background: themeColor }}>
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={resumeStyles.contact}>
            {view.header.contacts.phone && (
              <div>{view.header.contacts.phone}</div>
            )}
            {view.header.contacts.email && (
              <div>
                <a href={`mailto:${view.header.contacts.email}`} style={resumeStyles.link}>
                  {view.header.contacts.email}
                </a>
              </div>
            )}
            {view.header.contacts.linkedin && (
              <div>
                <a
                  href={`https://linkedin.com/in/${encodeURIComponent(view.header.contacts.linkedin)}`}
                  style={resumeStyles.link}
                >
                  {`linkedin.com/in/${view.header.contacts.linkedin}`}
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={resumeStyles.body}>
        {view.isSingleColumnLayout ? (
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
