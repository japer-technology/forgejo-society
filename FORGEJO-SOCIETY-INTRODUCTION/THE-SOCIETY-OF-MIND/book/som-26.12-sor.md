# Section 26.12 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.12.md](som-26.12.md) — *Coherent discourse*
(Minsky, §26.12).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.12 closes the language chapter at a larger scale. A discourse
runs on many scales at once: each word can rearrange the structures
built from earlier words; transient structures get absorbed into
larger networks; small-scale focus shifts (*by the way*, *for
example*, *but*, *in any case*) steer the listener's attention; and
above words and grammar sit *plots* and *standard personalities*
that organise stories themselves. There is no clean boundary
between language and the rest of thinking.

---

## The ideas Section 26.12 actually carries

1. **Discourse runs on several scales simultaneously.** Word,
   phrase, sentence, paragraph, scene, plot.
2. **Most intermediate structures are transient.** They persist for
   moments, then collapse into larger representations.
3. **Smaller-scale items are absorbed into larger networks.** A
   subject becomes a vehicle becomes a trait of an actor.
4. **Focus-shifters are first-class.** *By the way*, *for example*,
   *but*, *in any case* — these *manage* the listener.
5. **There is no clean boundary between language and thinking.**
   The shape of grammar is the shape of thought; the shape of
   discourse is the shape of mind.
6. **Stories have plots and standard personalities.** Above
   grammar sits a learned catalogue of narrative forms.

---

## What the implementation already absorbs

### Multi-scale state (ideas 1, 2)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
defines three trees with three lifetimes — `state/` (per-run),
`workspace/` (short-term), `memory/` (durable). Material flows up:
transient run state can be promoted to durable memory only through
settlement. This is the runtime's "small things absorbed into
larger networks" pattern.

### Layered summaries (idea 3)

`agency.assembly.summary-tier-1` and `summary-tier-2`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
compress raw signals into per-family summaries and then into a
settlement-ready brief. This is the runtime's *vehicle becomes
trait* absorption.

### No clean boundary between language and the rest (idea 5)

The plan refuses to isolate "language" as a subsystem. The
conscious presenter
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
*Conscious bottleneck*) is one agency among many; everything
upstream is structured cognition. This honours Minsky's claim that
language is not a separable module.

### Append-only with linked corrections (idea 2, partial)

Durable records carry typed `linked:` fields
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
*Relational memory*) — `supersedes`, `derived_from`, `cites`,
`reinforces`. Older records remain; newer ones reorganise the
network around them.

---

## What the implementation does not yet take into account

### A — No discourse-level focus-shifter catalogue

Minsky's *by the way*, *for example*, *but*, *in any case* have no
runtime equivalent. The plan does not have an output-side catalogue
of discourse moves the conscious presenter must use; nor does it
have an input-side catalogue of focus-shifters to recognise in user
comments.

### B — Cross-stimulus reorganisation is not a phase

Within one stimulus, summaries compress signals. Across stimuli,
nothing reorganises older settlements *in light of* a new one,
except via supersession (one-to-one) or ecology review (manual
pass). Minsky's "scenario absorbed into trait" is dynamic; the
plan's analogue is governance-rate-limited.

### C — No plot or standard-personality catalogue

Minsky's §26.12 closes with *plots* and *standard personalities*
above grammar. The plan has neither a `plots/` subtree nor a
*standard personality* catalogue; agencies have a single voice
(Spock) defined in `AGENTS.md`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
*identity family*), and no catalogue of narrative arcs informs
output composition.

### D — Multi-scale state has only one upward arrow

Material flows `state` → `workspace` → `memory`. There is no
downward arrow by which a durable structure *contextualises* a new
transient one beyond K-line reactivation. Minsky's image of *each
word can rearrange the structures built from earlier words* has
its closest match in K-line preloading, which is a coarser
mechanism.

### E — No language/thought boundary statement

Although the plan honours the *absence* of a clean boundary in
practice (no isolated NLP layer), no document records this as a
*design commitment*. The closest is the conscious-bottleneck rule,
which is about output uniqueness, not about the language/thought
relationship.

---

## Summary table

| # | Idea from §26.12 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Discourse runs on several scales | Yes | Three trees with three lifetimes. |
| 2 | Intermediate structures are transient | Yes | `state/`/`workspace/` lifetimes; archival via settlement. |
| 3 | Smaller items absorbed into larger | Partial | Tier-1/tier-2 summaries within a stimulus; no cross-stimulus reorganisation (gap B). |
| 4 | Focus-shifters are first-class | No | No discourse-shifter catalogue (gap A). |
| 5 | No clean boundary between language and thinking | Yes (de facto) | Honoured by design; not stated (gap E). |
| 6 | Plots and standard personalities | No | No plot or personality catalogue (gap C). |

---

## Implication for the plan (no changes proposed here)

§26.12 is the language chapter's closing argument: linguistic
structure is *thought structure rendered communicable*. The plan
honours this most strongly through its absence of an isolated
language module, and through the three-tree lifetime model that
mirrors Minsky's multi-scale discourse. The clearest unforced
opportunity is a discourse-shifter catalogue — small, additive,
and useful both on the input side (recognising user focus moves)
and the output side (letting the conscious presenter steer
attention with named primitives rather than free prose).

This is recorded as analysis only. Any move toward a discourse-
shifter catalogue, a plot catalogue, or a cross-stimulus
reorganisation phase would touch the polyneme catalogue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the integration family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and the evolution subtree at
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
