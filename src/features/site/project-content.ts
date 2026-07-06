export const projectContent = {
  title: "GPU Inference Decision Lab",
  lede:
    "An EKS/vLLM lab that turns serving measurements into architecture decisions for admission, autoscaling, context limits, scheduling, and quantization.",
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
  ],
  validation: {
    evidenceVisuals: [
      {
        title: "Queue attribution",
        takeaway:
          "vLLM timing separates queue, TTFT, and decode; admission removes queue inflation while decode stays roughly unchanged.",
        sourceLabel: "Server timing from May 17-18 direct and admission-capped long-context reports",
        columns: [
          {
            key: "queue",
            label: "p95 queue",
            max: 50,
            tone: "warning",
          },
          {
            key: "ttft",
            label: "p95 TTFT",
            max: 75,
            tone: "info",
          },
        ],
        rows: [
          {
            label: "1.10 req/s",
            context: "stable repeat; p95 decode 29.32s",
            values: {
              queue: {
                value: 0.285,
                label: "0.285s",
                tone: "success",
              },
              ttft: {
                value: 0.733,
                label: "0.733s",
                tone: "success",
              },
            },
          },
          {
            label: "1.15 req/s",
            context: "queueing repeat; p95 decode 29.41s",
            values: {
              queue: {
                value: 14.02,
                label: "14.02s",
              },
              ttft: {
                value: 18.12,
                label: "18.12s",
              },
            },
          },
          {
            label: "1.20 req/s",
            context: "queue-dominated; p95 decode 29.43s",
            values: {
              queue: {
                value: 36.93,
                label: "36.93s",
              },
              ttft: {
                value: 37.61,
                label: "37.61s",
              },
            },
          },
          {
            label: "1.25 admission",
            context: "59 unserved; p95 decode 29.39s",
            values: {
              queue: {
                value: 0.285,
                label: "0.285s",
                tone: "success",
              },
              ttft: {
                value: 0.718,
                label: "0.718s",
                tone: "success",
              },
            },
          },
        ],
      },
    ],
  },
};
