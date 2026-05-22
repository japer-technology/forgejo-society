# Section 8.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.2.md](som-8.2.md) — *Re-membering*
(Minsky, §8.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.2 is the section that asks what happens when a K-line is
reactivated alongside an already-active configuration. The mechanism
of remembering produces *two simultaneously active sets of agents*,
and that produces conflict.

---

## The ideas Section 8.2 actually carries

1. **Reactivation overlays, it does not replace.** When K-line `kP`
   fires for current problem `Q`, the result is `P-agents ∪ Q-agents`
   active at once.
2. **Similarity recognition triggers reactivation.** "Something in
   your mind suspects that Q is similar to P." The K-line does not
   fire by content; it fires because something matched.
3. **Co-activation is intended to be cooperative.** "If everything
   goes well, perhaps both sets of agents will work together."
4. **But co-activation often produces conflict.** Neighbouring
   agents tend to disagree. Conflict is the default outcome, not the
   exception.
5. **Three policies for resolving the conflict.** K-line priority;
   present priority; noncompromise (suppress both). Each is named,
   each is wrong in different cases, and Minsky shows the diagram
   with all three.
6. **No simple strategy is ideal.** The truly correct policy —
   activate exactly those P-agents that would help with the present
   problem — is beyond any cheap rule.

---

## What the implementation already absorbs

### Overlay, not replacement (idea 1)

The activation step in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
boosts activation weights for agencies named in the matched K-line's
`activation_snapshot`; it does not zero out the agencies that the
current stimulus already woke. The resulting `activation.jsonl`
contains both the polyneme-driven activation and the K-line-driven
boost. This is Minsky's overlay.

### Similarity-driven trigger (idea 2)

`klines.ts` computes a similarity score between the current stimulus
cue and each K-line's `restore_when`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
It does not consult the K-line's *content* before deciding to fire;
match comes first. This matches "something suspects Q is similar to
P."

### Conflict has named outputs (idea 4)

The plan acknowledges conflict as a first-class artefact: critics
emit objections, censors block, suppressors halt outputs
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The settlement record carries `inhibited:` with `weight_delta` and
`reason`. Disagreement is observed.

### A noncompromise principle exists (idea 5, partial)

[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
treats danger-zone censors as fail-closed: when two routes lead to
conflict over a forbidden region, the result is a *blocked*
settlement, not a compromise. This is one of Minsky's three policies
("suppress both") encoded as the safety default.

---

## What the implementation does not yet take into account

### A — The three policies are not named choices

Minsky enumerates three resolution policies for K-line-vs-present
conflict (K-line priority, present priority, noncompromise) and
shows that each is wrong in different cases. The plan has *one*
policy, lurking in the criticize and censor passes: present
proposals win unless a critic sustains an objection or a censor
blocks. There is no place where a frame can declare "for this kind
of stimulus, the K-line's view should override the present
configuration" (e.g. for a memory recall request), nor a place where
"present priority" is explicitly stated as the default. The policy
exists; the *choice* between policies does not.

### B — Co-activation is not measured

Idea 3 is that co-activation is *intended to be cooperative*. The
plan boosts the K-line's agencies and lets them emit signals
alongside the present-state agencies; nothing checks whether the two
sets actually cooperated. There is no per-cycle "shared blackboard
contribution from K-line agencies vs from present agencies" metric.
A K-line that fires, boosts an agency, and then has the agency
contribute nothing to the settlement is indistinguishable from a
K-line that genuinely helped — until credit assignment runs, by
which point the cycle is over.

### C — "Overwhelm" is not bounded

Minsky's warning is direct: do not let K-lines rearouse old states
*so strongly that they overwhelm present thoughts*. The plan caps
the *number* of K-lines loaded (`memory.max_k_lines_loaded`) and the
boost weight per agency in `activation_snapshot`. It does not cap
the *total* K-line-derived activation as a fraction of the cycle's
activation budget. Five well-matched K-lines could in principle
drown the present-stimulus polynemes; nothing in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
or
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
prevents that.

### D — Selective reactivation is the unsolved problem

Idea 6 names the ideal — activate *exactly those* P-agents that
would help with the present problem — and admits it is too much to
ask of a simple strategy. The plan's strategy is also simple: load
the whole `activation_snapshot`. There is no mechanism for partial
K-line firing, where only some attached agencies are boosted based
on a secondary match against the present stimulus. The plan is on
the honest side of the trade-off (load everything, let critics
prune), but it has not represented the trade-off as a *choice*.

### E — The current stimulus does not have a K-line of its own

Minsky's diagram has `kP` for the past and `Q` for the present. The
plan has K-lines for `P` but no analogous structure for the still-
forming present. The settlement, when written, *becomes* a K-line —
but during deliberation there is no "present-side K-line" the
society could compare against the past one. Conflict resolution
therefore happens between an *explicit* past representation and an
*implicit* present one, which makes the conflict less symmetric than
Minsky's picture.

---

## Summary table

| # | Idea from §8.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Reactivation overlays, not replaces | Yes | Boost-without-zero in `klines.ts`. |
| 2 | Similarity-driven trigger | Yes | `restore_when` match score. |
| 3 | Co-activation intended to cooperate | Partial | Boost happens; cooperation not measured (gap B). |
| 4 | Conflict is the default outcome | Yes | Critics, censors, suppressors, settlement `inhibited:`. |
| 5 | Three named resolution policies | Partial | One implicit policy + danger-zone block (gap A). |
| 6 | No simple strategy is ideal | Partial | Plan uses the simple strategy without flagging the trade-off (gap D). |
| — | Cap on K-line overwhelm | Partial | Per-K-line cap exists; total-fraction cap does not (gap C). |
| — | Symmetric past/present representation | No | Present has no K-line until settled (gap E). |

---

## Implication for the plan (no changes proposed here)

§8.2 turns the K-line from a storage device into a *participant* in
the present cycle. The plan absorbs the participation cleanly
(overlay, similarity trigger, conflict as observed artefact) but
treats the resolution policy as a single fixed default rather than
as a frame-level choice between Minsky's three. The plan also does
not bound the *total* K-line contribution to a cycle. Closing these
would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(per-frame conflict policy field, total-activation cap) and
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
(memory-overwhelm as a safety class), and would interact with
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
