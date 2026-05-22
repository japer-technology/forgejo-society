# Section 23.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-23.1.md](som-23.1.md) — *A world of differences*
(Minsky, §23.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§23.1 opens chapter 23 by claiming that *difference* is the primitive
of ordinary thought. A goal is a difference one wishes to remove; a
cause is a hypothesised link between differences; an analogy is a
recognised similarity between two *differences between differences*.
The section catalogues six cognitive activities (Predicting,
Expecting, Explaining, Wanting, Escaping/Attacking/Defending,
Abstracting) and ends with second-order differences as the basis of
problem solving.

---

## The ideas Section 23.1 actually carries

1. **Difference is the primitive.** Significance reduces to "what
   difference does it make?"; cause and effect are imagined links
   between differences; goals are *desired* differences.
2. **Six difference-mediated activities.** *Predicting* (what would
   P do to A), *Expecting* (compare Y produced to Z intended),
   *Explaining* (observed D suggests a P that causes that kind of
   D), *Wanting* (reduce the difference between A and Z),
   *Escaping/Attacking/Defending* (counteract a disturbing P), and
   *Abstracting* (lift differences themselves into objects at the
   next level).
3. **Differences between differences.** "Height" is a difference
   between two locations; "taller" is a difference between two
   heights. Higher-level agents must operate on second-order
   differences as their natural objects.
4. **Analogy is the ordinary case.** Reasoning by analogy is not an
   exotic mode; it is the everyday recognition that a current
   second-order difference resembles a remembered one.
5. **No effect, no point.** "It is generally useless to do anything
   that has no discernible effect." Action without difference is
   not action at all.

---

## What the implementation already absorbs

### Wanting as a frame slot (idea 2 — *Wanting*)

A frame's `slots:` in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are precisely the differences between the current state of the
workspace and the state required for settlement. The `code-change`
frame's `user_goal`, `proposed_patch`, `tests`, `risks`, and
`revert_path` slots are the difference-list whose closure is the
condition for action. A settlement cannot proceed while a required
slot is unfilled, which operationally means: the society does not
act while a known difference remains.

### Imagined action (idea 2 — *Predicting*)

The candidate-future branch protocol in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
("branches as imagination", every write to `main` first lands on
`society/<stimulus_id>/candidate-<n>`) is a usable analogue of
*Predicting*: a procedure P is applied to a hypothetical branch, the
resulting diff is inspected, critics and censors run, and only then
is the merge — the real effect — committed.

### Analogy as fallback (idea 4)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
declares an analogy pass in the `activate` phase: "when no K-line
matches strongly and no frame matches strongly, the `activate` phase
runs an analogy pass over `memory/analogies/`." The shape is right —
typed structural mappings between domains — and the plan correctly
notes that the first-ship catalogue is empty.

### No effect, no record (idea 5)

The handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
requires every claim to carry `evidence`, and every signal to carry
non-empty `evidence`. Action without a discernible referent cannot
even be expressed in the record schema. The "no evidence, no trust"
law is a strict reading of Minsky's "no difference, no point."

---

## What the implementation does not yet take into account

### A — Difference is not a first-class record type

Idea 1 places *difference* below proposal, signal, and objection in
the primitive hierarchy. The plan has Signal, Handoff, Settlement,
K-line, and Manifest
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md));
it has no `Difference` record. Frame `slots:` carry differences
*implicitly* (an unfilled slot is the gap), but the gap itself is not
named, addressable, or comparable across stimuli. Two settlements
that closed "the same" difference cannot be aligned by reference to
the difference.

### B — Of the six activities, only two have clear loci

| Activity | Where it lives in the plan |
| --- | --- |
| *Predicting* | Candidate-future branches (clear) |
| *Wanting* | Frame slots + `governing_frame` (clear) |
| *Expecting* | Partial — outcomes are recorded but not compared to a prior expectation |
| *Explaining* | Absent — no agency reads an observed diff `D` and proposes a procedure `P` that would have produced it |
| *Escaping/Attacking/Defending* | Absent as a distinct mode — safety censors *block*, but no agency *counteracts* an active disturbance |
| *Abstracting* | Partial — `agency.assembly.summary-tier-1/2` compresses, but does not lift differences into objects of higher-level thought |

The plan has good machinery for the two activities that look like
"deliberate choice," and weak or absent machinery for the four that
look like "interpretation of what already happened."

### C — Expectation is not held alongside outcome

*Expecting* (idea 2) requires the prior expectation `Z` to be
retrievable when the actual outcome `Y` arrives, so that `Y − Z` can
be computed. The plan writes `outcome.json` in the `act` step
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
and stores the settlement under `workspace/active-settlements/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
but a settlement has no `expected_outcome:` slot to compare against
`outcome:`. Credit assignment
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
attributes credit on the *binary* `outcome.status`, not on the
difference between expectation and result.

### D — No second-order difference machinery

Idea 3 is the load-bearing one for analogy. The plan's K-line
mechanism reactivates a *configuration* whose cue resembles the
current cue, but it does not represent the second-order observation
"this stimulus differs from the K-line's stimulus in the same way
that K-line A's stimulus differed from K-line B's." The
`memory/analogies/` tree
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
is designed for typed structural mappings, but the mapping schema
does not yet name *difference* as the unit being mapped.

### E — The empty analogy catalogue is a real gap

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
states "the first-ship catalogue is empty; analogies are written by
the `meta-admin` family during ecology review." Idea 4 makes analogy
the *ordinary* way to solve new problems, not the fallback. A
deployed society that never accumulates analogies, or that treats
each stimulus as sui generis, has lost Minsky's ordinary case.

### F — Abstracting is compression, not lifting

`agency.assembly.summary-tier-1` and `summary-tier-2`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
*compress* signals into briefings. Idea 2's *Abstracting* asks for
something stronger: the differences observed at one level become the
*objects* manipulated at the next level. The plan has no level above
the settlement at which prior settlements (or the differences
between them) are themselves the working material.

---

## Summary table

| # | Idea from §23.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Difference is the primitive | Partial | Implicit in frame `slots:`; not a first-class record (gap A). |
| 2a | Predicting | Yes | Candidate-future branches. |
| 2b | Expecting | Partial | Outcome written; no expectation slot to compare against (gap C). |
| 2c | Explaining | No | No agency proposes a procedure that would explain an observed diff (gap B). |
| 2d | Wanting | Yes | Frame slots; settlement blocked while differences remain. |
| 2e | Escaping / Attacking / Defending | No | Safety censors block; no counteracting agency (gap B). |
| 2f | Abstracting | Partial | Assembly compresses, does not lift differences into next-level objects (gap F). |
| 3 | Differences between differences | No | No second-order difference machinery (gap D). |
| 4 | Analogy as the ordinary case | Partial | Hook exists; catalogue empty; treated as fallback not ordinary (gap E). |
| 5 | No effect, no point | Yes | Handoff/signal schemas require evidence on every claim. |

---

## Implication for the plan (no changes proposed here)

§23.1 reframes much of what the plan already does as the management
of differences: a frame slot is a wanted difference, a candidate
branch is a predicted difference, an objection is a refused
difference. The plan honours this implicitly through frames,
candidate-future branches, and the evidence rule.

The genuinely missing pieces cluster around the *interpretive*
activities (Expecting, Explaining, Escaping/Attacking/Defending) and
around the second-order layer. Making *difference* itself a record
type would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the settlement schema, and likely the relational-memory protocol at
[`02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md);
adding an `expected_outcome:` field to settlements would touch
[`02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
and credit assignment at
[`02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md);
populating `memory/analogies/` would change the operational meaning
of the analogy fallback in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md).

These are recorded here as analysis, not as a change request. Any
move to close them would fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
