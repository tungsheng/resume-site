import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection, render } from "astro:content";
import { isPostVisible, sortByPublishedDesc } from "../content/blog-schema";

// Full-content RSS 2.0 feed at /rss.xml (#9). Published Posts only, newest-first
// — the exact same visibility + ordering as the /blog index (isPostVisible +
// sortByPublishedDesc), so the feed never drifts from the site. Prerendered at
// build time (output: "static").
const FEED_TITLE = "Tony Lee — Blog";
const FEED_DESCRIPTION =
  "Engineering writing on inference serving, scheduler behavior, and GPU kernel paths.";

export async function GET(context: APIContext) {
  // `site` is configured in astro.config (https://tonylee.bio); required for a
  // valid feed and for absolutizing in-content URLs.
  const site = context.site!;

  const visible = await getCollection("blog", (post) =>
    isPostVisible(post.data.status, import.meta.env.PROD),
  );
  const posts = sortByPublishedDesc(visible);

  // Render each Post body to HTML with the project's Markdown pipeline (so the
  // #6 admonitions/figures/tables carry through) via the container API.
  const container = await AstroContainer.create();
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const body = await container.renderToString(Content);
      return {
        title: post.data.title,
        description: post.data.summary,
        pubDate: post.data.published,
        link: `/blog/${post.id}/`,
        categories: post.data.tags,
        content: absolutizeUrls(body, site),
      };
    }),
  );

  return rss({ title: FEED_TITLE, description: FEED_DESCRIPTION, site, items });
}

// Feed readers fetch entries away from the page, so root-relative asset and link
// URLs (e.g. the self-hosted /assets/blog/... images from #6) must point at the
// production origin to resolve in a reader.
function absolutizeUrls(html: string, site: URL): string {
  const { origin } = site;
  return html.replaceAll('src="/', `src="${origin}/`).replaceAll('href="/', `href="${origin}/`);
}
