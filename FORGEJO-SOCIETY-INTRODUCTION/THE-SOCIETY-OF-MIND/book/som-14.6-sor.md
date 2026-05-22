# Section 14.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-14.6.md](som-14.6.md) — *Parts and holes*
(Minsky, §14.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§14.6 reformulates the *box* as a goal-bearing machine: an obstacle
is whatever blocks motion in a direction, and being trapped is
being unable to move in any acceptable direction. The chapter argues
that the felt sense of being trapped is *conspiratorial* — each
obstacle is more effective because of the others — and proposes
the container concept as a cross-realm primitive built from a
closed *set of all possible directions*.

---

## The ideas Section 14.6 actually carries

1. **An obstacle is goal-relative.** An object is an obstacle only
   with respect to a direction we want to move.
2. **Trap = exhaustion of acceptable directions.** Being trapped is
   not "blocked in one direction" but "blocked in every direction
   we would accept."
3. **The trap is a conspiracy of obstacles.** No single obstacle
   does it; the trap is the joint property of the set.
4. **Acceptability is itself a parameter.** "Forward and backward
   are unacceptable" is a stipulation, not a fact about the box.
5. **The container concept is cross-realm.** "All possible
   directions" is one of the great cross-realm correspondences,
   useful far beyond physical space.
6. **A container is built from a closed set of escape directions.**
   The two-dimensional rectangle is the minimal working model: the
   set is finite and the conjunction of blocks gives enclosure.

---

## What the implementation already absorbs

### Obstacles are goal-relative (idea 1)

The handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
includes `risks` and `failure_modes`, which are structurally
goal-relative: a risk is only a risk against a stated `intent` or
`expected_outcome`. The plan does not name obstacles in
free-standing prose; it names them as failure-modes of a plan.

### Joint blocking has a place (ideas 2, 3)

The settlement protocol
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
combines objections from multiple critics into a single record. In
practice, the joint refusal of several critics is the operational
form of a trap: when every candidate fails some critic, the society
cannot act. The structure for "conspiracy of obstacles" exists,
even if it is not called that.

### Censor phase encodes acceptability (idea 4)

The censor phase
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
maintains the set of unacceptable directions — actions outside the
authority envelope, actions that would cross compliance boundaries.
"What counts as an acceptable direction" is a policy file, not a
guess.

---

## What the implementation does not yet take into account

### A — No primitive for "set of acceptable next moves"

Idea 2 wants the society to know its current set of acceptable
candidate actions and to detect when that set is empty. The plan
has candidate actions and censors, but no explicit *enumeration*
step that says "here are all the directions we considered, here is
the subset that survived." Without enumeration, the trap-state is
visible only by absence of action, not as a recognised condition.

### B — Conspiracy of objections is not recognised as a pattern

Idea 3 — that a trap is the *joint* effect of obstacles — has no
critic. There is no `critic.trap` that asks "are all current
candidates being refused by *different* objections, in a way that
suggests no single fix would help?" The settlement records the
objections; it does not pattern-match across them.

### C — Container is not a frame schema

Idea 5 names the container as a cross-realm primitive. There is no
frame in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
called `frame.container` (or similar) that an agency could
instantiate when reasoning about scope, enclosure, jurisdiction,
sandbox, blast-radius — all the non-physical containers the
society has to think about. The cross-realm primitive is missing.

### D — Acceptability set is not introspectable

Idea 4 — that "acceptable direction" is itself a parameter — is
encoded in policy files but is not exposed to deliberation. An
agency cannot ask "if we relaxed *this* censor for this one case,
what becomes possible?" without invoking the human authority level.
The acceptability set is binary at runtime, not a parameter the
society can reason *about*.

### E — Closed-set escape reasoning is not formalised

Idea 6 (the closed set of escape directions) is exactly the move
§14.7 will use to construct the *can't-move* state. The plan does
not yet pre-compute the closed set of moves a candidate has, and so
the §14.7 move (compare against an impossible state to spot the
opening) is currently unavailable.

---

## Summary table

| # | Idea from §14.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Obstacles are goal-relative | Yes | `risks` / `failure_modes` in handoffs. |
| 2 | Trap = no acceptable direction | Partial | Visible by absence; not enumerated (gap A). |
| 3 | Trap is a conspiracy | Partial | Settlement records objections; no joint critic (gap B). |
| 4 | Acceptability is a parameter | Partial | Policy-encoded; not introspectable (gap D). |
| 5 | Container as cross-realm primitive | No | No `frame.container` schema (gap C). |
| 6 | Closed set of escape directions | No | Not pre-computed (gap E). |

---

## Implication for the plan (no changes proposed here)

§14.6 is the first half of a two-part argument the chapter
completes in §14.7. It asks the implementation to represent a
container as a closed set of acceptable directions and a trap as
the exhaustion of that set. The plan has goal-relative obstacles
(strong) and joint refusal (in the settlement) but lacks both the
container schema and the enumeration that would make trap-detection
a positive event rather than an absence. The biggest gap is C:
container as a named, cross-realm frame; the next is A: the
acceptable-set enumeration that the §14.7 reasoning will require.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the frame inventory in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the critic family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
