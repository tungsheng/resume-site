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
    "Production: Languages / Web": [
      "TypeScript",
      "JavaScript",
      "Python",
      "Go",
      "SQL",
      "React",
      "Node.js",
      "GraphQL / REST",
    ],
    "Production: Delivery / Leadership": [
      "Build / Release Automation",
      "Cypress End-to-End Tests",
      "Performance Optimization",
      "Architecture Design",
      "Cross-Team Leadership",
    ],
    "Lab: GPU / Serving": [
      "PyTorch",
      "Triton GPU Tuning",
      "CUDA Graph Replay",
      "vLLM Serving",
    ],
    "Lab: Testing / Monitoring": [
      "Prompt / Cache Tests",
      "Response Time (Latency)",
      "Processing Rate (Throughput)",
      "k6 Load Tests",
      "Benchmarks",
      "Prometheus / Grafana",
      "GPU Monitoring (DCGM)",
    ],
    "Lab: Cloud / Deployment": [
      "Kubernetes on AWS (EKS)",
      "Terraform",
      "AWS Compute / Networking",
    ],
  },
  projects: {
    title: "ML Inference — Self-Directed (2025–Present)",
    note: "Repeated benchmarks and correctness checks, including changes that did not improve speed. Results apply to tested hardware and workloads. Reports: tonylee.bio/work.",
    items: [
      {
        title: "GPU Model Serving Lab (vLLM + AWS EKS)",
        highlights: [
          "Deployment: Automated vLLM deployment and load tests on AWS Kubernetes (EKS), using Qwen2.5-0.5B on one NVIDIA T4 per server with monitoring.",
          "Capacity: Long prompts increased request waits while model processing time stayed steady. Load tests identified capacity limits.",
          "Response time: 95% of measured responses arrived within 28 seconds, down from 78, by limiting simultaneous requests in the test client. Trade-offs: 8% unserved requests and 7% less text output per second (in tokens).",
        ],
      },
      {
        title: "Triton GPU Performance Lab (NVIDIA A10G + H200)",
        highlights: [
          "53% lower median runtime: Replayed recorded GPU operations (CUDA Graphs) in a simulated A10G text-generation step. Combining operations alone did not help.",
          "5.9x faster RMSNorm: Used Triton to rescale model values versus separate PyTorch operations on A10G. Confirmed gains on H200; Nsight Compute found A10G limited by GPU memory transfer speed.",
          "74% to 89% of cuBLAS speed: Tuned H200 matrix multiplication in 16-bit (FP16) tests, using NVIDIA's GPU math library as the baseline. Discarded slower configurations.",
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
        "Designed services across user interfaces, APIs, data, and infrastructure. Packaged frontend services in containers to improve release stability.",
        "Led an OpenSearch Dashboards migration for the product launch, working with AWS/OpenSearch engineers to resolve deployment and environment issues.",
        "Automated local development and tests, cutting cycle time by 20%.",
      ],
    },
    {
      title: "Senior Technical Lead",
      company: "Cisco Systems, Inc.",
      startDate: "Aug 2019",
      endDate: "Apr 2024",
      highlights: [
        "Led frontend, backend, API, and integration architecture for Onboarding Experience. Enterprise customers completed onboarding in under 30 minutes.",
        "Made architecture decisions with teams in the US, Europe, and India. Improved build, release, and test automation to reduce new onboarding bugs.",
        "Led AngularJS-to-React migration to address security and maintenance issues. Added Cypress end-to-end tests, cutting test creation time by 50%.",
      ],
    },
    {
      title: "Senior Software Engineer",
      company: "Tico Co., Ltd.",
      startDate: "Jan 2019",
      endDate: "Aug 2019",
      highlights: [
        "Cut message loading time by 60% through frontend and API optimization. Reduced codebase size by 30% by reorganizing code into reusable modules.",
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
