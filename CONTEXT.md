# Resume Site

A personal site for Tony Lee positioned around ML inference performance engineering: a portfolio (projects, experiments, decisions), a resume, and a blog.

## Language

**Blog**:
The section of the site that hosts Tony's written posts. Primarily engineering writing that orbits the GPU labs, but not required to link to them.
_Avoid_: Notes

**Post**:
A single unit of writing in the Blog. Authored as Markdown. May optionally link to Projects, Experiments, and Decisions, but does not require them.
_Avoid_: Note, Article, Entry

**Category**:
The single required broad bucket a Post belongs to. One per Post, shown alongside each Post in lists. A **closed set**, enforced as a Zod enum: `Inference`, `CUDA`, `Career`. Finer distinctions (e.g. serving architecture vs. infrastructure vs. internals) are Tags, not new Categories. Categories label Posts; Tags are what readers navigate by.
_Avoid_: Section, Topic

**Tag**:
An optional fine-grained topic label on a Post (e.g. "SGLang", "Prefix cache"). Many per Post; cross-cuts Categories and is the primary axis readers browse the Blog by. Tags are drawn from a **governed registry** — one canonical slug and one display label per topic, enforced at build time, so an unregistered or misspelled tag fails the build instead of forking the vocabulary (`kv-cache` vs `KV cache`). The registry is open for extension while writing; it is not a closed set like Category. A Tag must not restate the Post's Category.
_Avoid_: Keyword, Label

**Status**:
The lifecycle stage of a Post: `Outline` → `Drafting` → `Published`. The same Post moves through these stages; an Outline and a Published piece are the same kind of thing at different maturities. Only `Published` Posts are public — they alone appear in the Blog index, the feed, the sitemap, and to crawlers. `Outline` and `Drafting` Posts are visible only in local development.
