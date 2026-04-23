import React, { useEffect, useState } from "react";
import { buildResumeViewModel } from "./view-model";
import type { ResumeData } from "../../types";
import { publicResumeData } from "./data";
import { PublicSiteFooter, PublicSiteHeader } from "../site/layout";
import { EXPERIMENTS_PATH, PROJECT_PATH } from "../site/content";
import { useDocumentTitle } from "../site/use-document-title";
import { resumePageCss } from "./style";

interface Toast {
  id: number;
  message: string;
  type: "error" | "success";
}

let toastId = 0;

function getLinkedinHref(linkedin: string | undefined): string | null {
  if (!linkedin) return null;
  return linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function requestPublicResumePdf(): Promise<Blob> {
  const res = await fetch("/api/public-pdf", {
    method: "POST",
  });

  if (!res.ok) {
    let message = "Failed to generate PDF";
    try {
      const errorBody = (await res.json()) as { error?: string };
      if (errorBody?.error) message = errorBody.error;
    } catch {
      // Keep the fallback error message when the response is not JSON.
    }
    throw new Error(message);
  }

  return res.blob();
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function Spinner({ size = 16, color = "var(--accent-deep)" }: { size?: number; color?: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        border: `${Math.max(2, size / 8)}px solid #f0f0f0`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        display: "inline-block",
      }}
    />
  );
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="resume-toast-container" role="alert" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: number) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onRemove(toast.id), 4000);
    return () => window.clearTimeout(timer);
  }, [toast.id, onRemove]);

  return <div className={`resume-toast resume-toast--${toast.type}`}>{toast.message}</div>;
}

function ScreenResumeBulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="resume-web-list">
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

function ResumeWebView({ data }: { data: ResumeData }) {
  const view = buildResumeViewModel(data);
  const linkedinHref = getLinkedinHref(view.header.contacts.linkedin);

  return (
    <section className="section" aria-label="Web resume view">
      <div className="resume-web-layout">
        <div className="resume-web-main">
          {view.summary && (
            <article className="resume-web-card">
              <h3 className="resume-web-card__title">Professional Summary</h3>
              <p className="resume-web-copy">{view.summary}</p>
            </article>
          )}

          {view.projects.length > 0 && (
            <section className="resume-web-section">
              <h3 className="resume-web-section__title">{view.projectsTitle}</h3>
              <div className="resume-web-stack">
                {view.projects.map((project, index) => (
                  <article
                    key={`${project.title}-${index}`}
                    className="resume-web-card resume-web-card--entry"
                  >
                    <div className="resume-web-entry__header">
                      <div>
                        <h4 className="resume-web-entry__title">{project.title}</h4>
                      </div>
                    </div>
                    <ScreenResumeBulletList items={project.highlights} />
                  </article>
                ))}
              </div>
            </section>
          )}

          {view.experience.length > 0 && (
            <section className="resume-web-section">
              <h3 className="resume-web-section__title">Experience</h3>
              <div className="resume-web-stack">
                {view.experience.map((experience, index) => (
                  <article
                    key={`${experience.title}-${index}`}
                    className="resume-web-card resume-web-card--entry"
                  >
                    <div className="resume-web-entry__header">
                      <div>
                        <h4 className="resume-web-entry__title">{experience.title}</h4>
                        <p className="resume-web-entry__subtitle">{experience.company}</p>
                      </div>
                      <p className="resume-web-entry__date">{experience.dateRange}</p>
                    </div>
                    <ScreenResumeBulletList items={experience.highlights} />
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="resume-web-sidebar">
          {(view.header.contacts.email || linkedinHref) && (
            <article className="resume-web-card resume-web-card--compact">
              <h3 className="resume-web-card__title">Contact</h3>
              <div className="resume-web-contact-list">
                {view.header.contacts.email && (
                  <div className="resume-web-contact-item">
                    <span className="resume-web-contact-label">Email</span>
                    <a
                      className="resume-web-contact-link"
                      href={`mailto:${view.header.contacts.email}`}
                    >
                      {view.header.contacts.email}
                    </a>
                  </div>
                )}
                {linkedinHref && (
                  <div className="resume-web-contact-item">
                    <span className="resume-web-contact-label">LinkedIn</span>
                    <a
                      className="resume-web-contact-link"
                      href={linkedinHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {`linkedin.com/in/${view.header.contacts.linkedin}`}
                    </a>
                  </div>
                )}
              </div>
            </article>
          )}

          {view.skills.length > 0 && (
            <section className="resume-web-section">
              <h3 className="resume-web-section__title">Skills</h3>
              <article className="resume-web-card resume-web-card--compact">
                <div className="resume-web-skill-list">
                  {view.skills.map((skill) => (
                    <div key={skill.category} className="resume-web-skill-row">
                      <h4 className="resume-web-skill-label">{skill.categoryLabel}</h4>
                      <p className="resume-web-skill-items">{skill.itemsText}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}

          {view.education.length > 0 && (
            <section className="resume-web-section">
              <h3 className="resume-web-section__title">Education</h3>
              <div className="resume-web-stack">
                {view.education.map((education, index) => (
                  <article
                    key={`${education.school}-${index}`}
                    className="resume-web-card resume-web-card--compact"
                  >
                    <h4 className="resume-web-entry__title">{education.degree}</h4>
                    <p className="resume-web-entry__subtitle">{education.school}</p>
                    <p className="resume-web-entry__date resume-web-entry__date--inline">
                      {education.dateRange}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </section>
  );
}

interface ResumePageContentProps {
  data: ResumeData;
  downloading: boolean;
  onDownload: () => void;
  toasts: Toast[];
  onRemoveToast: (id: number) => void;
}

export function ResumePageContent({
  data,
  downloading,
  onDownload,
  toasts,
  onRemoveToast,
}: ResumePageContentProps) {
  const linkedinHref = getLinkedinHref(data.header.contacts.linkedin);
  const secondaryLinks = [
    { label: "View project", href: PROJECT_PATH, external: false },
    { label: "View experiments", href: EXPERIMENTS_PATH, external: false },
    data.header.contacts.email
      ? {
          label: "Email",
          href: `mailto:${data.header.contacts.email}`,
          external: false,
        }
      : null,
    linkedinHref
      ? {
          label: "LinkedIn",
          href: linkedinHref,
          external: true,
        }
      : null,
  ].filter(
    (
      link
    ): link is {
      label: string;
      href: string;
      external: boolean;
    } => Boolean(link)
  );

  return (
    <div className="resume-page-app">
      <style>{resumePageCss}</style>

      <PublicSiteHeader activeNav="resume" />

      <section className="site-main resume-site-main">
        <section className="page-hero page-hero--header">
          <div className="page-hero__content">
            <h1 className="page-title">{data.header.name}</h1>
            {data.header.badges.length > 0 ? (
              <p className="page-lede">{data.header.badges.join(" • ")}</p>
            ) : null}

            <div className="inline-links page-hero__links">
              <button
                type="button"
                className="resume-download-button"
                onClick={onDownload}
                disabled={downloading}
                aria-label={downloading ? "Generating PDF" : "Download resume as PDF"}
                aria-busy={downloading}
                title="Download resume PDF"
              >
                {downloading ? (
                  <>
                    <Spinner size={14} />
                    Preparing PDF...
                  </>
                ) : (
                  <>
                    <DownloadIcon />
                    Download PDF
                  </>
                )}
              </button>

              {secondaryLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        <ResumeWebView data={data} />
      </section>

      <PublicSiteFooter />

      <ToastContainer toasts={toasts} onRemove={onRemoveToast} />
    </div>
  );
}

export function ResumePage() {
  const data = publicResumeData;
  const [downloading, setDownloading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useDocumentTitle(`${data.header.name} - Resume`);

  function showToast(message: string, type: Toast["type"] = "error"): void {
    const id = ++toastId;
    setToasts((currentToasts) => [...currentToasts, { id, message, type }]);
  }

  function removeToast(id: number): void {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }

  async function downloadPdf(): Promise<void> {
    setDownloading(true);
    try {
      const blob = await requestPublicResumePdf();
      downloadBlob(blob, `${data.header.name.replace(/\s+/g, "_")}_Resume.pdf`);
      showToast("PDF downloaded successfully", "success");
    } catch (downloadError) {
      const message =
        downloadError instanceof Error
          ? downloadError.message
          : "Failed to download PDF. Please try again.";
      showToast(message, "error");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <ResumePageContent
      data={data}
      downloading={downloading}
      onDownload={() => {
        void downloadPdf();
      }}
      toasts={toasts}
      onRemoveToast={removeToast}
    />
  );
}
