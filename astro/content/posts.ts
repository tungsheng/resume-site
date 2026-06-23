import { getCollection } from "astro:content";
import { isPostVisible } from "./blog-schema";

// Shared Post loader (#10): the visible Posts for the current build — Published
// only in prod, all statuses in `astro dev` (ADR-0003 §8). Single call site for
// the getCollection + Status filter so the home section, the /blog index, and
// the RSS feed can't drift in what they consider visible. Returns UNSORTED
// entries; callers sort/slice via sortByPublishedDesc / selectLatest.
export async function getVisiblePosts() {
  return getCollection("blog", (post) => isPostVisible(post.data.status, import.meta.env.PROD));
}
