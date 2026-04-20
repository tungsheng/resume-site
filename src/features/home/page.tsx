import React from "react";
import { DownloadIcon, Spinner, ToastContainer } from "../../components";
import {
  PROJECT_PATH,
  RESUME_PATH,
  homeContent,
  siteProfile,
} from "../site/content";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";
import { useResumePdfDownload } from "../resume/use-resume-pdf";
import { useResumePresentation } from "../resume/use-resume-presentation";

const PAGE_TITLE = "Tony Lee | ML Inference & Distributed Systems";

export function HomePage() {
  const { themeColor, layoutTemplate } = useResumePresentation(siteProfile.resumeSlug);
  const { downloading, downloadPdf, toasts, removeToast } = useResumePdfDownload({
    resumeName: siteProfile.resumeSlug,
    themeColor,
    layoutTemplate,
    filename: "tony_lee_resume.pdf",
  });

  useDocumentTitle(PAGE_TITLE);

  return (
    <>
      <PublicSiteLayout activeNav="home">
        <section className="page-hero page-hero--split page-hero--header">
          <div className="page-hero__content">
            <h1 className="page-title">{siteProfile.name}</h1>
            <p className="page-subtitle">{siteProfile.title}</p>
            <p className="page-lede">{siteProfile.summary}</p>
            <p className="detail-copy">{homeContent.positioning}</p>

            <div className="page-hero__actions">
              <button
                type="button"
                onClick={() => void downloadPdf()}
                disabled={downloading}
                className="button button--secondary"
                aria-label={downloading ? "Generating PDF" : "Download resume as PDF"}
                aria-busy={downloading}
                title="Download resume PDF"
              >
                {downloading ? (
                  <>
                    <Spinner size={16} color="#213748" />
                    Preparing PDF...
                  </>
                ) : (
                  <>
                    <DownloadIcon />
                    Download PDF
                  </>
                )}
              </button>
            </div>

            <div className="inline-links page-hero__links">
              <a href={PROJECT_PATH}>Read case study</a>
              <a href={RESUME_PATH}>View resume</a>
              <a href={siteProfile.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={siteProfile.linkedinUrl} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>

          <aside className="page-hero__aside">
            <p className="label">Use this site</p>
            <ul className="bullet-list">
              {homeContent.orientation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="section">
          <div className="section__header">
            <p className="section__kicker">Proof at a glance</p>
            <h2 className="section__title">What the work shows</h2>
          </div>
          <div className="grid-three">
            {homeContent.proofPoints.map((item) => (
              <article key={item.label} className="metric-card">
                <h3 className="metric-card__label">{item.label}</h3>
                <div className="metric-card__value">{item.value}</div>
                <p className="metric-card__detail">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <p className="section__kicker">Start here</p>
            <h2 className="section__title">Choose the level of detail you want</h2>
          </div>
          <div className="grid-two">
            {homeContent.featuredCards.map((card) => (
              <article key={card.title} className="card">
                <h3 className="card__title">{card.title}</h3>
                <p className="card__copy">{card.summary}</p>
                <ul className="card__list">
                  {card.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <div className="button-row">
                  <a className="button button--ghost" href={card.href}>
                    {card.ctaLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <p className="section__kicker">Working focus</p>
            <h2 className="section__title">What I optimize for</h2>
          </div>
          <div className="grid-three">
            {homeContent.focusAreas.map((item) => (
              <article key={item.title} className="detail-card">
                <h3 className="detail-card__title">{item.title}</h3>
                <p className="detail-copy">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </PublicSiteLayout>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
