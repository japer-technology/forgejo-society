# Section 27.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-27.2.md](som-27.2.md) — *Suppressors*
(Minsky, §27.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§27.2 distinguishes *suppressors* — agents that intercept a bad
action just before it would be performed — from the censors of the
next section, which intercept the line of thought earlier. The
section also sketches a learning rule: an agent that recognises the
state which, in the past, preceded the undesired action.

---

## The ideas Section 27.2 actually carries

1. **Two poles of self-improvement.** Stretch the range of generated
   ideas; learn not to repeat past mistakes. Both are needed.
2. **A suppressor is a late interceptor.** It waits until a bad idea
   reaches the threshold of action, then blocks the action.
3. **Suppressors say "stop thinking that!"** Their voice is
   prohibitive and terminal.
4. **Suppressors learn from prior bad outcomes.** They recognise the
   *state* that preceded a known bad action.
5. **Suppression costs backtracking.** Time has been spent reaching a
   state that must now be undone.
6. **Communities accumulate taboos.** Negative knowledge is a real
   memory category, not just the absence of positive knowledge.

---

## What the implementation already absorbs

### Late interception (ideas 2, 3)

The `censor` phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is exactly a suppression layer: critics have already scored candidate
actions, settlement has chosen one, and censor agencies in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
get the last word. The policy gate in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
("hard rules apply after the soft loop") is the file form of "stop
thinking that!"

### Negative knowledge as a real category (idea 6)

`policies/safety.yml`, `policies/cloud-egress.yml`, and the
`agencies/censors/*` manifests in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
constitute first-class negative memory: taboos written as files,
audited like everything else. The two poles (idea 1) appear as
*proposers* (drafts, candidates) on one side and *censors* on the
other.

### Backtracking as a real cost (idea 5)

The pipeline records every intercept in the settlement
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
along with the objection that caused it, so the cost of a late veto
is *visible* in the record. This is not the same as avoiding the
cost, but it is at least counted.

---

## What the implementation does not yet take into account

### A — Suppressors do not learn from their own prior fires

Idea 4 is the load-bearing one in §27.2. A suppressor in Minsky is
*shaped* by the outcomes it has seen. The plan's censors are
authored: their manifest declares `activates_on` and `forbid`, and
those fields do not change in response to whether the censor's past
fires were correct or not. There is no place where a censor's
hit-rate or false-positive rate flows back into its trigger
condition. `evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
records outcomes but does not feed the censor manifests.

### B — No first-class distinction between "stop" and "deflect"

§27.2 contrasts suppressors (which block) with censors (next section,
which deflect). The plan's censor phase only blocks: a censor fires
an objection, settlement re-runs or escalates. There is no
"redirect" outcome where the censor names an *alternative* draft to
substitute. Objections in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carry a `reason`, not a `substitute_action`.

### C — No representation of the "two poles" tension

Idea 1 names a balance: too much suppression starves novelty; too
little produces repeated mistakes. The plan has no metric — no slot
in `governance/self-ideals.md` or in the introspection protocol — for
tracking that balance over time. A society could accumulate censors
indefinitely with nothing pushing back.

---

## Summary table

| # | Idea from §27.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Two poles of self-improvement | Partial | Proposers and censors exist; no balance metric (gap C). |
| 2 | Suppressor as late interceptor | Yes | Censor phase + policy gate. |
| 3 | "Stop thinking that!" voice | Yes | Censor objection → settlement halts the candidate. |
| 4 | Suppressors learn from past bad outcomes | No | Censor manifests are authored, not adapted (gap A). |
| 5 | Suppression costs backtracking | Yes | Cost is visible in the settlement record. |
| 6 | Communities accumulate taboos | Yes | `policies/*` and `agencies/censors/*` files. |

---

## Implication for the plan (no changes proposed here)

The plan implements the *structure* of suppression well: a dedicated
late phase, censor agencies, policy files, and a settlement record
that shows when a veto fired. The two missing pieces are *adaptation*
(censors that change in response to outcome) and *balance* (a way to
notice that suppression has crowded out novelty).

Any move to close these would touch the censor manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and the introspection slots in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
