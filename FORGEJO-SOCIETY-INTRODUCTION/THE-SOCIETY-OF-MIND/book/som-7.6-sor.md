# Section 7.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-7.6.md](som-7.6.md) — *Reinforcement and
reward* (Minsky, §7.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§7.6 reports the failure of *Snarc*, Minsky's own reward-only
learning machine. Snarc could learn simple mazes but never hard
problems, because hard problems require trying bad moves before
finding good ones, and an undifferentiated end-of-task reward
reinforces those bad moves equally with the good. The section is the
*operational* case against pure reinforcement that §7.5 made
conceptually.

---

## The ideas Section 7.6 actually carries

1. **Familiarity heuristic.** Doing things we have done before is
   easier; learning should make that easier still.
2. **Reward as connection-strengthening.** A first model: if A
   aroused B, reward strengthens A→B and weakens A→other.
3. **Snarc's limit.** Such a machine solves easy mazes but cannot
   learn tower-building or chess.
4. **Reuse-in-different-contexts is essential.** A limited-size
   machine must reuse the same agent for different jobs at different
   moments.
5. **Good and bad cancel.** When the same agent makes a good
   suggestion in one context and a bad one in another, undifferent-
   iated reinforcement averages them away.
6. **The hard-problem dilemma.** Hard problems by definition involve
   bad moves on the way to good ones; short-window reward learns
   only short solutions; long-window reward reinforces the bad moves
   too.
7. **Indiscriminate reinforcement cannot work.** No tuning of the
   reward window saves the scheme; the answer must lie elsewhere,
   in agency-level *policies* for accomplishing goals.
8. **Distinguish individual learning from species learning.**
   Beavers and termites build complex structures, but as species,
   not as learners. Individual multi-step learning is rare.

---

## What the implementation already absorbs

### Familiarity through K-lines

Idea 1 (we find familiar things easier) is exactly what K-lines
provide
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
"K-lines"). When a current cue matches a prior winning
configuration's `restore_when`, the prior agencies' activations are
boosted and the prior `useful_context.files_read` is preloaded.
Familiarity is a structural shortcut, not a reinforcement effect.

### Reuse in different contexts

Idea 4: the same agency is reused across many stimuli with different
roles. The manifest schema
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
gives each agency a single behaviour body but allows context-
dependent activation via `activates_on.signals`, `activates_on.frames`,
and `activates_on.paths`. The *frame* is what gives the same agency a
different role in different situations — exactly the Snarc-saving
distinction Minsky's section foreshadows.

### Context-aware credit assignment

Idea 5 (good/bad cancellation) is avoided by attaching credit to the
specific *settlement* and *cycle*, not to the agency in the abstract.
`credit-assignment.ts`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Credit assignment") writes per-attribution updates that name the
stimulus and frame; an agency's record in
`evolution/reinforcement-log.md` is therefore time-stamped and
context-stamped, not summed.

### Frame-scoped policies, not reward gradients

Idea 7 says reward-shaping cannot save reinforcement; the answer is
*policies*. The plan implements policies at frame granularity:
`default_critics`, `default_censors`, `failure_conditions`, and
required `slots` are all properties of the frame, not of the
agency
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
"Frames"). An agency's *behaviour in a given context* is determined
by which frame governs that context. This is the operational answer
Minsky points toward.

### Individual versus species learning

Idea 8 maps clearly onto the plan's distinction between in-loop
reinforcement and `self-modification` settlements
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
"Danger zones"). Routine reinforcement is the "individual" channel;
governed structural change is the "species" channel, requiring human
confirmation. The two channels are explicitly separated.

---

## What the implementation does not yet take into account

### A — Snarc's lesson is honoured by absence, not by structure

The plan avoids Snarc's failure mode mostly by *not* doing
within-loop reinforcement at all. As earlier analyses note (§1.1
gap D, §7.5 gap A), `evolution/reinforcement-log.md` accumulates
records but does not update agency weights. This is *safe* — it
cannot fail the way Snarc failed — but it also means the plan has
not yet had to face the question §7.6 actually answers: when
reinforcement *is* finally applied, what saves it from cancellation?

### B — No per-context weight on the A→B relationship

Idea 2 frames reinforcement as strengthening *connections*. The plan
has `activates_on` and `inhibits` lists on each agency
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but no *weighted* edge between agencies. Connections exist; their
*strengths* do not. Without weights, even a future reinforcement loop
has no scalar to update.

### C — Reward window is undefined

Idea 6's dilemma (short window misses long problems; long window
reinforces bad moves) presumes a *window*. The plan does not yet
declare one. When credit assignment writes attributions, it does so
at *settlement boundary*, which is closer to long-window than to
short-window, but no policy file (`policies/memory-policy.yml` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
sets the reward horizon for hypothetical future use.

### D — No per-cycle move tagging

Idea 5's cancellation problem requires the ability to say *this
particular move, in this particular context, was bad*. The plan
records signals, handoffs, and objections per cycle in
`state/.../signals.jsonl`, `handoffs.jsonl`, and `objections.jsonl`,
but does not tag *individual moves* with their eventual contribution
to outcome. Credit assignment operates at agency-and-K-line
granularity, not move-by-move
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Credit assignment"). When the loop finally closes, this granularity
gap will reappear as cancellation.

### E — No exploration/exploitation distinction

§7.6 implicitly relies on a *distinction* between trying-bad-moves
(exploration) and using-known-good-moves (exploitation). The plan
ships pure exploitation: K-lines, frames, and analogies all bias
toward what worked before. There is no exploration policy, no field
on the deliberate cycle that says "this cycle is exploratory; treat
its outcomes differently." A future reinforcement loop without this
field will have no way to spare exploratory failures from negative
credit.

### F — Species learning is human-gated, not collective

Idea 8 reflects on species-level accumulation. The plan's
`self-modification` channel requires *human confirmation*
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
"Approval gate"). There is no representation of *collective* or
*federated* learning across societies — an instance's manifest
catalogue cannot benefit from another instance's discoveries
without manual import. The federation material under
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
is where this would eventually live and at present does not.

---

## Summary table

| # | Idea from §7.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Familiarity heuristic | Yes | K-line reactivation in the `activate` phase. |
| 2 | Reward strengthens A→B | No | No weighted connections between agencies (gap B). |
| 3 | Snarc's limit on hard problems | Avoided | No active reinforcement loop yet; Snarc's failure cannot reach the plan (gap A). |
| 4 | Reuse in different contexts | Yes | Same agency, different frame; context comes from frame, not from agency. |
| 5 | Good/bad cancellation | Partial | Credit is settlement-stamped; per-move tagging absent (gap D). |
| 6 | Reward-window dilemma | Not yet faced | Window undeclared because reinforcement is logged not applied (gap C). |
| 7 | Indiscriminate reinforcement fails | Acknowledged | Plan answers with frame-scoped policies. |
| 8 | Individual vs species learning | Partial | Self-modification channel exists; federated collective learning absent (gap F). No exploration field (gap E). |

---

## Implication for the plan (no changes proposed here)

§7.6 is the section the plan's deferred reinforcement loop will have
to satisfy when it is finally built. The good news is that the
operational answer Minsky points toward — *frame-scoped policies
rather than reward gradients* — is already the plan's primary
structure for context-dependent behaviour. The pending work is to
prepare the substrate so that, when reinforcement is applied (gap A
in §7.5, gap A here), it can avoid Snarc's failure:

- weighted edges instead of bare lists (gap B),
- per-move tagging instead of settlement-stamped credit (gap D),
- a declared exploration policy (gap E),
- and a chosen reward window (gap C).

The federation question (gap F) is its own area. None of these are
urgent; all are conditions a careful loop-closing would have to meet.

These are recorded here as analysis, not as a change request. Closing
any of them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
the evolution tree in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
the signal and handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and possibly the federation material in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
