import React, { useEffect, useState } from "react";
import { buildResumeViewModel } from "../../domain/resume/view-model";
import type { ResumeLayoutTemplate } from "../../layouts";
import type { ResumeData } from "../../types";
import { ResumeDocumentPreview } from "./document";
import {
  getResumeSettings,
  loadResumeSettings,
  requestPublicResumePdf,
} from "./presentation";
import { PublicSiteFooter } from "../site/footer";
import { PublicSiteHeader } from "../site/header";
import { EXPERIMENTS_PATH, PROJECT_PATH } from "../site/content";
import { useDocumentTitle } from "../site/use-document-title";
import { calculateResumePreviewScale } from "./preview-scale";
import { LETTER_HEIGHT_PX, LETTER_WIDTH_PX, resumePageCss, styles } from "./style";

interface Toast {
  id: number;
  message: string;
  type: "error" | "success";
}

interface SpinnerProps {
  size?: number;
  color?: string;
}

const toastContainerStyle: React.CSSProperties = {
  position: "fixed",
  right: 20,
  bottom: 20,
  zIndex: 3000,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const toastBaseStyle: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: 6,
  color: "#fff",
  fontSize: 14,
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  animation: "resume-toast-slide-in 0.2s ease-out",
};

const toastTypeStyles: Record<Toast["type"], React.CSSProperties> = {
  error: {
    background: "#e94560",
  },
  success: {
    background: "#27ae60",
  },
};

const toastKeyframes = `
@keyframes resume-toast-slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
`;

let toastId = 0;

function getResumeName(): string {
  const match = window.location.pathname.match(/\/resume\/(.+)/);
  return match?.[1] ?? "";
}

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

function Spinner({ size = 16, color = "var(--accent-deep)" }: SpinnerProps) {
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
    <>
      <style>{toastKeyframes}</style>
      <div style={toastContainerStyle} role="alert" aria-live="polite">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </div>
    </>
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

  return <div style={{ ...toastBaseStyle, ...toastTypeStyles[toast.type] }}>{toast.message}</div>;
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

interface ResumeWebViewProps {
  data: ResumeData;
  layoutTemplate: ResumeLayoutTemplate;
}

function ResumeWebView({ data, layoutTemplate }: ResumeWebViewProps) {
  const view = buildResumeViewModel(data, layoutTemplate);
  const linkedinHref = getLinkedinHref(view.header.contacts.linkedin);

  return (
    <section
      className="section resume-web-view resume-web-view--visible"
      aria-label="Web resume view"
    >
      <div className="resume-web-layout">
        <div className="resume-web-main">
          {view.hasSummary && (
            <article className="resume-web-card">
              <h3 className="resume-web-card__title">Professional Summary</h3>
              <p className="resume-web-copy">{view.summary}</p>
            </article>
          )}

          {view.hasProjects && (
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

          {view.hasExperience && (
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
          {(view.header.contacts.phone || view.header.contacts.email || linkedinHref) && (
            <article className="resume-web-card resume-web-card--compact">
              <h3 className="resume-web-card__title">Contact</h3>
              <div className="resume-web-contact-list">
                {view.header.contacts.phone && (
                  <div className="resume-web-contact-item">
                    <span className="resume-web-contact-label">Phone</span>
                    <span className="resume-web-contact-value">{view.header.contacts.phone}</span>
                  </div>
                )}
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

          {view.hasSkills && (
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

          {view.hasEducation && (
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

          {view.hasCertificates && (
            <section className="resume-web-section">
              <h3 className="resume-web-section__title">Certifications</h3>
              <div className="resume-web-stack">
                {view.certificates.map((certificate, index) => (
                  <article
                    key={`${certificate.title}-${index}`}
                    className="resume-web-card resume-web-card--compact"
                  >
                    <h4 className="resume-web-entry__title">{certificate.title}</h4>
                    <p className="resume-web-entry__subtitle">{certificate.issuer}</p>
                    {certificate.date ? (
                      <p className="resume-web-entry__date resume-web-entry__date--inline">
                        {certificate.date}
                      </p>
                    ) : null}
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
  themeColor: string;
  layoutTemplate: ResumeLayoutTemplate;
  previewScale: number;
  downloading: boolean;
  showPrintPreview?: boolean;
  onDownload: () => void;
  onShowWebResume?: () => void;
  onShowPrintPreview?: () => void;
  toasts: Toast[];
  onRemoveToast: (id: number) => void;
}

export function ResumePageContent({
  data,
  themeColor,
  layoutTemplate,
  previewScale,
  downloading,
  showPrintPreview = false,
  onDownload,
  onShowWebResume,
  onShowPrintPreview,
  toasts,
  onRemoveToast,
}: ResumePageContentProps) {
  const linkedinHref = getLinkedinHref(data.header.contacts.linkedin);
  const secondaryLinks = [
    { label: "View case study", href: PROJECT_PATH, external: false },
    { label: "View evidence", href: EXPERIMENTS_PATH, external: false },
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
  const showWebResume = !showPrintPreview;
  const siteMainClassName = showPrintPreview
    ? "site-main resume-site-main resume-site-main--preview"
    : "site-main resume-site-main";
  const previewWrapperClassName = showWebResume
    ? "page-wrapper resume-page-wrapper resume-page-wrapper--screen-hidden"
    : "page-wrapper resume-page-wrapper resume-page-wrapper--preview";

  return (
    <div style={styles.app} className="resume-app">
      <style>{resumePageCss}</style>

      <PublicSiteHeader activeNav="resume" />

      <section className={siteMainClassName}>
        <section className="page-hero page-hero--header">
          <div className="page-hero__content">
            <h1 className="page-title">{data.header.name}</h1>
            {data.header.badges.length > 0 ? (
              <p className="page-subtitle">{data.header.badges.join(" • ")}</p>
            ) : null}

            <div className="page-hero__actions resume-page-hero__actions">
              <button
                type="button"
                onClick={onDownload}
                disabled={downloading}
                className="button button--primary"
                aria-label={downloading ? "Generating PDF" : "Download resume as PDF"}
                aria-busy={downloading}
                title="Download resume PDF"
              >
                {downloading ? (
                  <>
                    <Spinner size={16} color="#fff" />
                    Preparing PDF...
                  </>
                ) : (
                  <>
                    <DownloadIcon />
                    Download PDF
                  </>
                )}
              </button>

              {onShowWebResume && onShowPrintPreview ? (
                <div className="resume-view-switch" role="tablist" aria-label="Resume formats">
                  <button
                    type="button"
                    className="button button--secondary button--compact"
                    aria-pressed={showWebResume}
                    onClick={onShowWebResume}
                  >
                    Web view
                  </button>
                  <button
                    type="button"
                    className="button button--secondary button--compact"
                    aria-pressed={showPrintPreview}
                    onClick={onShowPrintPreview}
                  >
                    Print preview
                  </button>
                </div>
              ) : null}
            </div>

            <div className="inline-links page-hero__links">
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

        {showWebResume ? (
          <ResumeWebView data={data} layoutTemplate={layoutTemplate} />
        ) : null}
      </section>

      <main
        style={{
          ...styles.pageWrapper,
          minHeight: Math.ceil(LETTER_HEIGHT_PX * previewScale) + 16,
        }}
        className={previewWrapperClassName}
      >
        <div style={styles.previewLayout} className="resume-preview-layout">
          <div
            style={{
              ...styles.previewShell,
              width: Math.ceil(LETTER_WIDTH_PX * previewScale),
            }}
            className="resume-preview-shell"
          >
            <ResumeDocumentPreview
              data={data}
              themeColor={themeColor}
              layoutTemplate={layoutTemplate}
              scale={previewScale}
            />
          </div>
        </div>
      </main>

      <PublicSiteFooter />

      <ToastContainer toasts={toasts} onRemove={onRemoveToast} />
    </div>
  );
}

function ResumeStatusView({ message, busy = false }: { message: string; busy?: boolean }) {
  return (
    <div style={styles.app} className="resume-app" role="main" aria-busy={busy || undefined}>
      <div style={styles.loading} role={busy ? undefined : "alert"}>
        {busy ? (
          <>
            <Spinner size={32} />
            <span style={{ marginLeft: 12 }}>{message}</span>
          </>
        ) : (
          message
        )}
      </div>
    </div>
  );
}

export function ResumePage() {
  const resumeName = getResumeName();
  const [presentation, setPresentation] = useState(() => getResumeSettings(resumeName));
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewScale, setPreviewScale] = useState(() =>
    typeof window === "undefined" ? 1 : calculateResumePreviewScale(window.innerWidth)
  );
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { themeColor, layoutTemplate } = presentation;

  useDocumentTitle(data ? `${data.header.name} - Resume` : "Resume");

  useEffect(() => {
    const fallback = getResumeSettings(resumeName);
    setPresentation(fallback);

    let cancelled = false;
    void (async () => {
      const nextPresentation = await loadResumeSettings(resumeName, fallback);
      if (!cancelled) {
        setPresentation(nextPresentation);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resumeName]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const res = await fetch(`/api/resume/${encodeURIComponent(resumeName)}`);
        if (!res.ok) {
          if (!cancelled) setError("Resume not found");
          return;
        }

        const resumeData = (await res.json()) as ResumeData;
        if (!cancelled) {
          setData(resumeData);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load resume");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resumeName]);

  useEffect(() => {
    const updateScale = () => {
      setPreviewScale(calculateResumePreviewScale(window.innerWidth));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  if (loading) {
    return <ResumeStatusView message="Loading resume..." busy />;
  }

  if (error || !data) {
    return <ResumeStatusView message={error || "Resume not found"} />;
  }

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
      const blob = await requestPublicResumePdf({
        name: resumeName,
        themeColor,
        layoutTemplate,
      });
      downloadBlob(blob, `${resumeName.replace(/\s+/g, "_")}_Resume.pdf`);
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
      themeColor={themeColor}
      layoutTemplate={layoutTemplate}
      previewScale={previewScale}
      downloading={downloading}
      showPrintPreview={showPrintPreview}
      onDownload={() => {
        void downloadPdf();
      }}
      onShowWebResume={() => {
        setShowPrintPreview(false);
      }}
      onShowPrintPreview={() => {
        setShowPrintPreview(true);
      }}
      toasts={toasts}
      onRemoveToast={removeToast}
    />
  );
}
