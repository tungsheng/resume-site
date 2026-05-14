import type { ResumeData } from "../../types";

export const publicResumeData: ResumeData = {
  header: {
    name: "Tony Lee",
    badges: [
      "Staff Software Engineer",
      "Platform Infrastructure",
      "ML Inference Systems",
    ],
    contacts: {
      email: "tungsheng@gmail.com",
      linkedin: "tonyslee8",
    },
    summary:
      "Platform infrastructure engineer focused on ML inference architecture, GPU-backed serving, Kubernetes, autoscaling, admission control, and distributed systems reliability.",
  },
  skills: {
    "ML Infrastructure / Inference": [
      "vLLM",
      "LLM Serving",
      "OpenAI-Compatible APIs",
      "Autoscaling",
      "Admission Control",
      "KV Cache / Context Length",
      "Quantization Evaluation",
      "GPU Capacity Planning",
      "GPU Scheduling (NVIDIA Device Plugin)",
      "Inference Load Testing (k6)",
    ],
    Leadership: [
      "Architecture Design",
      "Cross-Functional Leadership",
      "Technical Mentorship",
    ],
    "Infrastructure / Cloud": [
      "Terraform",
      "Kubernetes (EKS)",
      "AWS (VPC, IAM, EC2, ALB)",
      "Karpenter",
      "CI/CD Automation",
      "Prometheus / Grafana",
      "DCGM Exporter",
    ],
    Languages: ["Go", "Python", "TypeScript", "SQL"],
    Backend: ["Node.js", "GraphQL", "REST"],
  },
  projects: {
    title: "Selected Project",
    items: [
      {
        title: "GPU Inference Decision Lab (AWS EKS + Karpenter + vLLM)",
        highlights: [
          "Built an AWS EKS/vLLM decision lab that turns serving measurements into supported, rejected, pending, or blocked architecture calls across autoscaling, admission control, long-context capacity, scheduling, and quantization.",
          "Proved zero-idle GPU serving from 0 nodes to a public /v1 completion, then cleaned back to $0/hr serving-GPU idle cost.",
          "Measured burst and spike-to-zero admission behavior: bounded queues kept 100% delivery at about 2s p95 while direct clients dropped 237-787 iterations.",
          "Mapped the 8192/300 long-context boundary: 1.10 req/s had no queueing, 1.15 began waiting pressure, and 1.20 still delivered 100% but reached 54.35s p95 latency.",
          "Rejected FP8 KV cache on g4dn/vLLM after variants cut delivery to 47.58-69.12% and generated throughput to 114-166 tokens/sec versus a 249.58 baseline.",
          "Designed a Blackwell FP4 path for BF16, plain NVFP4, and SmoothQuant across accuracy, memory, latency, throughput, serving cost, and build cost; the first p6-b200 attempt was blocked by EC2 capacity.",
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
        "Designed distributed platform services across UI, API, data, and infrastructure boundaries, with emphasis on reliability, deployment safety, and cross-service coordination.",
        "Evaluated platform behavior under load across latency, throughput, failure modes, and recovery paths.",
        "Improved release stability by containerizing UI services, decoupling shared dependencies, and isolating high-risk deployment surfaces.",
        "Led a launch-critical OpenSearch Dashboards migration, resolving deployment and environment issues with AWS/OpenSearch engineers.",
        "Built local development and validation automation that cut dev/test iteration latency by 20% and improved onboarding.",
      ],
    },
    {
      title: "Senior Technical Lead",
      company: "Cisco Systems, Inc.",
      startDate: "Aug 2019",
      endDate: "Apr 2024",
      highlights: [
        "Led architecture for the Onboarding Experience platform, helping enterprise customers complete onboarding in under 30 minutes.",
        "Drove system design across frontend, backend, APIs, and integrations, resolving tradeoffs across US, Europe, and India engineering groups.",
        "Led AngularJS-to-React modernization to remove security risk and improve maintainability; introduced Cypress end-to-end testing that cut test creation time by 50%.",
        "Built CI/CD and test automation improvements that reduced regression risk in high-visibility customer onboarding flows.",
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
