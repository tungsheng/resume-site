---
title: "Distributed Inference: From One GPU to a Fleet"
summary: "The last few posts fit on one machine; this one doesn't. Past a certain load you run out of node, and the fix isn't a bigger GPU — it's a fleet, with a cache-aware router in front and a shared KV store behind. This is the map: the boxes a production inference fleet is made of, the data-plane/control-plane split, the three walls that force the jump, and the one metric — goodput — that judges the whole thing."
category: "Inference"
status: Drafting
published: 2026-07-16
tags:
  - distributed-inference
  - serving
  - prefill-decode
related:
  experiments:
    - prefill-decode
---

The last few posts stayed inside one server. Attention's cost, the multilayer perceptron's weight, which experts run, and then the scheduler that keeps a single GPU's batch full — all of it fits on one machine, one continuous-batching loop, one key/value (KV) cache. This is the first post that doesn't fit.

Past a certain load you run out of machine. Not gradually — you hit a wall, and the fix isn't a bigger GPU, it's more of them. The moment there's more than one replica, two problems appear that a single server never had: something has to decide which replica each request goes to, and the replicas have to share state they used to keep to themselves. That is the whole subject of this series — high-volume, distributed LLM inference — and this first post is just the map: the boxes a production fleet is made of, and the two planes they split across. Later posts open each box.

I came to inference from the systems side, so a fleet of GPUs serving one model reads to me like any other distributed system — just with unusually expensive, unusually stateful workers. These are my notes on its shape.

## From one replica to many

One replica is a single model instance: the weights loaded across some GPUs, a scheduler, and the KV cache for the requests it is serving. The previous post's continuous-batching loop lives entirely here — re-form the batch every iteration, page the KV cache in fixed blocks, keep the GPU busy. It scales until the machine is full, and then it stops.

You can't answer that by renting a bigger GPU; the biggest one is already in the node. You answer it by running N replicas and putting a load balancer in front, the way you'd scale a stateless web service. Except inference replicas aren't stateless, and that fact makes the rest hard. A replica that just processed a long prompt is holding that prompt's KV cache; the next turn of the same conversation wants that cache, and only that replica has it. Round-robin throws it away.

So the load balancer in front has to be cache-aware, and the state behind the replicas has to be shareable — a router and a store that a single server never needed. Almost everything else in this series is a consequence of those two.

![Figure 1 — A single replica holds its weights, scheduler, and KV cache on one node and caps out when that node fills. A fleet runs many replicas behind a cache-aware router, with the KV cache pulled out into a shared store the replicas read and write.](/assets/blog/distributed-inference-the-fleet/one-vs-many.svg)

## Three scaling walls

A single node caps out in one of three ways, and each one is a different post later in this series. They are worth naming up front because they are independent — you can be nowhere near the compute limit and still be wedged against the memory one.

**Memory.** The weights and the KV cache share the same high-bandwidth memory (HBM), and both are large. A 70-billion-parameter model in 16-bit precision is about 140 GB of weights — already past a single 80 GB accelerator. Llama 3.1 405B is roughly 810 GB in fp16; DeepSeek-V3, trained in FP8, is about 671 GB. Those do not fit on one node. And the KV cache grows on top of the weights, with concurrency and context: for a 70B model with grouped-query attention (GQA), one token of context is about 0.32 MB of cache across all layers, so a single 128k-token request is roughly 40 GB — for one user. (These are back-of-envelope sizings from the published configs, not measured footprints; real deployments add activations and framework overhead.) Serve many users at long context and it is the cache, not the weights, that runs you out of memory.

**Compute.** Prefill — reading the prompt — is compute-bound: it processes every prompt token in parallel and saturates the GPU's math units. Decode is the opposite, memory-bandwidth-bound, one token per step. On a single node the two compete for the GPU: a large prefill stalls the decodes sharing the machine, and there is no batching configuration that satisfies both at once. (Sarathi-Serve reports naive hybrid batching inflating time-between-tokens by up to 28×, author-reported.) Sustaining prefill throughput under real load means spreading it across more GPUs than one node holds.

**Network.** The moment a model is sharded across GPUs, they have to talk every forward pass. Tensor parallelism does an all-reduce at each layer; a mixture-of-experts (MoE) model adds an all-to-all to route tokens to experts. Both sit on the critical path — one vendor's measurements put the tensor-parallel all-reduce at up to about 30% of end-to-end latency in specific configurations, and MoE's all-to-all in a similar range. Disaggregating prefill from decode adds one more transfer: the KV cache itself, handed from the machine that built it to the machine that generates from it. Communication is a first-class cost here, not an afterthought.

Three walls, three later posts. The rest of the map is the machinery that lives between them.

## The boxes

Strip four current production stacks down — NVIDIA's Dynamo, Moonshot's Mooncake, the Kubernetes-native llm-d, ByteDance's AIBrix — and the same parts list appears under different names. A fleet is these boxes:

- **The gateway / router.** The front door: it terminates the request and, critically, chooses a replica. In every one of these stacks that choice is cache-aware — Dynamo's "smart router," AIBrix's prefix-cache-aware policies, llm-d's endpoint picker — routing by which replica already holds the relevant KV and how loaded each one is, not by round-robin.
- **The prefill pool.** Workers that read prompts and build KV cache. Compute-heavy.
- **The decode pool.** Workers that generate tokens from that cache. Memory-bandwidth-heavy. In several of these systems prefill and decode are physically separate pools; in others they are the same workers doing both. That choice is the next section.
- **The KV-cache store.** The shared state. Instead of every replica hoarding its own cache, a fleet treats KV as a tiered resource — living in GPU memory, spilling to CPU DRAM, then SSD, then remote storage — that workers read, write, and share. Dynamo's block manager, Mooncake's distributed KVCache pool, and AIBrix's distributed KV runtime are all this box. Moving cache between workers is enough of a concern that these systems ship dedicated transfer libraries for it.
- **The scheduler / conductor.** The brain that decides placement: which pool, which replica, when to admit a request, what to do under overload. Mooncake names it the Conductor; it is the same role llm-d's endpoint picker and AIBrix's control plane play.
- **The autoscaler.** The part that changes the number of replicas to hold latency targets at the lowest cost, driven by inference-aware signals like KV-cache utilization rather than plain CPU load. Dynamo's Planner, llm-d's workload autoscaler, AIBrix's LLM-specific autoscaler.
- **The model registry.** The weights and the plumbing to load hundreds of gigabytes onto a fresh replica — which matters when a traffic spike needs a new replica *now* and the weights take minutes to load.

![Figure 2 — The anatomy of one fleet. The data plane (solid) is the request's path: a cache-aware gateway into the worker pools — a prefill pool that builds the KV cache and a decode pool that generates from it, over a shared, tiered KV store — then tokens stream back. The control plane (dashed) sits off that path, each box wired to the one thing it manages: the scheduler places and admits at the gateway, the autoscaler adds and removes replicas in the pools, and the registry loads weights into new ones.](/assets/blog/distributed-inference-the-fleet/fleet-topology.svg)

## Data plane and control plane

Those boxes sort cleanly into two planes, and the split is worth internalizing because it predicts how a fleet scales and how it fails.

The **data plane** is the request's actual path: router → prefill worker → KV transfer → decode worker → tokens streamed back, plus the KV store the workers read and write. It is on the critical path of every token, and its latency is what the user feels.

The **control plane** is everything that manages that path without being on it: the scheduler deciding placement, the autoscaler resizing pools, the cache index tracking which replica holds which prefix, health checks, and model loading. It runs on a slower clock — seconds and minutes, not milliseconds — and when it is down the data plane usually keeps serving on its last decisions. AIBrix draws this line explicitly; the Kubernetes-native stacks implement the control plane as controllers and custom resources, while Mooncake's Conductor is a bespoke global scheduler. Same division either way.

The reason to hold the two apart: a data-plane failure drops requests in flight, while a control-plane failure usually just freezes the fleet's shape — no new scaling, stale routing — which is survivable for a while. The failure and recovery posts later in this series live almost entirely on this distinction.

## Nothing here is a single box

Figure 2 draws the gateway, scheduler, and registry as one box each. That is a simplification: at fleet scale every one of them is itself replicated, because a control plane with a single point of failure fails the whole fleet the moment it dies. These scale cheaply — on CPU, off the GPU critical path — so they are rarely the dominant cost.

- **The front door** is a pool of router replicas behind an ordinary L4 load balancer. Routing is close to stateless, with one catch: the cache-aware decision has to know which replica holds which prefix, so the routers share that index — gossiped between them, or kept in a small shared store — rather than each one guessing alone.
- **The control plane** runs replicated for availability: leader-elected (one active planner, warm standbys) or sharded by responsibility. The Kubernetes-native stacks get this largely for free as controllers with leader election; a bespoke global scheduler like Mooncake's Conductor has to build the same high availability itself.
- **The registry** is not one file server but a cached, distributed artifact store fronting a fan-out weight-loading path — peer-to-peer or broadcast — because standing up a new replica means moving hundreds of gigabytes *now*, and pulling that serially from one origin is how a traffic spike becomes an outage.

The worker pools are the expensive, GPU-bound part the autoscaler manages. Everything else here scales cheaply — which is why it is easy to forget it scales at all.

![Figure 3 — The control plane and front door, drawn honestly. Each single box from Figure 2 is really a pool: the gateway is router replicas behind an L4 load balancer, sharing one prefix-cache index; the scheduler is leader-elected or sharded controllers; the registry is a distributed, cached store fanning weights out to new replicas. All of it scales on cheap CPU, off the GPU critical path.](/assets/blog/distributed-inference-the-fleet/control-plane-scaling.svg)

## Homogeneous, disaggregated, or hybrid

The one design decision that shapes everything else: do prefill and decode run on the same workers, or different ones?

**Homogeneous** replicas do both. Every worker prefills and decodes, batching the two phases together — the classic vLLM continuous-batching design. It is simple, and it is where most deployments start. Its problem is the compute wall from earlier: the two phases interfere, and one replica's parallelism and memory plan has to compromise for both.

**Disaggregated** serving splits them into separate pools — a prefill fleet and a decode fleet, each with its own hardware, parallelism, and scaling. DistServe and Splitwise made the case that this raises goodput and lowers cost per token by removing the interference (Splitwise reports 1.4× throughput at 20% lower cost in one configuration, author-reported); Mooncake runs it in production serving Kimi, reporting on the order of 75% more requests handled under real workloads. The bill for it is the KV handoff — the cache has to cross the network from prefill to decode — which is why these systems overlap the transfer with computation and lean on fast interconnects.

**Hybrid** is where much of the field actually sits. You can attack the prefill/decode interference without physically separating the pools: Sarathi-Serve's chunked prefill slices a big prefill into the decode stream so neither starves, keeping colocated replicas but bounding the latency. And a real fleet might disaggregate long-context traffic while colocating short requests. The disaggregated pattern has become common enough that most current serving frameworks support it — but "supports" is not "always uses." It is a workload decision, not a default.

This is the axis the next few posts walk along.

## What to measure

A fleet is judged on **goodput**: the request rate it can serve while still meeting its latency targets. The distinction from raw throughput is the whole point — you can inflate tokens-per-second by batching so aggressively that half the requests miss their deadlines, and those tokens are served but useless. DistServe popularized the term for LLM serving precisely to stop that inflation, and it is the number the autoscaler and scheduler are really optimizing.

The latency targets themselves are two, because the two phases feel different to a user:

- **Time to first token (TTFT)** — submission to the first token. Dominated by prefill, so it grows with prompt length. This is responsiveness.
- **Time between tokens (TBT)** — also called inter-token latency or time per output token — the gap between streamed tokens after the first. Dominated by decode. This is smoothness. The names are not used identically everywhere: some measure a per-token interval you can take a p99 of, others an average across the whole reply that hides stalls — a distinction that matters once you optimize tail latency.

Targets are stated at the tail — "99% of requests under X ms TTFT and Y ms TBT" — and **SLO attainment**, the fraction of requests that clear both bars, is what goodput is measured against (SLO: service-level objective). Underneath, the number the business watches is **cost per million tokens**, which is just the fleet's hourly bill divided by the tokens it serves within SLO. Every architectural choice in this series is ultimately an argument about one of these numbers.

## The map, and where the series goes

So the map. Requests arrive at a cache-aware router, which places them on a prefill pool and a decode pool that read and write a tiered, shared KV cache; a control plane of scheduler and autoscaler resizes and steers the whole thing to hold goodput against its SLOs; and a registry keeps weights ready to stand up new replicas. Seven boxes, two planes, three walls, one metric.

The rest of the series opens each box in turn — disaggregation and what the KV handoff costs; routing, and why round-robin is the wrong default; the distributed KV cache as a storage system with its own tiers and eviction; and the parallelism that serving uses, which is not the parallelism training used. Then the three things a map like this quietly assumes away: what happens when traffic spikes faster than the autoscaler can react, what breaks when a GPU dies mid-decode, and how a fleet recovers state that was only ever held in memory.

That is the shape of it. More notes as I go.
