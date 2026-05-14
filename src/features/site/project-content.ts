const GPU_INFERENCE_REPO_BASE = "https://github.com/tungsheng/gpu-inference-lab/blob/main";
const SETUP_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/up`;
const VERIFY_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/verify`;
const EVALUATE_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/evaluate`;
const EXPERIMENT_SCRIPT_LINK = `${GPU_INFERENCE_REPO_BASE}/scripts/experiment`;
const DECISION_ENGINE_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/decision-engine.md`;
const EVIDENCE_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/evidence.md`;
const EXPERIMENT_CATALOG_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/experiment-catalog.md`;
const PLATFORM_REFERENCE_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/platform-reference.md`;
const REPORTS_DOC_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/reports/README.md`;
const RUNBOOK_LINK = `${GPU_INFERENCE_REPO_BASE}/docs/runbook.md`;
const INGRESS_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/ingress.yaml`;
const SERVICE_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/service.yaml`;
const VLLM_DEPLOYMENT_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/vllm-openai.yaml`;
const ACTIVE_PRESSURE_HPA_LINK = `${GPU_INFERENCE_REPO_BASE}/platform/inference/hpa-active-pressure.yaml`;

export const projectContent = {
  title: "Cloud Inference Platform",
  lede:
    "A GPU inference lab on EKS that turns vLLM serving measurements into architecture decisions for admission, autoscaling, context length, scheduler behavior, and quantization.",
  overviewSummary:
    "The lab has one public serving path, one observable scale path, and a decision loop for separating supported conclusions from partial claims.",
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
      value: "7 experiments",
      body:
        "Focused definitions for memory, latency, batching, traffic, autoscaling, cost, and quantization.",
    },
    {
      label: "Results",
      value: "Supported + partial",
      body:
        "Curated evidence records what is supported, what regressed, and what still needs measurement.",
    },
  ],
  usage: {
    title: "Choose the right workflow",
    lead:
      "Use verify for path proof, evaluate for platform comparisons, and experiment for catalog-defined serving questions that feed the decision engine.",
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
    conceptTitle: "Decision contract",
    conceptLead:
      "The experiment page carries the full catalog; this page shows how a workload question becomes evidence, then a recommendation, rejection, or documented gap.",
    conceptSteps: [
      "Workload",
      "Profile",
      "Run",
      "Evidence gate",
      "Decision",
    ],
    links: [
      {
        label: "Decision engine",
        href: DECISION_ENGINE_LINK,
      },
      {
        label: "Experiment catalog",
        href: EXPERIMENT_CATALOG_LINK,
      },
      {
        label: "Experiment runner",
        href: EXPERIMENT_SCRIPT_LINK,
      },
      {
        label: "Runbook",
        href: RUNBOOK_LINK,
      },
    ],
  },
  evidence: {
    title: "Evidence and decisions",
    lead:
      "Generated reports are inputs. Curated conclusions are the product: the evidence page records what the lab can support today and what remains a hypothesis.",
    items: [
      {
        title: "Supported conclusions",
        body:
          "Bounded admission, the 8192/300 long-context knee, and the current FP8 KV-cache rejection are supported by measured runs.",
      },
      {
        title: "Evidence gate",
        body:
          "A claim needs the right fields: completed, dropped, interrupted, p95/p99 latency, throughput, queue pressure, GPU metrics, cost, or accuracy depending on the decision.",
      },
      {
        title: "Open gaps",
        body:
          "Active-pressure targets, batching matrices, request-pattern utilization, cost, streaming, and Blackwell FP4 remain partial until their result fields are complete.",
      },
    ],
    links: [
      {
        label: "Evidence",
        href: EVIDENCE_LINK,
      },
      {
        label: "Decision engine",
        href: DECISION_ENGINE_LINK,
      },
      {
        label: "Reports docs",
        href: REPORTS_DOC_LINK,
      },
      {
        label: "Experiment catalog",
        href: EXPERIMENT_CATALOG_LINK,
      },
    ],
  },
  validation: {
    title: "Architecture Decisions",
    lede:
      "Curated lab conclusions: what the current EKS/vLLM evidence supports, what it rejects, and where the boundary stays explicit.",
    summary:
      "This is not a catalog entry. It is the portfolio-facing decision record that turns measured runs into architecture calls.",
    decisions: [
      {
        title: "Admission model",
        call: "Bound burst traffic",
        proofLabel: "Delivery ratio",
        proofValue: "100% vs 76.98-88.14%",
        body:
          "Bounded queued clients protected delivery ratio and p95 latency during burst and spike-to-zero runs by limiting active concurrency.",
        caveat: "Direct clients completed more work in the same wall-clock window but dropped 237-787 iterations.",
      },
      {
        title: "Cold-start bottleneck",
        call: "Optimize readiness",
        proofLabel: "Model ready",
        proofValue: "425-439s",
        body:
          "Karpenter produced a NodeClaim in 3-12s and a GPU node in 35s; container and model readiness dominated the scale-from-zero wait.",
        caveat: "First-successful-completion timing still needs to be captured in the selected reports.",
      },
      {
        title: "Long-context boundary",
        call: "Gate 8192/300",
        proofLabel: "Practical edge",
        proofValue: "1.20 req/s, 54.35s p95",
        body:
          "The long-context profile has no waiting at 1.10 req/s, starts queueing at 1.15 req/s, and can still deliver every request at 1.20 req/s while missing a practical latency envelope.",
        caveat: "Boundary applies to the measured model, GPU class, vLLM path, and 8192/300 workload.",
      },
      {
        title: "KV-cache dtype",
        call: "Reject FP8 KV here",
        proofLabel: "Delivery ratio",
        proofValue: "47.58-69.12%",
        body:
          "FP8 KV-cache variants saved little memory and regressed delivery, p95 latency, and generated tokens/sec on the current g4dn/vLLM path.",
        caveat: "Retest only with a newer vLLM image or different GPU backend.",
      },
    ],
    sourceFacts: [
      {
        label: "Updated",
        value: "May 13, 2026",
      },
      {
        label: "Workflow",
        value: "./scripts/evaluate + ./scripts/experiment",
      },
      {
        label: "Evidence type",
        value: "Curated conclusions",
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
        href: PLATFORM_REFERENCE_LINK,
        linkLabel: "Docs",
      },
      {
        label: "Adapter / custom metrics API",
        href: PLATFORM_REFERENCE_LINK,
        linkLabel: "Docs",
      },
      {
        label: "GPU NodePools",
        href: PLATFORM_REFERENCE_LINK,
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
          href: PLATFORM_REFERENCE_LINK,
          linkLabel: "Docs",
        },
        {
          label: "Adapter",
          href: PLATFORM_REFERENCE_LINK,
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
          href: PLATFORM_REFERENCE_LINK,
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
