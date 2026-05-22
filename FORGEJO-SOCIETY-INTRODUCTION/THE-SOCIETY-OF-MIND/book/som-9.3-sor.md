# Section 9.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-9.3.md](som-9.3.md) — *Learning from
failure* (Minsky, §9.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§9.3 argues that learning is asymmetric. A working method *M* should
not be edited, because the edit risks every other skill that depends
on *M*. The safer move is to attach *censors* and *suppressors* that
remember the circumstances of past failure and inhibit *M* when
those circumstances recur. Such censors do not say what to do —
only what not to do. Minsky observes that this negative learning
accumulates as taboos and prohibitions of which the mind is unaware,
and that imperfect rules are unavoidable outside the closed
universes of arithmetic and logic.

---

## The ideas Section 9.3 actually carries

1. **Working methods should not be edited.** Editing *M* risks
   every skill that depends on *M*.
2. **Failure is the richer signal.** Learning mostly from
   success protects what already works but improves it little.
3. **Censors and suppressors are the right shape for negative
   learning.** They wrap *M* without altering it.
4. **Negative learning specifies circumstances, not actions.**
   A censor records "do not run *M* when …", not "do *N*
   instead".
5. **Censors can prohibit thoughts as well as actions.** A
   suppressor can mark a line of reasoning as one not to follow.
6. **Negative learning accumulates as taboos.** The mind ends up
   surrounded by prohibitions of which it has no inventory.
7. **Real-world rules are imperfect by construction.** Outside
   formal mathematics, the only honest move is to begin with
   rough rules and learn where they fail.
8. **Substantial change is uncomfortable.** Learning that
   reaches the structure of methods cannot be made painless.

---

## What the implementation already absorbs

### Censors and suppressors as named, first-class shapes (ideas 3, 4)

The censor family is defined as a top-level kind in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
with its own phase in the cycle
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md):
*criticize → censor → settle*) and its own signal type in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md).
A censor inhibits an action without claiming to know the right
action — exactly Minsky's shape.

### Wrapping rather than editing (idea 1)

Manifests are immutable until passed through the gated
`self-modification` frame
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
A failed cycle does *not* automatically rewrite an agency's
prompt. The safe default — leave *M* alone, attach a censor —
matches the discipline §9.3 asks for.

### Censoring thoughts, not only actions (idea 5)

The censor phase fires *before* settlement, on candidate
proposals, not only on candidate actions
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
A line of reasoning can be inhibited before it ever becomes a
candidate for action. The signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
allows a censor to target a proposal, an agency, or a frame.

### Imperfect rules with a record of where they failed (ideas 7, in part)

The decisions log and episodic memory in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
store the circumstances of past cycles, including the ones that
aborted or were rolled back. The plan does not claim its policies
are perfect, and it preserves enough record to discover where they
were wrong.

---

## What the implementation does not yet take into account

### A — Censors are authored, not learned

Idea 3, taken seriously, requires a path from *observed failure*
to *new censor*. The plan ships censors authored by humans (the
first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and lets them be added through the gated `self-modification`
frame
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
It has no automatic loop that, on observing a failure mode in
the episodic record, *proposes* a new censor with a `restore_when`
matching the failed circumstance. Negative learning is possible
through the human-mediated path; it is not built in.

### B — No structured "circumstance of failure" record

Idea 4 — censors record circumstances — would benefit from a
schema slot like `triggering_circumstance:` on a censor manifest,
populated from the conditions of the cycle in which the failure
occurred. The censor schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
has `activates_on` (the firing condition) but no field that
*ties back* to the prior failed cycle that motivated it. A
censor's provenance is currently a git blame, not a manifest
field.

### C — No taboo inventory

Idea 6 — accumulated taboos that the mind has no inventory of
— is precisely the failure mode the plan should resist. It does
not yet have a *surface* for that resistance. There is no
`memory/taboos/` index, no derived "what this society currently
refuses to consider" view, no critic in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
that periodically reads the censor catalogue and reports its
shape. The data is on disk; the inventory is not.

### D — No principled distinction between "patch *M*" and "wrap *M*"

Idea 1 — do not edit working methods — is enforced operationally
(approval gate on `self-modification`) but is not encoded as a
*preference*. Nothing in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
or
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
states "the first response to a failure is a new censor, not an
edit to the failing agency". A reviewer faced with a failing
agency could equally well rewrite its prompt; the plan would
allow it. The Minsky preference order — wrap before patch — is
not policy.

### E — Failure-driven learning has no aggregation

Idea 2 — failure is the richer signal — would suggest aggregating
failures: a periodic pass over the episodic record that surfaces
recurring abort patterns. The reinforcement log in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
collects outcomes; no scheduled workflow step in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
reads it for *failure clusters*. This is the §1.1 gap D
(reinforcement-as-log) restated for the negative case.

### F — Discomfort of substantive change is unrepresented

Idea 8 — substantial change is uncomfortable — is mirrored in
the plan by the *cost* of the approval gate: real changes are
slow and require human attention. That is a structural form of
the same friction. But there is no internal *signal* that a
proposed change is structurally large versus cosmetic; the
approval gate fires the same way for both, and the plan has no
appraisal that says "this change touches a method many other
agencies depend on". The friction Minsky describes maps onto
human review time, not onto a recorded society-level signal.

---

## Summary table

| # | Idea from §9.3 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Working methods should not be edited | Partial | Enforced via approval gate; not stated as preference order (gap D). |
| 2 | Failure is the richer signal | No | No aggregation of failure clusters (gap E). |
| 3 | Censors / suppressors are the right shape | Yes | Censor family + censor phase + censor signals. |
| 4 | Negative learning specifies circumstances | Partial | `activates_on` exists; no `triggering_circumstance` provenance (gap B). |
| 5 | Censors can prohibit thoughts | Yes | Censor phase fires on proposals before settlement. |
| 6 | Negative learning accumulates as taboos | No | No taboo inventory, no derived view of refused considerations (gap C). |
| 7 | Real-world rules are imperfect | Yes | Decisions log + episodic memory preserve where policies misfired. |
| 8 | Substantial change is uncomfortable | Partial | Approval-gate cost mirrors the friction; no internal "structural change" signal (gap F). |

---

## Implication for the plan (no changes proposed here)

§9.3 is the section the implementation already comes closest to.
Censors are first-class, the cycle has a dedicated censor phase
before settlement, and the discipline of not editing working agencies
is enforced by the approval gate. The remaining work is at the edges:
turning censors from authored objects into ones that can also be
*proposed* by failure-driven aggregation, giving every censor a
provenance back to the failure that motivated it, and giving the
society a way to *see* the accumulated catalogue of refusals so that
the taboo Minsky warns about does not silently grow.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the censor and critic taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(`triggering_circumstance`, taboo-inventory critic, wrap-before-patch
preference),
the state and memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(`memory/taboos/`, failure-cluster index),
the workflow design in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
(a scheduled failure-aggregation step),
the policy and safety layer in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
(preference for wrapping over editing; structural-change signal),
and the credit-assignment and evolution protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
and
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
