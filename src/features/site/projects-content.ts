import { CUDA_KERNEL_PROJECT_PATH, GPU_INFERENCE_PROJECT_PATH } from "./content";
import { projectContent } from "./project-content";

export type ProjectId = "gpu-inference-lab" | "cuda-kernel-lab";

export type PortfolioProject = {
  id: ProjectId;
  title: string;
  path: string;
  repositoryUrl: string;
  layer: string;
  status: string;
  statusTone: "supported" | "measured" | "planned";
  summary: string;
  result: string;
  evidence: string[];
  experimentCount: number;
};

export const projectPortfolioContent = {
  title: "Projects",
  lede:
    "Evidence-backed GPU systems work across serving infrastructure and kernel optimization.",
  summary:
    "Serving infrastructure decisions and CUDA kernel optimization are separated by project, with experiments attached to the evidence they support.",
  projects: [
    {
      id: "gpu-inference-lab",
      title: projectContent.title,
      path: GPU_INFERENCE_PROJECT_PATH,
      repositoryUrl: "https://github.com/tungsheng/gpu-inference-lab",
      layer: "Serving infrastructure",
      status: "Measured decision record",
      statusTone: "supported",
      summary: projectContent.lede,
      result:
        "EKS/vLLM measurements support admission, long-context boundaries, scheduler defaults, useful-work cost, and FP8 KV rejection.",
      evidence: [
        "100% queued delivery across burst and spike-to-zero admission runs",
        "1.20 req/s long-context knee repeats with 36.8s p95 queue delay",
        "FP8 KV rejected on the current g4dn/vLLM path",
      ],
      experimentCount: 7,
    },
    {
      id: "cuda-kernel-lab",
      title: "CUDA Kernel Lab",
      path: CUDA_KERNEL_PROJECT_PATH,
      repositoryUrl: "https://github.com/tungsheng/cuda-kernel-lab",
      layer: "Kernel optimization",
      status: "A10G/H200 benchmark evidence",
      statusTone: "measured",
      summary:
        "A CUDA/Triton optimization lab organized around profile-driven kernel work for LLM-shaped primitives across A10G and H200.",
      result:
        "RMSNorm fusion remains the strongest supported win, while H200 matmul autotune now bounds the Tensor Core gap against PyTorch/cuBLAS.",
      evidence: [
        "115 operator rows plus 27 decode replay rows on A10G",
        "H200 matmul rows keep best standard Triton around 88-90% of PyTorch/cuBLAS",
        "RMSNorm fp16 reached 5.901x over the PyTorch baseline",
      ],
      experimentCount: 9,
    },
  ] satisfies PortfolioProject[],
};

export const cudaKernelProjectContent = {
  title: "CUDA Kernel Lab",
  lede:
    "A CUDA/Triton optimization lab organized around a measured loop: profile first, identify the bottleneck, optimize that bottleneck, then re-profile before claiming a win.",
  repositoryUrl: "https://github.com/tungsheng/cuda-kernel-lab",
  overviewFacts: [
    {
      label: "Device",
      value: "A10G + H200",
      body: "A10G AWS operator evidence now sits beside RunPod H200 matmul/Tensor Core tuning.",
    },
    {
      label: "Correctness",
      value: "Selected rows pass",
      body: "The selected A10G operator/decode rows and latest H200 matmul rows passed correctness checks.",
    },
  ],
  optimizationLoop: [
    {
      step: "01",
      title: "Profile first",
      body: "Start from matched PyTorch/Triton rows, correctness checks, and Nsight counters when the benchmark is interesting enough to explain.",
    },
    {
      step: "02",
      title: "Identify bottleneck",
      body: "Classify the limit as memory bandwidth, launch overhead, occupancy, register pressure, Tensor Core utilization, or traffic from unfused intermediates.",
    },
    {
      step: "03",
      title: "Optimize that bottleneck",
      body: "Make one bounded change: fuse rows, change block size, compare reduction strategy, sweep matmul tiles, or reduce decode replay overhead.",
    },
    {
      step: "04",
      title: "Re-profile",
      body: "Compare the next run against the same control and promote only supported, caveated, rejected, or pending claims.",
    },
  ],
};

export function getProjectById(id: ProjectId): PortfolioProject {
  const project = projectPortfolioContent.projects.find((item) => item.id === id);

  if (!project) {
    throw new Error(`Unknown project id: ${id}`);
  }

  return project;
}
