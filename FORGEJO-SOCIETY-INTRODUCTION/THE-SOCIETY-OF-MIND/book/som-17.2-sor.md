# Section 17.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.2.md](som-17.2.md) — *Attachment-learning*
(Minsky, §17.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.2 names *three* learning modes, distinguished by which agents the
training signal modifies. Whose reproach reached the learner decides
*what kind of change* the learner makes — method, situation, or goal.

---

## The ideas Section 17.2 actually carries

1. **The source of the signal selects the kind of learning.** Who
   delivers the reproach matters as much as the reproach itself.
2. **Three learning modes, not one.**
   - *Success/failure*: modifies the methods used to reach a goal.
   - *Fear-provoking*: modifies the description of the situation.
   - *Attachment-related*: modifies which goals are pursued at all.
3. **Attachment switches the routing of learning.** Trusted-source
   feedback changes goals, not methods.
4. **Means and ends are learned by different machinery.** Method
   change and goal change are not points on a continuum.

---

## What the implementation already absorpbs

### Outcome-based method change (idea 2, mode 1)

`evolution/reinforcement-log.md` and the failure-memory class in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
record success and failure per settlement. The retrospect critics
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
attribute outcome to contributing agencies. The intent — modify the
*method* in response to outcome — is named, even if the change is
not yet applied automatically (see §1.1's gap D).

### Source-attributed signals (idea 1, partial)

Settlement records carry `participants` and the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
preserves the originator of each signal. The plan can therefore tell
"this objection came from `censor.cloud-egress`" vs "this objection
came from the human approver." Source attribution exists; routing on
source does not (see gap A).

### A privileged human source (idea 3, in one mode)

The `human` authority level
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
is the plan's only formal recognition that some feedback comes from a
qualitatively different source. The approval-gate
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
treats human input as decisive, not merely as another signal.

---

## What the implementation does not yet take into account

### A — Source does not yet select learning mode

A failure from `critic.evidence` and a refusal from the human approver
are recorded in the same `objections` array
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
and consumed by the same retrospect pass. The plan does not branch
"this signal came from the human-as-attachment; therefore modify the
*goal set*, not the *method*."

### B — Situation-modifying learning is not represented

Minsky's middle mode — fear-provoking signals that *modify the
description of the situation* — has no obvious counterpart. Frames
and polynemes can be added
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
but no critic or censor outcome triggers "rewrite how this kind of
stimulus is described." Situation-frames are static given a
stimulus class.

### C — Goal-modifying learning is not a primitive

The plan has agency `outputs` and family taxonomies, but no field
that says "this agency's *goal set* may be amended by signal of type
T from source S." `agency.identity.*` and
`governance/self-ideals.md` carry the society's goals, but those
files are edited by humans through pull requests, not adjusted by an
in-loop attachment-learning mode.

### D — No "attached source" registry

The plan has the `human` authority level but does not enumerate which
specific humans (or which other societies in a federation) count as
*attached* — i.e., whose reproach should affect goals rather than
methods. The mechanism Minsky describes requires a small, named set;
the plan has only the generic role.

### E — Means and ends are not separated in retrospect

The retrospect agencies record what happened and what failed; they
do not separately update *method-state* (procedural memory) and
*goal-state* (self-ideals). A single learning pass treats both as
interchangeable corrections.

---

## Summary table

| # | Idea from §17.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Source selects learning kind | Partial | Source is attributed; routing on source is not (gap A). |
| 2a | Success/failure → method change | Partial | Logged, not applied (§1.1 gap D). |
| 2b | Fear → situation-description change | No | Frames are static (gap B). |
| 2c | Attachment → goal change | No | Goals are edited out-of-loop only (gap C). |
| 3 | Attachment switches routing | Partial | Human authority is honoured; no attached-source registry (gap D). |
| 4 | Means and ends learned differently | No | Single retrospect pass (gap E). |

---

## Implication for the plan (no changes proposed here)

§17.2 is short but its consequences are large: it asserts that *who
the signal comes from* should change *what part of the society
updates*. The plan has the raw materials — source attribution, a
distinct human authority level, separate memory classes for methods
and goals — but does not yet wire them into three distinct learning
routes. Closing this would touch the retrospect family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(to carry a `learning_mode` hint), and the credit-assignment
protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
