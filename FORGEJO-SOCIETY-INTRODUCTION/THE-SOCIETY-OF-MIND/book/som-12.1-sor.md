# Section 12.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.1.md](som-12.1.md) — *A block-arch scenario*
(Minsky, §12.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.1 opens chapter 12 with a long, almost wordless scene: a child
builds a structure, finds it does something strange (Hand-Change),
tries a near-variant, the strangeness goes away, the description has
to be patched, another near-variant breaks the patch, and so on. The
section is one extended demonstration of a single mechanism — *concept
formation by successive failure* — staged entirely as gesture rather
than as theory.

---

## The ideas Section 12.1 actually carries

1. **Concepts are constructed from experience, not received.** The
   child does not start with a definition of "arch". The concept is
   built by interacting with blocks.
2. **A phenomenon (not a label) drives learning.** What focuses the
   child is *Hand-Change* — a felt consequence — not an adult's word.
3. **Near-misses are the engine.** Each new variant that looks like
   the current description but behaves differently forces a revision.
4. **The first description is always wrong.** "Two standing blocks
   and a lying block" is too loose; the child must add "must not
   touch", then handle the wedge top, then …
5. **Revision is structural, not lexical.** Patches add relations
   (touch / not-touch, support, shape neutrality) rather than
   accumulating raw examples.
6. **The teacher is replaced by the world.** Where Winston's 1970
   program needed a labelled teacher, Minsky's reading lets the
   *phenomenon itself* play the teacher's role.
7. **A useful concept survives a small family of variants.** The
   child's final notion is recognisable as "arch" because it has
   already absorbed several near-misses.

---

## What the implementation already absorbs

### Constructed from experience (idea 1)

The plan's K-lines
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
are the mechanism by which the society's working notions are built
from prior runs rather than supplied as definitions. Frames define
*expectations* with required slots; a frame that turns out to fit
poorly leaves traces in `state/` and in `memory/failure/`.

### Near-misses recorded as rejected hypotheses (idea 3)

[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
and [`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
preserve `closed-without-merge` candidate-future branches under
`memory/failure/rejected-candidates/`. The reality-model framing
(branches as candidate futures, merges as reality revisions) gives
the plan a place for *attempts that almost worked* — the operational
analogue of the child's discarded block arrangements.

### A phenomenon focuses the loop (idea 2)

The pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is stimulus-driven: percepts, frame selection, K-line reactivation,
deliberation, settlement. The stimulus is the *event* the user or
the runner has produced; what wakes the society is something that
happened, not something that was named.

### Structural revision (idea 5)

The `self-modification` frame and `agency.meta-admin.differentiation-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
allow an agency or frame to be split when it proves too broad. This
is the structural-revision move at the *agency* level: when a single
manifest is forced to cover too many cases, it can be cleaved.

---

## What the implementation does not yet take into account

### A — No "concept" object distinct from frame, K-line, or memo

§12.1 treats the *arch concept* as a first-class thing being shaped
over many encounters. The plan has frames (situational expectations),
K-lines (reactivable configurations), and `memory/concepts/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
— but `concepts/` is a candidate-abstraction holding pen, not a
running, revisable concept under successive-failure pressure. There
is no lifecycle that takes one entry and patches it across many
stimuli, the way the child patches "arch".

### B — No "near-miss" detector

The plan can *record* a rejected candidate but does not yet *use*
the rejection to mutate a description. Idea 3 (near-misses as engine)
would require a critic or meta-admin pass that compares a rejected
candidate against the description that admitted it, and proposes a
discriminating predicate. Nothing in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
plays this role today.

### C — Phenomena are not named first-class

In §12.1 the child names *Hand-Change* before naming *arch*. The
plan has signals
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
that are dotted-lowercase names with energy and evidence, but a
signal is per-cycle and per-stimulus; there is no notion of a
*persistent phenomenon* the society has noticed across runs and is
trying to account for. The closest analogue is
`memory/concepts/`, which is again a holding pen rather than a
focus-of-curiosity record.

### D — The teacher-free condition is true by default, but undocumented

§12.1's quiet revision of Winston's program — *no external teacher,
the phenomenon teaches* — is a load-bearing methodological claim.
The plan happens to satisfy it (no human label is required to enter
the loop) but does not record this as a property. A reader cannot
ask the plan "where is the teacher-free guarantee?" and find an
answer.

### E — The "small family of variants" survives only as a coincidence

Idea 7 says a concept is valuable when it covers several variants.
K-line `restore_when` clauses do generalise across cues, but the
plan has no metric for *coverage breadth* of a K-line or frame. A
frame that fires on exactly one stimulus and a frame that fires on
fifty variants are treated identically by the runtime; only the
ecology-review cron pass might notice.

---

## Summary table

| # | Idea from §12.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Concepts constructed from experience | Yes | K-lines, frames, archivist promotion. |
| 2 | A phenomenon (not a label) drives learning | Partial | Stimulus drives the loop; no persistent named phenomenon (gap C). |
| 3 | Near-misses are the engine | Partial | Rejected hypotheses are stored; not used to mutate descriptions (gap B). |
| 4 | The first description is always wrong | Yes | `self-modification` frame and differentiation-broker permit revision. |
| 5 | Revision is structural, not lexical | Yes | Manifest schema, frame slots, polyneme weights — revisions are structural. |
| 6 | Teacher replaced by the world | Yes (by default) | True but undocumented (gap D). |
| 7 | Concept survives a family of variants | Partial | K-line `restore_when` exists; coverage breadth is not measured (gap E). |
| — | "Concept" as a long-lived, patched object | No | `memory/concepts/` is a holding pen, not a revisable concept (gap A). |

---

## Implication for the plan (no changes proposed here)

§12.1 is a tutorial in *one* kind of learning — the slow shaping of
a concept by encounter, failure, and patch. The plan already has the
storage layers (K-lines, frames, rejected candidates,
`memory/concepts/`) and the revision machinery (`self-modification`
frame, differentiation-broker) that this kind of learning needs. What
it does not yet have is the *loop closing the storage layers into a
concept-revision cycle*: a near-miss critic, a persistent-phenomenon
record, a coverage-breadth metric, and a clear statement that the
society can learn without an external labeller.

Closing these gaps would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a new critic family), the memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(a phenomena tree alongside `concepts/`), and the credit-assignment
protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md).
These are governance-shape changes, not edits to runnable code, and
so fall under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md). This file records the analysis;
it does not request the change.
