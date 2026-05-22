# Section 25.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-25.1.md](som-25.1.md) — *One frame at a time?*
(Minsky, §25.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§25.1 opens chapter 25 by noticing that ambiguous figures — the
candlestick-or-faces, the cube-from-above-or-below — refuse to be
seen both ways at once. Minsky's hypothesis is that vision is built
with *locking-in* machinery at several levels: each part may belong
to one and only one whole at the next level, and each object to one
frame at a time. The chapter's foundational claim is that *mutual
exclusion is structural*.

---

## The ideas Section 25.1 actually carries

1. **Mutual exclusion at every level.** An interpretation is not a
   weighted blend; it is a winner. The other reading is suppressed
   while one is held.
2. **Locking-in machinery is layered.** Edges, areas, objects, and
   frames each have their own lock. The exclusion is not a single
   gate but a stack of them.
3. **Bistability, not indecision.** The cube *flips*; it does not
   smear. The system tolerates exactly one reading and then exactly
   another.
4. **Competition for accountability.** In every region of the
   picture, frames must *compete* to account for each feature. The
   feature is the prize; the frame is the claimant.
5. **Parts have a single owner at any moment.** A corner belongs to
   one shape, not to several at once. Ownership is a runtime
   property, not a description.

---

## What the implementation already absorbs

### Settlement as the lock (ideas 1, 3, 4)

The settlement layer in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
already collapse many partial signals into a single decision per
turn. The settlement is exactly Minsky's lock: at the end of a turn,
one interpretation wins, the others are recorded as alternatives.
The cube does not smear.

### Mutual inhibition between agencies (idea 1)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
gives every agency manifest an `inhibits:` list. The schema admits
that two agencies can be mutually exclusive at the activation level,
which is the agency-scale version of the candlestick-or-faces lock.

### One narrator at the top (idea 5)

`agency.integration.conscious-presenter` is the *sole* producer of
visible text per turn
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
At the outermost layer the plan does enforce exactly one owner per
output.

---

## What the implementation does not yet take into account

### A — Locking is single-layer, not stacked

Minsky's claim is that locks live at *several levels*. The plan has
two clear locks — agency-level (`inhibits`) and turn-level
(settlement) — but no intermediate lock at the level of *individual
frame slots*. A polyneme in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
can in principle be written by more than one agency in the same
turn; nothing in the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
declares a slot to have a single owner at the moment of writing.

### B — Bistability is not represented

The settlement records the winning interpretation and *may* record
alternatives, but there is no first-class shape for an *unstable*
reading that the society explicitly holds open and flips between
across turns. The plan has no "ambiguous" flag on a settlement, no
record of "this decision is one of two", no mechanism for re-running
the same input and expecting a different lock.

### C — Per-feature competition is implicit

Idea 4 says frames compete *per region* for *each feature*. In the
plan, critics in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
challenge whole candidate actions, not individual slot fills. There
is no protocol for two agencies to *claim the same polyneme slot* and
have the settlement decide between them slot by slot.

### D — Suppression is not logged

When the cube flips, the previous reading is suppressed; Minsky
would say it is still there, just unselected. The plan's settlement
records the winning candidate
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
and may record objections, but a *suppressed-but-live* reading — one
that could win next turn without re-derivation — has no place in the
state schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).

---

## Summary table

| # | Idea | In the plan? | Where/why not |
| --- | --- | --- | --- |
| 1 | Mutual exclusion as structure | Partial | Settlement and `inhibits` give turn- and agency-level locks; slot-level lock missing (gap A). |
| 2 | Locks are layered | Partial | Two layers exist; the per-slot middle layer does not (gap A). |
| 3 | Bistability, not indecision | No | No representation of a held-open ambiguous reading (gap B). |
| 4 | Per-feature competition | No | Critics challenge whole candidates, not slot fills (gap C). |
| 5 | One owner per part at a time | Partial | True at agency and turn scope; not declared at slot scope (gaps A, D). |

---

## Implication for the plan (no changes proposed here)

§25.1 says the mind locks. The plan locks at two scopes — the
agency and the turn — and that is enough to honour Minsky's
foundational move. The unbuilt scope is the middle one: per-slot
ownership and the explicit representation of a held-but-not-chosen
reading. Closing those gaps would touch the handoff and polyneme
shapes in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
and the state schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).
These are recorded as analysis only, and any move to close them
falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
