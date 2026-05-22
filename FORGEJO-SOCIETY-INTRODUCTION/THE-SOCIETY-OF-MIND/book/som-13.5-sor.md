# Section 13.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-13.5.md](som-13.5.md) — *Learning a Script* (Minsky, §13.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§13.5 names a specific kind of learning: *script-bridging*. When a
skill is repeated, the elaborate original procedure is replaced by
a shorter *script* that produces the same observable lines but
skips the intermediate deliberation. Practice does not just polish
the skill; it shortens it, freeing thought to attend to something
else.

---

## The ideas Section 13.5 actually carries

1. **Practice changes the procedure, not just the speed.** What
   becomes faster is a *different program*, not the same program
   running quicker.
2. **Bridging skips deliberation.** The script contains only the
   steps that actually produce output; the intermediate "how to
   decide" steps are gone.
3. **Expertise is reading a script, not deciding.** Experts engage
   "scarcely any thought at all".
4. **Bridging frees attention for higher-order work.** The thought
   the script no longer needs can be spent representing what the
   picture-people are *doing*.
5. **Counterintuitive: more knowledge ought to mean slower
   choice.** Practice's speed-up is a real puzzle, not an
   obvious effect.

---

## What the implementation already absorbs

### K-lines are compiled scripts (ideas 1, 2)

A K-line in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
records the `activation_snapshot` and `useful_context` of a past
success so that the next matching stimulus can skip the rediscovery
work. The `klines.ts` reactivation in the `activate` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
preloads the same agency weights and the same files-to-read,
shortening the deliberation. This is the plan's nearest analogue to
a script.

### Reuse statistics exist (idea 1)

`reuse_count`, `last_reused_at`, and `decay_score` on each K-line
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
record that practice happened. Reinforcement is logged
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).

### Attention can shift up the stack (idea 4)

The integration family — `agency.assembly.summary-tier-1/2`,
`agency.integration.conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
— is the structural place where, once lower work is compressed,
higher-level synthesis happens. The architecture supports a
"frees-up-attention" pattern even if no metric drives it.

### Decisions are auditable as procedures (idea 3)

Every run leaves a per-stimulus trace in `state/mind/issues/<n>/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
A reviewer can compare the long form of an early run against the
short form of a later one. Expertise is at least *observable* in the
trace lengths.

---

## What the implementation does not yet take into account

### A — K-lines do not actually shorten the procedure

When a K-line reactivates, it pre-biases agency weights and
pre-suggests context. It does *not* skip phases of the runtime
pipeline. `perceive`, `activate`, `deliberate`, `criticize`,
`censor`, `settle`, `act`, `remember`, `report` all still run. The
script-bridging Minsky describes — fewer *steps* — is not present;
only fewer *unknowns* within the same steps.

### B — No "skip deliberation if confident" gate

There is no equivalent of an expert script: when a K-line's
similarity to the current stimulus is high and its prior outcome
was clean, the plan does not authorise a shorter pipeline. The
`activate` phase boosts but does not bypass. The architecture
treats every stimulus with the full machinery.

### C — Practice statistics do not modify behaviour

§13.5 says practice *causes* a shorter program. The plan logs
practice in `reuse_count` and decays it via the scheduled pass
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
but no agency adjusts its own prompt, weight, or critic-set in
response to its own reinforcement history. Reinforcement is *logged*
without being *applied* — the same gap §1.1 already named.

### D — Attention freed is not measured or redirected

The integration family exists, but the plan has no metric of "this
stimulus took less attention than its analogue did last quarter, so
more attention may be spent on inter-stimulus integration." The
budget field on agencies
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is a per-run cap, not a freed-attention surplus.

### E — Expertise is not separable from memory hits

In §13.5 expertise is a *property of the procedure* — it persists
even when the original deliberation is no longer accessible. In the
plan, expertise lives in K-line attachments: if the relevant K-line
is decayed or absent, the expertise is gone. The plan has no
"compiled prompt" surface — a `procedural/expertise/<topic>.md`
that survives K-line decay and carries the abridged script.

---

## Summary table

| # | Idea from §13.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Practice produces a different (shorter) procedure | Partial | K-line preloads exist; pipeline length unchanged (gap A). |
| 2 | Bridging skips deliberation | No | No confidence gate that skips phases (gap B). |
| 3 | Expertise = reading a script | Partial | Per-stimulus traces auditable; no separable script artefact (gap E). |
| 4 | Bridging frees attention | Partial | Integration family exists; no metric of freed attention (gap D). |
| 5 | The speed-up is non-obvious | Acknowledged | Counts are logged; the *mechanism* is not closed (gap C). |

---

## Implication for the plan (no changes proposed here)

§13.5 separates two things the implementation currently fuses:
*recalling a past configuration* and *running a shorter procedure*.
K-lines do the first; nothing does the second. The plan also
preserves the recurring §1.1 issue: reinforcement is recorded but
does not modify behaviour, so the "practice" loop is not closed.
Any move to close these would touch the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
(a confidence-gated bypass), the K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and the `procedural/` tree in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and so falls under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
