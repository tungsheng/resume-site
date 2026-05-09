export function getResumeDocumentCss(): string {
  return `
.resume-document,
.resume-document * {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

@page {
  size: letter;
  margin: 0;
}

.resume-document {
  --resume-accent: #007a5e;
  --resume-ink: #16231f;
  --resume-muted: #465750;
  --ui-font: 'Avenir Next', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  --page-x: 0.4in;
  --column-gap: 0.22in;
  --sidebar-width: 2.05in;
  --section-gap: 0.24in;
  --experience-gap: 0.16in;

  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  background: white;
  color: var(--resume-ink);
  font-family: var(--ui-font);
  font-size: 9.2pt;
  line-height: 1.34;
}

.resume-document .header {
  padding: 0.24in var(--page-x) 0.12in;
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
  color: var(--resume-muted);
  font-weight: 500;
  line-height: 1.24;
  font-family: var(--ui-font);
}

.resume-document .name {
  margin: 0;
  font-size: 26pt;
  font-weight: 500;
  letter-spacing: 0.28px;
  text-transform: none;
  color: var(--resume-accent);
  font-family: var(--ui-font);
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
  align-items: center;
  gap: 6px;
}

.resume-document .contact-link {
  font-size: 8.65pt;
  color: var(--resume-ink);
  max-width: 1.95in;
  line-height: 1.28;
  text-align: right;
  word-break: break-word;
  text-decoration: none;
}

.resume-document .contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--resume-muted);
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
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  align-items: start;
  padding: 0.16in var(--page-x) 0.12in;
  column-gap: var(--column-gap);
}

.resume-document .left-column {
  min-width: 0;
}

.resume-document .right-column {
  min-width: 0;
}

.resume-document .section {
  margin-bottom: var(--section-gap);
  break-inside: avoid;
}

.resume-document .section-title {
  margin: 0 0 9px;
  font-size: 9.7pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.15px;
  color: var(--resume-ink);
  font-family: var(--ui-font);
}

.resume-document .education-item {
  margin-bottom: 9px;
}

.resume-document .education-degree,
.resume-document .project-title,
.resume-document .experience-title {
  font-weight: 600;
  font-size: 9.85pt;
  color: var(--resume-muted);
}

.resume-document .education-school,
.resume-document .experience-company,
.resume-document .skill-category-title {
  font-size: 8.25pt;
  color: var(--resume-muted);
  font-weight: 600;
  letter-spacing: 0.22px;
}

.resume-document .education-date,
.resume-document .experience-date {
  font-size: 7.85pt;
  color: var(--resume-muted);
  font-style: italic;
  letter-spacing: 0.18px;
}

.resume-document .skills-list {
  font-size: 8.8pt;
  line-height: 1.34;
}

.resume-document .skill-category {
  margin-bottom: 7px;
}

.resume-document .skill-category-title {
  display: block;
  margin-bottom: 2px;
}

.resume-document .skill-items {
  color: var(--resume-ink);
}

.resume-document .summary {
  margin: 0;
  font-size: 8.95pt;
  line-height: 1.36;
  text-align: left;
  color: var(--resume-ink);
}

.resume-document .project-list {
  display: grid;
  row-gap: var(--experience-gap);
}

.resume-document .project-item {
  break-inside: avoid;
}

.resume-document .resume-highlights {
  list-style: none;
  padding: 0;
  display: grid;
  row-gap: 3px;
  font-size: 8.8pt;
  line-height: 1.38;
  color: var(--resume-ink);
}

.resume-document .project-item .resume-highlights {
  margin: 4px 0 0;
}

.resume-document .experience-content .resume-highlights {
  margin: 0;
}

.resume-document .resume-highlights li {
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
  display: block;
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 5px;
  width: 2px;
  background: rgba(0, 122, 94, 0.5);
}

.resume-document .experience-item {
  margin-bottom: var(--experience-gap);
  position: relative;
  padding-left: 22px;
}

.resume-document .experience-dot {
  display: block;
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
  min-width: 1.12in;
  text-align: right;
  margin-left: 8px;
}

`;
}
