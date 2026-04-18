import React, { useEffect, useState } from "react";
import { DownloadIcon, ToastContainer } from "../../components";
import { downloadBlob, useToast } from "../../hooks";
import {
  DEFAULT_RESUME_TEMPLATE,
  isResumeLayoutTemplate,
  type ResumeLayoutTemplate,
} from "../../layouts";
import {
  EXPERIMENTS_PATH,
  PROJECT_PATH,
  homeContent,
  siteProfile,
} from "../site/content";
import { PublicSiteLayout } from "../site/layout";

const PAGE_TITLE = "Tony Lee | ML Inference & Distributed Systems";

export function HomePage() {
  const [themeColor, setThemeColor] = useState("#c9a86c");
  const [layoutTemplate, setLayoutTemplate] = useState<ResumeLayoutTemplate>(
    DEFAULT_RESUME_TEMPLATE
  );
  const [downloading, setDownloading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    document.title = PAGE_TITLE;
    void loadResumeSettings();
  }, []);

  async function loadResumeSettings(): Promise<void> {
    try {
      const res = await fetch(`/api/settings/${encodeURIComponent(siteProfile.resumeSlug)}`);
      if (!res.ok) return;

      const settings = await res.json();
      if (typeof settings.themeColor === "string") {
        setThemeColor(settings.themeColor);
      }
      if (isResumeLayoutTemplate(settings.layoutTemplate)) {
        setLayoutTemplate(settings.layoutTemplate);
      }
    } catch {
      // Keep defaults if settings are unavailable.
    }
  }

  async function handleDownload(): Promise<void> {
    setDownloading(true);
    try {
      const res = await fetch("/api/public-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: siteProfile.resumeSlug,
          themeColor,
          layoutTemplate,
        }),
      });

      if (!res.ok) {
        let message = "Failed to generate PDF";
        try {
          const errorBody = (await res.json()) as { error?: string };
          if (errorBody?.error) message = errorBody.error;
        } catch {
          // Keep fallback message.
        }
        throw new Error(message);
      }

      const blob = await res.blob();
      downloadBlob(blob, "tony_lee_resume.pdf");
      showToast("Resume PDF downloaded", "success");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to download the resume PDF. Please try again.";
      showToast(message, "error");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <PublicSiteLayout activeNav="home">
        <section className="page-hero page-hero--split">
          <div>
            <p className="page-eyebrow">{homeContent.eyebrow}</p>
            <h1 className="page-title">{siteProfile.name}</h1>
            <p className="page-subtitle">{siteProfile.title}</p>
            <p className="page-lede">{siteProfile.summary}</p>

            <div className="button-row">
              <a className="button button--primary" href={PROJECT_PATH}>
                View project
              </a>
              <a className="button button--secondary" href={`/resume/${siteProfile.resumeSlug}`}>
                View resume
              </a>
            </div>

            <div className="inline-links">
              <button type="button" onClick={() => void handleDownload()} disabled={downloading}>
                <DownloadIcon />
                {downloading ? "Preparing PDF..." : "Download PDF"}
              </button>
              <span aria-hidden="true">•</span>
              <a href={siteProfile.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <span aria-hidden="true">•</span>
              <a href={siteProfile.linkedinUrl} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>

          <aside className="page-hero__aside">
            <p className="label">Quick orientation</p>
            <ul className="bullet-list">
              <li>Start with the project walkthrough to understand the system.</li>
              <li>Use the experiments page for measurements and proof.</li>
              <li>Open the resume only when you want the professional history.</li>
            </ul>
          </aside>
        </section>

        <section className="section">
          <div className="section__header">
            <p className="section__kicker">Featured work</p>
            <h2 className="section__title">Start here</h2>
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
            <p className="section__kicker">Credibility</p>
            <h2 className="section__title">Core stack</h2>
          </div>
          <div className="chip-row">
            {homeContent.credibilityStrip.map((item) => (
              <span key={item} className="chip">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <p className="section__kicker">Current focus</p>
            <h2 className="section__title">What I’m building toward</h2>
          </div>
          <article className="about-card">
            <p className="detail-copy">{homeContent.currentFocus}</p>
            <div className="button-row">
              <a className="button button--ghost" href={PROJECT_PATH}>
                See architecture and results
              </a>
              <a className="button button--ghost" href={EXPERIMENTS_PATH}>
                See experiment evidence
              </a>
            </div>
          </article>
        </section>
      </PublicSiteLayout>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
