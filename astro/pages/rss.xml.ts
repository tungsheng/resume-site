import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { render } from "astro:content";
import { sortByPublishedDesc } from "../content/post";
import { getVisiblePosts } from "../content/visible-posts";
import { toFeedHtml } from "../markdown/feed-html";

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

  const posts = sortByPublishedDesc(await getVisiblePosts());

  // Render each Post body to HTML with the project's Markdown pipeline (so the
  // #6 admonitions/figures/tables carry through) via the container API.
  const container = await AstroContainer.create();
  const items = await Promise.all(
    posts.map(async (post) => {
      const { Content } = await render(post);
      const body = await container.renderToString(Content);
      // Math degradation (#34 / ADR-0006) and URL absolutization both live
      // behind toFeedHtml, so this route is pure feed assembly.
      return {
        title: post.data.title,
        description: post.data.summary,
        pubDate: post.data.published,
        link: `/blog/${post.id}/`,
        categories: post.data.tags,
        content: toFeedHtml(body, site),
      };
    }),
  );

  return rss({ title: FEED_TITLE, description: FEED_DESCRIPTION, site, items });
}
