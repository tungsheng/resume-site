// Resume loading and HTML generation

import { Glob } from "bun";
import { parse } from "yaml";
import { config } from "../config";
import { DEFAULT_RESUME_TEMPLATE, type ResumeLayoutTemplate } from "../layouts";
import { sanitizeName, escapeHtml, hexToRgba } from "../utils";
import type { ResumeData } from "../types";

type UnknownRecord = Record<string, unknown>;

export async function listResumes(): Promise<string[]> {
  const glob = new Glob("*.{yaml,yml}");
  const files: string[] = [];
  for await (const file of glob.scan(config.resumesDir)) {
    files.push(file.replace(/\.(yaml|yml)$/, ""));
  }
  return files;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toList(value: unknown): string[] {
  if (typeof value === "string") {
    const text = toText(value);
    return text ? [text] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => toList(item));
  }
  return [];
}

function toCommaList(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => toCommaList(item));
  }
  return [];
}

function readPeriod(record: UnknownRecord): {
  startDate: string | null;
  endDate: string | null;
} {
  const period = isRecord(record.period) ? record.period : null;
  const startDate =
    toText(record.startDate) ??
    (period
      ? toText(period.start) ?? toText(period.from) ?? toText(period.startDate)
      : null);
  const endDate =
    toText(record.endDate) ??
    (period ? toText(period.end) ?? toText(period.to) ?? toText(period.endDate) : null);
  return { startDate, endDate };
}

function normalizeHeader(data: UnknownRecord): ResumeData["header"] | null {
  const profile = isRecord(data.profile) ? data.profile : null;
  const header = isRecord(data.header) ? data.header : null;
  const source = profile ?? header;

  if (!source) return null;

  const name = toText(source.name) ?? (header ? toText(header.name) : null);
  if (!name) return null;

  const badges = toList(
    source.badges ?? source.headline ?? data.badges ?? (header ? header.badges : null)
  );

  const contactsSource =
    (isRecord(source.contacts) ? source.contacts : null) ??
    (header && isRecord(header.contacts) ? header.contacts : null) ??
    (isRecord(data.contacts) ? data.contacts : null);

  const contacts: ResumeData["header"]["contacts"] = {};
  if (contactsSource) {
    const phone = toText(contactsSource.phone);
    const linkedin = toText(contactsSource.linkedin);
    const email = toText(contactsSource.email);
    if (phone) contacts.phone = phone;
    if (linkedin) contacts.linkedin = linkedin;
    if (email) contacts.email = email;
  }

  const summary =
    toText(source.summary) ??
    (header ? toText(header.summary) : null) ??
    toText(data.summary) ??
    "";

  return {
    name,
    badges,
    contacts,
    summary,
  };
}

function normalizeExperience(data: UnknownRecord): ResumeData["experience"] {
  const source = Array.isArray(data.experience)
    ? data.experience
    : Array.isArray(data.workExperience)
      ? data.workExperience
      : [];
  const experience: ResumeData["experience"] = [];

  for (const item of source) {
    if (!isRecord(item)) continue;
    const title =
      toText(item.title) ?? toText(item.role) ?? toText(item.position) ?? toText(item.jobTitle);
    const company =
      toText(item.company) ??
      toText(item.organization) ??
      toText(item.employer) ??
      toText(item.client);
    const { startDate, endDate } = readPeriod(item);
    const highlights = toList(item.highlights ?? item.achievements ?? item.bullets);

    if (!title || !company || !startDate) continue;

    experience.push({
      title,
      company,
      startDate,
      endDate: endDate ?? "Present",
      highlights,
    });
  }

  return experience;
}

function normalizeSkills(data: UnknownRecord): ResumeData["skills"] {
  const source = data.skills ?? data.skillGroups;
  const skills: ResumeData["skills"] = {};

  if (Array.isArray(source)) {
    for (const item of source) {
      if (!isRecord(item)) continue;
      const category = toText(item.category) ?? toText(item.name);
      if (!category) continue;

      const values = toCommaList(item.items ?? item.keywords ?? item.skills);
      if (values.length > 0) skills[category] = values;
    }
    return skills;
  }

  if (!isRecord(source)) return skills;

  for (const [category, value] of Object.entries(source)) {
    const values = toCommaList(value);
    if (values.length > 0) skills[category] = values;
  }

  return skills;
}

function normalizeEducation(data: UnknownRecord): ResumeData["education"] {
  const source = Array.isArray(data.education)
    ? data.education
    : Array.isArray(data.studies)
      ? data.studies
      : [];
  const education: ResumeData["education"] = [];

  for (const item of source) {
    if (!isRecord(item)) continue;
    const school = toText(item.school) ?? toText(item.institution);
    const degree = toText(item.degree) ?? toText(item.program);
    const { startDate, endDate } = readPeriod(item);

    if (!school || !degree || !startDate) continue;

    education.push({
      school,
      degree,
      startDate,
      endDate: endDate ?? "",
    });
  }

  return education;
}

function normalizeCertificates(data: UnknownRecord): ResumeData["certificates"] {
  const source = Array.isArray(data.certificates)
    ? data.certificates
    : Array.isArray(data.certifications)
      ? data.certifications
      : [];
  const certificates: ResumeData["certificates"] = [];

  for (const item of source) {
    if (!isRecord(item)) continue;
    const title = toText(item.title) ?? toText(item.name);
    const issuer =
      toText(item.issuer) ?? toText(item.authority) ?? toText(item.provider);
    const date = toText(item.date) ?? toText(item.earned) ?? toText(item.issuedAt) ?? "";

    if (!title || !issuer) continue;

    certificates.push({
      title,
      issuer,
      date,
    });
  }

  return certificates;
}

/**
 * Normalize supported YAML variants into the internal resume shape.
 */
function normalizeResumeData(data: unknown): ResumeData | null {
  if (!isRecord(data)) return null;

  const header = normalizeHeader(data);
  if (!header) return null;

  const experience = normalizeExperience(data);
  const skills = normalizeSkills(data);
  const education = normalizeEducation(data);
  const certificates = normalizeCertificates(data);

  return {
    header,
    experience,
    skills,
    education,
    certificates,
  };
}

export async function loadResume(name: string): Promise<ResumeData | null> {
  const sanitized = sanitizeName(name);
  if (!sanitized) return null;

  const yamlPath = `${config.resumesDir}/${sanitized}.yaml`;
  const ymlPath = `${config.resumesDir}/${sanitized}.yml`;

  const yamlFile = Bun.file(yamlPath);
  const ymlFile = Bun.file(ymlPath);

  let content: string | null = null;
  if (await yamlFile.exists()) {
    content = await yamlFile.text();
  } else if (await ymlFile.exists()) {
    content = await ymlFile.text();
  }

  if (!content) return null;

  try {
    const data = parse(content);
    const normalized = normalizeResumeData(data);
    if (!normalized) {
      console.warn(`Invalid resume structure for: ${sanitized}`);
      return null;
    }
    return normalized;
  } catch (err) {
    console.warn(`Failed to parse YAML for: ${sanitized}`, err);
    return null;
  }
}

export function generateHTML(
  data: ResumeData,
  themeColor: string = config.defaultThemeColor,
  layoutTemplate: ResumeLayoutTemplate = DEFAULT_RESUME_TEMPLATE
): string {
  const css = generateCSS(themeColor);
  const isSingleColumnLayout = layoutTemplate === "single-column-ats";
  const isTimelineLayout = layoutTemplate === "minimal-timeline";

  const badgesHTML = data.header.badges
    .map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`)
    .join("");

  const educationHTML = data.education
    .map(
      (edu) => `
      ${isSingleColumnLayout
        ? `<div class="education-line">${escapeHtml(edu.degree)} • ${escapeHtml(edu.school)} • ${escapeHtml(edu.startDate)} - ${escapeHtml(edu.endDate)}</div>`
        : `<div class="education-item">
            <div class="education-degree">${escapeHtml(edu.degree)}</div>
            <div class="education-school">${escapeHtml(edu.school)}</div>
            <div class="education-date">${escapeHtml(edu.startDate)} - ${escapeHtml(edu.endDate)}</div>
          </div>`
      }`
    )
    .join("");

  const skillsHTML = Object.entries(data.skills)
    .map(
      ([category, items]) => `
    ${isSingleColumnLayout
      ? `<div class="skill-line"><span class="skill-category-inline">${escapeHtml(category.charAt(0).toUpperCase() + category.slice(1))}:</span> <span class="skill-items">${items.map(escapeHtml).join(" • ")}</span></div>`
      : `<div class="skill-category">
          <div class="skill-category-title">${escapeHtml(category.charAt(0).toUpperCase() + category.slice(1))}</div>
          <div class="skill-items">${items.map(escapeHtml).join(" • ")}</div>
        </div>`
    }`
    )
    .join("");

  const certificatesHTML = data.certificates
    .map(
      (cert) => `
      <div class="certificate-item">
        <div class="certificate-title">${escapeHtml(cert.title)}</div>
        <div class="certificate-issuer">${escapeHtml(cert.issuer)}</div>
        <div class="certificate-date">${escapeHtml(cert.date)}</div>
      </div>`
    )
    .join("");

  const experienceItemsHTML = data.experience
    .map(
      (exp) => `
      <div class="experience-item">
        ${isTimelineLayout ? `<span class="experience-dot"></span>` : ""}
        <div class="experience-content">
          <div class="experience-header">
            <span class="experience-meta"><span class="experience-title">${escapeHtml(exp.title)}</span><span class="experience-separator"> • </span><span class="experience-company">${escapeHtml(exp.company)}</span></span>
            <span class="experience-date">${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate)}</span>
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

  const hasBadges = data.header.badges.length > 0;
  const hasEducation = data.education.length > 0;
  const hasSkills = Object.keys(data.skills).length > 0;
  const hasCertificates = data.certificates.length > 0;
  const hasSummary = data.header.summary.trim().length > 0;
  const hasExperience = data.experience.length > 0;

  const summarySectionHTML = hasSummary
    ? `<section class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="summary">${escapeHtml(data.header.summary.trim())}</p>
        </section>`
    : "";

  const skillsSectionHTML = hasSkills
    ? `<section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">${skillsHTML}</div>
        </section>`
    : "";

  const experienceSectionHTML = hasExperience
    ? `<section class="section">
          <h2 class="section-title">Work Experience</h2>
          <div class="experience-list">
            ${isTimelineLayout ? `<div class="experience-rail"></div>` : ""}
            ${experienceItemsHTML}
          </div>
        </section>`
    : "";

  const educationSectionHTML = hasEducation
    ? `<section class="section">
          <h2 class="section-title">Education</h2>
          ${educationHTML}
        </section>`
    : "";

  const certificatesSectionHTML = hasCertificates
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
  <title>${escapeHtml(data.header.name)} - Resume</title>
  <style>${css}</style>
</head>
<body>
  <div class="page layout-${layoutTemplate}">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="name">${escapeHtml(data.header.name)}</h1>
          ${hasBadges ? `<div class="badges">${badgesHTML}</div>` : ""}
        </div>
        <div class="contact-info">
          ${data.header.contacts.phone ? `<div>${escapeHtml(data.header.contacts.phone)}</div>` : ""}
          ${data.header.contacts.email ? `<div><a href="mailto:${escapeHtml(data.header.contacts.email)}">${escapeHtml(data.header.contacts.email)}</a></div>` : ""}
          ${data.header.contacts.linkedin ? `<div><a href="https://linkedin.com/in/${escapeHtml(data.header.contacts.linkedin)}">linkedin.com/in/${escapeHtml(data.header.contacts.linkedin)}</a></div>` : ""}
        </div>
      </div>
    </header>
    <div class="main-content">
      ${isSingleColumnLayout
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
  --base-font: 'Aptos', 'Calibri', 'Arial', sans-serif;
  --ui-font: 'Aptos', 'Calibri', 'Arial', sans-serif;
  --name-font: 'Aptos Display', 'Calibri', 'Arial', sans-serif;
  --base-font-size: 8.45pt;
  --base-line-height: 1.32;
  --header-padding: 0.35in 0.54in 0.21in;
  --content-padding: 0.24in 0.54in;
  --content-gap: 0.22in;
  --sidebar-width: 1.9in;
  --section-gap: 0.15in;
  --section-title-size: 7.65pt;
  --section-title-spacing: 1.15px;
  --section-title-gap: 6px;
  --education-gap: 10px;
  --skill-gap: 8px;
  --cert-gap: 9px;
  --summary-size: 8.2pt;
  --summary-line-height: 1.33;
  --summary-align: left;
  --name-size: 22.4pt;
  --name-spacing: 0.6px;
  --name-transform: none;
  --badge-size: 7.2pt;
  --badge-padding: 3px 11px;
  --contact-size: 8.1pt;
  --experience-gap: 0.12in;
  --experience-title-size: 8.9pt;
  --experience-company-size: 7.55pt;
  --experience-date-size: 7.2pt;
  --experience-date-min-width: 1.12in;
  --experience-date-text-align: right;
  --experience-header-align: flex-start;
  --highlight-size: 8.1pt;
  --highlight-line-height: 1.3;
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
  --base-font: 'Aptos', 'Calibri', 'Arial', sans-serif;
  --name-font: 'Aptos Display', 'Calibri', 'Arial', sans-serif;
  --ui-font: 'Aptos', 'Calibri', 'Arial', sans-serif;
  --base-font-size: 8.45pt;
  --header-padding: 0.34in 0.52in 0.18in;
  --content-padding: 0.22in 0.52in;
  --content-gap: 0.18in;
  --sidebar-width: auto;
  --name-size: 22.4pt;
  --name-spacing: 0.6px;
  --section-gap: 0.14in;
  --section-title-size: 7.65pt;
  --section-title-gap: 6px;
  --summary-size: 8.2pt;
  --summary-line-height: 1.33;
  --experience-gap: 0.12in;
  --experience-date-size: 7.2pt;
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
  --base-font: 'Aptos', 'Calibri', 'Arial', sans-serif;
  --name-font: 'Aptos Display', 'Calibri', 'Arial', sans-serif;
  --ui-font: 'Aptos', 'Calibri', 'Arial', sans-serif;
  --base-font-size: 8.45pt;
  --header-padding: 0.35in 0.54in 0.21in;
  --content-padding: 0.24in 0.54in;
  --content-gap: 0.22in;
  --sidebar-width: 1.9in;
  --name-size: 22.4pt;
  --section-title-size: 7.65pt;
  --section-title-gap: 6px;
  --summary-size: 8.2pt;
  --summary-line-height: 1.33;
  --experience-title-size: 8.9pt;
  --experience-company-size: 7.55pt;
  --experience-gap: 0.12in;
  --experience-date-size: 7.2pt;
  --experience-date-min-width: 1.12in;
  --experience-date-text-align: right;
  --experience-header-align: flex-start;
  --highlight-size: 8.1pt;
  --highlight-line-height: 1.3;
  --highlight-gap: 2px;
  --timeline-rail-color: ${timelineRailColor};
}
.header {
  padding: var(--header-padding);
  border-bottom: 2px solid ${themeColor};
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.header-left { flex: 1; }
.name {
  font-size: var(--name-size);
  font-weight: 600;
  letter-spacing: var(--name-spacing);
  text-transform: var(--name-transform);
  color: #222;
  font-family: var(--name-font);
  margin-bottom: 8px;
}
.badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.badge {
  background: ${themeColor};
  color: white;
  padding: var(--badge-padding);
  border-radius: 999px;
  font-size: var(--badge-size);
  font-family: var(--ui-font);
}
.contact-info {
  text-align: right;
  font-size: var(--contact-size);
  line-height: 1.4;
  font-family: var(--ui-font);
}
.contact-info a { color: #333; text-decoration: none; }
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
  padding-bottom: 4px;
  border-bottom: 1px solid ${themeColor};
  font-family: var(--ui-font);
}
.education-item { margin-bottom: var(--education-gap); }
.education-line {
  margin-bottom: 6px;
  font-size: 8.1pt;
  line-height: 1.3;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.education-degree { font-weight: 600; font-size: 8.9pt; color: #1f2937; }
.education-school { font-size: 7.55pt; color: #4b5563; font-weight: 600; letter-spacing: 0.22px; }
.education-date { font-size: 7.2pt; color: #6b7280; font-style: italic; letter-spacing: 0.18px; }
.skills-list { font-size: 8.1pt; line-height: 1.32; }
.skill-category { margin-bottom: var(--skill-gap); }
.skill-line {
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 8.1pt;
  line-height: 1.3;
}
.skill-category-title { font-weight: 600; font-size: 7.55pt; color: #4b5563; letter-spacing: 0.22px; margin-bottom: 2px; }
.skill-category-inline {
  display: inline;
  font-weight: 600;
  font-size: 7.55pt;
  color: #4b5563;
  letter-spacing: 0.22px;
}
.skill-items { color: #374151; }
.certificate-item { margin-bottom: var(--cert-gap); }
.certificate-title { font-weight: 600; font-size: 8.9pt; color: #1f2937; }
.certificate-issuer { font-size: 7.55pt; color: #4b5563; font-weight: 600; letter-spacing: 0.22px; }
.certificate-date { font-size: 7.2pt; color: #6b7280; font-style: italic; letter-spacing: 0.18px; }
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
  gap: 8px;
  margin-bottom: 2px;
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
.experience-title { font-weight: 600; font-size: var(--experience-title-size); color: #1f2937; }
.experience-separator { color: #9ca3af; font-size: 7.8pt; }
.experience-date {
  font-size: var(--experience-date-size);
  color: #6b7280;
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
  font-size: 8.1pt;
  line-height: 1.3;
}
.page.layout-single-column-ats .skill-category-inline {
  font-size: 7.55pt;
}
.page.layout-minimal-timeline .experience-list {
  padding-left: 0;
}
.page.layout-minimal-timeline .badge {
  border-radius: 999px;
  padding: 3px 11px;
}
.page.layout-minimal-timeline .section-title {
  font-size: 7.65pt;
  font-weight: 700;
  letter-spacing: 1.15px;
  color: #1f2937;
}
.page.layout-minimal-timeline .experience-title,
.page.layout-minimal-timeline .education-degree,
.page.layout-minimal-timeline .certificate-title {
  font-size: 8.9pt;
  font-weight: 600;
  color: #1f2937;
}
.page.layout-minimal-timeline .experience-company,
.page.layout-minimal-timeline .education-school,
.page.layout-minimal-timeline .certificate-issuer,
.page.layout-minimal-timeline .skill-category-title,
.page.layout-minimal-timeline .skill-category-inline {
  font-size: 7.55pt;
  font-weight: 600;
  color: #4b5563;
  letter-spacing: 0.22px;
}
.page.layout-minimal-timeline .summary {
  font-size: 8.2pt;
  line-height: 1.33;
  color: #374151;
}
.page.layout-minimal-timeline .skill-items,
.page.layout-minimal-timeline .experience-highlights li {
  font-size: 8.1pt;
  line-height: 1.3;
  color: #374151;
}
.page.layout-minimal-timeline .experience-separator {
  color: #9ca3af;
  font-size: 7.8pt;
}
.page.layout-minimal-timeline .experience-date,
.page.layout-minimal-timeline .education-date,
.page.layout-minimal-timeline .certificate-date {
  font-size: 7.2pt;
  color: #6b7280;
  font-style: italic;
  letter-spacing: 0.18px;
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
  margin-bottom: 0.12in;
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
