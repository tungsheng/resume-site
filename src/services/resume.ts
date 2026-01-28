// Resume loading and HTML generation

import { Glob } from "bun";
import { parse } from "yaml";
import { config } from "../config";
import { sanitizeName, escapeHtml } from "../utils";
import type { ResumeData } from "../types";

export async function listResumes(): Promise<string[]> {
  const glob = new Glob("*.{yaml,yml}");
  const files: string[] = [];
  for await (const file of glob.scan(config.resumesDir)) {
    files.push(file.replace(/\.(yaml|yml)$/, ""));
  }
  return files;
}

/**
 * Validate resume data structure at runtime
 */
function validateResumeData(data: unknown): data is ResumeData {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  // Validate header
  if (!d.header || typeof d.header !== "object") return false;
  const h = d.header as Record<string, unknown>;
  if (typeof h.name !== "string") return false;
  if (!Array.isArray(h.badges)) return false;
  if (typeof h.summary !== "string") return false;

  // Validate contacts (all fields are optional)
  if (!h.contacts || typeof h.contacts !== "object") return false;
  const c = h.contacts as Record<string, unknown>;
  if (c.phone !== undefined && typeof c.phone !== "string") return false;
  if (c.linkedin !== undefined && typeof c.linkedin !== "string") return false;
  if (c.email !== undefined && typeof c.email !== "string") return false;

  // Validate experience array
  if (!Array.isArray(d.experience)) return false;
  for (const exp of d.experience) {
    if (typeof exp !== "object" || exp === null) return false;
    const e = exp as Record<string, unknown>;
    if (typeof e.title !== "string") return false;
    if (typeof e.company !== "string") return false;
    if (typeof e.startDate !== "string") return false;
    if (typeof e.endDate !== "string") return false;
    if (!Array.isArray(e.highlights)) return false;
  }

  // Validate skills (dynamic categories)
  if (!d.skills || typeof d.skills !== "object") return false;
  const s = d.skills as Record<string, unknown>;
  const skillKeys = Object.keys(s);
  if (skillKeys.length === 0) return false;
  for (const key of skillKeys) {
    if (!Array.isArray(s[key])) return false;
  }

  // Validate education array
  if (!Array.isArray(d.education)) return false;
  for (const edu of d.education) {
    if (typeof edu !== "object" || edu === null) return false;
    const e = edu as Record<string, unknown>;
    if (typeof e.school !== "string") return false;
    if (typeof e.degree !== "string") return false;
    if (typeof e.startDate !== "string") return false;
    if (typeof e.endDate !== "string") return false;
  }

  // Validate certificates array
  if (!Array.isArray(d.certificates)) return false;
  for (const cert of d.certificates) {
    if (typeof cert !== "object" || cert === null) return false;
    const ce = cert as Record<string, unknown>;
    if (typeof ce.title !== "string") return false;
    if (typeof ce.issuer !== "string") return false;
    if (typeof ce.date !== "string") return false;
  }

  return true;
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
    if (!validateResumeData(data)) {
      console.warn(`Invalid resume structure for: ${sanitized}`);
      return null;
    }
    return data;
  } catch (err) {
    console.warn(`Failed to parse YAML for: ${sanitized}`, err);
    return null;
  }
}

export function generateHTML(
  data: ResumeData,
  themeColor: string = config.defaultThemeColor
): string {
  const css = generateCSS(themeColor);

  const badgesHTML = data.header.badges
    .map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`)
    .join("");

  const educationHTML = data.education
    .map(
      (edu) => `
      <div class="education-item">
        <div class="education-degree">${escapeHtml(edu.degree)}</div>
        <div class="education-school">${escapeHtml(edu.school)}</div>
        <div class="education-date">${escapeHtml(edu.startDate)} - ${escapeHtml(edu.endDate)}</div>
      </div>`
    )
    .join("");

  const skillsHTML = Object.entries(data.skills)
    .map(
      ([category, items]) => `
    <div class="skill-category">
      <div class="skill-category-title">${escapeHtml(category.charAt(0).toUpperCase() + category.slice(1))}</div>
      <div class="skill-items">${items.map(escapeHtml).join(" • ")}</div>
    </div>`
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

  const experienceHTML = data.experience
    .map(
      (exp) => `
      <div class="experience-item">
        <div class="experience-header">
          <span class="experience-title">${escapeHtml(exp.title)}</span>
          <span class="experience-date">${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate)}</span>
        </div>
        <div class="experience-company">${escapeHtml(exp.company)}</div>
        ${exp.highlights.length > 0
          ? `<ul class="experience-highlights">
                ${exp.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
               </ul>`
          : ""
        }
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.header.name)} - Resume</title>
  <style>${css}</style>
</head>
<body>
  <div class="page">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="name">${escapeHtml(data.header.name)}</h1>
          <div class="badges">${badgesHTML}</div>
        </div>
        <div class="contact-info">
          ${data.header.contacts.phone ? `<div>${escapeHtml(data.header.contacts.phone)}</div>` : ""}
          ${data.header.contacts.email ? `<div><a href="mailto:${escapeHtml(data.header.contacts.email)}">${escapeHtml(data.header.contacts.email)}</a></div>` : ""}
          ${data.header.contacts.linkedin ? `<div><a href="https://linkedin.com/in/${escapeHtml(data.header.contacts.linkedin)}">linkedin.com/in/${escapeHtml(data.header.contacts.linkedin)}</a></div>` : ""}
        </div>
      </div>
    </header>
    <div class="main-content">
      <div class="left-column">
        <section class="section">
          <h2 class="section-title">Education</h2>
          ${educationHTML}
        </section>
        <section class="section">
          <h2 class="section-title">Skills</h2>
          <div class="skills-list">${skillsHTML}</div>
        </section>
        <section class="section">
          <h2 class="section-title">Certifications</h2>
          ${certificatesHTML}
        </section>
      </div>
      <div class="right-column">
        <section class="section">
          <h2 class="section-title">Professional Summary</h2>
          <p class="summary">${escapeHtml(data.header.summary.trim())}</p>
        </section>
        <section class="section">
          <h2 class="section-title">Work Experience</h2>
          ${experienceHTML}
        </section>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateCSS(themeColor: string): string {
  return `
* { margin: 0; padding: 0; box-sizing: border-box; }
@page { size: letter; margin: 0; }
body {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 10pt;
  line-height: 1.4;
  color: #333;
  background: white;
}
.page {
  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  background: white;
}
.header {
  padding: 0.5in 0.6in 0.3in;
  border-bottom: 2px solid ${themeColor};
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.header-left { flex: 1; }
.name {
  font-size: 36pt;
  font-weight: normal;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #222;
  margin-bottom: 8px;
}
.badges { display: flex; gap: 8px; margin-top: 8px; }
.badge {
  background: ${themeColor};
  color: white;
  padding: 3px 10px;
  font-size: 8pt;
  font-family: 'Helvetica', 'Arial', sans-serif;
}
.contact-info {
  text-align: right;
  font-size: 9pt;
  line-height: 1.6;
  font-family: 'Helvetica', 'Arial', sans-serif;
}
.contact-info a { color: #333; text-decoration: none; }
.main-content {
  display: flex;
  padding: 0.4in 0.6in;
  gap: 0.4in;
}
.left-column { width: 2.2in; flex-shrink: 0; }
.right-column { flex: 1; }
.section { margin-bottom: 0.25in; }
.section-title {
  font-size: 9pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #222;
  margin-bottom: 10px;
  padding-bottom: 4px;
  border-bottom: 1px solid ${themeColor};
  font-family: 'Helvetica', 'Arial', sans-serif;
}
.education-item { margin-bottom: 12px; }
.education-degree { font-weight: bold; font-size: 9pt; }
.education-school { font-size: 9pt; color: #555; }
.education-date { font-size: 8pt; color: #777; font-style: italic; }
.skills-list { font-size: 9pt; line-height: 1.6; }
.skill-category { margin-bottom: 8px; }
.skill-category-title { font-weight: bold; font-size: 8pt; color: #555; margin-bottom: 2px; }
.skill-items { color: #444; }
.certificate-item { margin-bottom: 10px; }
.certificate-title { font-weight: bold; font-size: 9pt; }
.certificate-issuer { font-size: 8pt; color: #555; }
.certificate-date { font-size: 8pt; color: #777; font-style: italic; }
.summary { font-size: 9.5pt; line-height: 1.5; text-align: justify; color: #444; }
.experience-item { margin-bottom: 0.2in; }
.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}
.experience-title { font-weight: bold; font-size: 10pt; }
.experience-date { font-size: 8pt; color: #666; font-style: italic; }
.experience-company { font-size: 9pt; color: #555; margin-bottom: 6px; }
.experience-highlights { list-style: none; padding-left: 0; }
.experience-highlights li {
  font-size: 9pt;
  line-height: 1.4;
  margin-bottom: 4px;
  padding-left: 12px;
  position: relative;
}
.experience-highlights li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: ${themeColor};
}`;
}
