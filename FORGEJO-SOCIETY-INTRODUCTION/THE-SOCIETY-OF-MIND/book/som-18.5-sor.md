# Section 18.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-18.5.md](som-18.5.md) — *Strong arguments*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§18.5 introduces the engineering move that protects everyday
reasoning from chain fragility: *parallel bundles*. The handbrake,
the gear-shift, and the wheels turned into the curb are three
chains. No single chain is fully trusted; the combination fails only
when all three fail at once. Every serial connection makes a
structure weaker; every parallel connection makes it stronger.

---

## The ideas Section 18.5 actually carries

1. **Strength is degree, not truth.** Outside logic, arguments are
   rarely "right" or "wrong"; they are stronger or weaker, and the
   strength is a probability against failure.
2. **Parallel bundles.** Several independent arguments for the same
   conclusion together fail only if all of them fail at once.
3. **Serial chains weaken; parallel bundles strengthen.** Every
   added serial step adds a possible failure point; every added
   parallel arm adds a buffer.
4. **The handbrake worked example.** A single brake chain is a
   long, slender thing; expert practice combines independent
   mechanisms (brake, gear, wheel position) so the combination
   cannot fail unless three things go wrong at once.
5. **Mixed topologies are possible.** §18.5 hints at the figure with
   "some others" — series, parallel, tree, mesh — that minds use to
   wire arguments together.

---

## What the implementation already absorbs

### Parallel critics as a bundle (idea 2)

The critic phase
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
runs the critic catalogue *in parallel matrix*. `critic.evidence`,
`critic.scope`, `critic.cost`, `critic.privacy`, `critic.risk`,
`critic.overconfidence`, `critic.source-quality`, `critic.staleness`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
all see the same candidate. A proposal passes only when *all* the
critics whose objections were sustained have been addressed; this is
a parallel bundle in the §18.5 sense.

### Layered safety as parallel mechanisms (ideas 3 and 4)

The layered safety model in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
is the brake-gear-wheels arrangement made operational: kill switch,
guardrail, authority registry, censors, approval gate, suppressors,
candidate-future branches, reversion. Each is a separate mechanism
with its own activation conditions. A dangerous action is stopped
unless *every* layer fails simultaneously. This is exactly §18.5's
parallel bundle, and it is the strongest argument in the plan for
"parallel makes it stronger".

### Multiple agencies converging on one proposal (ideas 1, 2)

Several agencies can independently argue for the same candidate
action. The settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
records each `proposals[]` entry separately with its own `from:`,
`evidence:`, `method:`, and `confidence:`. When multiple proposers
converge on the same action, this is recorded — the parallel arms
are visible.

### Strength from multitude in K-line activation (idea 1)

K-lines reactivate when their `restore_when` criteria *partly*
match; the activation phase
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
boosts agency activation by *multiple* matching K-lines. An agency
woken by three converging K-lines is more confidently activated than
one woken by a single match. This is "strength is degree" in the
activation layer.

---

## What the implementation does not yet take into account

### A — Independence of parallel arms is not measured

Idea 4 — that combined mechanisms cannot fail unless they fail *at
once* — depends on the arms being *independent*. Two critics that
both depend on the same upstream signal are not really two arms;
they will fail together. The plan does not record, anywhere, the
*independence* of two critics, two censors, or two safety layers.
A reviewer counting layers might mistake a fragile bundle for a
robust one. There is no `independent_from: [ ... ]` slot on critics
or censors.

### B — Convergent proposals are not bundled as one stronger one

When several agencies independently propose the same action, the
settlement lists each `proposals[]` separately. There is no
aggregation step that says "these three proposals are arms of one
bundle; their combined confidence is higher than any individual
arm". The settle phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
selects an action without recording it as the merge of multiple
arms. The §18.5 logic of "more reasons gives more confidence" is
not computed.

### C — Sustained-objection arithmetic is implicit

A candidate is blocked if *any* `objections[].blocking: true` is
sustained, regardless of how many supporting arguments exist. This
is the right default for safety, but it does not express §18.5's
finer claim that *several weak objections together* might or might
not be enough. There is no slot for "two soft objections combine
into one blocking objection", and no procedure for combining
objection strengths.

### D — Topology beyond series and parallel is not represented

Idea 5 hints at mixed topologies. The plan uses series (the workflow
phases) and parallel (the critic matrix, the safety layers), but
nothing in between — no tree of supporting subarguments under a
single proposal, no mesh of mutually-reinforcing claims. Claims are
flat lists inside a handoff; they do not form a graph.

### E — Failure modes of the bundle itself are not enumerated

§18.5's worked example names *failure modes*: a brake line breaks, a
gear slips, a tyre rolls. The plan's safety layers do not catalogue
their own failure modes. There is no document listing "the
guardrail can fail if the actor field is spoofed; the censor can
fail if a danger zone is missed". The bundle exists; the audit of
the bundle does not.

---

## Summary table

| # | Idea from §18.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Strength is degree | Yes | `energy`, `confidence`, `decay_score` are graded. |
| 2 | Parallel bundles | Yes | Critic matrix; layered safety model. |
| 3 | Serial weakens, parallel strengthens | Yes | Pipeline is serial; critics and safety layers are parallel. |
| 4 | Brake-gear-wheels worked example | Yes | Layered safety model is the structural analogue. |
| 5 | Mixed topologies | Partial | Series and parallel only; no tree or mesh of arguments (gap D). |
| — | Independence of arms is measured | No | No `independent_from` slot on critics or censors (gap A). |
| — | Convergent proposals aggregated | No | Each proposal stands alone; no bundle confidence (gap B). |
| — | Failure-mode catalogue for safety bundle | No | Bundle exists; its own failure analysis does not (gap E). |

---

## Implication for the plan (no changes proposed here)

§18.5 is one of the sections the implementation absorbs most fully.
The layered safety model is a direct realisation of the parallel
bundle: kill switch, guardrail, authority, censors, approval gate,
suppressors, candidate-future branches, reversion. The critic matrix
runs in parallel. Strength as degree is built into signal energy and
claim confidence. The structural shape is right.

The gaps are about *measuring* the bundle rather than building it:
no record of independence between arms (so the bundle's actual
robustness is unverified), no bundle-level confidence when several
arguments converge on one proposal, no arithmetic for combining
non-blocking objections, and no catalogue of how the safety bundle
itself might fail. The plan trusts the bundle without auditing it.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the critic and censor manifests in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the policies and safety document
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
