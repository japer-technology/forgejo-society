# Section 12.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.2.md](som-12.2.md) — *Learning meaning*
(Minsky, §12.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.2 is a methodological pivot. Minsky refuses the catch-all word
*learning* and names four distinct mechanisms — *uniframing*,
*accumulating*, *reformulating*, and *trans-framing* — that the rest
of the chapter will draw on. He also reinstates *concern* (the
child's care about the Hand-Change phenomenon) as a precondition
for any of them to fire.

---

## The ideas Section 12.2 actually carries

1. **"Learning" is too broad to be a primitive.** A single word
   cannot span memorising a poem, tying a shoe, reading, and
   anticipating a friend.
2. **At least four learning kinds.** Uniframing (collapse several
   descriptions into one), Accumulating (collect incompatible
   descriptions), Reformulating (change a description's character),
   Trans-framing (bridge structure to function).
3. **Old words mislead.** Generalising, conditioning, memorising,
   associating — these are either too vague to do work or are tied
   to discredited theories. New names are warranted.
4. **Concern is a precondition.** The child learns *because* the
   Hand-Change phenomenon matters; without that pull, no mechanism
   would fire.
5. **Storage without retrieval is useless.** A theory of how
   knowledge is *put away* is incomplete without a matching theory
   of how it is *put back to work*.

---

## What the implementation already absorbs

### Storage paired with retrieval (idea 5)

The plan never describes memory writes without the corresponding
read path:
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
specifies who writes each subtree, and
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
specifies when each K-line *reactivates*. The
`memory.kline-retriever`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is the retrieval counterpart to the archivist's write. The
representation-discipline reference
(`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`) makes the
write/read coupling explicit.

### Multiple memory kinds, not one (idea 1)

The plan refuses to flatten memory into "learning". It distinguishes
events, episodic, semantic (decisions / preferences / project-laws),
procedural, failure, frames, analogies, concepts, K-lines, and
decisions
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Each has its own write rule. This is the same refusal-of-a-single-word
that §12.2 makes for *learning*, applied to *memory*.

### Concern as activation (idea 4)

Polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
and signals
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
carry *energy*; agencies have `activates_on` clauses. The runtime
will not perform a learning-like operation on a stimulus that no
agency considers relevant. This is structurally close to Minsky's
"concern": nothing fires unless something cares.

---

## What the implementation does not yet take into account

### A — The four learning kinds are not named

Uniframing, Accumulating, Reformulating, Trans-framing are §12.2's
*primary contribution*, and none of them appears as a first-class
concept in the plan. The closest analogues:

- *Uniframing* → `agency.meta-admin.differentiation-broker` runs the
  *opposite* direction (split, not collapse); there is no
  collapse-broker.
- *Accumulating* → `memory/concepts/` and `failure/` accumulate
  examples but are not labelled as such.
- *Reformulating* → no agency or frame exists for "describe the
  parts rather than the whole".
- *Trans-framing* → frames link structure to action via
  `default_actions`, but there is no protocol step that *learns* a
  new structure-to-function bridge.

This is the largest gap of the section.

### B — No taxonomy of memory writes by *learning kind*

The plan classifies durable writes by *substrate* (semantic,
procedural, K-line, etc.). It does not classify them by *which
learning kind produced them*. A reviewer cannot ask "which K-lines
came from accumulation versus uniframing?" because the distinction
is not represented.

### C — "Concern" is implicit, not named as a runtime quantity

Activation energy in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and `energy` in signals
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
play the role §12.2 gives to *concern*, but the plan never makes the
identification. A small statement to that effect — energy is the
operational form of concern — would close a documentation gap, not
a structural one.

### D — Old vocabulary survives in the prose

Minsky asks for new names because the old ones drag theory with
them. The plan still uses words like *learning*, *reinforcement*,
*reuse*, *memorising* (in `memory/episodic/`) without distinguishing
which §12.2 mechanism they invoke. The runtime is honest; the prose
that surrounds it can be imprecise.

---

## Summary table

| # | Idea from §12.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | "Learning" too broad to be a primitive | Yes | Memory tree distinguishes ten substrates. |
| 2 | Four learning kinds (Uni/Accum/Reform/Trans) | No | No first-class concept of any of the four (gap A). |
| 3 | Old words mislead | Partial | Plan uses old words loosely (gap D). |
| 4 | Concern is a precondition | Yes (implicit) | Activation energy plays the role; not identified as concern (gap C). |
| 5 | Storage without retrieval is useless | Yes | Every write rule has a matching read mechanism. |
| — | Memory classified by learning kind | No | Substrate classification only (gap B). |

---

## Implication for the plan (no changes proposed here)

§12.2 lands two punches the plan should record. The first is the
*four-kind* taxonomy; the plan honours its spirit (rich memory,
energy-driven activation, retrieval coupled to storage) without
honouring its letter (no agency, frame, or signal is named after any
of the four kinds). The second is the *no-storage-without-retrieval*
discipline, which the plan satisfies cleanly.

Closing gap A would touch the agency catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(new meta-admin or assembly members), the frame catalogue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and possibly the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md).
Closing gap B would mean a new metadata field on K-lines and
concepts. Closing gap C is a one-paragraph addition; closing gap D
is editorial. All of these are governance-shape changes and so fall
under the stop-and-ask rules in [AGENTS.md](../../../AGENTS.md) §12
and [CLAUDE.md](../../../CLAUDE.md). This file records the analysis;
it does not request the change.
