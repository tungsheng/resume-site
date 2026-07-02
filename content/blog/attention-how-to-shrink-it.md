---
title: "Attention, and How to Shrink It"
summary: "The KV cache is num_layers × num_heads × 2 × seq_len × d_head × bytes, and every way to shrink attention attacks one of those terms. MQA and GQA share keys across heads, MLA compresses them to a latent that beats full attention on quality, FlashAttention computes the exact same thing with a fraction of the memory traffic, and the frontier goes after the rest — layers, sparsity, and the quadratic itself."
category: "Inference"
status: Published
published: 2026-07-02
tags:
  - attention
  - kv-cache
  - gqa
  - mla
  - flash-attention
related:
  projects:
    - gpu-inference-lab
  experiments:
    - kv-cache
    - kernel-matmul-tiling
    - kernel-softmax-fusion
---

The last post ended on a number: one Llama 2 7B sequence needs about 2 GB of KV cache, and at any real concurrency the cache, not the weights, fills the GPU first. We left the cache written as a product:

$$
\text{cache} = \text{num\_layers} \times \text{num\_heads} \times 2 \times \text{seq\_len} \times d_\text{head} \times \text{bytes}
$$

Most of those factors are nailed down. $\text{num\_layers}$ and $d_\text{head}$ are the model's shape; $\text{seq\_len}$ is the request; $\text{bytes}$ is precision, and quantizing it is a real lever but a separate post. The term the first half of this post attacks is $\text{num\_heads}$ — or more precisely, the number of distinct keys and values you keep per token. Hence the first three techniques: **MQA**, **GQA**, and **MLA** — the first two shrink the cache by **sharing** keys across heads; the third shrinks it by **compressing** them into a latent and decoding per head. The fourth, **FlashAttention**, ignores this formula entirely and goes after a different cost. Two independent levers — shrink *what* you cache, then change *how* you compute it — and I'll take them in that order.

## The keys don't need their own head

Every successor to multi-head attention is built on one observation: a token needs **many query heads** to ask different questions, but the keys and values those queries read **don't have to be unique to each head**.

Recall the shape from last post. Vanilla multi-head attention gives each of the $h$ heads its own $Q$, $K$, and $V$ — $h$ queries, $h$ keys, $h$ values, every one of them a separate projection. The queries are where the expressiveness lives: each head aims its query at a different kind of relationship, one chasing the subject of a verb, another a coreference like `it` → `cat`. But each head also computes and then *caches* its own $K$ and $V$, and that — the $\text{num\_heads}$ factor — is what makes the cache wide. The whole family of optimizations keeps the query heads diverse and shrinks what they read. There are two ways to do that: **share** — keep fewer distinct sets of $K$/$V$ and make the heads split them — or **compress** — keep one small code per token and rebuild every head's keys and values from it. Sharing is cheap to build and costs diversity; compressing keeps the diversity and costs machinery.

## Sharing: MQA and GQA

MQA and GQA are the two production forms of sharing: one $K$/$V$ for all heads, or one per group.

**Multi-Query Attention** (Shazeer, 2019, [*Fast Transformer Decoding: One Write-Head Is All You Need*](https://arxiv.org/abs/1911.02150)) takes the idea to its limit: keep all $h$ query heads, but give them a **single** shared $K$ and $V$. The cache shrinks by $\text{num\_heads}$× — 32 query heads, $1/32$ the keys and values. The win lands exactly where decode hurts: decode is memory-bandwidth bound, so reloading a thirty-second of the bytes each step is most of the speedup. The cost is a small but real quality hit, plus the training instability the later GQA work documented.

**Grouped-Query Attention** ([Ainslie et al., 2023](https://arxiv.org/abs/2305.13245)) is the middle ground, and the one almost everyone landed on. Split the $h$ query heads into $G$ groups; each group shares one $K$/$V$. The cache is $G/\text{num\_heads}$ of full MHA — $G=1$ *is* MQA, $G=h$ *is* MHA. Llama 2 70B runs 64 query heads over **8** KV groups: $1/8$ the cache, and on the GQA paper's own benchmark it nearly matched full MHA quality (47.1 vs 47.2) while beating MQA. You can even convert an existing MHA checkpoint by mean-pooling each group's heads and uptraining on ~5% of the original compute. Mistral 7B, Llama 3, and most of the open-weight field ship GQA.

That's the whole sharing story: a single parameter $G$ running from MHA ($G=h$) down to MQA ($G=1$), with GQA the default stop in between.

![Figure 1 — Share it, or compress it. Query heads stay many and diverse in every scheme; only the cached keys and values shrink. MHA caches one K/V per query head, GQA shares them across groups, MQA shares a single K/V across all heads, and MLA compresses instead of sharing — one latent it reconstructs per head, smaller than GQA, slightly larger than MQA, at quality that matches or beats MHA.](/assets/blog/attention-how-to-shrink-it/share-or-compress.svg)

## Compressing: MLA

MLA stops sharing and starts compressing: instead of keeping fewer distinct sets of keys and values, it keeps none — a single compressed **latent** vector per token goes in the cache, and every head's keys and values are rebuilt from it on the fly. DeepSeek built it for [DeepSeek-V2](https://arxiv.org/abs/2405.04434) and kept it for V3: a 60-layer, 128-head model whose per-token KV cache is **more than an order of magnitude smaller** than an equivalent multi-head model's, at quality DeepSeek reports as *better* than full MHA.

The mechanism is a low-rank bottleneck. Each token's hidden state $h_t$ is down-projected to a small latent $c^{KV}_t$ of dimension $d_c$ — in DeepSeek-V2, $d_c = 512$ against a full $\text{num\_heads} \times d_\text{head} = 128 \times 128 = 16{,}384$. At attention time, two learned up-projection matrices expand $c^{KV}_t$ back into per-head keys and values. The trick that makes this nearly free is *absorption*: because those up-projections are fixed weights, they fold into the query and output matrices ($W_q$, $W_o$) algebraically, so the full $K$ and $V$ are never materialized to be stored. **Only $c^{KV}_t$ goes in the cache** — one short vector per token instead of $\text{num\_heads}$ keys and $\text{num\_heads}$ values.

> [!NOTE]
> Absorption breaks under RoPE, and the fix is the cleverest part of MLA. RoPE rotates each key by an amount that depends on its *position*, and that rotation sits between the cached latent and the query — so the up-projection can no longer be folded into a position-independent product, and you'd be forced to cache full per-position keys again, losing the whole win. MLA **decouples** the position signal: alongside the latent it carries one small extra key $k^R_t$ of dimension $d_h^R = 64$ that alone carries RoPE, while the latent path stays rotation-free. So the cache holds two things per token — the latent $c^{KV}_t$ and the decoupled key $k^R_t$ — and the heavy reconstruction stays absorbable.

That makes the per-token cache $(d_c + d_h^R) = (512 + 64) = 576$ numbers per layer, versus $2 \times \text{num\_heads} \times d_\text{head} = 32{,}768$ for full MHA — about a **57× smaller** per-layer footprint, or roughly what GQA would cost at *2.25 groups*. DeepSeek reports the V2 design cuts the KV cache **93.3%** against their dense 67B baseline while raising max generation throughput **5.76×** — and, unlike any amount of sharing, does it while *improving* benchmark quality rather than conceding some. The catch is engineering complexity: a handful of extra projections, the decoupled-RoPE path, and a kernel that knows how to do the absorption. It's not a config flag you flip on an existing model — which is exactly the problem the next wave of work set out to solve.

![Figure 2 — Multi-head latent attention. The token's hidden state is down-projected to a small latent c_KV and, on a separate path, to one shared decoupled-RoPE key k_R. Those two vectors are the entire KV cache — 576 numbers per token per layer for DeepSeek-V2, versus 32,768 for full MHA. The keys and values are rebuilt per head by up-projections that absorb into W_q and W_o, so they are never written to the cache.](/assets/blog/attention-how-to-shrink-it/mla-latent.svg)

<style>
.shr{border:1px solid #e6e6e6;border-radius:6px;padding:18px 20px;margin:1.6rem 0;background:#fff;font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,monospace}
.shr-h{margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#006b40}
.shr-sub{margin:0 0 14px;font-size:12px;line-height:1.5;color:#5c6670}
.shr input{position:absolute;width:1px;height:1px;opacity:0;clip:rect(0 0 0 0)}
.shr-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.shr-tabs label{cursor:pointer;padding:6px 12px;font-size:12px;font-weight:600;color:#14171a;border:1px solid #cdd8d3;border-radius:4px;user-select:none}
.shr-tabs label:hover{border-color:#006b40}
.shr-panel{display:none}
.shr-cfg{margin:0 0 14px;font-size:12px;line-height:1.5;color:#5c6670}
.shr-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px}
.shr-blk{flex:1 1 150px;padding:11px 13px;border-radius:5px;background:#fafbfb;border-left:3px solid #d7dedb}
.shr-seq{background:#eef6f1;border-left:3px solid #006b40}
.shr-bl{margin:0;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#7a847f}
.shr-seq .shr-bl{color:#006b40}
.shr-fx{margin:5px 0 0;font-size:11px;color:#7a847f;line-height:1.5}
.shr-rs{margin:4px 0 0;font-weight:600;color:#14171a;font-size:15px}
.shr-seq .shr-rs{font-size:26px;color:#006b40}
.shr-vs{margin:4px 0 0;font-size:11px;font-weight:600;color:#7a847f}
.shr-q{display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid #cdd8d3;margin-top:4px;padding-top:10px}
.shr-q span{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#5c6670}
.shr-q b{font-size:13px;font-weight:600;color:#14171a}
.shr-q b.g{color:#006b40}
.shr-note{margin:14px 0 0;font-size:11px;line-height:1.5;color:#7a847f}
#shr-1:checked~.shr-tabs label[for="shr-1"],#shr-2:checked~.shr-tabs label[for="shr-2"],#shr-3:checked~.shr-tabs label[for="shr-3"],#shr-4:checked~.shr-tabs label[for="shr-4"]{background:#006b40;border-color:#006b40;color:#fff}
#shr-1:focus-visible~.shr-tabs label[for="shr-1"],#shr-2:focus-visible~.shr-tabs label[for="shr-2"],#shr-3:focus-visible~.shr-tabs label[for="shr-3"],#shr-4:focus-visible~.shr-tabs label[for="shr-4"]{outline:2px solid #006b40;outline-offset:2px}
#shr-1:checked~.shr-panels #shr-p1,#shr-2:checked~.shr-panels #shr-p2,#shr-3:checked~.shr-panels #shr-p3,#shr-4:checked~.shr-panels #shr-p4{display:block}
</style>
<div class="shr">
<p class="shr-h">KV cache by attention scheme</p>
<p class="shr-sub">One 70B-class model — 80 layers, 64 query heads, d_head 128, fp16, a 4,096-token sequence — under each scheme. Click through and watch the cache move.</p>
<form>
<input type="radio" name="shr" id="shr-1" checked>
<input type="radio" name="shr" id="shr-2">
<input type="radio" name="shr" id="shr-3">
<input type="radio" name="shr" id="shr-4">
<div class="shr-tabs">
<label for="shr-1">MHA</label>
<label for="shr-2">GQA · 8 groups</label>
<label for="shr-3">MQA</label>
<label for="shr-4">MLA</label>
</div>
<div class="shr-panels">
<div class="shr-panel" id="shr-p1"><p class="shr-cfg">Full multi-head — 64 KV heads, each query head caches its own K and V.</p><div class="shr-row"><div class="shr-blk"><p class="shr-bl">per token</p><p class="shr-fx">80 × 64 × 2 × 128 × 2 B</p><p class="shr-rs">2.6 MB</p></div><div class="shr-blk shr-seq"><p class="shr-bl">per sequence · 4,096 tok</p><p class="shr-fx">× 4,096 tokens</p><p class="shr-rs">10.7 GB</p><p class="shr-vs">baseline</p></div></div><div class="shr-q"><span>quality</span><b>baseline</b></div></div>
<div class="shr-panel" id="shr-p2"><p class="shr-cfg">Grouped-query — 64 query heads share 8 KV groups (1/8 the K/V).</p><div class="shr-row"><div class="shr-blk"><p class="shr-bl">per token</p><p class="shr-fx">80 × 8 × 2 × 128 × 2 B</p><p class="shr-rs">328 KB</p></div><div class="shr-blk shr-seq"><p class="shr-bl">per sequence · 4,096 tok</p><p class="shr-fx">× 4,096 tokens</p><p class="shr-rs">1.34 GB</p><p class="shr-vs">8× smaller than MHA</p></div></div><div class="shr-q"><span>quality</span><b>≈ MHA</b></div></div>
<div class="shr-panel" id="shr-p3"><p class="shr-cfg">Multi-query — all 64 query heads share a single K and V.</p><div class="shr-row"><div class="shr-blk"><p class="shr-bl">per token</p><p class="shr-fx">80 × 1 × 2 × 128 × 2 B</p><p class="shr-rs">41 KB</p></div><div class="shr-blk shr-seq"><p class="shr-bl">per sequence · 4,096 tok</p><p class="shr-fx">× 4,096 tokens</p><p class="shr-rs">168 MB</p><p class="shr-vs">64× smaller than MHA</p></div></div><div class="shr-q"><span>quality</span><b>measurable cost</b></div></div>
<div class="shr-panel" id="shr-p4"><p class="shr-cfg">Latent — cache one compressed latent (d_c 512) + a shared RoPE key (d_h_R 64); rebuild K/V per head. MLA dims from DeepSeek-V2, applied illustratively.</p><div class="shr-row"><div class="shr-blk"><p class="shr-bl">per token</p><p class="shr-fx">80 × (512 + 64) × 2 B</p><p class="shr-rs">92 KB</p></div><div class="shr-blk shr-seq"><p class="shr-bl">per sequence · 4,096 tok</p><p class="shr-fx">× 4,096 tokens</p><p class="shr-rs">377 MB</p><p class="shr-vs">28× smaller than MHA</p></div></div><div class="shr-q"><span>quality</span><b class="g">≥ MHA</b></div></div>
</div>
</form>
<p class="shr-note">Notice MLA lands <em>above</em> MQA on cache (377 MB vs 168 MB) yet keeps the best quality — cache size isn't the only axis. MQA is smallest but pays for it; MLA spends a little more to beat full attention. Numbers are illustrative sizing estimates, not benchmarks.</p>
</div>

## Converting: MLA for models that weren't born with it

MLA's complexity used to mean you only got it if you trained for it — DeepSeek and almost no one else. The interesting 2025 development is that MLA has become a **conversion target**: take a model trained with GQA, and turn it into an MLA model after the fact.

The clean theoretical result comes from [TransMLA](https://arxiv.org/abs/2502.07864) (a NeurIPS 2025 spotlight): for the *same* KV-cache budget, MLA strictly contains GQA. GQA forces every query head in a group to read the identical replicated key and value; MLA spends the same bytes on a shared latent but lets each head learn its *own* up-projection from it — same cache, strictly larger function class. Sharing is the degenerate case of compressing. So any GQA checkpoint can be re-parameterized as an MLA model and then compressed, recovering the original quality with a short fine-tune (the paper reports ~6B tokens to claw back a 93%-compressed Llama-2-7B).

It's no longer one paper. [MHA2MLA](https://arxiv.org/abs/2502.14837) reaches MLA from plain MHA checkpoints on a fraction of a percent of the original pretraining data; [X-EcoMLA](https://arxiv.org/abs/2503.11132) (from AMD) initializes the MLA weights by SVD-decomposing the existing attention and distills them back to parity — a 6.4× cache cut on Llama-3.2-1B for about 70 GPU-hours, against the hundreds of thousands it took to pretrain the model. The recipe has even jumped modalities: [MHA2MLA-VLM](https://arxiv.org/abs/2601.11464) (AAAI 2026) converts a vision-language model, cutting ~95% of the KV cache on Qwen2.5-VL-7B at no average-score loss. Every one of these is a single-lab result with author-reported numbers, so I'd hold the specifics loosely — but the direction is unmistakable: MLA is becoming the format existing models migrate *to*, across vendors and even modalities, not just a DeepSeek house style.

## The other lever: FlashAttention

Everything so far shrank *what* you cache. [FlashAttention](https://arxiv.org/abs/2205.14135) (Dao et al., 2022) is the other lever from the intro: it changes *how* you compute attention and touches the cache not at all. It produces the **exact** same output — not an approximation — while cutting the attention op's memory from $O(\text{seq}^2)$ to $O(\text{seq})$.

The trick is to respect the memory hierarchy. A GPU has a large, slow pool (HBM, ~2 TB/s on an A100) and a tiny, fast one (on-chip SRAM, ~19 TB/s). Standard attention writes the full $\text{seq} \times \text{seq}$ score grid out to HBM and reads it back — and at long sequence length that round-trip, not the matmul, is the bottleneck. FlashAttention tiles $Q$, $K$, and $V$ into blocks that fit in SRAM and uses an **online softmax** — a running max and sum — to accumulate each tile's contribution without ever materializing the whole grid. The big intermediate never leaves the chip. The reported kernel speedups run ~2–4×; the lineage continued with FlashAttention-2 (better work partitioning, ~73% of A100 peak) and [FlashAttention-3](https://arxiv.org/abs/2407.08608) (Hopper-specific async and FP8, ~75% of H100 peak).

Two scope notes worth stating plainly. The win lands where the grid exists — prefill and training; at decode each new token scores a single row against the cache, and the bottleneck is streaming the cache itself, which is the first half of this post. And the memory FlashAttention saves is *activation* memory — a different pool from the KV cache. Run it on top of any model and the cache formula from the top of this post is unchanged. It's the perfect complement to the cache tricks, not a substitute.

![Figure 3 — IO-awareness. The N × N score grid doesn't fit in fast on-chip SRAM, so standard attention writes it out to slow HBM and reads it back — the score matrix S = QKᵀ and its softmax P each cross the bus twice, O(N²) bytes, and that round-trip, not the matmul, is the bottleneck. FlashAttention computes the grid tile by tile inside SRAM with a running online softmax, so it never touches HBM: Q, K, and V are read once, only the small output O is written back — O(N) traffic, exact same result.](/assets/blog/attention-how-to-shrink-it/io-awareness.svg)

## The frontier: new axes

Sharing and compressing moved one factor — $\text{num\_heads}$. The work since MLA is mostly about finding *other* axes to push, and it's where most of the 2024–2026 research energy has gone. Three directions are worth knowing, in rough order of how far they depart from vanilla attention.

**Share the cache down the stack.** The head tricks leave $\text{num\_layers}$ untouched, and that's a whole axis. [Cross-Layer Attention](https://arxiv.org/abs/2405.12981) (CLA, MIT, 2024) computes $K$/$V$ in only some layers and lets neighbors reuse them, buying ~2× *on top of* MQA at near-equal quality. [YOCO](https://arxiv.org/abs/2405.05254) (Microsoft, 2024) goes further with a decoder-decoder split that stores a single global cache, making cache memory roughly independent of depth — author-reported ~9.4× total-memory savings and dramatic prefill speedups at million-token context. Both stack cleanly with everything in the first half.

**Attend to less, and learn what to skip.** Sparse attention is old; the 2025 shift is making it *trainable from scratch* instead of bolted onto a frozen model. DeepSeek's [Native Sparse Attention](https://arxiv.org/abs/2502.11089) (NSA, ACL 2025 best paper) runs three gated branches per query — coarse compressed blocks, a few full-resolution selected blocks, and a local sliding window — designed so gradients flow through the selection and the kernels stay GPU-friendly. It reports ~9× faster forward and ~11.6× faster decode at 64K context while matching full attention on quality. Moonshot's [MoBA](https://arxiv.org/abs/2502.13189) reaches a similar place from the MoE direction, routing each query to a top-$k$ of key blocks, and is reportedly already serving Kimi's long-context traffic.

**Drop the quadratic entirely.** The most radical axis replaces softmax attention with a linear-time recurrence that keeps a *fixed-size* state instead of a cache that grows with every token. That trades away exact recall — a fixed state can't losslessly hold unbounded history — which is why production systems hybridize. [MiniMax-01](https://arxiv.org/abs/2501.08313) interleaves mostly linear (Lightning Attention) layers with a periodic full-softmax layer across a 456B model to reach multi-million-token context; [Jamba](https://arxiv.org/abs/2403.19887) mixes Mamba (state-space) layers with a few attention layers at a 7:1 ratio for an 8× smaller cache at 256K. The recurring shape is the same: a cheap linear majority, with just enough full attention sprinkled back in to recover the recall the linear layers lose.

| Axis | What it cuts | Representative work | Honest status |
| --- | --- | --- | --- |
| Share heads | `num_heads` | MQA, GQA | shipped everywhere |
| Compress to a latent | `num_heads` → latent | MLA; TransMLA / MHA2MLA to convert | shipped (DeepSeek); conversion is new |
| Share across layers | `num_layers` | CLA, YOCO | research, author-reported |
| Trainable sparsity | tokens attended | NSA, MoBA | NSA peer-reviewed; both single-lab |
| Linear / hybrid | the cache itself | MiniMax-01, Jamba | shipped at scale; recall tax |
| IO-aware kernel | memory traffic, not cache | FlashAttention 1/2/3 | universal, exact |

## What comes next

Two levers on one formula: sharing and compressing shrink *what* you cache — MQA, GQA, MLA — and FlashAttention changes *how* you compute it, exactly. The frontier attacks the terms this post left alone: layers, sparsity, the quadratic itself.

Where it's heading is already visible: DeepSeek-V3.2 ships MLA's latent cache paired with sparse attention (DSA), in production. The next post takes the term this one skipped — `bytes` — and quantizes it. More notes as I go.
