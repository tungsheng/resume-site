---
title: "The MLP, from First Principles"
summary: "In a Llama 2 70B layer the attention projections hold 151M parameters and the MLP next to them holds 704.6M — 82% of the layer, roughly 80% of the model, and most of the bytes decode streams for every token. This post builds the block the attention posts walked past: two matmuls and a gate, why the transformer collapses without it, and what the field is doing to it. It also sets up the next post, because quantization's biggest surface is exactly these weights."
category: "Inference"
status: Drafting
published: 2026-07-03
tags:
  - transformer
  - mlp
  - ffn
  - swiglu
  - activation-functions
related:
  projects:
    - gpu-inference-lab
  experiments:
    - kernel-matmul-tiling
---

Weigh one Llama 2 70B layer: the four attention projections hold 151M parameters; the MLP next to them holds 704.6M — **82% of the layer**, 56.4B of the model's 68.98B, roughly 80% of everything. Two posts on attention were two posts about a fifth of the model.

Decode is memory-bound (the first post's result): generating a token means streaming the weights once, so four-fifths of decode's bytes are MLP bytes. Attention's cost grows with the sequence; the MLP's is flat per token — but it dominates the constant. Before the promised quantization post, the block that owns its biggest surface: what it is, why the transformer needs it, the math, what the activation is for, and what the field is doing to it.

![Figure 1 — One transformer layer in a 70B-class model, weighed. Every layer taps the residual stream twice: attention (Wq, Wk, Wv, Wo — 151M parameters in Llama 2 70B with GQA) reads it and adds its output back, then the MLP (three 8,192 × 28,672 matrices — 704.6M parameters, 82% of the layer) does the same. The identical block repeats 80 times down the stack, one continuous residual stream threading through all of them — and the split holds: the MLP owns 56.4B of the model's 68.98B weights.](/assets/blog/mlp-from-first-principles/block-parameter-split.svg)

## Two matmuls and a gate

The original feed-forward network is one line — Section 3.3 of [*Attention Is All You Need*](https://arxiv.org/abs/1706.03762) (Vaswani et al., 2017). The paper calls it the FFN; code and interpretability work call it the MLP — same block, MLP from here on (the display formulas keep their papers' notation):

$$
\mathrm{FFN}(x) = \max(0,\; xW_1 + b_1)\,W_2 + b_2
$$

"Two linear transformations with a ReLU activation in between." Expand, rectify, contract: $W_1$ lifts the token's vector from the base model's $d_\text{model} = 512$ to $d_\text{ff} = 2{,}048$, the ReLU zeroes the negatives, $W_2$ brings it back down. The 4× expansion comes with no derivation; GPT-3 canonized it anyway. A habit, not a theorem.

The property that matters most: the MLP is applied "to each position separately and identically" — it is **position-wise**. Every token goes through alone, same weights, and no token sees any other; attention is the transformer's *only* cross-token operation. Two inference consequences: no KV cache — nothing about other tokens to remember — and constant cost per token. Just the weights, read again.

Modern LLMs keep the skeleton but change both halves — the ReLU became a **gate** (SwiGLU, three matrices; the math section builds it) and the biases are gone.

## Why attention alone isn't enough

There's a precise theorem for what happens without the MLP. [Dong et al. (ICML 2021)](https://arxiv.org/abs/2103.03404) prove that without skip connections or MLPs, the output of pure stacked self-attention "converges doubly exponentially to a rank-1 matrix" — every token's representation collapses toward the same vector, at a rate with $3^L$ in the exponent. They call it **token uniformity**: the network forgets which token is which.

The intuition is cheaper than the theorem. A softmax row is non-negative and sums to one, so every attention output is a **convex combination** of value vectors — a weighted average, landing inside their convex hull, and averages of averages blur. Attention *moves* information; it doesn't transform it. Honesty note: the paper credits skip connections as the main antidote — the identity path carries an un-averaged copy of every token to the top — while MLPs only *slow* the collapse: a per-token map can re-stretch the differences each averaging step shrinks (its Lipschitz constant scales the rate), but in the paper's bound the contraction still wins. The division of labor stands: skips preserve, attention mixes, only the MLP nonlinearly rebuilds a token's vector.

![Figure 2 — The hull is the whole argument. Without the MLP: one attention step is a softmax-weighted average — weights ≥ 0, summing to 1, so the output stays inside the convex hull of its inputs — and stacking such steps shrinks the hull layer over layer, collapsing to rank-1 "token uniformity" (Dong et al., ICML 2021, doubly exponential 3^L). With the MLP: a per-token nonlinearity moves the vector outside the hull — new features, not an average. Mixing causes the collapse; the MLP isn't a later step, it's the escape the real architecture ships.](/assets/blog/mlp-from-first-principles/mixing-vs-transforming.svg)

The MLP's parameters also appear to be where the model keeps what it knows. [Geva et al. (EMNLP 2021)](https://arxiv.org/abs/2012.14913) read the MLP as a **key–value memory**: the first matrix's directions act as keys matching input patterns (shallow in lower layers, semantic higher up), the second's as values pushing distributions over the output vocabulary. [ROME](https://arxiv.org/abs/2202.05262) (Meng et al., NeurIPS 2022) makes it causal: a rank-one edit to one *mid-layer* MLP matrix rewrites a specific fact in GPT-2 XL — edit one matrix, change one thing the model believes. (A caution against reading too literally: Anthropic's superposition work ([Elhage et al., 2022](https://arxiv.org/abs/2209.10652)) shows MLPs pack more features than they have neurons, so a single neuron rarely *means* one thing.) That's the machinery worth opening up — matrix by matrix.

## The math: keys, gate, values

Here's the block as actually shipped — SwiGLU, from [Shazeer's *GLU Variants Improve Transformer*](https://arxiv.org/abs/2002.05202) (2020), in Llama 2 70B's dimensions:

$$
\mathrm{FFN}_\text{SwiGLU}(x) = \big(\mathrm{SiLU}(x W_\text{gate}) \odot x W_\text{up}\big)\, W_\text{down}
$$

Three matrices, no biases — PaLM dropped them everywhere ("We found this to result in increased training stability for large models") and the field followed. $W_\text{gate}$ and $W_\text{up}$ are each $8{,}192 \times 28{,}672$; $W_\text{down}$ is the transpose shape back. $\mathrm{SiLU}(z) = z \cdot \sigma(z)$, which is why every Llama-family `config.json` says `hidden_act: "silu"`. The forward pass is three moves:

**Keys.** $xW_\text{gate}$ scores the token against $28{,}672$ learned patterns — each column of $W_\text{gate}$ is one of Geva's keys, a direction in the 8,192-dimensional residual space, and the dot product measures how strongly this token exhibits it. One score per hidden neuron.

**Gate.** $\mathrm{SiLU}$ squashes losing matches toward zero and passes winners nearly linearly, turning the scores into a soft open/closed mask. That mask multiplies $xW_\text{up}$ **elementwise** ($\odot$) — a second, linear view of the same token, carrying the content. The nonlinear path decides *how much*, the linear path decides *what*; that data-dependent multiply is the "gated" in gated linear unit.

**Values.** $W_\text{down}$ has $28{,}672$ rows — Geva's values, each a direction in residual space. The output is the activation-weighted sum of those rows, written back into the residual stream. The token leaves the block moved by whichever stored values its keys switched on.

![Figure 3 — SwiGLU dataflow for one Llama 2 70B token: keys, gate, values. The 8,192-wide token vector is projected by W_gate and W_up into two 28,672-wide vectors; SiLU turns the key scores into per-neuron open/closed gates that multiply the up path elementwise; W_down sums its 28,672 value directions weighted by the surviving activations, written back to the residual stream. Three 8,192 × 28,672 matrices — 704.6M parameters per layer — and no KV cache anywhere.](/assets/blog/mlp-from-first-principles/swiglu-dataflow.svg)

> [!NOTE]
> Why is Llama's $d_\text{ff}$ 28,672 and not $4 \times 8{,}192 = 32{,}768$? Parameter matching. The vanilla MLP has two matrices, $2 \times d \times 4d = 8d^2$ parameters. A gated MLP has three, so Shazeer shrank the hidden width "by a factor of 2/3": at $d_\text{ff} = \tfrac{2}{3} \cdot 4d = \tfrac{8}{3}d$ you get $3 \times d \times \tfrac{8}{3}d = 8d^2$ — identical parameters and FLOPs (his runs: 3,072 → 2,048). LLaMA adopted the rule verbatim ("We use a dimension of 2/3 4d instead of 4d as in PaLM"), and later models drifted wide of it: Llama 2/3 70B at 3.5×, Llama 3 405B at 3.25×, Qwen2.5-72B at 3.61×. The 2/3 was never about quality — an accounting convention that became architecture.

Now the bill. Per layer, $3 \times 8{,}192 \times 28{,}672 = 704{,}643{,}072$ parameters; across 80 layers, **56.37B** — 81.7% of the model. A forward pass costs about 2 FLOPs per parameter per token ([Kaplan et al., 2020](https://arxiv.org/abs/2001.08361)): ~1.41 GFLOPs per layer, ~112.7 GFLOPs per token in MLPs alone. At batch-1 decode each matmul is a **GEMV** — every weight read once and used once, about 1 FLOP per byte at fp16, against an H100 ridge near 295. Deeply memory-bound: streaming the 112.7 GB of fp16 MLP weights at 3.35 TB/s costs ~33.6 ms per token before any math. Batch requests or run prefill and the same read serves $S$ tokens — the GEMV becomes a **GEMM**, intensity scales by $S$, and the op flips compute-bound. The first post's asymmetry, pinned to the exact matrices that cause it.

## The activation: why the nonlinearity is load-bearing

Delete the activation and depth evaporates: $(xW_1)W_2 = x(W_1 W_2)$. Two linear maps compose into one, eighty layers of them compose into one, and the network collapses to a single matrix. That one line is the whole argument for a nonlinearity — almost any one restores expressiveness (one hidden layer is universal *iff* the activation is not a polynomial; Leshno et al., 1993). Which nonlinearity matters in practice, and the lineage is short:

- **ReLU** — $\max(0, x)$, the original Transformer's choice. Cheap and naturally sparse, but flat-zero below zero: a neuron pushed there stops learning (the **dying ReLU** problem).
- **GELU** ([Hendrycks & Gimpel, 2016](https://arxiv.org/abs/1606.08415)) — $x \cdot \Phi(x)$, a smoothed ReLU with gradient below zero. GPT adopted it, then BERT ("We use a gelu activation... following OpenAI GPT"). The same paper introduced **SiLU**, $x \cdot \sigma(x)$, which [Swish](https://arxiv.org/abs/1710.05941) (Ramachandran et al., 2017) rediscovered by automated search.
- **SwiGLU** (Shazeer, 2020) — not a better curve but a different mechanism: the data-dependent gate from the last section.

Does the fancy one actually win? Shazeer's parameter-matched T5 runs say yes, modestly: heldout log-perplexity 1.677 for ReLU against 1.636 for SwiGLU and 1.633 for GEGLU — with rankings noisy enough that ReGLU tops the GLUE average. The gain is nearly free (the 2/3 trick) and it replicated: PaLM, LLaMA, Mistral, and Qwen ship SwiGLU; Gemma ships GEGLU. As for *why* gating wins, the paper's closing sentence is the most honest line in the literature: "We offer no explanation as to why these architectures seem to work; we attribute their success, as all else, to divine benevolence." The field's default nonlinearity is empirically won, not derived.

![Figure 4 — The activation lineage. ReLU (original Transformer, 2017) is a hard corner that zeroes all negative inputs — sparse, but with a dead zero-gradient region; GELU (2016, adopted by GPT and BERT) and SiLU/Swish bend the corner smooth so gradients survive below zero; SwiGLU (2020) stops being a curve entirely and becomes a data-dependent gate, SiLU(xW_gate) multiplying xW_up elementwise. Shazeer's parameter-matched scores: ReLU 1.677 heldout log-perplexity, SwiGLU 1.636, GEGLU 1.633.](/assets/blog/mlp-from-first-principles/activation-lineage.svg)

## What the field is doing to it

Everything the field does to this block exploits the two facts already on the table: the MLP holds ~80% of the weights, and it's position-wise — each token passes through independently, so you can route it, skip parts of it, or swap the block out entirely. Three directions, in decreasing order of adoption.

### Replicate it: mixture of experts

An MoE layer swaps the one big MLP for many small ones — **experts** — and runs each token through only a few of them. The machinery is minimal: a **router** (one learned matrix) scores the token against every expert, keeps the top $k$, runs those experts and no others, and sums their outputs weighted by the scores. Attention is untouched.

The trade: total parameters multiply, per-token bytes barely move. [Mixtral 8x7B](https://arxiv.org/abs/2401.04088): eight experts per layer, router picks two — 47B parameters on the shelf, 13B read per token. [DeepSeek-V3](https://arxiv.org/abs/2412.19437) shrinks the experts and multiplies the count: every MLP (past the first three layers) becomes 1 always-on **shared expert** — for what every token needs — plus 256 routed experts, each a small SwiGLU of hidden width 2,048, of which the router picks 8. Result: 671B parameters total, 37B active per token. This works *because* the MLP is position-wise — each token routes independently, and attention, the only place tokens interact, still sees everyone. The 2025 frontier ships this shape by default: Llama 4 Maverick, Qwen3-235B-A22B, gpt-oss-120b.

![Figure 5 — An MoE layer replaces the MLP, and only the MLP. Left: dense — every token streams the full 704.6M-parameter SwiGLU. Right: DeepSeek-V3's shape — the router scores the token against 256 small routed experts, runs the top 8 plus the 1 always-on shared expert, and sums their outputs weighted by the router scores, back into the residual stream. The weights of the 248 unpicked experts are never read. 671B parameters on the shelf, 37B per token — capacity decoupled from per-token bytes.](/assets/blog/mlp-from-first-principles/moe-expert-layer.svg)

### Skip it: activation sparsity

Same goal, no router: for any given token most gate outputs are ≈0, so the weights feeding dead neurons never needed to be read. [Deja Vu](https://arxiv.org/abs/2310.17157) (ICML 2023) measures ~85% contextual sparsity in OPT-175B and predicts the live neurons ahead of the matmul — over 2× faster decode than FasterTransformer, author-reported; [PowerInfer](https://arxiv.org/abs/2312.12456) splits hot and cold neurons across GPU and CPU for local inference. The catch: that sparsity comes from ReLU, which the SwiGLU era traded away. Hence Apple's [*ReLU Strikes Back*](https://arxiv.org/abs/2310.04564) (ICLR 2024) — ReLU-trained models are 90%+ sparse, switching back costs little quality, and "relufication" of existing models recovers much of it (~95% for Falcon, ~65% for Llama) — and [TurboSparse](https://arxiv.org/abs/2406.05955)'s 2–5× decode speedups. Even the curve is moving: **squared ReLU**, surfaced by [Primer](https://arxiv.org/abs/2109.08668)'s architecture search, ships in NVIDIA's Nemotron-H. Single-lab numbers throughout — I'd hold the specifics loosely — but they point one way: stop paying for weights the gate was going to zero anyway.

### Replace it: memory and new neurons

Meta's [Memory Layers at Scale](https://arxiv.org/abs/2412.09764) takes Geva literally and *replaces* some layers' MLP with a trainable key–value lookup — 128B memory parameters, author-reported factual-QA gains over compute-matched dense baselines. [KAN](https://arxiv.org/abs/2404.19756) rebuilds the neuron itself around learnable spline activations; validated on small scientific tasks, used by no frontier LLM.

| Direction | What it changes | Representative work | Honest status |
| --- | --- | --- | --- |
| Replicate it (MoE) | many MLPs, few active per token | Mixtral, DeepSeek-V3, Llama 4, Qwen3 | shipped across the frontier |
| Skip the dead neurons | read only active weights | Deja Vu, PowerInfer, TurboSparse | research + local inference; wants ReLU back |
| Change the nonlinearity | ReLU² for sparsity and speed | Primer, Nemotron-H | shipped (NVIDIA); minority choice |
| Replace it with lookup | MLP → trainable memory | Memory Layers at Scale | research, author-reported |
| Rebuild the neuron | learnable spline activations | KAN | no frontier LLM uses it |

## What comes next

The block is now fully weighed. Attention decides where information moves and owns the cache that grows with the sequence; the MLP owns the weights — 82% of a Llama 2 70B layer, 112.7 of the ~138 GB decode streams for every token. MoE multiplies the block and sparsity tries to skip it, but nobody has dethroned it: two matmuls and a gate, per token, same skeleton as 2017.

Which sets up the next post exactly: quantization attacks three surfaces — weights, KV cache, compute — by storing the same numbers in fewer bits, and the largest surface is precisely the matrices this post just weighed. The next post builds that toolkit from first principles. More notes as I go.
