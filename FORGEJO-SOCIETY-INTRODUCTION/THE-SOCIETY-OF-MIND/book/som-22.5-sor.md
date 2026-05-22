# Section 22.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.5.md](som-22.5.md) — *Inference*
(Minsky, §22.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.5 treats inference as *chaining of Trans-frames*. From *John gave
the kite to Mary* and *Mary gave the kite to Jack* one concludes the
kite went from John to Jack by merging the first Origin with the
second Destination. Even the simple example *Put the apple in the
pail* secretly involves two Trans-frames whose pronome roles must be
rotated mid-task (the apple is Destination of "get", then Origin of
"put").

---

## The ideas Section 22.5 actually carries

1. **Chaining is a primary mode of reasoning.** Linking structures
   together produces conclusions that neither structure carries
   alone.
2. **Logic is one implementation among several.** A simpler theory
   is frame-chaining, not formal logic.
3. **Chaining requires partial match.** *Tweety is a bird* and
   *All birds can fly* match only loosely; chaining demands a
   "similar enough" decision.
4. **The disparity is recovered with other knowledge.** The bridge
   from *a bird* to *all birds* uses external context, applied at
   the right level of detail.
5. **Mid-task pronome roles change.** What was a Destination becomes
   an Origin; some isonome must rotate it.
6. **Several pronome assignments are manipulated at once.** Inference
   needs simultaneous management of multiple memory slots, not just
   one.
7. **Chaining yields conceptualised structures.** Bridges, chains,
   towers — the chained result is a thing the mind can later treat as
   a unit.

---

## What the implementation already absorbs

### Settlement linkage as long-range chaining (idea 1)

The settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carries `linked: [{kind, target}]` with kinds including
`derived_from`, `cites`, `supersedes`, and `reinforces`. Settlements
explicitly link to prior settlements; this is the *durable* form of
the chaining Minsky names.

### Relational memory as the chain substrate (idea 1, idea 7)

The relational-memory protocol
([`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
restated in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
gives every durable record typed links. The graph that results is
exactly the substrate a chaining inference would walk.

### Prior-decision resonance (ideas 3, 4)

`agency.memory.prior-decision-resonator` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
surfaces prior decisions that *resemble* the stimulus. Resemblance
is the "similar enough" judgement §22.5 demands; the resonator is
the structural home for it.

### Multiple slot manipulation (idea 6, partially)

Frame `slots` in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
let several values be carried side-by-side through a single run
(`user_goal`, `relevant_files`, `proposed_patch`, `tests`, `risks`).
This is at least a *carrier* for the multiple-pronome-state §22.5
requires.

### Polynemes as loose-match activators (idea 3)

Polyneme matching on paths, labels, and phrases provides a built-in
loose-match. The chain *Tweety → bird → all birds → can fly* would
ride along the polyneme `kind:question` → frame `question` → K-line
match by `restore_when.any_terms` rather than along formal logic.

---

## What the implementation does not yet take into account

### A — No inference engine over Trans-frames

The plan has no agency whose job is to take two frames active in the
same run and *merge* them. The chaining Minsky describes happens
*inside* a single deliberation; the plan's chaining is *across*
settlements. There is no "deduction-frame" record type, and no phase
in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
where frame composition would occur.

### B — No mid-run pronome-role rotation

§22.5 makes role rotation (Destination → Origin between successive
sub-actions) a load-bearing primitive. Frame slots in the plan are
filled once and read; they are not *rotated* mid-run. The hidden
two-step structure of *Put the apple in the pail* has no
representational counterpart.

### C — "Similar enough" is not a first-class judgement

Polyneme matching is yes/no per pattern; K-line `restore_when` is
yes/no on each cue. The plan has no scalar that records *how* similar
two structures are, and no policy that says "above threshold T,
chaining is allowed." `agency.memory.prior-decision-resonator`
surfaces resemblances but produces no machine-checkable similarity
score.

### D — Disparity-recovery has no mechanism

The bridge from *a bird* to *all birds* requires external knowledge
applied at the right level of detail. The plan's level-band control
is absent (see [som-22.2-sor.md](som-22.2-sor.md), gap C), so the
"apply at the right level of detail" half of disparity-recovery has
no surface to attach to.

### E — Logic-vs-frame-chaining choice is unstated

The plan does not commit to *either* a logical inference engine or a
frame-chaining one. It also does not commit to having neither.
§22.5's preference for the simpler frame-chaining theory is a
position the plan could take explicitly; today it is silent.

### F — Conceptualisation of a chain has no agency

Idea 7 — that the *result* of a chain is itself a thing the mind can
later treat as a unit — would produce a `concepts/` record. The
infrastructure exists
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
but no agency converts a successful chain into a concept candidate.
This is the same gap §22.6 will deepen.

---

## Summary table

| # | Idea from §22.5 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Chaining as primary reasoning | Partial | Across settlements (relational links); not within a run (gap A). |
| 2 | Frame-chaining over formal logic | Implicit | Plan has no inference engine of either kind (gap E). |
| 3 | Partial match required | Partial | Polynemes and resonators; no similarity scalar (gap C). |
| 4 | Disparity recovered with external knowledge | No | No level-band control (gap D). |
| 5 | Mid-task pronome rotation | No | Slots fill once (gap B). |
| 6 | Several pronome assignments at once | Partial | Frame slots carry multiple values; not re-rotatable (gap B). |
| 7 | Chains become things | No | No agency promotes a chain to a concept (gap F). |

---

## Implication for the plan (no changes proposed here)

§22.5 is the place where the plan's strongest structural asset
(typed, linked, durable settlements) meets one of its weakest
in-run capabilities (frame composition and mid-run slot rotation).
The cross-settlement chain is good; the within-stimulus inference is
not yet attempted. Closing the gap would mean either committing to a
frame-chaining inference primitive in `deliberate`, or stating
explicitly that intra-run inference is delegated entirely to the
local model and is not modelled separately by the society.

Any move to add a frame-composition step, a similarity scalar in the
handoff schema, mid-run slot rotation, or a chain-to-concept
promotion would touch
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the representation and relational-memory protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
