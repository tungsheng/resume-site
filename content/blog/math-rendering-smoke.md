---
title: "KaTeX Math Rendering (smoke test)"
summary: "A Drafting fixture that exercises the build-time KaTeX pipeline (ADR-0006): inline and display math, plus the escaped-dollar convention. Never ships to production — it stays Drafting so the capability has a page to render against in a dev build without converting any real post."
category: "Inference"
status: Drafting
published: 2026-06-28
tags:
  - katex
  - math
---

## Inline math

The attention scores normalize with a softmax, so a single query row sums to
one: $\sum_i a_i = 1$ where $a_i = \mathrm{softmax}(q \cdot k_i)$.

Energy is $E = mc^2$, and a literal price like \$5 stays plain text because the
single dollar is escaped.

## Display math

Scaled dot-product attention, written out:

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
$$

That is the whole formula the pipeline has to render at build time, with no
client-side JavaScript.
