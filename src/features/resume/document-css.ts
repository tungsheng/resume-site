import { getResumePdfFontFaceCss, RESUME_PDF_FONT_FAMILY } from "./pdf-fonts";

export function getResumeDocumentCss(): string {
  return `${getResumePdfFontFaceCss()}
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

/* PDF palette tracks the editorial redesign tokens (ADR-0010): the new green
   accent (#2f7d3b / #235e2c, AA on white) and warm neutral inks. It deliberately
   KEEPS the print essentials that don't belong on paper stock — a white
   background (ink cost / ATS) and the embedded Inter sans (scannability) — plus
   the space-efficient two-column layout that fits one Letter page. Only the color
   variables changed from the prior ADR-0005 theme. */
.resume-document {
  --resume-accent: #2f7d3b;
  --resume-accent-dark: #235e2c;
  --resume-ink: #1c1b17;
  --resume-muted: #6f6d68;
  --resume-faint: #83817a;
  --resume-rule: #e4e1da;
  --ui-font: '${RESUME_PDF_FONT_FAMILY}', Arial, sans-serif;
  --page-x: 0.38in;
  --column-gap: 0.2in;
  --sidebar-width: 2.05in;
  --section-gap: 0.18in;
  --experience-gap: 0.13in;

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
  row-gap: 8px;
}

/* Tagline sits directly under the name as a single accent line, so the name and
   its positioning statement read as one block on the left while the contact rows
   balance it on the right (rather than the tagline drifting down to the rule). */
.resume-document .header-subtitle {
  margin: 0;
  display: grid;
  row-gap: 3px;
  font-size: 7.5pt;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: var(--resume-accent-dark);
  font-weight: 500;
  line-height: 1.35;
  font-family: var(--ui-font);
}

/* Each role statement on its own clean line — no dangling separator, and the
   stacked pair balances the height of the three contact rows opposite. */
.resume-document .header-subtitle-line {
  display: block;
}

.resume-document .name {
  margin: 0;
  font-size: 24pt;
  font-weight: 600;
  letter-spacing: -0.3px;
  text-transform: none;
  color: var(--resume-ink);
  font-family: var(--ui-font);
  line-height: 1;
}

.resume-document .contact-info {
  min-width: 2.12in;
  max-width: 2.28in;
  padding-top: 3px;
  display: grid;
  row-gap: 6px;
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
  font-size: 8.5pt;
  color: var(--resume-muted);
  max-width: 2.1in;
  line-height: 1.3;
  text-align: right;
  word-break: break-word;
  text-decoration: none;
}

/* Swiss: drop the contact icons (matches the web rail), keep mono-clean text. */
.resume-document .contact-icon {
  display: none;
}

.resume-document .header-divider {
  margin-top: 12px;
  border-top: 1px solid var(--resume-rule);
}

.resume-document .main-content {
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  align-items: start;
  padding: 0.13in var(--page-x) 0.1in;
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
  margin: 0 0 7px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--resume-rule);
  font-size: 8.4pt;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.3px;
  color: var(--resume-ink);
  font-family: var(--ui-font);
}

.resume-document .education-item {
  margin-bottom: 8px;
}

.resume-document .education-degree,
.resume-document .project-title,
.resume-document .experience-title {
  font-weight: 600;
  font-size: 9.7pt;
  color: var(--resume-ink);
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
  font-size: 7.6pt;
  color: var(--resume-faint);
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
}

.resume-document .skills-list {
  font-size: 8.8pt;
  line-height: 1.34;
}

.resume-document .skill-category {
  margin-bottom: 6px;
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
  font-size: 8.75pt;
  line-height: 1.32;
  text-align: left;
  color: var(--resume-ink);
}

.resume-document .project-note {
  margin: 2px 0 6px;
  font-size: 8pt;
  line-height: 1.32;
  font-style: italic;
  color: var(--resume-muted, #555);
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
  row-gap: 2px;
  font-size: 8.75pt;
  line-height: 1.35;
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

/* Swiss: drop the decorative timeline rail + dots; entries stand on spacing. */
.resume-document .experience-rail {
  display: none;
}

.resume-document .experience-item {
  margin-bottom: var(--experience-gap);
  position: relative;
  padding-left: 0;
}

.resume-document .experience-dot {
  display: none;
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
  color: var(--resume-faint);
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
