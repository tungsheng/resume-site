import { getCollection } from "astro:content";
import { isPostVisible } from "./post";

// Which Posts are public (#10): the visible Posts for the current build —
// Published only in prod, all statuses in `astro dev` (ADR-0003 §8). The single
// call site for the getCollection + Status filter, so no surface can drift in
// what it considers visible. Returns UNSORTED entries; callers sort/slice via
// sortByPublishedDesc / selectLatest from post.ts.
//
// Named for what it answers rather than what it holds — "posts.ts" said nothing,
// and sat one letter from post.ts. This is also the ONLY module in
// astro/content/ that imports the Astro runtime, which is why it is the only
// one with no unit test: `astro:content` resolves solely inside the build.
export async function getVisiblePosts() {
  return getCollection("blog", (post) => isPostVisible(post.data.status, import.meta.env.PROD));
}
