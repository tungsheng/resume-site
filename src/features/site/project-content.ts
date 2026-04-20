import type {
  ImplementationLink,
  MetricPoint,
  NarrativeCard,
  TradeoffItem,
} from "./types";

export const projectContent = {
  eyebrow: "Flagship case study",
  title: "Cloud Inference Platform",
  lede:
    "A hands-on ML infrastructure project built to answer a practical systems question: how do you keep GPU inference inexpensive at idle without making first-hit latency unusably slow?",
  heroHighlights: [
    "Scale-from-zero GPU inference on AWS without fixed managed GPU node groups.",
    "Queue-aware autoscaling from vLLM serving metrics instead of CPU saturation.",
    "Measured tradeoffs between zero-idle cost control and warm-baseline responsiveness.",
  ],
  framing: [
    {
      title: "System question",
      body:
        "GPU-backed inference is expensive to keep warm, but the first real request becomes painfully slow if every burst has to wait on node launch and model load.",
    },
    {
      title: "Why defaults fall short",
      body:
        "CPU and memory saturation are weak proxies for inference pressure. They miss the queueing behavior that users actually feel when serving starts to back up.",
    },
    {
      title: "What success meant",
      body:
        "The goal was to serve through an OpenAI-compatible endpoint, scale capacity from real serving pressure, and make the latency-cost tradeoff measurable.",
    },
  ] satisfies NarrativeCard[],
  designChoices: [
    {
      title: "Keep the request path boring",
      body:
        "Traffic enters through an ALB-backed ingress, hits the vLLM service, and lands on one-GPU serving pods. Complexity stays out of the user-facing request path.",
    },
    {
      title: "Scale from active work",
      body:
        "Prometheus and Prometheus Adapter expose serving pressure as custom metrics so the HPA follows admitted and waiting inference work instead of host utilization.",
    },
    {
      title: "Let pending pods pull capacity in",
      body:
        "New replicas request GPUs, remain Pending when none exist, and Karpenter provisions matching nodes from serving NodePools only when the workload demands it.",
    },
  ] satisfies NarrativeCard[],
  requestPathTitle: "Request path",
  requestPathNodes: [
    "Client",
    "ALB (Application Load Balancer)",
    "Ingress",
    "vLLM Service",
    "GPU Pods (1 GPU each)",
  ],
  capacityPathTitle: "Scaling and capacity path",
  capacityPathNodes: [
    "Requests",
    "vLLM queue pressure",
    "Prometheus Adapter + HPA",
    "Pending GPU pod",
    "Karpenter NodePools",
    "EC2 GPU node",
  ],
  architectureExplanation: [
    "The architecture separates user-facing request flow from capacity orchestration so the narrative is easier to reason about: one path serves traffic, the other decides when new GPUs need to appear.",
    "Prometheus, Prometheus Adapter, Grafana, and DCGM complete the loop by turning serving behavior into observable, actionable scaling signals instead of relying on generic infrastructure counters.",
  ],
  controlLoopNodes: ["Requests", "Queue pressure", "HPA", "Pending GPU pod", "Karpenter", "GPU node"],
  autoscalingSteps: [
    "Requests arrive through the OpenAI-compatible /v1 endpoint.",
    "Requests enter the vLLM queue and show up as running or waiting workload.",
    "Prometheus scrapes those serving metrics and Prometheus Adapter exposes them to Kubernetes as custom metrics.",
    "The Horizontal Pod Autoscaler scales the deployment from serving pressure rather than CPU usage.",
    "New pods request a GPU and remain Pending until capacity exists.",
    "Karpenter provisions a matching GPU node, the pod becomes Ready, and queued traffic is served.",
  ],
  autoscalingInsight:
    "The key design choice is that the scaling signal follows active inference work, which keeps the control loop tied to the thing that actually matters to users.",
  resultsLead:
    "The interesting result is not that autoscaling happened. It is that the warm baseline bought back minutes of first-hit latency, while zero-idle remained the cheapest steady-state posture.",
  resultsSummary: [
    {
      label: "Warm-1 first public response",
      value: "1m 24s",
      detail: "84 seconds with one warm on-demand serving node.",
    },
    {
      label: "Zero-idle first public response",
      value: "7m 21s",
      detail: "441 seconds from true zero GPU capacity.",
    },
    {
      label: "Burst cost per run",
      value: "$0.421–$0.589",
      detail: "Measured across warm-1 and zero-idle profiles.",
    },
  ] satisfies MetricPoint[],
  lessons: [
    "Cold-start cost savings are real, but node launch and model load dominate first-response latency.",
    "Queue-aware scaling is directionally better than CPU-based scaling because it follows admitted and waiting inference work.",
    "Warm capacity is the simplest lever for responsiveness, but it needs to be justified by traffic shape and cost tolerance.",
  ],
};

export const tradeoffs = [
  {
    title: "Cold start vs cost",
    leftLabel: "Zero-idle",
    leftBody: "Lowest idle cost, but first real traffic waits on node launch and model load.",
    rightLabel: "Warm baseline",
    rightBody: "Better responsiveness, but steady GPU cost exists even while the queue is empty.",
  },
  {
    title: "Queue depth vs latency",
    leftLabel: "Bigger queues",
    leftBody: "Can improve batching efficiency and throughput.",
    rightLabel: "Shallower queues",
    rightBody: "Protect time to first token, but reduce burst absorption headroom.",
  },
  {
    title: "Utilization vs responsiveness",
    leftLabel: "Push utilization",
    leftBody:
      "Improves efficiency, but increases the chance of latency spikes during burst traffic.",
    rightLabel: "Preserve slack",
    rightBody: "Responds faster to load changes, but strands more capacity when demand is light.",
  },
] satisfies TradeoffItem[];

export const capacityModel = {
  title: "Capacity Model",
  lead:
    "Each GPU-backed pod has bounded serving capacity, so autoscaling should map to active work per GPU rather than raw request count.",
  formula: "desired_replicas ≈ ceil(active_requests / capacity_per_pod)",
  note:
    "This is why the active-pressure policy matters: it pushes the system toward a capacity-aware control loop instead of one driven by generic host saturation.",
};

export const implementation = {
  title: "Implementation trail",
  stack: [
    "Terraform for VPC and EKS provisioning",
    "Karpenter NodePools for dynamic GPU capacity",
    "vLLM for OpenAI-compatible model serving",
    "Prometheus Adapter plus HPA for custom-metric autoscaling",
    "Prometheus, Grafana, and DCGM exporter for observability",
  ],
  links: [
    {
      label: "GitHub repository",
      href: "https://github.com/tungsheng/gpu-inference-lab",
      detail: "Full project with infrastructure, manifests, scripts, and report snapshots.",
    },
    {
      label: "gpu-serving-ondemand NodePool",
      href: "https://github.com/tungsheng/gpu-inference-lab/blob/main/platform/karpenter/nodepool-gpu-serving-ondemand.yaml",
      detail: "Warm baseline and on-demand fallback capacity.",
    },
    {
      label: "Inference HPA",
      href: "https://github.com/tungsheng/gpu-inference-lab/blob/main/platform/inference/hpa.yaml",
      detail: "Custom-metric autoscaling from serving pressure.",
    },
    {
      label: "evaluate workflow",
      href: "https://github.com/tungsheng/gpu-inference-lab/blob/main/scripts/evaluate",
      detail: "Burst experiment workflow and report generation.",
    },
  ] satisfies ImplementationLink[],
};
