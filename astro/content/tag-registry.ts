// The governed Tag registry (ADR-0008 decision 1 / CONTEXT.md "Tag"): one
// canonical kebab-case slug and one display label per topic. The frontmatter
// schema (blog-schema.ts) validates every Post's tags against this set, so an
// unregistered or misspelled tag fails the build instead of silently forking
// the vocabulary (`kv-cache` vs `KV cache`). Extend freely while writing — this
// is an open registry, not a closed set like Category — but never register a
// tag that restates a Category (CONTEXT.md: Tags cross-cut Categories).
export const TAG_REGISTRY = {
  "activation-functions": "Activation functions",
  attention: "Attention",
  "continuous-batching": "Continuous batching",
  ffn: "FFN",
  "flash-attention": "FlashAttention",
  gqa: "GQA",
  "kv-cache": "KV cache",
  mla: "MLA",
  mlp: "MLP",
  moe: "MoE",
  "paged-attention": "PagedAttention",
  "prefill-decode": "Prefill/decode",
  routing: "Routing",
  scheduling: "Scheduling",
  "self-attention": "Self-attention",
  swiglu: "SwiGLU",
  transformer: "Transformer",
} as const;

export type TagSlug = keyof typeof TAG_REGISTRY;

export const REGISTERED_TAG_SLUGS = Object.keys(TAG_REGISTRY) as TagSlug[];

export function isRegisteredTag(value: string): value is TagSlug {
  return Object.hasOwn(TAG_REGISTRY, value);
}

// Display label for a registered slug — the form tag chips, tag pages (#48),
// and search facets (#49) render; the slug itself is for URLs and frontmatter.
export function tagLabel(slug: TagSlug): string {
  return TAG_REGISTRY[slug];
}
