import type { ImplementationLink, TradeoffItem } from "./types";

export const projectContent = {
  eyebrow: "Flagship project",
  title: "Cloud Inference Platform",
  lede:
    "A hands-on ML infrastructure project built to understand how GPU-backed inference behaves under cold start, burst load, and mixed-capacity serving pressure.",
  explores: [
    "Scale-from-zero GPU inference on AWS without fixed managed GPU node groups",
    "Queue-aware autoscaling from vLLM serving metrics rather than CPU saturation",
    "Measured tradeoffs between zero-idle cost efficiency and warm-baseline responsiveness",
  ],
  architectureTitle: "Architecture",
  architectureNodes: [
    "Client",
    "ALB (Application Load Balancer)",
    "Ingress",
    "vLLM Service",
    "GPU Pods (1 GPU each)",
    "Karpenter NodePools",
    "EC2 GPU Nodes",
  ],
  architectureExplanation: [
    "The public request path is intentionally simple: traffic enters through an ALB-backed ingress, reaches the vLLM service, and lands on GPU-backed serving pods.",
    "GPU capacity is not pre-allocated. Pods request a GPU, become Pending when none is available, and Karpenter provisions matching nodes from the serving NodePools.",
    "Prometheus, Prometheus Adapter, Grafana, and DCGM complete the control loop by exposing serving pressure and observability data instead of relying on generic host metrics.",
  ],
  controlLoopNodes: [
    "Requests",
    "Queue pressure",
    "Horizontal Pod Autoscaler",
    "Pending GPU pod",
    "Karpenter",
    "GPU node",
  ],
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
  resultsSummary: [
    {
      label: "Zero-idle first public response",
      value: "7m 21s",
      detail: "441 seconds from true zero GPU capacity",
    },
    {
      label: "Warm-1 first public response",
      value: "1m 24s",
      detail: "84 seconds with one warm on-demand serving node",
    },
    {
      label: "Burst cost per run",
      value: "$0.421–$0.589",
      detail: "Measured across warm-1 and zero-idle profiles",
    },
  ],
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
  title: "Implementation",
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
