---
title: "Scheduling: How Continuous Batching and Paged Attention Fill a GPU"
summary: "Orca reported 36.9× the throughput of FasterTransformer at the same latency without touching the model's math; a year later vLLM's profiling found as little as a fifth of KV-cache memory holding actual tokens. Two papers, two mechanisms — re-form the batch every iteration, page the cache in 16-token blocks — and everything else an LLM scheduler does today is policy."
category: "Inference"
status: Drafting
published: 2026-07-07
tags:
  - scheduling
  - continuous-batching
  - paged-attention
  - kv-cache
  - inference
related:
  projects:
    - gpu-inference-lab
---

In 2022, [Orca](https://www.usenix.org/conference/osdi22/presentation/yu) reported serving GPT-3 175B at 36.9× the throughput of NVIDIA's FasterTransformer at the same level of latency (author-reported, on their own benchmark). No new kernels made the model faster and no weights changed — the gain came from changing *what the scheduler considers one unit of work*. A year later, the [vLLM paper](https://arxiv.org/abs/2309.06180) profiled how serving systems of that generation used the GPU memory they held and found that only 20.4%–38.2% of KV-cache memory stored actual token states; its fix, PagedAttention, raised that to 96.3% and delivered 2–4× throughput at the same latency (also author-reported).

The first post in this series compressed the batching half of this into one bullet — "continuous batching schedules at the token level, not the request level" — and the posts since have stayed inside the model: what attention costs, what the multilayer perceptron (MLP) weighs, which experts run. These are my notes from the layer above the forward pass: the serving loop that decides, every few milliseconds, which requests are in the batch and where their key/value (KV) cache lives. Two mechanisms carry it — re-form the batch every iteration, and page the cache in fixed-size blocks. Everything else the scheduler does is policy.

## Iteration-level scheduling: the batch is re-formed every step

Orca's mechanism is **iteration-level scheduling**: the scheduler invokes the engine for *one iteration* — a single forward pass over the current batch — and re-forms the batch before the next one. A sequence that just emitted its final token leaves immediately; a waiting request takes the freed slot on the very next pass. The batch stays full as long as the queue is non-empty, which is where the 36.9× comes from: FasterTransformer at the same latency target must run small, conservatively-sized batches, while Orca's batch is rebuilt around whatever is in flight.

What it replaced is the arrangement Orca's abstract calls inflexible scheduling: the server batches like a web server, admitting a group of requests and running them as one unit. The problem is that decode is a loop, not a call — one forward pass produces one token, and different replies need different numbers of passes. In a request-level batch, "requests that have finished earlier than other requests in a batch cannot return to the client, while newly arrived requests have to wait until the current batch completely finishes." A four-slot batch whose shortest reply takes 30 tokens and longest takes 500 spends most of its iterations with finished sequences occupying slots and queued requests waiting outside.

![Figure 1 — Request-level batching runs a batch until its longest member finishes: finished sequences hold their slots as idle iterations, and the queue waits for the whole batch. Iteration-level scheduling re-forms the batch after every forward pass: a finished sequence's slot is refilled on the next iteration.](/assets/blog/scheduling-continuous-batching-paged-attention/static-vs-continuous.svg)

> [!NOTE]
> Batching sequences of different lengths into one forward pass takes a second idea the paper calls **selective batching**. The matmuls that dominate the block — the Q/K/V projections and the MLP — are per-token: tokens from different requests can be stacked into one tall matrix regardless of whose sequence they belong to. Attention cannot be batched that way — each sequence attends over its own history, with its own length — so Orca batches the per-token operations and runs attention per sequence. The split survives in every current engine.

The industry renamed the idea. Hugging Face's Text Generation Inference (TGI) lists "continuous batching of incoming requests" as a feature; vLLM and SGLang use the same term; Anyscale's 2023 blog post — the one that popularized the name — reported up to 23× throughput over naive static batching, a vendor number that bundles the scheduling change with paged memory management. **Continuous batching** is the name that stuck; iteration-level scheduling is the mechanism it names.

## The ceiling it exposes: KV-cache memory

Once slots refill every iteration, throughput is set by how many sequences can be in flight at once — and the first post's growth rule decides that: every in-flight sequence holds its KV cache, one entry per token, per layer, per head. For the OPT-13B model the vLLM paper uses as its running example, that is $2 \times 5120 \times 40 \times 2\,\text{B} = 800\,\text{KB}$ per token — key and value, hidden size, layers, FP16 bytes — so a sequence at OPT's 2,048-token maximum holds 1.6 GB. Batch size is a memory budget, not a compute choice.

How that memory was allocated is what the vLLM paper went after. Serving systems of the Orca generation stored each request's cache as one contiguous tensor, which meant pre-allocating a chunk sized for the request's *maximum possible length* — 2,048 tokens' worth — at admission. The paper names three kinds of waste that follow: slots reserved for tokens the request has not yet generated, internal fragmentation when the reply stops short of the maximum, and external fragmentation left between differently-sized chunks by the allocator. Profiling its own experiments (against re-implementations of Orca — the original is closed source), the paper measured 20.4%–38.2% of KV memory holding actual token states. The batch the scheduler was entitled to run was several times larger than the one the allocator let it fit.

![Figure 2 — Contiguous per-request allocation reserves the maximum length up front: actual tokens, then reservation for tokens not yet generated, internal fragmentation the reply never uses, and external fragmentation between chunks — versus paged allocation below, where blocks appear only as the sequence grows into them.](/assets/blog/scheduling-continuous-batching-paged-attention/kv-fragmentation.svg)

## PagedAttention: virtual memory for the KV cache

The fix is the operating system's, applied wholesale: **PagedAttention** divides each sequence's cache into fixed-size **blocks** — 16 tokens each by default — and gives every request a **block table** mapping its logical blocks to physical blocks scattered anywhere in GPU memory. The paper states the analogy exactly: "one can think of blocks as pages, tokens as bytes, and requests as processes." Physical blocks are allocated on demand, one at a time, as a sequence grows into them.

The waste categories fall out by construction. Nothing is reserved beyond the block being filled, so there is no maximum-length reservation; all blocks are the same size, so external fragmentation cannot exist; internal fragmentation is confined to the unfilled tail of each sequence's last block — at most 15 tokens. That is the 96.3% effective-usage figure, and the throughput consequence is direct: the freed memory becomes batch slots. The authors report 2–4× throughput at the same latency versus FasterTransformer and Orca, "more pronounced with longer sequences, larger models, and more complex decoding algorithms" — exactly the regimes where memory was the binding constraint.

The mechanism has a price, and the paper reports it: the attention kernel must gather KV through the block table instead of walking a contiguous tensor, which costs 20–26% higher attention-kernel latency than FasterTransformer's implementation. The trade is confined to the one operator and bought batch capacity on the memory-bound phase; the field's verdict is that it was worth it — FlashAttention added paged-KV support in v2.5, and paged block pools are the default memory model in vLLM and TensorRT-LLM, with SGLang pooling its cache the same way at token granularity.

Uniform blocks also make the cache *shareable*, which contiguous chunks never were. Two sequences whose token prefixes match can point their block tables at the same physical blocks, with a per-block reference count; a write into a shared block copies just that block first — **copy-on-write**, at block granularity. The paper applies it inside a request: parallel sampling saves 6.1%–9.8% of KV memory and beam search 37.6%–55.2% on its Alpaca workload (beam search reaches 66.3% on ShareGPT). Applied *across* requests, the same machinery is prefix caching: vLLM V1 hashes each full block (the block's tokens plus its parent's hash) and reuses matches, on by default since the V1 engine; SGLang's RadixAttention holds the prefix-to-block mapping in a radix tree with least-recently-used eviction. The hit rate of that cache is one of the first numbers worth checking on any serving dashboard.

![Figure 3 — Two requests, one physical block pool. Each request's logical blocks map through its block table to physical blocks scattered in GPU memory. Request B arrives later opening with the same 32 tokens, whose KV is therefore already in the pool — B's table points at the existing blocks and their prefill is skipped, a prefix-cache hit. B diverges at its third block and gets its own; a write into a still-shared block copies that one block first.](/assets/blog/scheduling-continuous-batching-paged-attention/block-table.svg)

Paging also settles what preemption means. When the pool runs out mid-decode, the scheduler evicts a victim sequence's blocks entirely — either swapped to CPU memory or simply dropped and **recomputed** when the sequence is rescheduled: its generated tokens are appended to its prompt and re-prefilled in one pass, which the first post's prefill/decode asymmetry makes cheap relative to the decode steps that produced them. The paper finds recomputation wins at small block sizes, swapping at large ones, and the two comparable in between; vLLM V1's default is recompute.

## Chunked prefill: stall-free schedules

Continuous batching puts new requests' prefills and ongoing decodes into the same iterations, and the mix has a named failure mode: **generation stalls**. A newly admitted request needs its prefill — one pass over its whole prompt — and an iteration that carries a several-thousand-token prefill takes as long as the prefill does; every ongoing decode in that batch waits. [Sarathi-Serve](https://www.usenix.org/conference/osdi24/presentation/agrawal) (OSDI 2024) named the phenomenon and measured stalls lasting "over several seconds" in the vLLM of early 2024: the time between tokens (TBT) of every streaming reply spikes whenever anyone else's long prompt arrives.

Its fix is two named pieces. **Chunked prefills** — introduced in the authors' 2023 Sarathi preprint — splits a prefill into near-equal chunks that fit alongside decodes; **stall-free schedules** builds each iteration by admitting all pending decodes first, then filling the room left in a fixed per-iteration token budget with prefill chunks. Decodes never wait on a prompt; prefills consume whatever budget decodes leave.

Chunking is legal because attention is causally masked: a prompt token attends to the tokens before it, never after. A chunk's queries therefore need the KV of the chunks already processed — sitting in the cache, which prefill fills anyway — plus the chunk itself, and nothing from the tokens still waiting. Splitting the pass changes *when* each token's KV is computed, not what any token computes; the cost is that each later chunk re-reads the earlier chunks' cached KV.

![Figure 4 — Top: the causal mask is what makes splitting legal. In the attention matrix of a 12-token prompt cut into chunks C1–C3, chunk C2's queries read only C1 (already cached) and C2 itself; the masked upper triangle means no token ever needs a chunk that hasn't run yet. Bottom: the stall-free schedule — every iteration admits all pending decodes first and spends what remains of an illustrative 8-token budget on the next prefill chunk, so ongoing replies keep streaming while the prompt is processed.](/assets/blog/scheduling-continuous-batching-paged-attention/chunked-prefill.svg)

The authors report 2.6× the serving capacity of early-2024 vLLM under a TBT service-level objective (SLO) for Mistral-7B on one A100, and up to 3.7× for Yi-34B on two (capacity under the SLO rather than raw throughput).

Shipped engines absorbed this the way they absorbed paging. vLLM V1 enables chunked prefill by default and its scheduler "removes the traditional distinction between 'prefill' and 'decode' phases by treating user-given prompt tokens and model-generated output tokens uniformly" — a schedule is literally a dictionary of `{request_id: num_tokens}` against the iteration's token budget. Queue *order* stays simple: first-come-first-served by default in both vLLM and SGLang, priority scheduling as an option in both, and SGLang adding cache-aware orderings that sort the waiting queue by longest prefix match against its radix tree. The mechanisms are settled in shipped engines; ordering is where they still differ.

## The frontier: every assumption, revisited

Each of PagedAttention's design choices is now a named research target.

**User-space paging.** [vAttention](https://arxiv.org/abs/2405.04437) (ASPLOS 2025) argues the block table belongs to the memory system, not the kernel: it keeps the KV cache virtually contiguous and lets CUDA's virtual-memory APIs handle physical fragmentation, so unmodified contiguous-layout kernels run unchanged — the authors report up to 1.23× over paged FlashAttention and FlashInfer kernels. The 20–26% gather overhead from 2023 is the cost it targets.

**Uniform blocks.** [Jenga](https://arxiv.org/abs/2503.18292) (SOSP 2025) targets the one-block-size assumption, which breaks on hybrid models — sliding-window layers, state-space layers, and multimodal encoders keep per-layer caches of different shapes and lifetimes. Its two-level allocator sizes pages by the least common multiple of the embedding sizes in play; the authors report up to 79.6% better memory utilization and 1.80× average throughput over baseline vLLM.

**The kernels.** [FlashInfer](https://arxiv.org/abs/2501.01005) (MLSys 2025 best paper) treats KV-cache layout as a block-sparse format problem and generates attention kernels over composable formats — the authors report 29–69% inter-token-latency reduction against compiler backends. It now sits under both vLLM and SGLang.

**One machine for both phases.** The largest revision drops the assumption that prefill and decode share a GPU at all. [DistServe](https://arxiv.org/abs/2401.09670) (OSDI 2024) assigns them to separate GPU pools sized for their opposite bottlenecks — the authors report 7.4× more requests, or 12.6× tighter SLO, within latency targets. [Mooncake](https://www.usenix.org/conference/fast25/presentation/qin) (FAST 2025 best paper) runs the idea in production for Kimi: separate prefill and decode clusters organized around a disaggregated KV-cache store spanning GPU, DRAM, and SSD, with 59%–498% more effective capacity on real traces and 115%/107% more requests on its A800/H800 clusters (self-reported). The mixture-of-experts post's serving section met the same split from the parallelism side — DeepSeek running prefill at expert-parallelism degree 32 (EP32) and decode at EP144. The honest caveat ships in vLLM's own documentation, which still marks disaggregated prefill experimental and states plainly that it "DOES NOT improve throughput" — what it buys is *separate control* of time-to-first-token and inter-token latency, the two numbers one shared batch cannot tune independently.

## Two mechanisms, then policy

An LLM server's inner loop, as of mid-2026: every iteration, re-form the batch — finished sequences out, queued ones in (Orca, 2022) — over a KV cache paged in 16-token blocks so that memory, the actual constraint, is allocated only as sequences grow (vLLM, 2023); admit decodes first and fill the remaining token budget with prefill chunks so no reply stalls behind a long prompt (Sarathi-Serve, 2024); when blocks run out, evict and recompute. The first post claimed the KV cache, not compute, caps concurrency; the scheduler is the component that turns that fact into throughput, and its two load-bearing mechanisms have not changed since 2023 — what changes is the policy on top, and lately, how many machines it spans. More notes as I go.
