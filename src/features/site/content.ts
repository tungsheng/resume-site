// Work-section IA ("Plan A" consolidation): /work is the single index and each
// project has one consolidated case-study page under /work/. Decisions and
// per-project experiment lists live as sections (#decisions / #experiments) on
// the project page; only experiment detail leaves keep their own routes under
// /experiments/<slug> as the evidence archive.
export const WORK_PATH = "/work";
export const GPU_INFERENCE_PROJECT_PATH = `${WORK_PATH}/gpu-inference-lab`;
export const CUDA_KERNEL_PROJECT_PATH = `${WORK_PATH}/cuda-kernel-lab`;
export const GPU_INFERENCE_EXPERIMENTS_PATH = `${GPU_INFERENCE_PROJECT_PATH}#experiments`;
export const CUDA_KERNEL_EXPERIMENTS_PATH = `${CUDA_KERNEL_PROJECT_PATH}#experiments`;
export const GPU_INFERENCE_DECISIONS_PATH = `${GPU_INFERENCE_PROJECT_PATH}#decisions`;
export const CUDA_KERNEL_DECISIONS_PATH = `${CUDA_KERNEL_PROJECT_PATH}#decisions`;
