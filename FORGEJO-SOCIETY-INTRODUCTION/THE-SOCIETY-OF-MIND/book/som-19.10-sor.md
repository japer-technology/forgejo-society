# Section 19.10 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-19.10.md](som-19.10.md) — *Closing the ring*
(Minsky, §19.10).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§19.10 closes the chapter by closing the loop. Polynemes excite
partial states across agencies; recognizers over those partial states
re-excite the polyneme; the polyneme re-excites the agencies — and a
*more complete impression* of the original thing is hallucinated from
a fragment of its parts. Minsky calls this **reminding**, and insists
that the memory systems are powerful *because they are not
constrained to be perfect.*

---

## The ideas Section 19.10 actually carries

1. **A loop, not a chain.** Polyneme → partial states → recognizer
   → polyneme → more partial states.
2. **Pattern completion from a fragment.** A few cues reconstruct
   "a more complete impression, simulus, or hallucination."
3. **Reminding is a primitive.** It is a *named* operation of the
   loop, not a side effect.
4. **Threshold recognition allows the loop to close.** Requiring
   three of five (not all five) is what lets a fragment trigger
   completion.
5. **The loop is not magic.** It is societies of agents recognising
   when their requirements are met.
6. **Imperfection is a feature.** Power comes from being allowed to
   guess wrong.

---

## What the implementation already absorbs

### A loop exists (idea 1, partly)

The runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is a loop in time across a run (perceive → activate → deliberate →
criticise → censor → settle → act → remember → report) and across
runs via memory promotion. K-line reactivation in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
uses the *cue → reactivation → preloaded context* shape to bring back
prior configurations.

### Threshold-flavoured matching (idea 4)

Frames match on `any_signals` / `any_labels` / `any_paths` /
`any_phrases`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md));
K-lines match on `restore_when.any_*`. Neither requires all features
to be present. This is the "three of five" tolerance that allows a
fragment to trigger reactivation.

### Imperfection accepted (idea 6)

The whole apparatus of critics
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and graduated inhibition
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
presupposes that activations may be wrong and need correction. The
authority gradient (`read`, `draft`, `propose`, `act`, `govern`,
`human`) lets the society generate *guesses* at `draft`/`propose`
and convert them to action only after challenge.

### Pattern completion at the K-line level (idea 2, partly)

A K-line cue is a *fragment* (some terms, some labels, some paths,
some symbols) and its reactivation restores a *larger* configuration
(activation snapshot + useful context + prior settlements + prior
K-lines). This is structurally pattern completion — at the level of
prior cases, not at the level of property axes.

---

## What the implementation does not yet take into account

### A — The ring does not close inside a single run

Idea 1's loop runs *within recognition*: features → polyneme →
features. The plan's loop runs *across phases* (perceive → activate →
…). There is no within-stimulus feedback step in which fired
agencies' partial states re-excite the polynemes that fired them. The
graduated-inhibition step is the closest, but it goes one direction
(objections lower weights), not in a circle.

### B — No *reminding* primitive

Idea 3 wants a named operation. The plan has K-line reactivation,
which is *one half* of reminding (cue → configuration). It does not
have the second half: the reactivated configuration triggering a
*re-cue* that surfaces still more associated material. K-line
reactivation runs once per stimulus
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).

### C — No simulus

Idea 2's "more complete impression, simulus, or hallucination"
implies a constructed inner artifact that is *experienced by the rest
of the system as the original.* The plan has `blackboard.md` and
`signals.jsonl`, which are *summaries*, not reconstructions. There is
no agency whose job is to produce an *imagined-but-coherent* version
of the absent referent for downstream agencies to react to.

### D — Loop convergence is not bounded

If the ring closed (gap A), it would also need a stopping condition.
The plan has budgets (`budget.max_tool_calls`, `max_wall_clock_s` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
that bound *agency calls* but nothing that bounds *iteration depth*
of a recognition-reactivation loop. This is a future-tense concern.

### E — Imperfection is logged, not prized

Idea 6 — "powerful because they're not constrained to be perfect" —
is honoured in spirit. But the plan does not have a place where being
wrong is *valued*. Critics object to wrongness; settlements record it
in `decision.caveat`; nothing celebrates a productive miss as a
signal of useful loose coupling. (Closely related to §1.1 gap D.)

---

## Summary table

| # | Idea from §19.10 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Closed loop (polyneme ↔ partial states) | Partial | Pipeline is a loop in time; not within recognition (gap A). |
| 2 | Pattern completion from a fragment | Partial | K-line reactivation; no constructed "simulus" (gap C). |
| 3 | Reminding as a named primitive | No | One-shot K-line activation only (gap B). |
| 4 | Threshold matching enables the loop | Yes | `any_*` matchers everywhere. |
| 5 | Loop made of societies of agents | Yes | Frames + polynemes + K-lines + critics. |
| 6 | Imperfection is a feature | Partial | Tolerated and logged; not prized (gap E). |
| — | Loop convergence / depth bound | No | Budgets are per-agency, not per-loop (gap D). |

---

## Implication for the plan (no changes proposed here)

§19.10 names the operation — *reminding* — that the rest of the
chapter has been building toward. The plan has the parts (polynemes,
K-lines, frames, critics, weighted matching) but does not yet close
the ring inside a single recognition. The two structural openings
are: (1) a within-stimulus re-cue pass after K-line reactivation, in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md);
and (2) a *simulus* artefact — a coherent inner reconstruction —
authored by a dedicated agency in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md).
Either would also touch the K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the K-line deep dive at
[`THE-SOCIETY-OF-REPO/deep-dive/klines.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/deep-dive/klines.md),
the activation protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
