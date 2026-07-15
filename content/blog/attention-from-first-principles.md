---
title: "Attention, from First Principles"
summary: "Attention is the one operation that lets a token look back at the whole sequence — and it is also where the KV cache comes from. This post derives scaled dot-product attention from the ground up, then watches the cache, and the memory wall from the last post, fall straight out of the math. The first of two; the next is about making it cheap."
category: "Inference"
status: Published
published: 2026-06-29
tags:
  - attention
  - self-attention
  - kv-cache
  - transformer
related:
  experiments:
    - kv-cache
---

Attention lets every token look back over the sequence and pull in the context it needs — and it's exactly where the KV cache comes from. In this post, we will explore what attention is and how it is constructed.

## What attention replaced

Until 2017, sequences were modeled with **recurrence** — RNNs and LSTMs that walk the tokens one at a time, carrying a hidden state forward like a running summary. Two problems: it can't parallelize (token N waits on token N−1), and the summary blurs (by the end of a long sentence, the beginning has been squeezed through hundreds of updates). *Attention Is All You Need* threw recurrence out entirely — keep only attention, and any token reaches any other directly, in parallel, with no distance penalty. The original was an encoder–decoder translation model; the LLMs I care about are **decoder-only** and **causal** — every token sees the ones before it, never the ones after. That's the version that produces the cache, so it's the one I'll build.

## Query, key, value

Take the sentence I'll use throughout: *"The cat sat because it was tired."* What does `it` refer to? You know instantly — the cat — but the model's embedding for `it` doesn't: an embedding is the token in isolation, and the same token means different things in different sentences. A token's real meaning lives in its **context**, and attention is the mechanism that fetches it — each token looks back over the earlier ones, decides which matter, and pulls in a blend of their information. `it` reaches back, finds `cat`, and becomes a richer vector that means *it, the cat*.

Here's the move that makes that work. From each token's embedding, the model produces **three** vectors, by multiplying it by three learned weight matrices:

- a **query** ($Q = X W_q$) — what this token is looking for;
- a **key** ($K = X W_k$) — what this token offers to others;
- a **value** ($V = X W_v$) — what this token actually hands over if attended to.

The retrieval analogy is exact: a query is a search request, a key is the label on a drawer, a value is what's inside. Attention matches each token's query against every token's key to decide *which drawers to open*, then pulls out a weighted mix of their values. The three roles are separate on purpose — what a token advertises ($K$), what it searches for ($Q$), and what it contributes ($V$) are different — so the model learns three independent sets of weights.

The shapes matter, because they're where the cost will come from. If the sequence has $\text{seq}$ tokens and each embedding has width $d_\text{model}$, then $X$ is $\text{seq} \times d_\text{model}$. Each weight matrix is $d_\text{model} \times d_\text{head}$, so each of $Q$, $K$, $V$ comes out $\text{seq} \times d_\text{head}$ — one row per token (Figure 1). Hold onto $K$ and $V$ in particular: those two are exactly what the KV cache stores.

![Figure 1 — Each token's embedding is projected three ways by learned matrices Wq, Wk, Wv into a query, key, and value. Q, K, and V each have one row per token; K and V are precisely what gets written to the KV cache.](/assets/blog/attention-from-first-principles/qkv-projection.svg)

## Scaled dot-product attention

The whole operation is one line:

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_\text{head}}}\right) V
$$

Score, scale, mask, normalize, blend — five steps, each earning its place. With $Q$, $K$, and $V$ in hand:

**Score every pair.** Take the dot product of each token's query with every token's key: $\text{scores} = Q K^\top$. A dot product is large when two vectors point the same way and near zero when they're unrelated, so it's a natural similarity score: $\text{scores}_{ij}$ is *how much token i's query matches token j's key* — how relevant token j is to token i. The whole point of training $W_q$ and $W_k$ is to learn to aim a token's query in the same direction as the keys of the tokens it ought to care about. With $\text{seq}$ tokens this is a $\text{seq} \times \text{seq}$ grid, one row per querying token, one column per token being looked at.

**Scale it down.** Divide every score by $\sqrt{d_\text{head}}$. This looks like a fudge factor and isn't. A dot product over $d_\text{head}$ dimensions is a sum of $d_\text{head}$ products; the more dimensions, the larger that sum tends to grow, and big raw scores push the next step — `softmax` — into a corner where one token grabs nearly all the weight and the gradients flatten out. Dividing by $\sqrt{d_\text{head}}$ keeps the scores in a sane range so the model can actually learn which tokens matter.

> [!NOTE]
> Why the square root specifically? If a query and key have components that are independent with unit variance, their dot product over $d_\text{head}$ dimensions has variance $d_\text{head}$ — so its standard deviation is $\sqrt{d_\text{head}}$. Dividing by $\sqrt{d_\text{head}}$ rescales the scores back to roughly unit variance before the `softmax`, which is exactly the range where `softmax` stays sensitive. The scale factor isn't a magic number; it's the standard deviation of the thing it's correcting.

**Mask the future.** This is the causal part, and it's load-bearing for everything downstream. Token `it` may attend to `The cat sat because`, but not to `was tired` — those come after it, and at generation time they don't exist yet. So before the next step we set every score where $j > i$ to negative infinity, which the `softmax` will turn into zero weight. The grid becomes lower-triangular: each token sees itself and everything to its left, nothing to its right (Figure 2).

**Normalize into weights.** Run `softmax` across each row. Now every row is a set of non-negative weights that sum to one — a probability distribution over "how much of my attention goes to each earlier token." Why `softmax` and not just divide each row by its sum? The exponential inside it rewards the largest scores disproportionately, so attention can *commit* — pour almost all of its weight onto the one or two tokens that matter — while staying smooth and differentiable, a soft version of "pick the best." Plain normalization would smear the weight too evenly to resolve a sharp reference. In our sentence, the row for `it` puts most of its weight on `cat`; that single bright cell is attention doing its one job.

**Blend the values.** Finally, multiply those weights by $V$: $\text{output} = \mathrm{softmax}(\text{scores} / \sqrt{d_\text{head}})\, V$. Each token's output is a weighted average of the value vectors of the tokens it attended to. `it` walks away carrying mostly `cat`'s value — it has pulled the context it needed. That enriched vector is what attention contributes, and it gets added back into the token's residual stream — the skip-connection from the last post — so the next layer starts from an `it` that already knows it's the cat.

![Figure 2 — The attention-weight grid for "The cat sat because it was tired." Each cell starts as a query-key dot product, then gets scaled, causally masked, and softmaxed so every row sums to 1; the shading is the resulting weight, darker meaning more. The upper triangle is masked to −∞ and gets zero weight. The "it" row concentrates on "cat" — attention resolving the reference.](/assets/blog/attention-from-first-principles/scaled-dot-product.svg)

Everything else in this post is consequences.

## Many heads

One set of $Q$, $K$, $V$ learns one notion of relevance, but tokens relate in several ways at once (`it` wants `cat`; a verb wants its subject). So real transformers run **multi-head attention**: split the projections into $h$ independent $(Q, K, V)$ triples — each $d_\text{head}$ wide, with its own weights — run the same scaled-dot-product in each in parallel, then concatenate the $h$ outputs and pass them through one final matrix, $W_o$ (Figure 3).

That last matrix isn't bookkeeping. Concatenation only stacks the heads side by side — they haven't interacted yet. $W_o$ (shape $d_\text{model} \times d_\text{model}$) is what mixes them: it blends each head's separate finding into one vector and projects it back into the residual stream, so the next layer sees one combined representation, not $h$ disjoint ones.

The heads *share* the width rather than each taking the full $d_\text{model}$, so $d_\text{model} = h \times d_\text{head}$. Llama 2 7B splits $d_\text{model} = 4096$ into $h = 32$ heads of $d_\text{head} = 128$ — the same arithmetic, reshuffled into parallel subspaces. So extra heads are nearly free in *compute*.

The cache is the exception. Every head keeps its own keys and values, so the cache isn't one $K$/$V$ per token — it's $\text{num\_heads}$ copies wide (32 for Llama 2 7B). What's free in arithmetic is paid for in memory; that asymmetry is the hinge between this post and the next.

![Figure 3 — Multi-head attention runs h independent attention computations in parallel subspaces, then concatenates their outputs and mixes them with Wo. Each head keeps its own K and V, so the KV cache is num_heads wide — and the whole block repeats num_layers times down the stack.](/assets/blog/attention-from-first-principles/multi-head.svg)

## Where it sits, and what it costs

For one sequence, the KV cache is a product:

$$
\text{cache} = \text{num\_layers} \times \text{num\_heads} \times 2 \times \text{seq\_len} \times d_\text{head} \times \text{bytes}
$$

Read it as a stack of *for every*: for every **layer**, every **head** stores a key *and* a value (the $2$), each $d_\text{head}$ wide, for every one of the $\text{seq\_len}$ tokens — times the bytes per number. These keys and values are computed once and kept; recompute them each decode step and generation goes quadratic. And since the causal mask only lets a token look left, earlier entries never change — each step appends one new $K$/$V$ and reads the rest. It's the $K$ and $V$ of Figure 1, saved once per head, once per layer.

Take Llama 2 7B — 32 layers, 32 heads, $d_\text{head}$ 128, fp16, a 4,096-token context:

$$
32 \times 32 \times 2 \times 4{,}096 \times 128 \times 2\ \text{bytes} \approx 2\ \text{GB}
$$

That's **2 GB for a single sequence** — not the weights, not the batch, just one conversation's keys and values. It's the number behind "the KV cache caps concurrency": serve a handful at once and the cache, not the math, is what fills the GPU.

<style>
.kvc{position:relative;border:1px solid #e6e6e6;border-radius:6px;padding:18px 20px;margin:1.6rem 0;background:#fff;font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,monospace}
.kvc-h{margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#006b40}
.kvc-sub{margin:0 0 14px;font-size:12px;line-height:1.5;color:#5c6670}
.kvc input{position:absolute;top:0;left:0;width:1px;height:1px;opacity:0}
.kvc-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.kvc-tabs label{cursor:pointer;padding:6px 11px;font-size:12px;font-weight:600;color:#14171a;border:1px solid #cdd8d3;border-radius:4px;user-select:none}
.kvc-tabs label:hover{border-color:#006b40}
.kvc-panel{display:none}
.kvc-cfg{margin:0 0 12px;font-size:12px;color:#5c6670}
.kvc-blk{margin:0 0 10px;padding:10px 13px;border-radius:5px}
.kvc-kv{background:#eef6f1;border-left:3px solid #006b40}
.kvc-wt{background:#fafbfb;border-left:3px solid #d7dedb}
.kvc-bl{margin:0;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#7a847f}
.kvc-kv .kvc-bl{color:#006b40}
.kvc-fx{margin:5px 0 0;font-size:12px;color:#7a847f;line-height:1.5}
.kvc-nx{margin:2px 0 0;font-size:12.5px;font-weight:600;color:#14171a;line-height:1.5}
.kvc-nx .x{color:#006b40}
.kvc-rs{margin:6px 0 0;font-weight:600;color:#14171a}
.kvc-kv .kvc-rs{font-size:26px;color:#006b40}
.kvc-wt .kvc-rs{font-size:15px}
.kvc-tot{border-top:1px solid #cdd8d3;margin-top:4px;padding-top:10px}
.kvc-trow{display:flex;justify-content:space-between;align-items:baseline;padding:2px 0}
.kvc-trow span{font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#5c6670}
.kvc-trow b{font-size:18px;font-weight:600;color:#14171a}
.kvc-mar span{color:#7a847f}
.kvc-mar b{font-size:14px;color:#006b40}
.kvc-note{margin:14px 0 0;font-size:11px;line-height:1.5;color:#7a847f}
#kvc-1:checked~.kvc-tabs label[for="kvc-1"],#kvc-2:checked~.kvc-tabs label[for="kvc-2"],#kvc-3:checked~.kvc-tabs label[for="kvc-3"],#kvc-4:checked~.kvc-tabs label[for="kvc-4"],#kvc-5:checked~.kvc-tabs label[for="kvc-5"],#kvc-6:checked~.kvc-tabs label[for="kvc-6"]{background:#006b40;border-color:#006b40;color:#fff}
#kvc-1:focus-visible~.kvc-tabs label[for="kvc-1"],#kvc-2:focus-visible~.kvc-tabs label[for="kvc-2"],#kvc-3:focus-visible~.kvc-tabs label[for="kvc-3"],#kvc-4:focus-visible~.kvc-tabs label[for="kvc-4"],#kvc-5:focus-visible~.kvc-tabs label[for="kvc-5"],#kvc-6:focus-visible~.kvc-tabs label[for="kvc-6"]{outline:2px solid #006b40;outline-offset:2px}
#kvc-1:checked~.kvc-panels #kvc-p1,#kvc-2:checked~.kvc-panels #kvc-p2,#kvc-3:checked~.kvc-panels #kvc-p3,#kvc-4:checked~.kvc-panels #kvc-p4,#kvc-5:checked~.kvc-panels #kvc-p5,#kvc-6:checked~.kvc-panels #kvc-p6{display:block}
</style>
<div class="kvc">
<p class="kvc-h">KV cache + weights — GPU memory</p>
<p class="kvc-sub">Real models that use full multi-head attention (pre-GQA). Pick one — the KV cache (per sequence) and the weights (loaded once), each computed, and what they total.</p>
<form class="kvc-form">
<input type="radio" name="kvc" id="kvc-1" checked>
<input type="radio" name="kvc" id="kvc-2">
<input type="radio" name="kvc" id="kvc-3">
<input type="radio" name="kvc" id="kvc-4">
<input type="radio" name="kvc" id="kvc-5">
<input type="radio" name="kvc" id="kvc-6">
<div class="kvc-tabs">
<label for="kvc-1">Llama 2 7B · 4K</label>
<label for="kvc-2">Llama 2 13B · 4K</label>
<label for="kvc-3">CodeLlama 13B · 16K</label>
<label for="kvc-4">Llama 1 65B · 2K</label>
<label for="kvc-5">GPT-3 175B · fp16</label>
<label for="kvc-6">GPT-3 175B · fp8</label>
</div>
<div class="kvc-panels">
<div class="kvc-panel" id="kvc-p1"><p class="kvc-cfg">Llama 2 7B · 32 layers · 32 heads · d_head 128 · 4,096 ctx · fp16</p><div class="kvc-blk kvc-kv"><p class="kvc-bl">KV cache · per sequence</p><p class="kvc-fx">layers × heads × 2 × seq × d_head × bytes</p><p class="kvc-nx">32 <span class="x">×</span> 32 <span class="x">×</span> 2 <span class="x">×</span> 4,096 <span class="x">×</span> 128 <span class="x">×</span> 2 B</p><p class="kvc-rs">2.0 GB</p></div><div class="kvc-blk kvc-wt"><p class="kvc-bl">Weights · loaded once</p><p class="kvc-fx">params × bytes</p><p class="kvc-nx">7B <span class="x">×</span> 2 B</p><p class="kvc-rs">14 GB</p></div><div class="kvc-tot"><div class="kvc-trow"><span>total · 1 sequence</span><b>16 GB</b></div><div class="kvc-trow kvc-mar"><span>each added sequence</span><b>+ 2.0 GB</b></div></div></div>
<div class="kvc-panel" id="kvc-p2"><p class="kvc-cfg">Llama 2 13B · 40 layers · 40 heads · d_head 128 · 4,096 ctx · fp16</p><div class="kvc-blk kvc-kv"><p class="kvc-bl">KV cache · per sequence</p><p class="kvc-fx">layers × heads × 2 × seq × d_head × bytes</p><p class="kvc-nx">40 <span class="x">×</span> 40 <span class="x">×</span> 2 <span class="x">×</span> 4,096 <span class="x">×</span> 128 <span class="x">×</span> 2 B</p><p class="kvc-rs">3.1 GB</p></div><div class="kvc-blk kvc-wt"><p class="kvc-bl">Weights · loaded once</p><p class="kvc-fx">params × bytes</p><p class="kvc-nx">13B <span class="x">×</span> 2 B</p><p class="kvc-rs">26 GB</p></div><div class="kvc-tot"><div class="kvc-trow"><span>total · 1 sequence</span><b>29 GB</b></div><div class="kvc-trow kvc-mar"><span>each added sequence</span><b>+ 3.1 GB</b></div></div></div>
<div class="kvc-panel" id="kvc-p3"><p class="kvc-cfg">CodeLlama 13B · 40 layers · 40 heads · d_head 128 · 16,384 ctx · fp16</p><div class="kvc-blk kvc-kv"><p class="kvc-bl">KV cache · per sequence</p><p class="kvc-fx">layers × heads × 2 × seq × d_head × bytes</p><p class="kvc-nx">40 <span class="x">×</span> 40 <span class="x">×</span> 2 <span class="x">×</span> 16,384 <span class="x">×</span> 128 <span class="x">×</span> 2 B</p><p class="kvc-rs">12.5 GB</p></div><div class="kvc-blk kvc-wt"><p class="kvc-bl">Weights · loaded once</p><p class="kvc-fx">params × bytes</p><p class="kvc-nx">13B <span class="x">×</span> 2 B</p><p class="kvc-rs">26 GB</p></div><div class="kvc-tot"><div class="kvc-trow"><span>total · 1 sequence</span><b>38.5 GB</b></div><div class="kvc-trow kvc-mar"><span>each added sequence</span><b>+ 12.5 GB</b></div></div></div>
<div class="kvc-panel" id="kvc-p4"><p class="kvc-cfg">Llama 1 65B · 80 layers · 64 heads · d_head 128 · 2,048 ctx · fp16</p><div class="kvc-blk kvc-kv"><p class="kvc-bl">KV cache · per sequence</p><p class="kvc-fx">layers × heads × 2 × seq × d_head × bytes</p><p class="kvc-nx">80 <span class="x">×</span> 64 <span class="x">×</span> 2 <span class="x">×</span> 2,048 <span class="x">×</span> 128 <span class="x">×</span> 2 B</p><p class="kvc-rs">5.0 GB</p></div><div class="kvc-blk kvc-wt"><p class="kvc-bl">Weights · loaded once</p><p class="kvc-fx">params × bytes</p><p class="kvc-nx">65B <span class="x">×</span> 2 B</p><p class="kvc-rs">130 GB</p></div><div class="kvc-tot"><div class="kvc-trow"><span>total · 1 sequence</span><b>135 GB</b></div><div class="kvc-trow kvc-mar"><span>each added sequence</span><b>+ 5.0 GB</b></div></div></div>
<div class="kvc-panel" id="kvc-p5"><p class="kvc-cfg">GPT-3 175B · 96 layers · 96 heads · d_head 128 · 2,048 ctx · fp16</p><div class="kvc-blk kvc-kv"><p class="kvc-bl">KV cache · per sequence</p><p class="kvc-fx">layers × heads × 2 × seq × d_head × bytes</p><p class="kvc-nx">96 <span class="x">×</span> 96 <span class="x">×</span> 2 <span class="x">×</span> 2,048 <span class="x">×</span> 128 <span class="x">×</span> 2 B</p><p class="kvc-rs">9.0 GB</p></div><div class="kvc-blk kvc-wt"><p class="kvc-bl">Weights · loaded once</p><p class="kvc-fx">params × bytes</p><p class="kvc-nx">175B <span class="x">×</span> 2 B</p><p class="kvc-rs">350 GB</p></div><div class="kvc-tot"><div class="kvc-trow"><span>total · 1 sequence</span><b>359 GB</b></div><div class="kvc-trow kvc-mar"><span>each added sequence</span><b>+ 9.0 GB</b></div></div></div>
<div class="kvc-panel" id="kvc-p6"><p class="kvc-cfg">GPT-3 175B · 96 layers · 96 heads · d_head 128 · 2,048 ctx · fp8</p><div class="kvc-blk kvc-kv"><p class="kvc-bl">KV cache · per sequence</p><p class="kvc-fx">layers × heads × 2 × seq × d_head × bytes</p><p class="kvc-nx">96 <span class="x">×</span> 96 <span class="x">×</span> 2 <span class="x">×</span> 2,048 <span class="x">×</span> 128 <span class="x">×</span> 1 B</p><p class="kvc-rs">4.5 GB</p></div><div class="kvc-blk kvc-wt"><p class="kvc-bl">Weights · loaded once</p><p class="kvc-fx">params × bytes</p><p class="kvc-nx">175B <span class="x">×</span> 1 B</p><p class="kvc-rs">175 GB</p></div><div class="kvc-tot"><div class="kvc-trow"><span>total · 1 sequence</span><b>180 GB</b></div><div class="kvc-trow kvc-mar"><span>each added sequence</span><b>+ 4.5 GB</b></div></div></div>
</div>
</form>
<p class="kvc-note">Weights load once; the KV cache is per sequence, so at high concurrency the KV cache — not the weights — is what fills the GPU. Totals are weights + KV in the listed precision, before activation and framework overhead. All full multi-head; GQA / MQA / MLA shrink the KV cache (next post).</p>
</div>

And it's the same row you watched grow in the last post's KV-cache figure — only now you can see what's *in* each entry. Each entry is a key and a value, born from $X W_k$ and $X W_v$, multiplied out by head and by layer. The memory wall wasn't a property of the serving system. It was sitting in the attention formula the entire time.

## What comes next

That's attention from the bottom up. The $K$ and $V$ it stores for every head, in every layer, *are* the KV cache. Which raises the obvious question: if the cost is a copy of $K$ and $V$ for every head in every layer, can we keep fewer without losing what attention buys us? That's the next post — **MQA**, **GQA**, **MLA**, and **FlashAttention**, which never even writes the $\text{seq} \times \text{seq}$ score grid to memory. Same operation, reshaped to be cheap.
