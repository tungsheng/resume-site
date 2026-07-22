---
title: "Distributed Inference: From One GPU to a Fleet"
summary: "Past a certain load you run out of node, and the fix isn't a bigger GPU — it's a fleet, with a cache-aware router in front and a shared KV store behind. The layout: the boxes a production inference fleet is made of, the three planes they sort into — request, storage-and-events, control — the three walls that force the jump, and the one metric — goodput — that judges the whole thing."
category: "Inference"
status: Published
published: 2026-07-16
tags:
  - distributed-inference
  - serving
  - prefill-decode
related:
  experiments:
    - prefill-decode
---

Past a certain load, one machine runs out — and a bigger GPU won't save you, since the biggest is already in the node. The fix is a fleet: many replicas serving one model.

It's a distributed system like any other, just with unusually expensive, unusually stateful workers. These are my notes on its shape.

## From one replica to many

One replica is a single model instance: the weights loaded across some GPUs, a scheduler, and the key/value (KV) cache for the requests it is serving. The continuous-batching loop lives entirely here — re-form the batch every iteration, page the KV cache in fixed blocks, keep the GPU busy. It scales until the machine is full, and then it stops.

Past a full machine, you add replicas behind a load balancer, the way you'd scale a stateless web service. Except inference replicas aren't stateless. A replica that just processed a long prompt is holding that prompt's KV cache; the next turn of the same conversation wants that cache, and only that replica has it. Round-robin throws it away.

So the load balancer in front has to be cache-aware, and the state behind the replicas has to be shareable — a router and a store that a single server never needed. Almost everything that follows is a consequence of those two.

![Figure 1 — A single replica holds its weights, scheduler, and KV cache on one node and caps out when that node fills. A fleet runs many replicas behind a cache-aware router, with the KV cache pulled out into a shared store the replicas read and write.](/assets/blog/distributed-inference-the-fleet/one-vs-many.svg)

## Memory, compute, network

A node hits one of three walls. They are worth naming up front because they are independent — you can be nowhere near the compute limit and still be wedged against the memory one.

**Memory.** The weights and the KV cache share the same high-bandwidth memory (HBM), and both are large. A 70-billion-parameter model in 16-bit precision is about 140 GB of weights — already past a single 80 GB accelerator. Llama 3.1 405B is roughly 810 GB in fp16; DeepSeek-V3, trained in FP8, is about 671 GB. Those do not fit on one node. And the KV cache grows on top of the weights, with concurrency and context: for a 70B model with grouped-query attention (GQA), one token of context is about 0.32 MB of cache across all layers, so a single 128k-token request is roughly 40 GB — for one user. (These are back-of-envelope sizings from the published configs, not measured footprints; real deployments add activations and framework overhead.) Serve many users at long context and the cache, not the weights, runs you out of memory.

**Compute.** Prefill — reading the prompt — is compute-bound: it processes every prompt token in parallel and saturates the GPU's math units. Decode is the opposite, memory-bandwidth-bound, one token per step. On a single node the two compete for the GPU: a large prefill stalls the decodes sharing the machine, and no batching split satisfies both at once. (Sarathi-Serve reports naive hybrid batching inflating time-between-tokens by up to 28×, author-reported.) Sustaining prefill throughput under real load means spreading it across more GPUs than one node holds.

**Network.** The moment a model is sharded across GPUs, they have to talk every forward pass. Tensor parallelism does an all-reduce at each layer; a mixture-of-experts (MoE) model adds an all-to-all to route tokens to experts. Both sit on the critical path — one vendor's measurements put the tensor-parallel all-reduce at up to about 30% of end-to-end latency in specific configurations, and MoE's all-to-all in a similar range. Disaggregating prefill from decode adds one more transfer: the KV cache itself, handed from the machine that built it to the machine that generates from it. Communication is a first-class cost here.

Everything else is the machinery between these walls.

## Anatomy of a fleet

Strip four current production stacks down — NVIDIA's Dynamo, Moonshot's Mooncake, the Kubernetes-native llm-d, ByteDance's AIBrix — and the same parts list appears under different names: seven boxes that sort into three planes.

*The request plane — on every token's path:*

- **The front door — frontend and router.** The frontend terminates and normalizes the request; the router chooses a replica. That choice is cache-aware in every one of these stacks — Dynamo splits it into a Frontend and a KV-aware router, AIBrix has prefix-cache-aware policies, llm-d an endpoint picker — routing by which replica already holds the relevant KV and how loaded each one is, not by round-robin.
- **The prefill pool.** Workers that read prompts and build KV cache. Compute-heavy.
- **The decode pool.** Workers that generate tokens from that cache. Memory-bandwidth-heavy. In several of these systems prefill and decode are physically separate pools; in others they are the same workers doing both. That choice is its own section below.

*The storage & events plane — the KV state, and its movement:*

- **The KV store, its transfer, its events.** The shared state, treated as a tiered resource — GPU memory, spilling to CPU DRAM, then SSD, then remote storage — that workers read, write, and share: Dynamo's KV Block Manager (KVBM), Mooncake's distributed KVCache pool, AIBrix's distributed KV runtime. Moving a block between workers is hot-path enough to earn its own engine — Dynamo ships NIXL, the others ship equivalents — and the store *announces* what it holds, the KV events that tell the router which replica has which prefix. Store, transfer, events: this is the plane the two-plane picture folds away, and the next section pulls it back out.

*The control plane — off the path:*

- **The scheduler / conductor.** The placement decisions: which pool, which replica, when to admit a request, what to do under overload. Mooncake names it the Conductor; it is the same role llm-d's endpoint picker and AIBrix's control plane play.
- **The autoscaler.** The part that changes the number of replicas to hold latency targets at the lowest cost, driven by inference-aware signals like KV-cache utilization rather than plain CPU load. Dynamo's Planner, llm-d's workload autoscaler, AIBrix's LLM-specific autoscaler.
- **The model registry.** The weights and the plumbing to load hundreds of gigabytes onto a fresh replica — which matters when a traffic spike needs a new replica *now* and the weights take minutes to load.

![Figure 2 — One fleet, three planes. The request plane (solid) is every token's path: a frontend and cache-aware router into the worker pools — a prefill pool that builds the KV cache, a decode pool that generates from it — then tokens stream back. The storage & events plane (green) is the KV state and its movement: a shared, tiered store both pools read and write, the transfer that carries cache from prefill to decode, and the events that tell the router which replica holds which prefix. The control plane (dashed) sits off the path, each box wired to the one thing it manages: the scheduler places and admits at the front door, the autoscaler adds and removes replicas in the pools, and the registry loads weights into new ones.](/assets/blog/distributed-inference-the-fleet/fleet-topology.svg)

## The three planes

Those boxes sort into three planes, not the two you might expect — and which plane a box lives in predicts how the fleet scales and how it fails.

The **request plane** is every token's critical path: frontend → router → prefill → KV transfer → decode → tokens streamed back. Its latency is what the user feels. This is the "data plane" by another name, and Dynamo's rename to *request plane* pays off once the next plane appears.

The **storage & events plane** is the KV state and its movement: the tiered store the workers share, the transfer that carries cache from prefill to decode, and the events that announce which replica holds which prefix. It is what a two-plane picture loses, because it sits cleanly on neither side — a cache hit turns a prefill into a lookup, so it is on the critical path, yet the router steers on its events and the autoscaler watches its utilization, so it also answers to the control plane. Pulling it out is Dynamo's structural move, and it pays: once KV is a plane, it stops being a footnote to the data path and becomes a storage system with its own tiers, eviction, and failure modes.

The **control plane** manages the other two without being on their path: the scheduler placing work, the autoscaler resizing pools, health checks, model loading. It runs on a slower clock — seconds and minutes, not milliseconds — and when it is down the request plane keeps serving on its last decisions. AIBrix draws the data/control line explicitly, and the Kubernetes-native stacks realize the control plane as controllers and custom resources while Mooncake's Conductor is a bespoke global scheduler; Dynamo adds the third cut.

Hold the three apart because they fail differently. A request-plane failure drops requests in flight; a control-plane failure only freezes the fleet's shape — no new scaling, stale routing — survivable for a while; a storage-&-events failure is its own case, where a lost cache block is merely recomputable but lost events leave routing blind. How a fleet fails and recovers hinges almost entirely on which plane broke — which is why Dynamo runs a loop for each: a serving loop keeping the request plane fast, a planning loop matching control-plane capacity to demand, and a resilience loop for the failures (health checks, request migration, graceful shutdown, load shedding).

## Every box is really a pool

Figure 2 draws the front door, scheduler, and registry as one box each. That is a simplification: at fleet scale every one of them is replicated, because a control plane with a single point of failure fails the whole fleet the moment it dies. These scale cheaply — on CPU, off the GPU critical path.

- **The front door** is a pool of router replicas behind an ordinary L4 load balancer. Routing is close to stateless, with one catch: the cache-aware decision has to know which replica holds which prefix, so the routers share that prefix index — fed by the storage-and-events plane's KV events, gossiped between routers or kept in a small shared store — rather than each one guessing alone.
- **The control plane** runs replicated for availability: leader-elected (one active planner, warm standbys) or sharded by responsibility. The Kubernetes-native stacks get this largely for free as controllers with leader election; a bespoke global scheduler like Mooncake's Conductor has to build the same high availability itself.
- **The registry** is not one file server but a cached, distributed artifact store fronting a fan-out weight-loading path — peer-to-peer or broadcast — because standing up a new replica means moving hundreds of gigabytes *now*, and pulling that serially from one origin is how a traffic spike becomes an outage.

The worker pools are the expensive, GPU-bound part the autoscaler manages. Everything else here is cheap enough that it is easy to forget it has to scale at all.

![Figure 3 — The control plane and front door at fleet scale. Each single box from Figure 2 is really a pool: the front door is router replicas behind an L4 load balancer, sharing one prefix-cache index; the scheduler is leader-elected or sharded controllers; the registry is a distributed, cached store fanning weights out to new replicas. All of it scales on cheap CPU, off the GPU critical path.](/assets/blog/distributed-inference-the-fleet/control-plane-scaling.svg)

## Homogeneous, disaggregated, or hybrid

Set the control plane aside: the worker pools carry the one design decision that shapes everything else — do prefill and decode run on the same workers, or different ones?

**Homogeneous** replicas do both. Every worker prefills and decodes, batching the two phases together — the classic vLLM continuous-batching design. It is simple, and it is where most deployments start. Its problem is the compute wall from earlier: the two phases interfere, and one replica's parallelism and memory plan has to compromise for both.

**Disaggregated** serving splits them into separate pools — a prefill fleet and a decode fleet, each with its own hardware, parallelism, and scaling. DistServe and Splitwise made the case that this raises goodput and lowers cost per token by removing the interference (Splitwise reports 1.4× throughput at 20% lower cost in one configuration, author-reported); Mooncake runs it in production serving Kimi, reporting on the order of 75% more requests handled under real workloads. The bill for it is the KV handoff — the cache has to cross the network from prefill to decode — which is why these systems overlap the transfer with computation and lean on fast interconnects.

**Hybrid** is where much of the field sits. You can attack the prefill/decode interference without physically separating the pools: Sarathi-Serve's chunked prefill slices a big prefill into the decode stream so neither starves, keeping colocated replicas but bounding the latency. And a real fleet might disaggregate long-context traffic while colocating short requests. The disaggregated pattern has become common enough that most current serving frameworks support it — but "supports" is not "always uses." It is a workload decision, not a default.

## What to measure

A fleet is judged on **goodput**: the request rate it can serve while still meeting its latency targets. The distinction from raw throughput is the whole point — you can inflate tokens-per-second by batching so aggressively that half the requests miss their deadlines, and those tokens are served but useless. DistServe popularized the term for LLM serving precisely to stop that inflation, and it is the number the autoscaler and scheduler are really optimizing.

The latency targets are two, one per phase:

- **Time to first token (TTFT)** — submission to the first token. Dominated by prefill, so it grows with prompt length. This is responsiveness.
- **Time between tokens (TBT)** — also called inter-token latency or time per output token — the gap between streamed tokens after the first. Dominated by decode. This is smoothness, and it is measured inconsistently: a per-token interval you can take a p99 of, or an average that hides stalls.

Targets are stated at the tail — "99% of requests under X ms TTFT and Y ms TBT" — and **SLO attainment**, the fraction of requests that clear both bars, is what goodput is measured against (SLO: service-level objective). Underneath, the number the business watches is **cost per million tokens**, which is just the fleet's hourly bill divided by the tokens it serves within SLO. Every architectural choice is ultimately an argument about one of these numbers.

## The shape, and the open problems

Put it together. Requests arrive at a frontend and cache-aware router, which place them on a prefill pool and a decode pool that read and write a tiered, shared KV store — the storage-and-events plane; a control plane of scheduler and autoscaler resizes and steers the whole thing to hold goodput against its SLOs; and a registry keeps weights ready to stand up new replicas. Seven boxes, three planes, three walls, one metric.

Each box is a problem of its own: disaggregation and what the KV handoff costs; routing, and why round-robin is the wrong default; the distributed KV cache as a storage system with its own tiers and eviction; and the parallelism that serving uses, which is not the parallelism training used. Then the resilience loop's own work — the three things an overview like this quietly assumes away: what happens when traffic spikes faster than the autoscaler can react, what breaks when a GPU dies mid-decode, and how a fleet recovers state that was only ever held in memory.

That is the shape of it. More notes as I go.
