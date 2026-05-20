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
        "A CUDA/Triton optimization lab with reproducible benchmarks for LLM-shaped primitives.",
      result:
        "The latest A10G matrix shows Triton wins where fusion removes intermediate traffic, while PyTorch still leads simple memory primitives.",
      evidence: [
        "38 benchmark rows loaded, all correctness checks passed",
        "RMSNorm fp16 reached 5.539x speedup over the PyTorch baseline",
        "SwiGLU fp32 reached 3.112x speedup over the PyTorch baseline",
      ],
      experimentCount: 7,
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
    "A CUDA/Triton optimization lab that turns LLM-shaped primitives into benchmarked kernel-optimization evidence.",
  repositoryUrl: "https://github.com/tungsheng/cuda-kernel-lab",
  overviewSummary:
    "The lab moves from memory traffic and reductions into fusion, tiling, Tensor Cores, and profiler-backed strategy comparisons.",
  overviewFacts: [
    {
      label: "Device",
      value: "NVIDIA A10G",
      body: "Latest evidence run used a disposable AWS g5.xlarge CUDA host.",
    },
    {
      label: "Benchmark matrix",
      value: "38 rows",
      body: "Memory, reductions, softmax, norms, SwiGLU, and vector-add sweeps.",
    },
    {
      label: "Correctness",
      value: "38 / 38 pass",
      body: "Every recorded PyTorch and Triton row passed output validation.",
    },
    {
      label: "Largest win",
      value: "5.539x",
      body: "Triton fused RMSNorm fp16 versus the PyTorch baseline.",
    },
    {
      label: "Fusion win",
      value: "3.112x",
      body: "Triton fused SwiGLU fp32 versus the PyTorch baseline.",
    },
    {
      label: "Next proof",
      value: "Profiler notes",
      body: "Nsight summaries are the next gate for explaining the memory primitive gap.",
    },
  ],
  workflows: [
    {
      title: "Benchmark locally",
      command: "uv run benchmark-memory --backend all --op all --numel 16777216 --dtype float32",
      body: "Exercise the memory primitive path and emit comparable PyTorch/Triton rows.",
      output: "Latency, bandwidth, TFLOP/s, and correctness metadata",
    },
    {
      title: "Run the matrix",
      command: "uv run benchmark-matrix --output-dir experiments/results/aws-ec2/<run-id>",
      body: "Collect the standard operation matrix on a CUDA host.",
      output: "JSONL records grouped by primitive",
    },
    {
      title: "Live GPU evidence",
      command: "./scripts/live-benchmark --run-id <run-id> --with-profiling",
      body: "Launch a disposable GPU host, run benchmarks, copy artifacts back, and tear down.",
      output: "Benchmark report plus profiler artifacts",
    },
  ],
  results: [
    {
      title: "Fused RMSNorm",
      statusLabel: "Supported",
      call: "Fusion removes enough framework and intermediate-tensor overhead to beat the PyTorch baseline.",
      proof: "fp16 0.171 ms Triton vs 0.9472 ms PyTorch; 5.539x speedup.",
      tone: "success",
    },
    {
      title: "Fused SwiGLU",
      statusLabel: "Supported",
      call: "Elementwise fusion is a strong path before deeper matmul work.",
      proof: "fp32 0.4567 ms Triton vs 1.421 ms PyTorch; 3.112x speedup.",
      tone: "success",
    },
    {
      title: "Memory primitives",
      statusLabel: "Caveated",
      call: "Do not broaden launch sweeps before profiler counters explain the PyTorch lead.",
      proof: "PyTorch stayed around 445-467 GB/s; Triton vector_add fp32 reached 439.8-444.8 GB/s.",
      tone: "warning",
    },
    {
      title: "Softmax",
      statusLabel: "Rejected",
      call: "Do not claim the current row-softmax kernel as a win.",
      proof: "PyTorch fp16 p50 was 0.05018 ms; Triton fp16 p50 was 0.06554 ms.",
      tone: "error",
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
