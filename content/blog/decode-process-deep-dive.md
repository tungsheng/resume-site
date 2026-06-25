---
title: "Decode Process Deep Dive"
summary: "A practical walk through one decode step, from resident KV reads through attention, sampling, batching decisions, and latency attribution."
category: "Inference"
status: Outline
published: 2026-06-12
tags:
  - inference-internals
  - Decode
  - KV cache
  - Attention
  - CUDA Graphs
related:
  projects:
    - gpu-inference-lab
    - cuda-kernel-lab
  experiments:
    - prefill-decode
    - kernel-decode-step-graph-replay
    - kernel-profiler-validation
  decisions:
    - gpu-inference-lab
    - cuda-kernel-lab
---

This note focuses on the token-at-a-time path after prefill. It should explain the mechanics clearly enough to connect serving metrics with kernel-level experiments without pretending a synthetic kernel replay is an end-to-end serving result.

**Decode loop mental model**

1. Select active sequences
2. Read resident KV cache
3. Run attention and MLP work
4. Project logits
5. Sample next token
6. Append KV and token state
7. Stream token or mark completion

## What to separate

- Do not mix TTFT with steady decode token latency when explaining a serving result.
- Track whether a timing point includes sampling, streaming, scheduler work, or only GPU kernels.
- Treat CUDA Graph replay as a useful upper-bound experiment until it is wired into the whole serving path.
- Record batch shape, sequence length, and KV residency because they change the decode cost model.

**Pseudo decode step**

```
select active requests -> run one token forward pass -> sample -> append token and KV -> stream token
```

> [!WARNING]
> **Portfolio angle** — this note should bridge the GPU Inference Lab timing evidence and the CUDA Kernel Lab decode replay evidence without collapsing them into one claim.
