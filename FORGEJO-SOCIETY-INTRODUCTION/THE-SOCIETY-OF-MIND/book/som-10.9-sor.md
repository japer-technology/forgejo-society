# Section 10.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-10.9.md](som-10.9.md) — *Learning a hierarchy*
(Minsky, §10.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§10.9 closes chapter 10 with a structural answer to how a hierarchy
can be grown without losing function: build a *detour* around an
existing system, keep the old version running until the new one
demonstrably performs the old version's vital functions, *then* cut
some of the older connections. The result, accumulated over time,
becomes the multi-level hierarchy. The section ends with an
anatomical observation: brains carry enormous masses of connection
bundles, because the layers do not fit in the same place.

---

## The ideas Section 10.9 actually carries

1. **Continuous functioning during change.** A brain cannot pause
   to be re-wired; the running system must keep running.
2. **Build a detour, not a replacement.** The new version is added
   alongside the old, not in its place.
3. **Promotion is conditional.** The new version does not assume
   control until it can perform the old version's vital functions.
4. **Old connections are cut only after promotion.** Even then,
   only *some* are cut; the old structure may persist as a
   fall-back.
5. **Layers may not sit on top of one another.** New tiers can
   live elsewhere, attached by connection bundles — the wiring is
   itself a major structure.

---

## What the implementation already absorbs

### Continuous availability via the git substrate (idea 1)

Because every change to `.forgejo-society/` is a commit, the
*currently checked-out tree* defines the running society at every
moment
([`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
A pending change exists in a branch; the running society does not
see it until merge. Change does not interrupt operation; this is
exactly the property §10.9 requires.

### Old connections persist as memory (idea 4 partially)

Even when an agency is retired by
`agency.meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
the historical settlements it participated in are preserved in
`memory/episodic/` and the git history. The *connections* — past
handoffs, past objections — remain readable even after the
contributing agency is gone. The old structure is not erased.

### Connection bundles are visible (idea 5)

The plan's analogue of Minsky's "huge masses of connection bundles"
is the handoff and signal volume between phases
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
and the relational-memory links between records
([`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)).
The plan accepts that wiring is itself a first-class artifact.

### Self-modification frame names the act (idea 1 partially)

The `self-modification` frame in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
gives changes to the society a recognisable shape distinct from
ordinary work. The society can therefore *talk about* its own
re-organisation, which is a precondition for the staged promotion
Minsky describes.

---

## What the implementation does not yet take into account

### A — Detour pattern is not represented

This is the chapter's structural contribution and the plan does not
encode it. There is no mechanism for declaring "agency X' exists
alongside agency X; both run; only X's outputs reach the
settlement; X' is observed in shadow." A new agency, once merged,
is *live* — it produces real signals and may win settlements
immediately. The shadow-run-then-promote pattern §10.9 makes
central is absent.

### B — No "vital functions" predicate for promotion

Idea 3 says the new system is promoted *only* when it can perform
the old system's vital functions. The plan has no such promotion
predicate. An agency change is reviewed at PR time by `human`
authority and merged; nothing afterwards measures whether the new
agency reproduces the behaviour of the agency it replaces. The
acceptance test is *episodic and pre-merge*, not *operational and
post-merge*.

### C — Old structure is preserved as data, not as substrate

§10.9 implies that the old version can be *fallen back to* —
"keep each old system unchanged" until the new is proven. The plan
preserves old agencies as *history* (settlements they contributed
to, manifests in earlier commits) but not as *runnable substrate*.
Once `retirement-broker` retires an agency, it does not run on the
next request. The "keep the older system unchanged" half of §10.9
is honoured for inspection; not for execution.

### D — Cutting "some" old connections is not partial

§10.9 is precise: *some* of the older connections are cut after
promotion. Not all. The plan's removal of an agency is total —
either it is in the catalogue or not
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
There is no representation of "this agency still runs on input
class A but no longer participates in input class B."

### E — Re-wiring as a first-class change

Minsky's last paragraph says new layers may be elsewhere, attached
by wiring. The plan's analogue would be: the new agency lives
alongside the old, and the *handoff topology* is rewired to route
the relevant frame slots to the new one. There is no first-class
representation of handoff topology as a re-writable object; routing
is implicit in `activates_on` declarations across many manifests,
not in a single editable wiring file.

---

## Summary table

| # | Idea from §10.9 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Continuous functioning during change | Yes | Git tree defines the live society; branches are non-disruptive. |
| 2 | Build a detour, not a replacement | No | New agencies go live on merge; no shadow run (gap A). |
| 3 | Promotion is conditional on vital-function replay | No | Acceptance is pre-merge and episodic (gap B). |
| 4 | Old connections cut only after promotion | Partial | Old structure preserved as history, not as substrate (gap C); removal is total, not partial (gap D). |
| 5 | Layers attached by connection bundles | Partial | Handoff/signal/relational wiring exists; not first-class re-writable (gap E). |

---

## Implication for the plan (no changes proposed here)

§10.9 is, in a single section, a structural specification: the
*safe* way to grow a multilevel hierarchy is shadow → promote →
prune. The plan has the substrate that would make this possible —
git-based change, episodic memory, self-modification frame,
retirement broker — but does not yet have the detour pattern itself,
the operational promotion predicate, or partial retirement. These
are the load-bearing absences. Closing any of them would touch the
manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the workflow definition in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md),
the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the evolution material in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and likely the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md).
Nothing here is a change request. Any such move falls under the
"stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
