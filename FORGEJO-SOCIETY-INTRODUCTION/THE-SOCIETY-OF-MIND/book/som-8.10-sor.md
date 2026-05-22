# Section 8.10 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.10.md](som-8.10.md) — *Levels and
classifications* (Minsky, §8.10).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.10 broadens the level-band claim into a claim about
*classification*. Levels and hierarchies are useful, but multiple
classifications coexist (porcelain duck as bird, as pottery, as
toy), and any classification will eventually tangle with
exceptions. The mind reuses old hierarchies when starting a new
task because it dislikes starting from nothing.

---

## The ideas Section 8.10 actually carries

1. **"Level" recurs everywhere.** Aspiration, accomplishment,
   abstraction, management, detail — each uses the same word.
2. **Hierarchies often come from the mind, not the world.** What
   looks like order in the world is sometimes the order the K-line
   tree imposes on it.
3. **Multiple classifications coexist.** A porcelain duck is a
   bird *and* pottery *and* a toy. There is no need to pick one.
4. **Classifications are tool-relative.** The biologist's tree and
   the hunter's tree differ because their uses differ.
5. **Skill development reshapes classification.** Learning a new
   skill emphasises some features and demotes others.
6. **Hierarchies tangle.** No real classification stays neat;
   exceptions and interactions accumulate.
7. **The mind drags old hierarchies along.** When attempting a
   new task, we reach for prior structures rather than starting
   fresh, even when that worsens the fit.

---

## What the implementation already absorbs

### Multiple coexisting taxonomies (ideas 3, 4)

The plan already runs several classifications side by side. An
agency has a *family* (perception, memory, code, …), a *kind*
(worker, critic, censor, narrator, assembler, meta), and an
*authority* (read, draft, propose, act, govern, human)
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
A memory record has a *class*, an *outcome*, and a *frame*
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
None of these is "the" classification; they cross.

### Skills reshape the catalogue over time (idea 5)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
allows new agencies to be added, and the meta-admin family runs a
`differentiation-broker` and `retirement-broker` that split or
prune families based on observed usage
([`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/)).
The classification is not frozen; learning changes it.

### Tangled classifications are permitted (idea 6)

`linked:` edges allow `contradicts`, `cites`, `analogous_to`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
+ relational-memory protocol). The plan does not insist on tidy hierarchies; the graph is allowed to be messy.

### Re-use of prior structure (idea 7, partial)

K-line reactivation explicitly reaches for *prior* configurations
when a new stimulus arrives
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The instinct to "drag old hierarchies along" is mechanised. So is
the danger Minsky names — that the old hierarchy might fit
poorly — though the plan's main mitigation (critics + suppressors)
is a downstream check rather than an upstream filter.

---

## What the implementation does not yet take into account

### A — Multiple classifications per record are not first-class

Idea 3's porcelain duck — bird *and* pottery *and* toy
simultaneously — is what the plan would want to record about, say,
a K-line that is *both* a `code-change` instance *and* a
`security`-relevant one. The K-line schema has `class:` as a single
value, not a list
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
A K-line that legitimately belongs to two classes must pick one,
and the second classification is lost from the directory layout
even if it is preserved in `linked:` edges.

### B — Tool-relative classification has no schema slot

Idea 4 is that the right hierarchy depends on the use. The plan
has *frames* that match by stimulus features
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
and *channels* that route inter-society calls
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)),
but no notion of "view" — a per-use reorganisation of the same
underlying records. A reviewer asking "show me the
security-relevant slice of every memory class" must reconstruct it
ad hoc.

### C — "Level" as a recurring word is not unified (idea 1)

The plan uses *level* in several senses without merging them:
authority level (`read | draft | propose | act | govern | human`),
risk level (`low | medium | high`), assembly tier (1, 2), urgency
indicator
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Each is well-defined locally; none is connected to the others.
Minsky's section invites the observation that they might all be
the same word for the same reason; the plan does not yet make
that claim or refute it.

### D — Mind-imposed vs world-given hierarchies are not distinguished

Idea 2 warns that an apparent hierarchy in the world may be the
shape of the mind, not the shape of things. The plan classifies
records into families, classes, kinds, and so on, with no field
recording "is this an observed structure or an imposed one?" A
reviewer cannot ask "which of our hierarchies reflect the codebase
and which reflect *our* convenience?" — the question has no slot.

### E — Drag-along risk is mitigated downstream only (idea 7)

The K-line reactivation step boosts every agency in the prior
configuration
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The plan trusts critics and suppressors
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
to retract poor fits later. There is no upstream check asking "is
this old hierarchy a good fit at all, or are we dragging it along
because it was nearby?" The drag is allowed; the diagnosis is
deferred.

### F — Reclassification of an existing record

When a K-line written as `code-change` is later recognised as
`security`-relevant, the plan's append-only discipline
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
requires a superseding record rather than an edit. This is the
right discipline for audit, but it makes reclassification a
heavyweight act. Idea 5's "learning reshapes classification" is
honoured *at the catalogue level* (new agencies, splits, retirements)
but not gracefully *at the per-record level*.

### G — Classifications can be challenged

Critics can object to *proposals*; they cannot object to
*classifications*. There is no critic family that asks "this
stimulus was placed in the `bug` frame; is `question` a better
fit?" — frame selection is a single decision at the activate
phase, and once chosen it shapes the rest of the run.

---

## Summary table

| # | Idea from §8.10 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | "Level" recurs everywhere | Partial | Several local levels exist; not unified (gap C). |
| 2 | Mind-imposed vs world-given | No | No field distinguishing them (gap D). |
| 3 | Multiple classifications coexist | Partial | Cross-cutting taxonomies exist; per-record multi-class does not (gap A). |
| 4 | Classification is tool-relative | Partial | Frames + channels; no general view mechanism (gap B). |
| 5 | Skill development reshapes classification | Partial | Catalogue evolves; per-record reclassification is heavy (gap F). |
| 6 | Hierarchies tangle | Yes | `linked:` graph permits tangle. |
| 7 | Mind drags old hierarchies along | Partial | Drag mechanised; upstream fit check absent (gap E). |
| — | Frame choice is challengeable | No | No critic family for classification (gap G). |

---

## Implication for the plan (no changes proposed here)

§8.10 broadens K-line theory into a claim about *classification in
general*. The plan is well placed on this section's structural
points (multiple taxonomies cross; the graph is allowed to tangle;
the catalogue is allowed to evolve) but weaker on its *epistemic*
points (a record cannot belong to multiple classifications at once;
frame choice cannot be questioned; mind-imposed hierarchies cannot
be marked as such). The most consequential gap is frame challenge
(gap G): the rest of the cognitive loop runs inside the chosen
frame, so an unchallenged misclassification quietly shapes the
settlement. Closing these would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(multi-class K-lines; frame challenge step),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(critic catalogue), and
[`THE-SOCIETY-OF-REPO/04-critics/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/04-critics/).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
