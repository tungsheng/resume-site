import {
  CUDA_KERNEL_PROJECT_PATH,
  GPU_INFERENCE_PROJECT_PATH,
  GPU_INFERENCE_PROJECT_VALIDATION_PATH,
} from "./content";
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
  primaryAction: {
    label: string;
    href: string;
  };
};

export const projectPortfolioContent = {
  title: "Projects",
  lede:
    "Evidence-backed GPU systems work across serving infrastructure and kernel optimization.",
  summary:
    "The portfolio separates serving decisions from CUDA kernel optimization, with each experiment tied to the project it supports.",
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
      primaryAction: {
        label: "Architecture decisions",
        href: GPU_INFERENCE_PROJECT_VALIDATION_PATH,
      },
    },
    {
      id: "cuda-kernel-lab",
      title: "CUDA Kernel Lab",
      path: CUDA_KERNEL_PROJECT_PATH,
      repositoryUrl: "https://github.com/tungsheng/cuda-kernel-lab",
      layer: "Kernel optimization",
      status: "A10G benchmark evidence",
      statusTone: "measured",
      summary:
        "A CUDA/Triton optimization lab organized around profile-driven kernel work for LLM-shaped primitives.",
      result:
        "The latest A10G evidence keeps RMSNorm fusion as the strongest kernel win and adds a resident-KV decode-step CUDA Graph replay track.",
      evidence: [
        "115 operator rows plus 27 decode replay rows on A10G",
        "RMSNorm fp16 reached 5.901x over the PyTorch baseline",
        "Decode replay held around 0.156 ms p50 with zero padding",
      ],
      experimentCount: 8,
      primaryAction: {
        label: "Benchmark readout",
        href: CUDA_KERNEL_PROJECT_PATH,
      },
    },
  ] satisfies PortfolioProject[],
};

export const cudaKernelProjectContent = {
  title: "CUDA Kernel Lab",
  lede:
    "A CUDA/Triton optimization lab organized around a measured loop: profile first, identify the bottleneck, optimize that bottleneck, then re-profile before claiming a win.",
  repositoryUrl: "https://github.com/tungsheng/cuda-kernel-lab",
  overviewSummary:
    "The lab moves from memory traffic and reductions into fusion, tiling, Tensor Cores, and decode-step graph replay with profiler-backed strategy comparisons.",
  overviewFacts: [
    {
      label: "Device",
      value: "NVIDIA A10G",
      body: "Latest evidence run used a disposable AWS g5.xlarge CUDA host.",
    },
    {
      label: "Benchmark matrix",
      value: "115 + 27 rows",
      body: "115 operator rows plus a 27-row decode-step replay run on A10G.",
    },
    {
      label: "Correctness",
      value: "142 / 142 pass",
      body: "The selected operator matrix and Round 12 decode replay report both passed validation.",
    },
    {
      label: "Largest win",
      value: "5.901x",
      body: "Triton fused RMSNorm fp16 on the 4096x8192 shape versus the PyTorch baseline.",
    },
    {
      label: "Profiler proof",
      value: "90.91% DRAM",
      body: "Nsight Compute captured the RMSNorm win with 93.12% occupancy.",
    },
    {
      label: "Decode replay",
      value: "~0.156 ms",
      body: "Dynamic same-stream piecewise CUDA Graph replay p50, with about 0.230 ms p95 across dense-bucket tail seeds.",
    },
  ],
  optimizationLoop: [
    {
      step: "01",
      title: "Profile first",
      body: "Start from matched PyTorch/Triton rows, correctness checks, and Nsight counters when the benchmark is interesting enough to explain.",
      evidence: "115-row strategy run, 27-row decode replay report, and compact profiler summaries",
    },
    {
      step: "02",
      title: "Identify bottleneck",
      body: "Classify the limit as memory bandwidth, launch overhead, occupancy, register pressure, Tensor Core utilization, or traffic from unfused intermediates.",
      evidence: "Memory primitives lead on DRAM, matmul is Tensor Core limited, decode shifts to launch and scheduling overhead",
    },
    {
      step: "03",
      title: "Optimize that bottleneck",
      body: "Make one bounded change: fuse rows, change block size, compare reduction strategy, sweep matmul tiles, or reduce decode replay overhead.",
      evidence: "RMSNorm and SwiGLU fusion win; resident decode replay trims hot-loop cost",
    },
    {
      step: "04",
      title: "Re-profile",
      body: "Compare the next run against the same control and promote only supported, caveated, rejected, or pending claims.",
      evidence: "RMSNorm supported; softmax rejected; matmul below cuBLAS; decode replay remains a synthetic upper bound",
    },
  ],
  results: [
    {
      title: "Fused RMSNorm",
      statusLabel: "Supported",
      call: "Fusion removes enough framework and intermediate-tensor overhead to beat the PyTorch baseline across the measured shape sweep.",
      proof: "fp16 reached 5.901x at 4096x8192; the 4096x4096 rerun reached 5.599x.",
      tone: "success",
    },
    {
      title: "Fused SwiGLU",
      statusLabel: "Supported",
      call: "Elementwise fusion is a strong path before deeper matmul work.",
      proof: "fp32 0.4547 ms Triton vs 1.418 ms PyTorch; 3.119x speedup.",
      tone: "success",
    },
    {
      title: "Matmul tile sweep",
      statusLabel: "Caveated",
      call: "Treat Triton tiling as an active optimization track, not a portfolio win over cuBLAS yet.",
      proof: "Best Triton tile reached 25.74 TFLOP/s; PyTorch/cuBLAS stayed around 30-31 TFLOP/s.",
      tone: "warning",
    },
    {
      title: "Decode graph replay",
      statusLabel: "Measured, caveated",
      call: "Resident-KV same-stream piecewise CUDA Graph replay now has fixed-shape and dynamic-bucket evidence.",
      proof: "Round 12 reached 0.1375 ms fixed-shape p50 and roughly 0.156 ms dynamic p50 / 0.230 ms p95 with dense buckets and zero padding.",
      tone: "warning",
    },
    {
      title: "Profiler-backed proof",
      statusLabel: "Measured",
      call: "Use counters to explain the benchmark instead of treating latency alone as the answer.",
      proof: "RMSNorm profile shows 90.91% DRAM throughput and 93.12% occupancy; profiled matmul shows 45.19% Tensor Core utilization.",
      tone: "success",
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
