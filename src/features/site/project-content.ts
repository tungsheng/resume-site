import type { ImplementationLink, MetricPoint, TradeoffItem } from "./types";

export const projectContent = {
  title: "Cloud Inference Platform",
  lede:
    "An AWS EKS + Karpenter + vLLM lab for learning how GPU inference should scale from real serving pressure, not generic host saturation.",
  heroProof:
    "Today the lab proves three operator paths: zero-GPU cold start, policy comparison, and active-pressure target calibration.",
  requestPathTitle: "Serving path",
  requestPathNodes: ["Client", "ALB", "Ingress", "Service", "vLLM pod"],
  capacityPathTitle: "Scaling path",
  capacityPathNodes: [
    "vLLM queue metrics",
    "Prometheus Adapter",
    "HPA",
    "Pending GPU pod",
    "Karpenter NodePool",
    "GPU node",
  ],
  architectureExplanation: [
    "Serving traffic and provisioning GPUs are separate paths. That keeps the user-facing request flow simple and makes the control loop easier to reason about.",
    "The more important milestone is no longer that Karpenter launches nodes. It is that the same deployment can now compare admitted work against total queue pressure without changing the serving path.",
  ],
  loadSpikeBullets: [
    "vLLM exposes both running-request and active-request metrics.",
    "Prometheus Adapter publishes those metrics to Kubernetes as pod metrics.",
    "The HPA scales the deployment from one replica to two from custom serving pressure, and pending GPU pods pull new capacity in through Karpenter-managed serving NodePools.",
  ],
  resultsLead:
    "The latest runs show a stronger story than cold-start proof alone: the repo can now compare and tune autoscaling policies.",
  resultsMeta:
    "Local gpu-inference-lab artifacts were generated on April 20, 2026 from evaluation runs completed on April 19, 2026.",
  featuredResult: {
    title: "Warm-1 scaled the second replica sooner",
    value: "563s vs 1002s",
    detail:
      "In the latest compare run, active-pressure brought the second ready replica online 439s earlier than the running baseline.",
  },
  supportingResults: [
    {
      label: "Warm-1 compare cost",
      value: "$0.438",
      detail: "$0.037 higher than the running baseline.",
    },
    {
      label: "Zero-idle first response",
      value: "447s",
      detail: "Measured from a true zero-GPU baseline.",
    },
  ] satisfies MetricPoint[],
  resultTakeaways: [
    "Compare mode now shows whether a policy changes scale-out timing, not just whether the cluster can add nodes.",
    "Sweep mode turns the repo into a calibration workflow instead of a single burst demo.",
  ],
  resultsNextStep:
    "The remaining gap is efficiency instrumentation and GPU bin packing, not whether the platform can scale out.",
  lessons: [
    "Queue wait in the latest reports is still a derived estimate, not a first-class queue histogram.",
    "GPU utilization and headroom readouts can still be incomplete when the observability path misses those metrics.",
    "The next step is per-GPU efficiency and bin packing, which is a better next problem than re-proving basic scale-out.",
  ],
};

export const tradeoffs = [
  {
    title: "Idle cost vs first response",
    leftLabel: "Zero-idle",
    leftBody: "Cheapest steady state, but every first request waits on node launch and model load.",
    rightLabel: "Warm-1",
    rightBody: "Keeps one on-demand path ready, which improves first-user responsiveness at a standing hourly cost.",
  },
  {
    title: "Admitted work vs total pressure",
    leftLabel: "Running policy",
    leftBody: "Follows admitted requests only, which preserves the older baseline but reacts later to queue growth.",
    rightLabel: "Active-pressure policy",
    rightBody: "Scales from waiting plus running work, which reacts earlier when the queue starts to build.",
  },
  {
    title: "Scale-out proof vs efficiency proof",
    leftLabel: "Current strength",
    leftBody:
      "The repo proves zero-idle cold start, mixed-capacity serving, policy compare, and target sweep workflows.",
    rightLabel: "Next problem",
    rightBody:
      "The stronger follow-up question is how much useful work each GPU can sustain before latency or cost break down.",
  },
] satisfies TradeoffItem[];

export const implementation = {
  title: "Implementation trail",
  stack: [
    "Terraform-managed VPC and EKS dev environment in us-west-2",
    "Public ALB-backed /v1 inference edge on Kubernetes Ingress",
    "vLLM v0.9.0 serving Qwen/Qwen2.5-0.5B-Instruct",
    "Karpenter-managed gpu-serving-ondemand and gpu-serving-spot NodePools",
    "Prometheus, Grafana, Prometheus Adapter, Pushgateway, and DCGM exporter",
    "Scripted verify and evaluate workflows with Markdown and JSON report output",
  ],
  links: [
    {
      label: "GitHub repository",
      href: "https://github.com/tungsheng/gpu-inference-lab",
      detail: "Full project with infrastructure, manifests, scripts, and documentation.",
    },
    {
      label: "Active-pressure HPA",
      href: "https://github.com/tungsheng/gpu-inference-lab/blob/main/platform/inference/hpa-active-pressure.yaml",
      detail: "Capacity-aware HPA policy that scales from waiting plus running inference work.",
    },
    {
      label: "evaluate workflow",
      href: "https://github.com/tungsheng/gpu-inference-lab/blob/main/scripts/evaluate",
      detail: "Compare and sweep workflow for burst evaluation, target calibration, and report generation.",
    },
    {
      label: "Scaling deep dive",
      href: "https://github.com/tungsheng/gpu-inference-lab/blob/main/docs/scaling.md",
      detail: "Mixed-capacity serving model, policy comparison, and the current next-step story.",
    },
  ] satisfies ImplementationLink[],
};
