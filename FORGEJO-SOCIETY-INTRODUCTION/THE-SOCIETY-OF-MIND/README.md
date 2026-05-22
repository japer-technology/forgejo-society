# Society of Mind

A complete, locally-navigable archive of Marvin Minsky's *The Society of
Mind* (Simon & Schuster, 1986), together with an annotated reference,
a per-section bridge to the implementation plan, and the closely related
ONR-era research (1988) and modern dialogical extension (2025). Every
file here is plain Markdown, readable on Forgejo, on GitHub, and in any
local viewer.

![The Society of Mind — cover](book/images/som_book.jpeg)

> **Mind is what brains do — and what brains do is run a society of
> small processes, none of which is by itself a mind.**

This directory is research-grade reference material. It is the cognitive
substrate the [Society of Repo](../THE-SOCIETY-OF-REPO/README.md) is
engineered against. Every claim should be traceable either to the
primary source under [book/](book/), to the secondary sources under
[research/](research/), or to a clearly labelled extension or
interpretation.

---

## What lives here

This folder has four surfaces. They are layered so that the primary
source, the analysis of it, the engineering implications of it, and the
secondary literature around it are each one click apart.

| Surface | What it is | Entry point |
| --- | --- | --- |
| [book/](book/) | The full text of *The Society of Mind* as 267 Markdown files (cover, contents, prologue, 263 sections across 30 chapters, appendix, postscript, glossary) with every illustration. The primary source the rest of this folder annotates. | [book/README.md](book/README.md) |
| Annotated companion | Twelve thematic files (`01-overview.md` … `12-crosswalk-to-society-of-repo.md`) that read the book as a single argument, distil its principles, and crosswalk each construct to the Society of Repo. | [`01-overview.md`](01-overview.md) |
| Per-section implementation analyses | One `som-{chapter}.{section}-sor.md` file beside each book section, checking what that section actually says against [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/). 263 files in total, kept inside [book/](book/) next to the text they analyse. | [book/som-1.1-sor.md](book/som-1.1-sor.md) |
| [research/](research/) | Secondary sources: *Whole Earth Review* excerpts (1986), Minsky's ONR Final Report (1988), and Mikkilineni & Michaels (2025). | [research/](research/) |

---

## Why this exists

The Society of Mind is the founding theoretical commitment of this
workspace:

1. Intelligence is not a single algorithm. It is the visible behaviour
   of an organised society of small, limited, narrow processes.
2. No part of the society needs to be intelligent on its own.
3. The structure of that society — its hierarchies, frames, K-lines,
   censors, memories, and self-models — is what makes the difference
   between a pile of processes and a mind.
4. A mind built this way can be inspected, criticised, governed, and
   grown.

The [Society of Repo](../THE-SOCIETY-OF-REPO/README.md) takes those
commitments literally and makes the repository the substrate that
carries them. Before those engineering choices make sense, the
cognitive theory has to be explicitly on the table. That is the job of
this folder.

---

## How to read this folder

There are four useful entry points depending on what you came for.

### 1. Read Minsky directly

For the source text, open [book/](book/) and start at the cover:

[book/cover.md](book/cover.md) → [book/contents.md](book/contents.md) →
[book/som-prologue.md](book/som-prologue.md) →
[book/som-1.1.md](book/som-1.1.md) → … →
[book/som-glossary.md](book/som-glossary.md)

Every page in the archive ends with a `« Previous | Contents | Next »`
footer, so the reading order is one click in either direction.
Illustrations live under [book/images/](book/images/), grouped by
chapter.

### 2. Read the annotated companion

For an analytical pass that treats the book as one argument, read the
twelve thematic files in order:

| File | Purpose |
| --- | --- |
| [01-overview.md](01-overview.md) | Minsky's thesis in one page; the shape of the book; the recurring moves. |
| [02-glossary.md](02-glossary.md) | Annotated glossary: agent, agency, K-line, frame, neme, polyneme, isonome, microneme, B-brain, transframe, censor, suppressor, paranome, level-band, and more. |
| [03-principles.md](03-principles.md) | Numbered Society-of-Mind principles with annotation: Investment, Papert's, Exception, Non-Compromise, Duplication, Insulation, Parsimony, and others. |
| [04-architecture.md](04-architecture.md) | Hierarchies, level-bands, ascending and descending systems, A-brain / B-brain, cross-realm bridges. |
| [05-learning-and-credit-assignment.md](05-learning-and-credit-assignment.md) | How a Society of Mind learns: differentiation, cache transfer, zone refining, credit assignment, the role of failure. |
| [06-memory-and-k-lines.md](06-memory-and-k-lines.md) | K-lines, mental states, defaults, partial recall, time-blinks, recognition, reconstruction, and the social view of memory. |
| [07-frames-and-representation.md](07-frames-and-representation.md) | Frames, transframes, polynemes, micronemes, frame-arrays, representation discipline, the cost of holism. |
| [08-conflict-and-non-compromise.md](08-conflict-and-non-compromise.md) | Conflict resolution, censors, suppressors, humour as censor, escalation to higher rank, the Non-Compromise principle. |
| [09-self-and-consciousness.md](09-self-and-consciousness.md) | Self-models, self-ideals, the opacity of mind, consciousness as a coping mechanism, the limits of introspection. |
| [10-deep-insights.md](10-deep-insights.md) | Curated catalogue of the highest-leverage insights, each with quote, restatement, and consequence. |
| [11-objections-and-limits.md](11-objections-and-limits.md) | Honest treatment of weaknesses: scaling, formality, learning algorithms, embodiment, the modern critique. |
| [12-crosswalk-to-society-of-repo.md](12-crosswalk-to-society-of-repo.md) | How each Minsky concept lands in [THE-SOCIETY-OF-REPO](../THE-SOCIETY-OF-REPO/README.md). |

### 3. Read a single section against the implementation plan

For any section in the book, the file beside it named
`som-{chapter}.{section}-sor.md` checks the ideas that section actually
carries against
[`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../FORGEJO-SOCIETY-IMPLEMENTATION/)
— the plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`. The pairing is one-to-one:

| Book section | Implementation analysis |
| --- | --- |
| [book/som-1.1.md](book/som-1.1.md) | [book/som-1.1-sor.md](book/som-1.1-sor.md) |
| [book/som-1.2.md](book/som-1.2.md) | [book/som-1.2-sor.md](book/som-1.2-sor.md) |
| … | … |
| [book/som-30.8.md](book/som-30.8.md) | [book/som-30.8-sor.md](book/som-30.8-sor.md) |

These files are the bridge from cognitive theory to the engineering
backlog. They are kept inside [book/](book/) so that each analysis sits
next to the source text it analyses.

### 4. Read the secondary literature

For sources around the book, open [research/](research/):

| File | Source |
| --- | --- |
| [research/1986.md](research/1986.md) | *Whole Earth Review* excerpts of *The Society of Mind*, Simon & Schuster, 1986. |
| [research/1988.md](research/1988.md) | Marvin Minsky, *ONR Final Report*, August 1988 — connectionism, insulation, K-lines, frames, cache memory, zone refining. |
| [research/2025-10-01.md](research/2025-10-01.md) | Mikkilineni & Michaels, *Society of Minds: The Architecture of Mindful Machines*, 2025 — modern dialogical extension. |

---

## The five recurring Minsky moves

Across the book and the ONR report, five argumentative moves appear
over and over. Recognising them is most of the work of reading Minsky.

1. **Replace one big thing with many small things.** Whenever a faculty
   looks monolithic (memory, vision, language, the self), Minsky
   decomposes it into a society of narrow processes, none of which is
   the faculty.
2. **Make absence and inhibition first-class.** Insulation, censorship,
   suppression, and "what not to think" carry as much weight as
   connection and activation.
3. **Refuse compromise between equals.** When agencies of equal rank
   conflict, abandon both and escalate. Compromise corrupts
   representations and locks in mediocrity.
4. **Treat representation as a political choice.** No representation is
   neutral. Each one helps some operations and forbids others. The mind
   keeps several around and bridges between them.
5. **Locate intelligence in the structure of cooperation, not in any
   part.** The mind is what the society does, not what any agent is.

Every chapter in the book is some combination of these five moves.
Every protocol in the [Society of Repo](../THE-SOCIETY-OF-REPO/README.md)
is an attempt to make one of them operational in a Git-versioned forge.

---

## Citation discipline

When this folder paraphrases or extends Minsky, it MUST say so. Use
these prefixes inside the documents:

| Prefix | Meaning |
| --- | --- |
| **Minsky:** | Direct paraphrase of a passage in *The Society of Mind* (1986) or the ONR Final Report (1988). |
| **Insight:** | A summary or restatement of a Minsky idea in this workspace's terms. |
| **Extension:** | An explicit extension of Minsky beyond what he wrote, usually toward the Society of Repo. |
| **Critique:** | An honest weakness, gap, or modern objection. |
| **SOR mapping:** | The corresponding construct in [THE-SOCIETY-OF-REPO](../THE-SOCIETY-OF-REPO/README.md). |

This keeps the cognitive theory honest, and the engineering downstream
of it honest too.

---

## Provenance

The text reproduced under [book/](book/) is from Marvin Minsky, *The
Society of Mind*, Simon & Schuster, New York, 1986 (ISBN
0-671-60740-5), included strictly as research and reference material
for the commentary and crosswalk in this directory. The underlying
work remains the property of its author and publisher. No claim of
authorship over Minsky's text is made by this repository. If the
rights holders or the Minsky estate object to the presence of any
portion of the archive, raise an issue against the repository and the
material will be removed.
