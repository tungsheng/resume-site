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
  scale?: number;
  outerMargin?: number;
}

const LETTER_WIDTH_PX = 8.5 * 96;
const LETTER_HEIGHT_PX = 11 * 96;

function MailMiniIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
      width="11"
      height="11"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <polyline points="3,7 12,13 21,7" />
    </svg>
  );
}

function LinkedinMiniIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
      width="11"
      height="11"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1" />
      <line x1="8" y1="11" x2="8" y2="16.5" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <path d="M12 13.1a2.4 2.4 0 0 1 4.8 0v3.4" />
    </svg>
  );
}

export function ResumeView({
  data,
  themeColor,
  layoutTemplate = DEFAULT_RESUME_TEMPLATE,
  scale = 1,
  outerMargin = 20,
}: ResumeViewProps) {
  const resumeStyles = getResumeStyles(layoutTemplate);
  const view = buildResumeViewModel(data, layoutTemplate);
  const timelineRailColor = hexToRgba(themeColor, 0.45);
  const headlineText = view.hasBadges ? view.header.badges.join(" • ") : "";
  const hasContacts = Boolean(
    view.header.contacts.phone ||
      view.header.contacts.email ||
      view.header.contacts.linkedin
  );

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

  const projectsSection = view.hasProjects ? (
    <section style={resumeStyles.section}>
      <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
        {view.projectsTitle}
      </h2>
      <div style={resumeStyles.projectList}>
        {view.projects.map((project, i) => (
          <div key={`${project.title}-${i}`} style={resumeStyles.projectItem}>
            <div style={resumeStyles.projectTitle}>{project.title}</div>
            {project.highlights.length > 0 && (
              <ul style={resumeStyles.projectHighlights}>
                {project.highlights.map((highlight, j) => (
                  <li key={j}>
                    <span style={{ color: themeColor, marginRight: 8 }}>•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
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
    <div
      style={{
        width: `${LETTER_WIDTH_PX * scale}px`,
        minHeight: `${LETTER_HEIGHT_PX * scale}px`,
        margin: `${outerMargin}px auto`,
      }}
      className="resume-sheet"
    >
      <div
        style={{
          ...resumeStyles.page,
          margin: 0,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="resume-sheet__page"
      >
        <header style={resumeStyles.header}>
          <div style={resumeStyles.headerContent}>
            <div style={resumeStyles.headerLeft}>
              <h1 style={{ ...resumeStyles.name, color: themeColor }}>{view.header.name}</h1>
              {headlineText && <p style={resumeStyles.headerSubtitle}>{headlineText}</p>}
            </div>
            {hasContacts && (
              <div style={resumeStyles.contact}>
                {view.header.contacts.phone && (
                  <div style={resumeStyles.contactRow}>
                    <span style={resumeStyles.contactLabel}>Phone</span>
                    <span style={resumeStyles.contactValue}>{view.header.contacts.phone}</span>
                  </div>
                )}
                {view.header.contacts.email && (
                  <div style={{ ...resumeStyles.contactRow, ...resumeStyles.contactRowIcon }}>
                    <a href={`mailto:${view.header.contacts.email}`} style={resumeStyles.contactLink}>
                      {view.header.contacts.email}
                    </a>
                    <span style={resumeStyles.contactIcon}>
                      <MailMiniIcon />
                    </span>
                  </div>
                )}
                {view.header.contacts.linkedin && (
                  <div style={{ ...resumeStyles.contactRow, ...resumeStyles.contactRowIcon }}>
                    <a
                      href={`https://linkedin.com/in/${encodeURIComponent(view.header.contacts.linkedin)}`}
                      style={resumeStyles.contactLink}
                    >
                      {`linkedin.com/in/${view.header.contacts.linkedin}`}
                    </a>
                    <span style={resumeStyles.contactIcon}>
                      <LinkedinMiniIcon />
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ ...resumeStyles.headerDivider, borderTopColor: themeColor }} />
        </header>

        <div style={resumeStyles.body}>
          {view.isSingleColumnLayout ? (
            <div style={resumeStyles.singleColumnFlow}>
              {summarySection}
              {skillsSection}
              {projectsSection}
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
                {projectsSection}
                {experienceSection}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
