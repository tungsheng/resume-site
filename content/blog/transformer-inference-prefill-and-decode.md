---
title: "How Transformer Inference Runs: Prefill, Decode, and Why They Behave Differently"
summary: "A serving model does two very different kinds of work for every request: it reads the prompt, then writes a reply. Those two phases — prefill and decode — have opposite bottlenecks, and almost every confusing thing about inference performance comes from treating them as one. This is the mental model the rest of my inference writing builds on."
category: "Inference"
status: Published
published: 2026-06-24
tags:
  - transformer
  - prefill-decode
  - kv-cache
related:
  projects:
    - gpu-inference-lab
  experiments:
    - prefill-decode
---

Ask "how fast is this model?" and you'll get a number. Ask which half of the request that number describes and the conversation usually stalls. That's because a transformer serving a request does two genuinely different kinds of work — reading the prompt and writing the reply — and they have opposite bottlenecks. Almost every confusing result in inference performance comes from quietly averaging the two together.

This post builds the mental model the rest of my inference writing leans on. No benchmarks here, just the shapes: why the prompt is cheap per token, why generation is expensive per token, and why that asymmetry flips most serving intuitions.

## The forward pass, in one breath

A transformer is a stack of identical blocks. Each block does the same two things — attention, then a small feed-forward network — and the stack is run top to bottom. Feed in some tokens, and out the other end comes a probability distribution over what the next token should be.

The detail that matters for everything below: **one forward pass predicts exactly one next token.** That's it. The model doesn't write a sentence in a single shot; it writes one token, and to write the next one it runs the whole stack again with that token appended. Generating a reply is just this loop, turned hundreds of times.

So "running the model" is never one thing. It's a single dense pass over the prompt, followed by a long sequence of tiny passes that each add one token. Those are the two phases.

## Two phases, one model

When a request arrives, the model first has to *read* the prompt and then *write* the response. Same weights, same blocks — but the work splits into two regimes.

**Prefill** handles the prompt. Every prompt token is known up front, so they all go through the stack *together*, in parallel, in a single forward pass. To the GPU this is one big, dense matrix multiply over thousands of positions at once — exactly the dense, arithmetic-heavy work its compute units are built for. Prefill is **compute-bound**: the limiter is how many FLOPs the chip can do.

**Decode** handles generation. Here you're stuck with autoregression: token N+1 depends on token N, so you cannot compute them in parallel — you have to produce one, append it, and run the model again. Each step is a forward pass over a *single* new position. The matrices are tiny, and you do it once per output token.

![Prefill runs the whole prompt through one parallel forward pass and is compute-bound; decode generates one token per pass in an autoregressive loop and is memory-bound](/assets/blog/transformer-inference-prefill-and-decode/prefill-vs-decode.svg)

The asymmetry is the whole story. Prefill might process several thousand tokens in one pass; decode processes one token, then another, then another. Same model, opposite shapes of work — and, as it turns out, opposite bottlenecks.

## Why decode is memory-bound

Decode has an obvious problem: attention at step N needs the keys and values of *every* earlier token. Recomputing those from scratch each step would make generation quadratic in length — unworkable. The fix is the **KV cache**: compute each token's keys and values once, store them, and reuse them on every later step.

The cache makes decode tractable, but it also defines decode's cost. It grows by one entry per generated token — times every layer, times every attention head — and each new step has to *read the whole thing* to attend over all prior tokens.

![The KV cache grows by one entry per generated token, and each decode step re-reads the entire cache, so reads scale with sequence length](/assets/blog/transformer-inference-prefill-and-decode/kv-cache-growth.svg)

Add it up and a decode step does very little arithmetic but moves a lot of memory. The compute units sit mostly idle while memory bandwidth — shuttling that growing cache in and out — sets the pace. That's the definition of **memory-bound**, and it's the exact opposite of prefill.

> [!NOTE]
> "Compute-bound" and "memory-bound" just name which resource runs out first. Prefill saturates the chip's math units; decode saturates its memory bandwidth. A kernel can only be sped up by relieving whichever one is actually the limit — which is why the same optimization can help one phase and do nothing for the other.

## What this means for serving

Once you hold the two phases side by side, a lot of serving behavior stops looking arbitrary.

- **"Throughput" is ambiguous.** Prefill tokens per second and decode tokens per second measure different machines. A headline number that blends them tells you almost nothing — you have to say which phase, and at what prompt and output lengths. I dig into exactly this trap in [Continuous Batching Changes What Throughput Means](/blog/continuous-batching-throughput).
- **The KV cache, not compute, caps concurrency.** Because every in-flight sequence holds a slice of cache that grows with its length, you run out of memory long before you run out of math. That ceiling is the subject of [The KV Cache Is the Real Batch-Size Ceiling](/blog/kv-cache-is-the-batch-size-ceiling).
- **Continuous batching exists because of this split.** Prefill and decode have such different shapes that running them naively leaves the GPU idle half the time; continuous batching interleaves many requests' prefills and decodes to keep the chip busy.
- **Prefix caching attacks the prefill side.** If many requests share a prompt prefix, you can reuse its KV instead of re-running prefill — which is why [prefix cache hit rate](/blog/prefix-cache-hit-rate-matters) is one of the first numbers I check.

The throughline: there is no single bottleneck to optimize. There are two, they live in different phases, and a serving knob is really a bet about which one you're relieving.

## Where this goes next

This was the map — two phases, opposite bottlenecks, the KV cache sitting between them. The next post in this thread zooms all the way in on a single decode step: the resident KV read, the attention and sampling work, and how the latency you measure actually gets attributed across them. The shape stays the same; the resolution goes way up.

If you only keep one thing: when someone quotes an inference number, ask which phase it describes. Half the time, that question is the answer.
