---
title: "Continuous Batching Changes What Throughput Means"
summary: "Static batching reports a number that rarely survives contact with real traffic. Continuous batching reshapes the GPU's work queue request by request, so the throughput you measure depends entirely on how arrivals overlap. This post explains why the headline tokens/sec is the wrong thing to optimize in isolation."
category: "Inference"
status: Drafting
published: 2026-06-20
tags:
  - inference-internals
  - Continuous batching
  - Scheduler
  - Throughput
  - vLLM
---

## The number everyone quotes

Benchmarks love a single tokens/sec figure.
It is easy to print and easy to compare.
The problem is that with continuous batching the figure is a property of the *arrival pattern*, not the engine.

When requests arrive in a tight burst, the scheduler packs many sequences into each forward pass and the GPU stays saturated.
When the same requests arrive spread out, the batch is half empty for most of the run and the same engine reports a fraction of the throughput.

## Why the queue is the real story

The scheduler admits and evicts sequences every step.
That means two metrics move together:

- how full the running batch is, step over step
- how long requests wait before their first token

A high average batch size with low queue delay is a healthy system.
A high tokens/sec that only appears under an unrealistic burst is a benchmark artifact.

Measure the distribution, not the peak — the peak is the easiest number to fake without meaning to.
