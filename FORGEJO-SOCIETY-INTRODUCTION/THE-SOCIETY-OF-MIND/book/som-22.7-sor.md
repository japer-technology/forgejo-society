# Section 22.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.7.md](som-22.7.md) — *Causes and clauses*
(Minsky, §22.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.7 proposes four built-in representational tendencies: *things*,
*differences*, *causes*, and *clauses*. The mind chops complex
situations into clear-cut chunks, treats differences as verbs,
assigns causes wherever change appears, and treats whole structures
as single units. The same machinery, applied unrestrainedly, invents
false gods and a phantom "I."

---

## The ideas Section 22.7 actually carries

1. **THINGS.** We carve the scene into separate object-things; in
   language these tend to be nouns.
2. **DIFFERENCES.** Changes and comparisons become difference-things;
   in language, verbs.
3. **CAUSES.** Whenever change appears we demand a responsible
   person, process, or thing. Where none is visible, we postulate.
4. **CLAUSES.** Whole structures are treated as single things; entire
   phrases become words.
5. **Interruption is native.** We insert phrases into phrases and
   carry on without losing place; the same mechanism appears in
   vision.
6. **Cause-seeking is over-eager.** The same tendency invents false
   gods, superstitions, and the phantom *I* that supposedly causes
   everything we do.
7. **These tendencies may be built-in.** They look less like learned
   habits and more like deep features of how thinking works.

---

## What the implementation already absorbs

### THINGS: stimulus normalisation (idea 1)

`normalize` in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
turns a raw event into a typed `stimulus.json` with an ID, a kind, and
declared parts. The `intake-bee` and `issue-kind-detector` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
formalise the carve-the-scene-into-things move.

### DIFFERENCES: diff-skeptic and diff-summary (idea 2)

`agency.code.diff-skeptic` and the `diff-summary.md` artefact in
`state/mind/issues/<n>/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
represent changes explicitly. A change is a named, criticised thing —
exactly the "differences become verbs" move.

### CAUSES: per-proposal attribution (idea 3, partially)

Each proposal in the settlement carries `from: <agent-id>` and
`evidence: [...]` and `method:` fields
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Every visible move in the society is traceable to a responsible
agency. The signal schema even forbids unevidenced signals: *no
evidence, no trust*.

### CLAUSES: settlements as single units (idea 4)

A settlement collapses many proposals, objections, and outcomes into
one record with one ID. Later phases — and later settlements — treat
that record as a single thing via `cited_decisions` and `linked`. This
is the "treating an entire phrase as a single word" move at the
society scale.

### Interruption: session continuity (idea 5, partially)

Session continuity per
[`THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md)
allows a conversation to be interrupted and resumed by `session-key`.
At the conversation scale, the plan can carry on after a pause.

### Guard against false attribution: critics (idea 6)

`critic.evidence`, `critic.overconfidence`, and `critic.source-quality`
in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
guard against attributing causes to evidence that does not support
them. The infrastructure for "stop the over-eager cause-seeker" is
present in principle.

---

## What the implementation does not yet take into account

### A — Cause is "who emitted" not "what produced"

The settlement records who *proposed* an action and who *objected*,
but not the deeper causal claim — "what produced this outcome?" The
credit-assignment protocol
([`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md))
addresses this in specification, but the implementation has not yet
operationalised an outcome-to-cause attribution that goes beyond
authorship.

### B — No mechanism to demand a cause when none is visible

§22.7's most distinctive claim is that we *postulate* a cause when
none is on the scene. The plan has no agency that, faced with an
outcome lacking explanation, invents (or asks for) a candidate cause.
`agency.perception.ambiguity-detector` flags missing slots; it does
not flag missing *causes*.

### C — Cause-seeking is unmonitored

Idea 6 — the tendency goes wrong, inventing false gods — has no
corresponding critic. There is no `critic.false-causation` that
catches an agency attributing an outcome to a cause for which no
mechanism is given. The plan's safety set is *behavioural* (what we
do) rather than *attributional* (what we say did it).

### D — Clauses do not recurse in a single run

The clause idea — phrases inside phrases — is exactly the *nested
sub-frame* the plan lacks (see [som-22.2-sor.md](som-22.2-sor.md), gap
B, and [som-22.8-sor.md](som-22.8-sor.md) below). Settlements compose
across runs; within a run, no clause-in-clause structure exists.

### E — The phantom-*I* problem has no surface

The plan has a `spock-self-model` and `agency.identity.user-model-keeper`,
but no critic that watches for the society *over-claiming* its own
agency — saying "I decided" when no settlement was authored, or
"I observed" without a percept. The voice rules in
[AGENTS.md](../../../AGENTS.md) push against this in prose, but no
mechanical enforcement exists.

### F — Built-in tendencies are not declared as such

Idea 7 — these tendencies are deep features, not learned habits —
would, in a society, correspond to *unconditional* policies declared
to be structural. The plan has unconditional censors but does not
declare "carve into things", "demand a cause", or "treat clauses as
units" as foundational dispositions. They emerge from architecture
rather than being named.

---

## Summary table

| # | Idea from §22.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | THINGS — carve scene into objects | Yes | `normalize` + intake-bee + issue-kind-detector. |
| 2 | DIFFERENCES — changes as named things | Yes | `diff-skeptic`, `diff-summary.md`. |
| 3 | CAUSES — assign responsibility | Partial | Authorship recorded; outcome-cause attribution thin (gap A). |
| 4 | CLAUSES — structures as single things | Partial | Across runs via settlements; not within a run (gap D). |
| 5 | Interruption is native | Partial | Session continuity at conversation scale only (gap D). |
| 6 | Cause-seeking goes wrong | No | No critic for false causation (gap C); no over-claim guard (gap E). |
| 7 | Tendencies are built-in | Implicit | Emerges from architecture; not declared (gap F). |
| — | Demand a cause when none is visible | No | No postulating agency (gap B). |

---

## Implication for the plan (no changes proposed here)

§22.7 finds the plan strong on three of its four representational
tendencies (things, differences, clauses across runs) and weak on the
fourth (causes) in a specific way: the plan records *authorship* but
not *causation*, and it has no guard against the over-eager
cause-seeking Minsky warns about. The interruption / clause-in-clause
case is the same gap that surfaces elsewhere in chapter 22.

Any move to add outcome-cause attribution, a "demand a cause" agency,
a critic for false causation, an over-claim guard for the identity
family, or a nested-frame primitive would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
