# Section 23.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-23.2.md](som-23.2.md) — *Differences and
duplicates* (Minsky, §23.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§23.2 introduces the Duplication Problem: two agencies whose internal
states are to be compared must themselves be virtually identical, and
so must their subagencies, all the way down. Otherwise the spurious
differences between the agencies will swamp the real differences
between the things they describe. The section asks how a single mind
can hold "Mary" and "John" together, given this constraint.

---

## The ideas Section 23.2 actually carries

1. **Comparison demands shared substrate.** "The states of two
   different agencies cannot be compared unless those agencies
   themselves are virtually identical." Otherwise differences in the
   *machinery* contaminate differences in the *content*.
2. **The constraint recurses.** Identical agencies require identical
   inputs, hence identical subagencies, hence — naively — an endless
   host of duplicated brains.
3. **Two simultaneous personalities is the everyday case.** Holding
   Mary and John "in mind at once" requires this duplication
   apparatus for ordinary social cognition, not for exotic
   reflection. The problem is structural and pervasive.
4. **Connectivity must match too.** Even two identical
   person-representing agencies do not produce comparable outputs
   unless they share *similar connections* to the rest of the
   society. Same shape is not enough; same wiring is required.
5. **The problem is named and unsolved here.** §23.2 is a setup
   section: it diagnoses the cost of comparison without yet offering
   a solution. (The solution arrives in §23.3, *time blinking*.)

---

## What the implementation already absorbs

### One manifest schema, one handoff shape (ideas 1, 4)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
forces every agency, critic, and censor through the same manifest
schema, and
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
forces every agent's return value through a single `Handoff` shape
(status, confidence, signals, claims, objections, candidate actions,
tool usage). Two agencies' outputs *do* share substrate: the schema
itself. This is a partial answer to idea 1 — the comparator does not
have to special-case each emitter.

### The global workspace as shared input (idea 1)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
makes every agency read from the same `state/mind/issues/<n>/`
directory (percepts, activation, blackboard, signals). Inputs are
not freshly perceived by each agency from raw event payloads; they
are perceived once by the `normalize` step
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
and then shared. This collapses the recursive demand for identical
subagencies (idea 2) into a single Forgejo-bridge step that is, by
construction, the same for everyone.

### A single conscious bottleneck (idea 1)

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
("Conscious bottleneck") and the settlement schema both ensure that
*one* agency — `agency.integration.conscious-presenter` — assembles
the final text from the settled blackboard. The comparator for "what
the society wants to say" is exactly one process reading exactly one
representation. There is no second narrator whose differences in
phrasing would be confused for differences in content.

### Connectivity made legible (idea 4)

The manifest's `activates_on`, `inhibits`, `outputs`, and the
polyneme `excite`/`inhibit` tables in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
make each agency's wiring an explicit file. A reviewer can verify
that two agencies sit in similar positions in the activation graph;
the connectivity that idea 4 demands be matched is at least
*inspectable*.

---

## What the implementation does not yet take into account

### A — The Duplication Problem is not named anywhere

§23.2's central diagnosis — that comparison requires shared
substrate — does not appear in the plan or in the specification it
indexes
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)).
None of the protocol files in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/)
carry a *comparison* protocol. The plan has solved one face of the
problem (uniform handoff schema) without acknowledging that the
problem exists or has other faces.

### B — Claim content is freeform

[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
specifies `claims[].text` as a one-line string. Two agencies that
produce "the patch is safe" with different internal meanings of
"safe" are formally comparable (same schema) but semantically
incomparable (different concepts behind identical surfaces). Idea 1
warns that this is the dangerous case: the comparator sees a match
where none exists.

### C — Holding two persons (or two stimuli) at once is not modelled

Idea 3 — Mary and John in mind together — corresponds in the plan to
holding two *stimuli*, or two candidate futures, simultaneously
inside one settlement. The workflow's `concurrency:` group in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
deliberately *insulates* stimuli from each other (one group per
issue/PR/comment). Insulation is the right safety choice, but it
also means the plan has no first-class machinery for the everyday
case Minsky raises: two things compared inside one act of thought.
Multiple `candidate-<n>` branches per stimulus
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
hint at this, but there is no agency dedicated to comparing two
candidate branches against each other.

### D — Connectivity check is by inspection, not by enforcement

Idea 4 demands that the connectivity of two agencies that share a
comparator be *similar*. The plan exposes connectivity (gap B above
addressed it), but no critic or censor *verifies* that two agencies
being compared have compatible wiring. Nothing in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)'s
first-ship critic catalogue is a *comparability* critic.

### E — The recursive cost is not budgeted

Idea 2's "endless host of duplicated brains" is what the plan
implicitly pays for in token cost whenever the deliberation loop
in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
runs many agencies over the same workspace. The `budget` field in
the manifest schema and the `cost-critic` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
track *total* cost; neither attributes the duplication cost
specifically to comparison-like operations. The §23.3 *time blinking*
solution (see the next analysis file) is what closes this, and the
plan does not yet carry that closure.

---

## Summary table

| # | Idea from §23.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Comparison demands shared substrate | Partial | Uniform manifest + handoff schema; claim content is freeform (gap B). |
| 2 | The constraint recurses | Partial | One `normalize` step shares input; recursive cost not budgeted (gap E). |
| 3 | Two simultaneous personalities is everyday | No | Stimuli are insulated by concurrency group; no two-things-at-once comparator (gap C). |
| 4 | Connectivity must match | Partial | Connectivity is inspectable via manifests and polynemes; no enforcement (gap D). |
| 5 | The problem is named and unsolved here | No | The Duplication Problem is not named anywhere in the plan (gap A). |

---

## Implication for the plan (no changes proposed here)

§23.2 is the half of chapter 23 that diagnoses the cost; §23.3 is
the half that pays it. The plan has done well on the *substrate*
side of idea 1 (one schema for manifests, one schema for handoffs,
one global workspace, one conscious bottleneck) and has not yet done
anything on the *content* side (gap B) or on the *holding two things
at once* side (gap C).

Naming the Duplication Problem somewhere in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/)
— most naturally as a *comparison* protocol that sits next to
[`02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
and
[`02-protocols/13-hierarchy-and-summaries.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md)
— would also bear on the relational-memory protocol at
[`02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
(which is where typed `contradicts` and `reinforces` links already
do small-scale comparisons across durable records).

These observations are recorded as analysis, not as a change
request. Any move to close them would fall under the "stop and ask"
rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
