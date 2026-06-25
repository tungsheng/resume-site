---
title: "SGLang Architecture Deep Dive: Request Lifecycle, Scheduler, and Prefix Cache"
summary: "A source-backed map of how requests move through an SGLang serving path, where scheduling choices happen, and how prefix reuse changes the shape of prefill work."
category: "Inference"
status: Outline
published: 2026-06-12
tags:
  - serving-architecture
  - SGLang
  - Scheduler
  - Prefix cache
  - Request lifecycle
related:
  projects:
    - gpu-inference-lab
  experiments:
    - kv-cache
    - batching
    - prefill-decode
  decisions:
    - gpu-inference-lab
---

This note starts as an implementation map rather than a benchmark claim. The goal is to trace the request lifecycle with enough precision that later measurements can point to a specific queue, cache boundary, or scheduler decision.

**Request lifecycle map**

1. HTTP or OpenAI-compatible request
2. Request object and sampling configuration
3. Prefill admission
4. Prefix cache lookup
5. Batch scheduling
6. Decode loop
7. Streaming or final response

## Scheduler and prefix cache outline

- Define the exact request object shape and where tokenizer output becomes scheduler input.
- Separate prefill pressure from decode pressure so TTFT, queue delay, and decode latency do not blur together.
- Mark the prefix cache lookup boundary before describing hit, partial-hit, and miss behavior.
- Tie scheduler state back to practical signals: active requests, waiting requests, KV allocation, and streamed token cadence.

**Evidence hooks to collect**

| Question | Signal | Why it matters |
| --- | --- | --- |
| Where does admission wait? | Queue time before prefill | Separates client pressure from model execution time |
| Was prefix reuse effective? | Cache hit shape and prefill tokens skipped | Explains TTFT changes without over-crediting scheduler tuning |
| When does decode become the limit? | Per-token latency and active batch size | Keeps decode bottlenecks separate from prompt processing |

> [!NOTE]
> **Drafting rule** — keep source links beside each architectural statement before promoting this from outline to published note.
