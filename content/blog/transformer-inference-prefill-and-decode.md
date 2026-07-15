---
title: "LLM Inference: The Life of a Request"
summary: "A serving model does two very different kinds of work for every request: it reads the prompt, then writes a reply. Those two phases — prefill and decode — have opposite bottlenecks, and almost every confusing thing about inference performance comes from treating them as one. This is the mental model the rest of my inference writing builds on."
category: "Inference"
status: Published
published: 2026-06-24
tags:
  - transformer
  - prefill-decode
  - kv-cache
related:
  experiments:
    - prefill-decode
---

This post is the mental model the rest of my inference writing sits on. No benchmarks. No hand-waving. Just the shape of the system: prompt tokens are cheap, generation is expensive, and that asymmetry breaks a lot of the serving intuitions people bring in from the rest of software.

I’m a full-stack engineer by trade, so I’ve spent years thinking in requests, responses, and the plumbing between them. Inference pulled me in because I wanted to understand what actually happens between an API call and the tokens streaming back. The deeper I went, the more interesting it became — so I started taking notes. These are the ones I wish I’d had on day one.

## The life of one request

It helps to start where a full-stack engineer naturally does: with the request. A model call looks like any other API call — text in, text out — but the middle is strange enough that the familiar request/response picture quietly breaks. Here is the whole path.

**The text becomes numbers.** A model never sees characters; it sees integers. The first step, **tokenization**, splits the prompt into tokens — common words, word-pieces, punctuation — and maps each to an ID from a fixed vocabulary (Figure 1).

![Figure 1 — Tokenization: prompt text becomes tokens, then integer IDs. The model only ever sees the IDs.](/assets/blog/transformer-inference-prefill-and-decode/tokenization.svg)

Those token IDs are the model's real input. They run through the **forward pass** — the prefill and decode work that is the rest of this post — and out comes one new token ID at a time, each **detokenized** back into text.

**Then the reply has to reach the client.** Because the response is produced one token at a time across hundreds of steps, the model hands you a choice. You can buffer the whole answer and return it in a single response — simple, but the caller waits, watching nothing, for seconds. Or you can **stream** each token as it lands, over a long-lived connection (Server-Sent Events or chunked HTTP), so text appears as it is written. Streaming is why chat feels alive, and it exists *because* generation is incremental: the same autoregressive loop that makes decode slow is exactly what makes token-by-token streaming both possible and worth the plumbing.

So the path of one request is: tokenize → prefill → decode loop → detokenize → stream out (Figure 2). The two ends are ordinary serving work. The strange, interesting part is the middle — which is where the rest of this post lives.

![Figure 2 — The life of one request: a client's prompt is tokenized, run through prefill then the decode loop, detokenized, and streamed back. The ends are ordinary serving; prefill and decode are the engine.](/assets/blog/transformer-inference-prefill-and-decode/request-lifecycle.svg)

## The forward pass, in one breath

Before splitting the work into phases, it helps to picture what a single pass through the model actually does. A token comes in as text; the model turns it into a vector — an **embedding** — that also carries its position in the sequence. That vector then flows through a stack of **identical decoder blocks**.

Each block does two things, in order. First a **self-attention** sublayer, where the token looks back at every earlier token and pulls in whatever is relevant. Then a **feed-forward network** (an MLP), where it does per-token reasoning on what it just gathered. Both sublayers are wrapped the same way: normalize the input, run the sublayer, then **add the result back** to the input — the residual connection that lets information skip straight down the stack. The same block shape repeats N times; only the learned weights differ between layers.

At the very bottom, one final normalization and a projection turn the last vector into **logits** — a score for every token in the vocabulary — which become a probability distribution over what comes next (Figure 3).

![Figure 3 — A transformer forward pass: embeddings flow through N identical decoder layers to a next-token distribution.](/assets/blog/transformer-inference-prefill-and-decode/transformer-forward-pass.svg)

The detail that matters for everything below: **one forward pass predicts exactly one next token.** That's it. The model doesn't write a sentence in a single shot; it writes one token, and to write the next one it runs the whole stack again with that token appended. Generating a reply is just this loop, turned hundreds of times.

So "running the model" is never one thing. It's a single dense pass over the prompt, followed by a long sequence of tiny passes that each add one token. Those are the two phases.

## Two phases, one model

When a request arrives, the model first has to *read* the prompt and then *write* the response. Same weights, same blocks — but the work splits into two regimes.

**Prefill** handles the prompt. Every prompt token is known up front, so they all go through the stack *together*, in parallel, in a single forward pass. To the GPU this is one big, dense matrix multiply over thousands of positions at once — exactly the dense, arithmetic-heavy work its compute units are built for. Prefill is **compute-bound**: the limiter is how many floating-point operations (FLOPs) the chip can do.

**Decode** handles generation. Here you're stuck with autoregression: token N+1 depends on token N, so you cannot compute them in parallel — you have to produce one, append it, and run the model again. Each step is a forward pass over a *single* new position — the weights are the same full-size matrices as in prefill, but now they multiply one lone vector instead of thousands, and you do it once per output token (Figure 4).

![Figure 4 — Prefill runs the whole prompt through one parallel pass (compute-bound); decode generates one token per pass in a loop (memory-bound).](/assets/blog/transformer-inference-prefill-and-decode/prefill-vs-decode.svg)

The asymmetry is the whole story. Prefill might process several thousand tokens in one pass; decode processes one token, then another, then another. Same model, opposite shapes of work — and, as it turns out, opposite bottlenecks.

Why can prefill parallelize when decode can't? Because during prefill every token the model needs to attend to already exists — the whole prompt is sitting there, so all positions can be pushed through the stack at once. Decode is the mirror image: the token at step N+1 *is the output* of step N, so it cannot begin until that step finishes. The dependency is fundamental, not an implementation detail — it's why generation stays a sequence of small, strictly ordered steps no matter how much hardware you point at it.

Make it concrete. A 2,000-token prompt with a 200-token answer is *one* prefill pass over 2,000 positions, followed by *200* decode passes of a single position each. Almost all of the model's parallel-friendly work happens in that first step; almost all of the wall-clock waiting happens across the 200 that follow. Those two halves even have their own latency numbers: prefill sets the **time to first token (TTFT)** — how long the user waits before anything appears — while decode owns two: **time per output token (TPOT)**, the average pace across the whole reply, and **inter-token latency (ITL)**, the gap between consecutive tokens that decides whether that pace feels steady or arrives in jerky bursts. That single picture — one fat pass, then a long thin tail — is the shape nearly every serving decision is quietly reacting to.

## Why decode is memory-bound

Decode has an obvious problem: attention at step N needs the keys and values of *every* earlier token. Recomputing those from scratch each step would make generation quadratic in length — unworkable. The fix is the **key/value (KV) cache**: compute each token's keys and values once, store them, and reuse them on every later step.

It's worth noticing *which* part of the block needs this history. The MLP sublayer only ever looks at the current token — it has no memory. It's **attention** that reaches back across the whole sequence. So the KV cache is really an *attention* cache: the running price of letting every new token see the entire past.

The cache makes decode tractable, but it also defines decode's cost. It grows by one entry per generated token — times every layer, times every attention head — and each new step has to *read the whole thing* to attend over all prior tokens (Figure 5).

![Figure 5 — The KV cache grows by one entry per token, and every decode step re-reads all of it.](/assets/blog/transformer-inference-prefill-and-decode/kv-cache-growth.svg)

Add it up and a decode step does very little arithmetic but moves a lot of memory. The compute units sit mostly idle while memory bandwidth — shuttling that growing cache in and out — sets the pace. That's the definition of **memory-bound**, and it's the exact opposite of prefill.

There's a clean way to name which regime you're in: **arithmetic intensity** — how much math you do per byte you pull from memory. Prefill does a lot of math on each weight it loads, so the math units stay saturated. Decode reads the same weights *and* the whole KV cache just to produce one token — very little math per byte — so the chip finishes the arithmetic long before the next bytes arrive, and bandwidth becomes the wall.

> [!NOTE]
> "Compute-bound" and "memory-bound" just name which resource runs out first. Prefill saturates the chip's math units; decode saturates its memory bandwidth. A kernel can only be sped up by relieving whichever one is actually the limit — which is why the same optimization can help one phase and do nothing for the other.

## What this means for serving

Once you hold the two phases side by side, a lot of serving behavior stops looking arbitrary. There are countless ways to make LLM inference faster; here are just a few that fall straight out of the prefill/decode split:

- **The KV cache, not compute, caps concurrency.** Because every in-flight sequence holds a slice of cache that grows with its length, you run out of memory long before you run out of math. The scarce resource isn't FLOPs; it's room for the cache.
- **Continuous batching schedules at the token level, not the request level.** Classic batching locks a group of requests together until all of them finish; continuous (iteration-level) batching rebuilds the batch every decode step — finished sequences drop out and waiting ones join immediately, so no request stalls behind another's long generation.
- **Prefill and decode can run on separate hardware.** Since one is compute-bound and the other bandwidth-bound, some stacks split them across different GPU pools — *prefill/decode disaggregation* — each pool sized for the resource that phase actually exhausts.
- **Prefix caching attacks the prefill side.** If many requests share a prompt prefix, you can reuse its KV instead of re-running prefill — which is why the prefix-cache hit rate is one of the first numbers worth checking.

The throughline: there's no single bottleneck to optimize. The prefill/decode split is the first cut — two phases with opposite appetites, compute-bound versus memory-bound — and most serving knobs start with which phase you're relieving. But it's a frame, not the whole list: real systems run into plenty of other limits too, from memory capacity to interconnect to kernel efficiency.

That’s the map at its coarsest — two phases, opposite bottlenecks, the KV cache between them. Each of those optimizations is its own rabbit hole, and there are many more beyond this handful; inference keeps rewarding the next question, which is why I find it so much fun to take apart. I’ll keep investigating and sharing the notes as I go.
