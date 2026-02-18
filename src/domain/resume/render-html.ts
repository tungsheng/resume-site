import { config } from "../../config";
import { DEFAULT_RESUME_TEMPLATE, type ResumeLayoutTemplate } from "../../layouts";
import type { ResumeData } from "../../types";
import { escapeHtml, hexToRgba } from "../../utils";
import { buildResumeViewModel } from "./view-model";

export function generateHTML(
  data: ResumeData,
  themeColor: string = config.defaultThemeColor,
  layoutTemplate: ResumeLayoutTemplate = DEFAULT_RESUME_TEMPLATE
): string {
  const css = generateCSS(themeColor);
  const view = buildResumeViewModel(data, layoutTemplate);
  const headlineText = view.hasBadges ? view.header.badges.join(" • ") : "";
  const emailIconSVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><polyline points="3,7 12,13 21,7"></polyline></svg>';
  const linkedinIconSVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"></rect><circle cx="8" cy="8" r="1"></circle><line x1="8" y1="11" x2="8" y2="16.5"></line><line x1="12" y1="11" x2="12" y2="16.5"></line><path d="M12 13.1a2.4 2.4 0 0 1 4.8 0v3.4"></path></svg>';

  const contactRowsHTML = [
    view.header.contacts.phone
      ? `<div class="contact-row"><span class="contact-label">Phone</span><span class="contact-value">${escapeHtml(view.header.contacts.phone)}</span></div>`
      : "",
    view.header.contacts.email
      ? `<div class="contact-row contact-row-icon"><a class="contact-link" href="mailto:${escapeHtml(view.header.contacts.email)}">${escapeHtml(view.header.contacts.email)}</a><span class="contact-icon">${emailIconSVG}</span></div>`
      : "",
    view.header.contacts.linkedin
      ? `<div class="contact-row contact-row-icon"><a class="contact-link" href="https://linkedin.com/in/${encodeURIComponent(view.header.contacts.linkedin)}">linkedin.com/in/${escapeHtml(view.header.contacts.linkedin)}</a><span class="contact-icon">${linkedinIconSVG}</span></div>`
      : "",
  ].join("");

  const educationHTML = view.education
    .map(
      (edu) => `
      ${view.isSingleColumnLayout
        ? `<div class="education-line">${escapeHtml(edu.lineText)}</div>`
        : `<div class="education-item">
            <div class="education-degree">${escapeHtml(edu.degree)}</div>
            <div class="education-school">${escapeHtml(edu.school)}</div>
            <div class="education-date">${escapeHtml(edu.dateRange)}</div>
          </div>`
      }`
    )
    .join("");

  const skillsHTML = view.skills
    .map(
      (skill) => `
    ${view.isSingleColumnLayout
      ? `<div class="skill-line"><span class="skill-category-inline">${escapeHtml(skill.categoryLabel)}:</span> <span class="skill-items">${skill.items.map(escapeHtml).join(" • ")}</span></div>`
      : `<div class="skill-category">
          <div class="skill-category-title">${escapeHtml(skill.categoryLabel)}</div>
          <div class="skill-items">${skill.items.map(escapeHtml).join(" • ")}</div>
        </div>`
    }`
    )
    .join("");

  const certificatesHTML = view.certificates
    .map(
      (cert) => `
      <div class="certificate-item">
        <div class="certificate-title">${escapeHtml(cert.title)}</div>
        <div class="certificate-issuer">${escapeHtml(cert.issuer)}</div>
        <div class="certificate-date">${escapeHtml(cert.date)}</div>
      </div>`
    )
    .join("");

  const experienceItemsHTML = view.experience
    .map(
      (exp) => `
      <div class="experience-item">
        ${view.isTimelineLayout ? `<span class="experience-dot"></span>` : ""}
        <div class="experience-content">
          <div class="experience-header">
            <span class="experience-meta"><span class="experience-title">${escapeHtml(exp.title)}</span><span class="experience-separator"> • </span><span class="experience-company">${escapeHtml(exp.company)}</span></span>
            <span class="experience-date">${escapeHtml(exp.dateRange)}</span>
          </div>
          ${exp.highlights.length > 0
            ? `<ul class="experience-highlights">
                  ${exp.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
                 </ul>`
            : ""
          }
        </div>
      </div>`
    )
    .join("");

  const summarySectionHTML = view.hasSummary
    ? `<section class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="summary">${escapeHtml(view.summary)}</p>
        </section>`
    : "";

  const skillsSectionHTML = view.hasSkills
    ? `<section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">${skillsHTML}</div>
        </section>`
    : "";

  const experienceSectionHTML = view.hasExperience
    ? `<section class="section">
          <h2 class="section-title">Work Experience</h2>
          <div class="experience-list">
            ${view.isTimelineLayout ? `<div class="experience-rail"></div>` : ""}
            ${experienceItemsHTML}
          </div>
        </section>`
    : "";

  const educationSectionHTML = view.hasEducation
    ? `<section class="section">
          <h2 class="section-title">Education</h2>
          ${educationHTML}
        </section>`
    : "";

  const certificatesSectionHTML = view.hasCertificates
    ? `<section class="section">
          <h2 class="section-title">Certifications</h2>
          ${certificatesHTML}
        </section>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(view.header.name)} - Resume</title>
  <style>${css}</style>
</head>
<body>
  <div class="page layout-${layoutTemplate}">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="name">${escapeHtml(view.header.name)}</h1>
          ${headlineText ? `<p class="header-subtitle">${escapeHtml(headlineText)}</p>` : ""}
        </div>
        ${contactRowsHTML ? `<div class="contact-info">${contactRowsHTML}</div>` : ""}
      </div>
      <div class="header-divider"></div>
    </header>
    <div class="main-content">
      ${view.isSingleColumnLayout
        ? `<div class="single-column-flow">
             ${summarySectionHTML}
             ${skillsSectionHTML}
             ${experienceSectionHTML}
             ${educationSectionHTML}
             ${certificatesSectionHTML}
           </div>`
        : `<div class="left-column">
             ${educationSectionHTML}
             ${skillsSectionHTML}
             ${certificatesSectionHTML}
           </div>
           <div class="right-column">
             ${summarySectionHTML}
             ${experienceSectionHTML}
           </div>`
      }
    </div>
  </div>
</body>
</html>`;
}

function generateCSS(themeColor: string): string {
  const timelineRailColor = hexToRgba(themeColor, 0.45);

  return `
* { margin: 0; padding: 0; box-sizing: border-box; }
@page { size: letter; margin: 0; }
body {
  background: white;
  color: #1f2937;
}
.page {
  --base-font: 'Arial', 'Helvetica', sans-serif;
  --ui-font: 'Arial', 'Helvetica', sans-serif;
  --name-font: 'Arial', 'Helvetica', sans-serif;
  --base-font-size: 9pt;
  --base-line-height: 1.36;
  --header-padding: 0.3in 0.48in 0.12in;
  --content-padding: 0.17in 0.48in;
  --content-gap: 0.17in;
  --sidebar-width: 1.85in;
  --section-gap: 0.22in;
  --section-title-size: 9.4pt;
  --section-title-spacing: 1.15px;
  --section-title-gap: 9px;
  --education-gap: 9px;
  --skill-gap: 7px;
  --cert-gap: 7px;
  --summary-size: 8.7pt;
  --summary-line-height: 1.38;
  --summary-align: left;
  --name-size: 25.2pt;
  --name-spacing: 0.28px;
  --name-transform: none;
  --experience-gap: 0.11in;
  --experience-title-size: 9.6pt;
  --experience-company-size: 8.1pt;
  --experience-date-size: 7.7pt;
  --experience-date-min-width: 1.12in;
  --experience-date-text-align: right;
  --experience-header-align: flex-start;
  --highlight-size: 8.6pt;
  --highlight-line-height: 1.33;
  --highlight-gap: 2px;
  --timeline-rail-color: ${timelineRailColor};
  --left-column-order: 0;
  --right-column-order: 0;
  --left-column-width: var(--sidebar-width);
  --left-column-shrink: 0;
  --main-content-display: flex;
  --main-content-direction: row;
  --main-content-wrap: nowrap;
  --left-column-grid: block;
  --left-column-columns: none;
  --left-column-column-gap: 0;
  --left-column-row-gap: 0;

  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  background: white;
  font-family: var(--base-font);
  font-size: var(--base-font-size);
  line-height: var(--base-line-height);
}

.page.layout-single-column-ats {
  --base-font: 'Arial', 'Helvetica', sans-serif;
  --name-font: 'Arial', 'Helvetica', sans-serif;
  --ui-font: 'Arial', 'Helvetica', sans-serif;
  --base-font-size: 9pt;
  --header-padding: 0.27in 0.46in 0.1in;
  --content-padding: 0.16in 0.46in;
  --content-gap: 0.14in;
  --sidebar-width: auto;
  --name-size: 24pt;
  --name-spacing: 0.26px;
  --section-gap: 0.2in;
  --section-title-size: 9.4pt;
  --section-title-gap: 9px;
  --summary-size: 8.7pt;
  --summary-line-height: 1.38;
  --experience-gap: 0.13in;
  --experience-date-size: 7.7pt;
  --experience-date-min-width: auto;
  --experience-date-text-align: left;
  --experience-header-align: flex-start;
  --left-column-order: 2;
  --right-column-order: 1;
  --left-column-width: auto;
  --left-column-shrink: 1;
  --main-content-display: flex;
  --main-content-direction: column;
  --main-content-wrap: nowrap;
  --left-column-grid: block;
  --left-column-columns: none;
  --left-column-column-gap: 0;
  --left-column-row-gap: 0;
}

.page.layout-minimal-timeline {
  --base-font: 'Arial', 'Helvetica', sans-serif;
  --name-font: 'Arial', 'Helvetica', sans-serif;
  --ui-font: 'Arial', 'Helvetica', sans-serif;
  --base-font-size: 9pt;
  --header-padding: 0.3in 0.48in 0.12in;
  --content-padding: 0.17in 0.48in;
  --content-gap: 0.17in;
  --sidebar-width: 1.85in;
  --name-size: 25.2pt;
  --section-title-size: 9.4pt;
  --section-title-gap: 9px;
  --summary-size: 8.7pt;
  --summary-line-height: 1.38;
  --experience-title-size: 9.6pt;
  --experience-company-size: 8.1pt;
  --experience-gap: 0.13in;
  --experience-date-size: 7.7pt;
  --experience-date-min-width: 1.12in;
  --experience-date-text-align: right;
  --experience-header-align: flex-start;
  --highlight-size: 8.6pt;
  --highlight-line-height: 1.33;
  --highlight-gap: 2px;
  --timeline-rail-color: ${timelineRailColor};
}
.header {
  padding: var(--header-padding);
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.21in;
}
.header-left {
  flex: 1;
  min-width: 0;
  display: grid;
  row-gap: 6px;
}
.header-subtitle {
  margin: 0;
  font-size: 9.8pt;
  letter-spacing: 0.14px;
  color: #3f3b37;
  font-weight: 500;
  line-height: 1.24;
  font-family: var(--ui-font);
}
.name {
  font-size: var(--name-size);
  font-weight: 500;
  letter-spacing: var(--name-spacing);
  text-transform: var(--name-transform);
  color: ${themeColor};
  font-family: var(--name-font);
  line-height: 1;
  margin: 0;
}
.contact-info {
  min-width: 2.12in;
  max-width: 2.28in;
  padding-top: 4px;
  display: grid;
  row-gap: 5px;
  text-align: right;
  font-family: var(--ui-font);
}
.contact-row {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 8px;
}
.contact-row-icon {
  align-items: center;
  gap: 6px;
}
.contact-label {
  font-size: 7pt;
  text-transform: uppercase;
  letter-spacing: 0.92px;
  color: #6b7280;
  font-weight: 700;
  white-space: nowrap;
}
.contact-value,
.contact-link {
  font-size: 8.5pt;
  color: #1f2937;
  max-width: 1.95in;
  line-height: 1.28;
  text-align: right;
  word-break: break-word;
}
.contact-link {
  text-decoration: none;
}
.contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  width: 11px;
  height: 11px;
  line-height: 0;
  flex-shrink: 0;
}
.contact-icon svg {
  width: 11px;
  height: 11px;
  display: block;
}
.header-divider {
  margin-top: 12px;
  border-top: 1px solid ${themeColor};
}
.page.layout-single-column-ats .contact-info {
  min-width: 2in;
  max-width: 2.18in;
}
.main-content {
  display: var(--main-content-display);
  flex-direction: var(--main-content-direction);
  flex-wrap: var(--main-content-wrap);
  padding: var(--content-padding);
  gap: var(--content-gap);
}
.single-column-flow { width: 100%; }
.left-column {
  order: var(--left-column-order);
  width: var(--left-column-width);
  flex-shrink: var(--left-column-shrink);
  display: var(--left-column-grid);
  grid-template-columns: var(--left-column-columns);
  column-gap: var(--left-column-column-gap);
  row-gap: var(--left-column-row-gap);
}
.right-column {
  order: var(--right-column-order);
  flex: 1;
}
.section { margin-bottom: var(--section-gap); break-inside: avoid; }
.section-title {
  font-size: var(--section-title-size);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--section-title-spacing);
  color: #1f2937;
  margin-bottom: var(--section-title-gap);
  font-family: var(--ui-font);
}
.education-item { margin-bottom: var(--education-gap); }
.education-line {
  margin-bottom: 6px;
  font-size: 8.6pt;
  line-height: 1.35;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.education-degree { font-weight: 600; font-size: 9.6pt; color: #4b5563; }
.education-school { font-size: 8.1pt; color: #4b5563; font-weight: 600; letter-spacing: 0.22px; }
.education-date { font-size: 7.7pt; color: #4b5563; font-style: italic; letter-spacing: 0.18px; }
.skills-list { font-size: 8.6pt; line-height: 1.35; }
.skill-category { margin-bottom: var(--skill-gap); }
.skill-line {
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 8.6pt;
  line-height: 1.35;
}
.skill-category-title { font-weight: 600; font-size: 8.1pt; color: #4b5563; letter-spacing: 0.22px; margin-bottom: 2px; }
.skill-category-inline {
  display: inline;
  font-weight: 600;
  font-size: 8.1pt;
  color: #4b5563;
  letter-spacing: 0.22px;
}
.skill-items { color: #374151; }
.certificate-item { margin-bottom: var(--cert-gap); }
.certificate-title { font-weight: 600; font-size: 9.6pt; color: #1f2937; }
.certificate-issuer { font-size: 8.1pt; color: #4b5563; font-weight: 600; letter-spacing: 0.22px; }
.certificate-date { font-size: 7.7pt; color: #6b7280; font-style: italic; letter-spacing: 0.18px; }
.summary {
  font-size: var(--summary-size);
  line-height: var(--summary-line-height);
  text-align: var(--summary-align);
  color: #374151;
}
.experience-list { position: relative; }
.experience-rail {
  display: none;
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 5px;
  width: 2px;
  background: var(--timeline-rail-color);
}
.experience-item { margin-bottom: var(--experience-gap); position: relative; }
.experience-dot {
  display: none;
  position: absolute;
  left: 1px;
  top: 3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid ${themeColor};
  background: #fff;
}
.experience-content { min-width: 0; }
.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: var(--experience-header-align);
  gap: 10px;
  margin-bottom: 3px;
}
.experience-meta {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.experience-title { font-weight: 600; font-size: var(--experience-title-size); color: #4b5563; }
.experience-separator { color: #9ca3af; font-size: 8.2pt; }
.experience-date {
  font-size: var(--experience-date-size);
  color: #4b5563;
  font-style: italic;
  letter-spacing: 0.18px;
  white-space: nowrap;
  min-width: var(--experience-date-min-width);
  text-align: var(--experience-date-text-align);
  margin-left: 8px;
}
.experience-company {
  font-size: var(--experience-company-size);
  color: #4b5563;
  font-weight: 600;
  letter-spacing: 0.22px;
}
.experience-highlights { list-style: none; padding-left: 0; }
.experience-highlights li {
  font-size: var(--highlight-size);
  line-height: var(--highlight-line-height);
  margin-bottom: var(--highlight-gap);
  padding-left: 12px;
  position: relative;
  color: #374151;
}
.experience-highlights li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: ${themeColor};
}
.page.layout-single-column-ats .education-line,
.page.layout-single-column-ats .skill-line {
  margin-bottom: 6px;
  font-size: 8.6pt;
  line-height: 1.35;
}
.page.layout-single-column-ats .skill-category-inline {
  font-size: 8.1pt;
}
.page.layout-minimal-timeline .experience-list {
  padding-left: 0;
}
.page.layout-minimal-timeline .badge {
  border-radius: 999px;
  padding: 3px 11px;
}
.page.layout-minimal-timeline .section-title {
  font-size: 9.4pt;
  font-weight: 700;
  letter-spacing: 1.15px;
  color: #1f2937;
}
.page.layout-minimal-timeline .experience-title,
.page.layout-minimal-timeline .education-degree,
.page.layout-minimal-timeline .certificate-title {
  font-size: 9.6pt;
  font-weight: 600;
  color: #4b5563;
}
.page.layout-minimal-timeline .certificate-title {
  font-size: 9.6pt;
  font-weight: 600;
  color: #1f2937;
}
.page.layout-minimal-timeline .experience-company,
.page.layout-minimal-timeline .education-school,
.page.layout-minimal-timeline .certificate-issuer,
.page.layout-minimal-timeline .skill-category-title,
.page.layout-minimal-timeline .skill-category-inline {
  font-size: 8.1pt;
  font-weight: 600;
  color: #4b5563;
  letter-spacing: 0.22px;
}
.page.layout-minimal-timeline .summary {
  font-size: 8.7pt;
  line-height: 1.38;
  color: #374151;
}
.page.layout-minimal-timeline .skill-items,
.page.layout-minimal-timeline .experience-highlights li {
  font-size: 8.6pt;
  line-height: 1.33;
  color: #374151;
}
.page.layout-minimal-timeline .experience-separator {
  color: #9ca3af;
  font-size: 8.2pt;
}
.page.layout-minimal-timeline .experience-date,
.page.layout-minimal-timeline .education-date,
.page.layout-minimal-timeline .certificate-date {
  font-size: 7.7pt;
  color: #6b7280;
  font-style: italic;
  letter-spacing: 0.18px;
}
.page.layout-minimal-timeline .experience-date,
.page.layout-minimal-timeline .education-date {
  color: #4b5563;
}
.page.layout-minimal-timeline .experience-rail {
  display: block;
  left: 5px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--timeline-rail-color);
}
.page.layout-minimal-timeline .experience-item {
  padding-left: 22px;
  margin-bottom: 0.13in;
}
.page.layout-minimal-timeline .experience-item:last-child {
  margin-bottom: 0;
}
.page.layout-minimal-timeline .experience-dot {
  display: block;
  left: 1px;
  top: 3px;
}
`;
}
