export function getResumeDocumentCss(): string {
  return `
.resume-document,
.resume-document * {
  box-sizing: border-box;
}

@page {
  size: letter;
  margin: 0;
}

.resume-document {
  --resume-accent: #c9a86c;
  --resume-timeline-rail-color: rgba(201, 168, 108, 0.45);
  --base-font: 'Arial', 'Helvetica', sans-serif;
  --ui-font: 'Arial', 'Helvetica', sans-serif;
  --name-font: 'Arial', 'Helvetica', sans-serif;
  --base-font-size: 9.2pt;
  --base-line-height: 1.34;
  --header-padding: 0.24in 0.4in 0.1in;
  --content-padding: 0.13in 0.4in 0.12in;
  --content-gap: 0.15in;
  --sidebar-width: 1.9in;
  --section-gap: 0.22in;
  --section-title-size: 9.7pt;
  --section-title-spacing: 1.15px;
  --section-title-gap: 9px;
  --education-gap: 9px;
  --skill-gap: 7px;
  --cert-gap: 7px;
  --summary-size: 8.95pt;
  --summary-line-height: 1.36;
  --summary-align: left;
  --name-size: 26pt;
  --name-spacing: 0.28px;
  --name-transform: none;
  --experience-gap: 0.11in;
  --experience-title-size: 9.85pt;
  --experience-company-size: 8.25pt;
  --experience-date-size: 7.85pt;
  --experience-date-min-width: 1.12in;
  --experience-date-text-align: right;
  --highlight-size: 8.8pt;
  --highlight-line-height: 1.34;
  --highlight-gap: 2px;
  --left-column-width: var(--sidebar-width);
  --left-column-shrink: 0;

  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  background: white;
  color: #1f2937;
  font-family: var(--base-font);
  font-size: var(--base-font-size);
  line-height: var(--base-line-height);
}

.resume-sheet__page > .resume-document {
  margin: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.resume-document.layout-minimal-timeline {
  --experience-gap: 0.13in;
}

.resume-document .header {
  padding: var(--header-padding);
}

.resume-document .header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.21in;
}

.resume-document .header-left {
  flex: 1;
  min-width: 0;
  display: grid;
  row-gap: 6px;
}

.resume-document .header-subtitle {
  margin: 0;
  font-size: 10pt;
  letter-spacing: 0.14px;
  color: #3f3b37;
  font-weight: 500;
  line-height: 1.24;
  font-family: var(--ui-font);
}

.resume-document .name {
  margin: 0;
  font-size: var(--name-size);
  font-weight: 500;
  letter-spacing: var(--name-spacing);
  text-transform: var(--name-transform);
  color: var(--resume-accent);
  font-family: var(--name-font);
  line-height: 1;
}

.resume-document .contact-info {
  min-width: 2.12in;
  max-width: 2.28in;
  padding-top: 4px;
  display: grid;
  row-gap: 5px;
  text-align: right;
  font-family: var(--ui-font);
}

.resume-document .contact-row {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 8px;
}

.resume-document .contact-row-icon {
  align-items: center;
  gap: 6px;
}

.resume-document .contact-label {
  font-size: 7pt;
  text-transform: uppercase;
  letter-spacing: 0.92px;
  color: #6b7280;
  font-weight: 700;
  white-space: nowrap;
}

.resume-document .contact-value,
.resume-document .contact-link {
  font-size: 8.65pt;
  color: #1f2937;
  max-width: 1.95in;
  line-height: 1.28;
  text-align: right;
  word-break: break-word;
}

.resume-document .contact-link {
  text-decoration: none;
}

.resume-document .contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  width: 11px;
  height: 11px;
  line-height: 0;
  flex-shrink: 0;
}

.resume-document .contact-icon svg {
  width: 11px;
  height: 11px;
  display: block;
}

.resume-document .header-divider {
  margin-top: 12px;
  border-top: 1px solid var(--resume-accent);
}

.resume-document .main-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: var(--content-padding);
  gap: var(--content-gap);
}

.resume-document .left-column {
  width: var(--left-column-width);
  flex-shrink: var(--left-column-shrink);
  display: block;
}

.resume-document .right-column {
  flex: 1;
}

.resume-document .section {
  margin-bottom: var(--section-gap);
  break-inside: avoid;
}

.resume-document .section-title {
  margin: 0 0 var(--section-title-gap);
  font-size: var(--section-title-size);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--section-title-spacing);
  color: #1f2937;
  font-family: var(--ui-font);
}

.resume-document .education-item {
  margin-bottom: var(--education-gap);
}

.resume-document .education-degree,
.resume-document .certificate-title,
.resume-document .project-title,
.resume-document .experience-title {
  font-weight: 600;
  font-size: var(--experience-title-size);
  color: #4b5563;
}

.resume-document .education-school,
.resume-document .certificate-issuer,
.resume-document .experience-company,
.resume-document .skill-category-title {
  font-size: var(--experience-company-size);
  color: #4b5563;
  font-weight: 600;
  letter-spacing: 0.22px;
}

.resume-document .education-date,
.resume-document .certificate-date,
.resume-document .experience-date {
  font-size: var(--experience-date-size);
  color: #4b5563;
  font-style: italic;
  letter-spacing: 0.18px;
}

.resume-document .skills-list {
  font-size: 8.8pt;
  line-height: 1.34;
}

.resume-document .skill-category {
  margin-bottom: var(--skill-gap);
}

.resume-document .skill-category-title {
  display: block;
  margin-bottom: 2px;
}

.resume-document .skill-items {
  color: #374151;
}

.resume-document .certificate-item {
  margin-bottom: var(--cert-gap);
}

.resume-document .summary {
  margin: 0;
  font-size: var(--summary-size);
  line-height: var(--summary-line-height);
  text-align: var(--summary-align);
  color: #374151;
}

.resume-document .project-list {
  display: grid;
  row-gap: var(--experience-gap);
}

.resume-document .project-item {
  break-inside: avoid;
}

.resume-document .project-highlights,
.resume-document .experience-highlights {
  list-style: none;
  padding: 0;
  display: grid;
  row-gap: 2px;
  font-size: var(--highlight-size);
  line-height: var(--highlight-line-height);
  color: #374151;
}

.resume-document .project-highlights {
  margin: 4px 0 0;
}

.resume-document .experience-highlights {
  margin: 0;
}

.resume-document .project-highlights li,
.resume-document .experience-highlights li {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr);
  column-gap: 8px;
  align-items: start;
}

.resume-document .resume-list-bullet {
  color: var(--resume-accent);
  display: block;
  width: 10px;
  text-align: center;
  line-height: 1.2;
}

.resume-document .resume-list-text {
  min-width: 0;
}

.resume-document .experience-list {
  position: relative;
}

.resume-document .experience-rail {
  display: none;
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 5px;
  width: 2px;
  background: var(--resume-timeline-rail-color);
}

.resume-document .experience-item {
  margin-bottom: var(--experience-gap);
  position: relative;
}

.resume-document .experience-dot {
  display: none;
  position: absolute;
  left: 1px;
  top: 3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--resume-accent);
  background: #fff;
}

.resume-document .experience-content {
  min-width: 0;
}

.resume-document .experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 3px;
}

.resume-document .experience-meta {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resume-document .experience-separator {
  color: #9ca3af;
  font-size: 8.2pt;
}

.resume-document .experience-date {
  white-space: nowrap;
  min-width: var(--experience-date-min-width);
  text-align: var(--experience-date-text-align);
  margin-left: 8px;
}

.resume-document.layout-minimal-timeline .experience-rail {
  display: block;
}

.resume-document.layout-minimal-timeline .experience-item {
  padding-left: 22px;
}

.resume-document.layout-minimal-timeline .experience-dot {
  display: block;
}
`;
}
