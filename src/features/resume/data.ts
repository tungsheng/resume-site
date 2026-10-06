import type { ResumeData } from "./types";

export const publicResumeData: ResumeData = {
  header: {
    name: "Tony Lee",
    badges: ["Staff Full-Stack Engineer → ML Inference"],
    contacts: {
      email: "tungsheng@gmail.com",
      linkedin: "tonyslee8",
      website: "tonylee.bio",
    },
    summary:
      "Staff-level software engineer with 10+ years delivering production applications and APIs, leading cross-regional architecture, and improving performance. Transitioning into LLM inference performance through self-directed GPU labs: reproducible vLLM serving benchmarks, queue/TTFT/decode analysis, and CUDA/Triton optimization against PyTorch/cuBLAS. Combines production delivery experience with measured GPU work, including a 5.9x RMSNorm microbenchmark speedup on A10G.",
  },
  skills: {
    "Professional (Production Experience)": [
      "Python",
      "TypeScript",
      "Go",
      "SQL",
      "Performance Optimization",
      "Architecture Design",
      "Cross-Functional Leadership",
      "GraphQL / REST",
      "CI/CD Automation",
      "Cypress E2E Testing",
      "Node.js",
      "React",
    ],
    "Self-Directed / Lab": [
      "PyTorch",
      "CUDA / Triton Benchmarking",
      "Nsight Compute",
      "vLLM / LLM Serving",
      "Inference Load Testing (k6)",
      "Latency / Throughput Analysis",
      "KV Cache / Context Length",
      "Quantization Evaluation",
      "AWS (VPC, IAM, EC2, ALB)",
      "Terraform",
      "Kubernetes (EKS)",
      "Karpenter",
      "Prometheus / Grafana",
      "DCGM Exporter",
      "GPU Capacity Planning",
      "Autoscaling",
      "Admission Control",
    ],
  },
  projects: {
    title: "ML Inference — Self-Directed (2025–Present)",
    note: "Self-funded labs with reproducible benchmarks, correctness checks, and negative results. Measurements are specific to the documented hardware and workloads.",
    items: [
      {
        title: "GPU Inference Decision Lab (AWS EKS + Karpenter + vLLM)",
        highlights: [
          "Built a reproducible vLLM serving lab on AWS EKS with Terraform and Karpenter; used k6 and Prometheus/Grafana to measure throughput, tail latency, and cost per delivered request.",
          "Isolated queueing as the long-context bottleneck: at 1.20 req/s (8,192 prompt / 300 output tokens), p95 queue delay reached 36.93s while decode stayed near 29.4s, informing admission-control limits.",
          "Validated bounded admission with 100% delivery near 2s p95 on burst tests; rejected FP8 KV-cache on g4dn after delivery fell to 47.58-69.12% versus 100% baseline.",
        ],
      },
      {
        title: "CUDA/Triton GPU Kernel Lab (PyTorch baselines + A10G/H200)",
        highlights: [
          "Built a CUDA/Triton benchmark harness for LLM-shaped kernels on NVIDIA A10G and H200, validating correctness and measuring latency, memory bandwidth, and TFLOP/s against PyTorch/cuBLAS.",
          "Achieved 5.901x speedup over PyTorch for fused Triton RMSNorm (A10G, fp16, 4096x8192); analyzed memory throughput and occupancy with Nsight Compute.",
          "Tuned H200 Triton matmul to ~88-90% of PyTorch/cuBLAS throughput; documented slower persistent-wave variants to guide further optimization.",
        ],
      },
    ],
  },
  experience: [
    {
      title: "Staff Software Engineer",
      company: "DTEX Systems",
      startDate: "Sep 2024",
      endDate: "Present",
      highlights: [
        "Designed distributed platform services across UI, API, data, and infrastructure; containerized UI services and decoupled shared dependencies to improve release stability.",
        "Led a launch-critical OpenSearch Dashboards migration, resolving deployment and environment issues in collaboration with AWS/OpenSearch engineers.",
        "Cut dev/test iteration latency by 20% with local development and validation automation, improving engineering feedback cycles and onboarding.",
      ],
    },
    {
      title: "Senior Technical Lead",
      company: "Cisco Systems, Inc.",
      startDate: "Aug 2019",
      endDate: "Apr 2024",
      highlights: [
        "Led architecture for the Onboarding Experience platform across frontend, backend, APIs, and integrations, helping enterprise customers complete onboarding in under 30 minutes.",
        "Resolved system-design tradeoffs across US, Europe, and India engineering groups; improved CI/CD and test automation to reduce regression risk in customer onboarding flows.",
        "Led AngularJS-to-React modernization to remove security risk and improve maintainability; introduced Cypress end-to-end testing that cut test creation time by 50%.",
      ],
    },
    {
      title: "Senior Software Engineer",
      company: "Tico Co., Ltd.",
      startDate: "Jan 2019",
      endDate: "Aug 2019",
      highlights: [
        "Improved message loading performance by 60% through frontend and API optimization and reduced codebase size by 30% through modular refactoring.",
      ],
    },
    {
      title: "Co-founder / CTO",
      company: "Popup Technology Co., Ltd.",
      startDate: "Apr 2016",
      endDate: "Oct 2018",
      highlights: [
        "Built the core platform from scratch, led a 5-person engineering team, and shipped features that doubled revenue within 12 months.",
      ],
    },
  ],
  education: [
    {
      school: "University of California, San Diego",
      degree: "M. E. Electrical Engineering",
      startDate: "Sep 2006",
      endDate: "Jun 2008",
    },
    {
      school: "University of Illinois at Urbana-Champaign",
      degree: "B. S. Electrical Engineering",
      startDate: "Sep 2003",
      endDate: "Dec 2005",
    },
  ],
};
