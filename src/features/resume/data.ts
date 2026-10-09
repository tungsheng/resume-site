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
      "Build / Release Automation",
      "Cypress End-to-End Tests",
      "Performance Optimization",
      "Architecture Design",
      "Cross-Team Collaboration",
      "Technical Leadership",
    ],
    "Self-Directed / Lab": [
      "PyTorch",
      "Triton GPU Code Tuning",
      "CUDA Graph Replay",
      "vLLM Model Serving",
      "Prompt Length / Cache Testing",
      "Response Time (Latency)",
      "Processing Rate (Throughput)",
      "k6 Load Testing",
      "Benchmark Automation",
      "Prometheus / Grafana",
      "GPU Monitoring (DCGM)",
      "Kubernetes on AWS (EKS)",
      "Terraform",
      "AWS Compute / Networking",
    ],
  },
  projects: {
    title: "ML Inference — Self-Directed (2025–Present)",
    note: "Repeated performance tests with correctness checks, including changes that did not improve speed. Results apply to tested hardware and workloads. Reports: tonylee.bio/work.",
    items: [
      {
        title: "GPU Model Serving Lab (vLLM + AWS EKS)",
        highlights: [
          "Automated vLLM deployment and load tests on AWS Kubernetes (EKS) for the small Qwen2.5-0.5B language model, with one NVIDIA T4 per server and monitoring.",
          "Found that long prompts increased time waiting in line, while model processing time stayed steady. Load tests showed when demand exceeded capacity.",
          "Cut the response-time cutoff for 95% of completed requests from 78 to 28 seconds by capping simultaneous requests in the test client. Left 8% of incoming requests unserved and produced 7% less text per second (in tokens).",
          "Rejected 8-bit model-cache storage (FP8) on T4 after request completion fell from 100% to 48-69%. T4 lacks hardware support for FP8 calculations.",
        ],
      },
      {
        title: "Triton GPU Performance Lab (NVIDIA A10G + H200)",
        highlights: [
          "Cut median runtime by 53% in a simulated A10G text-generation step by replaying recorded GPU operations (CUDA Graphs). Combining operations alone did not help.",
          "Sped up RMSNorm (rescaling model values) 5.9x with Triton versus PyTorch running operations separately on A10G. Confirmed gains on H200; Nsight Compute found A10G was limited by GPU memory transfer speed.",
          "Raised H200 matrix multiplication speed from 74% to 89% of NVIDIA cuBLAS (GPU math library) in 16-bit (FP16) tests. Discarded slower configurations.",
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
        "Designed services across user interfaces, APIs, data, and infrastructure. Used containers and separated shared dependencies to improve release stability.",
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
