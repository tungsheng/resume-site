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
  title: "GPU Inference Decision Lab",
  lede:
    "An EKS/vLLM lab that turns serving measurements into architecture decisions for admission, autoscaling, context limits, scheduling, and quantization.",
  overviewSummary:
    "One public request path, one observable scale path, and an evidence gate that separates supported decisions from open work.",
  overviewFacts: [
    {
      label: "Platform",
      value: "AWS EKS + vLLM",
      body: "OpenAI-compatible serving on Karpenter-managed GPU nodes.",
    },
    {
      label: "Scale signal",
      value: "Prometheus -> HPA",
      body: "Serving pressure drives replica targets and pending GPU pods.",
    },
    {
      label: "Baseline",
      value: "0 serving GPUs",
      body: "Serving capacity starts from zero for cold-start proof.",
    },
    {
      label: "Workflows",
      value: "Verify / Evaluate / Experiment",
      body: "Pick the command path that matches the question.",
    },
    {
      label: "Catalog",
      value: "7 experiments",
      body:
        "Definitions for memory, latency, batching, traffic, autoscaling, cost, and quantization.",
    },
    {
      label: "Results",
      value: "Decided + open",
      body: "Evidence marks supported calls, regressions, and gaps.",
    },
  ],
  usage: {
    title: "Pick the right workflow",
    lead:
      "Verify the path, evaluate platform behavior, or run catalog experiments; each workflow feeds the decision record.",
    workflows: [
      {
        title: "Verify",
        command: "./scripts/verify",
        body:
          "Proves GPU node launch, vLLM readiness, public /v1 success, and cleanup back to zero.",
        when: "Run after ./scripts/up for a fast path check.",
        outputs: ["GPU node appears", "Public /v1 response", "Cleanup to zero"],
        href: VERIFY_SCRIPT_LINK,
      },
      {
        title: "Evaluate",
        command: "./scripts/evaluate --profile zero-idle",
        body:
          "Compares cold start, warm capacity, HPA policy, active-pressure targets, and resilience drills.",
        when: "Use for scale signals, profile choices, and target tuning.",
        outputs: ["Markdown report", "JSON report", "Decision evidence"],
        href: EVALUATE_SCRIPT_LINK,
      },
      {
        title: "Experiment",
        command: "./scripts/experiment validate",
        body:
          "Runs catalog studies for workload cases, serving profiles, metrics, and generated reports.",
        when: "Use validate/render locally; use run after ./scripts/up for live measurements.",
        outputs: ["Catalog validation", "Rendered manifests", "Generated reports"],
        href: EXPERIMENT_SCRIPT_LINK,
      },
    ],
    conceptTitle: "Decision contract",
    conceptLead:
      "Catalog experiments ask the question; evidence gates decide whether the answer is supported, rejected, or still open.",
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
    title: "Evidence gates",
    lead:
      "Generated reports are inputs; decisions are promoted only when the required fields support them.",
    items: [
      {
        title: "Supported decisions",
        body:
          "Bounded admission, the 8192/300 long-context boundary, and the g4dn FP8 KV-cache rejection are backed by measured runs.",
      },
      {
        title: "Gate criteria",
        body:
          "Each claim needs the right fields: completion, drops, p95/p99 latency, throughput, queue pressure, GPU metrics, cost, or accuracy.",
      },
      {
        title: "Open work",
        body:
          "Active-pressure targets, request-pattern utilization, cost, and Blackwell FP4 stay open until comparable results exist.",
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
      "What the EKS/vLLM evidence supports, what it rejects, and what remains open.",
    summary:
      "Portfolio-facing decision record for turning measured runs into architecture calls.",
    readiness: {
      title: "Decision readiness",
      lead:
        "Every call is labeled by its evidence state: supported, selected, rejected, pending, or blocked.",
      items: [
        {
          state: "Supported",
          title: "Bounded admission",
          body:
            "Burst and spike runs support bounded admission when traffic arrives before GPU capacity and model readiness.",
          evidence: "100% queued delivery; direct clients dropped 237-787 iterations",
        },
        {
          state: "Supported",
          title: "Long-context boundary",
          body:
            "The 8192/300 sweep supports a conservative boundary: latency and waiting depth rise before failures appear.",
          evidence: "1.15 req/s starts queueing; 1.20 req/s reaches 54.35s p95",
        },
        {
          state: "Rejected",
          title: "FP8 KV on g4dn",
          body:
            "FP8 KV variants failed the stable g4dn/vLLM path and should stay out of this workload.",
          evidence: "47.58-69.12% delivery versus 100% baseline",
        },
        {
          state: "Pending",
          title: "Active-pressure target",
          body:
            "The workflow exists; the target recommendation still needs ordered latency, queue, and DCGM comparisons.",
          evidence: "Compare/sweep reports need a complete evidence matrix",
        },
        {
          state: "Pending",
          title: "Useful-work cost",
          body:
            "Cost needs successful work, generated tokens, p95/p99 latency, failure rate, and serving cost in one matrix.",
          evidence: "Request-pattern, batching, and cost matrices remain incomplete",
        },
        {
          state: "Blocked",
          title: "Blackwell FP4",
          body:
            "The FP4 path covers BF16, plain NVFP4, and SmoothQuant, but the live p6-b200 attempt never launched a B200 node.",
          evidence: "EC2 UnfulfillableCapacity; no quantized artifact produced",
        },
      ],
    },
    decisions: [
      {
        title: "Admission model",
        call: "Bound burst traffic",
        proofLabel: "Delivery ratio",
        proofValue: "100% vs 76.98-88.14%",
        body:
          "Bounded queues kept delivery at 100% and held p95 near 2s during burst and spike-to-zero runs.",
        caveat: "Direct clients attempted more work in the same window but dropped 237-787 iterations.",
      },
      {
        title: "Cold-start bottleneck",
        call: "Optimize readiness",
        proofLabel: "Model ready",
        proofValue: "425-439s",
        body:
          "Karpenter produced a NodeClaim in 3-12s and a GPU node in 35s; image, container, and model readiness drove the wait.",
        caveat: "First successful completion still needs selected-report capture.",
      },
      {
        title: "Long-context boundary",
        call: "Gate 8192/300",
        proofLabel: "Practical edge",
        proofValue: "1.20 req/s, 54.35s p95",
        body:
          "The profile is clean at 1.10 req/s, queues at 1.15, and still delivers 100% at 1.20 while missing the latency envelope.",
        caveat: "Boundary applies to this model, GPU class, vLLM path, and 8192/300 workload.",
      },
      {
        title: "KV-cache dtype",
        call: "Reject FP8 KV here",
        proofLabel: "Delivery ratio",
        proofValue: "47.58-69.12%",
        body:
          "FP8 KV-cache variants saved little memory while regressing delivery, tail latency, and generated tokens/sec on g4dn/vLLM.",
        caveat: "Retest only with a newer vLLM image or different GPU backend.",
      },
    ],
    longContextProof: {
      title: "Long-context SLO proof",
      lead:
        "The 8192-token prompt/300-token output sweep shows why delivery ratio alone is not a serving SLO.",
      rows: [
        {
          rate: "1.10 req/s",
          outcome: "Clean, tail rising",
          delivery: "100%",
          p95: "21.67s",
          waiting: "0 waiting / 24 active",
        },
        {
          rate: "1.15 req/s",
          outcome: "Queue starts",
          delivery: "100%",
          p95: "35.35s",
          waiting: "8 waiting / 40 active",
        },
        {
          rate: "1.20 req/s",
          outcome: "Practical edge",
          delivery: "100%",
          p95: "54.35s",
          waiting: "30 waiting / 62 active",
        },
        {
          rate: "1.25 req/s",
          outcome: "Saturation",
          delivery: "100%",
          p95: "93.78s",
          waiting: "72 waiting / 104 active",
        },
      ],
    },
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
        value: "Curated decisions",
      },
    ],
  },
  workflowSectionTitle: "How serving scales",
  workflowLead:
    "Requests stay on one public path while metrics drive capacity in a separate control path.",
  workflowFoundation: {
    title: "Foundation",
    summary:
      "After ./scripts/up, ingress, observability, and GPU admission are ready while serving GPU nodes stay at zero.",
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
        "Public requests follow the same edge-to-ready-replica path.",
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
        "Serving pressure becomes custom metrics, HPA targets, pending pods, and Karpenter GPU capacity.",
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
      "New replicas join the same Service, so the public path stays stable as capacity grows.",
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
    "Bring up the platform, prove one public response, then clean it up.",
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
        "A serving GPU node launches for the workload instead of assuming capacity is already present.",
    },
    {
      title: "Public inference works",
      body:
        "The deployment reaches Ready and returns one successful public /v1 response.",
    },
    {
      title: "Cleanup returns to zero",
      body:
        "Cleanup removes the workload and confirms serving GPU node count returns to zero.",
    },
  ],
};
