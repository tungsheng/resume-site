import React from "react";
import { aboutContent, siteProfile } from "../site/content";
import { PublicSiteLayout } from "../site/layout";
import { useDocumentTitle } from "../site/use-document-title";

const PAGE_TITLE = "About Tony Lee";

export function AboutPage() {
  useDocumentTitle(PAGE_TITLE);

  return (
    <PublicSiteLayout activeNav="about">
      <section className="page-hero">
        <p className="page-eyebrow">{aboutContent.eyebrow}</p>
        <h1 className="page-title">{aboutContent.title}</h1>
        <p className="page-subtitle">{siteProfile.title}</p>
        {aboutContent.bio.map((paragraph) => (
          <p key={paragraph} className="page-lede">
            {paragraph}
          </p>
        ))}
      </section>

      <section className="section">
        <div className="section__header">
          <p className="section__kicker">Current focus</p>
          <h2 className="section__title">What I’m working on</h2>
        </div>
        <div className="grid-two">
          <article className="about-card">
            <h3 className="about-card__title">Focus areas</h3>
            <ul className="about-list">
              {aboutContent.currentFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="about-card">
            <h3 className="about-card__title">Target roles</h3>
            <p className="detail-copy">{aboutContent.roles}</p>
          </article>
        </div>
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
