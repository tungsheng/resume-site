const GPU_INFERENCE_REPO_BASE = "https://github.com/tungsheng/gpu-inference-lab/blob/main";

export type ExperimentMetricGroup = {
  label: string;
  metrics: string[];
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
};

function experimentStatus(measurement: string): ExperimentStatus {
  return {
    definition: "Definition ready",
    local: "Renderable locally",
    measurement,
    result: "Curated results pending",
  };
}

export const experimentCatalogContent = {
  title: "Experiment Catalog",
  subtitle:
    "Focused GPU inference experiments for memory pressure, streaming latency, batching, request shape, autoscaling, and cost efficiency.",
  statusNote:
    "Catalog ready; curated live results pending.",
  platformValidation: {
    slug: "platform-validation",
    title: "Platform Validation",
    category: "Platform evidence",
    status: "Measured evaluate runs",
    question:
      "Which platform posture, scaling signal, and active-pressure target are safest to recommend?",
    metricFocus: ["Cold start", "Scale-out", "Target tuning"],
    href: "/experiments/platform-validation",
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
      status: experimentStatus("Measurable with run"),
      question:
        "How does longer prompt context reduce stable concurrency and throughput?",
      cardSummary: "Prompt length versus concurrency.",
      metricFocus: ["Concurrency", "KV memory", "Tail latency"],
      summary:
        "Compares short, medium, and long prompt contexts to find where memory pressure reduces stable concurrency and throughput.",
      whyItMatters:
        "Long prompts can consume enough KV-cache memory that a GPU serving endpoint looks healthy but cannot sustain the same useful concurrency. This experiment turns that risk into an explicit run matrix.",
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
        "./scripts/experiment run --experiment kv-cache --case prompt-512-output-100 --profile default",
      ],
    },
    {
      slug: "prefill-decode",
      title: "Prefill vs Decode Timing",
      category: "Streaming latency",
      status: experimentStatus("Measurable with run-stream"),
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
    },
    {
      slug: "batching",
      title: "Batching Scheduler Tradeoffs",
      category: "Scheduler behavior",
      status: experimentStatus("Measurable with run"),
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
        "./scripts/experiment run --experiment batching --case steady-512-output-128 --profile limited-batching",
      ],
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
