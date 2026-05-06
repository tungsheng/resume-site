import { PROJECT_VALIDATION_PATH } from "./content";

const GPU_INFERENCE_REPO_BASE = "https://github.com/tungsheng/gpu-inference-lab/blob/main";

export type ExperimentMetricGroup = {
  label: string;
  metrics: string[];
};

export type ExperimentResultEvidenceRow = {
  target: string;
  outcome: string;
  p95Latency: string;
  peakWaiting: string;
  gpuMax: string;
};

export type ExperimentResultEvidenceColumns = {
  target: string;
  outcome: string;
  p95Latency: string;
  peakWaiting: string;
  gpuMax: string;
};

export type ExperimentResultEvidenceStat = {
  label: string;
  value: string;
  context: string;
};

export type ExperimentResultEvidence = {
  title: string;
  statusLabel: string;
  reportDate: string;
  summary: string;
  boundary: string;
  stats: ExperimentResultEvidenceStat[];
  rows: ExperimentResultEvidenceRow[];
  tableColumns?: ExperimentResultEvidenceColumns;
  curatedResults?: boolean;
};

export type ExperimentCase = {
  id: string;
  description: string;
  promptTokens: number;
  outputTokens: number;
};

export type ExperimentServingProfile = {
  id: string;
  description: string;
};

export type ExperimentStatus = {
  definition: string;
  local: string;
  measurement: string;
  result: string;
};

export type ExperimentCatalogItem = {
  slug: string;
  title: string;
  category: string;
  status: ExperimentStatus;
  question: string;
  cardSummary: string;
  metricFocus: string[];
  summary: string;
  whyItMatters: string;
  runner: string;
  endpoint: string;
  sourcePath: string;
  resultsPath: string;
  cases: ExperimentCase[];
  servingProfiles: ExperimentServingProfile[];
  metricGroups: ExperimentMetricGroup[];
  localCommands: string[];
  liveCommands: string[];
  resultEvidence?: ExperimentResultEvidence;
};

function experimentStatus(
  measurement: string,
  result = "Curated results pending",
): ExperimentStatus {
  return {
    definition: "Definition ready",
    local: "Renderable locally",
    measurement,
    result,
  };
}

export const experimentCatalogContent = {
  title: "Experiment Catalog",
  subtitle:
    "Focused GPU inference experiments for memory pressure, streaming latency, batching, request shape, autoscaling, and cost efficiency.",
  statusNote:
    "Catalog ready; KV-cache, batching, and streaming timing have selected measured evidence, with request-pattern, autoscaling, and cost matrices still pending.",
  platformValidation: {
    slug: "platform-validation",
    title: "Project validation",
    category: "Platform evidence",
    status: "Related project evidence",
    question:
      "Warm baseline, active-pressure scale-out, and target tuning are project rollout decisions, not catalog experiments.",
    metricFocus: ["Warm path", "Active-pressure", "Target 4"],
    summaryFacts: [
      {
        label: "First response",
        value: "93s vs 423s",
      },
      {
        label: "Replica 2",
        value: "564s vs 989s",
      },
      {
        label: "Target call",
        value: "Keep 4",
      },
    ],
    href: PROJECT_VALIDATION_PATH,
  },
  conceptLead:
    "Every experiment follows the same simple path from a serving question to a curated result.",
  conceptSteps: [
    {
      label: "Question",
      body: "Pick one practical serving question.",
    },
    {
      label: "Cases",
      body: "Define the workload shape.",
    },
    {
      label: "Serving profile",
      body: "Choose the vLLM knobs.",
    },
    {
      label: "Metrics",
      body: "Capture the signal that answers it.",
    },
    {
      label: "Result",
      body: "Promote a stable conclusion.",
    },
  ],
  experiments: [
    {
      slug: "kv-cache",
      title: "KV Cache vs Concurrency",
      category: "Memory pressure",
      status: experimentStatus("Measurable with run", "Measured knee refinement"),
      question:
        "How does longer prompt context reduce stable concurrency and throughput?",
      cardSummary: "Long-context capacity knee.",
      metricFocus: ["Concurrency", "KV memory", "Tail latency"],
      summary:
        "Compares short, medium, and long prompt contexts, then uses an 8192-token sweep to find where long-context serving begins to queue.",
      whyItMatters:
        "Long prompts can make a GPU serving endpoint look healthy until arrival rate crosses a narrow operating boundary. The latest sweep turns that risk into measured latency, queue depth, and GPU-utilization evidence.",
      runner: "k6 completion load",
      endpoint: "/v1/completions",
      sourcePath: "experiments/kv-cache/",
      resultsPath: "experiments/kv-cache/results.md",
      cases: [
        {
          id: "prompt-512-output-100",
          promptTokens: 512,
          outputTokens: 100,
          description: "short prompt baseline",
        },
        {
          id: "prompt-2048-output-200",
          promptTokens: 2048,
          outputTokens: 200,
          description: "medium prompt pressure",
        },
        {
          id: "prompt-8192-output-300",
          promptTokens: 8192,
          outputTokens: 300,
          description: "long prompt KV-cache pressure",
        },
      ],
      servingProfiles: [
        {
          id: "default",
          description: "default checked-in serving profile",
        },
        {
          id: "long-context",
          description: "8k context profile for KV-cache pressure tests",
        },
      ],
      metricGroups: [
        {
          label: "Concurrency",
          metrics: ["max stable concurrency", "request failures", "OOM events"],
        },
        {
          label: "Latency and throughput",
          metrics: ["p95 request latency", "p99 request latency", "requests/sec", "generation tokens/sec"],
        },
        {
          label: "GPU memory",
          metrics: ["average GPU utilization", "max GPU utilization", "GPU memory used", "GPU memory free"],
        },
      ],
      localCommands: [
        "./scripts/experiment show kv-cache",
        "./scripts/experiment render-load --experiment kv-cache --case prompt-512-output-100",
        "./scripts/experiment render-serving --experiment kv-cache --profile long-context",
      ],
      liveCommands: [
        "./scripts/experiment run --experiment kv-cache --case prompt-8192-output-300-rate-115 --profile long-context",
      ],
      resultEvidence: {
        title: "Long-context capacity knee",
        statusLabel: "Measured knee refinement",
        reportDate: "2026-05-04",
        summary:
          "For 8192-token prompts with 300 generated tokens, the latest sweep narrows the single-replica long-context capacity knee to the 1.10-1.15 req/s band.",
        boundary:
          "Repeat runs and scheduler/admission-control variants are still pending, so treat the boundary as a measured operating band rather than a final universal limit.",
        stats: [
          {
            label: "Clean through",
            value: "1.10 req/s",
            context: "0 waiting requests; p95 28.20s",
          },
          {
            label: "Queue starts",
            value: "1.15 req/s",
            context: "20 waiting requests; p95 46.68s",
          },
          {
            label: "Saturation grows",
            value: "1.20 req/s",
            context: "33 waiting requests; p95 56.96s",
          },
        ],
        rows: [
          {
            target: "0.75 req/s",
            outcome: "stable",
            p95Latency: "6.61s",
            peakWaiting: "0",
            gpuMax: "96%",
          },
          {
            target: "1.00 req/s",
            outcome: "stable but slower",
            p95Latency: "11.91s",
            peakWaiting: "0",
            gpuMax: "93%",
          },
          {
            target: "1.05 req/s",
            outcome: "clean but slower",
            p95Latency: "16.83s",
            peakWaiting: "0",
            gpuMax: "100%",
          },
          {
            target: "1.10 req/s",
            outcome: "clean with rising tail",
            p95Latency: "28.20s",
            peakWaiting: "0",
            gpuMax: "100%",
          },
          {
            target: "1.15 req/s",
            outcome: "queue starts",
            p95Latency: "46.68s",
            peakWaiting: "20",
            gpuMax: "100%",
          },
          {
            target: "1.20 req/s",
            outcome: "saturation grows",
            p95Latency: "56.96s",
            peakWaiting: "33",
            gpuMax: "100%",
          },
          {
            target: "1.25 req/s",
            outcome: "saturation is obvious",
            p95Latency: "85.75s",
            peakWaiting: "65",
            gpuMax: "100%",
          },
          {
            target: "1.50 req/s",
            outcome: "overloaded",
            p95Latency: "180.27s",
            peakWaiting: "181",
            gpuMax: "100%",
          },
        ],
      },
    },
    {
      slug: "prefill-decode",
      title: "Prefill vs Decode Timing",
      category: "Streaming latency",
      status: experimentStatus("Measurable with run-stream", "Measured streaming split"),
      question:
        "How do prompt-heavy and decode-heavy requests shift TTFT and inter-token timing?",
      cardSummary: "Streaming timing by request shape.",
      metricFocus: ["TTFT", "Inter-token latency", "Throughput"],
      summary:
        "Uses a streaming client to separate time to first token from inter-token latency across prompt-heavy and decode-heavy shapes.",
      whyItMatters:
        "Two requests can have similar total duration but stress different serving phases. Separating prefill from decode makes streaming user experience easier to reason about.",
      runner: "Python streaming client",
      endpoint: "/v1/completions",
      sourcePath: "experiments/prefill-decode/",
      resultsPath: "experiments/prefill-decode/results.md",
      cases: [
        {
          id: "prefill-heavy",
          promptTokens: 1536,
          outputTokens: 64,
          description: "long prompt short output",
        },
        {
          id: "decode-heavy",
          promptTokens: 128,
          outputTokens: 768,
          description: "short prompt long output",
        },
      ],
      servingProfiles: [
        {
          id: "default",
          description: "default checked-in serving profile",
        },
      ],
      metricGroups: [
        {
          label: "Streaming latency",
          metrics: ["p50 TTFT", "p95 TTFT", "p50 inter-token latency", "p95 inter-token latency"],
        },
        {
          label: "Request latency",
          metrics: ["p95 request latency", "p99 request latency", "generation tokens/sec"],
        },
        {
          label: "GPU",
          metrics: ["average GPU utilization", "max GPU utilization"],
        },
      ],
      localCommands: [
        "./scripts/experiment show prefill-decode",
        "./scripts/experiment render-stream --experiment prefill-decode --case prefill-heavy",
        "./scripts/experiment render-report --experiment prefill-decode --case decode-heavy --profile default",
      ],
      liveCommands: [
        "./scripts/experiment run-stream --experiment prefill-decode --case prefill-heavy --profile default --samples 5",
      ],
      resultEvidence: {
        title: "Prompt prefill vs decode timing",
        statusLabel: "Measured streaming split",
        reportDate: "2026-05-06",
        summary:
          "Streaming runs separate prompt-heavy TTFT from decode-heavy total latency on the default vLLM profile.",
        boundary:
          "The selected reports cover one default-profile pair at concurrency 16, so use them as a clear shape comparison rather than a full streaming capacity envelope.",
        curatedResults: false,
        tableColumns: {
          target: "Case",
          outcome: "Timing split",
          p95Latency: "p95 total",
          peakWaiting: "p95 TTFT",
          gpuMax: "GPU max",
        },
        stats: [
          {
            label: "Prefill-heavy TTFT",
            value: "1.37s p95",
            context: "1536-token prompt, 64-token output",
          },
          {
            label: "Decode-heavy TTFT",
            value: "149 ms p95",
            context: "128-token prompt, 768-token output",
          },
          {
            label: "Decode-heavy total",
            value: "8.41s p95",
            context: "Longer output dominates total latency",
          },
        ],
        rows: [
          {
            target: "prefill-heavy",
            outcome: "Longer TTFT, short total",
            p95Latency: "2.24s",
            peakWaiting: "1.37s",
            gpuMax: "95%",
          },
          {
            target: "decode-heavy",
            outcome: "Fast TTFT, longer total",
            p95Latency: "8.41s",
            peakWaiting: "149 ms",
            gpuMax: "84%",
          },
        ],
      },
    },
    {
      slug: "batching",
      title: "Batching Scheduler Tradeoffs",
      category: "Scheduler behavior",
      status: experimentStatus("Measurable with run", "Measured scheduler compare"),
      question:
        "How do vLLM scheduler limits trade throughput for p95/p99 latency?",
      cardSummary: "Scheduler limits versus tail latency.",
      metricFocus: ["Batching", "p99 latency", "Tokens/sec"],
      summary:
        "Compares constrained, limited, and default vLLM scheduler settings under steady and burst traffic.",
      whyItMatters:
        "Batching can improve useful work per GPU, but the same knobs can also stretch p95 and p99 latency. This experiment makes that tradeoff visible.",
      runner: "k6 completion load",
      endpoint: "/v1/completions",
      sourcePath: "experiments/batching/",
      resultsPath: "experiments/batching/results.md",
      cases: [
        {
          id: "steady-512-output-128",
          promptTokens: 512,
          outputTokens: 128,
          description: "steady homogeneous requests for scheduler profile comparison",
        },
        {
          id: "burst-512-output-128",
          promptTokens: 512,
          outputTokens: 128,
          description: "burst traffic to expose queueing and p99 latency",
        },
      ],
      servingProfiles: [
        {
          id: "constrained-scheduler",
          description: "one active sequence with a minimal batched-token budget",
        },
        {
          id: "limited-batching",
          description: "moderate sequence and batched-token limits",
        },
        {
          id: "dynamic-default",
          description: "vLLM default dynamic scheduler settings",
        },
      ],
      metricGroups: [
        {
          label: "Latency",
          metrics: ["p50 request latency", "p95 request latency", "p99 request latency", "p50 TTFT", "p95 TTFT"],
        },
        {
          label: "Serving",
          metrics: ["requests/sec", "generation tokens/sec", "peak waiting requests", "peak running requests", "peak active requests"],
        },
        {
          label: "Cost",
          metrics: ["cost per 1K successful requests", "cost per 1M generated tokens"],
        },
      ],
      localCommands: [
        "./scripts/experiment show batching",
        "./scripts/experiment render-load --experiment batching --case steady-512-output-128",
        "./scripts/experiment render-serving --experiment batching --profile limited-batching",
      ],
      liveCommands: [
        "./scripts/experiment run --experiment batching --case steady-512-output-128 --profile dynamic-default",
      ],
      resultEvidence: {
        title: "Scheduler limits under steady load",
        statusLabel: "Measured scheduler compare",
        reportDate: "2026-05-06",
        summary:
          "For the steady 512/128 workload at an 8 req/s target, the vLLM dynamic-default scheduler delivered the full run with low tail latency while tighter sequence caps forced queueing and dropped work.",
        boundary:
          "The selected matrix covers one steady workload. Burst and mixed-shape cases should be measured before claiming a universal scheduler policy.",
        curatedResults: false,
        tableColumns: {
          target: "Profile",
          outcome: "Outcome",
          p95Latency: "p95 latency",
          peakWaiting: "Delivery",
          gpuMax: "GPU max",
        },
        stats: [
          {
            label: "Dynamic default",
            value: "7.41 req/s",
            context: "2669/2669 delivered; p95 1.66s",
          },
          {
            label: "Limited batching",
            value: "80.1% delivered",
            context: "531 unserved iterations; p95 10.55s",
          },
          {
            label: "Constrained",
            value: "15.6% delivered",
            context: "2253 unserved iterations; p95 59.72s",
          },
        ],
        rows: [
          {
            target: "dynamic-default",
            outcome: "Full delivery, no waiting",
            p95Latency: "1.66s",
            peakWaiting: "100%",
            gpuMax: "85%",
          },
          {
            target: "limited-batching",
            outcome: "Queueing and dropped work",
            p95Latency: "10.55s",
            peakWaiting: "80.1%",
            gpuMax: "85%",
          },
          {
            target: "constrained-scheduler",
            outcome: "Severe underdelivery",
            p95Latency: "59.72s",
            peakWaiting: "15.6%",
            gpuMax: "88%",
          },
        ],
      },
    },
    {
      slug: "request-patterns",
      title: "Request Pattern Utilization",
      category: "Traffic shape",
      status: experimentStatus("Measurable with run"),
      question:
        "How do steady, burst, uneven-size, and spike-to-zero traffic patterns affect GPU occupancy?",
      cardSummary: "Traffic shape versus GPU occupancy.",
      metricFocus: ["Utilization", "Queue depth", "Request mix"],
      summary:
        "Runs several traffic shapes against the same serving profile before changing scheduler or autoscaling settings.",
      whyItMatters:
        "Average load hides the real operating problem. This experiment shows whether utilization dips and tail-latency spikes come from traffic shape rather than raw capacity.",
      runner: "k6 completion load",
      endpoint: "/v1/completions",
      sourcePath: "experiments/request-patterns/",
      resultsPath: "experiments/request-patterns/results.md",
      cases: [
        {
          id: "steady-small",
          promptTokens: 512,
          outputTokens: 128,
          description: "steady homogeneous traffic for utilization baseline",
        },
        {
          id: "burst-small",
          promptTokens: 512,
          outputTokens: 128,
          description: "short burst that stresses queueing and tail latency",
        },
        {
          id: "uneven-size-mix",
          promptTokens: 1536,
          outputTokens: 512,
          description: "weighted mix of short, medium, and long requests",
        },
        {
          id: "spike-to-zero",
          promptTokens: 512,
          outputTokens: 128,
          description: "rapid spike followed by scale-to-zero pressure",
        },
      ],
      servingProfiles: [
        {
          id: "default",
          description: "default checked-in serving profile for traffic pattern comparison",
        },
      ],
      metricGroups: [
        {
          label: "Latency",
          metrics: ["p50 request latency", "p95 request latency", "p99 request latency"],
        },
        {
          label: "Serving",
          metrics: ["requests/sec", "generation tokens/sec", "peak waiting requests", "peak running requests", "peak active requests"],
        },
        {
          label: "GPU and cost",
          metrics: ["average GPU utilization", "max GPU utilization", "cost per 1K successful requests", "cost per 1M generated tokens"],
        },
      ],
      localCommands: [
        "./scripts/experiment show request-patterns",
        "./scripts/experiment render-load --experiment request-patterns --case uneven-size-mix",
      ],
      liveCommands: [
        "./scripts/experiment run --experiment request-patterns --case steady-small --profile default",
      ],
    },
    {
      slug: "autoscaling",
      title: "Autoscaling and Queueing Behavior",
      category: "Capacity response",
      status: experimentStatus("Measurable with run"),
      question:
        "How much traffic must be buffered while GPU capacity and model readiness catch up?",
      cardSummary: "Burst arrival versus capacity readiness.",
      metricFocus: ["Provisioning", "Queueing", "Dropped work"],
      summary:
        "Compares direct and bounded-queue client policies during burst and spike-to-zero traffic while capacity catches up.",
      whyItMatters:
        "Autoscaling is not only a replica count. The user-visible cost is the queue and failure behavior between the burst arriving and the model becoming ready.",
      runner: "k6 completion load",
      endpoint: "/v1/completions",
      sourcePath: "experiments/autoscaling/",
      resultsPath: "experiments/autoscaling/results.md",
      cases: [
        {
          id: "burst-direct",
          promptTokens: 512,
          outputTokens: 128,
          description: "open-loop overloaded burst that exposes request drops while capacity scales",
        },
        {
          id: "burst-queued",
          promptTokens: 512,
          outputTokens: 128,
          description: "closed-loop burst that approximates bounded client backpressure",
        },
        {
          id: "spike-direct",
          promptTokens: 512,
          outputTokens: 128,
          description: "open-loop spike to zero for provisioning and cooldown timing",
        },
        {
          id: "spike-queued",
          promptTokens: 512,
          outputTokens: 128,
          description: "closed-loop spike to zero with bounded queued admission",
        },
      ],
      servingProfiles: [
        {
          id: "default",
          description: "default checked-in serving profile for autoscaling comparisons",
        },
      ],
      metricGroups: [
        {
          label: "Scaling",
          metrics: ["first NodeClaim", "first GPU node", "pod scheduled", "container started", "model ready", "first successful completion"],
        },
        {
          label: "Queueing",
          metrics: ["dropped iterations", "buffering required", "failure attribution", "peak active requests"],
        },
        {
          label: "Latency and GPU",
          metrics: ["p95 request latency", "p99 request latency", "average GPU utilization", "max GPU utilization"],
        },
      ],
      localCommands: [
        "./scripts/experiment show autoscaling",
        "./scripts/experiment render-load --experiment autoscaling --case burst-queued",
      ],
      liveCommands: [
        "./scripts/experiment run --experiment autoscaling --case burst-queued --profile default",
      ],
    },
    {
      slug: "cost",
      title: "Cost per Useful Work",
      category: "Cost efficiency",
      status: experimentStatus("Measurable with run"),
      question:
        "How much cheaper does the same GPU become when concurrency and batching produce more successful work?",
      cardSummary: "Serving cost tied to successful work.",
      metricFocus: ["Cost/request", "Cost/token", "SLO pass"],
      summary:
        "Compares naive and optimized serving profiles under steady and burst workloads with cost denominators tied to successful work.",
      whyItMatters:
        "A cheaper run is not actually cheaper if it drops useful work or blows past latency goals. This experiment keeps cost tied to successful requests and generated tokens.",
      runner: "k6 completion load",
      endpoint: "/v1/completions",
      sourcePath: "experiments/cost/",
      resultsPath: "experiments/cost/results.md",
      cases: [
        {
          id: "steady-cost-efficiency",
          promptTokens: 512,
          outputTokens: 128,
          description: "steady workload for comparing useful work per serving dollar",
        },
        {
          id: "burst-cost-efficiency",
          promptTokens: 512,
          outputTokens: 128,
          description: "burst workload for comparing cost efficiency under tail-latency pressure",
        },
      ],
      servingProfiles: [
        {
          id: "naive-single",
          description: "one active sequence reference profile for low useful work per GPU",
        },
        {
          id: "optimized-batched",
          description: "higher sequence and batched-token limits for better useful work per GPU",
        },
      ],
      metricGroups: [
        {
          label: "Useful work",
          metrics: ["completed requests", "successful requests", "generated tokens", "requests/sec", "generation tokens/sec"],
        },
        {
          label: "Cost",
          metrics: ["estimated burst cost", "cost per 1K successful requests", "cost per 1M generated tokens"],
        },
        {
          label: "SLO",
          metrics: ["p95 request latency", "p99 request latency", "SLO passed"],
        },
      ],
      localCommands: [
        "./scripts/experiment show cost",
        "./scripts/experiment render-report --experiment cost --case steady-cost-efficiency --profile optimized-batched",
      ],
      liveCommands: [
        "./scripts/experiment run --experiment cost --case steady-cost-efficiency --profile optimized-batched",
      ],
    },
  ] satisfies ExperimentCatalogItem[],
};

export function experimentDetailPath(slug: string): string {
  return `/experiments/${slug}`;
}

export function experimentSourceLink(path: string): string {
  return `${GPU_INFERENCE_REPO_BASE}/${path}`;
}

export function getExperimentBySlug(slug: string): ExperimentCatalogItem | undefined {
  return experimentCatalogContent.experiments.find((item) => item.slug === slug);
}
