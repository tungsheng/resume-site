import type { ResumeData } from "../../types";

export const publicResumeData: ResumeData = {
  header: {
    name: "Tony Lee",
    badges: [
      "Staff Software Engineer",
      "Cloud Platform",
      "ML Inference Infrastructure",
    ],
    contacts: {
      email: "tungsheng@gmail.com",
      linkedin: "tonyslee8",
    },
    summary:
      "Staff Software Engineer specializing in ML inference infrastructure and distributed systems. Experienced in building GPU-backed inference platforms on Kubernetes, with a focus on latency, throughput, and cost efficiency under burst workloads and real-world constraints.",
  },
  skills: {
    "ML Infrastructure / Inference": [
      "vLLM",
      "LLM Serving",
      "Autoscaling",
      "GPU Scheduling (NVIDIA Device Plugin)",
    ],
    "Infrastructure / Cloud": [
      "Terraform",
      "Kubernetes (EKS)",
      "AWS (VPC, IAM, EC2, ALB)",
      "Karpenter",
      "CI/CD Automation",
      "Prometheus / Grafana",
    ],
    Languages: ["Go", "Python", "TypeScript", "SQL"],
    Backend: ["Node.js", "GraphQL", "REST"],
    Leadership: [
      "Architecture Design",
      "Cross-Functional Leadership",
      "Technical Mentorship",
    ],
  },
  projects: {
    title: "Selected Project",
    items: [
      {
        title: "GPU Inference Lab (AWS EKS + Karpenter + vLLM)",
        highlights: [
          "Built an AWS EKS GPU inference lab with Terraform-managed VPC/EKS, public ALB-backed OpenAI-compatible vLLM serving, Prometheus/Grafana observability, and Karpenter-managed on-demand/spot GPU NodePools.",
          "Reduced serving-GPU idle cost to $0/hr for sparse traffic with a zero-idle profile that starts from 0 GPU nodes, provisions a GPU for a public /v1 completion, and cleans back to 0 serving GPUs after validation.",
          "Diagnosed queue buildup and delayed scale-out under burst traffic due to model-readiness lag, then redesigned the autoscaling signal around queue depth and request concurrency to manage backpressure.",
          "Measured burst behavior through policy comparisons and active-target sweeps; active-pressure reached a second Ready replica 43% faster in one warm-baseline compare run (564s vs. 989s).",
          "Identified KV-cache memory as the primary concurrency constraint for long prompts and framed batching as a throughput-versus-p99-latency tradeoff driven by queueing delay.",
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
        "Designed and delivered distributed platform services with a focus on reliability, deployment safety, and cross-service coordination across UI, API, data, and infrastructure boundaries.",
        "Applied distributed systems and scaling principles to evaluate platform behavior under load, focusing on latency, throughput, deployment failure modes, and recovery paths.",
        "Improved release stability by containerizing UI services, decoupling shared dependencies, and isolating deployment surfaces for high-risk changes.",
        "Led a launch-critical OpenSearch Dashboards migration, resolving deployment and environment consistency issues across production systems in partnership with AWS/OpenSearch engineers.",
        "Built local development and validation automation that reduced dev/test iteration latency by 20% and improved onboarding for service changes.",
      ],
    },
    {
      title: "Senior Technical Lead",
      company: "Cisco Systems, Inc.",
      startDate: "Aug 2019",
      endDate: "Apr 2024",
      highlights: [
        "Led architecture and technical strategy for the Onboarding Experience platform, helping enterprise customers complete onboarding in under 30 minutes.",
        "Drove system design across frontend, backend, APIs, and integrations, resolving cross-team tradeoffs across US, Europe, and India engineering groups.",
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
