import { GPU_INFERENCE_DECISIONS_PATH } from "./content";
import type { ProjectId } from "./projects-content";

const GPU_INFERENCE_REPO_BASE = "https://github.com/tungsheng/gpu-inference-lab/blob/main";
const CUDA_KERNEL_REPO_BASE = "https://github.com/tungsheng/cuda-kernel-lab/blob/main";

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
  promptTokens?: number;
  outputTokens?: number;
  primaryMeasure?: string;
  secondaryMeasure?: string;
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
  projectId: ProjectId;
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
  runShapeSummary?: string;
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
    "Project-linked experiments that turn GPU serving and kernel questions into evidence-backed decisions.",
  statusNote:
    "Rows show the current proof, focus area, and decisions that still need stronger evidence.",
  platformValidation: {
    status: "GPU inference evidence",
    question:
      "Admission, cold start, active-pressure HPA, FP8 KV cache, and Blackwell FP4 readiness remain in the GPU Inference Lab decision record.",
    href: GPU_INFERENCE_DECISIONS_PATH,
  },
  conceptLead:
    "Each experiment starts with one serving question and ends with a result, rejection, or bounded gap.",
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
      label: "Run profile",
      body: "Choose the serving or kernel knobs.",
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
      projectId: "gpu-inference-lab",
      slug: "kv-cache",
      title: "KV Cache vs Concurrency",
      category: "Memory pressure",
      status: experimentStatus("Measurable with run", "Measured queue boundary"),
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
        "Compares prompt lengths, sweeps the 8192/300 knee, then tests whether scheduler caps fix it.",
      whyItMatters:
        "Long prompts can look healthy until arrival rate crosses a narrow boundary. The May 18 server-timing follow-up attributes the tail to queue and TTFT inflation, not decode.",
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
          description: "reduced sequence cap that worsened the 1.20 req/s tail",
        },
        {
          id: "long-context-seqs-16",
          description: "more conservative sequence cap that increased waiting pressure",
        },
        {
          id: "long-context-batched-16384",
          description: "larger batched-token budget that did not improve the knee",
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
        title: "Queueing sets the boundary",
        statusLabel: "Measured queue boundary",
        reportDate: "2026-05-18 UTC",
        summary:
          "With 8192-token prompts and 300 generated tokens, the profile is usable through 1.10 req/s, queues repeatably at 1.15 req/s, and is queue-dominated by 1.20 req/s. Server timing shows admission removes queue and TTFT inflation while decode stays roughly unchanged.",
        boundary:
          "Treat this as an operating band for one model, GPU class, vLLM image, and 8192/300 workload. Use admission/backpressure before deeper scheduler-cap tuning on the current g4dn/vLLM path, and compare queue delay, TTFT, dropped demand, and p95 request latency together.",
        boundaryPoints: [
          "At 1.20 req/s, the latest repeats delivered 100% of offered work with zero failures, drops, or interruptions, but p95 request latency reached 62.66-63.40s.",
          "The 1.20 req/s r3 report shows p95 server queue delay at 36.93s and p95 TTFT at 37.61s while p95 decode stays near 29.43s.",
          "At the same rate, seqs-16 hit 76.24s p95, seqs-24 hit 61.36s, and batched-16384 hit 55.58s.",
          "The latest 1.25 req/s admission-capped run exposed 59 unserved iterations, reduced p95 to 27.98s, and kept p95 server queue delay at 0.285s.",
        ],
        stats: [
          {
            label: "Stable repeat",
            value: "1.10 req/s",
            context: "0 waiting; p95 25.23s; p95 queue 0.285s",
          },
          {
            label: "Queue starts",
            value: "1.15 req/s",
            context: "16 waiting; p95 42.49s; p95 queue 14.02s",
          },
          {
            label: "Queue dominated",
            value: "1.20 req/s",
            context: "100% delivered; p95 63.40s; p95 queue 36.93s",
          },
          {
            label: "Cap variants",
            value: "0 wins",
            context: "seqs-16, seqs-24, and batched-16384 did not beat baseline",
          },
          {
            label: "Admission result",
            value: "27.98s p95",
            context: "59 unserved; p95 queue 0.285s; 32 active",
          },
        ],
        sourceReports: [
          {
            label: "1.10 req/s r3 timing",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-110-r3-long-context-20260518-000954.md",
          },
          {
            label: "1.15 req/s r3 timing",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-115-r3-long-context-20260518-003524.md",
          },
          {
            label: "1.20 req/s r3 timing",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-120-r3-long-context-20260518-010100.md",
          },
          {
            label: "1.25 req/s direct timing",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-125-long-context-20260517-224635.md",
          },
          {
            label: "seqs-16 @ 1.20 report",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-120-long-context-seqs-16-20260515-224110.md",
          },
          {
            label: "seqs-24 @ 1.20 report",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-120-long-context-seqs-24-20260515-230052.md",
          },
          {
            label: "batched-16384 @ 1.20 report",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-120-long-context-batched-16384-20260515-231435.md",
          },
          {
            label: "admission-032 @ 1.25 report",
            path: "docs/reports/experiment-kv-cache-prompt-8192-output-300-rate-125-admission-032-long-context-20260517-230018.md",
          },
        ],
        tables: [
          {
            title: "8192/300 rate sweep",
            summary:
              "The default long-context profile still completes every request at 1.20 req/s, but repeated queue delay and p95 make that point an operational edge.",
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
                outcome: "stable repeat",
                p95Latency: "25.23s",
                peakWaiting: "0 waiting / 28 active",
                gpuMax: "100%",
              },
              {
                target: "1.15 req/s",
                outcome: "queueing repeats",
                p95Latency: "42.49s",
                peakWaiting: "16 waiting / 48 active",
                gpuMax: "100%",
              },
              {
                target: "1.20 req/s",
                outcome: "queue-dominated",
                p95Latency: "63.40s",
                peakWaiting: "39 waiting / 71 active",
                gpuMax: "100%",
              },
              {
                target: "1.25 req/s",
                outcome: "saturation is obvious",
                p95Latency: "77.51s",
                peakWaiting: "57 waiting / 89 active",
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
            title: "Server timing attribution",
            summary:
              "Queue delay and TTFT inflate together as load crosses the boundary; decode remains around 29.4s, and admission removes queue inflation.",
            columns: {
              target: "Run",
              outcome: "Outcome",
              p95Latency: "p95 request",
              peakWaiting: "p95 queue / TTFT",
              gpuMax: "p95 decode",
            },
            rows: [
              {
                target: "1.10 req/s r3",
                outcome: "stable repeat",
                p95Latency: "25.23s",
                peakWaiting: "0.285s / 0.733s",
                gpuMax: "29.32s",
              },
              {
                target: "1.15 req/s r3",
                outcome: "queueing repeats",
                p95Latency: "42.49s",
                peakWaiting: "14.02s / 18.12s",
                gpuMax: "29.41s",
              },
              {
                target: "1.20 req/s r3",
                outcome: "queue-dominated",
                p95Latency: "63.40s",
                peakWaiting: "36.93s / 37.61s",
                gpuMax: "29.43s",
              },
              {
                target: "1.25 req/s direct",
                outcome: "saturation begins",
                p95Latency: "77.51s",
                peakWaiting: "48.11s / 71.24s",
                gpuMax: "29.44s",
              },
              {
                target: "1.25 admission-032",
                outcome: "bounded admission",
                p95Latency: "27.98s",
                peakWaiting: "0.285s / 0.718s",
                gpuMax: "29.39s",
              },
            ],
          },
          {
            title: "Long-context fix attempts",
            summary:
              "The 1.20 req/s scheduler variants did not beat the baseline; bounded admission at 1.25 req/s made overload explicit and lowered p95.",
            columns: {
              target: "Profile / run",
              outcome: "Outcome",
              p95Latency: "p95 latency",
              peakWaiting: "Waiting / active",
              gpuMax: "GPU max",
            },
            rows: [
              {
                target: "long-context @ 1.20",
                outcome: "baseline practical edge",
                p95Latency: "54.35s",
                peakWaiting: "30 waiting / 62 active",
                gpuMax: "100%",
              },
              {
                target: "seqs-16 @ 1.20",
                outcome: "worse tail and waiting",
                p95Latency: "76.24s",
                peakWaiting: "66 waiting / 82 active",
                gpuMax: "97%",
              },
              {
                target: "seqs-24 @ 1.20",
                outcome: "worse tail and waiting",
                p95Latency: "61.36s",
                peakWaiting: "45 waiting / 69 active",
                gpuMax: "100%",
              },
              {
                target: "batched-16384 @ 1.20",
                outcome: "no improvement",
                p95Latency: "55.58s",
                peakWaiting: "31 waiting / 63 active",
                gpuMax: "100%",
              },
              {
                target: "admission-032 @ 1.25",
                outcome: "bounded admission",
                p95Latency: "27.98s",
                peakWaiting: "0 waiting / 32 active",
                gpuMax: "100%",
              },
            ],
          },
        ],
      },
    },
    {
      projectId: "gpu-inference-lab",
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
      projectId: "gpu-inference-lab",
      slug: "batching",
      title: "Batching Scheduler Tradeoffs",
      category: "Scheduler behavior",
      status: experimentStatus("Measured with run", "Measured steady/burst compare"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "Scheduler matrix",
          tone: "selected",
        },
      },
      question:
        "How do vLLM scheduler limits trade throughput for p95/p99 latency?",
      cardSummary: "Scheduler limits versus tail latency.",
      metricFocus: ["Batching", "p99 latency", "Tokens/sec"],
      summary:
        "Compares constrained, limited, and default vLLM scheduler settings under steady and burst small-request traffic.",
      whyItMatters:
        "Scheduler caps should earn their keep. In the current 512/128 matrix, explicit caps shed useful work before they improve the latency envelope.",
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
        title: "Dynamic defaults beat explicit caps",
        statusLabel: "Measured steady/burst compare",
        reportDate: "2026-05-14",
        summary:
          "For steady and burst 512/128 traffic, the default vLLM scheduler delivered the most useful work with the best tail-latency profile among the tested options.",
        boundary:
          "This supports dynamic defaults for the current small homogeneous workload. Mixed-size and fairness-oriented runs are still needed before making a general scheduler-cap policy.",
        boundaryPoints: [
          "Dynamic-default means vLLM's default scheduler settings, not disabled batching.",
          "The matrix covers 512/128 steady and burst traffic; it does not prove behavior for long-context or mixed-size workloads.",
          "Cost denominators are covered by the separate cost experiment, not this scheduler matrix.",
        ],
        stats: [
          {
            label: "Steady default",
            value: "100% delivered",
            context: "p95 1.66s; 948.98 generated tokens/sec",
          },
          {
            label: "Burst default",
            value: "97.6% delivered",
            context: "p95 6.79s; peak waiting 1",
          },
          {
            label: "Caps under-delivered",
            value: "8.4-80.1%",
            context: "delivery range for limited and constrained profiles",
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
          {
            label: "Burst dynamic report",
            path: "docs/reports/experiment-batching-burst-512-output-128-dynamic-default-20260514-155838.md",
          },
          {
            label: "Burst limited report",
            path: "docs/reports/experiment-batching-burst-512-output-128-limited-batching-20260514-160416.md",
          },
          {
            label: "Burst constrained report",
            path: "docs/reports/experiment-batching-burst-512-output-128-constrained-scheduler-20260514-160946.md",
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
          {
            title: "Burst scheduler profile comparison",
            summary:
              "Under burst pressure, the default profile still keeps delivery near 98% while explicit caps shed much more work.",
            columns: {
              target: "Profile",
              outcome: "Outcome",
              p95Latency: "p95 latency",
              peakWaiting: "Delivery",
              gpuMax: "Peak waiting",
            },
            rows: [
              {
                target: "dynamic-default",
                outcome: "Best burst profile",
                p95Latency: "6.79s",
                peakWaiting: "97.6%",
                gpuMax: "1",
              },
              {
                target: "limited-batching",
                outcome: "Queue-limited",
                p95Latency: "20.53s",
                peakWaiting: "45.5%",
                gpuMax: "120",
              },
              {
                target: "constrained-scheduler",
                outcome: "Overloaded reference",
                p95Latency: "119.09s",
                peakWaiting: "8.4%",
                gpuMax: "127",
              },
            ],
          },
        ],
      },
    },
    {
      projectId: "gpu-inference-lab",
      slug: "request-patterns",
      title: "Request Pattern Utilization",
      category: "Traffic shape",
      status: experimentStatus("Measured with run", "Measured pattern matrix"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "Pattern matrix",
          tone: "selected",
        },
      },
      question:
        "How do steady, burst, uneven-size, and spike-to-zero traffic patterns affect GPU occupancy?",
      cardSummary: "Same profile, different traffic outcome.",
      metricFocus: ["Delivery", "Tail latency", "Active concurrency"],
      summary:
        "Runs steady, burst, uneven-size, and spike-to-zero traffic against the same default profile.",
      whyItMatters:
        "Average load can hide the operating problem. The same serving profile behaves differently when traffic arrives steadily, in bursts, or as a mixed-size workload.",
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
      resultEvidence: {
        title: "Traffic shape changes the result",
        statusLabel: "Measured pattern matrix",
        reportDate: "2026-05-15",
        summary:
          "The default profile stayed clean under steady traffic, but burst and spike-to-zero traffic pushed active concurrency to the edge and dropped client-side work.",
        boundary:
          "These reports use direct clients with no admission buffer. Dropped iterations are unserved client work, not successful backpressure handling.",
        boundaryPoints: [
          "Steady 512/128 traffic delivered 100% of work with p95 near 1.3s.",
          "Burst and spike-to-zero traffic reached 127-128 active requests and dropped work.",
          "The uneven-size mix preserved delivery but widened the tail; the report does not include per-shape latency buckets.",
        ],
        stats: [
          {
            label: "Steady traffic",
            value: "1.29s p95",
            context: "100% delivered; peak active 7",
          },
          {
            label: "Burst traffic",
            value: "87.5% delivered",
            context: "8.56s p95; peak active 127",
          },
          {
            label: "Uneven mix",
            value: "99.7% delivered",
            context: "7.87s p95; mixed tail widened",
          },
        ],
        sourceReports: [
          {
            label: "Steady report",
            path: "docs/reports/experiment-request-patterns-steady-small-default-20260514-164928.md",
          },
          {
            label: "Burst report",
            path: "docs/reports/experiment-request-patterns-burst-small-default-20260514-170305.md",
          },
          {
            label: "Uneven mix report",
            path: "docs/reports/experiment-request-patterns-uneven-size-mix-default-20260514-170637.md",
          },
          {
            label: "Spike report",
            path: "docs/reports/experiment-request-patterns-spike-to-zero-default-20260514-171308.md",
          },
        ],
        tables: [
          {
            title: "Default-profile traffic matrix",
            summary:
              "The same serving profile has different delivery and latency behavior depending on traffic shape.",
            columns: {
              target: "Pattern",
              outcome: "Delivery",
              p95Latency: "p95 latency",
              peakWaiting: "Peak active",
              gpuMax: "Avg / max GPU",
            },
            rows: [
              {
                target: "steady-small",
                outcome: "100.0%",
                p95Latency: "1.29s",
                peakWaiting: "7",
                gpuMax: "69.0% / 84%",
              },
              {
                target: "burst-small",
                outcome: "87.5%",
                p95Latency: "8.56s",
                peakWaiting: "127",
                gpuMax: "77.3% / 79%",
              },
              {
                target: "uneven-size-mix",
                outcome: "99.7%",
                p95Latency: "7.87s",
                peakWaiting: "25",
                gpuMax: "65.2% / 84%",
              },
              {
                target: "spike-to-zero",
                outcome: "79.8%",
                p95Latency: "8.45s",
                peakWaiting: "128",
                gpuMax: "75.5% / 76%",
              },
            ],
          },
        ],
      },
    },
    {
      projectId: "gpu-inference-lab",
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
      projectId: "gpu-inference-lab",
      slug: "cost",
      title: "Cost per Useful Work",
      category: "Cost efficiency",
      status: experimentStatus("Measured with run", "Measured useful-work cost"),
      readiness: {
        primary: {
          label: "Supported",
          detail: "Useful-work cost",
          tone: "supported",
        },
      },
      question:
        "How much cheaper does the same GPU become when concurrency and batching produce more successful work?",
      cardSummary: "Cheap only counts when useful work passes.",
      metricFocus: ["Cost/request", "Cost/token", "SLO pass"],
      summary:
        "Compares naive and optimized serving profiles with cost tied to successful requests and generated tokens.",
      whyItMatters:
        "A cheaper run is not cheaper if it drops work or misses latency goals. This matrix makes cost, useful work, and SLO status visible together.",
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
      resultEvidence: {
        title: "Useful work beats raw cheapness",
        statusLabel: "Measured useful-work cost",
        reportDate: "2026-05-15",
        summary:
          "Optimized batching sharply reduced cost per successful request for steady and burst traffic, but only the steady optimized run passed the latency SLO.",
        boundary:
          "Costs include the serving GPU model only. They do not include control plane, networking, storage, observability, idle platform cost, or operator time.",
        boundaryPoints: [
          "The steady optimized profile completed 2670 successful requests with no dropped work and p95 1.61s.",
          "The burst optimized profile was cheapest per useful request but still missed latency with p95 10.91s.",
          "Burst SLO compliance still needs admission, autoscaling, or a different capacity shape.",
        ],
        stats: [
          {
            label: "Steady optimized",
            value: "$0.019752",
            context: "per 1K successful requests; SLO pass",
          },
          {
            label: "Naive steady",
            value: "$0.137976",
            context: "per 1K successful requests; 2227 dropped",
          },
          {
            label: "Burst optimized",
            value: "10.91s p95",
            context: "$0.012768 per 1K, but SLO miss",
          },
        ],
        sourceReports: [
          {
            label: "Steady naive report",
            path: "docs/reports/experiment-cost-steady-cost-efficiency-naive-single-20260514-171552.md",
          },
          {
            label: "Steady optimized report",
            path: "docs/reports/experiment-cost-steady-cost-efficiency-optimized-batched-20260514-172916.md",
          },
          {
            label: "Burst naive report",
            path: "docs/reports/experiment-cost-burst-cost-efficiency-naive-single-20260514-172403.md",
          },
          {
            label: "Burst optimized report",
            path: "docs/reports/experiment-cost-burst-cost-efficiency-optimized-batched-20260514-173650.md",
          },
        ],
        tables: [
          {
            title: "Useful-work cost matrix",
            summary:
              "Optimized batching wins the useful-work denominator, but burst latency still fails the serving SLO.",
            columns: {
              target: "Run",
              outcome: "Successful / dropped",
              p95Latency: "p95 latency",
              peakWaiting: "Cost / 1K",
              gpuMax: "SLO",
            },
            rows: [
              {
                target: "steady naive",
                outcome: "413 / 2227",
                p95Latency: "60.31s",
                peakWaiting: "$0.137976",
                gpuMax: "miss",
              },
              {
                target: "steady optimized",
                outcome: "2670 / 0",
                p95Latency: "1.61s",
                peakWaiting: "$0.019752",
                gpuMax: "pass",
              },
              {
                target: "burst naive",
                outcome: "227 / 2882",
                p95Latency: "120.00s",
                peakWaiting: "$0.164137",
                gpuMax: "miss",
              },
              {
                target: "burst optimized",
                outcome: "2570 / 677",
                p95Latency: "10.91s",
                peakWaiting: "$0.012768",
                gpuMax: "miss",
              },
            ],
          },
        ],
      },
    },
    {
      projectId: "gpu-inference-lab",
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
    {
      projectId: "cuda-kernel-lab",
      slug: "kernel-memory-primitives",
      title: "Memory Primitive Bandwidth",
      category: "Kernel memory traffic",
      status: experimentStatus("Measured on A10G", "PyTorch baseline still leads"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "Memory bandwidth",
          tone: "selected",
        },
      },
      question:
        "Do simple Triton copy, scale, and vector_add kernels beat the optimized PyTorch memory path on A10G?",
      cardSummary: "PyTorch still wins simple memory traffic.",
      metricFocus: ["GB/s", "p50 latency", "Correctness"],
      summary:
        "Compares PyTorch and Triton memory primitives across copy, scale, vector_add, and reduction_sum rows.",
      whyItMatters:
        "Simple memory-bound kernels are the control group. If a custom kernel does not beat the framework path, the next step should be profiler explanation rather than a broad parameter sweep.",
      runner: "CUDA benchmark matrix",
      endpoint: "benchmark-memory",
      sourcePath: "src/cuda_kernel_lab/benchmarks/memory_bandwidth.py",
      resultsPath: "experiments/reports/aws-ec2/2026-05-21-strategy-next.md",
      runShapeSummary:
        "3 memory cases across 16,777,216-element tensors, compared across PyTorch and Triton profiles.",
      cases: [
        {
          id: "copy-float32-16m",
          description: "device-to-device copy bandwidth",
          primaryMeasure: "16,777,216 elements",
          secondaryMeasure: "float32",
        },
        {
          id: "scale-float32-16m",
          description: "single-input scale kernel bandwidth",
          primaryMeasure: "16,777,216 elements",
          secondaryMeasure: "float32",
        },
        {
          id: "vector-add-float32-16m",
          description: "two-input vector add bandwidth",
          primaryMeasure: "16,777,216 elements",
          secondaryMeasure: "float32",
        },
      ],
      servingProfiles: [
        {
          id: "torch-baseline",
          description: "framework memory primitive baseline",
        },
        {
          id: "triton-block-size-512",
          description: "Triton vector_add launch block size 512",
        },
        {
          id: "triton-block-size-1024",
          description: "Triton vector_add launch block size 1024",
        },
        {
          id: "triton-block-size-2048",
          description: "Triton vector_add launch block size 2048",
        },
      ],
      metricGroups: [
        {
          label: "Latency",
          metrics: ["p50 latency", "p95 latency", "p99 latency"],
        },
        {
          label: "Memory",
          metrics: ["effective GB/s", "estimated bytes moved", "noise ratio"],
        },
        {
          label: "Validation",
          metrics: ["correctness", "device", "dtype"],
        },
      ],
      localCommands: [
        "uv run benchmark-memory --backend all --op all --numel 16777216 --dtype float32",
      ],
      liveCommands: [
        "./scripts/benchmark --run-id <run-id> --with-profiling",
      ],
      resultEvidence: {
        title: "PyTorch still owns simple memory primitives",
        statusLabel: "Selected report",
        reportDate: "2026-05-21",
        summary:
          "The A10G strategy run kept PyTorch ahead on copy, scale, and vector_add, while the Triton vector_add profile showed high DRAM throughput rather than an obvious block-size fix.",
        boundary:
          "This is not evidence against custom kernels broadly; it bounds simple memory traffic and redirects optimization toward fusion or reuse before wider launch sweeps.",
        stats: [
          {
            label: "Rows",
            value: "18 memory rows",
            context: "copy, scale, reduction_sum, and vector_add variants",
          },
          {
            label: "PyTorch vector_add",
            value: "467 GB/s",
            context: "float32 p50 0.4311 ms",
          },
          {
            label: "Triton profile",
            value: "91.58% DRAM",
            context: "float32 vector_add with 81.80% occupancy",
          },
        ],
        tables: [
          {
            title: "Memory primitive comparison",
            columns: {
              target: "Primitive",
              outcome: "Fastest backend",
              p95Latency: "p50",
              peakWaiting: "GB/s",
              gpuMax: "Call",
            },
            rows: [
              {
                target: "copy fp32",
                outcome: "PyTorch",
                p95Latency: "0.2888 ms",
                peakWaiting: "464.8",
                gpuMax: "baseline leads",
              },
              {
                target: "scale fp32",
                outcome: "PyTorch",
                p95Latency: "0.2929 ms",
                peakWaiting: "458.3",
                gpuMax: "baseline leads",
              },
              {
                target: "vector_add fp32",
                outcome: "PyTorch",
                p95Latency: "0.4311 ms",
                peakWaiting: "467.0",
                gpuMax: "fusion next",
              },
            ],
          },
        ],
      },
    },
    {
      projectId: "cuda-kernel-lab",
      slug: "kernel-reduction-strategy",
      title: "Reduction Strategy Comparison",
      category: "Kernel reductions",
      status: experimentStatus("Measured on A10G", "Profiler comparison ready"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "Reduction strategy",
          tone: "selected",
        },
      },
      question:
        "Does an iterative Triton reduction or a two-pass Triton reduction perform better for a 16M-element float32 sum?",
      cardSummary: "Two Triton reduction strategies trail PyTorch.",
      metricFocus: ["Reduction latency", "GB/s", "Strategy tradeoff"],
      summary:
        "Keeps shape, dtype, device, and block size fixed while comparing iterative and two-pass reduction strategies.",
      whyItMatters:
        "Reduction work introduces synchronization and partial writes, making it the first useful step beyond one-element-per-thread memory traffic.",
      runner: "CUDA benchmark matrix",
      endpoint: "benchmark-memory --op reduction_sum",
      sourcePath: "src/cuda_kernel_lab/kernels/triton/memory.py",
      resultsPath: "experiments/reports/aws-ec2/2026-05-21-strategy-next.md",
      runShapeSummary:
        "1 reduction case across a 16,777,216-element float32 tensor, compared across PyTorch, iterative Triton, and two-pass Triton profiles.",
      cases: [
        {
          id: "reduction-sum-float32-16m",
          description: "global sum over a 16M-element tensor",
          primaryMeasure: "16,777,216 elements",
          secondaryMeasure: "float32",
        },
      ],
      servingProfiles: [
        {
          id: "torch-baseline",
          description: "framework reduction baseline",
        },
        {
          id: "triton-reduction-iterative",
          description: "iterative reduction strategy",
        },
        {
          id: "triton-reduction-two-pass",
          description: "partial reduction followed by final pass",
        },
      ],
      metricGroups: [
        {
          label: "Latency",
          metrics: ["p50 latency", "p95 latency", "p99 latency"],
        },
        {
          label: "Traffic",
          metrics: ["effective GB/s", "estimated reads and writes", "partial tensor traffic"],
        },
        {
          label: "Profiler evidence",
          metrics: ["occupancy", "memory throughput", "register pressure"],
        },
      ],
      localCommands: [
        "uv run benchmark-memory --backend all --device cuda --op reduction_sum --dtype float32",
      ],
      liveCommands: [
        "./scripts/benchmark --run-id <run-id> --with-profiling",
      ],
      resultEvidence: {
        title: "Reduction variants stream well but still trail PyTorch",
        statusLabel: "Selected report",
        reportDate: "2026-05-21",
        summary:
          "Both Triton reduction variants passed correctness and profiled with high DRAM throughput and occupancy, but still trailed the PyTorch baseline end to end.",
        boundary:
          "The profiler points away from a simple memory-coalescing fix; the next change should target launch/finalization overhead or a different reduction structure.",
        stats: [
          {
            label: "PyTorch",
            value: "0.1485 ms",
            context: "float32 p50, 452.9 GB/s",
          },
          {
            label: "Iterative Triton",
            value: "0.1761 ms",
            context: "381.8 GB/s, 93.59% profiled DRAM throughput",
          },
          {
            label: "Two-pass Triton",
            value: "0.1792 ms",
            context: "375.2 GB/s, 98.89% profiled occupancy",
          },
        ],
      },
    },
    {
      projectId: "cuda-kernel-lab",
      slug: "kernel-normalization-fusion",
      title: "Normalization Fusion",
      category: "Kernel fusion",
      status: experimentStatus("Measured on A10G", "Largest Triton win"),
      readiness: {
        primary: {
          label: "Supported",
          detail: "RMSNorm fusion",
          tone: "supported",
        },
      },
      question:
        "How much does a fused Triton RMSNorm or LayerNorm kernel move latency versus the PyTorch baseline?",
      cardSummary: "RMSNorm fusion stays strong across the shape sweep.",
      metricFocus: ["Speedup", "DRAM throughput", "Occupancy"],
      summary:
        "Compares PyTorch and Triton fused normalization kernels, then checks whether the RMSNorm fp16 win holds across hidden-size shapes.",
      whyItMatters:
        "Normalization is a realistic LLM primitive where fusion can remove expensive intermediate work; the shape sweep makes the win harder to dismiss as one lucky point.",
      runner: "CUDA benchmark matrix",
      endpoint: "benchmark-norms",
      sourcePath: "src/cuda_kernel_lab/kernels/triton/norms.py",
      resultsPath: "experiments/reports/aws-ec2/2026-05-21-strategy-next.md",
      runShapeSummary:
        "RMSNorm fp16 shape sweep from 512x1024 through 4096x8192, plus 4096x4096 LayerNorm and RMSNorm comparisons.",
      cases: [
        {
          id: "rmsnorm-512x1024-float16",
          description: "small RMSNorm shape sweep point",
          primaryMeasure: "512x1024",
          secondaryMeasure: "float16",
        },
        {
          id: "rmsnorm-2048x4096-float16",
          description: "mid-size RMSNorm shape sweep point",
          primaryMeasure: "2048x4096",
          secondaryMeasure: "float16",
        },
        {
          id: "rmsnorm-4096x4096-float16",
          description: "RMSNorm forward pass over LLM-shaped rows",
          primaryMeasure: "4096x4096",
          secondaryMeasure: "float16",
        },
        {
          id: "layernorm-4096x4096-float32",
          description: "LayerNorm forward pass over LLM-shaped rows",
          primaryMeasure: "4096x4096",
          secondaryMeasure: "float32",
        },
      ],
      servingProfiles: [
        {
          id: "torch-baseline",
          description: "PyTorch normalization baseline",
        },
        {
          id: "triton-fused-rmsnorm",
          description: "single fused RMSNorm Triton kernel",
        },
        {
          id: "triton-fused-layernorm",
          description: "single fused LayerNorm Triton kernel",
        },
      ],
      metricGroups: [
        {
          label: "Latency",
          metrics: ["p50 latency", "p95 latency", "speedup vs PyTorch"],
        },
        {
          label: "Throughput",
          metrics: ["effective GB/s", "effective TFLOP/s"],
        },
        {
          label: "Validation",
          metrics: ["correctness", "dtype tolerance", "noise ratio"],
        },
      ],
      localCommands: [
        "uv run benchmark-norms --backend all --device cuda --rows 4096 --cols 4096 --dtype float16",
      ],
      liveCommands: [
        "./scripts/benchmark --run-id <run-id> --include-rmsnorm-shape-sweep --with-profiling",
      ],
      resultEvidence: {
        title: "RMSNorm shape sweep keeps fusion as the largest win",
        statusLabel: "Supported",
        reportDate: "2026-05-21",
        summary:
          "Triton fused RMSNorm produced the largest speedups in the A10G strategy run and stayed ahead across the measured fp16 shape sweep.",
        boundary:
          "The two smallest shape-sweep rows were noisy enough to rerun before precise claims, but the larger rows and profiler counters support the fusion direction.",
        stats: [
          {
            label: "RMSNorm fp16 max",
            value: "5.901x",
            context: "4096x8192, 0.3103 ms Triton vs 1.831 ms PyTorch",
          },
          {
            label: "RMSNorm profile",
            value: "90.91% DRAM",
            context: "4096x4096 fp16 with 93.12% occupancy",
          },
          {
            label: "LayerNorm fp32",
            value: "1.379x",
            context: "0.3133 ms Triton vs 0.4321 ms PyTorch",
          },
        ],
        tables: [
          {
            title: "RMSNorm fp16 shape sweep",
            columns: {
              target: "Shape",
              outcome: "Winner",
              p95Latency: "Triton p50",
              peakWaiting: "Speedup",
              gpuMax: "Call",
            },
            rows: [
              {
                target: "512x1024",
                outcome: "Triton",
                p95Latency: "0.05018 ms",
                peakWaiting: "2.367x",
                gpuMax: "rerun noise",
              },
              {
                target: "2048x4096",
                outcome: "Triton",
                p95Latency: "0.1024 ms",
                peakWaiting: "4.76x",
                gpuMax: "supported",
              },
              {
                target: "4096x8192",
                outcome: "Triton",
                p95Latency: "0.3103 ms",
                peakWaiting: "5.901x",
                gpuMax: "supported",
              },
            ],
          },
        ],
      },
    },
    {
      projectId: "cuda-kernel-lab",
      slug: "kernel-swiglu-fusion",
      title: "SwiGLU Elementwise Fusion",
      category: "Kernel fusion",
      status: experimentStatus("Measured on A10G", "Fusion win"),
      readiness: {
        primary: {
          label: "Supported",
          detail: "SwiGLU fusion",
          tone: "supported",
        },
      },
      question:
        "Does fusing SwiGLU elementwise activation remove enough intermediate traffic to beat PyTorch?",
      cardSummary: "Fused SwiGLU is a clean 3x-class win.",
      metricFocus: ["Speedup", "GB/s", "p95 latency"],
      summary:
        "Compares PyTorch and fused Triton SwiGLU at 4096x4096 across float16 and float32.",
      whyItMatters:
        "SwiGLU is a clean elementwise fusion track: no reduction complexity, but enough intermediate activation traffic for fusion to matter.",
      runner: "CUDA benchmark matrix",
      endpoint: "benchmark-swiglu",
      sourcePath: "src/cuda_kernel_lab/kernels/triton/swiglu.py",
      resultsPath: "experiments/reports/aws-ec2/2026-05-21-strategy-next.md",
      runShapeSummary:
        "1 fused activation case at 4096x4096, compared across PyTorch and Triton profiles for float16 and float32.",
      cases: [
        {
          id: "swiglu-4096x4096",
          description: "SwiGLU activation over LLM-shaped hidden states",
          primaryMeasure: "4096x4096",
          secondaryMeasure: "float16 and float32",
        },
      ],
      servingProfiles: [
        {
          id: "torch-baseline",
          description: "PyTorch SwiGLU baseline",
        },
        {
          id: "triton-fused-swiglu",
          description: "single fused Triton activation kernel",
        },
      ],
      metricGroups: [
        {
          label: "Latency",
          metrics: ["p50 latency", "p95 latency", "speedup vs PyTorch"],
        },
        {
          label: "Traffic",
          metrics: ["effective GB/s", "intermediate tensor removal", "noise ratio"],
        },
        {
          label: "Validation",
          metrics: ["correctness", "dtype", "shape"],
        },
      ],
      localCommands: [
        "uv run benchmark-swiglu --backend all --device cuda --rows 4096 --cols 4096 --dtype float32",
      ],
      liveCommands: [
        "./scripts/benchmark --run-id <run-id> --with-profiling",
      ],
      resultEvidence: {
        title: "Fused activation removes expensive intermediate work",
        statusLabel: "Supported",
        reportDate: "2026-05-21",
        summary:
          "Fused Triton SwiGLU beat PyTorch in both float16 and float32 on the A10G strategy run.",
        boundary:
          "The result is a strong fusion proof for this shape; keep it behind the same re-profile gate before expanding to adjacent activation shapes.",
        stats: [
          {
            label: "SwiGLU fp16",
            value: "2.937x",
            context: "0.2437 ms Triton vs 0.7158 ms PyTorch",
          },
          {
            label: "SwiGLU fp32",
            value: "3.119x",
            context: "0.4547 ms Triton vs 1.418 ms PyTorch",
          },
          {
            label: "Correctness",
            value: "pass",
            context: "both recorded Triton rows passed",
          },
        ],
      },
    },
    {
      projectId: "cuda-kernel-lab",
      slug: "kernel-softmax-fusion",
      title: "Row Softmax Fusion",
      category: "Kernel fusion",
      status: experimentStatus("Measured on A10G", "Current Triton path rejected"),
      readiness: {
        primary: {
          label: "Rejected",
          detail: "Softmax win claim",
          tone: "rejected",
        },
      },
      question:
        "Does the current Triton fused row-softmax kernel beat PyTorch for 4096x1024 rows?",
      cardSummary: "Current Triton softmax trails PyTorch.",
      metricFocus: ["p50 latency", "Noise", "GB/s"],
      summary:
        "Compares PyTorch and Triton row-softmax at 4096x1024 for float16 and float32.",
      whyItMatters:
        "Negative evidence is useful: it prevents the site from claiming every custom kernel is a win and points the next optimization question at row-shape and launch behavior.",
      runner: "CUDA benchmark matrix",
      endpoint: "benchmark-softmax",
      sourcePath: "src/cuda_kernel_lab/kernels/triton/softmax.py",
      resultsPath: "experiments/reports/aws-ec2/2026-05-21-strategy-next.md",
      runShapeSummary:
        "1 row-softmax case at 4096x1024, compared across PyTorch and Triton profiles for float16 and float32.",
      cases: [
        {
          id: "softmax-4096x1024",
          description: "row-wise softmax over a modest attention-like row shape",
          primaryMeasure: "4096x1024",
          secondaryMeasure: "float16 and float32",
        },
      ],
      servingProfiles: [
        {
          id: "torch-baseline",
          description: "PyTorch softmax baseline",
        },
        {
          id: "triton-fused-row-softmax",
          description: "current fused Triton row-softmax kernel",
        },
      ],
      metricGroups: [
        {
          label: "Latency",
          metrics: ["p50 latency", "p95 latency", "noise ratio"],
        },
        {
          label: "Throughput",
          metrics: ["effective GB/s", "effective TFLOP/s"],
        },
        {
          label: "Next proof",
          metrics: ["row-size sweep", "occupancy", "memory throughput"],
        },
      ],
      localCommands: [
        "uv run benchmark-softmax --backend all --device cuda --rows 4096 --cols 1024 --dtype float16",
      ],
      liveCommands: [
        "./scripts/benchmark --run-id <run-id> --with-profiling",
      ],
      resultEvidence: {
        title: "Current softmax kernel should not be presented as a win",
        statusLabel: "Rejected",
        reportDate: "2026-05-21",
        summary:
          "PyTorch beat the current Triton fused row-softmax kernel in both float16 and float32 on the A10G strategy run.",
        boundary:
          "This rejects the current implementation as a portfolio win; it does not reject future softmax optimization after row-shape and profiler work.",
        stats: [
          {
            label: "PyTorch fp16",
            value: "0.05018 ms",
            context: "334.4 GB/s",
          },
          {
            label: "Triton fp16",
            value: "0.06554 ms",
            context: "256.0 GB/s",
          },
          {
            label: "Triton fp32",
            value: "0.8247x",
            context: "speedup vs PyTorch, below parity",
          },
        ],
      },
    },
    {
      projectId: "cuda-kernel-lab",
      slug: "kernel-matmul-tiling",
      title: "Matmul Tile Sweep",
      category: "Kernel tiling",
      status: experimentStatus("Measured on A10G", "PyTorch/cuBLAS still leads"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "Tile sweep",
          tone: "selected",
        },
      },
      question:
        "Which Triton tile and launch configuration gets closest to the PyTorch/cuBLAS matmul baseline?",
      cardSummary: "Best Triton tile is measured but still below cuBLAS.",
      metricFocus: ["TFLOP/s", "Tensor Core use", "Occupancy"],
      summary:
        "Compares focused float16 tile shapes, warp counts, pipeline stages, and Tensor Core profiler counters for 1024x1024x1024 matmul.",
      whyItMatters:
        "Matmul is the bridge from memory traffic and fusion into the compute path that dominates transformer inference; the current evidence is useful because it shows where Triton is not yet enough.",
      runner: "CUDA benchmark matrix",
      endpoint: "benchmark-matmul",
      sourcePath: "src/cuda_kernel_lab/kernels/triton/matmul.py",
      resultsPath: "experiments/reports/aws-ec2/2026-05-21-strategy-next.md",
      runShapeSummary:
        "1024x1024x1024 float16 matmul tile sweep with block M/N/K, num_warps, num_stages, and input_precision variants.",
      cases: [
        {
          id: "matmul-1024x1024x1024",
          description: "baseline square matmul shape for tile strategy work",
          primaryMeasure: "M=N=K=1024",
          secondaryMeasure: "float16",
        },
      ],
      servingProfiles: [
        {
          id: "torch-baseline",
          description: "PyTorch matmul baseline",
        },
        {
          id: "triton-best-tile",
          description: "best measured Triton tile: 128x64x32, 8 warps, 3 stages, tf32 input precision",
        },
        {
          id: "triton-profiled-tile",
          description: "profiled Triton tile: 64x64x32, 4 warps, 3 stages",
        },
      ],
      metricGroups: [
        {
          label: "Compute",
          metrics: ["TFLOP/s", "p50 latency", "speedup vs PyTorch"],
        },
        {
          label: "Tile strategy",
          metrics: ["block M", "block N", "block K", "shared memory"],
        },
        {
          label: "Profiler",
          metrics: ["Tensor Core utilization", "occupancy", "register pressure"],
        },
      ],
      localCommands: [
        "uv run benchmark-matmul --backend all --device cuda --m 1024 --n 1024 --k 1024 --dtype float16",
      ],
      liveCommands: [
        "./scripts/benchmark --run-id <run-id> --include-matmul-sweep --with-profiling",
      ],
      pendingNextRuns: [
        {
          label: "Retune from profiler counters",
          command: "uv run benchmark-matmul --backend triton --device cuda --m 1024 --n 1024 --k 1024 --dtype float16 --block-m 128 --block-n 64 --block-k 32 --num-warps 8 --num-stages 3 --input-precision tf32",
          reason: "Use the measured occupancy, register, shared-memory, and Tensor Core counters to choose the next bounded tile change.",
        },
        {
          label: "Re-profile best tile",
          command: "./scripts/benchmark --run-id <run-id> --include-matmul-sweep --with-profiling",
          reason: "Profile the current best measured tile, not only the earlier 64x64x32 comparison point.",
        },
      ],
      resultEvidence: {
        title: "Triton tiling is active but not yet a cuBLAS win",
        statusLabel: "Selected report",
        reportDate: "2026-05-21",
        summary:
          "The strategy run found a best Triton tile at 25.74 TFLOP/s, while PyTorch/cuBLAS stayed around 30-31 TFLOP/s on the same A10G shape.",
        boundary:
          "This is progress evidence for the tiling track, not a claim that the custom matmul should replace the library baseline.",
        stats: [
          {
            label: "Best Triton tile",
            value: "25.74 TFLOP/s",
            context: "128x64x32, 8 warps, 3 stages, tf32 input precision",
          },
          {
            label: "PyTorch/cuBLAS",
            value: "30-31 TFLOP/s",
            context: "same 1024x1024x1024 float16 shape",
          },
          {
            label: "Profiled tile",
            value: "45.19% Tensor Core",
            context: "22.49% occupancy, 80 registers/thread, 16 KiB dynamic shared memory",
          },
        ],
      },
    },
    {
      projectId: "cuda-kernel-lab",
      slug: "kernel-h200-matmul-autotune",
      title: "H200 Matmul Autotune",
      category: "Tensor Core matmul",
      status: experimentStatus("Measured on H200", "Standard Triton trails PyTorch/cuBLAS"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "H200 matmul gap",
          tone: "selected",
        },
      },
      question:
        "Which Triton tiled-dot and persistent-wave schedules get closest to the PyTorch/cuBLAS H200 matmul baseline for LLM-shaped GEMMs?",
      cardSummary: "Standard tiled-dot closes most of the H200 gap, but persistent waves are not a win yet.",
      metricFocus: ["TFLOP/s", "Triton/Torch %", "Persistent waves"],
      summary:
        "Compares H200 PyTorch/cuBLAS against repeated Triton tiled-dot candidates, then tests whether persistent resident-program waves improve the focused 512x11008x4096 shape.",
      whyItMatters:
        "H200 matmul is the Tensor Core track that determines whether custom Triton GEMMs can become more than a tuning exercise. The current evidence is valuable because it shows a bounded gap and prevents overclaiming the new persistent scheduler.",
      runner: "H200 matmul autotune suite",
      endpoint: "benchmark --suite h200-matmul-autotune",
      sourcePath: "src/cuda_kernel_lab/kernels/triton/matmul.py",
      resultsPath: "experiments/reports/runpod/20260526-h200-persistent-waves-073234.md",
      runShapeSummary:
        "H200 512x11008x4096 focused sweep plus broader 512x4096x11008, 512x11008x4096, and 4096x4096x4096 winner profiling shapes across float16 and bfloat16.",
      cases: [
        {
          id: "h200-llm-down-512x11008x4096",
          description: "focused LLM down-projection GEMM used for standard and persistent-wave comparison",
          primaryMeasure: "512x11008x4096",
          secondaryMeasure: "float16 and bfloat16",
        },
        {
          id: "h200-llm-up-512x4096x11008",
          description: "asymmetric LLM up-projection GEMM from the clean winner profile sweep",
          primaryMeasure: "512x4096x11008",
          secondaryMeasure: "float16 and bfloat16",
        },
        {
          id: "h200-square-4096x4096x4096",
          description: "square Tensor Core GEMM from the clean winner profile sweep",
          primaryMeasure: "4096x4096x4096",
          secondaryMeasure: "float16 and bfloat16",
        },
      ],
      servingProfiles: [
        {
          id: "torch-baseline",
          description: "PyTorch/cuBLAS reference baseline on H200",
        },
        {
          id: "triton-standard-tiled-dot",
          description: "best measured standard Triton tiled-dot schedule",
        },
        {
          id: "triton-persistent-waves-1-4",
          description: "persistent tiled-dot schedule with one through four resident-program waves per SM",
        },
      ],
      metricGroups: [
        {
          label: "Compute",
          metrics: ["TFLOP/s", "p50 latency", "Triton/Torch %"],
        },
        {
          label: "Schedule",
          metrics: ["standard tiled-dot", "persistent waves", "group_m"],
        },
        {
          label: "Next proof",
          metrics: ["Tensor Core counters", "profile-counter access", "winner stability"],
        },
      ],
      localCommands: [
        "uv run benchmark-autotune --input-dir experiments/results/runpod/20260526-h200-persistent-waves-073234 --dry-run",
      ],
      liveCommands: [
        "./scripts/benchmark --run-id <run-id> --suite h200-matmul-autotune --matmul-autotune-schedules standard,persistent --matmul-autotune-persistent-waves 1,2,3,4 --with-profiling",
      ],
      pendingNextRuns: [
        {
          label: "Counter-enabled H200 profile",
          command: "./scripts/up --profile-counters",
          reason: "Current RunPod profiler reports hit NVIDIA performance-counter permission errors, so the next proof needs a host with counter access before Tensor Core utilization can explain the gap.",
        },
        {
          label: "Winner-only profile rerun",
          command: "./scripts/benchmark --run-id <run-id> --suite h200-matmul-autotune --with-profiling",
          reason: "Profile the selected H200 autotune winners after counter access is available instead of widening the schedule search first.",
        },
      ],
      resultEvidence: {
        title: "H200 matmul is bounded but not a replacement win",
        statusLabel: "Measured, caveated",
        reportDate: "2026-05-26",
        summary:
          "Clean H200 timing runs show best standard Triton tiled-dot rows around 88-90% of PyTorch/cuBLAS, while the latest persistent-wave sweep improves over one-wave variants but stays far behind the standard schedule.",
        boundary:
          "Use this as active gap-closing evidence, not a custom matmul win. The latest persistent-wave report is exploratory, and the canonical next step is a counter-enabled H200 profile for the selected winners.",
        boundaryPoints: [
          "The clean 2026-05-25 timing-only run reached 470.7 TFLOP/s bfloat16 and 462.0 TFLOP/s float16 for standard Triton on 512x11008x4096.",
          "The latest persistent-wave sweep reached 471.4 TFLOP/s bfloat16 for standard Triton on the same focused shape, with all 60 correctness checks passing.",
          "The best persistent wave-2 rows reached about 179 TFLOP/s, improving over one-wave persistent rows but remaining far below the standard tiled-dot schedule.",
        ],
        stats: [
          {
            label: "Clean focused bf16",
            value: "89.31%",
            context: "470.7 Triton TFLOP/s vs 527.1 torch on 512x11008x4096",
          },
          {
            label: "Latest focused bf16",
            value: "89.41%",
            context: "471.4 Triton TFLOP/s vs 527.3 torch in the persistent-wave sweep",
          },
          {
            label: "Persistent wave 2",
            value: "179.1 TFLOP/s",
            context: "best bf16 persistent row, still roughly one third of torch",
          },
        ],
        tables: [
          {
            title: "H200 focused matmul gap",
            columns: {
              target: "Dtype",
              outcome: "Current call",
              p95Latency: "Triton",
              peakWaiting: "Torch",
              gpuMax: "Triton/Torch",
            },
            rows: [
              {
                target: "bfloat16",
                outcome: "standard tiled-dot leads Triton",
                p95Latency: "470.7 TFLOP/s",
                peakWaiting: "527.1 TFLOP/s",
                gpuMax: "89.31%",
              },
              {
                target: "float16",
                outcome: "standard tiled-dot leads Triton",
                p95Latency: "462.0 TFLOP/s",
                peakWaiting: "520.4 TFLOP/s",
                gpuMax: "88.78%",
              },
            ],
          },
          {
            title: "Persistent-wave check",
            columns: {
              target: "Schedule",
              outcome: "Call",
              p95Latency: "Best Triton",
              peakWaiting: "Torch",
              gpuMax: "Boundary",
            },
            rows: [
              {
                target: "standard bf16",
                outcome: "current best",
                p95Latency: "471.4 TFLOP/s",
                peakWaiting: "527.3 TFLOP/s",
                gpuMax: "89.41%",
              },
              {
                target: "persistent wave 2 bf16",
                outcome: "measured non-win",
                p95Latency: "179.1 TFLOP/s",
                peakWaiting: "527.3 TFLOP/s",
                gpuMax: "below standard",
              },
              {
                target: "persistent waves 3-4 bf16",
                outcome: "measured non-win",
                p95Latency: "171.7-173.3 TFLOP/s",
                peakWaiting: "527.3 TFLOP/s",
                gpuMax: "below wave 2",
              },
            ],
          },
        ],
        sourceReports: [
          {
            label: "Clean timing-only H200 report",
            path: "experiments/reports/runpod/20260525-h200-timing-only-235601.md",
          },
          {
            label: "H200 winner profile report",
            path: "experiments/reports/runpod/20260525-h200-winner-profile-055211.md",
          },
          {
            label: "Persistent wave sweep",
            path: "experiments/reports/runpod/20260526-h200-persistent-waves-073234.md",
          },
        ],
      },
    },
    {
      projectId: "cuda-kernel-lab",
      slug: "kernel-decode-step-graph-replay",
      title: "Decode Step Graph Replay",
      category: "Decode scheduling",
      status: experimentStatus("Measured on A10G", "Resident-KV replay measured"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "Round 12 decode",
          tone: "selected",
        },
      },
      question:
        "How far can resident-KV same-stream piecewise CUDA Graph replay reduce dynamic decode-step latency before a custom attention kernel?",
      cardSummary: "Resident-KV graph replay is now measured and caveated.",
      metricFocus: ["p50 latency", "p95 tail", "Padding", "Correctness"],
      summary:
        "Tracks a synthetic decode step where fused pre/post regions replay as CUDA Graphs around SDPA attention with head-major resident KV views.",
      whyItMatters:
        "Decode replay connects kernel optimization to serving mechanics: the question shifts from one custom kernel to launch overhead, dynamic buckets, resident cache layout, and tail latency.",
      runner: "CUDA benchmark matrix",
      endpoint: "benchmark-decode-step",
      sourcePath: "src/cuda_kernel_lab/benchmarks/decode_step.py",
      resultsPath: "experiments/reports/aws-ec2/2026-05-22-round12-kv-active-views.md",
      runShapeSummary:
        "Fixed-shape and dynamic decode-step replay at max_batch_size=8, seq_len=2048, heads=16, head_dim=64, hidden_dim=1024, intermediate_dim=4096.",
      cases: [
        {
          id: "decode-step-fixed-same-stream",
          description: "fixed-shape same-stream piecewise CUDA Graph replay",
          primaryMeasure: "0.1375 ms p50",
          secondaryMeasure: "batch=1, seq_len=2048, float16",
        },
        {
          id: "decode-step-dynamic-dense-buckets",
          description: "dynamic same-stream graph replay with dense active-batch buckets",
          primaryMeasure: "0.155-0.158 ms p50",
          secondaryMeasure: "0.228-0.232 ms p95, zero padding",
        },
        {
          id: "decode-attention-baseline-context",
          description: "earlier PyTorch contiguous-KV attention baseline kept as context",
          primaryMeasure: "0.2273 ms p50",
          secondaryMeasure: "seq_len=2048, heads=16, head_dim=128",
        },
      ],
      servingProfiles: [
        {
          id: "naive-eager",
          description: "decomposed PyTorch decode step with eager launches",
        },
        {
          id: "fused-graph",
          description: "fused pre/post work replayed inside CUDA Graph capture",
        },
        {
          id: "dynamic-piecewise-graph-same-stream",
          description: "same-stream dynamic piecewise graph replay around SDPA attention",
        },
        {
          id: "torch-contiguous-kv-baseline",
          description: "PyTorch contiguous-KV attention baseline retained as the custom-kernel target",
        },
      ],
      metricGroups: [
        {
          label: "Latency",
          metrics: ["p50 latency", "p95 latency", "p99 latency", "p95/p50 noise"],
        },
        {
          label: "Scheduling",
          metrics: ["graph hit rate", "bucket policy", "padding waste", "scheduler p95"],
        },
        {
          label: "Replay path",
          metrics: ["resident KV views", "same-stream replay", "eager post-add", "correctness"],
        },
      ],
      localCommands: [
        "uv run benchmark-decode-step --dynamic-trace --mode all --device cuda --dtype float16 --attention-backend sdpa-head-major --dynamic-copy-mode resident --piecewise-post-mode eager --orchestration-timing off",
      ],
      liveCommands: [
        "./scripts/benchmark --run-id <run-id> --only-decode-step --include-decode-bucket-sweep --include-decode-tail-sweep --decode-attention-backend sdpa-head-major --decode-dynamic-copy-mode resident --decode-piecewise-post-mode eager --decode-orchestration-timing off --decode-tail-buckets '1,2,3,4,5,6,7,8'",
      ],
      pendingNextRuns: [
        {
          label: "Turn timing probes back on",
          command: "./scripts/benchmark --run-id <run-id> --only-decode-step --include-decode-bucket-sweep --decode-attention-backend sdpa-head-major --decode-dynamic-copy-mode resident --decode-piecewise-post-mode eager",
          reason: "Use per-region host timings to explain the remaining p95 tail before treating p50 as the whole story.",
        },
        {
          label: "Custom attention target",
          command: "uv run benchmark-attention --backend triton --device cuda --seq-len 2048 --num-heads 16 --head-dim 128 --dtype float16",
          reason: "Keep the 0.2273 ms contiguous-KV PyTorch baseline as the first custom attention target before paged-cache indirection.",
        },
      ],
      resultEvidence: {
        title: "Resident-KV graph replay defines the current decode upper bound",
        statusLabel: "Selected report",
        reportDate: "2026-05-22",
        summary:
          "Round 12 benchmarks resident head-major KV views, same-stream piecewise CUDA Graph replay, eager post-add, dense active-batch buckets, and hot-loop timing with orchestration probes off.",
        boundary:
          "Read this as a synthetic resident-KV upper bound, not an end-to-end serving result or a custom attention-kernel win. The p95 tail still deserves timing-probe and profiler follow-up.",
        stats: [
          {
            label: "Fixed-shape replay",
            value: "0.1375 ms",
            context: "same-stream piecewise graph p50 at batch=1, seq_len=2048",
          },
          {
            label: "Dynamic replay",
            value: "0.155-0.158 ms",
            context: "dense-bucket same-stream p50 across three tail seeds",
          },
          {
            label: "Tail",
            value: "0.228-0.232 ms",
            context: "p95 with zero padding and 27/27 correctness checks passing",
          },
          {
            label: "Attention baseline",
            value: "0.2273 ms",
            context: "earlier PyTorch contiguous-KV p50 target for a future custom kernel",
          },
        ],
        tables: [
          {
            title: "Decode replay progression",
            columns: {
              target: "Path",
              outcome: "Call",
              p95Latency: "p50",
              peakWaiting: "p95",
              gpuMax: "Boundary",
            },
            rows: [
              {
                target: "naive eager",
                outcome: "baseline",
                p95Latency: "0.3395 ms",
                peakWaiting: "0.3668 ms",
                gpuMax: "decomposed PyTorch",
              },
              {
                target: "fused graph",
                outcome: "supported",
                p95Latency: "0.1482 ms",
                peakWaiting: "0.1589 ms",
                gpuMax: "fixed shape",
              },
              {
                target: "same-stream piecewise graph",
                outcome: "measured",
                p95Latency: "0.1375 ms",
                peakWaiting: "0.1681 ms",
                gpuMax: "fixed shape",
              },
              {
                target: "dynamic dense buckets",
                outcome: "caveated",
                p95Latency: "0.155-0.158 ms",
                peakWaiting: "0.228-0.232 ms",
                gpuMax: "resident-KV upper bound",
              },
            ],
          },
        ],
        sourceReports: [
          {
            label: "Round 12 report",
            path: "experiments/reports/aws-ec2/2026-05-22-round12-kv-active-views.md",
          },
          {
            label: "Benchmark workflow",
            path: "docs/benchmark-workflow.md",
          },
          {
            label: "Strategy guide",
            path: "docs/optimization-strategies.md",
          },
          {
            label: "Attention baseline",
            path: "experiments/reports/aws-ec2/2026-05-21-strategy-next.md",
          },
        ],
      },
    },
    {
      projectId: "cuda-kernel-lab",
      slug: "kernel-profiler-validation",
      title: "Profiler Validation",
      category: "Profiler evidence",
      status: experimentStatus("Profiler summaries captured", "Profiler-backed interpretation ready"),
      readiness: {
        primary: {
          label: "Selected report",
          detail: "Nsight counters",
          tone: "selected",
        },
      },
      question:
        "Do Nsight Compute counters confirm or challenge the benchmark interpretation for memory, fusion, reduction, and matmul kernels?",
      cardSummary: "Profiler counters now explain the strongest win and active gaps.",
      metricFocus: ["DRAM throughput", "Occupancy", "Tensor Core use"],
      summary:
        "Tracks compact profiler summaries that explain why memory primitives trail, why RMSNorm is credible, and why matmul still needs tuning.",
      whyItMatters:
        "Benchmark numbers show what moved; profiler counters are what make the optimization explanation credible.",
      runner: "Nsight Compute summary workflow",
      endpoint: "nsight-summary",
      sourcePath: "src/cuda_kernel_lab/nsight_summary.py",
      resultsPath: "profiling/reports/2026-05-21-strategy-next/",
      runShapeSummary:
        "Focused profiler targets cover vector_add, reduction_sum, RMSNorm, and tiled matmul captures.",
      cases: [
        {
          id: "vector-add-float32-profile",
          description: "memory primitive profiler target",
          primaryMeasure: "vector_add",
          secondaryMeasure: "float32",
        },
        {
          id: "reduction-sum-float32-profile",
          description: "reduction strategy profiler target",
          primaryMeasure: "reduction_sum",
          secondaryMeasure: "float32",
        },
        {
          id: "rmsnorm-float16-profile",
          description: "largest fusion win profiler target",
          primaryMeasure: "RMSNorm",
          secondaryMeasure: "float16",
        },
        {
          id: "matmul-float16-profile",
          description: "Tensor Core tiling profiler target",
          primaryMeasure: "matmul",
          secondaryMeasure: "float16",
        },
      ],
      servingProfiles: [
        {
          id: "ncu-full",
          description: "Nsight Compute full counter set",
        },
        {
          id: "compact-report",
          description: "repo-committable markdown summary",
        },
      ],
      metricGroups: [
        {
          label: "Memory system",
          metrics: ["achieved memory throughput", "load/store efficiency", "cache behavior"],
        },
        {
          label: "Execution",
          metrics: ["occupancy", "registers per thread", "shared memory per block"],
        },
        {
          label: "Compute path",
          metrics: ["Tensor Core utilization", "instruction mix", "eligible warps"],
        },
      ],
      localCommands: [
        "uv run nsight-summary --input profiling/nsight_compute/<capture>.csv --output profiling/reports/<capture>.md",
      ],
      liveCommands: [
        "./scripts/benchmark --run-id <run-id> --with-profiling",
      ],
      pendingNextRuns: [
        {
          label: "Profile noisy RMSNorm rows",
          command: "./scripts/benchmark --run-id <run-id> --include-rmsnorm-shape-sweep --with-profiling",
          reason: "The smallest RMSNorm shape-sweep rows passed correctness but had enough noise to deserve a focused re-profile before precise claims.",
        },
        {
          label: "Profile best matmul tile",
          command: "./scripts/benchmark --run-id <run-id> --include-matmul-sweep --with-profiling",
          reason: "The committed profile explains one tile; the current best measured tile should get the same counter treatment before the next change.",
        },
      ],
      resultEvidence: {
        title: "Profiler counters turn benchmark results into optimization calls",
        statusLabel: "Selected report",
        reportDate: "2026-05-21",
        summary:
          "Compact Nsight summaries now cover memory, reduction, RMSNorm, and matmul targets from the strategy run.",
        boundary:
          "These counters explain the current claims; they do not make every faster p50 stable, and noisy rows still need reruns.",
        stats: [
          {
            label: "RMSNorm fp16",
            value: "90.91% DRAM",
            context: "93.12% occupancy, 40 registers/thread",
          },
          {
            label: "Vector add fp32",
            value: "91.58% DRAM",
            context: "81.80% occupancy, 26 registers/thread",
          },
          {
            label: "Matmul tile",
            value: "45.19% Tensor Core",
            context: "22.49% occupancy, 80 registers/thread",
          },
        ],
      },
    },
  ] satisfies ExperimentCatalogItem[],
};

export function experimentDetailPath(slug: string): string {
  return `/experiments/${slug}`;
}

export function experimentSourceLink(projectId: ProjectId, path: string): string {
  const repoBase =
    projectId === "cuda-kernel-lab" ? CUDA_KERNEL_REPO_BASE : GPU_INFERENCE_REPO_BASE;

  return `${repoBase}/${path}`;
}

export function getExperimentBySlug(slug: string): ExperimentCatalogItem | undefined {
  return experimentCatalogContent.experiments.find((item) => item.slug === slug);
}
