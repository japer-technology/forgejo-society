# Section 14.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-14.7.md](som-14.7.md) — *The power of negative thinking*
(Minsky, §14.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§14.7 builds the Move agency: four subagents (Move-Left, -Right, -Up,
-Down), each inhibited by the corresponding obstacle. A complete trap
is the conjunction of inhibitions. The chapter's deeper move is
*pessimistic comparison*: assume the impossible state, then notice
where actuality fails to match it — and that mismatch is the
escape. Negative thinking is a working method, not a mood.

---

## The ideas Section 14.7 actually carries

1. **Geometry alone is not enough; movement is also a kind.** The
   trap is a property of motion, not of shape.
2. **Move is a hierarchical agency.** A top-level Move with
   directional subagents is the simplest working architecture.
3. **Obstacles inhibit, they do not destroy.** Each box-frame agent
   *inhibits* its corresponding Move subagent; absence of an
   obstacle leaves the subagent free.
4. **The conjunction of inhibitions is the trap.** All four
   inhibitions firing leaves Move itself in a can't-move state.
   Trap is the AND of obstacles.
5. **Pessimistic comparison is a positive method.** Compare not
   "what I have vs. what I want" but "what I have vs. the worst
   case" — the mismatch is the opening.
6. **Optimistic and pessimistic strategies are complementary.**
   Optimism when several ways are visible; pessimism when none are.
   The choice is conditional, not temperamental.

---

## What the implementation already absorbs

### Inhibition as a manifest field (ideas 2, 3)

Every agency manifest in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
carries an `inhibits` field listing the agencies it suppresses
when it activates. This is precisely the wiring §14.7 draws between
box-frame agents and Move subagents. The substrate exists at schema
level.

### Conjunctive refusal is the no-op state (idea 4)

When every candidate action is refused by some critic or censor,
the settlement layer
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
produces no `act` step in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md).
The society's "can't-move" state is the empty post-censor candidate
set. The structural analogue of Minsky's trap exists.

### Hierarchical agencies (idea 2)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
admits parent-and-children compositions
(`agency.integration.conscious-presenter` orchestrates several
sub-agencies). Move-with-subagents is expressible.

---

## What the implementation does not yet take into account

### A — Negative thinking is not a named strategy

Idea 5 — assume the impossible, then look for mismatch — has no
phase, no critic, no protocol. The pipeline has perceive →
activate → deliberate → criticize → censor → settle. There is no
*posit-failure* step in which the society constructs the worst-case
state and uses the difference between it and reality as a source
of candidate moves.

### B — Optimistic vs. pessimistic is not a switch

Idea 6 — that the choice of strategy is conditional on whether any
ways are visible — has no representation. The plan has one
deliberation mode (propose candidates). It does not have an
alternate mode that activates *only when zero candidates survive*,
and which would construct candidates by negative comparison
against a worst-case template.

### C — The "imagine the worst case" template is not stored

Negative thinking needs templates of impossible states to compare
against. The plan has no library of such templates: no
`frame.impossible.contained`, no
`frame.impossible.consensus-deadlock`. K-lines
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
restore *prior* states; they do not store *negative ideal* states.

### D — Mismatch as an information source is not exploited

Once a worst-case template exists, the move is to read the
differences. The handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
has no `mismatch_with_template` slot. The plan does not currently
treat "the world does not look like the worst case here" as
information.

### E — Inhibition is recorded but not visualised

The `inhibits` field exists (idea 3) but the plan does not produce
the per-tick *inhibition graph* that would let a critic ask "are
all four Move subagents inhibited?" The data is there; the
aggregation is not.

---

## Summary table

| # | Idea from §14.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Geometry + movement together | Partial | Risks slot has goal-direction; not an explicit motion model. |
| 2 | Hierarchical Move agency | Yes | Composed agencies are supported. |
| 3 | Obstacles inhibit, not destroy | Yes | `inhibits` field in manifest. |
| 4 | Conjunction of inhibitions = trap | Yes | Empty post-censor set. |
| 5 | Pessimistic comparison as method | No | No posit-failure phase (gap A). |
| 6 | Optimistic/pessimistic complementary | No | Single deliberation mode (gap B). |

---

## Implication for the plan (no changes proposed here)

§14.7 is the operational climax of Chapter 14. It shows that the
*absence* of an expected inhibition is information, and that a
society that knows how to construct impossible states gains a
second strategy when its first is exhausted. The implementation has
the inhibition substrate (strong) and the conjunctive-refusal state
(strong) but lacks every part of the negative-thinking machinery:
no posit-failure phase, no impossible-state templates, no
mismatch-reading. The biggest gap is A: an alternate deliberation
mode that fires only when the candidate set is empty.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the frame inventory in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
