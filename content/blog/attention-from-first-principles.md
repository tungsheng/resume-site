---
title: "Attention, from First Principles"
summary: "Attention is the one operation that lets a token look back at the whole sequence — and it is also where the KV cache comes from. This post derives scaled dot-product attention from the ground up, then watches the cache, and the memory wall from the last post, fall straight out of the math. The first of two; the next is about making it cheap."
category: "Inference"
status: Drafting
published: 2026-06-28
tags:
  - attention
  - self-attention
  - kv-cache
  - transformer
related:
  projects:
    - gpu-inference-lab
  experiments:
    - kv-cache
---

In the last post I leaned on one sentence and kept walking: *attention at step N needs the keys and values of every earlier token.* That line is where the KV cache comes from, where decode's memory wall comes from — the entire second half of that post was paying interest on a debt I never explained. This post explains it. We are going to build attention up from the formula, and by the end the KV cache won't be a thing the serving layer bolts on; it'll be something you can read straight off the equation.

I'm a full-stack engineer learning this in the open, so I want the *why* under each step, not just the shape of it. No benchmarks, no proofs — just the mechanism, derived once, slowly, with the costs made visible as we go.

## What attention replaced

It helps to know what came before. Until 2017, the dominant way to model a sequence was **recurrence** — RNNs and LSTMs that walked the tokens one at a time, carrying a hidden state forward like a running summary. That design has two problems. It can't parallelize: token N's state depends on token N−1's, so the work is inherently sequential, one step per token, no matter how much hardware you own. And the summary blurs — by the time a long sentence ends, the beginning has been squeezed through hundreds of update steps and is mostly gone.

The paper that introduced the transformer was titled *Attention Is All You Need*, and the title was a literal claim: throw out recurrence entirely, keep only the attention mechanism, and you get a model that trains fully in parallel and lets any token reach any other token directly — no running summary, no distance penalty. That bet is the reason every model in this series exists. The paper's original was a translation model with an encoder and a decoder, but the LLMs I care about are **decoder-only** and **causal**: every token may look at the tokens before it and never the ones after. That's the version I'll build, because it's the one that produces the cache.

## The problem attention solves

Take the sentence I'll use for the rest of this post: *"The cat sat because it was tired."* What does `it` refer to? You know instantly — the cat. But the model's embedding for `it` doesn't know that on its own. An embedding is just a vector for the token in isolation; the word `it` carries almost no meaning until it borrows some from `cat`. And the borrowing can't be baked in ahead of time: the same token means different things in different sentences — `it` is the cat here and might be the weather two messages later — so the lookup has to happen at runtime, over whatever tokens actually surround it. Every interesting thing a language model does comes down to this: a token's real meaning lives in its **context**, and the model needs a mechanism to go fetch that context.

Attention is that mechanism. For each token, it looks back over the earlier tokens, decides which ones are relevant, and pulls a blend of their information into the current position. `it` reaches back, finds `cat`, and becomes — for the rest of the computation — a richer vector that means *it, the cat*. The whole rest of this post is just the precise machinery of "looks back," "decides which," and "pulls a blend."

## Query, key, value

Here's the move that makes it work. From each token's embedding, the model produces **three** different vectors, by multiplying the embedding by three learned weight matrices:

- a **query** (`Q = X · Wq`) — what this token is looking for;
- a **key** (`K = X · Wk`) — what this token offers to others;
- a **value** (`V = X · Wv`) — what this token actually hands over if attended to.

The retrieval analogy is exact, and it's worth holding onto. A query is a search request. A key is the label on a drawer. A value is what's inside the drawer. Attention matches each token's query against every token's key to decide *which drawers to open*, then pulls out a weighted mix of their values. The three roles are separate on purpose — what a token advertises (`K`) is not the same as what it's searching for (`Q`), which is not the same as what it contributes (`V`) — so the model gets three independent sets of weights to learn them.

The shapes matter, because they're where the cost will come from. If the sequence has `seq` tokens and each embedding has width `d_model`, then `X` is `seq × d_model`. Each weight matrix is `d_model × d_head`, so each of `Q`, `K`, `V` comes out `seq × d_head` — one row per token (Figure 1). Hold onto `K` and `V` in particular: those two are exactly what the KV cache stores.

![Figure 1 — Each token's embedding is projected three ways by learned matrices Wq, Wk, Wv into a query, key, and value. Q, K, and V each have one row per token; K and V are precisely what gets written to the KV cache.](/assets/blog/attention-from-first-principles/qkv-projection.svg)

## Scaled dot-product attention

Now the formula. With `Q`, `K`, and `V` in hand, attention is four operations in a row — and every one of them earns its place.

**Score every pair.** Take the dot product of each token's query with every token's key: `scores = Q · Kᵀ`. A dot product is large when two vectors point the same way and near zero when they're unrelated, so it's a natural similarity score: `scores[i][j]` is *how much token i's query matches token j's key* — how relevant token j is to token i. The whole point of training `Wq` and `Wk` is to learn to aim a token's query in the same direction as the keys of the tokens it ought to care about. With `seq` tokens this is a `seq × seq` grid, one row per querying token, one column per token being looked at.

**Scale it down.** Divide every score by `√d_head`. This looks like a fudge factor and isn't. A dot product over `d_head` dimensions is a sum of `d_head` products; the more dimensions, the larger that sum tends to grow, and big raw scores push the next step — `softmax` — into a corner where one token grabs nearly all the weight and the gradients flatten out. Dividing by `√d_head` keeps the scores in a sane range so the model can actually learn which tokens matter.

> [!NOTE]
> Why the square root specifically? If a query and key have components that are independent with unit variance, their dot product over `d_head` dimensions has variance `d_head` — so its standard deviation is `√d_head`. Dividing by `√d_head` rescales the scores back to roughly unit variance before the `softmax`, which is exactly the range where `softmax` stays sensitive. The scale factor isn't a magic number; it's the standard deviation of the thing it's correcting.

**Mask the future.** This is the causal part, and it's load-bearing for everything downstream. Token `it` may attend to `The cat sat because`, but not to `was tired` — those come after it, and at generation time they don't exist yet. So before the next step we set every score where `j > i` to negative infinity, which the `softmax` will turn into zero weight. The grid becomes lower-triangular: each token sees itself and everything to its left, nothing to its right (Figure 2).

**Normalize into weights.** Run `softmax` across each row. Now every row is a set of non-negative weights that sum to one — a probability distribution over "how much of my attention goes to each earlier token." Why `softmax` and not just divide each row by its sum? The exponential inside it rewards the largest scores disproportionately, so attention can *commit* — pour almost all of its weight onto the one or two tokens that matter — while staying smooth and differentiable, a soft version of "pick the best." Plain normalization would smear the weight too evenly to resolve a sharp reference. In our sentence, the row for `it` puts most of its weight on `cat`; that single bright cell is attention doing its one job.

**Blend the values.** Finally, multiply those weights by `V`: `output = softmax(scores / √d_head) · V`. Each token's output is a weighted average of the value vectors of the tokens it attended to. `it` walks away carrying mostly `cat`'s value — it has pulled the context it needed. That enriched vector is what attention contributes, and it gets added back into the token's residual stream — the skip-connection from the last post — so the next layer starts from an `it` that already knows it's the cat.

![Figure 2 — The score grid for "The cat sat because it was tired." Each cell is a query-key dot product; the upper triangle is masked out so no token sees the future; softmax normalizes each row into weights. The row for "it" lights up on "cat" — attention resolving the reference.](/assets/blog/attention-from-first-principles/scaled-dot-product.svg)

That's the whole operation: `softmax(Q · Kᵀ / √d_head) · V`. Score, scale, mask, normalize, blend. Everything else in this post is consequences.

## Many heads

One set of `Q`, `K`, `V` learns one notion of relevance. But tokens relate in more than one way at once — `it` wants `cat` for its referent, but a verb might want its subject, and a word might want the punctuation that bounds its clause. Forcing all of that through a single attention pattern is a bottleneck.

So real transformers run **multi-head attention**: instead of one big attention, they split the projections into `h` smaller ones — `h` independent `(Q, K, V)` triples, each `d_head` wide, each with its own learned weights. Every head runs the exact scaled-dot-product computation from the last section, in parallel, in its own subspace, learning its own kind of relevance. Then the `h` head outputs are concatenated back into a full-width vector and passed through one more learned matrix, `Wo`, that mixes them into the block's output (Figure 3).

There's a subtlety worth surfacing, because it's why this is affordable at all. The heads don't each get the full `d_model` width — the model splits that width across them, so `d_model = h × d_head`. Eight heads of width 64 cost about the same total arithmetic as one head of width 512; multi-head reshuffles the same budget into parallel subspaces instead of spending more of it. So in *compute*, extra heads are nearly free.

The cache is the exception, and this is where the post's cost starts to show its shape. Free in FLOPs or not, every head still stores its own keys and values — so the cache isn't one `K` and one `V` per token, it's one *per head*, `num_heads` copies wide. What's nearly free in arithmetic is paid for in memory. That asymmetry is the hinge between this post and the next.

![Figure 3 — Multi-head attention runs h independent attention computations in parallel subspaces, then concatenates their outputs and mixes them with Wo. Each head keeps its own K and V, so the KV cache is num_heads wide — and the whole block repeats num_layers times down the stack.](/assets/blog/attention-from-first-principles/multi-head.svg)

## Where it sits, and what it costs

Step back to the stack from the last post. Each decoder layer has an attention sublayer, and the model has `num_layers` of them. So the keys and values aren't computed once — they're computed by every head, in every layer, for every token, and kept for the whole length of the sequence. Recompute them from scratch each decode step and generation goes quadratic; that's why they live in a cache instead. And because the causal mask only ever lets a token look left, the keys and values of earlier tokens never change as the sequence grows — each step just appends one new `K` and `V` and reads all the ones before it. The cache is just the `K` and `V` of Figure 1, saved, once per head, once per layer.

Put numbers on it. The cache holds, for every token: a key and a value (that's the `2`), each `d_head` wide, for every head, in every layer:

`cache = num_layers × num_heads × 2 × seq_len × d_head × bytes`

Take a vanilla multi-head model in the 7–8B-parameter class — say 32 layers, 32 heads, `d_head` of 128, weights in fp16 (2 bytes), and a 4,000-token context. That's `32 × 32 × 2 × 4000 × 128 × 2` bytes — on the order of **2 GB of cache for a single sequence**. Not the model weights. Not the batch. One conversation's worth of keys and values. This is a back-of-the-envelope sizing, not a benchmark, but it's the number that makes "the KV cache caps concurrency" from the last post suddenly concrete: serve a handful of these at once and the cache, not the math, is what fills the GPU.

And it's the same row you watched grow in the last post's KV-cache figure — only now you can see what's *in* each entry. Each entry is a key and a value, born from `X · Wk` and `X · Wv`, multiplied out by head and by layer. The memory wall wasn't a property of the serving system. It was sitting in the attention formula the entire time.

## What comes next

So that's attention from the bottom: every token projects a query, a key, and a value; queries score against keys; the scores are scaled, masked to the past, and normalized; and the weights blend the values into the context each token needed. `it` finds `cat`. Multiply it out across heads and layers and the keys and values you have to keep *are* the KV cache — the exact cost that shapes how these models get served.

Which sets up the obvious question. If `num_heads × num_layers` copies of `K` and `V` is the ~2 GB we just sized, can we keep fewer of them without losing what attention buys us? That's the whole next post: the architectural moves that shrink the cache — **MQA**, **GQA**, **MLA** — and **FlashAttention**, which refuses to write that `seq × seq` score grid to memory at all. Same operation we just built, reshaped to be cheap. I'll keep taking the notes as I go.
