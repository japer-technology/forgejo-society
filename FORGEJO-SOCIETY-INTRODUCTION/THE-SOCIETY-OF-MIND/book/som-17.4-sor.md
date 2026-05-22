# Section 17.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.4.md](som-17.4.md) — *Functional autonomy*
(Minsky, §17.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.4 makes a surprising claim: new *high-level* goals do not need to
be invented. They emerge as *subgoals* of ordinary problems, then
drift far enough from their origin that they become ends in
themselves. A goal to reach a cup becomes a goal to understand
physics.

---

## The ideas Section 17.4 actually carries

1. **New high-level goals are not constructed top-down.** They
   arise as subgoals of present problems.
2. **Subgoals can drift away from their parent goal.** Over time
   they become detached and self-sustaining.
3. **The drift is *functional autonomy*.** A subgoal becomes an
   end because it pays off across many parents.
4. **Knowledge-acquisition is the universal subgoal.** Whatever
   the parent goal, learning helps; therefore learning becomes its
   own pursuit.
5. **Origin does not determine value.** A noble investigation may
   have a mundane root; the root is irrelevant once the subgoal is
   autonomous.

---

## What the implementation already absorbs

### Subgoaling exists as a structural move (idea 1)

The handoff schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
carries a `parent_settlement` reference; an agency can spawn work
that the workflow tracks back to its originating task. The
`agency.assembly.*` family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
composes lower outputs into higher ones. Subgoaling-as-mechanism is
present.

### Reusable utility primitives (idea 4, partial)

The cartographer, the evidence-gatherer, and other perception/memory
agencies
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
are *cross-task* helpers. They are activated by many different
stimuli precisely because gathering context helps regardless of the
parent goal. Minsky's "knowledge is power" appears here as
"perception agencies are universal helpers."

### Memory of what worked across tasks (idea 3)

K-lines
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
record which configurations have paid off, indexed by
`restore_when`. Over many settlements, configurations that pay off
broadly accumulate high reactivation counts. The substrate for
detecting functional autonomy *empirically* exists.

---

## What the implementation does not yet take into account

### A — No promotion of a subgoal to a standing goal

A K-line that fires across many parents is *reused* but not
*promoted*. The plan has no step where the meta-admin family says
"this configuration has served twelve different parents; register
its target as a standing goal of the society." Subgoals stay
subgoals; functional autonomy is not detected as a phase change.

### B — No standing-goal record at the agency level

Continuing §1.1 gap E (no primitive for "wanting"), the manifest
schema
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has `activates_on` and `outputs` but no `pursues` field. An agency
cannot declare "my long-running goal is to improve coverage of
unknowns"; it can only act when triggered.

### C — Drift from origin is not measured

Idea 2 requires a way to see that today's invocation of a capability
is far from its originating problem. The plan tracks
`parent_settlement` once, not transitively; the genealogical depth
from "first use" to "current use" of a capability is not surfaced.

### D — No second-order pursuit ("learning to learn")

Idea 4's strongest form is the *B-brain* move: pursue better ways
to learn. The plan has `meta-admin.*` agencies that govern the
society's own structure, but none that has the goal of *improving
the reinforcement loop itself*. With the reinforcement loop not yet
closed (§1.1 gap D), a learning-to-learn agency would have nothing
to act on.

### E — "Knowledge is power" is asserted in voice, not in budget

The voice rules ([AGENTS.md](../../../AGENTS.md)) discourage
hype about intelligence, and the plan invests heavily in memory.
But the *budget* discipline in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
does not privilege knowledge-acquisition steps over action steps.
A society under tight budget will cut perception before action,
which is the *opposite* of the autonomy Minsky describes.

---

## Summary table

| # | Idea from §17.4 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Subgoals as the source of high goals | Partial | Subgoaling exists; promotion to standing goal does not (gap A). |
| 2 | Subgoals drift from their parent | No | Genealogical depth not measured (gap C). |
| 3 | Functional autonomy | Partial | K-line reuse counts exist; phase change is not detected (gap A). |
| 4 | Knowledge as universal subgoal | Partial | Universal helpers exist; no second-order pursuit (gap D). |
| 5 | Origin does not determine value | Partial | Memory keeps origin; budget does not protect autonomous subgoals (gap E). |
| — | Standing goal at the agency level | No | No `pursues` field (gap B). |

---

## Implication for the plan (no changes proposed here)

§17.4 is the chapter's *optimistic* moment: it removes the burden of
designing high-level goals. The plan is well-positioned to host this
mechanism — K-line reuse counts, parent-settlement edges, and the
meta-admin family are all present — but the *promotion* step (from
"recurring subgoal" to "standing goal") is not yet a workflow phase.
Closing this would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(adding `pursues`), the K-line shape in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
