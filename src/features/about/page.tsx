import React from "react";
import { aboutContent, PROJECT_PATH, RESUME_PATH, siteProfile } from "../site/content";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "About Tony Lee";

export function AboutPage() {
  useDocumentTitle(PAGE_TITLE);
  const [heroIntro, ...supportingBio] = aboutContent.bio;

  return (
    <PublicSiteLayout activeNav="about">
      <section className="page-hero page-hero--split page-hero--header">
        <div className="page-hero__content">
          <h1 className="page-title">{aboutContent.title}</h1>
          <p className="page-subtitle">{siteProfile.title}</p>
          {heroIntro ? <p className="page-lede">{heroIntro}</p> : null}

          <div className="inline-links page-hero__links">
            <a href={RESUME_PATH}>View resume</a>
            <a href={PROJECT_PATH}>View case study</a>
            <a href={`mailto:${siteProfile.email}`}>Email</a>
            <a href={siteProfile.linkedinUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <aside className="page-hero__aside">
          <p className="label">Best fit</p>
          <ul className="bullet-list">
            <li>{aboutContent.roles}</li>
            <li>{aboutContent.lookingFor}</li>
          </ul>
        </aside>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Working style</p>
          <h2 className="section__title">How I tend to show up on teams</h2>
        </div>
        {supportingBio.map((paragraph) => (
          <p key={paragraph} className="section__copy">
            {paragraph}
          </p>
        ))}
        <div className="grid-three">
          {aboutContent.workingStyle.map((item) => (
            <article key={item.title} className="detail-card">
              <h3 className="detail-card__title">{item.title}</h3>
              <p className="detail-copy">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Where I add value</p>
          <h2 className="section__title">The kinds of problems I like owning</h2>
        </div>
        <div className="grid-three">
          {aboutContent.valueAreas.map((item) => (
            <article key={item.title} className="detail-card">
              <h3 className="detail-card__title">{item.title}</h3>
              <p className="detail-copy">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Next role</p>
          <h2 className="section__title">What I’m looking for</h2>
        </div>
        <article className="about-card">
          <p className="detail-copy">{aboutContent.roles}</p>
          <p className="detail-copy">{aboutContent.lookingFor}</p>
        </article>
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Contact</p>
          <h2 className="section__title">Where to reach me</h2>
        </div>
        <div className="link-grid">
          {aboutContent.contactLinks.map((link) => (
            <a
              key={link.href}
              className="resource-link"
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
            >
              <span className="resource-link__label">{link.label}</span>
              <span className="resource-link__detail">{link.detail}</span>
            </a>
          ))}
        </div>
      </section>
    </PublicSiteLayout>
  );
}
