# Section 15.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.9.md](som-15.9.md) — *Interruption and
recovery* (Minsky, §15.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.9 stresses the practical problem behind §15.7: when one
agency calls another, and especially when an agency interrupts
*itself*, something must keep track of where to return. The
section contrasts the high-level story we can tell ("I was
thinking about packing the suitcase") with the actual machinery
that would have to be described (micromemory-units, scripts,
restore steps) — and notes that the levels are too far apart for
short-term memory to carry both at once.

---

## The ideas Section 15.9 actually carries

1. **Calls require return-state.** When agency A calls agency B,
   A must save what it was doing until B finishes.
2. **Self-interruption needs return-state too.** An agency that
   interrupts itself faces the same problem with no helper.
3. **Returning to "the beginning" causes loops.** Resumption must
   return to the *point of interruption*, not the start.
4. **High-level narration is real.** "I was thinking about packing
   that suitcase…" is a true account.
5. **High-level narration is shallow.** It says nothing of how the
   thinking was done.
6. **Process-level description is many levels away.** Speaking of
   micromemory-units and scripts would require their own language.
7. **Overload prevents combined description.** Solving and
   describing the solving cannot share short-term memory.

---

## What the implementation already absorbs

### Calls produce return-state via handoffs (idea 1)

`schemas/handoff.schema.json`
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
defines explicit handoff records between agencies. The handoff
carries enough information for the receiving agency to act and
for the workflow to trace back. The deliberate phase's loop reads
these to know what to dispatch next
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).

### Returning is to *settlement*, not the start (idea 3)

A handoff that produces a result does not restart the deliberate
loop; the new contribution joins the blackboard and the loop
proceeds toward settlement
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md);
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The plan does not loop back to perception when an agency finishes
its sub-task.

### High-level narration is the presenter's job (ideas 4, 5)

`agency.integration.conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
composes one coherent response from the settled blackboard
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The user-facing text is high-level by design. The presenter does
not narrate `signals.jsonl` row by row.

### Process-level description is reachable but separate (idea 6)

`state/mind/issues/<n>/` is the full trace: percepts, signals,
activation, candidate actions, objections, final
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
A reviewer who wants the Minsky-style description can read the
JSONL trace; it lives at a different "level" from the visible
response and is not interleaved with it.

### Solving and describing do not share the same channel (idea 7)

The presenter writes once at the end, after the work has settled.
Critics and agencies write structured records during the run, but
none narrates in the user-facing voice mid-deliberation. The
solving channel and the describing channel are separate.

---

## What the implementation does not yet take into account

### A — Self-interruption is not a primitive

Idea 2 — an agency interrupting *itself* — is precisely the case
the plan does not support. Handoffs are between agencies; there
is no "save my own state, work on a sub-problem, restore" within
a single agency's turn
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The patch-imaginer that needs to consider a sub-patch must either
do it inside the same response (no save) or hand off to another
agency (different scope).

### B — Return-state is implicit in the pipeline, not in the
agency

Idea 1's "save what A was doing" is, in the plan, "the workflow
job exits and the next phase reads the artefacts." The return-
state belongs to the *pipeline*, not to the agency. An agency
cannot store a private "I was here" marker that survives across
a handoff and lets it resume mid-thought when its result returns.

### C — Stacks of interrupted work are not modelled

A second-level interruption (A calls B, then B calls C) is
representable in the artefact chain but there is no *stack
discipline* enforced. Two agencies could each issue a handoff
that the receiver processes in a different order than the senders
expected, and nothing in the schema asserts last-in-first-out
resumption.

### D — Process-level descriptions are not auto-generated

Idea 6 — that a true description would have to name micromemory-
units and scripts — implies that *if* such description were
desired, the plan could produce it. Today it cannot. The pipeline
is one fixed YAML script; there is no per-run *trace report* that
re-narrates the run in process terms. The trace exists; the
re-narration is not produced.

### E — No "speaker would overload" gate

Idea 7's overload claim implies the presenter should refuse to
produce both a solving response and a detailed process narration
at once. The plan has no such gate. A request to "explain what
you just did" could in principle force the presenter to generate
both, with no rule that says "produce a summary; defer the
detailed trace to the run artefacts."

### F — Loops are blocked by structure, not by detection

Idea 3's loop worry is real. The plan avoids loops by not
re-running phases — the workflow YAML proceeds forward
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)).
But there is no within-deliberate loop detector that says "this
agency keeps producing the same signal; suspend it." Two
agencies that pass control back and forth via handoffs could
oscillate up to the budget cap.

### G — The two levels are not linked

Idea 6's separation between "I was packing the suitcase" and
"micromemory-unit X was loaded into Packer" is honoured by the
plan (presenter vs trace), but the two are not *linked*. The
visible response does not carry a "process-level account at
<artefact-link>" pointer. The reviewer who wants the second
account must know to read `state/.../` directly.

---

## Summary table

| # | Idea from §15.9 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Calls require return-state | Partial | Pipeline holds return-state; agency does not (gap B). |
| 2 | Self-interruption needs the same | No | No within-agency suspend (gap A). |
| 3 | Resumption goes to interruption point | Partial | Forward-only pipeline; no in-deliberate loop guard (gap F). |
| 4 | High-level narration is real | Yes | Presenter response. |
| 5 | High-level narration is shallow | Yes | Presenter does not narrate row-by-row. |
| 6 | Process-level description many levels away | Partial | Trace exists; not re-narrated (gap D); not linked (gap G). |
| 7 | Overload prevents combined description | No | No solver-vs-narrator gate (gap E). |
| — | Stack discipline on nested interruptions | No | No enforced LIFO (gap C). |

---

## Implication for the plan (no changes proposed here)

§15.9 is the *control-flow* section of memory. The plan handles
the easy cases — between-agency calls have return-state via the
pipeline, presenter narration is high-level by design — but
struggles with the harder ones: self-interruption (gap A),
within-agency return-state (gap B), stack discipline (gap C),
loop detection (gap F). The most consequential single opportunity
is gap A, because self-interruption is the canonical case Minsky
uses to motivate short-term memory, and without it the plan's
K-lines and state buffers cannot match the *recovery* behaviour
the section describes. The most user-visible opportunity is gap G
— linking the presenter's response to its process-level trace —
because it costs almost nothing structurally and would make every
visible response auditable. Closing any of these would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(suspend / resume primitives),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(agency-internal state ownership), and
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
(within-phase loop guards). These are recorded here as analysis,
not as a change request. Any move to close them falls under the
"stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
