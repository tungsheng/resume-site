---
title: "Dynamo's KV Router: Routing on What the Fleet Already Cached"
summary: "A fleet's replicas are not interchangeable — each one holds a different slice of KV cache, and routing to the wrong one turns a cache hit into a full prefill. NVIDIA Dynamo's KV router answers that with one number per worker: a cost combining how much of the prompt that worker already has against how loaded it is. These are my notes on the parts that produce those two numbers — block hashes and KV events, the global prefix index, the tiered block manager behind it — and on the cost function that spends them."
category: "Inference"
status: Drafting
published: 2026-08-27
tags:
  - distributed-inference
  - serving
  - routing
  - kv-cache
  - dynamo
---

A stateless load balancer assumes its backends are interchangeable. Inference replicas are not. Each one is holding a different slice of KV cache, and that slice is the difference between a request that starts generating in tens of milliseconds and one that re-reads the whole prompt first. Route a 30k-token conversation to a worker that already has 29k of it cached and you skip almost all of the prefill; route it one worker over and you pay for every token again.

So the router in front of a fleet has a harder job than picking the least-busy backend: it has to know what every worker is holding. NVIDIA Dynamo's KV router does that, and the interesting part is how ordinary the answer looks once you unfold it — a cost function over two numbers, wrapped in a lot of machinery for producing those two numbers cheaply. These are my notes on the machinery.

## The pieces

The router is three parts and a feedback loop: an **indexer** that knows which worker holds which prefix, a **load tracker** that knows what each worker is currently working on, and a **selector** that scores every candidate and picks one. The loop is closed by the workers themselves, which publish an event every time they cache or evict a block.

A request's path through it is short. The frontend tokenizes the prompt and chops it into fixed-size blocks — the same block size the engine uses, because the two have to agree on what a block *is*. It hashes each block and hands the sequence of hashes to the indexer, which returns, per worker, how many leading blocks that worker already has. The load tracker supplies each worker's active prefill and decode load. The selector combines them into one cost per worker and dispatches to the cheapest. Then generation happens, the engine caches and evicts blocks as it goes, and a publisher sitting beside each engine broadcasts those changes back to the indexer.

That publisher is not a detail you can design away. An engine caches blocks beyond the lifetime of the request that created them, and its eviction is its own business — LRU sweeps, memory pressure, preemption. There is no way to infer what a worker still holds from the request/response stream alone, so the worker has to say so out loud.

![Figure 1 — The KV router's anatomy. A request enters the frontend, is tokenized and split into fixed-size blocks, and each block is hashed. The indexer answers "how many leading blocks does each worker already hold?"; the load tracker answers "how much prefill and decode work does each worker already have?". The selector combines both into one cost per worker and dispatches to the lowest. Underneath, a publisher beside every engine emits store and remove events as blocks are cached and evicted, and those events are what keeps the indexer's picture current.](/assets/blog/dynamo-kv-router-and-cache/router-anatomy.svg)

## How a prefix gets a name

Every cached block carries three identifiers, and the split between the first two is the design decision everything downstream inherits.

A **local block hash** is a content hash of the tokens inside one block, and nothing else. It is position-independent: the same tokens anywhere in any sequence hash the same. That is deliberate — it lets the frontend hash a whole prompt's blocks in parallel, with no dependency between them, on the request's critical path.

A **sequence hash** is the rolling hash of the whole prefix up to and including that block: `seq[i] = hash(seq[i-1] || local[i])`. It is position- and history-dependent, so it names one exact prefix.

The cheap hash is the one that is ambiguous. "Predict the next token | Learn from the error | Predict the next token" produces the same local hash at block 0 and block 2, and a worker holding one is not holding the other. Every data-structure choice in the indexer is an answer to that collision.

The third identifier is the **worker ID**, and events carry a fourth field — the **parent hash** — so the index can attach a new block under the right prefix as events arrive. The event vocabulary itself is two verbs: `Store(worker, local_hash, seq_hash)` when a block is cached, `Remove(worker, seq_hash)` when it is evicted. The stream is bursty in both directions: a prefill emits dozens of stores at once, an eviction sweep emits a burst of removes.

The index those events build is a prefix tree over local hashes, where each node also carries its sequence hash and the set of workers holding that block. Two blocks with the same local hash collide only if they hang off the same parent — which means they share the same prefix, which means they really are the same block. The tree turns an ambiguous key into an unambiguous one by construction. A lookup walks the query's block hashes down from the root, intersecting worker sets, and the depth at which each worker drops out is that worker's overlap.

![Figure 2 — Block identity and the prefix index. Top: a prompt is split into fixed-size blocks; each block gets a position-independent local hash, and a rolling sequence hash chains them so every prefix has a unique name. Two identical blocks at different positions share a local hash but not a sequence hash — the collision the index has to resolve. Bottom: the global prefix tree, keyed by local hash with a parent link from KV events, so a collision is only possible under a shared parent. Each node records the workers holding that block; a lookup walks the query down the tree and each worker's drop-out depth is its overlap score.](/assets/blog/dynamo-kv-router-and-cache/block-identity.svg)

## The cost function

Selection is one number per worker, lowest wins:

```text
adjusted_prefill  = max(0, active_prefill_blocks + incoming_prompt_blocks - overlap_credit)
potential_decode  = active_decode_blocks + incoming_active_blocks
cost              = prefill_load_scale * adjusted_prefill + potential_decode
                    + decode_active_request_weight * active_requests
```

Read left to right, it is a statement about what routing here would cost the fleet, in blocks. The prefill term is prompt work — what this worker already owes, plus what the new request adds, minus credit for what it already holds. The decode term is resident KV footprint: the blocks the worker's in-flight requests are sitting on, plus what the new one will occupy. The third term is opt-in (default weight `0`) and charges a flat block-equivalent per active request, for decode regimes where step latency tracks batch size more closely than KV footprint.

`overlap_credit` is where the cache re-enters. It is the worker's matched block count, weighted by which tier the match sits in — device-local matches at `1.0` by default, host-pinned at `0.75`, disk at `0.25` — because a hit you still have to drag back across PCIe is worth less than one already in HBM. Turning the device weight up past `1.0` buys TTFT at the cost of ITL: you are telling the router to chase cache hits even onto busier workers. Turning it to `0` disables cache-aware routing altogether and the router degenerates into pure load balancing, which is a genuinely useful A/B baseline. The adjusted prefill term is clamped at zero, so credit can lower a worker's cost to the floor but never below it, and a decay knob can shave the device-local credit off a cache-rich worker that has piled up too much prefill backlog — the explicit release valve on affinity-versus-balance.

Two things wrap the scoring. Before it, candidates are filtered by hard rules — allow-lists, exact worker pins, data-parallel rank bounds, taints, and a busy threshold that takes overloaded workers out of the running entirely. After it, if `router_temperature` is non-zero, the router softmax-samples over the normalized cost logits instead of taking the argmin, which spreads a hot prefix across several workers rather than piling every request onto the single best one. Default is `0`: deterministic, lowest cost.

There is also a queue in front of dispatch, off by default. Set a queue threshold and the router holds requests in a priority queue while every eligible worker is above a fraction of its batched-token capacity, releasing them as capacity frees. The payoff is subtle but real: a request that waits is dispatched against *fresh* load numbers rather than the stale ones it arrived with. Its ordering policy is a straight tail-versus-mean trade — FCFS by arrival optimizes tail TTFT, while WSPT orders by `(1 + priority) / uncached_tokens`, running short uncached prompts first to optimize the average.

![Figure 3 — Scoring three candidate workers. Each bar decomposes into prompt-side prefill work, minus the overlap credit for blocks the worker already holds (weighted by tier), plus its resident decode footprint. Worker A has the deepest cache hit but a heavy decode load; worker B has a shallower hit and a nearly empty batch and wins on total cost; worker C is filtered out by the busy threshold before scoring. The comparison is the whole affinity-versus-balance trade in one picture.](/assets/blog/dynamo-kv-router-and-cache/cost-function.svg)

## Where the cache actually lives

The overlap credit assumes something is holding those blocks, and in Dynamo that is KVBM, the KV block manager, which treats KV as a four-tier storage system rather than as GPU scratch space:

| Tier | Medium | Latency | Capacity |
| --- | --- | --- | --- |
| G1 | GPU HBM | ~ns | smallest |
| G2 | pinned host DRAM | ~µs | medium |
| G3 | local NVMe | ~ms | large |
| G4 | object store | ~100 ms | effectively unbounded |

The ladder is why the router's tier weights exist at all: a hit is not a hit is a hit, and the credits (`1.0` / `0.75` / `0.25`) are a rough encoding of what it costs to bring each one back.

Blocks move down the ladder through an offload pipeline that is more careful than a background copy. A policy stage filters which blocks are worth demoting; a precondition stage waits for the forward pass that produced them to actually complete; a batcher groups them (flushing at 8 blocks, capping at 64, or after 10 ms) because per-block transfers waste the interconnect; then a transfer executor commits. Everything before commit is cancellable — a block that gets re-used, or a request that dies, pulls its container out of the pipeline before any bytes move. Coming back up, onboarding runs as a session with explicit stages — search, hold, prepare, pull — and the pull is an RDMA read over NIXL, the transfer layer the disaggregated prefill-to-decode handoff also uses.

That is the join between the two halves of this post: the router's credits are an estimate of the block manager's tiering, and the block manager's events are what the router's index is built from. Get the block size or the hash seed out of sync between them and both halves quietly stop working.

![Figure 4 — The tier ladder, and how it feeds routing. G1 GPU HBM through G4 object storage, with latency and capacity moving in opposite directions; blocks demote through the offload pipeline (policy → precondition → batch → transfer, cancellable up to commit) and promote through an onboarding session that pulls over NIXL. On the right, the same tiers map to the router's overlap credit weights — 1.0 device, 0.75 host, 0.25 disk — so a match on a slower tier discounts the prefill cost less.](/assets/blog/dynamo-kv-router-and-cache/kv-tiers.svg)

## Inside the indexer

The index has to absorb every store and remove from every worker while answering a lookup on every request, and both are on a path where slowness shows up as user-visible latency — stale events mean bad routing decisions, slow lookups mean added TTFT. Dynamo's team walked it through six data structures, and the sequence reads as a clean case study in what "just use a hash map" costs at fleet scale.

It started as a nested dictionary — worker → local hash → sequence hashes — which is `O(W × D)` per query for `W` workers and `D` blocks of depth, and conflates colliding chunk hashes on top. Porting it to Rust behind a single-threaded actor removed the interpreter overhead and made concurrency correct, but serialized every read behind every write. Inverting the index to be keyed by block rather than worker took queries to `O(D + W)`: walk the query once, intersect worker sets, and each worker drops out at most once. The radix tree came next, and paid for itself twice — parent links scope collisions to a shared prefix, and a per-worker side table from sequence hash to node gives events `O(1)` access, so the tree is keyed by local hash for traversal and by sequence hash for updates.

The concurrency rewrite is the part I'd steal for something else. Reads take read locks and run inline on the caller's thread — no actor, no channel, no queue. Writes are *sticky-routed*: each worker ID is deterministically pinned to one thread in a pool, so all of a worker's events are serialized by construction and no two threads ever contend on the same subtree. Contention is designed out rather than locked away.

The last step swaps the tree for position-indexed maps — a vector of concurrent maps, `index[position] → {local_hash → entry}` — which makes any position `O(1)` instead of a pointer chase from the root. That random access buys **jump search**: start with the workers matching at position 0, jump ahead by a stride (64 by default), and check the surviving worker count at the checkpoint. If it hasn't dropped, the whole skipped range is confirmed; if it has, scan back over that stride to find exactly where each lost worker dropped out. On long prompts with heavy prefix sharing that skips most of the depth, `O(D/J + W)`; on short or highly divergent sequences the radix tree is still the better structure, which is why both ship.

The reported result — the "Flash Indexer," now Dynamo's default — is about 170M combined ops/s replaying Mooncake production traces on a 24-core desktop, against ~4M for the original radix tree and ~385K for the naive versions (author-reported benchmark, single machine). At that point the authors note the bottleneck has moved to the network, tokenization, and hashing itself, which is the honest way to say a component is done.

## Knobs and sharp edges

A few things I'd want to know before running this rather than reading about it.

**Hash agreement is a hard dependency.** The frontend and the engine must compute the same block hashes, or the index is keyed on names nothing else uses. With vLLM this means setting `PYTHONHASHSEED=0` across every worker process — an unset seed silently produces a router that routes as if the cache were empty. It also explains an architectural wrinkle: because engines may salt their sequence hashes with digests the router cannot reproduce, the router's *predicted* cache state is kept in a separate side index rather than written into the primary tree, so one block never ends up filed under two names.

**Events are optional, and the fallback is a guess.** With KV events disabled, the router predicts cache state from its own routing decisions, aged out by TTL (120 s by default) and pruned when the tree exceeds a size cap. That is a reasonable degraded mode for engines that don't publish events, and it is exactly as accurate as the assumption that the engine kept what the router sent it.

**Router state splits into durable and ephemeral.** Prefix state can be reconstructed by a new router replica from the event stream and periodic snapshots, so a restarted or scaled-out router converges to a correct picture. Active-load state cannot — a fresh replica starts blind to in-flight work and learns it by serving, or by opting into replica sync. Multiple frontends therefore agree about the cache long before they agree about the load.

**Session affinity is off by default and advisory when on.** Enabling it binds a session header to the worker that served its first request, with an idle TTL; bindings are gossiped between router replicas but each replica keeps its own timer, and a dropped or reordered event costs affinity, not correctness. If you need strict stickiness, pin the session to one frontend at the ingress instead of asking the routers to agree.

Put together, the shape is: cheap position-independent hashes on the request path, an index kept honest by worker events, a tiered block manager underneath it, and a cost function that spends cache overlap against load. The parts that look like nothing — a hash seed, a block size, whose responsibility it is to announce an eviction — are the ones that decide whether any of it works.

More notes as I go.
