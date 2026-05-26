import {
  CUDA_KERNEL_DECISIONS_PATH,
  CUDA_KERNEL_EXPERIMENTS_PATH,
  DECISIONS_PATH,
  GPU_INFERENCE_DECISIONS_PATH,
  GPU_INFERENCE_EXPERIMENTS_PATH,
} from "./content";
import { experimentCatalogContent } from "./experiment-catalog-content";
import { getProjectById, type ProjectId } from "./projects-content";

export type DecisionStatus =
  | "Supported"
  | "Rejected"
  | "Partial"
  | "Blocked"
  | "Measured"
  | "Caveated";

export type DecisionRecord = {
  id: string;
  projectId: ProjectId;
  domain: string;
  title: string;
  status: DecisionStatus;
  call: string;
  evidence: string;
  experimentSlugs: string[];
  nextEvidence?: string;
};

export type DecisionProjectSummary = {
  projectId: ProjectId;
  path: string;
  experimentsPath: string;
  title: string;
  sectionTitle: string;
  lead: string;
};

export const decisionProjectSummaries: DecisionProjectSummary[] = [
  {
    projectId: "gpu-inference-lab",
    path: GPU_INFERENCE_DECISIONS_PATH,
    experimentsPath: GPU_INFERENCE_EXPERIMENTS_PATH,
    title: "GPU Inference Decisions",
    sectionTitle: "Architecture Decisions",
    lead:
      "Architecture calls derived from EKS/vLLM serving measurements, with each decision tied back to the experiment evidence that supports, rejects, or bounds it.",
  },
  {
    projectId: "cuda-kernel-lab",
    path: CUDA_KERNEL_DECISIONS_PATH,
    experimentsPath: CUDA_KERNEL_EXPERIMENTS_PATH,
    title: "CUDA Kernel Lab Decisions",
    sectionTitle: "Kernel Optimization Decisions",
    lead:
      "Kernel optimization calls derived from CUDA/Triton benchmark and profiler evidence across A10G and H200, with caveats kept beside the experiment that produced them.",
  },
];

export const decisionRecords: DecisionRecord[] = [
  {
    id: "bounded-admission",
    projectId: "gpu-inference-lab",
    domain: "Admission + readiness",
    title: "Bounded admission",
    status: "Supported",
    call: "Use bounded admission when requests can arrive before model readiness.",
    evidence: "100% queued delivery; direct clients dropped 237-787 iterations.",
    experimentSlugs: ["request-patterns", "autoscaling"],
  },
  {
    id: "cold-start-readiness",
    projectId: "gpu-inference-lab",
    domain: "Admission + readiness",
    title: "Cold-start readiness",
    status: "Partial",
    call: "Optimize readiness before treating node launch as the cold-start bottleneck.",
    evidence: "NodeClaim and GPU node arrival were fast; image, container, and model readiness drove the 425-439s wait.",
    experimentSlugs: ["autoscaling"],
    nextEvidence: "Capture first-successful-completion timing across the selected cold-start reports.",
  },
  {
    id: "long-context-boundary",
    projectId: "gpu-inference-lab",
    domain: "Long-context scheduling",
    title: "Long-context boundary",
    status: "Supported",
    call: "Set a concurrency or admission boundary for 8192/300 traffic.",
    evidence: "1.20 req/s still delivers 100%, but repeats 36.8s p95 queue delay.",
    experimentSlugs: ["kv-cache", "prefill-decode"],
  },
  {
    id: "long-context-scheduler-caps",
    projectId: "gpu-inference-lab",
    domain: "Long-context scheduling",
    title: "Long-context scheduler caps",
    status: "Rejected",
    call: "Do not use seq caps or larger batched-token caps as the first 1.20 req/s fix.",
    evidence: "seqs-16 hit 76.24s p95; seqs-24 hit 61.36s; batched-16384 hit 55.58s.",
    experimentSlugs: ["kv-cache", "batching"],
  },
  {
    id: "small-request-scheduler",
    projectId: "gpu-inference-lab",
    domain: "Long-context scheduling",
    title: "Small-request scheduler",
    status: "Supported",
    call: "Keep vLLM dynamic defaults for current 512/128 steady and burst traffic.",
    evidence: "Dynamic default kept the best delivery and token throughput.",
    experimentSlugs: ["batching", "request-patterns"],
  },
  {
    id: "useful-work-cost",
    projectId: "gpu-inference-lab",
    domain: "Cost + autoscaling",
    title: "Useful-work cost",
    status: "Supported",
    call: "Use batching for small-request economics, but gate burst SLO claims.",
    evidence: "$0.019752/1K steady optimized; burst optimized p95 still 10.91s.",
    experimentSlugs: ["cost", "batching"],
  },
  {
    id: "active-pressure-target",
    projectId: "gpu-inference-lab",
    domain: "Cost + autoscaling",
    title: "Active-pressure target",
    status: "Partial",
    call: "Keep active-pressure HPA testing, but do not treat target 8 as optimal.",
    evidence: "Targets 2/4/6/8 were all underutilized.",
    experimentSlugs: ["autoscaling"],
    nextEvidence: "Run a higher-pressure HPA sweep that reaches clear GPU utilization separation.",
  },
  {
    id: "fp8-kv-g4dn",
    projectId: "gpu-inference-lab",
    domain: "Quantization + hardware",
    title: "FP8 KV on g4dn",
    status: "Rejected",
    call: "Do not select FP8 KV for this current long-context path.",
    evidence: "47.58-69.12% delivery versus 100% baseline.",
    experimentSlugs: ["kv-cache"],
  },
  {
    id: "blackwell-fp4",
    projectId: "gpu-inference-lab",
    domain: "Quantization + hardware",
    title: "Blackwell FP4",
    status: "Blocked",
    call: "Hold the FP4 architecture decision until B200 results exist.",
    evidence: "EC2 UnfulfillableCapacity; no quantized artifact produced.",
    experimentSlugs: ["fp4"],
    nextEvidence: "Rerun once B200 capacity can produce a comparable quantized artifact.",
  },
  {
    id: "rmsnorm-fusion",
    projectId: "cuda-kernel-lab",
    domain: "Fusion wins",
    title: "Fused RMSNorm",
    status: "Supported",
    call: "Use fusion for RMSNorm because it removes enough framework and intermediate-tensor overhead to beat PyTorch across the measured shape sweep.",
    evidence: "fp16 reached 5.901x at 4096x8192; the 4096x4096 rerun reached 5.599x.",
    experimentSlugs: ["kernel-normalization-fusion", "kernel-profiler-validation"],
  },
  {
    id: "swiglu-fusion",
    projectId: "cuda-kernel-lab",
    domain: "Fusion wins",
    title: "Fused SwiGLU",
    status: "Supported",
    call: "Treat elementwise fusion as a strong path before deeper matmul work.",
    evidence: "fp32 0.4547 ms Triton vs 1.418 ms PyTorch; 3.119x speedup.",
    experimentSlugs: ["kernel-swiglu-fusion"],
  },
  {
    id: "memory-primitives",
    projectId: "cuda-kernel-lab",
    domain: "Memory/reduction boundaries",
    title: "Memory primitives",
    status: "Caveated",
    call: "Do not broaden simple launch sweeps before profiler counters explain the PyTorch lead.",
    evidence: "Triton vector_add profile shows 91.58% DRAM throughput rather than an obvious block-size fix.",
    experimentSlugs: ["kernel-memory-primitives", "kernel-profiler-validation"],
    nextEvidence: "Prioritize fusion or reuse changes before wider simple-memory launch sweeps.",
  },
  {
    id: "reduction-strategy",
    projectId: "cuda-kernel-lab",
    domain: "Memory/reduction boundaries",
    title: "Reduction strategy",
    status: "Caveated",
    call: "Keep reduction variants as an active track, but do not claim a PyTorch win yet.",
    evidence: "Both Triton reduction variants passed correctness and streamed well, but still trailed the PyTorch baseline.",
    experimentSlugs: ["kernel-reduction-strategy", "kernel-profiler-validation"],
    nextEvidence: "Target launch/finalization overhead or a different reduction structure.",
  },
  {
    id: "row-softmax",
    projectId: "cuda-kernel-lab",
    domain: "Memory/reduction boundaries",
    title: "Row softmax",
    status: "Rejected",
    call: "Do not present the current row-softmax kernel as a portfolio win.",
    evidence: "PyTorch beat the current Triton fused row-softmax kernel in both float16 and float32.",
    experimentSlugs: ["kernel-softmax-fusion"],
  },
  {
    id: "matmul-tile-sweep",
    projectId: "cuda-kernel-lab",
    domain: "Matmul/Tensor Core gaps",
    title: "Matmul tile sweep",
    status: "Caveated",
    call: "Treat Triton tiling as an active optimization track, not a portfolio win over cuBLAS yet.",
    evidence: "Best Triton tile reached 25.74 TFLOP/s; PyTorch/cuBLAS stayed around 30-31 TFLOP/s.",
    experimentSlugs: ["kernel-matmul-tiling", "kernel-profiler-validation"],
    nextEvidence: "Profile the current best tile before the next tuning pass.",
  },
  {
    id: "h200-matmul-autotune",
    projectId: "cuda-kernel-lab",
    domain: "Matmul/Tensor Core gaps",
    title: "H200 matmul autotune",
    status: "Caveated",
    call: "Keep H200 matmul as an active gap-closing track; standard tiled-dot is currently best, while persistent-wave scheduling is measured but not yet useful.",
    evidence: "Clean focused H200 timing reached 470.7 TFLOP/s bfloat16 and 462.0 TFLOP/s float16, about 88-90% of PyTorch/cuBLAS; the latest persistent-wave sweep kept standard Triton ahead at 471.4 TFLOP/s bfloat16.",
    experimentSlugs: ["kernel-h200-matmul-autotune"],
    nextEvidence: "Run Tensor Core counter profiles on an H200 host with NVIDIA performance-counter access; current RunPod profile reports hit permission failures.",
  },
  {
    id: "decode-graph-replay",
    projectId: "cuda-kernel-lab",
    domain: "Decode replay caveats",
    title: "Decode graph replay",
    status: "Caveated",
    call: "Use resident-KV same-stream piecewise CUDA Graph replay as a measured synthetic upper bound, not an end-to-end serving claim.",
    evidence: "Round 12 reached 0.1375 ms fixed-shape p50 and about 0.156 ms dynamic p50 / 0.230 ms p95.",
    experimentSlugs: ["kernel-decode-step-graph-replay"],
    nextEvidence: "Turn timing probes back on to explain the remaining p95 tail.",
  },
  {
    id: "profiler-backed-proof",
    projectId: "cuda-kernel-lab",
    domain: "Matmul/Tensor Core gaps",
    title: "Profiler-backed proof",
    status: "Measured",
    call: "Use counters to explain benchmark results instead of treating latency alone as the answer.",
    evidence: "RMSNorm profile shows 90.91% DRAM throughput and 93.12% occupancy; profiled matmul shows 45.19% Tensor Core utilization.",
    experimentSlugs: ["kernel-profiler-validation", "kernel-normalization-fusion", "kernel-matmul-tiling"],
  },
];

export function decisionProjectPath(projectId: ProjectId): string {
  return `${DECISIONS_PATH}/${projectId}`;
}

export function getDecisionProjectSummary(projectId: ProjectId): DecisionProjectSummary {
  const summary = decisionProjectSummaries.find((item) => item.projectId === projectId);

  if (!summary) {
    throw new Error(`Unknown decision project id: ${projectId}`);
  }

  return summary;
}

export function getDecisionRecordsByProject(projectId: ProjectId): DecisionRecord[] {
  return decisionRecords.filter((decision) => decision.projectId === projectId);
}

export function getDecisionRecordsByExperimentSlug(slug: string): DecisionRecord[] {
  return decisionRecords.filter((decision) => decision.experimentSlugs.includes(slug));
}

export function getDecisionDomains(projectId: ProjectId): string[] {
  return Array.from(
    new Set(getDecisionRecordsByProject(projectId).map((decision) => decision.domain)),
  );
}

export function getDecisionExperimentTitle(slug: string): string {
  return experimentCatalogContent.experiments.find((experiment) => experiment.slug === slug)?.title ?? slug;
}

export function getDecisionProjectTitle(projectId: ProjectId): string {
  return getProjectById(projectId).title;
}
