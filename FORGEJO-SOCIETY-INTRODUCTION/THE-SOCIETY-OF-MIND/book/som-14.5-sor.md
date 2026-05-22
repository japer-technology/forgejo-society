# Section 14.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-14.5.md](som-14.5.md) — *The investment principle*
(Minsky, §14.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§14.5 names the *investment principle*: old ideas keep winning not
because they are better but because they have accumulated more
auxiliary skills. Each new idea must compete against this mass.
Minsky's evolutionary example — vertebrate heads, the genetic
code — shows how investment can lock in arrangements that nothing
else could now displace.

---

## The ideas Section 14.5 actually carries

1. **Old ideas have unfair advantage.** The earlier learned, the
   more attached methods, the more entrenched.
2. **Short-term reasoning favours patching the old.** It is almost
   always cheaper *now* to extend an existing skill than to start
   fresh.
3. **Patching hides deficiencies.** Sidesteps make the old idea
   more dominant, not less; over time the foundation narrows even
   as the surface broadens.
4. **The short run is where we live.** Investment and exception
   together produce a structural reluctance to disturb the
   foundations.
5. **Lock-in is real.** Centralised vertebrate heads and the
   genetic code persist not because they are optimal but because
   too many other structures depend on them.
6. **Evolution is short-sighted.** Even a change that would help
   over long spans is suppressed if it imposes short-term
   handicaps.

---

## What the implementation already absorbs

### Provenance and lineage are tracked (ideas 1, 5)

Every agency manifest in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
carries `provenance` and `parent` fields, and the git log itself
records when each was first written. Investment is therefore
*visible*: a reviewer can see which agencies have accumulated
auxiliary critics, polynemes, and K-line references over time.

### Retirement is a named operation (ideas 2, 3)

`agency.meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
exists explicitly to remove established agencies. The plan has, in
principle, a counterforce to the investment principle: a named
mechanism for letting go.

### Reinforcement log records outcomes over time (idea 1)

`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
keeps the long-running outcome record needed to ever notice that an
old agency is being kept alive by patches rather than by results.
The substrate for measuring investment-vs-merit exists.

---

## What the implementation does not yet take into account

### A — No metric of accumulated dependencies

Idea 1 names *the auxiliary mass* as the source of unfair
advantage. The plan does not measure it. There is no count of
"critics that reference this agency," "K-lines that restore this
agency," or "settlements that depended on this agency's output."
Without that count, investment cannot be quantified and so cannot
be argued against.

### B — Short-term bias is unchecked

Idea 4 — that the short run dominates — has no countermeasure in
the pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
Every settlement is judged on per-tick outcomes. No long-horizon
critic asks "is this agency producing diminishing returns over the
last N weeks?" The retirement-broker exists but has no scheduled
review cadence.

### C — Patches are not distinguished from improvements

When a critic is added to compensate for an agency's blind spot
(idea 3), the new critic looks like any other critic in the file
tree. The plan does not record "this critic exists *because of*
that agency's weakness," so the pattern of accumulating sidesteps
that Minsky warns about is invisible to the audit.

### D — Lock-in is not modelled

Idea 5 has no analogue. The plan can in principle retire any
agency, but it does not know which retirements would cascade. There
is no dependency graph that would say "removing
`agency.perception.X` would invalidate eleven K-lines and four
settlements." Without that, an attempted retirement is high-risk,
which reinforces the very investment principle it should be
counteracting.

### E — Evolutionary short-sight is not a policy concern

Idea 6 — that short-sighted optimisation suppresses long-term
improvements — has no representation in
`evolution/reinforcement-log.md`. The reinforcement signal is
single-horizon. The plan has no long-horizon signal that could
override short-horizon resistance to a structural change.

---

## Summary table

| # | Idea from §14.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Old ideas have unfair advantage | Partial | Provenance visible; no dependency count (gap A). |
| 2 | Short-term favours patching | Partial | Retirement-broker exists; no review cadence (gap B). |
| 3 | Patches hide deficiencies | No | Patches indistinguishable from improvements (gap C). |
| 4 | The short run dominates | No | No long-horizon critic (gap B). |
| 5 | Lock-in is real | No | No dependency graph (gap D). |
| 6 | Evolution is short-sighted | No | Single-horizon reinforcement (gap E). |

---

## Implication for the plan (no changes proposed here)

§14.5 is the diagnostic chapter for any long-running cognitive
system: the older a society gets, the more its decisions will be
explained by *what has accumulated* rather than by *what works*.
The implementation has the bones of the counterforce — provenance,
retirement-broker, reinforcement log — but lacks the *measurements*
that would let the counterforce actually fire. The biggest single
gap is A: a dependency-and-citation count per agency, without which
the investment principle remains invisible and therefore unargued.
The next is D: an explicit dependency graph that makes retirement
safe enough to consider.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the state and memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the policy file in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and the evolution material in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
