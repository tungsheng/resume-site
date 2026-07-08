---
title: "MoE: How the Mixture of Experts Routes a Token"
summary: "The router in DeepSeek-V3 is a 7,168 × 256 matrix — 1.8M parameters picking 8 of 256 experts for every token, in a layer of 11.3B. This post covers what the MLP post's one MoE paragraph skipped: how the router works, what the sparsity buys, and the recipe the mid-2026 frontier — DeepSeek-V4, GLM-5.2, Kimi K2.6 — converged on."
category: "Inference"
status: Drafting
published: 2026-07-06
tags:
  - moe
  - mixture-of-experts
  - routing
  - transformer
  - inference
related:
  projects:
    - gpu-inference-lab
---

The router in [DeepSeek-V3](https://arxiv.org/abs/2412.19437) is a 7,168 × 256 matrix — about 1.8M parameters, 0.016% of the 11.3B-parameter mixture-of-experts (MoE) layer it controls. For every token, at every one of 58 MoE layers, that matrix decides which 8 of 256 routed experts run — a ninth, shared expert always does: 396M parameters read, 10.9B untouched. The cheapest component in the model controls the most expensive one. That inversion is the whole bet MoE makes: per-token compute stays fixed while total capacity scales — all the way to V4-Pro's 1.6T parameters on the shelf, 49B per token.

The previous post, on the multilayer perceptron (MLP), ended with the MoE layer in one paragraph — a router scores the token, keeps the top k, sums the winners. These are my notes from opening that paragraph up. The recipe, up front — what runs for every token at every MoE layer, in V3's numbers (the frontier varies the counts, not the steps):

1. **Score** — one matmul: 256 affinities per token.
2. **Select** — keep the top 8 of score + bias.
3. **Gate** — renormalize the winners' raw scores.
4. **Combine** — experts, shared expert, and the token, summed.
5. **Rebalance** (training only) — nudge the bias, outside the optimizer.

Steps 1–4 are **token-choice** routing — each token picks its experts. Step 5 keeps it from collapsing, and getting that step down to one line took the field from 2017 to 2024.

## The recipe in full: one matmul, a sort, and a nudge

$$
h_t \;=\; \underbrace{u_t}_{\text{the token}}
\;+\; \underbrace{\mathrm{FFN}^{(s)}\!\left(u_t\right)}_{\text{shared expert, always on}}
\;+\; \underbrace{\sum_{i \,\in\, \mathrm{TopK}} g_{i,t}\, \mathrm{FFN}_i\!\left(u_t\right)}_{\text{the }k\,=\,8\text{ routed experts, gated}},
\qquad
\underbrace{s_{i,t}}_{\text{score}} \;=\; \sigma\big(\,u_t^{\top}\, \underbrace{e_i}_{\text{column } i \text{ of } W_r}\big)
$$

That is DeepSeek-V3's MoE layer, complete — the one thing the equation compresses is that $\mathrm{TopK}$ ranks *biased* scores, $s_{i,t} + b_i$, and step 2 spells that out.

The fixed parts first. $u_t$ is the token's residual-stream vector, 7,168 wide; $h_t$ is what the layer writes back. Each routed expert $\mathrm{FFN}_i$ is a small SwiGLU (Swish-gated linear unit) with the same structure as the MLP post's, 2,048 wide instead of the 18,432 a dense MLP mirroring V3's width would use; $\mathrm{FFN}^{(s)}$ is the **shared expert**, fed straight from $u_t$, bypassing the router. (FFN — feed-forward network — is the papers' name for the MLP block.)

The small width is the shape decision, and no frontier model has reversed it since 2024. [Mixtral 8x7B](https://arxiv.org/abs/2401.04088) gave its router 8 experts and took 2, for 28 possible combinations per token; [DeepSeekMoE](https://arxiv.org/abs/2401.06066) (Jan 2024) made the case for cutting experts smaller and taking more of them at the same FLOPs. The ladder is steep: the paper's worked example starts at 16 experts, take 2 — 120 combinations; split each expert into four — 64 experts, top-2 becomes top-8 to hold FLOPs constant — and 64-choose-8 gives 4.4 billion; V3's 256-choose-8 is ~4 × 10¹⁴, at the same FLOPs on every rung. A scaling-law study of [expert granularity](https://arxiv.org/abs/2402.07871) landed on the same side: "the common practice of setting the size of experts in MoE to mirror the feed-forward layer is not optimal at almost any computational budget."

### 1 — Score

One matmul turns the token into 256 numbers: $s_{i,t} = \sigma(u_t^{\top} e_i)$, one score per expert. $e_i$ is column $i$ of the 7,168 × 256 router matrix $W_r$ — one 7,168-wide vector per expert, which the paper calls its **centroid** — and the dot product $u_t^{\top} e_i$ measures how well the token matches it. $\sigma$ is the sigmoid, $\sigma(x) = 1/(1 + e^{-x})$: it maps each dot product into $(0, 1)$ **independently**, so expert $i$'s score does not depend on expert $j$'s.

**Why sigmoid, not softmax.** Softmax — the alternative, and [DeepSeek-V2](https://arxiv.org/abs/2405.04434)'s choice — couples all 256 scores into one distribution summing to 1.

### 2 — Select

Add a per-expert bias $b_i$ to each score and keep the 8 highest — 256 candidates become 8 experts, and the bias exists only for this comparison.

$$
g'_{i,t} =
\begin{cases}
s_{i,t}, & s_{i,t} + b_i \in \mathrm{TopK}\!\left(\{\, s_{j,t} + b_j \,\}\right) \\[2pt]
0, & \text{otherwise}
\end{cases}
$$

The comparison that decides *who* gets picked uses $s + b$; the gate that decides *how much* a picked expert contributes still comes from the raw $s$ — the $g'$ above is the pre-normalization gate, which step 3 renormalizes. Selection is all-or-nothing, not a soft weighting: the 248 unpicked experts are not scaled down toward zero — they are skipped, their weights never read. (The serving section prices that skipping.) The bias itself is set by step 5, not by training.

**Why token-choice, not expert choice.** A router with *exact* balance has existed since 2022, and essentially no decoder-only LLM uses it: [expert choice routing](https://arxiv.org/abs/2202.09368) (Zhou et al., NeurIPS 2022) inverts the assignment — **each expert picks its top-$k$ tokens** from the batch — so every expert takes exactly $k$ tokens by construction. The flaw is one sentence in its own limitations section: the top-$k$ runs across the token dimension, so it "takes in the past and future tokens" — a future-information leak at training time, and at decode time the future tokens don't exist yet, so the router is unrunnable as specified. That single property keeps the guaranteed-balance router out of Mixtral, DeepSeek, Qwen, and every other autoregressive frontier model.

### 3 — Gate

$g_{i,t} = s_{i,t} \,/\, \sum_{j \in \mathrm{TopK}} s_{j,t}$ — each kept score divided by their sum, so the 8 gates sum to 1 and an expert that scored twice as high contributes twice as much. The input is the raw $s_{i,t}$, not the biased score. The renormalization is the price of step 1's independence: sigmoid scores do not sum to anything in particular, and one division settles it.

### 4 — Combine

Sum the 8 gated expert outputs, the shared expert's output, and the token itself into $h_t$. The score $s_{i,t}$ has now entered the output twice — step 2 decided *which* experts appear in the sum, step 3 decided *how much* each counts.

The shared expert in that sum is DeepSeekMoE's second move: one FFN kept always on to hold what the paper calls common knowledge, so 256 specialists don't each relearn it. It is a recipe, not a law — OLMoE's ablation measured no gain from sharing, [Qwen3](https://arxiv.org/abs/2505.09388) excluded it, and [Qwen3.5](https://huggingface.co/Qwen/Qwen3.5-397B-A17B) reintroduced one shared expert on top of 512 routed — but the shared-expert column in the frontier table below mostly reads "+ 1".

**Why it matters that the gate is in the sum.** The gate is the router's only gradient path: backpropagation reaches $e_i$ only through the gates of selected experts. Picked experts train; unpicked experts don't — hold that thought for step 5.

![Figure 1 — The router, to scale, in steps 1–4 of the recipe: score, select, gate, combine. The proportions are the point — a 1.8M-parameter matrix making a hard choice over an 11.3B-parameter layer, hard in both directions: an unpicked expert contributes nothing forward and receives no gradient backward.](/assets/blog/moe-routing/router-one-matmul.svg)

### 5 — Rebalance (training only)

DeepSeek-V3 balances 256 experts with a number the optimizer never updates: after each training step, overloaded experts get their bias nudged down by $\gamma$ and underloaded experts up, with $\gamma = 0.001$. No gradient — a feedback loop shifting selection toward underloaded experts, running beside the optimizer. The loop is training-only: at inference, selection runs on the frozen $b_i$.

**Why the step exists.** Left alone, the router self-reinforces: a picked expert gets gradient updates and improves; an improved expert scores higher and gets picked more; the unpicked majority never learns and never recovers. The literature calls the end state **routing collapse** — [OLMoE](https://arxiv.org/abs/2409.02060) reports that without a balancing mechanism, "all tokens in the first layer are assigned to the 6th expert."

**Why a bias, not a loss.** From 2017 to 2024 the standard fix was an **auxiliary loss** — [Switch Transformer](https://arxiv.org/abs/2101.03961)'s is the canonical form — a differentiable penalty that rewards uniform routing, tuned just large enough to balance without overwhelming the cross-entropy objective; the era also capped each expert's intake, so a token whose experts' buffers were all full skipped the layer, passing through the residual connection untransformed ("token dropping"). The deeper cost wasn't the dropped tokens, it was interference: the balancing gradient is not the language-modeling gradient.

![Figure 2 — The dashed loop never crosses the backprop path. The aux-loss era's balancing signal entered the router weights — the same weights the language-modeling loss trains; here the correction lands on b alone, adjusted by a load counter after every step; the nudge is zeroed for the final 500B tokens of training.](/assets/blog/moe-routing/bias-not-a-loss.svg)

The method paper calls it [auxiliary-loss-free load balancing](https://arxiv.org/abs/2408.15664) (Wang et al., 2024) and reports it beats aux-loss training on both balance and perplexity — validated at 3B parameters and 200B tokens before V3 bet 14.8T tokens on it. Net effect: no token dropping, in training or inference.

One footnote to "loss-free": V3 keeps one auxiliary term, a sequence-wise balance loss against extreme imbalance within any single sequence, at $\alpha = 10^{-4}$ — "extremely small." That per-sequence pressure has a measurable cost; the specialization findings below come back to it.

Then everyone took it — sigmoid affinity plus a selection-only bias is the frontier's default router, and the config files in the frontier section below have the receipts.

## What experts learn: syntax, not subjects

Mostly not domains. Mixtral's authors went looking for topic specialization in their own model and reported the null result: "we do not observe obvious patterns in the assignment of experts based on the topic." What does drive assignment is syntax and position: `self` in Python and indentation tokens hit the same experts consistently, and consecutive tokens repeat their first-choice expert at roughly twice the random rate in deeper layers.

The most striking router fact I ran into is **router saturation**: after what the paper calls the 1% checkpoint — 5,000 steps, ~20B of its 5T training tokens — up to ~60% of routing decisions already match the final model. That measurement is OLMoE's — fully open weights, data, and logs, and a model that did show more measurable vocabulary and domain specialization. The experts spend the remaining 99% of training specializing into a nearly frozen partition.

![Figure 3 — Router saturation, redrawn from OLMoE's data. The random-assignment baseline is 12.5%, and the rest of training lifts agreement only from ~60% to ~80%. Layer 0 is the outlier, saturating far more slowly — a router that never settles is the one a fixed hash loses least by replacing, the bet DeepSeek-V4 later made at its earliest layers.](/assets/blog/moe-routing/router-saturation.svg)

The 2026 interpretability round (two preprints: [routing-as-geometry](https://arxiv.org/abs/2604.09780), a domain-invariant ["standing committee"](https://arxiv.org/abs/2601.03425) of experts) points the same way: an "expert" is a shard of MLP capacity the router's geometry favors, not a subject specialist. The actionable finding is Qwen's ["Demons in the Detail"](https://arxiv.org/abs/2501.11873): computing the balance loss per micro-batch forces every sequence to spread across all experts, suppressing domain specialization — the per-sequence pressure step 5's footnote flagged. Moving the loss to the global batch improved perplexity *and* specialization together. That global-batch loss is what Qwen3 ships in the frontier table below.

## The frontier: what mid-2026 ships

Mid-2026 mostly ships one recipe: DeepSeek-V3's. Eleven configs side by side:

| Model | Shipped | Total → active | Experts (routed + shared) | Top-k | Score | Balance |
| --- | --- | --- | --- | --- | --- | --- |
| Mixtral 8x7B | 2023-12 | 47B → 13B | 8 + 0 | 2 | softmax | — |
| DeepSeek-V3 | 2024-12 | 671B → 37B | 256 + 1 | 8 | sigmoid | bias (aux-loss-free) |
| Llama 4 Maverick | 2025-04 | 400B → 17B | 128 + 1 | 1 | — | — |
| Qwen3-235B-A22B | 2025-04 | 235B → 22B | 128 + 0 | 8 | softmax | global-batch aux loss |
| gpt-oss-120b | 2025-08 | 117B → 5.1B | 128 + 0 | 4 | softmax | — |
| Qwen3.5-397B-A17B | 2026-02 | 397B → 17B | 512 + 1 | 10 | — | — |
| Kimi K2.6 | 2026-04 | 1T → 32B | 384 + 1 | 8 | sigmoid | bias |
| DeepSeek-V4-Pro | 2026-04 | 1.6T → 49B | 384 + 1 | 6 | sqrtsoftplus | bias + early hash layers |
| DeepSeek-V4-Flash | 2026-04 | 284B → 13B | 256 + 1 | 6 | sqrtsoftplus | bias + early hash layers |
| GLM-5.2 | 2026-06 | 753B → 40B | 256 + 1 | 8 | sigmoid | bias |
| MiniMax-M3 | 2026-06 | 428B → 23B | 128 + 1 | 4 | sigmoid | bias |

*A "—" means the lab hasn't published that detail.*

Three things I read off this table.

**The convergence.** The V3 recipe, in full: sigmoid scores, selection-only bias, one shared expert, fine-grained experts around width 2,048, and a few dense layers at the bottom of the stack — ordinary always-on MLPs, no router. The adoption is visible in the config files: [GLM-5.2](https://huggingface.co/zai-org/GLM-5.2)'s MoE config is nearly V3's, field for field, shipping `topk_method: "noaux_tc"` — DeepSeek's own field name for the bias mechanism — with sigmoid scoring; [Kimi K2](https://arxiv.org/abs/2507.20534) trained 1T parameters with the same recipe, and K2.6 carries it forward; [MiniMax-M3](https://huggingface.co/MiniMaxAI/MiniMax-M3)'s config enables the router bias with sigmoid scores.

**The departures.** Small but deliberate. [DeepSeek-V4](https://arxiv.org/abs/2606.19348) picks its third score function — the tech report changes "the activation function that computes the affinity scores from Sigmoid(·) into Sqrt(Softplus(·))" (`scoring_func: "sqrtsoftplus"`), after V2's softmax and V3's sigmoid — and replaces the early dense layers with MoE layers routed by a **hash of the token ID**: no learned router at the depths where learned routing seems to have the least to add, consistent with OLMoE's saturation data (V4-Flash's config counts three such layers). One caveat: the report calls itself a preview of the V4 series, so these numbers may move.

Two models sit outside the recipe entirely. Llama 4 Maverick went the other direction — top-1 routing, MoE in only half its layers, and no tech report. gpt-oss-120b is the minimal design — the Switch lineage, shipped by OpenAI in 2025.

**The falling ratios.** Total capacity is scaling much faster than per-token compute — the trade-off MoE is designed to make, taken further every generation. V3 activated 5.5% of itself per token; V4-Pro is 2.4× larger in total (671B → 1.6T) but activates 3.1%; Kimi K2.6 runs at 3.2%, and the top-k went *down* at DeepSeek, 8 to 6.

## Serving: sparsity pays at scale

An MoE has the compute profile of its active parameters and the memory profile of its total. DeepSeek-V3 does 37B parameters of matmul per token, but all 671 GB of FP8 weights must sit in HBM (high-bandwidth memory) before the first request arrives — SGLang's minimum serving config is eight H200-class GPUs.

The router subdivides the MLP post's memory-bound GEMV (general matrix–vector product) problem rather than solving it: with batch $B$ and top-$k$ of $E$ experts, each expert sees about $B \cdot k / E$ tokens — for V3, $B/32$. A batch of 128 hands each expert ~4 tokens, for which it still streams all 44M of its parameters from HBM; one third-party analysis puts the critical batch size where an H100 stops being bandwidth-bound near [300 tokens](https://epoch.ai/gradient-updates/moe-vs-dense-models-inference). That is the shape of the trade: the sparsity that cuts per-token compute raises the batch size at which the cut pays for itself.

At scale, the standard approach is **expert parallelism** (EP): experts are spread across GPUs (DeepSeek's production system ran prefill at EP32 and decode at EP144 — [18 nodes just for decode](https://github.com/deepseek-ai/open-infra-index/blob/main/202502OpenSourceWeek/day_6_one_more_thing_deepseekV3R1_inference_system_overview.md)), and every token is dispatched to its experts' GPUs and back at each layer. Each layer's dispatch-and-combine is a barrier, so one overloaded expert stalls the entire cluster — and imbalance is what happens in practice: the same skew the bias term fights during training, resurfacing at decode time. SGLang measured [2.54× decode throughput](https://www.lmsys.org/blog/2025-05-05-large-scale-ep/) at 96-H100 scale from duplicating overloaded experts alone (author-reported).

At the single-GPU end, gpt-oss-120b applies quantization by the same arithmetic: experts are 90+% of an MoE's parameters, so [MXFP4 on the expert weights alone](https://huggingface.co/openai/gpt-oss-120b) (a 4-bit block-scaled float, ~4.25 bits/weight) fits 117B parameters in one 80 GB GPU. The serving side of this trade is a post of its own.

## The router decides what runs

One matmul and a sort decide which copies of the transformer's biggest block run. Keeping that decision balanced went from seven years of auxiliary losses to a bias nudged by ±0.001 — a recipe now written into the frontier's config files. The router itself learns less than the name suggests — syntax, position, geometry, largely set in the first 1% of training — and the arithmetic doesn't care: every generation widens the gap between what the model holds and what a token touches. The MLP post weighed the block; this one chose which of its copies run. More notes as I go.
