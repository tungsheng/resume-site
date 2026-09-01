// The document head's rules, in one place.
//
// These lived in BaseLayout.astro, where no unit test could reach them: two
// URLs absolutized against Astro.site, and four article-only tags each gated by
// a separately-written `isArticle &&` in the markup. Four chances to forget the
// guard, in the file every page on the site depends on — and the only coverage
// was the built HTML of the two pages the integration suite happens to assert.
//
// Same move as the Post Projections (CONTEXT.md): the derivations move to where
// tests reach them, the markup stays in the .astro file. This owns the tags a
// page's own data determines; the layout keeps the static three (charset,
// viewport, favicon) and the <title> element, which carries text rather than
// attributes.

export type HeadTag = { tag: "meta" | "link"; attrs: Record<string, string> };

export type HeadInput = {
  /** Already suffixed by the page — this is what og:title and twitter:title carry. */
  title: string;
  description?: string;
  ogType?: "website" | "article";
  /** Root-relative or absolute; absolutized against `site`. */
  image?: string;
  publishedTime?: Date;
  modifiedTime?: Date;
  tags?: string[];
  section?: string;
  mathStylesheet?: boolean;
};

const SITE_NAME = "Tony Lee";

export function toHeadTags(input: HeadInput, site: URL, pathname: string): HeadTag[] {
  const { title, description, ogType = "website", image, tags = [], section } = input;

  const canonical = new URL(pathname, site).href;
  const ogImage = image ? new URL(image, site).href : undefined;

  const tagList: HeadTag[] = [];
  const meta = (attrs: Record<string, string>) => tagList.push({ tag: "meta", attrs });
  const link = (attrs: Record<string, string>) => tagList.push({ tag: "link", attrs });

  if (description) meta({ name: "description", content: description });
  link({ rel: "canonical", href: canonical });

  // Open Graph. og:image only when the page supplied one.
  meta({ property: "og:title", content: title });
  if (description) meta({ property: "og:description", content: description });
  meta({ property: "og:type", content: ogType });
  meta({ property: "og:url", content: canonical });
  meta({ property: "og:site_name", content: SITE_NAME });
  if (ogImage) meta({ property: "og:image", content: ogImage });

  // article:* is gated ONCE here, rather than four separately-written guards in
  // markup. A non-article page cannot emit these even if a caller passes dates.
  if (ogType === "article") {
    const { publishedTime, modifiedTime } = input;
    if (publishedTime) {
      meta({ property: "article:published_time", content: publishedTime.toISOString() });
    }
    if (modifiedTime) {
      meta({ property: "article:modified_time", content: modifiedTime.toISOString() });
    }
    if (section) meta({ property: "article:section", content: section });
    for (const tag of tags) meta({ property: "article:tag", content: tag });
  }

  meta({ name: "twitter:card", content: "summary_large_image" });
  meta({ name: "twitter:title", content: title });
  if (description) meta({ name: "twitter:description", content: description });
  if (ogImage) meta({ name: "twitter:image", content: ogImage });

  // Self-hosted KaTeX styles, linked only on math Posts (#33 / ADR-0006), so
  // non-math pages stay CSS-clean.
  if (input.mathStylesheet) link({ rel: "stylesheet", href: "/katex/katex.min.css" });

  return tagList;
}
