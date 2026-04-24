import React from "react";
import type { ResumeData } from "../../types";
import { buildResumeViewModel } from "./view-model";

interface ResumeDocumentProps {
  data: ResumeData;
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
}: {
  items: string[];
}) {
  if (items.length === 0) return null;

  return (
    <ul className="resume-highlights">
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

export function ResumeDocument({ data }: ResumeDocumentProps) {
  const view = buildResumeViewModel(data);
  const headlineText = view.header.badges.join(" • ");

  const summarySection = view.summary ? (
    <section className="section">
      <h2 className="section-title">Professional Summary</h2>
      <p className="summary">{view.summary}</p>
    </section>
  ) : null;

  const skillsSection = view.skills.length > 0 ? (
    <section className="section">
      <h2 className="section-title">Skills</h2>
      <div className="skills-list">
        {view.skills.map((skill) => (
          <div key={skill.category} className="skill-category">
            <span className="skill-category-title">{skill.categoryLabel}</span>
            <span className="skill-items">{skill.itemsText}</span>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const projectsSection = view.projects.length > 0 ? (
    <section className="section">
      <h2 className="section-title">{view.projectsTitle}</h2>
      <div className="project-list">
        {view.projects.map((project, index) => (
          <div key={`${project.title}-${index}`} className="project-item">
            <div className="project-title">{project.title}</div>
            <ResumeBulletList items={project.highlights} />
          </div>
        ))}
      </div>
    </section>
  ) : null;

  const educationSection = view.education.length > 0 ? (
    <section className="section">
      <h2 className="section-title">Education</h2>
      {view.education.map((education, index) => (
        <div key={`${education.school}-${index}`} className="education-item">
          <div className="education-degree">{education.degree}</div>
          <div className="education-school">{education.school}</div>
          <div className="education-date">{education.dateRange}</div>
        </div>
      ))}
    </section>
  ) : null;

  const experienceSection = view.experience.length > 0 ? (
    <section className="section">
      <h2 className="section-title">Work Experience</h2>
      <div className="experience-list">
        <div className="experience-rail" />
        {view.experience.map((experience, index) => (
          <div key={`${experience.title}-${index}`} className="experience-item">
            <span className="experience-dot" />
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
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  ) : null;

  return (
    <article className="resume-document">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="name">{view.header.name}</h1>
            {headlineText ? <p className="header-subtitle">{headlineText}</p> : null}
          </div>

          {view.header.contacts.email || view.header.contacts.linkedin ? (
            <div className="contact-info">
              {view.header.contacts.email ? (
                <div className="contact-row">
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
                <div className="contact-row">
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
        <div className="left-column">
          {educationSection}
          {skillsSection}
        </div>

        <div className="right-column">
          {summarySection}
          {projectsSection}
          {experienceSection}
        </div>
      </div>
    </article>
  );
}
