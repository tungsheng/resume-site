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
      "Staff Software Engineer focused on cloud platform, ML inference infrastructure, and distributed systems. Built GPU-backed inference platforms on AWS/Kubernetes with an emphasis on autoscaling, reliability, and cost-aware performance under burst workloads.",
  },
  skills: {
    Inference: [
      "vLLM",
      "LLM Serving",
      "Autoscaling",
      "GPU Scheduling (NVIDIA Device Plugin)",
    ],
    Languages: ["Go", "Python", "TypeScript", "SQL"],
    Backend: ["Node.js", "GraphQL", "REST"],
    Infrastructure: [
      "Terraform",
      "Kubernetes (EKS)",
      "AWS (VPC, IAM, EC2, ALB)",
      "Karpenter",
      "CI/CD Automation",
      "Prometheus / Grafana",
    ],
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
          "Designed zero-idle and warm-1 serving profiles; the verify workflow proves GPU node provisioning, vLLM readiness, public /v1 completion success, and cleanup back to zero serving GPU nodes.",
          "Implemented custom-metric autoscaling with Prometheus Adapter and vLLM request metrics, comparing running-request HPA against active-pressure scaling on waiting + running requests.",
          "Built evaluate workflows for controlled k6 burst runs, HPA policy comparison, active-target sweeps, and synthetic spot-capacity resilience drills, producing Markdown/JSON reports with timeline, latency, queue, cost, and metric-collection status.",
          "Added a structured experiment catalog for KV cache, prefill/decode timing, batching, request patterns, autoscaling queueing, and cost-per-useful-work studies; local validation/rendering is ready while curated live-cluster experiment results remain pending.",
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
        "Partnered directly with AWS/OpenSearch engineering to unblock a launch-critical Dashboards migration and stabilize deployments across environments.",
        "Delivered the DLP feature end-to-end across UI workflows, APIs, and data modeling, aligning frontend, backend, infra, and product teams for a go-to-market initiative.",
        "Built local development and validation automation that cut dev/test cycle time by 20% and reduced onboarding friction.",
        "Containerized UI services and removed shared dependency coupling, improving deployment isolation, release reliability, and execution speed on high-risk changes.",
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
