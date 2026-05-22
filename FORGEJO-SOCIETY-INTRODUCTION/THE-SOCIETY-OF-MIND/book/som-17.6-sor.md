# Section 17.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.6.md](som-17.6.md) — *Prerequisites for growth*
(Minsky, §17.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.6 names two reasons growth is hard to *observe*: skills require
prerequisites (so growth is gated, not continuous), and the most
important growth — of B-brain processes, suppressors, and censors —
happens invisibly. Some apparent stages are illusions in the
observer's mind, not events in the system.

---

## The ideas Section 17.6 actually carries

1. **Skills have prerequisites.** A skill that needs a substrate
   cannot be acquired until that substrate exists.
2. **Prerequisites are inherent, not arbitrary.** Like building
   walls before a roof, the order is structural.
3. **B-brain growth is unobservable from outside.** Learning *how
   to learn* leaves no direct behavioural trace until much later.
4. **Suppressor and censor growth is the hardest to detect.** It
   shows up as absence — things the system *no longer does*.
5. **Some observed stages are observer illusions.** Several small
   real changes accumulate; the observer notices only the threshold.
6. **Internal growth is overlapping and slow.** Many agencies are
   developing simultaneously; the visible behaviour reflects only
   the one that currently dominates.

---

## What the implementation already absorbs

### Prerequisites encoded as dependencies (ideas 1, 2, partial)

The manifest schema
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has `activates_on` and `inhibits`. An assembly-tier agency that
depends on a tier-1 agency lists the tier-1 polyneme in
`activates_on`; without the tier-1 agency present, the tier-2
agency simply never wakes. Prerequisites are *implicit* in the
activation graph.

### Suppressor and censor families exist (idea 4)

The censor family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
— `censor.cloud-egress`, `censor.secret-leak`, `censor.scope-creep`)
is the plan's named locus for "things the society no longer does."
Their growth surface — adding a new censor — is a tracked PR; their
*invisible* operation surfaces in the settlement record as
suppressed candidates.

### Reinforcement log captures small changes (idea 5, partial)

`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
records per-settlement outcomes, so the *accumulation* of small
changes that produces an apparent leap is preserved. A maintainer
can, in principle, look back and see that the apparent leap was a
sequence.

---

## What the implementation does not yet take into account

### A — Prerequisite edges are not declared, only implied

`activates_on` lists *triggers*, not *prerequisites*. There is no
field that says "agency.assembly.summary-tier-2 requires
agency.assembly.summary-tier-1 to exist in the cohort." A maintainer
can delete the tier-1 agency and discover the breakage only at run
time. Minsky's "you can't put the roof on first" rule is not
enforced statically.

### B — No bootstrap-order document

Beyond [`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
(which orders *installation* steps), the plan has no
agency-cohort-order document that says "perception agencies must be
operational before assembly agencies are introduced." The
prerequisite chain among agencies is implicit in the first-ship
catalogue but not extracted into a graph.

### C — B-brain growth is not surfaced

The meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is the plan's analogue of a B-brain — it acts on the A-brain. But
its *growth* (new meta-admin agencies, refinements to existing
ones) produces no special log. Idea 3's invisibility is honoured by
accident, not by design; a maintainer should not have to scan the
git log to see how the B-brain has changed.

### D — Censor growth is logged only as PRs

Idea 4 wants censor development tracked because absence is hard to
detect. The plan tracks censor *additions* as PRs (visible) but does
not produce a periodic report of "censors active in this cohort and
the candidates they suppressed in the last N settlements." A censor
that fires rarely is effectively invisible.

### E — Observer-illusion stages are not flagged

Idea 5 warns that apparent stages are often artefacts of
intermittent observation. The plan has no analytic that compares
"apparent step changes in capability" with "actual cumulative
small changes in the reinforcement log." A maintainer reading the
dashboard cannot tell which apparent leaps are real.

### F — Overlapping development is not visualised

Idea 6 says many agencies grow at once. The plan tracks each agency
file in isolation (git history per file). There is no cross-agency
timeline that would show "five agencies have been simultaneously
under refinement for the last month."

---

## Summary table

| # | Idea from §17.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Skills have prerequisites | Partial | Implicit via `activates_on` only (gap A). |
| 2 | Prerequisites are structural | Partial | Same gap; no declared prerequisite edges (gap A, B). |
| 3 | B-brain growth is unobservable | Partial | Inherits invisibility; no surfacing report (gap C). |
| 4 | Censor growth is hardest to detect | Partial | Additions tracked; activity is not (gap D). |
| 5 | Some stages are observer illusions | No | No analytic to flag illusory leaps (gap E). |
| 6 | Internal growth overlaps | No | No cross-agency timeline (gap F). |

---

## Implication for the plan (no changes proposed here)

§17.6 is a methodological warning more than a design instruction: the
*observability* of development is fundamentally limited. The plan
inherits much of this honestly — its prerequisite structure is
implicit, its B-brain operates without ceremony, its censors do
their work quietly. The missing pieces are *reporting* surfaces: a
prerequisite graph extracted from the manifests, a periodic
censor-activity digest, an analytic over the reinforcement log that
flags illusory leaps. None of these would change the runtime; all
would touch the meta-admin family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the report shape in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
(`report` phase), and the evolution shape in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
