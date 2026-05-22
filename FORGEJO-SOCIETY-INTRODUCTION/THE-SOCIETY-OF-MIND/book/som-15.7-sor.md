# Section 15.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.7.md](som-15.7.md) — *Memory
rearrangements* (Minsky, §15.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.7 walks through the simplest non-trivial use of memory:
swapping the positions of two objects in an imagined room. The
section makes two precise claims: that *manipulating
representations* requires explicit short-term memory-units
(M-1, M-2), and that those units must have the right *granularity*
to pick out the subject-sized parts of the current problem. It
ends by noting that scripts need self-interruption to call
sub-procedures.

---

## The ideas Section 15.7 actually carries

1. **Rearrangement requires representation.** To move things
   imagined, you must first represent how they are arranged.
2. **Manipulation needs explicit short-term memory-units.** Named
   buffers (M-1, M-2) that hold the *state* of an agency.
3. **Swap is a four-step script.** Store A, store B, restore B
   into A's slot, restore A into B's slot.
4. **Memory-control scripts are real.** Step-by-step recipes that
   read and write memory-units in sequence.
5. **Granularity must match the problem.** M-1 and M-2 must be
   able to hold *couch-sized* fragments, not whole rooms.
6. **All rearrangements decompose to pairwise swaps.** Complex
   reshuffling reduces to two-at-a-time moves.
7. **Beginners use one-at-a-time; experts batch.** Skill is
   compressing many memory operations into one.
8. **Steps need condition sensors.** Each step must wait for the
   previous to complete.
9. **Scripts need self-interruption.** A script must be able to
   suspend itself to call other agencies or memories.

---

## What the implementation already absorbs

### Explicit state buffers exist (idea 2)

`state/mind/issues/<n>/` provides multiple named slots —
`percepts.jsonl`, `signals.jsonl`, `activation.jsonl`,
`workspace.md`, `blackboard.md`, `candidate-actions.jsonl`,
`objections.jsonl`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
— each held only for the current run. These are operational
analogues of M-1, M-2.

### Branches are a swap-and-compare device (ideas 1, 6)

The reality-model rule in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
makes `main` the believed world and each branch a candidate
future. A branch *is* a represented rearrangement of the world;
multiple branches under the same `society/<stimulus_id>/` namespace
allow comparing alternative reshufflings without committing
either to accepted reality.

### Scripts are real (ideas 3, 4)

The workflow phases themselves
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md);
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
are a script of memory-touching steps: normalize, perceive,
activate, deliberate, criticize, censor, settle, act, remember,
report. Each step reads from named state and writes to named
state, in sequence.

### Condition sensors exist between steps (idea 8)

Forgejo Actions jobs have explicit dependencies, and the
deliberation loop reads `state/.../signals.jsonl` written by
prior phases. A phase does not start until its predecessor's
artefacts exist. This is the operational form of "waiting for the
previous step to finish."

### Scripts can interrupt themselves (idea 9, partial)

The pipeline supports cron-triggered runs alongside event-driven
ones
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)),
and within a run the deliberate phase loops over agencies. An
agency can request a handoff to another agency
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
That is interruption in a loose sense.

---

## What the implementation does not yet take into account

### A — Memory-units that hold *agency state* are absent

Idea 2's M-1, M-2 are buffers that *hold the state of an agency*
— enough to restore it later. The plan's state slots hold *records
of what an agency did*. A K-line's `activation_snapshot` is the
closest match, but it is read-only and produced post-settlement,
not a within-run buffer that can store, swap, and restore.

### B — No primitive for "swap two representations"

Idea 3's four-step swap script has no operational counterpart.
The branch mechanism allows two candidate worlds but does not
expose a *swap* operation between agency states. A deliberation
that wanted to try "what if agency A's current position became
agency B's" would have no API for it.

### C — Granularity is not declared per-buffer

Idea 5's claim — that M-1 and M-2 must match the granularity of
*couch-sized* parts of the problem — has no schema counterpart.
State slots are typed by content (`signals.jsonl`,
`candidate-actions.jsonl`) but not by grain. There is no field
that says "this buffer holds object-sized state; that buffer
holds room-sized state."

### D — Pairwise decomposition is not enforced

Idea 6 is a strong constraint: complex reshuffling reduces to
pairwise swaps. The plan allows the patch-imaginer
(`agency.code.patch-imaginer` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
to draft a single diff that changes many things at once. There
is no rule that decomposes a multi-change diff into a sequence of
two-change diffs, with intermediate validation between each.

### E — Beginner-vs-expert script style has no setting

Idea 7 — beginners change one or two things at a time, experts
batch — would be operationalised as a per-agency or per-frame
*step-coarseness* setting. The plan has no such setting. Every
run is at the same step grain regardless of confidence.

### F — Self-interruption is coarse

Idea 9's self-interruption is finer than the plan's handoffs.
A within-step suspend ("hold this agency mid-deliberation, call
another, resume here") has no representation. The deliberate
phase loops over agencies but does not let an agency pause inside
its own response to ask another agency a question. Handoffs are
between-step.

### G — Script state is not first-class

Idea 4's *memory-control script* is itself a thing — it can be
paused, inspected, named, and reused. The plan's pipeline is
hard-coded in the workflow YAML; it cannot be lifted out as a
data object that a meta-agency could rewrite. The script *runs*
the society but is not *in* the society.

---

## Summary table

| # | Idea from §15.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Rearrangement requires representation | Yes | Branches as candidate futures. |
| 2 | Explicit short-term memory-units | Partial | State slots hold records, not agency state (gap A). |
| 3 | Swap as a four-step script | No | No swap primitive (gap B). |
| 4 | Memory-control scripts are real | Partial | Workflow phases yes; script-as-data no (gap G). |
| 5 | Granularity must match problem | No | No grain field on buffers (gap C). |
| 6 | All rearrangements decompose to pairwise | No | Diffs can be arbitrarily complex (gap D). |
| 7 | Beginner small steps, expert batches | No | No step-coarseness setting (gap E). |
| 8 | Steps need condition sensors | Yes | Job dependencies; artefact-presence. |
| 9 | Scripts need self-interruption | Partial | Handoffs between steps; no mid-step suspend (gap F). |

---

## Implication for the plan (no changes proposed here)

§15.7 is the chapter's least-glamorous section and its most
operational. It says: thinking is *scripted state manipulation* on
named buffers of the right grain. The plan has named buffers and
scripted phases but lacks the *intra-step* memory machinery
Minsky describes — buffers that hold agency state (gap A), swap
primitives (gap B), grain declarations (gap C), and mid-step
suspension (gap F). The most consequential single opportunity is
gap A, because a per-run "agency-state buffer" would unlock the
rest: with such buffers, swap becomes definable, granularity
becomes a real field on them, and self-interruption becomes "save
to a buffer, return later." Closing this would touch
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(state slots and lifetimes),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(handoff semantics extended to mid-step suspend), and
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(agency manifests for buffer ownership). These are recorded here
as analysis, not as a change request. Any move to close them
falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
