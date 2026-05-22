# Section 17.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.5.md](som-17.5.md) — *Developmental stages*
(Minsky, §17.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.5 argues *why* growth must be staged at all: any system already in
use is too dangerous to change continuously. The needed disciplines
are kept-old-versions, suppressed-new-versions, comparison before
promotion, and "business during renovations."

---

## The ideas Section 17.5 actually carries

1. **Changing a working system is intrinsically dangerous.**
   Steady, smooth development is unsafe for anything complex.
2. **Keep prior versions intact.** Undo is insufficient because a
   degraded mind cannot recognise its own degradation.
3. **Run the new version suppressed.** Do not let it control
   behaviour until evidence shows it outperforms its predecessor.
4. **Plateaus then spurts.** External appearance is silent
   periods followed by sudden capability; the real work happens in
   the silence.
5. **Business during renovations.** The system must keep working
   while the new stage matures.
6. **The argument generalises.** Any large organisation that
   functions cannot accept "more than a few changes at once."

---

## What the implementation already absorbs

### Prior versions intact (idea 2)

Git is the deepest application of this rule. Every prior manifest,
prompt, frame, and settlement is preserved by the repository itself.
The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("every structure collapses to a file under `.forgejo-society/`")
makes versioning automatic — no agency state lives outside what git
preserves.

### Suppressed-new-version via authority (idea 3, partial)

Authority levels (`read`, `draft`, `propose`, `act`, `govern`,
`human`) in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
let a new agency be exercised without affecting outcomes. A new
`agency.code.foo` introduced at `propose` will produce candidate
outputs that critics see but the runtime does not execute. The
approval-gate in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
keeps "may produce" and "may act" separate.

### Few-changes-at-a-time discipline (idea 6)

[AGENTS.md](../../../AGENTS.md) §11 directs change-makers to "make
the smallest possible change that fully addresses the request" and
forbids unrelated refactoring. The PR-based change model that every
edit must travel through is a hard limit on simultaneous change.

### Business during renovations (idea 5)

Because every change is a PR against a branch, the `main` branch
keeps serving as the workflow runs against it. The bootstrap
checklist in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
does not require a maintenance window. The plan inherits "business
during renovations" from Forgejo's branching model.

---

## What the implementation does not yet take into account

### A — Comparison-before-promotion is not automated

Idea 3's full form is *evidence that the new version outperforms
the old*. The plan promotes by human approval, not by measured
superiority over the prior agency. There is no "shadow run" mode in
which the new agency observes the same stimuli as the old, its
outputs are scored against the old's outputs, and promotion happens
when the scoreboard tilts.

### B — Regression-on-failure is not a documented procedure

Git allows reverts, but the plan has no explicit "stage N failed;
restore the agency cohort active before stage N" procedure
([`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
covers initial bootstrap, not rollback). Idea 2 demands a *practiced*
fall-back, not merely the availability of one.

### C — Plateau-vs-spurt analytic is absent

Idea 4 names a visible temporal texture: long silences, sudden
leaps. `evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
records events but no rolling-window report flags
"capability-spurt-detected" or "in-a-plateau-for-N-settlements."
A maintainer cannot tell at a glance whether the society is
quiescent or accelerating.

### D — "Don't change a working system" is in voice, not in gates

`AGENTS.md` §11 is prose discipline. The runtime has no automatic
gate that says "this PR changes more than K manifests in one
commit; require additional review." Idea 6 wants the
few-changes-at-a-time rule to be *enforced*, not just *requested*.

### E — A working version cannot "hold still" structurally

In Minsky's model, the old stage is *frozen* while the new one
matures. In the plan, every PR merges to `main` and the running
society moves with it. There is no branch-protected "stable" agency
set that the new agency is compared *against* while both are
exercised on the same stimuli.

---

## Summary table

| # | Idea from §17.5 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Continuous change is dangerous | Yes | Inherited from the PR model and AGENTS.md §11. |
| 2 | Keep prior versions intact | Yes | Git plus the collapse rule. |
| 3 | Run new versions suppressed | Partial | Authority gates exist; superiority comparison does not (gap A). |
| 4 | Plateaus then spurts | No | No analytic over the reinforcement log (gap C). |
| 5 | Business during renovations | Yes | PR/branch model. |
| 6 | Few changes at a time | Partial | Voice discipline, not a gate (gap D). |
| — | Practiced regression on failure | No | Reverts available, no documented procedure (gap B). |
| — | Frozen-stable vs maturing pair | No | No shadow-run mode (gap E). |

---

## Implication for the plan (no changes proposed here)

§17.5 is the safety case for *stages*: change is dangerous, so it
must be staged and tested. The plan absorbs the static disciplines —
version preservation, suppression by authority, small commits — but
not the dynamic ones — measured superiority before promotion, named
plateau/spurt detection, practiced rollback, shadow-run-against-prior.
The largest single move would be a *shadow-run mode* that lets a new
agency observe stimuli and propose without acting, with its proposals
scored against the incumbent. Such a mode would touch
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
(new phase), the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a `shadow_of` field), and
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
