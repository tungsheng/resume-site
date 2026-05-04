export const experimentsContent = {
  title: "Experiment Archive",
  subtitle:
    "Evaluation runs comparing baseline posture, autoscaling policy, and active-pressure target calibration.",
  summaryIntro:
    "Each run isolates one rollout trade-off. Choose one below for the current call and proof.",
  tradeoffCards: [
    {
      title: "Warm baseline",
      left: "Idle cost",
      right: "First response",
    },
    {
      title: "Scale-out signal",
      left: "Burst spend",
      right: "Replica 2 speed",
    },
    {
      title: "Target tuning",
      left: "Aggressive target",
      right: "Readable metrics",
    },
  ],
  decisionLead: "Choose a decision. The current call and supporting detail appear underneath.",
  decisionCards: [
    {
      id: "profile-baselines",
      title: "Warm baseline",
      summary: "0 ready vs 1 ready path",
      recommendation: "Keep 1 warm path",
      readout: "93s vs 423s",
      status: "Strong recommendation",
      tone: "strong",
    },
    {
      id: "policy-compare",
      title: "Scale-out signal",
      summary: "running vs active-pressure",
      recommendation: "Use active-pressure",
      readout: "564s vs 989s",
      status: "Measured compare run",
      tone: "measured",
    },
    {
      id: "target-calibration",
      title: "Target tuning",
      summary: "target 4 vs 6/8",
      recommendation: "Keep target 4",
      readout: "952s at $0.484",
      status: "Provisional; metrics incomplete",
      tone: "provisional",
    },
  ],
  decisionLegend:
    "warm-1 = 1 ready path · zero-idle = 0 ready paths · target N = HPA request threshold",
  experimentSets: [
    {
      id: "profile-baselines",
      title: "Warm baseline",
      summary: "First-response tradeoff: zero-idle vs one warm path.",
    },
    {
      id: "policy-compare",
      title: "Scale-out policy",
      summary: "Second-replica tradeoff after the warm baseline is chosen.",
    },
    {
      id: "target-calibration",
      title: "Target tuning",
      summary: "Latest zero-idle sweep: keep 4 until the efficiency readout is complete.",
    },
  ],
  profileComparison: {
    title: "Zero-idle vs warm baseline (warm-1)",
    questionTitle: "Does one warm path justify its idle cost?",
    question:
      "Zero-idle avoids hourly idle spend, but the first public response waits 423 seconds.",
    takeawayTitle: "One warm path sharply reduces the first public wait",
    takeaway:
      "Warm baseline reaches the first public response in 93 seconds instead of 423, at an idle cost of $0.526 per hour.",
    note:
      "Focus on first response, idle cost, and burst cost. Lower is better.",
    spotlightStats: [
      {
        label: "First response",
        value: "93s vs 423s",
        context: "Warm baseline vs zero-idle",
      },
      {
        label: "Idle cost",
        value: "$0.526 / hr",
        context: "Steady cost to keep one path warm",
      },
      {
        label: "Burst cost",
        value: "$0.439 vs $0.484",
        context: "Warm baseline vs zero-idle",
      },
    ],
  },
  policyComparison: {
    title: "Warm baseline compare: running vs active-pressure",
    questionTitle: "Which signal gets the second replica ready sooner?",
    question:
      "With one path already warm, the remaining problem is slow scale-out to replica two.",
    takeawayTitle: "Active-pressure is the faster measured signal",
    takeaway:
      "Active-pressure reaches the second ready replica in 564 seconds vs 989 for running-request. Burst cost rises by about $0.038 and p95 TTFT stays effectively flat.",
    note:
      "Focus on second-replica time, burst cost, and p95 TTFT.",
    spotlightStats: [
      {
        label: "Second replica",
        value: "564s vs 989s",
        context: "Active-pressure vs running-request",
      },
      {
        label: "Burst cost delta",
        value: "+$0.038",
        context: "Increase in the measured compare run",
      },
      {
        label: "p95 TTFT",
        value: "89 ms vs 96 ms",
        context: "Effectively flat latency",
      },
    ],
    rows: [
      {
        label: "Second ready replica",
        running: "989s",
        activePressure: "564s",
        runningValue: 989,
        activePressureValue: 564,
        betterWhen: "lower",
      },
      {
        label: "Burst cost / run",
        running: "$0.401",
        activePressure: "$0.439",
        runningValue: 0.401513,
        activePressureValue: 0.439356,
        betterWhen: "lower",
      },
      {
        label: "p95 time to first token (TTFT)",
        running: "96 ms",
        activePressure: "89 ms",
        runningValue: 96,
        activePressureValue: 89,
        betterWhen: "lower",
      },
    ],
  },
  targetCalibration: {
    title: "Zero-idle active-pressure target sweep",
    questionTitle: "Which target is safe to recommend now?",
    question:
      "For zero-idle, the target should stay conservative until the GPU-efficiency readout is complete enough to justify retuning.",
    takeawayTitle: "Keep target 4 until metric coverage improves",
    takeaway:
      "The May 1 sweep marks every target as unknown because GPU efficiency fields were unavailable. Target 4 remains the safest recommendation: it has complete latency and queue fields, zero peak waiting requests, and nearly the same burst cost as target 2.",
    note:
      "Focus on second-replica time, burst cost, queue evidence, and metric completeness. Target 8 is excluded because latency, queue, throughput, and GPU metrics were unavailable.",
    spotlightStats: [
      {
        label: "Recommendation",
        value: "Target 4",
        context: "Provisional recommendation from the May 1 sweep",
      },
      {
        label: "Sweep status",
        value: "Unknown",
        context: "GPU efficiency fields were unavailable",
      },
      {
        label: "Burst cost",
        value: "$0.484",
        context: "Measured at the recommended target",
      },
    ],
    runs: [
      {
        label: "Target 2",
        secondReadySeconds: 936,
        burstCost: 0.483627,
        peakActiveRequestsPerGpuNode: 85.333,
      },
      {
        label: "Target 4",
        secondReadySeconds: 952,
        burstCost: 0.484213,
        peakActiveRequestsPerGpuNode: 128,
      },
      {
        label: "Target 6",
        secondReadySeconds: 940,
        burstCost: 0.487573,
        peakActiveRequestsPerGpuNode: 128,
      },
      {
        label: "Target 8",
        secondReadySeconds: 921,
        burstCost: 0.653409,
        peakActiveRequestsPerGpuNode: null,
      },
    ],
  },
  profiles: [
    {
      id: "zero-idle",
      label: "Zero-idle",
      reportDate: "2026-05-01",
      firstPublicResponseSeconds: 423,
      secondReadySeconds: 1103,
      idleCostPerHour: 0,
      burstCost: 0.484066,
      burstTimeToFirstTokenSeconds: 0.09,
      timeline: [
        { label: "First NodeClaim", seconds: 13 },
        { label: "First GPU node", seconds: 37 },
        { label: "First ready replica", seconds: 413, emphasis: true },
        { label: "First public response", seconds: 423, emphasis: true },
        { label: "Horizontal Pod Autoscaler (HPA) desired replicas = 2", seconds: 460 },
        { label: "Second ready replica", seconds: 1103 },
        { label: "Cleanup to zero GPU nodes", seconds: 2140 },
      ],
      proofExcerpt: {
        title: "active-pressure run",
        command: "./scripts/evaluate --profile zero-idle --policy active-pressure",
        lines: [
          "[13s] First NodeClaim created",
          "[37s] First GPU node registered",
          "[413s] First ready replica",
          "[423s] First public response",
          "[460s] Horizontal Pod Autoscaler (HPA) desired replicas = 2",
          "[485s] Second GPU node registered",
          "[1103s] Second ready replica",
          "[2140s] Final cleanup to zero GPU nodes",
        ],
      },
    },
    {
      id: "warm-1",
      label: "Warm baseline (warm-1)",
      reportDate: "2026-05-01",
      firstPublicResponseSeconds: 93,
      secondReadySeconds: 564,
      idleCostPerHour: 0.526,
      burstCost: 0.439356,
      burstTimeToFirstTokenSeconds: 0.08931666666666666,
      timeline: [
        { label: "Warm baseline already present", seconds: 0, emphasis: true },
        { label: "First ready replica", seconds: 82, emphasis: true },
        { label: "First public response", seconds: 93, emphasis: true },
        { label: "Horizontal Pod Autoscaler (HPA) desired replicas = 2", seconds: 142 },
        { label: "Second GPU node", seconds: 166 },
        { label: "Second ready replica", seconds: 564 },
        { label: "Warm baseline restored", seconds: 1370 },
      ],
      proofExcerpt: {
        title: "active-pressure run (target 6)",
        command: "./scripts/evaluate --profile warm-1 --policy active-pressure --active-target 6",
        lines: [
          "[0s] Warm baseline already present",
          "[82s] First ready replica",
          "[93s] First public response",
          "[142s] Horizontal Pod Autoscaler (HPA) desired replicas = 2",
          "[166s] Second GPU node registered",
          "[564s] Second ready replica",
          "[1370s] Warm baseline restored",
        ],
      },
    },
  ],
  evidenceExcerpts: [
    {
      title: "Warm baseline compare",
      subtitle: "compare report (target 6)",
      reportDate: "2026-05-01",
      command: "./scripts/evaluate --profile warm-1 --policy compare --active-target 6",
      lines: [
        "Second ready replica: running 989s vs active-pressure 564s",
        "Burst cost: running $0.401513 vs active-pressure $0.439356",
        "p95 TTFT: running 96 ms vs active-pressure 89 ms",
      ],
    },
    {
      title: "Zero-idle sweep summary",
      subtitle: "active-pressure target sweep (recommendation is provisional)",
      reportDate: "2026-05-01",
      command: "./scripts/evaluate --profile zero-idle --policy sweep --active-targets 2,4,6,8",
      lines: [
        "Recommended target: 4",
        "Recommendation status: unknown",
        "Target 4 second ready replica: 952s; burst cost: $0.484213",
        "Target 6 second ready replica: 940s; burst cost: $0.487573",
        "Target 8 second ready replica: 921s; latency and queue metrics unavailable",
      ],
    },
  ],
};
