export const experimentsContent = {
  title: "Experiment Archive",
  subtitle:
    "Checked-in evaluation runs for comparing baseline posture, autoscaling policy, and active-pressure target calibration.",
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
      title: "Active target",
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
      readout: "84s vs 447s",
      status: "Strong recommendation",
      tone: "strong",
    },
    {
      id: "policy-compare",
      title: "Scale-out signal",
      summary: "running vs active-pressure",
      recommendation: "Use active-pressure",
      readout: "563s vs 1002s",
      status: "Measured compare run",
      tone: "measured",
    },
    {
      id: "target-calibration",
      title: "Active target",
      summary: "default 4 -> recommend 6",
      recommendation: "Recommend target 6",
      readout: "930s at $0.483",
      status: "Provisional",
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
      title: "Active target tuning",
      summary: "Latest zero-idle sweep: keep 4 or move toward 6?",
    },
  ],
  profileComparison: {
    title: "Zero-idle vs warm baseline (warm-1)",
    questionTitle: "Does one warm path justify its idle cost?",
    question:
      "Zero-idle avoids hourly idle spend, but the first public response waits 447 seconds.",
    takeawayTitle: "One warm path sharply reduces the first public wait",
    takeaway:
      "Warm baseline reaches the first public response in 84 seconds instead of 447, at an idle cost of $0.526 per hour.",
    note:
      "Focus on first response, idle cost, and burst cost. Lower is better.",
    spotlightStats: [
      {
        label: "First response",
        value: "84s vs 447s",
        context: "Warm baseline vs zero-idle",
      },
      {
        label: "Idle cost",
        value: "$0.526 / hr",
        context: "Steady cost to keep one path warm",
      },
      {
        label: "Burst cost",
        value: "$0.438 vs $0.490",
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
      "Active-pressure reaches the second ready replica in 563 seconds vs 1002 for running-request. Burst cost rises by about $0.037 and p95 TTFT stays flat.",
    note:
      "Focus on second-replica time, burst cost, and p95 TTFT.",
    spotlightStats: [
      {
        label: "Second replica",
        value: "563s vs 1002s",
        context: "Active-pressure vs running-request",
      },
      {
        label: "Burst cost delta",
        value: "+$0.037",
        context: "Increase in the measured compare run",
      },
      {
        label: "p95 TTFT",
        value: "90 ms vs 91 ms",
        context: "Effectively flat latency",
      },
    ],
    rows: [
      {
        label: "Second ready replica",
        running: "1002s",
        activePressure: "563s",
        runningValue: 1002,
        activePressureValue: 563,
        betterWhen: "lower",
      },
      {
        label: "Burst cost / run",
        running: "$0.401",
        activePressure: "$0.438",
        runningValue: 0.401,
        activePressureValue: 0.438,
        betterWhen: "lower",
      },
      {
        label: "p95 time to first token (TTFT)",
        running: "91 ms",
        activePressure: "90 ms",
        runningValue: 91,
        activePressureValue: 90,
        betterWhen: "lower",
      },
    ],
  },
  targetCalibration: {
    title: "Zero-idle active-pressure target sweep",
    questionTitle: "Which active target is safe to recommend now?",
    question:
      "For zero-idle, the target should keep scale-out data usable without paying more burst cost for no clear gain.",
    takeawayTitle: "Target 6 is the best supported recommendation",
    takeaway:
      "Target 6 is slightly cheaper than 2 or 4 and keeps supporting metrics intact. Target 8 looked better in the raw run, but its supporting metrics dropped.",
    note:
      "Focus on second-replica time and burst cost. Target 8 is omitted because supporting metrics were missing.",
    spotlightStats: [
      {
        label: "Recommendation",
        value: "Target 6",
        context: "Best supported in the April 21, 2026 sweep",
      },
      {
        label: "Repo default",
        value: "Target 4",
        context: "Still checked in today",
      },
      {
        label: "Burst cost",
        value: "$0.483",
        context: "Measured at the recommended target",
      },
    ],
    runs: [
      {
        label: "Active target 2",
        secondReadySeconds: 914,
        burstCost: 0.487280,
        peakActiveRequestsPerGpuNode: 85.333,
      },
      {
        label: "Active target 4",
        secondReadySeconds: 951,
        burstCost: 0.491372,
        peakActiveRequestsPerGpuNode: 128,
      },
      {
        label: "Active target 6",
        secondReadySeconds: 930,
        burstCost: 0.483189,
        peakActiveRequestsPerGpuNode: 128,
      },
    ],
  },
  profiles: [
    {
      id: "zero-idle",
      label: "Zero-idle",
      reportDate: "2026-04-20",
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
        { label: "Horizontal Pod Autoscaler (HPA) desired replicas = 2", seconds: 485 },
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
          "[485s] Horizontal Pod Autoscaler (HPA) desired replicas = 2",
          "[510s] Second GPU node registered",
          "[899s] Second ready replica",
          "[2168s] Final cleanup to zero GPU nodes",
        ],
      },
    },
    {
      id: "warm-1",
      label: "Warm baseline (warm-1)",
      reportDate: "2026-04-20",
      firstPublicResponseSeconds: 84,
      secondReadySeconds: 563,
      idleCostPerHour: 0.526,
      burstCost: 0.438041,
      burstTimeToFirstTokenSeconds: 0.09026666666666668,
      timeline: [
        { label: "Warm baseline already present", seconds: 0, emphasis: true },
        { label: "First ready replica", seconds: 73, emphasis: true },
        { label: "First public response", seconds: 84, emphasis: true },
        { label: "Horizontal Pod Autoscaler (HPA) desired replicas = 2", seconds: 125 },
        { label: "Second GPU node", seconds: 152 },
        { label: "Second ready replica", seconds: 563 },
        { label: "Warm baseline restored", seconds: 1361 },
      ],
      proofExcerpt: {
        title: "active-pressure run (target 8)",
        command: "./scripts/evaluate --profile warm-1 --policy active-pressure --active-target 8",
        lines: [
          "[0s] Warm baseline already present",
          "[73s] First ready replica",
          "[84s] First public response",
          "[125s] Horizontal Pod Autoscaler (HPA) desired replicas = 2",
          "[152s] Second GPU node registered",
          "[563s] Second ready replica",
          "[1361s] Warm baseline restored",
        ],
      },
    },
  ],
  evidenceExcerpts: [
    {
      title: "Warm baseline compare",
      subtitle: "compare report (active target 8)",
      reportDate: "2026-04-20",
      command: "./scripts/evaluate --profile warm-1 --policy compare --active-target 8",
      lines: [
        "Second ready replica: running 1002s vs active-pressure 563s",
        "Burst cost: running $0.401075 vs active-pressure $0.438041",
        "p95 TTFT: running 91 ms vs active-pressure 90 ms",
      ],
    },
    {
      title: "Zero-idle sweep summary",
      subtitle: "active-pressure target sweep (recommendation is provisional)",
      reportDate: "2026-04-21",
      command: "./scripts/evaluate --profile zero-idle --policy sweep --active-targets 2,4,6,8",
      lines: [
        "Recommended active target: 6",
        "Checked-in active-pressure manifest target: 4",
        "Target 4 second ready replica: 951s; burst cost: $0.491372",
        "Target 6 second ready replica: 930s; burst cost: $0.483189",
        "Target 8 second ready replica: 885s; supporting metrics unavailable",
      ],
    },
  ],
};
