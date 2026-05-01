const GPU_INFERENCE_REPO_BASE = "https://github.com/tungsheng/gpu-inference-lab/blob/main";
const SETUP_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/up`;
const VERIFY_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/verify`;
const EVALUATE_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/evaluate`;
const EXPERIMENT_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/experiment`;
const EXPERIMENT_SUMMARY_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/experiments-summary.md`;
const REPORTS_DOC_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/reports/README.md`;
const INGRESS_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/ingress.yaml`;
const SERVICE_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/service.yaml`;
const VLLM_DEPLOYMENT_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/vllm-openai.yaml`;
const ACTIVE_PRESSURE_HPA_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/hpa-active-pressure.yaml`;
const SCALING_DOC_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/scaling.md`;

export const projectContent = {
  title: "Cloud Inference Platform",
  lede:
    "A GPU inference lab on EKS that turns vLLM serving pressure into autoscaling and GPU node provisioning, with platform validation runs and a catalog of focused serving experiments.",
  overviewSummary:
    "The lab has one public serving path, one observable scale path, and three workflows for proving or measuring behavior.",
  overviewFacts: [
    {
      label: "Platform",
      value: "AWS EKS + vLLM",
      body:
        "Real OpenAI-compatible serving on Karpenter-managed GPU nodes.",
    },
    {
      label: "Scale signal",
      value: "Prometheus -> HPA",
      body:
        "Serving pressure becomes desired replicas and pending GPU pods.",
    },
    {
      label: "Baseline",
      value: "0 serving GPUs",
      body:
        "After setup, serving capacity can start from zero for cold-start proof.",
    },
    {
      label: "Workflows",
      value: "Verify / Evaluate / Experiment",
      body:
        "Use the smallest command path that matches the question being asked.",
    },
    {
      label: "Catalog",
      value: "6 experiments",
      body:
        "Focused definitions for memory, latency, batching, traffic, autoscaling, and cost.",
    },
    {
      label: "Results",
      value: "Validation measured",
      body:
        "Platform evidence exists; curated live-cluster catalog results are pending.",
    },
  ],
  usage: {
    title: "Choose the right workflow",
    lead:
      "Use verify for path proof, evaluate for platform comparisons, and experiment for catalog-defined serving questions.",
    workflows: [
      {
        title: "Verify",
        command: "./scripts/verify",
        body:
          "End-to-end proof that a GPU node appears, vLLM becomes Ready, /v1 returns 200, and cleanup returns serving GPUs to zero.",
        when: "Use after ./scripts/up for a fast path check.",
        outputs: ["GPU node appears", "Public /v1 response", "Cleanup to zero"],
        href: VERIFY_SCRIPT_LINK,
      },
      {
        title: "Evaluate",
        command: "./scripts/evaluate --profile zero-idle",
        body:
          "Measured platform comparisons for cold start, warm capacity, HPA policy, active-pressure targets, and resilience drills.",
        when: "Use for profile, scale signal, or target tuning decisions.",
        outputs: ["Markdown report", "JSON report", "Decision evidence"],
        href: EVALUATE_SCRIPT_LINK,
      },
      {
        title: "Experiment",
        command: "./scripts/experiment validate",
        body:
          "Catalog-defined ML-serving studies for workload cases, serving profiles, metrics, and generated reports.",
        when: "Use locally to validate or render; use run after ./scripts/up for measurements.",
        outputs: ["Catalog validation", "Rendered manifests", "Generated reports"],
        href: EXPERIMENT_SCRIPT_LINK,
      },
    ],
    conceptTitle: "Experiment contract",
    conceptLead:
      "The experiment page carries the full catalog; this page only shows the repeatable contract.",
    conceptSteps: [
      "Question",
      "Cases",
      "Serving profile",
      "Metrics",
      "Result",
    ],
    links: [
      {
        label: "Experiment summary",
        href: EXPERIMENT_SUMMARY_LINK,
      },
      {
        label: "Experiment runner",
        href: EXPERIMENT_SCRIPT_LINK,
      },
    ],
  },
  evidence: {
    title: "Evidence and outputs",
    lead:
      "Measured platform validation, generated reports, and catalog experiments are related, but they are not the same artifact.",
    items: [
      {
        title: "Platform validation",
        body:
          "Measured evaluate runs support warm baseline, scale-out signal, and target tuning decisions.",
      },
      {
        title: "Experiment catalog",
        body:
          "Experiment definitions and runners exist; curated live-cluster conclusions are still pending.",
      },
      {
        title: "Report rules",
        body:
          "Generated Markdown, JSON, and logs stay under docs/reports until selected for the project narrative.",
      },
    ],
    links: [
      {
        label: "Reports docs",
        href: REPORTS_DOC_LINK,
      },
      {
        label: "Scaling docs",
        href: SCALING_DOC_LINK,
      },
      {
        label: "Experiment summary",
        href: EXPERIMENT_SUMMARY_LINK,
      },
    ],
  },
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
};

export const implementation = {
  defaultPathTitle: "Default path",
  defaultPathLead:
    "Shortest path: bring up the platform, prove one public response, then clean it up.",
  defaultPathSteps: [
    {
      title: "Start the lab",
      command: "./scripts/up",
      body: "Provision platform pieces before serving starts.",
    },
    {
      title: "Prove the path",
      command: "./scripts/verify",
      body: "Confirm one successful public /v1 inference response.",
    },
    {
      title: "Tear it down",
      command: "./scripts/down",
      body: "Remove the workload and return serving GPUs to zero.",
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
};
