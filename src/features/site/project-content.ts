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
      body: "Evidence marks supported calls, rejected options, and open gaps.",
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
    title: "Architecture Readout",
    lead:
      "Workload measurements map to direct serving calls, with the boundary called out when the evidence is partial or blocked.",
    items: [
      {
        title: "Admission",
        statusLabel: "Supported",
        call: "Use bounded admission when traffic can arrive before the model is ready.",
        proof: "Queued burst and spike runs delivered 100%; direct clients dropped work.",
        tone: "success",
      },
      {
        title: "Long context",
        statusLabel: "Supported",
        call: "Set a long-context boundary before failures appear.",
        proof: "The 8192/300 run starts queueing at 1.15 req/s while delivery remains 100%.",
        tone: "success",
      },
      {
        title: "LC caps",
        statusLabel: "Rejected",
        call: "Do not use scheduler caps as the first fix for the 1.20 req/s long-context knee.",
        proof: "seqs-16, seqs-24, and batched-16384 were worse or unchanged versus baseline p95.",
        tone: "error",
      },
      {
        title: "Scheduler",
        statusLabel: "Supported",
        call: "Keep vLLM dynamic defaults for small steady and burst traffic.",
        proof: "Explicit sequence and batched-token caps under-delivered on the 512/128 matrix.",
        tone: "success",
      },
      {
        title: "Cost",
        statusLabel: "Caveated",
        call: "Treat cheap burst runs as incomplete unless latency passes.",
        proof: "Optimized batching lowers cost per useful request; burst p95 still misses the SLO.",
        tone: "info",
      },
      {
        title: "Autoscaling",
        statusLabel: "Partial",
        call: "Keep active-pressure HPA in the matrix, but do not call target 8 production-optimal.",
        proof: "All target 2/4/6/8 sweep points stayed underutilized.",
        tone: "warning",
      },
      {
        title: "KV dtype",
        statusLabel: "Rejected",
        call: "Reject FP8 KV on the current g4dn/vLLM path.",
        proof: "FP8 KV reduced delivery and tokens/sec versus the stable baseline.",
        tone: "error",
      },
      {
        title: "FP4",
        statusLabel: "Blocked",
        call: "Hold Blackwell FP4 until B200 capacity produces comparable runs.",
        proof: "The p6-b200 live attempt was blocked before a quantized artifact existed.",
        tone: "warning",
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
      "Scan-first record for turning measured runs into architecture calls.",
    readiness: {
      title: "Decision table",
      lead:
        "Each row shows the architecture call, confidence, and the shortest proof behind it.",
      items: [
        {
          state: "Supported",
          title: "Bounded admission",
          call: "Use bounded admission when requests can arrive before model readiness.",
          evidence: "100% queued delivery; direct clients dropped 237-787 iterations",
        },
        {
          state: "Supported",
          title: "Long-context boundary",
          call: "Set a concurrency or admission boundary for 8192/300 traffic.",
          evidence: "1.15 req/s starts queueing; 1.20 req/s reaches 54.35s p95",
        },
        {
          state: "Rejected",
          title: "Long-context scheduler caps",
          call: "Do not use seq caps or larger batched-token caps as the first 1.20 req/s fix.",
          evidence: "seqs-16 hit 76.24s p95; seqs-24 hit 61.36s; batched-16384 hit 55.58s",
        },
        {
          state: "Supported",
          title: "Small-request scheduler",
          call: "Keep vLLM dynamic defaults for current 512/128 steady and burst traffic.",
          evidence: "Dynamic default kept the best delivery and token throughput",
        },
        {
          state: "Supported",
          title: "Useful-work cost",
          call: "Use batching for small-request economics, but gate burst SLO claims.",
          evidence: "$0.019752/1K steady optimized; burst optimized p95 still 10.91s",
        },
        {
          state: "Partial",
          title: "Active-pressure target",
          call: "Keep active-pressure HPA testing, but do not treat target 8 as optimal.",
          evidence: "Targets 2/4/6/8 were all underutilized",
        },
        {
          state: "Rejected",
          title: "FP8 KV on g4dn",
          call: "Do not select FP8 KV for this current long-context path.",
          evidence: "47.58-69.12% delivery versus 100% baseline",
        },
        {
          state: "Blocked",
          title: "Blackwell FP4",
          call: "Hold the FP4 architecture decision until B200 results exist.",
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
        caveat: "Selected reports still need first-successful-completion timing.",
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
        title: "Scheduler cap tuning",
        call: "Reject as first fix",
        proofLabel: "1.20 req/s variants",
        proofValue: "55.58-76.24s p95",
        body:
          "Lowering max sequences or raising max batched tokens did not beat the baseline long-context edge.",
        caveat: "Use admission/backpressure before deeper scheduler-cap tuning on the current g4dn/vLLM path.",
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
      title: "Long-context knee",
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
          p95: "85.75s",
          waiting: "65 waiting / 97 active",
        },
      ],
    },
    evidenceVisuals: [
      {
        title: "Long-context knee",
        takeaway:
          "The 8192/300 workload reaches a practical edge before failures appear; waiting depth is the warning sign.",
        sourceLabel: "Local static readout from curated 8192/300 reports",
        columns: [
          {
            key: "p95",
            label: "p95 latency",
            max: 90,
            tone: "warning",
          },
          {
            key: "waiting",
            label: "Peak waiting",
            max: 70,
            tone: "info",
          },
        ],
        rows: [
          {
            label: "1.10 req/s",
            context: "clean, tail rising",
            values: {
              p95: {
                value: 21.67,
                label: "21.67s",
              },
              waiting: {
                value: 0,
                label: "0 waiting",
              },
            },
          },
          {
            label: "1.15 req/s",
            context: "queue starts",
            values: {
              p95: {
                value: 35.35,
                label: "35.35s",
              },
              waiting: {
                value: 8,
                label: "8 waiting",
              },
            },
          },
          {
            label: "1.20 req/s",
            context: "practical edge",
            values: {
              p95: {
                value: 54.35,
                label: "54.35s",
              },
              waiting: {
                value: 30,
                label: "30 waiting",
              },
            },
          },
          {
            label: "1.25 req/s",
            context: "saturation begins",
            values: {
              p95: {
                value: 85.75,
                label: "85.75s",
              },
              waiting: {
                value: 65,
                label: "65 waiting",
              },
            },
          },
        ],
      },
      {
        title: "Long-context fix attempt",
        takeaway:
          "Scheduler-cap variants did not move the 1.20 req/s knee; bounded admission made overload explicit and lowered p95.",
        sourceLabel: "Local static readout from May 15/16 KV-cache reports",
        columns: [
          {
            key: "p95",
            label: "p95 latency",
            max: 80,
            tone: "warning",
          },
          {
            key: "waiting",
            label: "Peak waiting",
            max: 70,
            tone: "info",
          },
        ],
        rows: [
          {
            label: "baseline @ 1.20",
            context: "edge: 30 waiting / 62 active",
            values: {
              p95: {
                value: 54.35,
                label: "54.35s",
              },
              waiting: {
                value: 30,
                label: "30 waiting",
              },
            },
          },
          {
            label: "seqs-16 @ 1.20",
            context: "worse: 66 waiting / 82 active",
            values: {
              p95: {
                value: 76.24,
                label: "76.24s",
              },
              waiting: {
                value: 66,
                label: "66 waiting",
              },
            },
          },
          {
            label: "seqs-24 @ 1.20",
            context: "worse: 45 waiting / 69 active",
            values: {
              p95: {
                value: 61.36,
                label: "61.36s",
              },
              waiting: {
                value: 45,
                label: "45 waiting",
              },
            },
          },
          {
            label: "batched-16384 @ 1.20",
            context: "no improvement: 31 waiting / 63 active",
            values: {
              p95: {
                value: 55.58,
                label: "55.58s",
              },
              waiting: {
                value: 31,
                label: "31 waiting",
              },
            },
          },
          {
            label: "admission-032 @ 1.25",
            context: "bounded: 52 unserved / 32 active",
            values: {
              p95: {
                value: 27.83,
                label: "27.83s",
                tone: "success",
              },
              waiting: {
                value: 0,
                label: "0 waiting",
                tone: "success",
              },
            },
          },
        ],
      },
      {
        title: "Cost per useful work",
        takeaway:
          "Batching makes small-request serving cheaper, but the burst result still needs admission or more capacity before it is latency-safe.",
        sourceLabel: "Local static readout from curated cost reports",
        columns: [
          {
            key: "cost",
            label: "Cost / 1K successful",
            max: 0.17,
            tone: "success",
          },
          {
            key: "p95",
            label: "p95 latency",
            max: 120,
            tone: "warning",
          },
        ],
        rows: [
          {
            label: "steady naive",
            context: "low useful work",
            values: {
              cost: {
                value: 0.137976,
                label: "$0.137976",
              },
              p95: {
                value: 60.31,
                label: "60.31s",
              },
            },
          },
          {
            label: "steady optimized",
            context: "SLO pass",
            values: {
              cost: {
                value: 0.019752,
                label: "$0.019752",
              },
              p95: {
                value: 1.61,
                label: "1.61s",
              },
            },
          },
          {
            label: "burst naive",
            context: "failed profile",
            values: {
              cost: {
                value: 0.164137,
                label: "$0.164137",
              },
              p95: {
                value: 120,
                label: "120.00s",
              },
            },
          },
          {
            label: "burst optimized",
            context: "cheap, SLO miss",
            values: {
              cost: {
                value: 0.012768,
                label: "$0.012768",
              },
              p95: {
                value: 10.91,
                label: "10.91s",
              },
            },
          },
        ],
      },
    ],
    sourceFacts: [
      {
        label: "Updated",
        value: "May 16, 2026 UTC",
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
