# Section 17.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.7.md](som-17.7.md) — *Genetic timetables*
(Minsky, §17.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.7 asks *when* new layers should be added. Too early and there is
no substrate; too late and growth stalls. Two endogenous forces
arrive: the *investment principle* (a winning skill attracts more
use and so accelerates), and the *exception principle* (a heavily
depended-on skill becomes too costly to change). Together they
explain why progress is sometimes evolutionary and sometimes
revolutionary.

---

## The ideas Section 17.7 actually carries

1. **Timing of new layers is itself a problem.** A scheme that
   activates layers blindly will mis-time most of them.
2. **Pure clockwork timing fails.** Children differ; rigid
   schedules either fire too early or too late.
3. **Event-driven timing is preferable.** Each new layer should
   start when prior layers' readiness justifies it.
4. **Investment principle.** A skill that surpasses competitors
   gets used more, improves further, and dominates.
5. **Exception principle.** A heavily used skill grows costly to
   change because more agencies depend on its current form.
6. **Hardening forces revolution.** When a layer can no longer be
   evolved, the only path forward is to build a new one beside it.

---

## What the implementation already absorbs

### Event-driven activation, not clock-driven (idea 3)

The workflow runs on events (issues, PRs, scheduled signals)
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
rather than ticking through a development calendar. New agencies are
introduced by PR when a maintainer decides readiness is sufficient.
There is no fixed cadence forcing a layer in.

### K-line reinforcement as investment-principle substrate (idea 4)

A K-line whose `restore_when` matches frequently is reactivated
frequently, accumulates reinforcement, and rises in priority
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md);
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
A successful pattern becomes dominant by use, exactly as the
investment principle predicts.

### Differentiation alongside, not in place of (idea 6)

`agency.meta-admin.differentiation-broker` adds new agencies; the
retirement-broker removes old ones, but only when explicitly
authorised
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The default move is *add beside*, which is the revolution-mode of
idea 6.

---

## What the implementation does not yet take into account

### A — No readiness criterion for introducing a new layer

Idea 3 wants a *criterion* — what does it mean that "prior layers'
readiness justifies" a new layer? The plan's answer is "the
maintainer decides," which conflates the criterion with the actor.
There is no automatic signal that says "perception layer has hit
ceiling; assembly layer is justified."

### B — No detected dominance event (investment-principle outcome)

K-line reinforcement *accumulates*, but no agency reports "K-line K
has crossed dominance threshold; consider building dependent
infrastructure." The investment principle is operating in the data;
its results are not surfaced.

### C — No dependence-cost report (exception-principle warning)

Idea 5 wants a way to see *how many agencies depend on a given
capability*. The plan has `activates_on` and `inhibits` per agency,
from which a dependence graph could be computed, but no report
shows "agency X is depended on by N others; modifying it will ripple
through them." A high-coupling agency hardens silently.

### D — No "freeze before fork" mechanism

Idea 6's revolutionary move is to *freeze* the costly-to-change
layer while a successor is built. The plan has no
freeze annotation in the manifest schema; an agency under heavy
dependence is still editable by PR. Compare with §17.5 gap E:
shadow-run pairs require a stable side, which this gap explicitly
withholds.

### E — No tracked history of "this layer became impossible to change"

The transition Minsky describes — evolution stops working;
revolution begins — is not recorded. No file under
`memory/decisions/` or `evolution/` is dedicated to "this agency
was retired because its dependence cost exceeded its improvement
rate." Without that record, the society cannot learn from past
hardenings.

### F — No bootstrap-too-soon protection

Idea 1's mirror image: introducing a layer too early. The plan's
authority gates control *behaviour* but not *introduction*. A
maintainer can introduce an assembly-tier agency before any tier-1
agency exists; the agency simply never fires (gap A from §17.6
again). The plan does not warn at introduction time.

---

## Summary table

| # | Idea from §17.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Timing of new layers matters | Partial | Maintainer-driven; no automatic readiness signal (gap A). |
| 2 | Clockwork timing fails | Yes | The plan is event-driven by construction. |
| 3 | Event-driven readiness | Partial | Events trigger activity; no readiness *signal* (gap A). |
| 4 | Investment principle | Partial | Substrate exists in K-lines; dominance is not surfaced (gap B). |
| 5 | Exception principle | No | No dependence-cost report (gap C). |
| 6 | Hardening forces revolution | Partial | "Add beside" is the default; freeze-before-fork is absent (gap D). |
| — | History of past hardenings | No | No decision class for it (gap E). |
| — | Bootstrap-too-soon protection | No | Introduction is ungated (gap F). |

---

## Implication for the plan (no changes proposed here)

§17.7 supplies the two principles that govern *when* layered growth
happens. The plan absorbs the event-driven discipline cleanly, and
K-line reinforcement is the natural substrate for detecting the
investment principle. What it lacks is *reporting* — dominance
events, dependence costs, hardening histories — and one structural
primitive (a *freeze* annotation) that would let the revolutionary
move be done safely. Closing these would touch the manifest schema
in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(adding `frozen`, `dependents_count`), the K-line shape in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the evolution shape in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
