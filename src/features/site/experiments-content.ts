import type { ExperimentProfile, MetricPoint, NarrativeCard } from "./types";

export const experimentsContent = {
  eyebrow: "Evidence and measurements",
  title: "Zero-Idle vs Warm Baseline",
  subtitle:
    "These results come from checked-in evaluate reports dated April 13, 2026 (warm-1) and April 15, 2026 (zero-idle).",
  conclusionPoints: [
    {
      label: "Warm-1 first public response",
      value: "1m 24s",
      detail: "5m 57s faster than the zero-idle profile on first real traffic.",
    },
    {
      label: "Zero-idle idle cost / hour",
      value: "$0.00",
      detail: "No standing GPU cost while the queue is empty.",
    },
    {
      label: "Burst TTFT once warm",
      value: "91–107 ms",
      detail: "Similar across profiles after capacity is already ready to serve.",
    },
  ] satisfies MetricPoint[],
  decisionBullets: [
    "Warm-1 is the clear choice when first-hit responsiveness matters.",
    "Zero-idle is the cost floor when long idle periods dominate.",
    "Burst TTFT is useful, but it is a secondary metric after capacity is already available.",
  ],
  methodology: [
    {
      title: "What the reports measure",
      body:
        "The key cold-start metrics are first ready replica and first public response. Those capture the real wait a first user feels when capacity has to appear from scratch.",
    },
    {
      title: "How to read TTFT",
      body:
        "Burst time to first token is still useful, but it reflects serving behavior once the system is already warm enough to process admitted work.",
    },
    {
      title: "Why the dates matter",
      body:
        "Each number shown here comes from a checked-in evaluate run, which keeps the story tied to specific experiment snapshots instead of anecdotal observations.",
    },
  ] satisfies NarrativeCard[],
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
    "Cold-start evaluation should lead with first ready replica and first public response, not TTFT.",
    "Warm-1 materially improves first-user responsiveness because one serving path is already online before burst load arrives.",
    "Zero-idle remains attractive when long idle periods dominate and the business can tolerate multi-minute cold-start latency.",
  ],
};
