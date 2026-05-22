# Section 14.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-14.3.md](som-14.3.md) — *Seeing squares*
(Minsky, §14.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§14.3 uses the nine-dot puzzle to make a structural point: the
problem is impossible only because the solver has *self-imposed* a
bounding square. Perception is never purely bottom-up; what is seen
is jointly produced by signal and expectation. Recognition of even
"the simplest forms of squares" is downward-influenced.

---

## The ideas Section 14.3 actually carries

1. **Self-imposed constraints make problems hard.** Many problems
   are insoluble only because the solver has silently added a
   constraint the problem itself does not require.
2. **Escape requires reformulation that grants more room.** The
   move is not to push harder against the constraint but to detect
   it and remove it.
3. **Recognition is not purely bottom-up.** What is perceived is
   shaped by what is expected, remembered, and prepared for.
4. **The arrow runs both ways.** A faithful model of perception has
   information flowing both from the world *into* the mind and from
   the mind's memory *back into* perception.
5. **Even simple shapes have a top-down component.** Squares
   without corners and squares without edges are still recognised
   as squares; the global shape is supplied internally.

---

## What the implementation already absorbs

### Expectation can shape recognition (ideas 3, 4)

K-lines in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
explicitly re-activate prior mental state when a `restore_when`
predicate matches. That is a downward influence: a remembered state
re-arms agencies that then bias what gets noticed in the next
perceive phase. The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
runs perceive → activate, so activated agencies *carry forward* into
how the next signal is parsed.

### Memory-shaped perception (idea 3)

`memory/semantic/`, `memory/episodic/`, and the concept store
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
are readable during perceive. A perception agency can look up
analogues before producing its polyneme. Memory is not isolated from
the front of the pipeline.

---

## What the implementation does not yet take into account

### A — No detector for self-imposed assumptions

The chapter's central point is that the *bounding square* is added
by the solver, not by the puzzle. The plan has no critic whose
brief is "list the assumptions this proposal is silently making
that the input did not state." `critic.evidence` checks whether
claims are supported; there is no `critic.assumption` that surfaces
unstated constraints. Idea 1 has no operational home.

### B — Constraints cannot be relaxed deliberately

The settlement layer
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
treats every recorded constraint as binding. There is no machinery
for "drop assumption X, retry deliberation, observe whether the
problem becomes tractable." The very move §14.3 names — *give
yourself more room* — is not a phase of the pipeline.

### C — Top-down bias is not auditable

While K-lines do bias the next perceive step (idea 3), the plan
does not record *which* prior states biased *which* readings. The
handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
does not have a `priors_active` slot. So when a perception comes
out wrong because of expectation, the audit trail does not say so.

### D — Perception is single-pass

Idea 4 — that the arrow runs both ways — implies iteration. The
plan's pipeline runs perceive once per tick. There is no second
perceive pass after deliberation has produced expectations that
might re-read the signal. The bidirectional loop is only weakly
implemented as cross-tick memory, not as within-tick re-perception.

### E — Global shape vs. local feature is not a parameter

The chapter's last image — squares with no corners, squares with no
edges — would, in implementation terms, want a perception agency
that can be biased toward gestalt vs. feature on demand. No
manifest field expresses such a bias, and no critic asks "did this
perception run feature-first or shape-first?"

---

## Summary table

| # | Idea from §14.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Self-imposed constraints make problems hard | No | No assumption-surfacing critic (gap A). |
| 2 | Escape requires giving more room | No | Settlement treats constraints as binding (gap B). |
| 3 | Recognition is not purely bottom-up | Yes | K-lines and memory feed perceive. |
| 4 | Bidirectional perception | Partial | Cross-tick yes; within-tick no (gap D). |
| 5 | Top-down supplies global shape | Partial | Possible in agency design; not a schema parameter (gap E). |

---

## Implication for the plan (no changes proposed here)

§14.3 is short and devastating: the difference between an insoluble
problem and a routine one is often nothing but a constraint the
solver added. The implementation has the *machinery* for top-down
bias (K-lines, memory in perceive) and lacks the *self-criticism*
that would notice when a bias has narrowed the problem
unnecessarily. The biggest gap is A: no critic exists whose only
job is to enumerate the proposal's silent assumptions. Closing it
would touch the critic family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and the audit fields in the settlement schema.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
