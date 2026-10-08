import type { ResumeData } from "./types";

export const publicResumeData: ResumeData = {
  header: {
    name: "Tony Lee",
    badges: ["Staff Full-Stack Engineer → ML Inference"],
    contacts: {
      email: "tungsheng@gmail.com",
      linkedin: "tonyslee8",
      website: "tonylee.bio",
      github: "tungsheng",
    },
    summary:
      "Staff-level full-stack engineer with 10+ years delivering production applications and APIs, leading cross-regional architecture, and improving performance. Transitioning into LLM inference performance through self-directed GPU labs: reproducible vLLM serving benchmarks with queue/TTFT/decode analysis; Triton kernels and CUDA Graph replay vs. PyTorch/cuBLAS — measured honestly, negative results included.",
  },
  skills: {
    "Professional (Production Experience)": [
      "TypeScript",
      "JavaScript",
      "Python",
      "Go",
      "SQL",
      "React",
      "Node.js",
      "GraphQL / REST",
      "CI/CD Automation",
      "Cypress E2E Testing",
      "Performance Optimization",
      "Architecture Design",
      "Cross-Team Collaboration",
      "Technical Leadership",
    ],
    "Self-Directed / Lab": [
      "PyTorch",
      "Triton Kernel Benchmarking",
      "Triton Tuning",
      "CUDA Graphs",
      "vLLM / LLM Serving",
      "KV Cache / Context Length",
      "Latency / Throughput Analysis",
      "Inference Load Testing (k6)",
      "Performance / Regression Tooling",
      "Prometheus / Grafana",
      "DCGM Exporter",
      "Kubernetes (EKS)",
      "Terraform",
      "AWS (VPC, IAM, EC2, ALB)",
    ],
  },
  projects: {
    title: "ML Inference — Self-Directed (2025–Present)",
    note: "Unpaid, self-funded labs with repeat-run benchmarks, correctness checks, and negative results; numbers hold only for the stated hardware and workloads. Write-ups: tonylee.bio/work.",
    items: [
      {
        title: "GPU Inference Decision Lab (Qwen2.5-0.5B, vLLM 0.9.0, 1×T4 replicas on AWS EKS)",
        highlights: [
          "Split per-run latency into client, queue, prefill, and decode by joining k6 phases, vLLM histograms, and DCGM metrics in schema-validated, offline-replayable reports.",
          "Diagnosed the long-context knee (8,192 prompt / 300 output tokens) as queueing: stepping 1.10 → 1.15 → 1.20 req/s raised p95 queue wait <0.3s → ~14s → ~37s across repeat runs while p95 prefill and decode held flat.",
          "Shed load at 1.25 req/s by capping client-side concurrency at max_num_seqs=32: k6 p95 77.51s → 27.98s and p95 TTFT >40s → <1s, decode unchanged; cost: 59 of 749 requests unserved, 7% fewer tok/s.",
          "Rejected FP8 KV cache on T4 (no native FP8): at 1.00 req/s, delivery fell to 47.58–69.12% vs. 100% and output from ~250 to 114–166 tok/s.",
        ],
      },
      {
        title: "Triton GPU Kernel Lab (NVIDIA A10G + H200, PyTorch/cuBLAS baselines)",
        highlights: [
          "Showed a synthetic batch-1 FP16 decode step (A10G) was launch-bound: CUDA Graph replay of the same kernels cut p50 0.3395 → 0.1594 ms; Triton fusion alone didn't help.",
          "Fused Triton RMSNorm ran bandwidth-bound at 90.91% of peak DRAM throughput, 93.12% occupancy (Nsight Compute, A10G FP16, 4096×4096); 5.901× faster than unfused eager PyTorch at 4096×8192, 4–7× unmodified on H200.",
          "Lifted an H200 Triton GEMM from ~74% to ~89% of cuBLAS (FP16, timing only) on a 512×11008×4096 LLM MLP shape by sweeping warps, pipeline stages, and group-M; persistent-wave variants managed only 0.25–0.35× and were dropped.",
          "Built Python performance tooling (14 CLIs, 123 tests): correctness-checked benchmarks, autotune stability gates, a 5% regression gate, and Nsight Compute summaries.",
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
        "Drove a launch-critical OpenSearch Dashboards migration, partnering with AWS/OpenSearch engineers to resolve deployment and environment issues.",
        "Cut dev/test cycle time by 20% with local development and validation automation, improving engineering feedback loops and onboarding.",
      ],
    },
    {
      title: "Senior Technical Lead",
      company: "Cisco Systems, Inc.",
      startDate: "Aug 2019",
      endDate: "Apr 2024",
      highlights: [
        "Led architecture for the Onboarding Experience platform across frontend, backend, APIs, and integrations, helping enterprise customers complete onboarding in under 30 minutes.",
        "Resolved system-design tradeoffs across US, Europe, and India engineering groups; improved CI/CD and test automation to reduce onboarding regression risk.",
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
      degree: "M.E. Electrical Engineering",
      startDate: "Sep 2006",
      endDate: "Jun 2008",
    },
    {
      school: "University of Illinois at Urbana-Champaign",
      degree: "B.S. Electrical Engineering",
      startDate: "Sep 2003",
      endDate: "Dec 2005",
    },
  ],
};
