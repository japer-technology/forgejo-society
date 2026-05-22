# Section 28.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-28.6.md](som-28.6.md) — *Minds and machines*
(Minsky, §28.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§28.6 makes a quiet but consequential move: the difficulty with brains
is not philosophical but combinatorial. Brains are *self-modifying*
machines with billions of parts, and we do not yet have the categories
to think about such machines well. The hard problem is not "are they
machines?" but "what kinds of machines change themselves while
running?"

---

## The ideas Section 28.6 actually carries

Pulled from Minsky's text:

1. **Minds are not things.** They have no colour, size, shape, or
   weight; they fail the substance test.
2. **The question of whether non-brains have minds is a question
   about words, not facts.** It turns on which processes we choose
   to call mind-like.
3. **Brains are machines — but a peculiar kind.** Their principal
   activity is changing themselves.
4. **Self-modifying processes resist classification.** Inputs cannot
   be cleanly separated from outputs, because the machine that
   produces an output is changed by producing it.
5. **Memory is the engine of self-modification.** Making memories
   changes the way subsequent thought happens.
6. **The difficulty is novelty, not metaphysics.** We are not used to
   thinking about machines with billions of parts that rewrite
   themselves; that is the actual problem.

---

## What the implementation already absorbs

### Self-modifying machine, declared as such (idea 3, idea 5)

The plan treats self-modification as a first-class case. The
`self-modification` frame appears in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and is *required* for any change to governance, agencies, critics,
censors, frames, or nemes per
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
("agency_mutation", "governance_mutation"). The runtime cannot edit
itself without naming the act.

### Memory drives subsequent thought (idea 5)

The three-tree model in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
makes this concrete: `memory/klines/` and `memory/frames/` are
written by the `archivist` at end-of-settlement, and re-read by the
`activate` and `deliberate` phases on the next stimulus. The
*reuse_count* and `decay_score` machinery means yesterday's
settlements measurably alter today's activation. This is Minsky's
"making memories changes the way we'll subsequently think,"
implemented as committed Git objects.

### Brains as machines — without mystique (idea 1, idea 3)

The voice rules in [AGENTS.md](../../../AGENTS.md) ban "AGI", "AI
brain", "autonomous developer". The plan refers to its parts as
manifests, steps, frames, K-lines, and settlements; no mystique is
attached to the substrate. The `forgejo-intelligence`,
`forgejo-society`, and `forgejo-labour` triad in
[`14-three-repo-implementation-targets.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/14-three-repo-implementation-targets.md)
is a mechanical decomposition, not a mind-stuff one.

### Many parts, working in accord (idea 6)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
already enumerates dozens of agencies in eight family taxa
(perception, memory, code, safety, identity, integration, assembly,
meta-admin). The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
keeps the part-count auditable: every cognitive structure collapses
to a file under `.forgejo-society/` or a step in the workflow,
nothing else.

### Words, not facts (idea 2)

The plan refrains from claiming inner life for the society. The
canonical vocabulary in [AGENTS.md](../../../AGENTS.md) defines
*agency*, *critic*, *censor*, *frame*, *K-line*, *settlement*,
*signal*, *handoff* as terms of art, with explicit warning against
anthropomorphic re-readings. This is the §28.6 discipline of
choosing one's mind-words carefully.

---

## What the implementation does not yet take into account

### A — Self-modification is gated but not measured

The `self-modification` frame and the danger-zone catalogue gate
*who* may change the society and *when*. They do not measure *how
much* the society has been changed by itself versus by the human.
`memory/procedural/` records *that* a change happened; nothing
aggregates "fraction of agencies authored by self-modification" or
"rate of frame churn." Without that aggregate, §28.6's "principal
activity is changing themselves" is a possibility the plan permits
but does not yet observe.

### B — Inputs-versus-outputs are not separated by document

§28.6's hardest combinatorial claim — that you cannot separate the
products of a brain from the brain itself, because memory-making
*is* both — is honoured operationally (the `archivist` writes
memory that subsequent runs read) but not documented as a
*characteristic* of the architecture. A reader of
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
sees a linear pipeline that ends with `remember` and `report`; the
fact that `remember` mutates the substrate that `activate` reads
next time is not called out.

### C — The first-ship is large but bounded; growth is unmodelled

§28.6 is silent on *how* the brain grew its billions of parts; the
plan is silent on how the society would grow its agency set beyond
the first ship. The `agency.meta-admin.differentiation-broker` and
`agency.meta-admin.retirement-broker` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
are mechanisms for shape-change, but there is no *growth curve*: no
expected trajectory from "few agencies, hand-authored" to "many
agencies, mostly self-differentiated." This is the §1.1 gap A
(developmental timescale) restated under §28.6.

### D — No notion of "categorising self-modifying processes"

§28.6's deepest move is that the *categories* for thinking about
self-modifying machines are missing. The plan does not (yet) carry
a taxonomy of *kinds* of self-modification — superficial (a prompt
tweak), structural (a new agency), governing (a new authority
level), reflective (a change to the change protocol itself). Such a
taxonomy would belong somewhere near
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
or in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/);
no such taxonomy is present.

### E — Many-parts complexity is unbudgeted

§28.6 closes with the observation that we are not yet prepared to
think about machines of such complexity. The plan does not bound
its own complexity: there is no stated limit on number of agencies,
no metric for "how many critics can fire on one stimulus before the
settlement is incoherent." The collapse rule keeps the structure
auditable, but it does not cap the size.

---

## Summary table

| # | Idea from §28.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Minds are not things | Yes | No substance claim; voice rules ban mystique. |
| 2 | "Does X have a mind?" is about words | Yes | Canonical vocabulary defines all mind-terms as terms of art. |
| 3 | Brains are self-modifying machines | Yes | `self-modification` frame; danger-zone gating. |
| 4 | Self-modifying processes resist classification | Partial | Gated but not classified (gap D). |
| 5 | Memory is the engine of self-modification | Yes | `memory/klines/`, `memory/frames/`, `reuse_count`, `decay_score`. |
| 6 | Difficulty is novelty, not metaphysics | Partial | Many parts permitted; complexity unbudgeted (gap E). |
| — | Self-modification rate observed | No | Procedural entries exist; not aggregated (gap A). |
| — | Inputs/outputs entanglement narrated | No | Honoured operationally; not stated (gap B). |
| — | Growth curve of agency set | No | No developmental trajectory (gap C). |

---

## Implication for the plan (no changes proposed here)

§28.6 finds the plan structurally aligned — the runtime *is* a
self-modifying machine, with self-modification gated as such — but
descriptively quiet about it. The most useful unforced opportunity is
gap D: a brief taxonomy of self-modification kinds (superficial,
structural, governing, reflective), which would make the danger-zone
catalogue in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
easier to extend without confusion. Gap A (measuring the rate of
self-modification) is the next-most-tractable. Gap E (complexity
budget) is interesting and probably premature.

This is recorded here as analysis, not as a change request. Any move
to close gap D would touch the frames document and likely
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/);
gap A would touch `memory/procedural/` schema and the meta-admin
agency manifests; and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
