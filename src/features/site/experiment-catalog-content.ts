import { PROJECT_VALIDATION_PATH } from "./content";

const GPU_INFERENCE_REPO_BASE = "https://github.com/tungsheng/gpu-inference-lab/blob/main";

type ExperimentMetricGroup = {
  label: string;
  metrics: string[];
};

type ExperimentResultEvidenceRow = {
  target: string;
  outcome: string;
  p95Latency: string;
  peakWaiting: string;
  gpuMax: string;
};

type ExperimentResultEvidenceColumns = {
  target: string;
  outcome: string;
  p95Latency: string;
  peakWaiting: string;
  gpuMax: string;
};

export type ExperimentResultEvidenceTable = {
  title: string;
  summary?: string;
  columns?: ExperimentResultEvidenceColumns;
  rows: ExperimentResultEvidenceRow[];
};

type ExperimentResultEvidenceStat = {
  label: string;
  value: string;
  context: string;
};

type ExperimentSourceReport = {
  label: string;
  path: string;
};

type ExperimentResultEvidence = {
  title: string;
  statusLabel: string;
  reportDate: string;
  summary: string;
  boundary: string;
  stats: ExperimentResultEvidenceStat[];
  rows?: ExperimentResultEvidenceRow[];
  tableColumns?: ExperimentResultEvidenceColumns;
  tables?: ExperimentResultEvidenceTable[];
  boundaryPoints?: string[];
  sourceReports?: ExperimentSourceReport[];
  curatedResults?: boolean;
};

type ExperimentCase = {
  id: string;
  description: string;
  promptTokens: number;
  outputTokens: number;
};

type ExperimentServingProfile = {
  id: string;
  description: string;
};

type ExperimentStatus = {
  definition: string;
  local: string;
  measurement: string;
  result: string;
};

export type ExperimentReadinessTone = "supported" | "selected" | "rejected" | "pending" | "blocked";

export type ExperimentReadinessSignal = {
  label: string;
  detail: string;
  tone: ExperimentReadinessTone;
};

type ExperimentReadiness = {
  primary: ExperimentReadinessSignal;
  secondary?: ExperimentReadinessSignal;
};

export type ExperimentCatalogItem = {
  slug: string;
  title: string;
  category: string;
  status: ExperimentStatus;
  readiness: ExperimentReadiness;
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
  pendingNextRuns?: {
    label: string;
    command: string;
    reason: string;
  }[];
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
    "Focused experiments for memory pressure, streaming latency, batching, traffic shape, autoscaling, cost, and quantization.",
  statusNote:
    "Rows show whether each experiment is supported, selected, rejected, pending, or blocked.",
  platformValidation: {
    status: "Related project evidence",
    question:
      "Admission, cold start, long context, FP8 KV cache, and Blackwell FP4 readiness are architecture decisions, not catalog entries.",
    href: PROJECT_VALIDATION_PATH,
  },
  conceptLead:
    "Each experiment moves from a serving question to a run shape, metrics, and a promoted result.",
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
      readiness: {
        primary: {
          label: "Supported",
          detail: "Long-context knee",
          tone: "supported",
        },
        secondary: {
          label: "Rejected",
          detail: "FP8 KV on g4dn",
          tone: "rejected",
        },
      },
      question:
        "How does longer prompt context change concurrency and throughput?",
      cardSummary: "Full delivery can hide queueing.",
      metricFocus: ["Concurrency", "KV memory", "Tail latency"],
      summary:
        "Compares prompt lengths, then sweeps an 8192-token workload to find where serving starts to queue.",
      whyItMatters:
        "Long prompts can look healthy until arrival rate crosses a narrow boundary. The May 13 sweep turns that risk into latency, queue depth, and GPU-utilization evidence.",
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
        {
          id: "long-context-seqs-24",
          description: "reduced sequence cap for long-context knee comparison",
        },
        {
          id: "long-context-seqs-16",
          description: "more conservative sequence cap that tested delivery tradeoffs",
        },
        {
          id: "long-context-batched-16384",
          description: "larger batched-token budget for long-context prefill comparison",
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
        "./scripts/experiment run --experiment kv-cache --case prompt-8192-output-300-rate-120 --profile long-context",
      ],
      resultEvidence: {
        title: "Full delivery is not enough",
        statusLabel: "Measured knee refinement",
        reportDate: "2026-05-13",
        summary:
          "With 8192-token prompts and 300 generated tokens, the sweep stays clean through 1.10 req/s, queues at 1.15, and hits an operational edge at 1.20 even with 100% delivery.",
        boundary:
          "Treat this as an operating band for one model, GPU class, vLLM image, and 8192/300 workload. The reports include offered, unserved, queue, delivery, GPU, and memory fields; repeat runs and admission comparisons are still needed before a universal policy.",
        boundaryPoints: [
          "At 1.20 req/s, the profile delivered 100% of offered work with zero failures, drops, or interruptions, but p95 still reached 54.35s.",
          "The scheduler hit 32 running requests while waiting depth climbed from 0 at 1.10 req/s to 8 at 1.15 and 30 at 1.20.",
          "Profile variants remain useful follow-ups; the May 13 direct-profile sweep is the freshest baseline.",
        ],
        stats: [
          {
            label: "Clean through",
            value: "1.10 req/s",
            context: "0 waiting requests; p95 21.67s",
          },
          {
            label: "Queue starts",
            value: "1.15 req/s",
            context: "8 waiting requests; p95 35.35s",
          },
          {
            label: "Practical edge",
            value: "1.20 req/s",
            context: "100% delivered; p95 54.35s; 30 waiting",
          },
        ],
        sourceReports: [
          {
            label: "1.05 req/s report",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-105-long-context-20260513-165340.md",
          },
          {
            label: "1.10 req/s report",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-110-long-context-20260513-171317.md",
          },
          {
            label: "1.15 req/s report",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-115-long-context-20260513-172605.md",
          },
          {
            label: "1.20 req/s report",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-120-long-context-20260513-173923.md",
          },
        ],
        tables: [
          {
            title: "8192/300 rate sweep",
            summary:
              "The default long-context profile still completes every request at 1.20 req/s, but waiting depth and p95 make that point an operational edge.",
            rows: [
              {
                target: "0.75 req/s",
                outcome: "stable",
                p95Latency: "6.61s",
                peakWaiting: "0 waiting / 5 active",
                gpuMax: "96%",
              },
              {
                target: "1.00 req/s",
                outcome: "stable but slower",
                p95Latency: "11.92s",
                peakWaiting: "0 waiting / 12 active",
                gpuMax: "100%",
              },
              {
                target: "1.05 req/s",
                outcome: "clean but slower",
                p95Latency: "14.31s",
                peakWaiting: "0 waiting / 16 active",
                gpuMax: "100%",
              },
              {
                target: "1.10 req/s",
                outcome: "clean with rising tail",
                p95Latency: "21.67s",
                peakWaiting: "0 waiting / 24 active",
                gpuMax: "100%",
              },
              {
                target: "1.15 req/s",
                outcome: "queue starts",
                p95Latency: "35.35s",
                peakWaiting: "8 waiting / 40 active",
                gpuMax: "100%",
              },
              {
                target: "1.20 req/s",
                outcome: "practical edge",
                p95Latency: "54.35s",
                peakWaiting: "30 waiting / 62 active",
                gpuMax: "100%",
              },
              {
                target: "1.25 req/s",
                outcome: "saturation is obvious",
                p95Latency: "93.78s",
                peakWaiting: "72 waiting / 104 active",
                gpuMax: "100%",
              },
              {
                target: "1.50 req/s",
                outcome: "overloaded",
                p95Latency: "180.27s",
                peakWaiting: "181 waiting / 213 active",
                gpuMax: "100%",
              },
            ],
          },
          {
            title: "Profile variants near the knee",
            summary:
              "Follow-up runs show that a moderate sequence cap can reduce tail latency at 1.15 req/s, while a smaller cap under-delivers.",
            columns: {
              target: "Profile / run",
              outcome: "Outcome",
              p95Latency: "p95 latency",
              peakWaiting: "Waiting / active",
              gpuMax: "GPU max",
            },
            rows: [
              {
                target: "long-context @ 1.15",
                outcome: "baseline queue start",
                p95Latency: "46.68s",
                peakWaiting: "20 waiting / 52 active",
                gpuMax: "100%",
              },
              {
                target: "batched-16384 @ 1.15",
                outcome: "no material gain",
                p95Latency: "46.58s",
                peakWaiting: "20 waiting / 52 active",
                gpuMax: "100%",
              },
              {
                target: "seqs-24 @ 1.15",
                outcome: "lower tail latency",
                p95Latency: "40.57s",
                peakWaiting: "22 waiting / 46 active",
                gpuMax: "100%",
              },
              {
                target: "seqs-16 @ 1.15",
                outcome: "97.4% delivered",
                p95Latency: "99.12s",
                peakWaiting: "83 waiting / 99 active",
                gpuMax: "100%",
              },
              {
                target: "seqs-24 @ 1.20",
                outcome: "saturation returns",
                p95Latency: "62.90s",
                peakWaiting: "47 waiting / 71 active",
                gpuMax: "100%",
              },
            ],
          },
        ],
      },
    },
    {
      slug: "prefill-decode",
      title: "Prefill vs Decode Timing",
      category: "Streaming latency",
      status: experimentStatus("Measurable with run-stream", "Measured streaming split"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "Streaming split",
          tone: "selected",
        },
      },
      question:
        "How do prompt-heavy and decode-heavy requests change TTFT and inter-token timing?",
      cardSummary: "Streaming timing by request shape.",
      metricFocus: ["TTFT", "Inter-token latency", "Throughput"],
      summary:
        "Uses a streaming client to separate time to first token from inter-token latency across prompt-heavy and decode-heavy shapes.",
      whyItMatters:
        "Similar total durations can stress different serving phases. Splitting prefill from decode makes streaming UX easier to reason about.",
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
        {
          id: "mixed-prefill-decode",
          promptTokens: 1536,
          outputTokens: 768,
          description: "50/50 streamed mix of prompt-heavy and decode-heavy requests",
        },
      ],
      servingProfiles: [
        {
          id: "default",
          description: "default checked-in serving profile",
        },
        {
          id: "max-seqs-16",
          description: "sequence cap for mixed streaming comparison",
        },
        {
          id: "max-seqs-8",
          description: "smaller active-set cap for mixed streaming comparison",
        },
        {
          id: "batched-tokens-4096",
          description: "batched-token cap without a sequence-count cap",
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
        "./scripts/experiment run-stream --experiment prefill-decode --case mixed-prefill-decode --profile default --samples 640 --concurrency 24",
      ],
      resultEvidence: {
        title: "Mixed streaming shape split",
        statusLabel: "Measured streaming split",
        reportDate: "2026-05-06",
        summary:
          "The mixed streaming run completed 640 requests at concurrency 24, split by prefill-heavy versus decode-heavy shapes.",
        boundary:
          "The mixed run is the best page-level evidence because it exercises both shapes together. Isolated runs are baselines; max-seqs and batched-token variants still need a curated conclusion.",
        boundaryPoints: [
          "The mixed default run had 1 peak waiting request at 24 active streams and 93% max GPU utilization.",
          "The max-seqs-8 and batched-tokens-4096 variants produced much worse p99 latency in the 640-sample comparison.",
          "Cost and SLO fields were not collected for these streaming reports.",
        ],
        curatedResults: false,
        stats: [
          {
            label: "Mixed run",
            value: "12.52s p95",
            context: "640 streamed requests at concurrency 24",
          },
          {
            label: "Prefill shape",
            value: "1.52s p95",
            context: "303 mixed-run requests; p95 TTFT 495 ms",
          },
          {
            label: "Decode shape",
            value: "12.79s p95",
            context: "337 mixed-run requests; p95 TTFT 443 ms",
          },
        ],
        sourceReports: [
          {
            label: "Mixed run report",
            path: "docs/reports/experiment-prefill-decode-mixed-prefill-decode-default-20260506-173400.md",
          },
          {
            label: "Prefill isolated report",
            path: "docs/reports/experiment-prefill-decode-prefill-heavy-default-20260506-110543.md",
          },
          {
            label: "Decode isolated report",
            path: "docs/reports/experiment-prefill-decode-decode-heavy-default-20260506-111546.md",
          },
        ],
        tables: [
          {
            title: "Mixed run shape split",
            summary:
              "The mixed result hides two latency profiles: prefill-heavy requests finish quickly, while decode-heavy requests dominate total latency.",
            columns: {
              target: "Shape",
              outcome: "Completed",
              p95Latency: "p95 total",
              peakWaiting: "p95 TTFT",
              gpuMax: "Tokens/sec",
            },
            rows: [
              {
                target: "prefill-heavy",
                outcome: "303 completed",
                p95Latency: "1.52s",
                peakWaiting: "495 ms",
                gpuMax: "69.03",
              },
              {
                target: "decode-heavy",
                outcome: "337 completed",
                p95Latency: "12.79s",
                peakWaiting: "443 ms",
                gpuMax: "66.97",
              },
            ],
          },
          {
            title: "Isolated shape baseline",
            summary:
              "The isolated concurrency-16 runs show the single-shape TTFT and total-latency contrast before mixed-workload interference.",
            columns: {
              target: "Case",
              outcome: "Timing split",
              p95Latency: "p95 total",
              peakWaiting: "p95 TTFT",
              gpuMax: "GPU max",
            },
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
          {
            title: "Mixed profile follow-up",
            summary:
              "The profile variants show that capping sequence count or batched tokens did not improve the mixed-shape envelope.",
            columns: {
              target: "Profile",
              outcome: "Run shape",
              p95Latency: "p95 total",
              peakWaiting: "p99 total",
              gpuMax: "GPU max",
            },
            rows: [
              {
                target: "default",
                outcome: "640 samples / 24 concurrency",
                p95Latency: "12.52s",
                peakWaiting: "12.93s",
                gpuMax: "93%",
              },
              {
                target: "max-seqs-16",
                outcome: "640 samples / 32 concurrency",
                p95Latency: "17.56s",
                peakWaiting: "18.57s",
                gpuMax: "97%",
              },
              {
                target: "max-seqs-8",
                outcome: "640 samples / 32 concurrency",
                p95Latency: "29.88s",
                peakWaiting: "133.64s",
                gpuMax: "90%",
              },
              {
                target: "batched-tokens-4096",
                outcome: "640 samples / 32 concurrency",
                p95Latency: "20.89s",
                peakWaiting: "125.51s",
                gpuMax: "91%",
              },
            ],
          },
        ],
      },
    },
    {
      slug: "batching",
      title: "Batching Scheduler Tradeoffs",
      category: "Scheduler behavior",
      status: experimentStatus("Measurable with run", "Measured scheduler compare"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "Scheduler compare",
          tone: "selected",
        },
      },
      question:
        "How do vLLM scheduler limits trade throughput for p95/p99 latency?",
      cardSummary: "Scheduler limits versus tail latency.",
      metricFocus: ["Batching", "p99 latency", "Tokens/sec"],
      summary:
        "Compares constrained, limited, and default vLLM scheduler settings under steady and burst traffic.",
      whyItMatters:
        "Scheduler knobs can improve useful work per GPU or stretch p95/p99 latency. This experiment makes the tradeoff visible.",
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
          "At 8 req/s on the steady 512/128 workload, vLLM dynamic-default delivered the full run with low tail latency; tighter caps queued and dropped work.",
        boundary:
          "The selected matrix covers one steady workload. Burst and mixed-shape cases are needed before a general scheduler policy; checked-in results.md still contains template text.",
        boundaryPoints: [
          "Generated reports under docs/reports contain the selected evidence even though experiments/batching/results.md still says no curated run.",
          "Dynamic-default means vLLM's default scheduler settings, not disabled batching.",
          "Cost denominators are unavailable for this scheduler comparison.",
        ],
        curatedResults: false,
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
        sourceReports: [
          {
            label: "Dynamic default report",
            path: "docs/reports/experiment-batching-steady-512-output-128-dynamic-default-20260505-232357.md",
          },
          {
            label: "Limited batching report",
            path: "docs/reports/experiment-batching-steady-512-output-128-limited-batching-20260505-233925.md",
          },
          {
            label: "Constrained report",
            path: "docs/reports/experiment-batching-steady-512-output-128-constrained-scheduler-20260505-235019.md",
          },
        ],
        tables: [
          {
            title: "Steady scheduler profile comparison",
            summary:
              "All three reports use the same steady 512/128 workload, making the scheduler limit tradeoff easy to compare.",
            columns: {
              target: "Profile",
              outcome: "Outcome",
              p95Latency: "p95 latency",
              peakWaiting: "Delivery",
              gpuMax: "GPU max",
            },
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
        ],
      },
    },
    {
      slug: "request-patterns",
      title: "Request Pattern Utilization",
      category: "Traffic shape",
      status: experimentStatus("Measurable with run"),
      readiness: {
        primary: {
          label: "Pending",
          detail: "Matrix pending",
          tone: "pending",
        },
      },
      question:
        "How do steady, burst, uneven-size, and spike-to-zero traffic patterns affect GPU occupancy?",
      cardSummary: "Traffic shape versus GPU occupancy.",
      metricFocus: ["Utilization", "Queue depth", "Request mix"],
      summary:
        "Runs traffic shapes against the same serving profile before changing scheduler or autoscaling settings.",
      whyItMatters:
        "Average load can hide the operating problem. This experiment shows whether utilization dips and tail spikes come from traffic shape rather than raw capacity.",
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
      pendingNextRuns: [
        {
          label: "Steady baseline",
          command: "./scripts/experiment run --experiment request-patterns --case steady-small --profile default",
          reason: "Establish default occupancy and latency before interpreting burst or mixed traffic.",
        },
        {
          label: "Burst pressure",
          command: "./scripts/experiment run --experiment request-patterns --case burst-small --profile default",
          reason: "Measure whether tail latency and waiting requests come from traffic shape rather than raw capacity.",
        },
        {
          label: "Uneven-size mix",
          command: "./scripts/experiment run --experiment request-patterns --case uneven-size-mix --profile default",
          reason: "Use the weighted short/medium/long request mix to expose head-of-line effects by request shape.",
        },
      ],
    },
    {
      slug: "autoscaling",
      title: "Autoscaling and Queueing Behavior",
      category: "Capacity response",
      status: experimentStatus("Measured with run", "Measured queueing behavior"),
      readiness: {
        primary: {
          label: "Supported",
          detail: "Admission behavior",
          tone: "supported",
        },
      },
      question:
        "How much traffic must be buffered while GPU capacity and model readiness catch up?",
      cardSummary: "Scale-from-zero timing and queue policy.",
      metricFocus: ["Scale-from-zero", "Queue policy", "Dropped work"],
      summary:
        "Compares direct and bounded-queue client policies during burst and spike-to-zero traffic while GPU capacity and model readiness catch up.",
      whyItMatters:
        "Autoscaling is more than replica count. The May 7 spike reruns show fast GPU node launch and slow container/model readiness.",
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
        "./scripts/experiment render-load --experiment autoscaling --case spike-queued",
      ],
      liveCommands: [
        "./scripts/experiment run --experiment autoscaling --case spike-queued --profile default",
      ],
      resultEvidence: {
        title: "Scale-from-zero queue behavior",
        statusLabel: "Measured queueing behavior",
        reportDate: "2026-05-07",
        summary:
          "Autoscaling reports compare direct and bounded-queue clients across burst and spike-to-zero cases. Bounded queues delivered all work at about 2s p95; direct clients ran hotter but dropped 237-787 iterations.",
        boundary:
          "Burst cases predate timeline capture, and first-successful-completion timing is missing. Use spike runs for cold-start timing and all cases for queue policy.",
        boundaryPoints: [
          "The scale-from-zero path was dominated by container/image/model readiness, not NodeClaim or GPU node creation.",
          "The cluster tried spot capacity first, but EC2 Spot service-linked-role permissions blocked spot replacement; on-demand nodes served the successful runs.",
          "First-successful-completion timing is not in the selected reports.",
        ],
        stats: [
          {
            label: "GPU node ready",
            value: "35s",
            context: "NodeClaim in 3-12s; pod scheduled at 65s",
          },
          {
            label: "Model ready",
            value: "425-439s",
            context: "container start at 354-357s dominated the cold path",
          },
          {
            label: "Queued delivery",
            value: "100%",
            context: "burst-queued and spike-queued dropped 0 client iterations",
          },
        ],
        sourceReports: [
          {
            label: "Burst direct report",
            path: "docs/reports/experiment-autoscaling-burst-direct-default-20260506-221447.md",
          },
          {
            label: "Burst queued report",
            path: "docs/reports/experiment-autoscaling-burst-queued-default-20260506-222712.md",
          },
          {
            label: "Spike direct report",
            path: "docs/reports/experiment-autoscaling-spike-direct-default-20260507-002654.md",
          },
          {
            label: "Spike queued report",
            path: "docs/reports/experiment-autoscaling-spike-queued-default-20260507-004305.md",
          },
        ],
        tables: [
          {
            title: "Queue policy outcome",
            summary:
              "Direct clients maximize attempted throughput but shed work; bounded queues protect delivery and tail latency by limiting concurrency.",
            columns: {
              target: "Case",
              outcome: "Delivery",
              p95Latency: "p95 latency",
              peakWaiting: "Dropped / active",
              gpuMax: "GPU max",
            },
            rows: [
              {
                target: "burst-direct",
                outcome: "76.98% delivered",
                p95Latency: "14.62s",
                peakWaiting: "787 dropped / 255 active",
                gpuMax: "80%",
              },
              {
                target: "burst-queued",
                outcome: "100% delivered",
                p95Latency: "2.19s",
                peakWaiting: "0 dropped / 24 active",
                gpuMax: "86%",
              },
              {
                target: "spike-direct",
                outcome: "88.14% delivered",
                p95Latency: "14.23s",
                peakWaiting: "237 dropped / 254 active",
                gpuMax: "80%",
              },
              {
                target: "spike-queued",
                outcome: "100% delivered",
                p95Latency: "1.98s",
                peakWaiting: "0 dropped / 20 active",
                gpuMax: "84%",
              },
            ],
          },
          {
            title: "Spike cold-start timeline",
            summary:
              "The May 7 spike reruns captured the scale-from-zero timeline and show model readiness as the long pole.",
            columns: {
              target: "Spike case",
              outcome: "NodeClaim",
              p95Latency: "GPU node",
              peakWaiting: "Container / model",
              gpuMax: "Pod scheduled",
            },
            rows: [
              {
                target: "spike-direct",
                outcome: "3s",
                p95Latency: "35s",
                peakWaiting: "354s / 425s",
                gpuMax: "65s",
              },
              {
                target: "spike-queued",
                outcome: "12s",
                p95Latency: "35s",
                peakWaiting: "357s / 439s",
                gpuMax: "65s",
              },
            ],
          },
        ],
      },
    },
    {
      slug: "cost",
      title: "Cost per Useful Work",
      category: "Cost efficiency",
      status: experimentStatus("Measurable with run"),
      readiness: {
        primary: {
          label: "Pending",
          detail: "Cost matrix",
          tone: "pending",
        },
      },
      question:
        "How much cheaper does the same GPU become when concurrency and batching produce more successful work?",
      cardSummary: "Serving cost tied to successful work.",
      metricFocus: ["Cost/request", "Cost/token", "SLO pass"],
      summary:
        "Compares naive and optimized serving profiles under steady and burst workloads with cost denominators tied to successful work.",
      whyItMatters:
        "A cheaper run is not cheaper if it drops work or misses latency goals. This experiment ties cost to successful requests and generated tokens.",
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
      pendingNextRuns: [
        {
          label: "Naive steady baseline",
          command: "./scripts/experiment run --experiment cost --case steady-cost-efficiency --profile naive-single",
          reason: "Capture the low-concurrency cost denominator before comparing optimized useful work.",
        },
        {
          label: "Optimized steady profile",
          command: "./scripts/experiment run --experiment cost --case steady-cost-efficiency --profile optimized-batched",
          reason: "Measure whether more successful requests and generated tokens improve cost without violating p95/p99 SLOs.",
        },
        {
          label: "Burst cost comparison",
          command: "./scripts/experiment run --experiment cost --case burst-cost-efficiency --profile optimized-batched",
          reason: "Check whether the optimized profile remains cheaper once tail-latency pressure and dropped work are included.",
        },
      ],
    },
    {
      slug: "fp4",
      title: "FP4 Quantization Optimization",
      category: "Quantization",
      status: experimentStatus("Renderable with quantization jobs", "Blackwell capacity blocked"),
      readiness: {
        primary: {
          label: "Blocked",
          detail: "Blackwell capacity",
          tone: "blocked",
        },
      },
      question:
        "Does SmoothQuant improve NVFP4 W4A4 accuracy recovery enough to justify its memory, latency, throughput, and cost tradeoffs?",
      cardSummary: "BF16 vs NVFP4 vs SmoothQuant.",
      metricFocus: ["Accuracy recovery", "Memory", "Build cost"],
      summary:
        "Defines a Blackwell FP4 comparison for BF16, plain NVFP4, and SmoothQuant, with latency, throughput, accuracy, memory, serving cost, and build cost tracked separately.",
      whyItMatters:
        "Quantization helps only if memory or cost gains survive accuracy, latency, throughput, and build-cost tradeoffs. This experiment keeps FP4 claims measurable.",
      runner: "k6 completion load + accuracy client",
      endpoint: "/v1/completions",
      sourcePath: "experiments/fp4/",
      resultsPath: "experiments/fp4/results.md",
      cases: [
        {
          id: "steady-512-output-128",
          promptTokens: 512,
          outputTokens: 128,
          description: "steady latency, throughput, and serving cost comparison",
        },
        {
          id: "prefill-2048-output-128",
          promptTokens: 2048,
          outputTokens: 128,
          description: "prefill-heavy memory and TTFT comparison",
        },
      ],
      servingProfiles: [
        {
          id: "bf16-baseline",
          description: "Qwen2.5 7B BF16 baseline on a full p6-b200 instance",
        },
        {
          id: "nvfp4-plain",
          description: "NVFP4 W4A4 artifact without pre-optimization",
        },
        {
          id: "nvfp4-smoothquant",
          description: "SmoothQuant preprocessing followed by NVFP4 W4A4 quantization",
        },
      ],
      metricGroups: [
        {
          label: "Serving",
          metrics: ["p95 request latency", "p99 request latency", "requests/sec", "generated tokens/sec"],
        },
        {
          label: "Accuracy and memory",
          metrics: ["average accuracy score", "FP4 recovery vs BF16", "GPU memory used", "GPU memory free"],
        },
        {
          label: "Cost",
          metrics: ["serving cost", "cost per 1M generated tokens", "quantization build cost"],
        },
      ],
      localCommands: [
        "./scripts/experiment show fp4",
        "./scripts/experiment render-quantization --experiment fp4 --profile nvfp4-plain",
        "./scripts/experiment render-accuracy --experiment fp4 --profile nvfp4-smoothquant",
      ],
      liveCommands: [
        "./scripts/experiment run --experiment fp4 --case steady-512-output-128 --profile bf16-baseline",
      ],
      pendingNextRuns: [
        {
          label: "Capacity retry",
          command: "./scripts/up",
          reason: "Retry only when p6-b200.48xlarge capacity is available or reserved in the target us-west-2 zones.",
        },
        {
          label: "Plain NVFP4 build",
          command: "./scripts/experiment render-quantization --experiment fp4 --profile nvfp4-plain",
          reason: "Produce the first quantized artifact before comparing BF16, plain NVFP4, and SmoothQuant serving behavior.",
        },
        {
          label: "SmoothQuant comparison",
          command: "./scripts/experiment render-accuracy --experiment fp4 --profile nvfp4-smoothquant",
          reason: "Measure whether SmoothQuant improves NVFP4 accuracy recovery enough to justify its extra build cost.",
        },
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
