import React, { useEffect, useState } from "react";
import { DownloadIcon, Spinner, ToastContainer, type Toast } from "../../components";
import { buildResumeViewModel } from "../../domain/resume/view-model";
import type { ResumeLayoutTemplate } from "../../layouts";
import type { ResumeData } from "../../types";
import { ResumeDocumentPreview } from "./document";
import { useResumePdfDownload } from "./use-resume-pdf";
import { useResumePresentation } from "./use-resume-presentation";
import { PublicSiteHeader } from "../site/header";
import { EXPERIMENTS_PATH, PROJECT_PATH } from "../site/content";
import { useDocumentTitle } from "../site/use-document-title";
import { calculateResumePreviewScale } from "./preview-scale";
import { LETTER_HEIGHT_PX, LETTER_WIDTH_PX, resumePageCss, styles } from "./style";

function getResumeName(): string {
  const match = window.location.pathname.match(/\/resume\/(.+)/);
  return match?.[1] ?? "";
}

function getLinkedinHref(linkedin: string | undefined): string | null {
  if (!linkedin) return null;
  return linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`;
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
  const { themeColor, layoutTemplate } = useResumePresentation(resumeName);
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewScale, setPreviewScale] = useState(() =>
    typeof window === "undefined" ? 1 : calculateResumePreviewScale(window.innerWidth)
  );
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { downloading, downloadPdf, toasts, removeToast } = useResumePdfDownload({
    resumeName,
    themeColor,
    layoutTemplate,
    successMessage: "PDF downloaded successfully",
    failureMessage: "Failed to download PDF. Please try again.",
  });

  useDocumentTitle(data ? `${data.header.name} - Resume` : "Resume");

  useEffect(() => {
    void loadResume();
  }, [resumeName]);

  useEffect(() => {
    const updateScale = () => {
      setPreviewScale(calculateResumePreviewScale(window.innerWidth));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  async function loadResume(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/resume/${encodeURIComponent(resumeName)}`);
      if (!res.ok) {
        setError("Resume not found");
        return;
      }

      const resumeData = (await res.json()) as ResumeData;
      setData(resumeData);
      setError(null);
    } catch {
      setError("Failed to load resume");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ResumeStatusView message="Loading resume..." busy />;
  }

  if (error || !data) {
    return <ResumeStatusView message={error || "Resume not found"} />;
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
