# Section 23.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-23.3.md](som-23.3.md) — *Time blinking*
(Minsky, §23.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§23.3 dissolves the Duplication Problem (§23.2) with a single move:
because most agents are sensitive to *change over time*, the same
agency can serve as a comparator if it is shown two descriptions in
quick succession. Load description A into pronome `p`, description B
into pronome `q`, activate them in turn — any change in the agency's
output is the difference. The trick is powerful, has a strict
two-at-a-time limitation, and Minsky speculates this is why human
language has so few three-way comparative forms (*between*, *middle*).

---

## The ideas Section 23.3 actually carries

1. **Sensors are change-detectors.** Most perceptual and internal
   agents respond chiefly to time-derivatives, not to absolute
   values. Habituation (perfume, hot water) is the everyday proof.
2. **A change-detector is already a difference-detector.** Any agent
   that reports on time-changes can be re-used as a comparator by
   presenting it two states one after the other.
3. **The two-pronome trick.** Store description A in pronome `p`;
   store description B in pronome `q`; activate `p` and `q` in rapid
   succession; the agency's residual output names the difference.
4. **No duplication needed.** This solves §23.2: the comparator and
   each compared substrate is the *same* agency, used twice across
   time. The "endless host of brains" problem goes away.
5. **The "topless arch" application.** Move-agents that detect walls
   become escape-finders when blinked between the present and a
   no-escape box: only the wall not already present is reported, and
   that wall names the open direction.
6. **One speaker can simulate a listener.** Time-blinking lets a
   speaker maintain `p` (own state) and `q` (listener's predicted
   state) in the *selfsame* agency rather than building a full
   second society of mind.
7. **The two-at-a-time ceiling.** Time-blinking cannot directly
   represent three-way relations. Minsky links this to the relative
   poverty of three-way language (*between*, *middle*).

---

## What the implementation already absorbs

### Branches as the two-pronome substrate (ideas 2, 3, 4)

The plan's reality-model in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
treats `main` as accepted reality and
`society/<stimulus_id>/candidate-<n>` as a candidate future. Diffing
the branch against `main` *is* time-blinking with two pronomes —
`p = main`, `q = candidate-<n>` — and the same set of validators
(critics, censors, test runs) sees both. The agency that judges the
patch is not duplicated; it is run twice across two refs of one
repository. The
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
candidate-future tier makes this the *default*, not a danger-zone
special case.

### Append-only state as a time series (idea 1)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
makes `state/.../signals.jsonl`, `activation.jsonl`,
`candidate-actions.jsonl`, and `objections.jsonl` strictly
append-only, one record per line. The runtime is built to be read as
a time series; downstream analysis can recover what *changed* between
any two cycles by reading two slices of the same file. This is the
substrate Minsky's idea 1 asks for.

### The K-line reactivation pass (ideas 2, 5)

`klines.ts` in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
loads a K-line's `activation_snapshot` and compares it against the
current cue
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The same activation machinery is used twice: once at the original
success (recorded into the K-line), once at the new stimulus
(against `restore_when`). The residual — the agents that *would not*
have woken without the K-line — is the difference, and the cue
matcher reports it back into `state/.../activation.jsonl` with the
K-line id. This is recognisably a time-blink between two activation
snapshots.

### One-issue insulation (idea 4)

The workflow's `concurrency:` group in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
guarantees that each stimulus runs the same agency set against its
own state directory. The substrate (manifests, schemas, policy) is
identical across stimuli; only the time-indexed state differs. Idea
4's "same machinery, two times" is the workflow's *default*.

---

## What the implementation does not yet take into account

### A — No explicit pronome / dual-load primitive

Idea 3 — `p` and `q` as named slots into which two descriptions are
loaded — has no analogue in the plan. The handoff and signal schemas
in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
have no fields for "the other description currently being held
against this one." A comparison done by a critic today is implicit
in the critic's prose body; the *two things* being compared are not
named slots in the record. The `nemes/` directory in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
catalogues *polynemes* (broadcast activators) but has no
*pronomes* — the short-term, agency-local memory slots Minsky
relies on.

### B — Branch-against-main is the only formalised time-blink

The candidate-future / `main` comparison covers idea 5 (the
topless-arch application) cleanly, but other natural time-blinks are
not first-class:

- *Now vs. a prior settlement on the same issue.* Re-opening an
  issue does not currently feed the prior settlement back as `p` and
  the new state as `q`.
- *Predicted outcome vs. actual outcome.* As noted in the
  [§23.1 analysis](som-23.1-sor.md), the settlement has no
  `expected_outcome` field to compare against `outcome.status`.
- *Two competing candidate branches.* `policies/write-policy.yml`
  allows `society/<stimulus_id>/candidate-<n>` for `n > 1`, but
  there is no agency whose job is to blink between
  `candidate-1` and `candidate-2`.

### C — Listener simulation has no home

Idea 6 — speaker simulates listener in the *same* agency by
time-blinking own state `p` and predicted listener state `q` — is
exactly what `agency.integration.conscious-presenter` would need to
do well. The presenter today
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is "sole producer of Spock's visible response" and consults
`agency.identity.user-model-keeper` for preferences, but it does not
hold the user's *current predicted state* in a dedicated slot
alongside its own draft response. Minsky's solution would say: hold
both in one agency and blink.

### D — The two-at-a-time ceiling is not represented

Idea 7 is a *constraint* that, taken seriously, would shape critic
design. The plan has no critic that refuses three-way comparisons or
that flags claims of the form "A is more X than B, but less X than
C" as exceeding the time-blink capacity. The blast-radius and
overconfidence critics in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
do not cover this shape. Whether Minsky's two-at-a-time ceiling is
binding for an LLM-backed agency is an open question, but the plan
does not even *ask* the question.

### E — Habituation has no operational meaning

Idea 1's deeper point — agents *get used to* steady stimuli and
fall silent — has no analogue in the runtime. Polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
fire whenever their match condition holds; they have no decay or
habituation field. A critic that has objected the same way ten times
in a row objects identically the eleventh time. This is correct for
*safety* critics (which must never habituate) but probably wrong for
*evidence* and *staleness* critics, where a repeated signal carrying
no new information ought to lose weight. The decay machinery in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
applies to *records*, not to *active signals* in the current run.

---

## Summary table

| # | Idea from §23.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Sensors are change-detectors | Partial | Append-only state is the substrate; signals have no habituation (gap E). |
| 2 | A change-detector is a difference-detector | Yes | Branch-vs-main and K-line reactivation reuse one machinery twice. |
| 3 | The two-pronome trick | No | No pronome / dual-load primitive (gap A). |
| 4 | No duplication needed | Yes | Workflow concurrency uses one agency set against per-stimulus state. |
| 5 | Topless-arch application | Partial | Branch-vs-main covers it; other time-blinks are not formalised (gap B). |
| 6 | Speaker simulates listener | No | Conscious presenter has no listener-state slot (gap C). |
| 7 | Two-at-a-time ceiling | No | No critic represents or enforces this constraint (gap D). |

---

## Implication for the plan (no changes proposed here)

§23.3 is, structurally, the most flattering section of chapter 23
for the implementation: branches-as-candidate-futures
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
is a time-blink between accepted reality and a candidate, and
K-line reactivation
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
is a time-blink between past activation and present cue. The plan
absorbs the central trick without naming it.

The unforced opportunities are: (a) a pronome record type to make
"the two things currently held against each other" first-class
(would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and the schemas at
[`02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md));
(b) a generic *time-blink* protocol that subsumes branch-vs-main,
prior-vs-current settlement, expectation-vs-outcome, and
candidate-vs-candidate; (c) a habituation field for non-safety
signals so repeated stimuli with no new evidence lose weight (would
touch the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and the credit-assignment protocol at
[`02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)).

These are recorded here as analysis, not as a change request. Any
move to close them would fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
