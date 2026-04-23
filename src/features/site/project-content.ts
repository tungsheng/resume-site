const GPU_INFERENCE_REPO_LINK = "https://github.com/tungsheng/gpu-inference-lab";
const GPU_INFERENCE_REPO_BASE = "https://github.com/tungsheng/gpu-inference-lab/blob/main";
const SETUP_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/up`;
const VERIFY_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/verify`;
const EVALUATE_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/evaluate`;
const INGRESS_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/ingress.yaml`;
const SERVICE_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/service.yaml`;
const VLLM_DEPLOYMENT_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/vllm-openai.yaml`;
const ACTIVE_PRESSURE_HPA_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/hpa-active-pressure.yaml`;
const SCALING_DOC_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/scaling.md`;

export const projectContent = {
  title: "Cloud Inference Platform",
  lede:
    "A GPU inference lab on EKS that turns vLLM serving pressure into autoscaling and GPU node provisioning, with checked-in runs for cold start, warm capacity, policy comparison, and target tuning.",
  overviewSummary:
    "A compact view of what the platform is, how it works, and why the measured results matter.",
  overviewCards: [
    {
      title: "What",
      body:
        "A reproducible GPU inference lab on AWS EKS for measuring cold start, warm capacity, and autoscaling behavior.",
    },
    {
      title: "How",
      body:
        "Serving pressure becomes scaling decisions through Prometheus, the adapter, HPA, pending GPU pods, and Karpenter.",
    },
    {
      title: "Why",
      body:
        "It makes response-time tradeoffs and GPU scale-out behavior easy to understand with checked-in runs.",
    },
  ],
  overviewSignalsLead:
    "These numbers show cold-start wait, warm-path benefit, and how quickly the platform adds capacity after traffic begins.",
  overviewMetrics: [
    {
      label: "Starting from zero",
      value: "447s",
      detail: "First public response when no GPU serving path is already running.",
    },
    {
      label: "Keeping one path warm",
      value: "84s",
      detail: "First public response when one serving path is already ready.",
    },
    {
      label: "Scaling after traffic starts",
      value: "563s",
      detail: "Second ready replica under the current warm-path and active-pressure policy.",
    },
  ],
  workflowSectionTitle: "How the platform serves and scales",
  workflowLead:
    "Requests follow one stable public path. Load signals follow a separate control path that adds GPU capacity only when another replica cannot schedule.",
  workflowFoundation: {
    title: "Foundation",
    summary:
      "After the ./scripts/up setup step, the cluster already has ingress, observability, and GPU admission pieces in place, while GPU serving node count still stays at zero.",
    nodes: [
      {
        label: "Setup via scripts/up",
        href: SETUP_SCRIPT_LINK,
        linkLabel: "Code",
      },
      {
        label: "System nodes",
      },
      {
        label: "Public ingress hostname",
        href: INGRESS_LINK,
        linkLabel: "Code",
      },
      {
        label: "Prometheus",
        href: SCALING_DOC_LINK,
        linkLabel: "Docs",
      },
      {
        label: "Adapter / custom metrics API",
        href: SCALING_DOC_LINK,
        linkLabel: "Docs",
      },
      {
        label: "GPU NodePools",
        href: SCALING_DOC_LINK,
        linkLabel: "Docs",
      },
      {
        label: "GPU nodes: 0",
      },
    ],
  },
  workflowPaths: [
    {
      title: "Serve path",
      summary:
        "The public request path stays stable from the internet edge to the first ready inference replica.",
      nodes: [
        {
          label: "Internet",
        },
        {
          label: "ALB",
        },
        {
          label: "Ingress",
          href: INGRESS_LINK,
          linkLabel: "Code",
        },
        {
          label: "Service",
          href: SERVICE_LINK,
          linkLabel: "Code",
        },
        {
          label: "Ready vLLM pod",
          href: VLLM_DEPLOYMENT_LINK,
          linkLabel: "Code",
        },
      ],
    },
    {
      title: "Scale path",
      summary:
        "Serving pressure is exported as metrics, translated into custom metrics, and turned into an HPA replica target that can create another ready replica.",
      nodes: [
        {
          label: "vLLM metrics",
          href: VLLM_DEPLOYMENT_LINK,
          linkLabel: "Code",
        },
        {
          label: "Prometheus",
          href: SCALING_DOC_LINK,
          linkLabel: "Docs",
        },
        {
          label: "Adapter",
          href: SCALING_DOC_LINK,
          linkLabel: "Docs",
        },
        {
          label: "HPA desired replicas",
          href: ACTIVE_PRESSURE_HPA_LINK,
          linkLabel: "Code",
        },
        {
          label: "Pending GPU pod",
        },
        {
          label: "Karpenter / NodeClaim",
          href: SCALING_DOC_LINK,
          linkLabel: "Docs",
        },
        {
          label: "GPU node",
        },
        {
          label: "Second Ready vLLM pod",
          href: VLLM_DEPLOYMENT_LINK,
          linkLabel: "Code",
        },
      ],
    },
  ],
  workflowRejoin: {
    body:
      "The added replica rejoins the same in-cluster Service, so the public path stays unchanged while capacity increases underneath it.",
    nodes: [
      {
        label: "Second Ready vLLM pod",
        href: VLLM_DEPLOYMENT_LINK,
        linkLabel: "Code",
      },
      {
        label: "Same Service",
        href: SERVICE_LINK,
        linkLabel: "Code",
      },
    ],
  },
  workflowExplainers: [
    {
      title: "Stable path",
      body:
        "The public ingress hostname and in-cluster Service keep the request path steady while replicas restart, move, or scale.",
    },
    {
      title: "Reactive path",
      body:
        "Prometheus, the adapter, and the HPA convert serving pressure into desired replicas instead of guessing from raw infrastructure state.",
    },
    {
      title: "Added capacity",
      body:
        "A pending pod creates the capacity signal that turns GPU NodePools into a real NodeClaim, a GPU node, and another ready replica.",
    },
  ],
};

export const implementation = {
  title: "Quick start and measure",
  lead:
    "Bring the lab up, prove one real public response, and tear it down. Run evaluate only when you want comparison reports and tuning data.",
  defaultPathTitle: "Default path",
  defaultPathLead:
    "This is the shortest path to understand what the repo proves without going straight into the heavier measurement workflow.",
  defaultPathSteps: [
    {
      title: "Start the lab",
      command: "./scripts/up",
      body:
        "Provision the VPC, EKS cluster, ingress, observability, and GPU-ready platform pieces so the environment is ready before serving starts.",
    },
    {
      title: "Prove the path",
      command: "./scripts/verify",
      body:
        "Run one end-to-end cold-start proof through the real public endpoint instead of a local-only smoke test.",
    },
    {
      title: "Tear it down",
      command: "./scripts/down",
      body:
        "Remove the workload and environment again so the quick-start path ends cleanly after the proof run.",
    },
  ],
  verifyProofTitle: "What the quick start proves",
  verifyProofs: [
    {
      title: "GPU capacity appears",
      body:
        "A real serving GPU node is launched for the workload instead of assuming capacity is already present.",
    },
    {
      title: "Public inference works",
      body:
        "The deployment reaches Ready and the script waits for one successful public inference response through the real /v1 path.",
    },
    {
      title: "Cleanup returns to zero",
      body:
        "Cleanup removes the workload and confirms the serving GPU node count falls back to zero.",
    },
  ],
  measurement: {
    title: "Go deeper with evaluate",
    command: "./scripts/evaluate --profile zero-idle|warm-1",
    body:
      "Use the heavier measurement path when you want compare and tuning data instead of a single cold-start proof. It runs profile-based workflows and writes report artifacts you can inspect later.",
    outputs: ["Markdown report", "JSON report"],
    links: [
      {
        label: "Quick start README",
        href: GPU_INFERENCE_REPO_LINK,
      },
      {
        label: "Verify script",
        href: VERIFY_SCRIPT_LINK,
      },
      {
        label: "Evaluate script",
        href: EVALUATE_SCRIPT_LINK,
      },
    ],
  },
};
