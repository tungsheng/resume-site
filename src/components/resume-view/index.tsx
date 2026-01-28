// Resume view component - shared between Admin preview and public Resume page

import React from "react";
import type { ResumeData } from "../../types";
import { resumeStyles } from "../../styles";
import { escapeHtml } from "../../utils";

interface ResumeViewProps {
  data: ResumeData;
  themeColor: string;
}

export function ResumeView({ data, themeColor }: ResumeViewProps) {
  return (
    <div style={resumeStyles.page}>
      <header style={{ ...resumeStyles.header, borderBottomColor: themeColor }}>
        <div style={resumeStyles.headerContent}>
          <div style={resumeStyles.headerLeft}>
            <h1 style={resumeStyles.name}>{escapeHtml(data.header.name)}</h1>
            <div style={resumeStyles.badges}>
              {data.header.badges.map((badge, i) => (
                <span key={i} style={{ ...resumeStyles.badge, background: themeColor }}>
                  {escapeHtml(badge)}
                </span>
              ))}
            </div>
          </div>
          <div style={resumeStyles.contact}>
            {data.header.contacts.phone && (
              <div>{escapeHtml(data.header.contacts.phone)}</div>
            )}
            {data.header.contacts.email && (
              <div>
                <a href={`mailto:${data.header.contacts.email}`} style={resumeStyles.link}>
                  {escapeHtml(data.header.contacts.email)}
                </a>
              </div>
            )}
            {data.header.contacts.linkedin && (
              <div>
                <a
                  href={`https://linkedin.com/in/${data.header.contacts.linkedin}`}
                  style={resumeStyles.link}
                >
                  linkedin.com/in/{escapeHtml(data.header.contacts.linkedin)}
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={resumeStyles.body}>
        <div style={resumeStyles.sidebar}>
          <section style={resumeStyles.section}>
            <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
              Education
            </h2>
            {data.education.map((edu, i) => (
              <div key={i} style={resumeStyles.eduItem}>
                <div style={resumeStyles.eduDegree}>{escapeHtml(edu.degree)}</div>
                <div style={resumeStyles.eduSchool}>{escapeHtml(edu.school)}</div>
                <div style={resumeStyles.eduDate}>
                  {escapeHtml(edu.startDate)} - {escapeHtml(edu.endDate)}
                </div>
              </div>
            ))}
          </section>

          <section style={resumeStyles.section}>
            <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>Skills</h2>
            <div style={resumeStyles.skills}>
              {Object.entries(data.skills).map(([cat, items]) => (
                <div key={cat} style={resumeStyles.skillCat}>
                  <div style={resumeStyles.skillTitle}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </div>
                  <div style={resumeStyles.skillItems}>
                    {items.map(escapeHtml).join(" • ")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={resumeStyles.section}>
            <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
              Certifications
            </h2>
            {data.certificates.map((cert, i) => (
              <div key={i} style={resumeStyles.certItem}>
                <div style={resumeStyles.certTitle}>{escapeHtml(cert.title)}</div>
                <div style={resumeStyles.certIssuer}>{escapeHtml(cert.issuer)}</div>
                <div style={resumeStyles.certDate}>{escapeHtml(cert.date)}</div>
              </div>
            ))}
          </section>
        </div>

        <div style={resumeStyles.main}>
          <section style={resumeStyles.section}>
            <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
              Professional Summary
            </h2>
            <p style={resumeStyles.summary}>{escapeHtml(data.header.summary.trim())}</p>
          </section>

          <section style={resumeStyles.section}>
            <h2 style={{ ...resumeStyles.sectionTitle, borderBottomColor: themeColor }}>
              Work Experience
            </h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={resumeStyles.expItem}>
                <div style={resumeStyles.expHeader}>
                  <span style={resumeStyles.expTitle}>{escapeHtml(exp.title)}</span>
                  <span style={resumeStyles.expDate}>
                    {escapeHtml(exp.startDate)} - {escapeHtml(exp.endDate)}
                  </span>
                </div>
                <div style={resumeStyles.expCompany}>{escapeHtml(exp.company)}</div>
                {exp.highlights.length > 0 && (
                  <ul style={resumeStyles.expHighlights}>
                    {exp.highlights.map((h, j) => (
                      <li key={j}>
                        <span style={{ color: themeColor, marginRight: 8 }}>•</span>
                        {escapeHtml(h)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
