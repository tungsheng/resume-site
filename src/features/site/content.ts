import type {
  ExperimentProfile,
  HighlightCard,
  ImplementationLink,
  SiteProfile,
  TradeoffItem,
} from "./types";

export const PROJECT_PATH = "/project/cloud-inference-platform";
export const EXPERIMENTS_PATH = "/experiments";
export const ABOUT_PATH = "/about";

export const siteProfile: SiteProfile = {
  name: "Tony Lee",
  title: "Staff Software Engineer — ML Inference & Distributed Systems",
  summary:
    "I design and evaluate GPU-backed inference systems that scale under real-world constraints: latency, cost, and burst load.",
  resumeSlug: "tony-lee",
  githubUrl: "https://github.com/tungsheng/gpu-inference-lab",
  linkedinUrl: "https://linkedin.com/in/tonyslee8",
  email: "tungsheng@gmail.com",
};

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
      summary:
        "Measured results from zero-idle and warm-1 serving profiles.",
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

export const experimentsContent = {
  eyebrow: "Evidence and measurements",
  title: "Zero-Idle vs Warm Baseline",
  subtitle:
    "These results come from checked-in evaluate reports dated April 13, 2026 (warm-1) and April 15, 2026 (zero-idle).",
  profiles: [
    {
      id: "zero-idle",
      label: "Zero Idle",
      reportDate: "2026-04-15",
      baselineGpuState: "0 GPU nodes",
      firstReadySeconds: 430,
      firstPublicResponseSeconds: 441,
      secondReadySeconds: 1014,
      idleCostPerHour: 0,
      burstCost: 0.588682,
      burstTimeToFirstTokenSeconds: 0.10708472222222215,
      timeline: [
        { label: "First NodeClaim", seconds: 13 },
        { label: "First GPU node", seconds: 37 },
        { label: "First ready replica", seconds: 430, emphasis: true },
        { label: "First public response", seconds: 441, emphasis: true },
        { label: "HPA desired replicas = 2", seconds: 612 },
        { label: "Second ready replica", seconds: 1014 },
        { label: "Cleanup to zero GPU nodes", seconds: 2999 },
      ],
      proofExcerpt: {
        title: "evaluate excerpt",
        command: "./scripts/evaluate --profile zero-idle",
        lines: [
          "[13s] First NodeClaim created",
          "[37s] First GPU node registered",
          "[430s] First ready replica",
          "[441s] First public response",
          "[612s] HPA desired replicas = 2",
          "[648s] Second GPU node registered",
          "[1014s] Second ready replica",
          "[2999s] Final cleanup to zero GPU nodes",
        ],
      },
    },
    {
      id: "warm-1",
      label: "Warm-1",
      reportDate: "2026-04-13",
      baselineGpuState: "1 warm on-demand serving node",
      firstReadySeconds: 73,
      firstPublicResponseSeconds: 84,
      secondReadySeconds: 672,
      idleCostPerHour: 0.526,
      burstCost: 0.4208,
      burstTimeToFirstTokenSeconds: 0.0905,
      timeline: [
        { label: "Warm baseline already present", seconds: 0, emphasis: true },
        { label: "First ready replica", seconds: 73, emphasis: true },
        { label: "First public response", seconds: 84, emphasis: true },
        { label: "HPA desired replicas = 2", seconds: 252 },
        { label: "Second GPU node", seconds: 275 },
        { label: "Second ready replica", seconds: 672 },
        { label: "Warm baseline restored", seconds: 1359 },
      ],
      proofExcerpt: {
        title: "evaluate excerpt",
        command: "./scripts/evaluate --profile warm-1",
        lines: [
          "[0s] Warm baseline already present",
          "[73s] First ready replica",
          "[84s] First public response",
          "[252s] HPA desired replicas = 2",
          "[275s] Second GPU node registered",
          "[672s] Second ready replica",
          "[1359s] Warm baseline restored",
        ],
      },
    },
  ] satisfies ExperimentProfile[],
  notes: [
    "Cold start should be evaluated from first ready replica and first public response, not burst TTFT.",
    "Burst time to first token (TTFT) is still useful, but it reflects serving behavior once the system is already warm enough to process active load.",
    "The reports show that zero-idle is excellent for idle cost control, while warm-1 materially improves responsiveness.",
  ],
  screenshotPlaceholder:
    "Charts and Grafana screenshots can live here later without changing the structure of the page.",
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
    leftBody: "Improves efficiency, but increases the chance of latency spikes during burst traffic.",
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

export const failures = {
  title: "Failure Modes & Limitations",
  items: [
    "Cold-start latency is dominated by GPU node provisioning and model load time.",
    "Autoscaling lags behind sudden bursts because pod scale-out still waits on infrastructure scale-out.",
    "Small workloads can underutilize a full GPU-per-pod serving shape.",
    "Serving capacity depends on EC2 availability and cluster scheduling headroom.",
    "The current system is a single-tenant control-loop experiment and does not yet implement queue prioritization or fairness controls.",
  ],
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

export const aboutContent = {
  eyebrow: "About",
  title: "About Tony",
  bio: [
    "I’m a staff-level software engineer focused on platform engineering, distributed systems, and ML inference infrastructure.",
    "I like projects where system behavior matters as much as code quality: autoscaling control loops, reliability under burst, and the cost-versus-latency tradeoffs that show up in real production decisions.",
  ],
  currentFocus: [
    "Cloud inference systems on Kubernetes",
    "Queue-aware autoscaling and capacity reasoning",
    "Practical platform engineering for developer velocity and operational reliability",
  ],
  roles:
    "I’m targeting senior to staff platform, infrastructure, and cloud inference roles where I can work on real systems behavior, not just isolated application features.",
  contactLinks: [
    {
      label: "GitHub",
      href: siteProfile.githubUrl,
      detail: "Code, manifests, and experiment workflows",
    },
    {
      label: "LinkedIn",
      href: siteProfile.linkedinUrl,
      detail: "Professional profile and work history",
    },
    {
      label: "Email",
      href: `mailto:${siteProfile.email}`,
      detail: siteProfile.email,
    },
  ],
};
