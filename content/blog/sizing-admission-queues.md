---
title: "Sizing Admission Queues Without Guessing"
summary: "A work-in-progress note on picking an admission queue depth from measured queue-delay curves instead of round numbers."
category: "Serving infrastructure"
status: Drafting
published: 2026-06-21
tags:
  - Admission control
  - Queueing
---

## Draft

This Post is still `Drafting`, so it is visible on the local dev server but is
excluded from the production build — there is no page for it in `dist/`.

The finished version will walk through reading a p95-queue-delay curve and
choosing the depth where added concurrency stops buying throughput.
