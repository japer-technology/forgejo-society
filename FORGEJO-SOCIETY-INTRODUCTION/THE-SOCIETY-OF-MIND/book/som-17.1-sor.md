# Section 17.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.1.md](som-17.1.md) — *Sequences of teaching-selves*
(Minsky, §17.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.1 opens Chapter 17 with the developmental thesis: a mind comes to
feel unified because it is built in *stages*, each stage taught by the
last, each new stage suppressed until proven, each older stage left
intact as a fallback. The unifying *Self* is the trace of those
prior selves still available.

---

## The ideas Section 17.1 actually carries

1. **Mind grows in stages, not by smooth accretion.** Stages, not
   gradients, are the unit of change.
2. **Each new stage is first a student of the previous stage.**
   The previous stage hands over knowledge, values, and goals.
3. **The same stage later becomes a teacher.** The role flips once
   the student has surpassed it.
4. **A teacher need not solve the problem its student solves.** It
   only has to recognise solutions, score progress, and pass goals.
   This is the *puzzle principle*.
5. **Suppression is a safety discipline.** A new stage must not
   control behaviour until it has been shown to be at least as
   capable as its predecessor.
6. **Apparent spurts hide silent work.** What looks like a sudden
   leap is the surfacing of a long, suppressed development.
7. **Old stages are not discarded.** They remain available as
   fallbacks the present mind can consult under confusion.
8. **Felt unity comes from accumulated fallbacks.** The sense of
   an inner *Self* is the residue of prior selves still callable.

---

## What the implementation already absorbs

### Recognition over solution (idea 4)

The critic family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is the puzzle-principle move in concrete form: critics
(`critic.evidence`, `critic.consistency`, `critic.scope-creep`) score
candidate actions they did not author. The `criticize` phase of
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
separates recognising-a-good-solution from producing-it. A critic can
be cheaper than the agency it judges, exactly as Minsky describes.

### Suppression until proven (idea 5)

Authority levels (`read`, `draft`, `propose`, `act`, `govern`,
`human`) in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
give the plan a staged-release discipline. A new agency may be
introduced at `draft` or `propose`, exercised across many settlements
without controlling behaviour, and only later promoted to `act`. The
approval-gate ([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
keeps "may produce" and "may execute" separate.

### Older stages still callable (idea 7)

`memory/decisions/`, `memory/episodic/`, and the K-line store
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
preserve prior settlements verbatim. A present settlement can match a
prior K-line and reuse its `activation_snapshot`. The git log under
the repo itself is the deepest fallback: any earlier version of any
agency manifest is recoverable.

### Differentiation as the new-stage move (idea 1, partial)

`agency.meta-admin.differentiation-broker` and
`agency.meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
are the plan's named mechanisms for introducing new agencies and
retiring old ones. They are the structural primitives a "stage"
would use.

---

## What the implementation does not yet take into account

### A — No notion of a stage as a first-class object

The plan can *add* and *retire* agencies, but it has no record that
groups a cohort of additions as "stage N" with entry criteria, exit
criteria, and a date. Differentiation events are individual; there is
no `evolution/stages/stage-N.md` analogue.

### B — Student-to-teacher role flip is not represented

Idea 3 is structural: the same agency moves from learner to teacher.
The manifest schema
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has `kind`, `authority`, `activates_on`, `inhibits`, `outputs` — but
no field that records "this agency now mentors agency X" or "this
agency was mentored by agency Y." Pedagogical lineage is invisible.

### C — Suppression is by authority, not by capability tests

Authority levels gate behaviour, but promotion from `propose` to
`act` is a human or governance decision, not the outcome of a
*comparison against the predecessor*. The plan has no
"shadow-run-the-new-agency-alongside-the-old-and-promote-if-it-wins"
loop. Idea 5's tested-superiority criterion is absent as a mechanism.

### D — Spurts vs plateaus are not a recognised pattern (idea 6)

`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
records outcomes, but no analytic reports "this society has been in a
plateau for 200 settlements; expect a spurt." The temporal texture of
development is not part of the plan's vocabulary.

### E — Felt unity from accumulated fallbacks is asserted, not built

Idea 8 says the *Self* feels unified because older selves remain
callable. The plan's unity comes from a single narrator
(`agency.integration.conscious-presenter` in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
and a self-model file. Prior selves are *stored* but not invoked as
a source of identity; nothing in the present settlement says "and
this is what I would have said five versions ago."

### F — No safe-rollback path tied to stage entry

Old agencies remain in git history, but the plan has no documented
*procedure* for "the new stage failed; restore the prior cohort."
The retirement-broker is forward-only.

---

## Summary table

| # | Idea from §17.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Mind grows in stages | Partial | Differentiation/retirement exist; "stage" object does not (gap A). |
| 2 | New stage learns from previous | No | No mentorship lineage in manifests (gap B). |
| 3 | Same stage later teaches | No | Same gap (gap B). |
| 4 | Recognition over solution (puzzle principle) | Yes | Critic family in the `criticize` phase. |
| 5 | Suppression until proven | Partial | Authority gates exist; superiority test does not (gap C). |
| 6 | Apparent spurts hide silent work | No | No plateau/spurt analytic (gap D). |
| 7 | Old stages remain available | Yes | Memory tiers + git history. |
| 8 | Felt unity from fallbacks | Partial | Unity is engineered via a single narrator, not assembled from prior selves (gap E). |
| — | Safe rollback at stage entry | No | Retirement is forward-only (gap F). |

---

## Implication for the plan (no changes proposed here)

§17.1 is the chapter's hinge: it claims that *stages* — not agents,
not signals — are the unit of growth. The implementation absorbs the
puzzle principle (critics) and the fallback principle (memory tiers
plus git), and it has the primitives a stage would use
(differentiation, retirement, authority levels). What it lacks is a
*stage object*, a *mentorship edge* in the manifest, a *superiority
test* for promotion, and an *analytic* over the plateau-spurt
texture. Closing any of these would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the evolution shape in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and the authority registry
([`THE-SOCIETY-OF-REPO/01-governance/authority-registry.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/authority-registry.md)).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
