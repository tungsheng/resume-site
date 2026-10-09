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
      "Staff-level full-stack engineer with 10+ years of building production applications and APIs and leading cross-team architecture. Self-directed GPU labs cover vLLM serving on AWS, Triton kernels, and CUDA Graph replay, with repeated benchmarks, correctness checks, and documented trade-offs.",
  },
  skills: {
    Production: [
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
      "Triton Benchmarking / Tuning",
      "CUDA Graphs",
      "vLLM / LLM Serving",
      "KV Cache / Context Length",
      "Latency / Throughput Analysis",
      "k6 Load Testing",
      "Performance Tools",
      "Prometheus / Grafana",
      "DCGM Exporter",
      "Kubernetes (EKS)",
      "Terraform",
      "AWS (VPC, IAM, EC2, ALB)",
    ],
  },
  projects: {
    title: "ML Inference — Self-Directed (2025–Present)",
    note: "Repeatable benchmarks with correctness checks and negative results. Measurements apply to the tested hardware and workloads. Reports: tonylee.bio/work.",
    items: [
      {
        title: "GPU Inference Decision Lab (vLLM + AWS EKS)",
        highlights: [
          "Built a repeatable vLLM serving lab on AWS EKS for the small Qwen2.5-0.5B model, using one NVIDIA T4 per model server, load tests, and monitoring.",
          "Traced slower responses with long prompts to queueing. Model processing time stayed steady; repeated load tests showed when demand exceeded capacity.",
          "Cut 95th-percentile response time from 78 to 28 seconds by limiting concurrent requests in the test client. This left 8% of offered requests unserved and reduced token throughput by 7%.",
          "Rejected FP8, a lower-precision cache option, after request completion on T4 fell from 100% to 48-69%. T4 lacks native FP8 support.",
        ],
      },
      {
        title: "Triton GPU Kernel Lab (NVIDIA A10G + H200)",
        highlights: [
          "Cut median runtime by 53% in an A10G synthetic token-generation step with CUDA Graph replay. Combining the operations without replay did not help.",
          "Sped up RMSNorm by 5.9x over unfused eager PyTorch on A10G using a fused Triton kernel. Confirmed gains on H200; Nsight Compute profiling on A10G identified memory bandwidth as the limit.",
          "Tuned an H200 matrix multiplication kernel from about 74% to 89% of NVIDIA cuBLAS throughput in FP16 benchmarks. Discarded slower configurations.",
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
        "Designed services across UI, API, data, and infrastructure. Containerized UI services and separated shared dependencies to improve release stability.",
        "Led an OpenSearch Dashboards migration for the product launch, working with AWS/OpenSearch engineers to resolve deployment and environment issues.",
        "Automated local development and validation, cutting dev/test cycle time by 20%.",
      ],
    },
    {
      title: "Senior Technical Lead",
      company: "Cisco Systems, Inc.",
      startDate: "Aug 2019",
      endDate: "Apr 2024",
      highlights: [
        "Led frontend, backend, API, and integration architecture for Onboarding Experience. Enterprise customers completed onboarding in under 30 minutes.",
        "Resolved system-design tradeoffs with teams in the US, Europe, and India. Improved CI/CD and test automation to reduce onboarding regression risk.",
        "Led AngularJS-to-React migration to address security and maintenance issues. Added Cypress end-to-end tests, cutting test creation time by 50%.",
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
