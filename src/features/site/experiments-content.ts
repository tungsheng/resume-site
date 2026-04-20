import type { ExperimentProfile, HighlightCard, MetricPoint, NarrativeCard } from "./types";

export const experimentsContent = {
  title: "Experiment Archive",
  subtitle:
    "Checked-in evaluate runs across profile baselines, policy compare, and active-pressure target calibration. Latest local artifacts were generated on April 20, 2026 from runs completed on April 18-19, 2026.",
  conclusionPoints: [
    {
      label: "Warm-1 first public response",
      value: "84s",
      detail: "Versus 447s in the latest zero-idle active-pressure run.",
    },
    {
      label: "Warm-1 compare second replica",
      value: "563s",
      detail: "Versus 1002s for the running baseline in the latest compare run.",
    },
    {
      label: "Target 4 second replica",
      value: "893s",
      detail: "Versus 924s for active-target 2 in the zero-idle calibration runs.",
    },
  ] satisfies MetricPoint[],
  decisionBullets: [
    "Use the project page for architecture and conclusions; use this page for run-level evidence.",
    "The current experiment families are profile baselines, policy compare, and target calibration.",
    "Each section below maps to checked-in evaluate artifacts from the local gpu-inference-lab repo.",
  ],
  experimentSets: [
    {
      title: "Profile baselines",
      summary: "Compare zero-idle and warm-1 to understand cold-start latency and standing GPU cost.",
      bullets: [
        "First public response: 447s vs 84s",
        "Idle cost per hour: $0.00 vs $0.526",
        "Answers whether one warm serving path is worth the steady cost.",
      ],
      href: "#profile-comparison",
      ctaLabel: "Open profile comparison",
    },
    {
      title: "Policy compare",
      summary: "Run running-request and active-pressure HPAs against the same warm-1 burst workload.",
      bullets: [
        "Second ready replica: 1002s vs 563s",
        "Burst cost: $0.401 vs $0.438",
        "Answers whether queue pressure improves scale-out timing enough to justify the tradeoff.",
      ],
      href: "#policy-compare",
      ctaLabel: "Open policy compare",
    },
    {
      title: "Target calibration",
      summary: "Sweep active-pressure targets to see how zero-idle scale-out changes under the same burst.",
      bullets: [
        "Target 2 second replica: 924s",
        "Target 4 second replica: 893s",
        "Answers where active requests per pod start to look healthier for this node shape.",
      ],
      href: "#target-calibration",
      ctaLabel: "Open target calibration",
    },
  ] satisfies HighlightCard[],
  methodology: [
    {
      title: "What each experiment changes",
      body:
        "Profile runs change the baseline capacity posture, policy compare changes the HPA signal, and target calibration changes the active-pressure target while keeping the workload shape the same.",
    },
    {
      title: "Which metrics matter most",
      body:
        "For this repo, first public response and second ready replica carry most of the story. TTFT remains useful, but only after capacity is already present to serve work.",
    },
    {
      title: "Why checked-in artifacts matter",
      body:
        "Each section below is tied to a specific evaluate artifact, which keeps the evidence page grounded in real runs rather than a restated summary from the case study page.",
    },
  ] satisfies NarrativeCard[],
  policyComparison: {
    title: "Warm-1 policy compare",
    subtitle:
      "Both runs use the warm-1 profile and differ only in which custom metric the HPA follows.",
    rows: [
      {
        label: "Second ready replica",
        running: "1002s",
        activePressure: "563s",
      },
      {
        label: "Burst cost / run",
        running: "$0.401",
        activePressure: "$0.438",
      },
      {
        label: "Average completed req/s",
        running: "2.31",
        activePressure: "2.49",
      },
      {
        label: "p95 TTFT",
        running: "91 ms",
        activePressure: "90 ms",
      },
    ],
  },
  targetCalibration: {
    title: "Zero-idle target calibration",
    subtitle:
      "These runs keep the zero-idle profile and compare active-pressure targets under the same burst shape.",
    runs: [
      {
        label: "Active target 2",
        value: "924s",
        detail: "Second ready replica with burst cost $0.485 and peak active requests per GPU node of 85.333.",
      },
      {
        label: "Active target 4",
        value: "893s",
        detail: "Second ready replica with burst cost $0.489 and peak active requests per GPU node of 128.000.",
      },
    ] satisfies MetricPoint[],
  },
  profiles: [
    {
      id: "zero-idle",
      label: "Zero Idle",
      reportDate: "2026-04-20",
      baselineGpuState: "0 GPU nodes",
      firstReadySeconds: 437,
      firstPublicResponseSeconds: 447,
      secondReadySeconds: 899,
      idleCostPerHour: 0,
      burstCost: 0.490203,
      burstTimeToFirstTokenSeconds: 0.13243749999999987,
      timeline: [
        { label: "First NodeClaim", seconds: 12 },
        { label: "First GPU node", seconds: 35 },
        { label: "First ready replica", seconds: 437, emphasis: true },
        { label: "First public response", seconds: 447, emphasis: true },
        { label: "HPA desired replicas = 2", seconds: 485 },
        { label: "Second ready replica", seconds: 899 },
        { label: "Cleanup to zero GPU nodes", seconds: 2168 },
      ],
      proofExcerpt: {
        title: "active-pressure run",
        command: "./scripts/evaluate --profile zero-idle --policy active-pressure",
        lines: [
          "[12s] First NodeClaim created",
          "[35s] First GPU node registered",
          "[437s] First ready replica",
          "[447s] First public response",
          "[485s] HPA desired replicas = 2",
          "[510s] Second GPU node registered",
          "[899s] Second ready replica",
          "[2168s] Final cleanup to zero GPU nodes",
        ],
      },
    },
    {
      id: "warm-1",
      label: "Warm-1",
      reportDate: "2026-04-20",
      baselineGpuState: "1 warm on-demand serving node",
      firstReadySeconds: 73,
      firstPublicResponseSeconds: 84,
      secondReadySeconds: 563,
      idleCostPerHour: 0.526,
      burstCost: 0.438041,
      burstTimeToFirstTokenSeconds: 0.09026666666666668,
      timeline: [
        { label: "Warm baseline already present", seconds: 0, emphasis: true },
        { label: "First ready replica", seconds: 73, emphasis: true },
        { label: "First public response", seconds: 84, emphasis: true },
        { label: "HPA desired replicas = 2", seconds: 125 },
        { label: "Second GPU node", seconds: 152 },
        { label: "Second ready replica", seconds: 563 },
        { label: "Warm baseline restored", seconds: 1361 },
      ],
      proofExcerpt: {
        title: "active-pressure run",
        command: "./scripts/evaluate --profile warm-1 --policy active-pressure --active-target 8",
        lines: [
          "[0s] Warm baseline already present",
          "[73s] First ready replica",
          "[84s] First public response",
          "[125s] HPA desired replicas = 2",
          "[152s] Second GPU node registered",
          "[563s] Second ready replica",
          "[1361s] Warm baseline restored",
        ],
      },
    },
  ] satisfies ExperimentProfile[],
  evidenceExcerpts: [
    {
      title: "Warm-1 compare",
      subtitle: "compare report",
      reportDate: "2026-04-20",
      command: "./scripts/evaluate --profile warm-1 --policy compare --active-target 8",
      lines: [
        "Second ready replica: running 1002s vs active-pressure 563s",
        "Burst cost: running $0.401075 vs active-pressure $0.438041",
        "Average completed req/s: running 2.3066 vs active-pressure 2.4875",
      ],
    },
    {
      title: "Zero-idle target 2",
      subtitle: "active-pressure target calibration",
      reportDate: "2026-04-18",
      command: "./scripts/evaluate --profile zero-idle --policy sweep --active-targets 2,4",
      lines: [
        "Target 2 second ready replica: 924s",
        "Burst cost: $0.485089",
        "Peak active requests per GPU node: 85.333",
      ],
    },
    {
      title: "Zero-idle target 4",
      subtitle: "active-pressure target calibration",
      reportDate: "2026-04-18",
      command: "./scripts/evaluate --profile zero-idle --policy sweep --active-targets 2,4",
      lines: [
        "Target 4 second ready replica: 893s",
        "Burst cost: $0.488888",
        "Peak active requests per GPU node: 128.000",
      ],
    },
  ],
  notes: [
    "This page is most useful when you want to inspect which experiment answered which question, not when you want the architectural summary.",
    "Warm-1 remains the strongest latency lever, but policy compare and target calibration answer different questions than the baseline profile comparison.",
    "The next evidence milestone is better GPU-efficiency and queue instrumentation, not more proof that the cluster can launch nodes.",
  ],
};
