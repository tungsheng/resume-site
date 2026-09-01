import { degradeMathToTeX } from "./degrade-math-rss";

// Rendered Post HTML → feed-ready HTML (#9 / #34). Two transforms have to run
// over a Post body before it ships in the feed, and they used to live at
// different levels of rigour: degradeMathToTeX here in astro/markdown, exported
// and unit-tested, and absolutizeUrls as a private function at the bottom of
// the rss.xml route — unreachable from the unit suite, and therefore untested.
// This module owns the whole answer, so rss.xml.ts holds no string surgery and
// both halves are asserted through one interface.

// Feed readers fetch entries away from the page, so root-relative asset and
// link URLs (the self-hosted /assets/blog/… images from #6) must point at the
// production origin to resolve in a reader.
//
// But NOT inside a code span. A Post that quotes a URL as code is talking
// ABOUT that URL, and rewriting it changes what the author wrote — the feed
// would show `<a href="https://tonylee.bio/work">` where the Post said
// `<a href="/work">`. Fenced blocks were never affected (Shiki tokenises, so
// `href`, `=` and `"/work"` land in separate spans and the string is never
// contiguous), but inline code spans are only entity-escaped, so the match
// survives. Skipping every <code> region covers both and costs nothing.
const CODE_REGION = /<code\b[^>]*>[\s\S]*?<\/code>/gi;

function absolutizeOutsideCode(html: string, origin: string): string {
  return html
    .replaceAll('src="/', `src="${origin}/`)
    .replaceAll('href="/', `href="${origin}/`);
}

function absolutizeUrls(html: string, site: URL): string {
  const { origin } = site;
  let out = "";
  let last = 0;
  for (const match of html.matchAll(CODE_REGION)) {
    // Rewrite the prose before this code region; pass the region through verbatim.
    out += absolutizeOutsideCode(html.slice(last, match.index), origin) + match[0];
    last = match.index + match[0].length;
  }
  return out + absolutizeOutsideCode(html.slice(last), origin);
}

// Degrade math to raw TeX first (#34 / ADR-0006): the feed carries no KaTeX
// stylesheet, so rendered formulas would be a glyph jumble — show readable
// source instead. Then absolutize what is left. Order matters: degrading emits
// <code>$…$</code>, and those must be protected from absolutization like any
// other code span.
export function toFeedHtml(html: string, site: URL): string {
  return absolutizeUrls(degradeMathToTeX(html), site);
}
