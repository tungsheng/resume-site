---
title: "The KV Cache Is the Real Batch-Size Ceiling"
summary: "It is tempting to size a serving deployment by how many requests the GPU can compute in parallel. In practice the limit shows up earlier and somewhere else: the KV cache. Every concurrent sequence reserves memory that grows with its length, and once that pool is exhausted the scheduler stops admitting work no matter how much compute is idle."
category: "Inference"
status: Drafting
published: 2026-06-21
updated: 2026-06-22
cover: /assets/blog/kv-cache-is-the-batch-size-ceiling/kv-cache-layout.svg
tags:
  - inference-internals
  - KV cache
  - Batching
  - GPU memory
  - Scheduler
related:
  projects:
    - gpu-inference-lab
  experiments:
    - kv-cache
    - batching
  decisions:
    - gpu-inference-lab
---

## Compute is rarely what runs out first

When people reason about how many requests a model server can handle at once, they usually reason about compute: how many sequences fit in a forward pass before the GPU saturates. That instinct is backwards for most autoregressive workloads. The forward pass is cheap to share; the *memory* each sequence holds onto is not.

Every active sequence keeps a key/value tensor for each layer, and that tensor grows by one slot per generated token. The model weights take a fixed slice of memory. Everything left over is the KV cache pool, and the batch you can actually run is whatever fits in that pool.

![GPU memory split between model weights and the growing KV cache](/assets/blog/kv-cache-is-the-batch-size-ceiling/kv-cache-layout.svg)

> [!NOTE]
> "Batch size" in a continuous-batching engine is not a fixed knob you set. It is an outcome of how much KV cache is free at each step, which is why the same deployment serves wildly different concurrency depending on prompt and output lengths.

## The metric that actually predicts saturation

If you want to predict when admission stalls, watch KV cache utilisation, not GPU utilisation. The two tell different stories:

| Signal | What it measures | What it misses |
| --- | --- | --- |
| GPU utilisation | How busy the compute units are | Says nothing about memory headroom |
| KV cache utilisation | Fraction of the cache pool in use | The usual first wall you hit |
| Admission wait time | Queue delay before first token | Only moves *after* the cache is full |

A server can sit at modest GPU utilisation and still refuse new requests because the cache pool is full of long, half-finished generations. That is not a compute problem and adding compute will not fix it.

> [!WARNING]
> Benchmarks with short, uniform outputs make this ceiling invisible. Sequences finish and free their slots before the pool fills, so you measure a concurrency number you will never see under traffic with long or variable outputs.

## What to do about it

The levers that move the ceiling are memory levers: shorter retained context, paged or quantised KV storage, and eviction policies that reclaim slots from finished or pre-empted sequences quickly. Tuning the "max batch size" flag without touching memory just changes which number the scheduler ignores.

Size the deployment by the cache, measure the cache, and the throughput you promise will survive contact with real traffic.
