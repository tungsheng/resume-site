export const experimentsContent = {
  title: "Experiment Archive",
  subtitle:
    "Checked-in evaluation runs for comparing baseline posture, autoscaling policy, and active-pressure target calibration.",
  readoutsMeta:
    "Latest local gpu-inference-lab artifacts were generated on April 21, 2026 from runs completed on April 19-21, 2026.",
  summaryLead:
    "The current evidence separates the large decision from the tuning decisions. Keeping one warm serving path changes the first response dramatically, while policy and target changes mostly affect how quickly the second replica arrives.",
  conclusionPoints: [
    {
      eyebrow: "First response",
      label: "Keep one warm path when first response matters",
      value: "84s vs 447s",
      detail:
        "Warm-1 reaches the first public response 363s sooner than zero-idle, with a steady idle cost of $0.526 per hour.",
    },
    {
      eyebrow: "Scale-out policy",
      label: "Use active-pressure after choosing warm-1",
      value: "563s vs 1002s",
      detail:
        "With warm-1 already in place, active-pressure brings the second ready replica online 439s sooner for about $0.037 more burst cost.",
    },
    {
      eyebrow: "Target tuning",
      label: "Use target 6 as the current default",
      value: "930s at $0.483",
      detail:
        "The April 21, 2026 sweep points to target 6 as the safest usable default. Target 8 was faster at 885s, but its supporting metrics were incomplete.",
    },
  ],
  guideCards: [
    {
      title: "How to use this page",
      body: "Start with these three takeaways if you only need the recommendation. Then move into the experiment family that matches your question: warm-path cost, autoscaling policy, or active-pressure target tuning.",
    },
    {
      title: "What to compare",
      body: "Lower time and lower cost are better. Idle cost matters between bursts, burst cost matters during the run, and TTFT stays roughly flat across these experiments, so the biggest differences are readiness and scale-out timing.",
    },
  ],
  experimentSets: [
    {
      id: "profile-baselines",
      title: "Warm path",
      summary:
        "Decide whether paying for one warm serving path is worth avoiding the long first cold start.",
    },
    {
      id: "policy-compare",
      title: "Scale-out policy",
      summary:
        "After choosing warm-1, compare which scaling signal gets the second replica online sooner.",
    },
    {
      id: "target-calibration",
      title: "Target tuning",
      summary:
        "After fixing zero-idle, choose the safest active-pressure target from the latest sweep.",
    },
  ],
  profileComparison: {
    title: "Zero-idle vs warm-1",
    questionTitle: "Is warm capacity worth paying for?",
    question:
      "This is the baseline decision: do we accept a steady idle cost to avoid the long cold-start delay on the first public request?",
    takeawayTitle: "Warm-1 removes the main first-response bottleneck",
    takeaway:
      "Warm-1 cuts first public response from 447s to 84s. The trade is paying to keep one serving path warm between bursts, not a much larger burst cost during the run.",
    note:
      "Lower bars are better for time and cost. Warm-1 clearly wins on latency, while zero-idle only wins on steady idle spend.",
  },
  policyComparison: {
    title: "Warm-1: running vs active-pressure",
    questionTitle: "Which scaling signal solves slower second-replica arrival?",
    question:
      "Once warm-1 is chosen, the next problem is slower scale-out. This experiment asks which HPA signal gets the second replica online sooner without creating a new latency issue.",
    takeawayTitle: "Active-pressure is the better signal for faster scale-out",
    takeaway:
      "Active-pressure brings the second ready replica online 439s sooner, while p95 TTFT stays effectively flat. The trade is a modest increase in burst cost.",
    note:
      "This chart is about scale-out behavior, not cold-start avoidance. Lower time and cost are better here; higher completed requests per second is better.",
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
        label: "Average completed req/s",
        running: "2.31",
        activePressure: "2.49",
        runningValue: 2.31,
        activePressureValue: 2.49,
        betterWhen: "higher",
      },
      {
        label: "p95 TTFT",
        running: "91 ms",
        activePressure: "90 ms",
        runningValue: 91,
        activePressureValue: 90,
        betterWhen: "lower",
      },
    ],
  },
  targetCalibration: {
    title: "Zero-idle active-target sweep",
    questionTitle: "Which active target is the safest default right now?",
    question:
      "Once zero-idle is fixed, this sweep asks where the active-pressure target should land: low enough to keep the readout complete, but not so low that burst cost and scaling behavior suffer unnecessarily.",
    takeawayTitle: "Target 6 is the current default, but the sweep is still incomplete",
    takeaway:
      "The sweep currently recommends target 6. Target 8 was faster and cheaper in the raw run, but it dropped supporting metrics, so 6 is the safest usable default. Target 2 was slightly faster than 6 on second ready replica timing, but cost more.",
    note:
      "Lower time and cost are better. This chart only shows targets 2, 4, and 6 because target 8 lost supporting metrics in the latest sweep.",
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
      label: "Zero Idle",
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
  ],
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
      title: "Zero-idle sweep summary",
      subtitle: "active-pressure target sweep",
      reportDate: "2026-04-21",
      command: "./scripts/evaluate --profile zero-idle --policy sweep --active-targets 2,4,6,8",
      lines: [
        "Recommended active target: 6",
        "Target 2 second ready replica: 914s; burst cost: $0.487280",
        "Target 6 second ready replica: 930s; burst cost: $0.483189",
        "Target 8 second ready replica: 885s; supporting metrics unavailable",
      ],
    },
  ],
};
