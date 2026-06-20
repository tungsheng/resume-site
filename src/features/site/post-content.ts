import { BLOG_PATH } from "./content";
import { decisionProjectPath } from "./decision-content";
import {
  experimentCatalogContent,
  experimentDetailPath,
} from "./experiment-catalog-content";
import {
  getProjectById,
  projectPortfolioContent,
  type ProjectId,
} from "./projects-content";

export type PostStatus = "Outline" | "Drafting" | "Published";

export type PostBlock =
  | {
      kind: "heading";
      title: string;
      eyebrow?: string;
    }
  | {
      kind: "paragraph";
      text: string;
    }
  | {
      kind: "list";
      title?: string;
      items: string[];
    }
  | {
      kind: "callout";
      title: string;
      body: string;
      tone?: "accent" | "warning";
    }
  | {
      kind: "code";
      label: string;
      code: string;
    }
  | {
      kind: "table";
      title: string;
      columns: string[];
      rows: string[][];
    }
  | {
      kind: "flow";
      title: string;
      steps: string[];
    };

export type PostRecord = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: PostStatus;
  updated: string;
  readingTime: string;
  tags: string[];
  relatedProjectIds: ProjectId[];
  relatedExperimentSlugs: string[];
  relatedDecisionProjectIds: ProjectId[];
  outline: string[];
  blocks: PostBlock[];
};

export type PostRelatedLink = {
  kind: "Project" | "Experiment" | "Decision";
  label: string;
  href: string;
};

export const postRecords: PostRecord[] = [
  {
    slug: "sglang-architecture-request-lifecycle-scheduler-prefix-cache",
    title: "SGLang Architecture Deep Dive: Request Lifecycle, Scheduler, and Prefix Cache",
    summary:
      "A source-backed map of how requests move through an SGLang serving path, where scheduling choices happen, and how prefix reuse changes the shape of prefill work.",
    category: "Serving architecture",
    status: "Outline",
    updated: "2026-06-12",
    readingTime: "12 min read",
    tags: ["SGLang", "Scheduler", "Prefix cache", "Request lifecycle"],
    relatedProjectIds: ["gpu-inference-lab"],
    relatedExperimentSlugs: ["kv-cache", "batching", "prefill-decode"],
    relatedDecisionProjectIds: ["gpu-inference-lab"],
    outline: [
      "Request intake and normalization",
      "Prefill scheduling and admission pressure",
      "Scheduler state transitions",
      "Prefix cache lookup, hit handling, and eviction questions",
      "Decode handoff and observability points",
    ],
    blocks: [
      {
        kind: "paragraph",
        text:
          "This note starts as an implementation map rather than a benchmark claim. The goal is to trace the request lifecycle with enough precision that later measurements can point to a specific queue, cache boundary, or scheduler decision.",
      },
      {
        kind: "flow",
        title: "Request lifecycle map",
        steps: [
          "HTTP or OpenAI-compatible request",
          "Request object and sampling configuration",
          "Prefill admission",
          "Prefix cache lookup",
          "Batch scheduling",
          "Decode loop",
          "Streaming or final response",
        ],
      },
      {
        kind: "heading",
        eyebrow: "Working outline",
        title: "Scheduler and prefix cache outline",
      },
      {
        kind: "list",
        items: [
          "Define the exact request object shape and where tokenizer output becomes scheduler input.",
          "Separate prefill pressure from decode pressure so TTFT, queue delay, and decode latency do not blur together.",
          "Mark the prefix cache lookup boundary before describing hit, partial-hit, and miss behavior.",
          "Tie scheduler state back to practical signals: active requests, waiting requests, KV allocation, and streamed token cadence.",
        ],
      },
      {
        kind: "table",
        title: "Evidence hooks to collect",
        columns: ["Question", "Signal", "Why it matters"],
        rows: [
          [
            "Where does admission wait?",
            "Queue time before prefill",
            "Separates client pressure from model execution time",
          ],
          [
            "Was prefix reuse effective?",
            "Cache hit shape and prefill tokens skipped",
            "Explains TTFT changes without over-crediting scheduler tuning",
          ],
          [
            "When does decode become the limit?",
            "Per-token latency and active batch size",
            "Keeps decode bottlenecks separate from prompt processing",
          ],
        ],
      },
      {
        kind: "callout",
        title: "Drafting rule",
        body:
          "Keep source links beside each architectural statement before promoting this from outline to published note.",
      },
    ],
  },
  {
    slug: "decode-process-deep-dive",
    title: "Decode Process Deep Dive",
    summary:
      "A practical walk through one decode step, from resident KV reads through attention, sampling, batching decisions, and latency attribution.",
    category: "Inference internals",
    status: "Outline",
    updated: "2026-06-12",
    readingTime: "10 min read",
    tags: ["Decode", "KV cache", "Attention", "CUDA Graphs"],
    relatedProjectIds: ["gpu-inference-lab", "cuda-kernel-lab"],
    relatedExperimentSlugs: [
      "prefill-decode",
      "kernel-decode-step-graph-replay",
      "kernel-profiler-validation",
    ],
    relatedDecisionProjectIds: ["gpu-inference-lab", "cuda-kernel-lab"],
    outline: [
      "Decode loop mental model",
      "KV cache reads and writes",
      "Attention, logits, and sampling",
      "Continuous batching and request completion",
      "Latency attribution and graph replay caveats",
    ],
    blocks: [
      {
        kind: "paragraph",
        text:
          "This note focuses on the token-at-a-time path after prefill. It should explain the mechanics clearly enough to connect serving metrics with kernel-level experiments without pretending a synthetic kernel replay is an end-to-end serving result.",
      },
      {
        kind: "flow",
        title: "Decode loop mental model",
        steps: [
          "Select active sequences",
          "Read resident KV cache",
          "Run attention and MLP work",
          "Project logits",
          "Sample next token",
          "Append KV and token state",
          "Stream token or mark completion",
        ],
      },
      {
        kind: "heading",
        eyebrow: "Measurement notes",
        title: "What to separate",
      },
      {
        kind: "list",
        items: [
          "Do not mix TTFT with steady decode token latency when explaining a serving result.",
          "Track whether a timing point includes sampling, streaming, scheduler work, or only GPU kernels.",
          "Treat CUDA Graph replay as a useful upper-bound experiment until it is wired into the whole serving path.",
          "Record batch shape, sequence length, and KV residency because they change the decode cost model.",
        ],
      },
      {
        kind: "code",
        label: "Pseudo decode step",
        code:
          "select active requests -> run one token forward pass -> sample -> append token and KV -> stream token",
      },
      {
        kind: "callout",
        title: "Portfolio angle",
        body:
          "This note should bridge the GPU Inference Lab timing evidence and the CUDA Kernel Lab decode replay evidence without collapsing them into one claim.",
        tone: "warning",
      },
    ],
  },
];

export function postPath(slug: string): string {
  return `${BLOG_PATH}/${slug}`;
}

export function getPostBySlug(slug: string): PostRecord | undefined {
  return postRecords.find((post) => post.slug === slug);
}

export function getPostRelatedLinks(post: PostRecord): PostRelatedLink[] {
  const projectLinks = post.relatedProjectIds.map((projectId) => {
    const project = getProjectById(projectId);

    return {
      kind: "Project" as const,
      label: project.title,
      href: project.path,
    };
  });

  const experimentLinks = post.relatedExperimentSlugs.flatMap((slug) => {
    const experiment = experimentCatalogContent.experiments.find(
      (item) => item.slug === slug,
    );

    return experiment
      ? [
          {
            kind: "Experiment" as const,
            label: experiment.title,
            href: experimentDetailPath(slug),
          },
        ]
      : [];
  });

  const decisionLinks = post.relatedDecisionProjectIds.map((projectId) => ({
    kind: "Decision" as const,
    label: `${getProjectById(projectId).title} decisions`,
    href: decisionProjectPath(projectId),
  }));

  return [...projectLinks, ...experimentLinks, ...decisionLinks];
}

export function isPostProjectId(value: string): value is ProjectId {
  return projectPortfolioContent.projects.some((project) => project.id === value);
}
