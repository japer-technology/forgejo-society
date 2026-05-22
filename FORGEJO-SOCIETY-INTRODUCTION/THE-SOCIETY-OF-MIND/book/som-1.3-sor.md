# Section 1.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-1.3.md](som-1.3.md) — *The society of mind*
(Minsky, §1.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§1.3 introduces the tea-cup tableau: many small specialists
(Grasping, Balancing, Thirst, Moving) cooperate without consulting
one another, each ignorant of the others' concerns, and a useful
behaviour emerges from their *parallel non-interaction*. The
section's load-bearing move is to make non-interference, not
coordination, the default. It closes by promising the
children's-blocks microcosm: study the smallest possible case to
see the parts.

---

## The ideas Section 1.3 actually carries

Pulled from Minsky's text:

1. **The "you" is a composite.** The pronoun names a society, not a
   homunculus.
2. **Many specialists run in parallel.** Grasping, Balancing,
   Thirst, Moving — each doing only its own narrow job.
3. **Mutual ignorance is normal and useful.** Balance does not
   know about Grasp; Grasp does not know about Thirst. The
   specialists succeed *because* they do not interrupt one another.
4. **Coordination is by environment, not by command.** Tea gets
   drunk because each agent reacts to its own local conditions, not
   because a central planner orchestrates them.
5. **Quantitative humility.** A hundred processes shape the
   wrist; a thousand muscle systems walk the body. The right unit
   of count is "many", not "a few named modules".
6. **Quick decisions belong at the bottom.** Stumble-recovery does
   not consult the conscious narrator; it is decided by local
   agents talking to neighbours.
7. **Talk is the same shape as walk.** The agents that *choose
   words*, *arrange phrases*, *track audience* are of the same
   order as the agents that move muscles. There is no privileged
   "high-level" stratum.
8. **Microcosm methodology.** The next sections will study a
   single tiny case (blocks) the way Galileo studied pendulums.
   "In science, one can learn the most by studying what seems the
   least."

---

## What the implementation already absorbs

### "You" as a composite (idea 1)

The plan never treats the society as a single mind. The conscious
narrator (`agency.integration.conscious-presenter` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is one *role*, not the *whole*. The settlement
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
is the record of many partial signals collapsing to one decision,
not the decision of a unitary self.

### Many specialists, narrow jobs (ideas 2, 5)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(perception, memory, code, safety, identity, integration, assembly,
meta-admin) and the first-ship catalogue are an explicit refusal of
the "a few big modules" shortcut. Each agency has its own `activates_on`
and `outputs`; the unit of work is small.

### Coordination by environment (idea 4)

The plan uses a *blackboard* pattern
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)):
agencies write signals, other agencies' `activates_on` clauses
trigger from those signals. There is no central scheduler dispatching
work imperatively. The runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
sequences *phases*, not *agents within a phase*.

### Quick decisions at the bottom (idea 6)

Censors in the `censor` phase
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
can veto without consulting the narrator. Safety agencies
(`agency.safety.*`) carry blast-radius checks that fire before any
proposed act is settled. The conscious bottleneck is reserved for
*report*, not for *reflex*.

### Microcosm methodology (idea 8)

The plan itself is a microcosm: a single Forgejo society on a
single host, with a single first-ship catalogue, deliberately small.
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
is the "study the simplest case" discipline made operational.

---

## What the implementation does not yet take into account

### A — Mutual ignorance is not enforced

Idea 3 is the section's sharpest claim: agents *should not* know
about each other's concerns. The plan permits broad reads of the
blackboard; nothing in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
or the manifest schema constrains an agency to consume only the
signals it *needs*. There is no declared "field of view" per agency,
no rule that catches an agency widening its inputs over time. Minsky's
non-interference is achieved by accident, not by design.

### B — Parallelism is sequenced

Idea 2 calls for genuine parallel operation. The runtime in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is a *sequence* of phases (perceive → activate → deliberate →
criticize → censor → settle → act → remember → report). Within a
phase, multiple agencies can run, but the phase boundary is a
synchronisation barrier. The tea-cup tableau has no such barriers.
This is a sound engineering choice for an auditable workflow, but
it is a *departure* from §1.3, and it is not marked as one.

### C — No "many small" pressure on the catalogue

Idea 5 (the right unit is "many") is not enforced by any policy.
Nothing in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
or [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
discourages monolithic agencies. A future maintainer could grow the
catalogue toward a few large agencies without violating any written
rule. The differentiation-broker exists to *split* an agency, but
nothing measures whether the catalogue is drifting back toward
fewness.

### D — Reflexes have no separate phase

Idea 6 (quick decisions at the bottom) is partially absorbed by
censors, but the plan has no *reflex tier* that runs ahead of the
main loop with a smaller budget and a shorter handoff. Stumble-
recovery, in Minsky's image, does not wait for `deliberate`.
Everything in the current pipeline does.

### E — No premise that "talk and walk are the same shape"

Idea 7 deserves recording because it forbids a tempting bug: making
language agencies a privileged stratum. The plan does not commit
this bug — `agency.integration.conscious-presenter` is one agency
among many — but it also does not *state the prohibition*. A new
contributor could plausibly introduce a "high-level reasoning"
family without realising §1.3 forbids it.

---

## Summary table

| # | Idea from §1.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | "You" is a composite | Yes | Settlement layer; narrator is one role. |
| 2 | Many specialists run in parallel | Partial | Many specialists, yes; true parallelism, no (gap B). |
| 3 | Mutual ignorance is the default | No | No declared "field of view" per agency (gap A). |
| 4 | Coordination by environment | Yes | Blackboard + `activates_on` in handoff schemas. |
| 5 | Quantitative humility ("many") | Partial | First-ship catalogue is small; no pressure against monoliths (gap C). |
| 6 | Quick decisions at the bottom | Partial | Censors are early; no reflex tier (gap D). |
| 7 | Talk and walk are the same shape | Partial | Honoured in practice; not stated as a rule (gap E). |
| 8 | Microcosm methodology | Yes | Single host, single society, bootstrap checklist. |

---

## Implication for the plan (no changes proposed here)

§1.3 is the section that justifies the *shape* of the runtime: many
small, narrow, mutually ignorant agents, coordinating by signals on
a shared environment, with the loud cases punted to a narrator and
the quick ones handled at the bottom. The plan reproduces most of
this shape and contradicts none of it. The substantive gap is A
(no declared field of view) and the structural departure is B
(sequenced phases instead of free parallel). Both are defensible —
field-of-view declarations add manifest complexity, and phase
synchronisation is what makes the workflow auditable — but neither
is *named* as a departure from Minsky.

Closing any of A–E would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
or the policy set in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
