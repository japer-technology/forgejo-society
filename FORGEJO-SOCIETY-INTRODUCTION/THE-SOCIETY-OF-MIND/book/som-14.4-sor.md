# Section 14.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-14.4.md](som-14.4.md) — *Brainstorming*
(Minsky, §14.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§14.4 asks when to abandon a familiar method for a wilder one. The
section names *brainstorming* and *lateral thinking* as
last-resort disciplines, warns that switching frames demotes the
solver to novice, and lists the methods that are "always
available" (quit, rest, restart) as exactly the ones that should
rarely be invoked.

---

## The ideas Section 14.4 actually carries

1. **Reformulation is cheap once practised.** A mind that has built
   up cross-description links can re-frame "as easily as turning on
   a switch."
2. **The give-up decision is structurally hard.** There is no
   reliable signal that says "stop now" — quitting just before the
   answer arrives is as common as quitting too late.
3. **Wilder methods are last-resort, not default.** Brainstorming /
   lateral thinking / meditation are useful only when ordinary
   methods are exhausted.
4. **Reframing demotes the solver to novice.** New views grant new
   ideas but cost the ability to judge them against established
   skills.
5. **Beware the principle of exceptions.** A single strange
   experience should not overturn rules earned over many.
6. **Always-applicable methods are suspect.** Quit, find an easier
   problem, take a rest, simply wait, start over — these can be
   used anywhere precisely because they engage with nothing in
   particular. They must carry low priority.

---

## What the implementation already absorbs

### Re-framing has a low-cost substrate (idea 1)

K-lines in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
allow a prior mental state to be restored when its `restore_when`
predicate matches. The cost of "switching view" is one K-line
activation; this matches Minsky's "turning on a switch" metaphor.

### The give-up boundary is owned by the human (idea 2)

The plan does not pretend to know when to quit. The escalation
machinery in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
routes hard cases to the `human` authority level. When the society
cannot resolve, it surfaces the situation rather than guess at the
stop-now signal. This is consonant with Minsky's warning that the
decision is structurally hard.

### Low-priority always-applicable moves (idea 6)

The budget fields in the manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
let an agency be marked as expensive or low-priority. The plan's
default discipline is to prefer the specific over the generic,
which is the structural form of "always-applicable methods carry
low priority."

---

## What the implementation does not yet take into account

### A — No "stuck" signal

Idea 3 requires a way to know that ordinary methods are exhausted.
The plan has critics that judge proposals, but no critic whose
brief is "this society has been failing to make progress on this
input for N ticks." Without a stuck-detector, the wilder-methods
phase cannot be conditionally entered.

### B — No reservoir of last-resort techniques

Brainstorming, lateral thinking, and meditation have no agency
family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).
A society with eight ordinary families has nothing labelled as
"only for when stuck." The reservoir Minsky describes is absent.

### C — Novice-cost not tracked

Idea 4 — that switching views demotes the solver to novice — is
not represented. When a new agency is differentiated via
`agency.meta-admin.differentiation-broker`, no field records that
its judgements should be discounted while it is young. A
freshly-differentiated agency speaks with the same weight as an
established one.

### D — The principle of exceptions has no protocol

Idea 5 calls for resistance to over-fitting on a single strange
experience. The reinforcement log in `evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
records outcomes but does not weight them; one anomalous outcome
could in principle drive an evolution proposal as much as a hundred
ordinary ones. The plan does not formalise "rare event, do not
re-tune from this alone."

### E — Restart / rest / wait are not low-priority by schema

The "always applicable" moves Minsky warns against — restart,
wait, take a rest — have no schema marker that says "this move
applies to anything, therefore it must be deprioritised." Their
status is convention, not policy.

---

## Summary table

| # | Idea from §14.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Reformulation is cheap once practised | Yes | K-lines + `restore_when`. |
| 2 | Give-up decision is hard | Yes (deferred) | Routed to `human`. |
| 3 | Wilder methods are last resort | No | No stuck-detector (gap A). |
| 4 | Reframing demotes solver to novice | No | No novice discount on new agencies (gap C). |
| 5 | Principle of exceptions | Partial | Log exists; no rare-event policy (gap D). |
| 6 | Always-applicable methods are suspect | Partial | Budgets help; no schema marker (gap E). |

---

## Implication for the plan (no changes proposed here)

§14.4 governs the *transition* between ordinary and last-resort
reasoning. The implementation has the entry condition wrong way
round: it can escalate to `human` when stuck but it cannot escalate
to *wilder internal methods* first, because there is no stuck
signal and no reservoir of last-resort agencies. The biggest gap is
A: nothing notices the society is stuck. The next is C: novice
agencies are not discounted while they settle in. Both have
operational form (a critic, a manifest field) but neither exists.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the critic family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the policy file in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and the reinforcement log in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
