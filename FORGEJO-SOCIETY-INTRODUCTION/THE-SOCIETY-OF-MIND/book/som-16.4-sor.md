# Section 16.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-16.4.md](som-16.4.md) — *Cross-exclusion*
(Minsky, §16.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§16.4 attacks the obvious arbitration scheme — a central marketplace
of urgencies — and shows it produces fatal oscillation between
nearly-equal needs. The proposed alternative is *cross-exclusion*:
each member of a competing group sends inhibitory signals to the
others. The winner's advantage compounds; the others are locked out.
Cross-exclusion also doubles as a short-term memory unit: once
captured, the state persists until something stronger displaces it,
and when it does, no trace of the previous state remains.

---

## The ideas Section 16.4 actually carries

1. **One body, one direction.** A single-bodied animal can only
   pursue one goal at a time; arbitration is therefore unavoidable.
2. **The marketplace fails.** A "highest bidder takes control"
   strategy oscillates pathologically when two needs are nearly
   equal; each satisfied bite tips the balance the other way.
3. **Cross-exclusion as arbitration.** Each member of a competing
   group inhibits the others; the most active member's inhibition
   weakens its rivals' inhibitions in turn.
4. **The avalanche effect.** Small initial advantages amplify rapidly
   into total lockout.
5. **Cross-exclusion is the basis of *noncompromise*.** Where this
   arrangement holds, the winner truly wins; there is no blended
   action.
6. **Short-term memory as locked state.** Once an agent of a
   cross-exclusion group is active, it remains active and the others
   remain suppressed, until a strong external influence changes it.
7. **No trace of the prior state.** When the state finally flips,
   nothing remains of what was there before.

---

## What the implementation already absorbs

### Arbitration as a real, scheduled step (ideas 1, 3)

The runtime pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
makes arbitration explicit: the `criticize` phase recomputes
activation, the `censor` phase mechanically prunes the tool surface,
and the `settle` phase produces *one* settlement record per stimulus.
The conscious presenter is the single producer of visible response.
There is no parallel-action path.

### Inhibition as a first-class manifest field (idea 3)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
includes `inhibits:` in every agency manifest. Polynemes in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
carry both `excite:` and `inhibit:` weights. Signals in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
have `suggested_effects.inhibit:`. Cross-agency inhibition is a
permitted, declared shape.

### Avalanche amplification through cycle re-computation (idea 4)

The deliberate loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
recomputes activation each cycle:
`activation = recompute_activation(workspace)`. An inhibitory signal
applied in cycle *n* weakens the inhibited agency for cycle *n+1*,
which weakens *its* inhibitions, which is precisely the avalanche
shape Minsky describes — over cycles, not over wall-clock.

### Noncompromise at the action boundary (idea 5)

The conscious bottleneck in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
guarantees a single coherent response. The settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
records `action_authorised:` as a single object with one `kind:`. No
blended action is representable.

### Short-term locked state (idea 6)

`workspace/current-focus/current.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
holds *the single stimulus currently being processed*. The workflow
`concurrency:` group in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
isolates one stimulus per group key, with `cancel-in-progress: false`
— once a stimulus has captured the runtime, it holds it through
settlement.

---

## What the implementation does not yet take into account

### A — No representation of competing-group membership

`inhibits:` lets agency X inhibit agency Y, but it does not declare
that X and Y belong to a *cross-exclusion group* in which mutual
inhibition is symmetric and exhaustive. Idea 3 depends on the *group*
as a structural unit. The plan has individual inhibition edges, not
groups.

### B — Marketplace failure is not modelled as a forbidden pattern

Idea 2 is a warning about a *specific* arbitration architecture that
oscillates. The plan does not use the marketplace pattern, but it
also does not name it as a forbidden pattern. A future change that
weighted-summed competing signals could reintroduce the failure;
nothing flags this.

### C — Avalanche amplification has no damping

The avalanche is welcome when it converges quickly to a single
winner; it is dangerous when it converges *too* quickly on the wrong
winner, since the loser's signal becomes structurally invisible. The
plan does not have a *minimum-disagreement window* that forces the
loop to keep losers alive for one extra cycle before locking them
out. Critics and censors do hold their objections through settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md):
`critics:` / `censors:` arrays), but that is preservation of objection
records, not of activation potential.

### D — Idea 7 is the opposite of the plan's audit posture

Minsky says when cross-exclusion flips, *no trace* of the previous
state remains. The plan's append-only memory
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and JSONL signal log
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
deliberately preserve the trace. This is a *chosen* divergence —
auditability over biological fidelity — and worth recording as such.

### E — Cross-exclusion as memory is not used as memory

Idea 6 reads cross-exclusion as a *short-term memory primitive*. The
plan does not use the inhibition graph as memory; short-term state is
held in workspace files instead. The two mechanisms could coexist,
but only one is built.

---

## Summary table

| # | Idea from §16.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | One body, one direction | Yes | Single workflow, single presenter, single settlement. |
| 2 | Marketplace fails | Implicit | Plan avoids it; failure pattern not named (gap B). |
| 3 | Cross-exclusion arbitration | Partial | `inhibits:` edges exist; competing-group structure does not (gap A). |
| 4 | Avalanche effect | Yes | Per-cycle activation recomputation produces lockout. |
| 5 | Noncompromise | Yes | Single `action_authorised:` slot. |
| 6 | Locked-state as short-term memory | No | Workspace files hold short-term state instead (gap E). |
| 7 | No trace when state flips | No (by design) | Append-only memory preserves traces (gap D). |
|   | Damping of avalanche | No | No minimum-disagreement window (gap C). |

---

## Implication for the plan (no changes proposed here)

§16.4 is the section where the plan and Minsky converge most
naturally: arbitration is real, inhibition is first-class, the
bottleneck is single. The deliberate loop is structurally close to a
cross-exclusion winner-take-all process over cycles.

The honest divergences are gap D (the plan preserves traces, by
choice) and gap E (the plan uses files rather than locked-activation
states for short-term memory, by choice). The substantive
opportunities are gap A — naming *competing groups* as a structural
unit — and gap C — damping the avalanche enough that a strong
near-loser is not silenced in cycle 1.

These are recorded here as analysis, not as a change request. Any
move to add competing-group declarations, an anti-marketplace
guardrail, or a minimum-disagreement window would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
