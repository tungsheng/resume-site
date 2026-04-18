import type { HighlightCard } from "./types";
import { EXPERIMENTS_PATH, PROJECT_PATH } from "./paths";

export const homeContent = {
  eyebrow: "Portfolio overview",
  featuredCards: [
    {
      title: "Cloud Inference Platform",
      summary:
        "A queue-aware GPU inference platform on AWS EKS with Karpenter and vLLM.",
      bullets: [
        "Scale-from-zero GPU serving behind an ALB-backed /v1 endpoint",
        "Custom-metric autoscaling from serving pressure instead of CPU",
        "Measured cold-start, burst behavior, and cost-latency tradeoffs",
      ],
      href: PROJECT_PATH,
      ctaLabel: "View project",
    },
    {
      title: "Experiments and Evidence",
      summary: "Measured results from zero-idle and warm-1 serving profiles.",
      bullets: [
        "First ready replica and first public response timings",
        "Burst time to first token, scale-out, and cleanup timelines",
        "Cost comparison between zero idle and warm baseline capacity",
      ],
      href: EXPERIMENTS_PATH,
      ctaLabel: "View experiments",
    },
  ] satisfies HighlightCard[],
  credibilityStrip: [
    "Kubernetes (EKS)",
    "Karpenter",
    "vLLM",
    "GPU Autoscaling",
    "Prometheus / Grafana",
  ],
  currentFocus:
    "Right now I’m focused on ML inference infrastructure, distributed systems control loops, and the cost-versus-latency tradeoffs that show up when GPU capacity needs to scale under bursty real traffic.",
};
