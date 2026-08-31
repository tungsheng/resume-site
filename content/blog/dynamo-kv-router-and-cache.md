---
title: "Dynamo's KV Router: Routing on What the Fleet Already Cached"
summary: "A fleet's replicas are not interchangeable — each one holds a different slice of KV cache, and routing to the wrong one turns a cache hit into a full prefill. NVIDIA Dynamo's KV router answers that with one number per worker: a cost combining how much of the prompt that worker already has against how loaded it is. These are my notes on the parts that produce those two numbers — block hashes and KV events, the global prefix index, the tiered block manager behind it — and on the cost function that spends them."
category: "Inference"
status: Published
published: 2026-08-31
tags:
  - distributed-inference
  - serving
  - routing
  - kv-cache
  - dynamo
---

A stateless load balancer assumes its backends are interchangeable. Inference replicas are not. Each holds a different slice of KV cache, and that slice decides whether a request starts generating almost at once or re-reads the whole prompt first. Route a 30k-token conversation to a worker that already has 29k of it cached and you skip almost all of the prefill; route it one worker over and you pay for every token again.

So the router in front of a fleet cannot just pick the least-busy backend: it has to know what every worker is holding. NVIDIA Dynamo's KV router does that, and the answer is smaller than the machinery around it — a cost function over two numbers, wrapped in a lot of work to produce them cheaply. These are my notes on the machinery.

## The pieces

The router is three parts and a feedback loop: an **indexer** that knows which worker holds which prefix, a **load tracker** that knows what each worker is working on, and a **selector** that scores every candidate and picks one. The workers close the loop: each publishes an event whenever it caches or evicts a block.

A request's path through it is short. The frontend tokenizes the prompt and chops it into fixed-size blocks, using the same block size as the engine, since both sides have to agree on the boundaries. It hashes each block and hands the sequence of hashes to the indexer, which returns, per worker, how many leading blocks that worker already has. The load tracker supplies each worker's active prefill and decode load, and the selector combines the two into one cost per worker and dispatches to the cheapest. Generation runs, and the publisher beside the chosen worker's engine broadcasts every cache and eviction back to the indexer.

The publisher is not optional. An engine caches blocks beyond the lifetime of the request that created them, and its eviction is its own business: least-recently-used (LRU) sweeps, memory pressure, preemption. You cannot infer what a worker still holds from the request/response stream alone, so the worker has to say so.

![Figure 1 — The KV-aware router. A request enters the frontend, is tokenized, split into fixed-size blocks, and hashed. The indexer holds the prefix index and answers how many of those blocks each worker already has; the load tracker answers how many blocks are in flight on each worker — queued prefill plus running decode. The selector spends one against the other — cost = load − overlap, lowest wins — and dispatches, solid arrow to the worker it chose, dashed to the two it passed over. Underneath, a publisher beside every engine emits store and remove events as blocks are cached and evicted, and that green loop back into the indexer is what keeps its picture current.](/assets/blog/dynamo-kv-router-and-cache/router-anatomy.svg)

## How a prefix gets a name

Every cached block carries three identifiers, and the split between the first two is what the indexer has to work around.

A **local block hash** is a content hash of the tokens inside one block and nothing else, so it is position-independent: the same tokens anywhere in any sequence hash the same. That is deliberate. It lets the frontend hash a whole prompt's blocks in parallel, on the request's critical path.

A **sequence hash** is the rolling hash of the whole prefix up to and including that block: `seq[i] = hash(seq[i-1] || local[i])`. It is position- and history-dependent, so it names one exact prefix.

The cheap hash is the ambiguous one. "Predict the next token | Learn from the error | Predict the next token | And repeat" produces the same local hash at block 0 and block 2, and a worker holding one is not holding the other. The indexer's data structures are all built around that collision.

The third identifier is the **worker ID**, and events carry a fourth field, the **parent hash**, so the index can attach a new block under the right prefix. The event vocabulary is two verbs: `Store(worker, parent_hash, local_hash, seq_hash)` when a block is cached, `Remove(worker, seq_hash)` when it is evicted. The stream is bursty in both directions: a prefill emits dozens of stores at once, an eviction sweep as many removes.

The index those events build is a prefix tree over local hashes, where each node carries the set of workers holding that block and its sequence hash, which is how events address it. Two blocks with the same local hash collide only if they hang off the same parent, which means they share the same prefix, which means they are the same block. A lookup walks the query's block hashes down from the root, intersecting worker sets; the last depth at which a worker is still in the set is its overlap.

![Figure 2 — Block identity and the prefix index. Top: a prompt is split into fixed-size blocks; each block gets a position-independent local hash, and a rolling sequence hash chains them so every prefix has a unique name. Two identical blocks at different positions share a local hash but not a sequence hash — the collision the index has to resolve. Bottom: the global prefix tree, keyed by local hash with a parent link from KV events. The local hash `7f3a` appears twice in it — once under the root and once under `b21c`, both dashed like the colliding blocks above — because a different parent makes a different node. The `5c9d` branch is a different request that diverged after the first block, which is why the third worker falls out at depth 2. Every hash node carries three cells, one per worker, filled when that worker holds the block, so the set visibly empties as the walk goes deeper — three workers, then two, then one, and then the prompt's last hash finds no node at all, which is where the walk stops, leaving each worker's overlap: three blocks for w1, two for w2, one for w3.](/assets/blog/dynamo-kv-router-and-cache/block-identity.svg)

## The cost function

Selection is one number per worker, lowest wins:

```text
adjusted_prefill  = max(0, active_prefill_blocks + incoming_prompt_blocks - overlap_credit)
potential_decode  = active_decode_blocks + incoming_active_blocks
cost              = prefill_load_scale * adjusted_prefill + potential_decode
                    + decode_active_request_weight * active_requests
```

Read left to right, it estimates what routing here would cost the fleet, in blocks. The prefill term is prompt work: what this worker already owes, plus what the new request adds, minus credit for what it already holds. The decode term is resident KV footprint: the blocks the worker's in-flight requests are sitting on, plus what the new one will occupy. The third term is opt-in (default weight `0`) and charges a flat block-equivalent per active request, for decode regimes where step latency tracks batch size more closely than KV footprint.

`overlap_credit` is where the cache re-enters. It is the worker's matched block count, weighted by which tier the match sits in: `1.0` for device-local (G1, the GPU's own memory), `0.75` for host-pinned (G2), `0.25` for disk (G3). A hit you still have to drag back across PCIe is worth less than one already in high-bandwidth memory (HBM).

Turning the device weight up past `1.0` buys time to first token (TTFT) at the cost of inter-token latency (ITL): you are telling the router to chase cache hits onto busier workers. Turning it to `0` degenerates the router into pure load balancing, a useful A/B baseline. The adjusted prefill term is clamped at zero, and a decay knob can shave the device-local credit off a cache-rich worker that has piled up too much prefill backlog.

Two things wrap the scoring. Before it, candidates are filtered by hard rules — allow-lists, exact worker pins, data-parallel rank bounds, taints, and a busy threshold that takes overloaded workers out of the running entirely. After it, if `router_temperature` is non-zero, the router softmax-samples over the normalized cost logits, which spreads a hot prefix across several workers rather than piling every request onto the single best one. The default is `0`: deterministic, lowest cost.

There is also a queue in front of dispatch, off by default. Set a queue threshold and the router holds requests in a priority queue while every eligible worker is above a fraction of its batched-token capacity, releasing them as capacity frees. What it buys: a request that waits is dispatched against *fresh* load numbers rather than the stale ones it arrived with. Its ordering policy is a tail-versus-mean trade — first-come-first-served optimizes tail TTFT, while weighted-shortest-processing-time orders by `(1 + priority) / uncached_tokens`, running short uncached prompts first to optimize the average.

![Figure 3 — Scoring three candidates for one 60-block request. Each bar is the cost in KV blocks: the prompt-side prefill left after the overlap credit, plus the decode blocks already resident on that worker. Worker 1 has the deeper overlap of the two that get scored — 48 of 60 — but a heavy decode footprint, for a cost of 58; worker 2 has only 20 blocks of overlap and a nearly empty batch, and wins at 48. Worker 3 holds the deepest overlap of all three and is never scored at all: it is over its busy threshold, so it is dropped before the cost function runs, and it carries no bar.](/assets/blog/dynamo-kv-router-and-cache/cost-function.svg)

## Where the cache lives

The overlap credit assumes something is holding those blocks, and in Dynamo that is KVBM, the KV block manager, which treats KV as a four-tier storage system rather than as GPU scratch space:

| Tier | Medium | Latency | Capacity |
| --- | --- | --- | --- |
| G1 | GPU HBM | ~ns | smallest |
| G2 | pinned host DRAM | ~µs | medium |
| G3 | local NVMe | ~ms | large |
| G4 | object store | ~100 ms | effectively unbounded |

The ladder is why the router's tier weights exist: the credits are a rough encoding of what it costs to bring a block back from each tier.

Blocks move down the ladder through an offload pipeline that is more careful than a background copy. A policy stage screens which blocks are worth demoting; a precondition stage holds them until the forward pass that produced them completes; a batcher groups them (flushing at 8 blocks, capping at 64, or after 10 ms) because per-block transfers waste the interconnect; then a transfer executor commits. Everything before commit is cancellable: a block that gets re-used, or a request that dies, leaves the pipeline before any bytes move.

Coming back up, a block is located, pinned so it cannot be evicted mid-flight, staged, and then pulled over NIXL, the NVIDIA Inference Xfer Library that also carries the disaggregated prefill-to-decode handoff. That pull is a remote direct memory access (RDMA) read.

That is where the two halves meet: the router's credits are an estimate of the block manager's tiering, and the block manager's events are what the router's index is built from. Get the block size or the hash seed out of sync between them and both halves quietly stop working.

![Figure 4 — The tier ladder, and what a hit on each is worth. G1 GPU HBM through G4 object store, with capacity growing as speed falls; blocks demote through the offload pipeline (screen by policy → wait for the forward pass → batch → transfer → commit, cancellable up to commit) and promote by being pinned and pulled back over NIXL. On the right, each tier carries the credit the router gives one already-cached block found there — GPU HBM ×1.00, host DRAM ×0.75, local NVMe ×0.25 — while object storage earns none until its blocks are onboarded into a faster tier.](/assets/blog/dynamo-kv-router-and-cache/kv-tiers.svg)

## Inside the indexer

Dynamo's team walked the index through six versions, ending at the one they call the Flash Indexer: about 170M combined ops/s replaying Mooncake production traces on a 24-core desktop, against ~4M for the radix tree it replaced and ~385K for the naive versions (author-reported benchmark, single machine). It ships as the default. The path there shows what "just use a hash map" costs at fleet scale, because the index absorbs every store and remove from every worker while answering a lookup on every request: stale events mean bad routing decisions, slow lookups mean added TTFT.

It started as a **nested dictionary** (worker → local hash → sequence hashes), which is `O(W × D)` per query for `W` workers and `D` blocks of depth, and conflates colliding local hashes. Porting it to Rust behind a **single-threaded actor** removed the interpreter overhead and made concurrency correct, but serialized every read behind every write. **Inverting the index** to be keyed by block rather than worker took queries to `O(D + W)`: walk the query once, intersect worker sets, and each worker drops out at most once. Then the **radix tree**, which fixed two things at once: parent links scope collisions to a shared prefix, and a per-worker side table from sequence hash to node gives events `O(1)` access.

The **concurrency rewrite** is the part I'd steal for something else. Reads take read locks and run inline on the caller's thread — no actor, no queue. Writes are *sticky-routed*: each worker ID is deterministically pinned to one thread in a pool, so all of a worker's events are serialized by construction and no two threads ever contend on the same subtree.

The last step swaps the tree for **position-indexed maps** — a vector of concurrent maps, `index[position] → {local_hash → entry}` — which makes any position `O(1)` instead of a pointer chase from the root.

That random access buys **jump search**: start with the workers matching at position 0, jump ahead by a stride (64 by default), and check the surviving worker count there. If it hasn't dropped, the whole skipped range is confirmed; if it has, scan back over that stride to find where each lost worker dropped out. On long prompts with heavy prefix sharing that skips most of the depth, `O(D/J + W)`; on short or highly divergent sequences the radix tree is still the better structure, which is why both ship.

The authors note that the bottleneck has moved off the index entirely, onto the network, tokenization and hashing — which is the honest way to say a component is done.

## Knobs and sharp edges

A few things I'd want to know before running this rather than reading about it.

**Hash agreement is a hard dependency.** The frontend and the engine must compute the same block hashes, or the index is keyed on names nothing else uses. With vLLM this means setting `PYTHONHASHSEED=0` across every worker process — an unset seed silently produces a router that routes as if the cache were empty. It also explains a wrinkle: because engines may salt their sequence hashes with digests the router cannot reproduce, the router's *predicted* cache state is kept in a separate side index rather than written into the primary tree, so one block never ends up filed under two names.

**Events are optional, and the fallback is a guess.** With KV events disabled, the router predicts cache state from its own routing decisions, aged out by TTL (120 s by default) and pruned when the tree exceeds a size cap. That is a reasonable degraded mode, and it is exactly as accurate as the assumption that the engine kept what the router sent it.

**Router state splits into durable and ephemeral.** Prefix state can be reconstructed by a new router replica from the event stream and periodic snapshots, so a restarted or scaled-out router converges to a correct picture. Active-load state cannot — a fresh replica starts blind to in-flight work and learns it by serving, or by opting into replica sync. Multiple frontends therefore agree about the cache long before they agree about the load.

**Session affinity is off by default and advisory when on.** Enabling it binds a session header to the worker that served its first request, with an idle TTL; bindings are gossiped between router replicas but each replica keeps its own timer, and a dropped or reordered event costs affinity, not correctness. If you need strict stickiness, pin the session to one frontend at the ingress instead of asking the routers to agree.

The failure modes worth watching are all in the small agreements between the halves: the hash seed, the block size, and whose job it is to announce an eviction.

More notes as I go.
