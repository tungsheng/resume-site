---
title: "Why Prefix Cache Hit Rate Is the First Number to Check"
summary: "Before tuning batch size or concurrency, the KV prefix cache hit rate tells you whether you are even in the right problem space. This post walks through what the metric captures, why it compounds across requests, and how to read it before touching any other serving parameter."
category: "Inference"
status: Drafting
published: 2026-06-18
tags:
  - inference-internals
  - Prefix cache
  - KV cache
  - SGLang
  - Serving
---

## Why this number comes first

Every token in a prefill has to be either computed from scratch or read from the KV cache.
Compute-from-scratch costs proportionally to sequence length and model size.
A cache hit costs almost nothing.
That asymmetry means the prefix cache hit rate is a multiplier on every other serving metric — TTFT, throughput, and GPU utilization all move with it.

If your hit rate is low, tuning concurrency or batch size is adjusting the output of a broken system.
Fix the input first.

## What the hit rate actually measures

The prefix cache stores the key-value tensors computed during previous prefill steps.
When a new request arrives with a prefix that matches a cached sequence, the serving runtime skips recomputing those tokens.

Hit rate is the fraction of prefill tokens served from the cache rather than recomputed:

```
hit_rate = cached_tokens / total_prefill_tokens
```

A hit rate of 0.0 means every request is fully computed. A hit rate of 0.9 means 90 percent of prefill work was skipped.

## The compounding effect

Prefix reuse compounds because many workloads share structure:

- System prompts appear at the start of every request in a chat application.
- Tool definitions repeat across all agent invocations.
- Few-shot examples are prepended to every classification request.

When these shared prefixes are cached, every request in the workload benefits — not just the first one.
The gain is not additive; it scales with both the fraction of shared tokens and the frequency of reuse across concurrent sessions.

## How to read the number

Three zones to distinguish:

- **Below 0.3** — Most prefill work is being recomputed. Check whether the cache is sized for your workload and whether requests share enough structure to benefit. If not, the workload may be inherently uncacheable (long unique contexts).
- **0.3 to 0.7** — Partial reuse. Common for mixed workloads where some requests share prefixes and some do not. Profile which request types are hitting and which are missing.
- **Above 0.7** — Strong reuse. TTFT should be significantly lower than the full-prefill baseline. If TTFT is still high here, the bottleneck has moved to decode or scheduling, not prefill compute.

## What to check before tuning the cache

Before changing cache size or eviction policy, verify:

1. **Are requests actually sharing prefixes?** Log the first 50–100 tokens of each request and count collisions. If requests are unique, no cache policy will help.
2. **Is the cache large enough to hold the shared prefix?** A system prompt of 2k tokens that gets evicted before the next request arrives gives zero benefit.
3. **Is the cache warm?** After a server restart, hit rate starts at zero and climbs as shared prefixes are recomputed and stored. Measure steady-state, not cold-start.

## The relationship to TTFT

Time to first token is the user-visible effect of prefill cost.
A high prefix cache hit rate should compress TTFT toward the scheduling and decode baseline — the irreducible overhead that remains when prefill work is near zero.

If hit rate is high and TTFT is still elevated, the remaining latency is in:

- Scheduling delay before the request enters the batch
- Decode pressure from concurrent requests consuming GPU time
- Overhead in token streaming and response serialization

These are separate problems. The prefix cache hit rate tells you which door to open first.
