import { CANVAS } from "@design";
import {
  getResumePdfFontFaceCss,
  RESUME_PDF_DISPLAY_FONT_FAMILY,
  RESUME_PDF_FONT_FAMILY,
} from "./pdf-fonts";

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

/* PDF palette comes from the shared CANVAS tokens (@design), so it cannot drift
   from the editorial redesign (ADR-0010) the way it did before b0acdc0 — these
   six values used to be hardcoded here and were re-aligned by hand. The print
   essentials that deliberately do NOT track the web stay local: a white
   background (ink cost / ATS) and the embedded Inter sans (scannability), plus
   the space-efficient two-column layout that fits one Letter page. */
.resume-document {
  --resume-accent: ${CANVAS.accent};
  --resume-accent-dark: ${CANVAS.accentDark};
  --resume-ink: ${CANVAS.ink};
  --resume-muted: ${CANVAS.muted};
  --resume-faint: ${CANVAS.faint};
  --resume-rule: ${CANVAS.rule};
  --ui-font: '${RESUME_PDF_FONT_FAMILY}', Arial, sans-serif;
  --display-font: '${RESUME_PDF_DISPLAY_FONT_FAMILY}', var(--ui-font);
  --page-x: 0.38in;
  --column-gap: 0.24in;
  --sidebar-width: 2.12in;
  --section-gap: 0.21in;
  --experience-gap: 0.16in;

  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  background: white;
  color: var(--resume-ink);
  font-family: var(--ui-font);
  font-size: 9.5pt;
  line-height: 1.38;
}

.resume-document .header {
  padding: 0.24in var(--page-x) 0.08in;
}

.resume-document .header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.21in;
}

.resume-document .header-left {
  flex: 1;
  min-width: 0;
  display: grid;
  row-gap: 8px;
}

/* Keep the name and tagline together, opposite the compact contact block. */
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

/* Keep each role statement on its own line when multiple badges are supplied. */
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
  font-family: var(--display-font);
  line-height: 1;
}

.resume-document .contact-info {
  display: grid;
  grid-template-columns: max-content;
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
  font-size: 8.5pt;
  color: var(--resume-muted);
  line-height: 1.3;
  text-align: right;
  white-space: nowrap;
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
  padding: 0.18in var(--page-x) 0.1in;
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

.resume-document .section:last-child {
  margin-bottom: 0;
}

.resume-document .section-title {
  margin: 0 0 7px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--resume-rule);
  font-size: 8.8pt;
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
  font-size: 10.2pt;
  color: var(--resume-ink);
}

.resume-document .education-school,
.resume-document .experience-company,
.resume-document .skill-category-title {
  font-size: 8.9pt;
  color: var(--resume-muted);
  font-weight: 600;
  letter-spacing: 0.22px;
}

.resume-document .education-date,
.resume-document .experience-date {
  font-size: 8.1pt;
  color: var(--resume-muted);
  font-style: normal;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-variant-numeric: tabular-nums;
}

.resume-document .skills-list {
  font-size: 9.2pt;
  line-height: 1.38;
}

.resume-document .skill-category {
  margin-bottom: 9px;
}

.resume-document .skill-category-title {
  display: block;
  margin-bottom: 2px;
}

.resume-document .skill-items {
  color: var(--resume-ink);
}

.resume-document .skill-item {
  white-space: nowrap;
}

.resume-document .summary {
  margin: 0;
  font-size: 9.5pt;
  line-height: 1.38;
  text-align: left;
  color: var(--resume-ink);
}

.resume-document .project-note {
  margin: 2px 0 8px;
  font-size: 8.8pt;
  line-height: 1.38;
  font-style: italic;
  color: var(--resume-muted);
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
  row-gap: 4px;
  font-size: 9.5pt;
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

/* Swiss: drop the decorative timeline rail + dots; entries stand on spacing.
   No position: relative on the list or items — that only anchored the rail and
   dots, and positioned boxes paint after in-flow content, so Chrome wrote the
   self-directed labs into the PDF text stream ahead of every job. Parsers that
   read stream order then filed the labs under "Work Experience". */
.resume-document .experience-rail {
  display: none;
}

.resume-document .experience-item {
  margin-bottom: var(--experience-gap);
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
