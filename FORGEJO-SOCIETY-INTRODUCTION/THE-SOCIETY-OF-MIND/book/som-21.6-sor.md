# Section 21.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-21.6.md](som-21.6.md) — *Trans-frame pronomes*
(Minsky, §21.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§21.6 enlarges the Trans-frame from four pronomes (Origin,
Destination, Difference, Trajectory) to a constellation including
Actors, Recipients, Vehicles, Goals, Obstacles, Instruments. The
Investment principle is offered as the reason for adopting any
standard at all: without reusable representations, no powerful skills
ever grow.

---

## The ideas Section 21.6 actually carries

1. **A small set of pronomes is not enough.** Real action has roles
   for who, with what, why, against what, by what means.
2. **Bridgelike frames matter.** The Trajectory pronome connects
   structures to functions; without it, what-a-thing-is and
   what-it-does cannot meet.
3. **A few standard schemes must exist.** The Investment principle:
   skills accumulate only on top of stable representations.
4. **Standardisation is what makes transfer possible.** Any chainable
   reasoning depends on consistent connection points.

---

## What the implementation already absorbs

- **The settlement schema is a wide standard.**
  [`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
  fixes a large set of fields — `proposals`, `critics`, `censors`,
  `action_authorised`, `reality_revision`, `memory_updates`, `linked`
  — that recur across every decision. This *is* the Investment
  principle in operational form.
- **Manifest schema as standard.**
  [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
  gives every agent the same frontmatter shape, so skills written
  against one agent transfer to others.
- **Frame catalogue is reused.** The same frame can recur over many
  stimuli; the cost of designing it amortises over many runs.

## What the implementation does not yet take into account

### A — The pronome constellation is not represented

There is no Actor / Recipient / Vehicle / Goal / Obstacle /
Instrument vocabulary anywhere. Settlements record `proposals` and
`action_authorised`, but the *why* (Goal) and the *against what*
(Obstacle) are only present implicitly in prose. There is no
`obstacles:` slot or `goal:` slot on any schema.

### B — No Trajectory bridging structure to function

The plan describes *what* changes (diff summary, reality_revision)
and *what was decided* (settlement), but not the *trajectory* from
one to the other as a first-class object. A reviewer can reconstruct
the trajectory by reading the JSONL traces but cannot query a
trajectory slot.

### C — Goals are not first-class on agencies

Agencies declare `activates_on`, `outputs`, `authority`, `budget`,
but no `goal:` field. The closest analogue, `governance/self-ideals.md`,
operates at society level
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)),
not at agency level. The same gap appears in §1.1's Intention
question (gap E in that analysis).

### D — Instruments are not declared

A `code-change` settlement uses tools — repository commands, model
calls — recorded in `tool_usage` on the handoff
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
But there is no *Instrument* pronome saying *this candidate action
is to be carried out by this tool*. The instrument is implicit in
the action kind.

---

## Summary table

| # | Idea from §21.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Wide pronome constellation | No | No Actor/Recipient/Vehicle/Goal/Obstacle/Instrument vocabulary (gap A). |
| 2 | Bridgelike trajectory | Partial | Reconstructible from traces; no slot (gap B). |
| 3 | Standard schemes (Investment principle) | Yes | Settlement and manifest schemas are exactly this. |
| 4 | Standardisation enables transfer | Partial | Strong within record types; weak across role vocabulary (gap A). |

---

## Implication for the plan (no changes proposed here)

§21.6 reads, against the implementation, as a recommendation for a
small standard pronome registry — Actor, Recipient, Vehicle, Goal,
Obstacle, Instrument, Trajectory — that frames could draw from.
Closing this would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the representation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md).

Recorded here as analysis only. A pronome registry would be a new
governance primitive and falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
