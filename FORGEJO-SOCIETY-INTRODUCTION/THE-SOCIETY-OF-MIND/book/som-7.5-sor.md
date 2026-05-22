# Section 7.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-7.5.md](som-7.5.md) — *Learning and memory*
(Minsky, §7.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§7.5 rejects pure reinforcement as a sufficient theory of human
learning. Pavlovian and Skinnerian schemes do not explain how *new*
behaviours arise, only how existing behaviours are selected. The
section also opens the credit-assignment problem: in a hard
multi-step solution, *which* of the many agents involved should be
rewarded or blamed?

---

## The ideas Section 7.5 actually carries

1. **Reinforcement-only learning is circular.** You cannot be
   rewarded for behaviour you have not yet produced; learning
   theories that assume reward as the sole driver beg the question.
2. **Conditioning links stimuli to existing behaviours.** Pavlov's
   experiments succeed precisely because *no new behaviour* is
   required.
3. **Operants exist but are not explained.** Skinner showed new
   behaviours can be reinforced, but the *production* of operants
   remains unexplained.
4. **Reward/punishment under-explains complex plans.** The twin
   pillars of operant conditioning do not account for plans humans
   form to solve problems that would otherwise take many lifetimes.
5. **Learning to learn.** The answer must lie in *better ways to
   learn* — meta-learning rather than primary reinforcement.
6. **Memory is plural and indispensable.** Any hard problem needs:
   short-term records of *what we just did* (to avoid repetition),
   *goal-tracking* (to avoid pointlessness), and *long-term
   records* (to reuse on similar problems later).
7. **The credit-assignment problem.** High-level agents do not know
   which low-level acts contributed; low-level agents do not know
   which high-level goals they served. Judgement must therefore live
   somewhere in between.

---

## What the implementation already absorbs

### Plural memory

The plan ships exactly the three memory roles Minsky names:

- **Short-term ("what we just did"):** `state/mind/issues/<n>/`
  (`signals.jsonl`, `candidate-actions.jsonl`, `objections.jsonl`,
  `workspace.md`, `blackboard.md` —
  [`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
  "state/"). Per-stimulus, append-only, swept after settlement.
- **Goal-tracking:** active settlements in
  `workspace/active-settlements/` and `workspace/owner-briefings/`
  (same file, "workspace/").
- **Long-term:** `memory/episodic/`, `memory/semantic/`,
  `memory/procedural/`, `memory/klines/`, `memory/decisions/`
  (same file, "memory/").

The three trees are deliberately separated in lifetime, write rules,
and content, which mirrors idea 6 closely.

### Credit assignment

The plan has a phase explicitly named for the problem.
`credit-assignment.ts` runs in the `remember` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Pipeline mapping table"; full procedure in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Credit assignment"). It attributes outcome credit to:

- the agencies that contributed proposals,
- the K-lines that were reactivated,
- the frame that was selected,
- the critics whose objections were sustained,

and records negative credit symmetrically. Minsky's idea 7 is named,
located, and given a file (`evolution/reinforcement-log.md`).

### New behaviour by self-modification

Idea 3 (operants need explaining) is partly answered by the
`self-modification` frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
and the meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
New agencies, new frames, and new policies are introduced through
governed settlements rather than via reinforcement. The plan thus
*acknowledges* that new behaviours come from outside the
reinforcement loop — by human-approved structural change.

### Meta-learning is named

Idea 5 (learning to learn) has a designated home in
`THE-SOCIETY-OF-REPO/10-evolution/` and in
`evolution/ecology-review.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"memory/"). Ecology review is the scheduled pass that proposes
*changes to how the society learns* — differentiation, retirement,
frame edits.

---

## What the implementation does not yet take into account

### A — Reinforcement is logged, not applied

The plan writes to `evolution/reinforcement-log.md` per settlement
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Credit assignment"), and updates `reuse_count` and `decay_score` on
K-lines, but no field on an *agency manifest* or *critic manifest* is
updated by reinforcement. An agency's prompt body, its
`activates_on`, its weights — none of these change as a result of
positive or negative credit. Reinforcement is therefore *recorded*
without being *consumed*. This is the same gap the §1.1 analysis
notes as gap D.

### B — No operant-production mechanism

Idea 3: where does *new behaviour* come from? The plan's answer is
"human-approved `self-modification` settlement," which is honest but
firmly outside the learning loop. There is no in-loop production of
novel behaviour, no random-variation mechanism, no exploratory pass.
The plan therefore reproduces precisely the gap §7.5 identifies in
conditioning theory.

### C — Goal-tracking does not survive across stimuli

Idea 6 names ongoing goal-tracking as one of the three indispensable
memories. The plan tracks goals *within* a stimulus (frame slots,
active-settlement state machine) but has no durable representation
of an *agency-level* or *society-level* ongoing goal that persists
across many stimuli. `governance/self-ideals.md` is the closest
analogue; it is static rather than tracked. A "what is the society
trying to accomplish over the next month?" record does not exist.

### D — Credit-assignment depth is bounded

The plan attributes credit to agencies, K-lines, frame, and
critics
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Credit assignment"). It does not yet attribute credit to
*polynemes* (which biased the frame selection) or to
*activation paths* (which signal led to which agency wake-up).
Minsky's idea 7 — that the assignment problem is hard precisely
because contributions span layers — is addressed at the outer
layers and unaddressed at the inner ones.

### E — Repetition-detection short-term role is implicit

Idea 6 lists "keep track of what we've just done — or else we might
repeat the same steps over and over." The deliberate cycle's
`max_cycles` cap and the per-cycle activation recomputation prevent
*runaway* loops, but no critic specifically inspects
`state/.../signals.jsonl` for *exact repetition* of prior cycles
within the same stimulus. A society that produced the same handoff
twice would not be flagged for it.

### F — Negative credit does not propagate to inhibition

Symmetric reinforcement is named
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Credit assignment": "reinforcement is always two-sided"), but the
plan has no mechanism by which sustained negative credit on an
agency raises *inhibitory* weight on its `inhibits:` field. The
inhibits list in the manifest schema
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is set by hand at agency creation and not updated by experience.

---

## Summary table

| # | Idea from §7.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Reinforcement-only learning is circular | Acknowledged | Plan does not rely on reinforcement as primary; `self-modification` is the source of new behaviour. |
| 2 | Conditioning links stimuli to existing behaviours | Yes | Polynemes and frames implement stimulus-to-behaviour linkage. |
| 3 | Operants exist but are unexplained | Partial | Self-modification introduces new behaviour, but only out-of-loop (gap B). |
| 4 | Reward/punishment under-explains complex plans | Acknowledged | Plan does not rely on it. |
| 5 | Learning to learn | Partial | Ecology review names meta-learning; reinforcement does not feed back into manifests (gap A). |
| 6 | Plural memory | Yes | Three trees (state/workspace/memory) with named roles. Cross-stimulus goal-tracking is missing (gap C). Exact-repetition critic missing (gap E). |
| 7 | Credit assignment | Partial | Phase exists; depth limited to agencies/K-lines/frame/critics (gap D); negative credit does not propagate to inhibition (gap F). |

---

## Implication for the plan (no changes proposed here)

§7.5 puts pressure on exactly the part of the plan that names itself
most boldly. *Reinforcement* appears as a log file, *credit
assignment* appears as a runtime module, *meta-learning* appears as
a scheduled pass — but none of these yet *change* anything that the
next stimulus encounters. The plan is a careful book-keeper of
learning without yet being a *learner*. Minsky's section forecasts
the diagnosis precisely: the structural pieces are in place, the
loop is not closed.

The cleanest single gap is A (reinforcement updates nothing). The
deepest is C (no durable goal across stimuli). Both have been
flagged in earlier analyses (§1.1 gap D), which suggests they are not
local oversights but a single architectural decision deferred for
later phases.

These are recorded here as analysis, not as a change request. Closing
any of them would touch the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
the evolution tree in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the workspace and memory trees in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and possibly the governance constitution, and so fall under the
"stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
