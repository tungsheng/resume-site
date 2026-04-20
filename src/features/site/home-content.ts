import type { HighlightCard, MetricPoint, NarrativeCard } from "./types";
import { EXPERIMENTS_PATH, PROJECT_PATH } from "./paths";

export const homeContent = {
  eyebrow: "ML inference portfolio",
  positioning:
    "This site is organized around one question: how should GPU-backed inference scale when cold-start latency, idle cost, and burst traffic all matter at the same time?",
  orientation: [
    "Start with the case study if you want the system decisions and architecture.",
    "Jump to the evidence page if you want measured timelines and raw evaluate excerpts.",
    "Use the resume page for the printable one-page professional summary.",
  ],
  proofPoints: [
    {
      label: "Warm-1 first public response",
      value: "1m 24s",
      detail: "Measured with one warm on-demand serving node already available.",
    },
    {
      label: "Zero-idle first public response",
      value: "7m 21s",
      detail: "Measured from true zero GPU capacity with node launch and model load.",
    },
    {
      label: "Burst cost range",
      value: "$0.421–$0.589",
      detail: "Measured across warm-1 and zero-idle experiment runs.",
    },
  ] satisfies MetricPoint[],
  featuredCards: [
    {
      title: "Case study",
      summary:
        "Follow the project from system question to architecture, scaling decisions, and measured outcomes.",
      bullets: [
        "Problem framing, design choices, and system diagrams",
        "Queue-aware autoscaling and mixed-capacity serving rationale",
        "What worked, what stayed expensive, and what I would improve next",
      ],
      href: PROJECT_PATH,
      ctaLabel: "Open case study",
    },
    {
      title: "Evidence",
      summary:
        "Go directly to the experiment data comparing zero-idle and warm-baseline serving profiles.",
      bullets: [
        "Cold-start headline metrics and side-by-side comparison",
        "Timeline walkthroughs for warm-1 and zero-idle behavior",
        "Checked-in raw evaluate excerpts instead of hand-wavy claims",
      ],
      href: EXPERIMENTS_PATH,
      ctaLabel: "Open evidence",
    },
  ] satisfies HighlightCard[],
  focusAreas: [
    {
      title: "Control loops over generic metrics",
      body:
        "I care about scaling signals that follow real serving pressure rather than whatever the host happens to expose by default.",
    },
    {
      title: "Latency-cost tradeoffs made explicit",
      body:
        "The interesting work is not just making a system scale, but showing what responsiveness costs and when warm capacity earns its keep.",
    },
    {
      title: "Hands-on platform evidence",
      body:
        "I like projects that pair architecture with measurement so the narrative is grounded in real system behavior under load.",
    },
  ] satisfies NarrativeCard[],
};
