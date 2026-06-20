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
The single required broad bucket a Post belongs to (e.g. "Inference", "CUDA", "Career"). One per Post; the primary axis a reader scans.
_Avoid_: Section, Topic

**Tag**:
An optional fine-grained topic label on a Post (e.g. "SGLang", "Prefix cache"). Many per Post; cross-cuts Categories.
_Avoid_: Keyword, Label

**Status**:
The lifecycle stage of a Post: `Outline` → `Drafting` → `Published`. The same Post moves through these stages; an Outline and a Published piece are the same kind of thing at different maturities. Only `Published` Posts are public — they alone appear in the Blog index, the feed, the sitemap, and to crawlers. `Outline` and `Drafting` Posts are visible only in local development.
