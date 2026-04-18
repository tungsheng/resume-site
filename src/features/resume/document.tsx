import React from "react";
import {
  DEFAULT_RESUME_TEMPLATE,
  type ResumeLayoutTemplate,
} from "../../layouts";
import type { ResumeData } from "../../types";
import { hexToRgba } from "../../utils";
import { buildResumeViewModel } from "../../domain/resume/view-model";
import { LETTER_HEIGHT_PX, LETTER_WIDTH_PX } from "./document-css";

interface ResumeDocumentProps {
  data: ResumeData;
  themeColor: string;
  layoutTemplate?: ResumeLayoutTemplate;
}

interface ResumeDocumentPreviewProps extends ResumeDocumentProps {
  scale?: number;
}

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
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8" cy="8" r="1" />
      <line x1="8" y1="11" x2="8" y2="16.5" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <path d="M12 13.1a2.4 2.4 0 0 1 4.8 0v3.4" />
    </svg>
  );
}

function ResumeBulletList({
  items,
  className,
}: {
  items: string[];
  className: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>
          <span className="resume-list-bullet" aria-hidden="true">
            •
          </span>
          <span className="resume-list-text">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ResumeDocument({
  data,
  themeColor,
  layoutTemplate = DEFAULT_RESUME_TEMPLATE,
}: ResumeDocumentProps) {
  const view = buildResumeViewModel(data, layoutTemplate);
  const headlineText = view.hasBadges ? view.header.badges.join(" • ") : "";
  const documentStyle = {
    "--resume-accent": themeColor,
    "--resume-timeline-rail-color": hexToRgba(themeColor, 0.45),
  } as React.CSSProperties;

  const summarySection = view.hasSummary ? (
    <section className="section">
      <h2 className="section-title">Professional Summary</h2>
      <p className="summary">{view.summary}</p>
    </section>
  ) : null;

  const skillsSection = view.hasSkills ? (
    <section className="section">
      <h2 className="section-title">Skills</h2>
      <div className="skills-list">
        {view.skills.map((skill) => (
          <div
            key={skill.category}
            className={view.isSingleColumnLayout ? "skill-line" : "skill-category"}
          >
            <span
              className={
                view.isSingleColumnLayout ? "skill-category-inline" : "skill-category-title"
              }
            >
              {skill.categoryLabel}
            </span>
            {view.isSingleColumnLayout ? ": " : null}
            <span className="skill-items">{skill.itemsText}</span>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const projectsSection = view.hasProjects ? (
    <section className="section">
      <h2 className="section-title">{view.projectsTitle}</h2>
      <div className="project-list">
        {view.projects.map((project, index) => (
          <div key={`${project.title}-${index}`} className="project-item">
            <div className="project-title">{project.title}</div>
            <ResumeBulletList
              items={project.highlights}
              className="project-highlights"
            />
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const educationSection = view.hasEducation ? (
    <section className="section">
      <h2 className="section-title">Education</h2>
      {view.education.map((education, index) =>
        view.isSingleColumnLayout ? (
          <div key={`${education.school}-${index}`} className="education-line">
            {education.lineText}
          </div>
        ) : (
          <div key={`${education.school}-${index}`} className="education-item">
            <div className="education-degree">{education.degree}</div>
            <div className="education-school">{education.school}</div>
            <div className="education-date">{education.dateRange}</div>
          </div>
        )
      )}
    </section>
  ) : null;

  const certificatesSection = view.hasCertificates ? (
    <section className="section">
      <h2 className="section-title">Certifications</h2>
      {view.certificates.map((certificate, index) => (
        <div key={`${certificate.title}-${index}`} className="certificate-item">
          <div className="certificate-title">{certificate.title}</div>
          <div className="certificate-issuer">{certificate.issuer}</div>
          <div className="certificate-date">{certificate.date}</div>
        </div>
      ))}
    </section>
  ) : null;

  const experienceSection = view.hasExperience ? (
    <section className="section">
      <h2 className="section-title">Work Experience</h2>
      <div className="experience-list">
        {view.isTimelineLayout ? <div className="experience-rail" /> : null}
        {view.experience.map((experience, index) => (
          <div key={`${experience.title}-${index}`} className="experience-item">
            {view.isTimelineLayout ? <span className="experience-dot" /> : null}
            <div className="experience-content">
              <div className="experience-header">
                <span className="experience-meta">
                  <span className="experience-title">{experience.title}</span>
                  <span className="experience-separator"> • </span>
                  <span className="experience-company">{experience.company}</span>
                </span>
                <span className="experience-date">{experience.dateRange}</span>
              </div>
              <ResumeBulletList
                items={experience.highlights}
                className="experience-highlights"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <article
      className={`resume-document page layout-${layoutTemplate}`}
      data-layout-template={layoutTemplate}
      style={documentStyle}
    >
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="name">{view.header.name}</h1>
            {headlineText ? <p className="header-subtitle">{headlineText}</p> : null}
          </div>

          {view.header.contacts.phone ||
          view.header.contacts.email ||
          view.header.contacts.linkedin ? (
            <div className="contact-info">
              {view.header.contacts.phone ? (
                <div className="contact-row">
                  <span className="contact-label">Phone</span>
                  <span className="contact-value">{view.header.contacts.phone}</span>
                </div>
              ) : null}

              {view.header.contacts.email ? (
                <div className="contact-row contact-row-icon">
                  <a
                    className="contact-link"
                    href={`mailto:${view.header.contacts.email}`}
                  >
                    {view.header.contacts.email}
                  </a>
                  <span className="contact-icon">
                    <MailMiniIcon />
                  </span>
                </div>
              ) : null}

              {view.header.contacts.linkedin ? (
                <div className="contact-row contact-row-icon">
                  <a
                    className="contact-link"
                    href={`https://linkedin.com/in/${encodeURIComponent(view.header.contacts.linkedin)}`}
                  >
                    {`linkedin.com/in/${view.header.contacts.linkedin}`}
                  </a>
                  <span className="contact-icon">
                    <LinkedinMiniIcon />
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="header-divider" />
      </header>

      <div className="main-content">
        {view.isSingleColumnLayout ? (
          <div className="single-column-flow">
            {summarySection}
            {skillsSection}
            {projectsSection}
            {experienceSection}
            {educationSection}
            {certificatesSection}
          </div>
        ) : (
          <>
            <div className="left-column">
              {educationSection}
              {skillsSection}
              {certificatesSection}
            </div>

            <div className="right-column">
              {summarySection}
              {projectsSection}
              {experienceSection}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

export function ResumeDocumentPreview({
  data,
  themeColor,
  layoutTemplate = DEFAULT_RESUME_TEMPLATE,
  scale = 1,
}: ResumeDocumentPreviewProps) {
  return (
    <div
      className="resume-sheet"
      style={{
        width: `${LETTER_WIDTH_PX * scale}px`,
        minHeight: `${LETTER_HEIGHT_PX * scale}px`,
        margin: 0,
      }}
    >
      <div
        className="resume-sheet__page"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ResumeDocument
          data={data}
          themeColor={themeColor}
          layoutTemplate={layoutTemplate}
        />
      </div>
    </div>
  );
}
