# Section 26.10 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.10.md](som-26.10.md) — *Learning language*
(Minsky, §26.10).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.10 makes two large claims. First, vocabulary is a cultural
accumulation across millions of person-years; each word is a
preserved discovery. Second, a learner cannot inherit meaning by
memorising definitions — each word is *a seed* that must grow inside
the learner's own existing structures. Grammar is acquired the same
way: the apparent speed of children's grammar comes from re-using
machinery that already runs in vision, manipulation, and play.

---

## The ideas Section 26.10 actually carries

1. **Vocabulary is cultural memory.** Each word-sense is a
   surviving idea; the rest die with their authors.
2. **A word is a seed, not a definition.** The listener must build
   the structure inside, using existing materials.
3. **Inheritance + reinvention.** We inherit forms from the culture
   *and* must reconstruct meanings ourselves.
4. **Sudden advances over concentrated periods.** Language growth is
   not linear.
5. **Pre-existing machinery does most of the work.** Children
   already manipulate Origins, Destinations, Recipients, Instruments
   in play; speech reuses that.

---

## What the implementation already absorbs

### Cultural memory in `memory/semantic/` and `memory/concepts/` (idea 1)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
makes `memory/semantic/decisions.log` and `memory/concepts/` the
durable record of what the society has come to consider true. Each
entry is "a surviving idea" in Minsky's sense; decay metadata
records what is at risk of being lost.

### Append-only with linked corrections (idea 3, partial)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
*Append-only enforcement* — corrections happen by superseding, not
by erasure. This is the runtime's inheritance/correction discipline.

### Re-using machinery (idea 5)

The frame schema, the signal schema, and the handoff schema apply
across all agencies
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
A new agency is added without inventing new plumbing — it inherits
the existing typed channels.

---

## What the implementation does not yet take into account

### A — No learning loop

The plan logs reinforcement
(`evolution/reinforcement-log.md`,
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
*Credit assignment*) but the log is not *applied*: no agency's
manifest is re-written from outcome statistics, no critic's weight
shifts from its hit rate, no K-line's `restore_when` adapts to
reuse history. Minsky's "we must reinvent the meaning" requires a
mechanism that the plan does not run.

### B — Words are dictionaries, not seeds

The repository's vocabulary
([`GLOSSARY.md`](../../../GLOSSARY.md), the protocol documents) is
written as definitions. There is no machinery by which an agency
*reconstructs* a term's meaning by re-deriving it from prior
settlements — terms are looked up, not regrown.

### C — Sudden advances are not a represented phenomenon

The plan has steady incremental change via the `self-modification`
frame and the meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
There is no representation of *phase change*: a settlement that
reorganises many prior settlements at once. The closest analogue is
ecology review, which proposes retirements and differentiations one
at a time.

### D — Reuse of "pre-linguistic" machinery is not explicit

Minsky's children already manage Origins, Destinations,
Recipients, Instruments before speech. The plan's typed payloads in
`candidate_actions[]`
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
*Handoff*) do something similar at the action layer, but there is
no shared sub-language of *roles* (Source, Destination, Tool,
Recipient) that frames inherit. This is the pronome gap from §26.8
restated developmentally.

---

## Summary table

| # | Idea from §26.10 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Vocabulary is cultural memory | Yes | Semantic memory + decay. |
| 2 | A word is a seed, not a definition | No | Terms are defined, not regrown (gap B). |
| 3 | Inheritance + reinvention | Partial | Append-only with corrections; no reinvention loop (gap A). |
| 4 | Sudden advances | No | Phase change is not a represented phenomenon (gap C). |
| 5 | Reuse of pre-existing machinery | Partial | Schemas are reused; pronome roles are not (gap D). |

---

## Implication for the plan (no changes proposed here)

§26.10's most actionable point is the gap between *logging
reinforcement* and *learning from it*. The plan honours the first
half — every settlement contributes attributions — but the second
half (a mechanism that closes the loop into agency manifests) is
unimplemented. This is the same gap §1.1 records (gap D there); it
is worth restating because §26.10 supplies an additional motive:
without a learning loop, vocabulary cannot grow inside the society
the way Minsky describes.

This is recorded as analysis only. Any move toward a learning loop
would touch the credit-assignment protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
the evolution subtree at
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
