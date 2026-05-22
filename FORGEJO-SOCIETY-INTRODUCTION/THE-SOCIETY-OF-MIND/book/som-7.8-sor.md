# Section 7.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-7.8.md](som-7.8.md) — *Difference-engines*
(Minsky, §7.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§7.8 introduces the difference-engine: Minsky's operational answer to
"what could a goal be made of?" A difference-engine has three parts —
a description of a desired situation, subagents aroused by gaps
between the desired and the actual, and a tendency in each subagent
to diminish the gap that aroused it. This shape is, for Minsky, the
*simplest mechanism that looks goal-directed from outside*.

---

## The ideas Section 7.8 actually carries

1. **"Goal" is a portmanteau word.** It mixes purpose,
   persistence, directedness, and indifference-to-distraction in a
   single label.
2. **A goal-driven system treats stimuli as obstacles or
   resources.** It does not merely react; it filters the world
   through what does not yet exist.
3. **Persistence under interference is one mark of goal.** Diverted
   from its course, the system tries to remove, route around, or
   reuse the interference.
4. **The difference-engine has three parts.** A *description* of a
   desired situation, *subagents* aroused by particular differences,
   and *actions* that reduce the difference that aroused each
   subagent.
5. **Goals emerge from the interactions of many agencies.** The
   felt complexity of human goals (ambition, frustration) is *not*
   in the goal mechanism itself but in the surrounding society.
6. **Most agents are already concerned with differences.** The
   four-way relationship is simpler than it first looks because
   difference-detection is what most agents already do.

---

## What the implementation already absorbs

### Stimuli are filtered, not merely consumed (idea 2)

The `perceive` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
turns a raw event into a typed stimulus, and `activate` matches it
against frames whose `activates_on` fields are *differences and
features*, not the raw payload
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The society does treat incoming things as objects to classify and
exploit, not as forces to react to.

### Persistence under interference (idea 3) — via the workflow loop

The `deliberate → criticize → censor → settle` chain
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
permits a proposal to be revised in light of objections rather than
abandoned. Critic objections, suppressor activations, and unresolved
unknowns are interferences the loop is designed to route around.
The shape of persistence is operational, even if its motivation is
not.

### Difference-detection as the dominant agency mode (idea 6)

Critics in particular are difference-detectors: they read a
proposal and a context and emit objections when those diverge
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
"Critics"). Memory agencies detect divergences between current and
prior states. Censors detect divergences from policy. Most of the
catalogue is already a population of difference-detectors.

### Composite goal-like behaviour from many agencies (idea 5)

The settlement layer
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
turns a population of partial signals into a single named decision.
From outside, that decision looks goal-directed; from inside, it is
the product of many independent reductions. This matches Minsky's
claim that goal-character is emergent.

---

## What the implementation does not yet take into account

### A — No "description of a desired situation"

Idea 4's first part is the load-bearing one: a difference-engine
needs a *target*. The plan has no manifest field, settlement slot,
or memory record that says *what the desired state is*. An agency
manifest has `outputs` and `activates_on`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but no `desired:` block. A frame has `slots` it must fill and
`failure_conditions` it must avoid
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
but no positive *image of done*. The closest analogue is the
`commitments` list in a settlement, which is a record of *what was
decided*, not a description of *what should obtain*.

### B — Difference is detected but rarely measured

Idea 4's second part requires *the* difference between desired and
actual to be a scalar an agency can reduce. The plan's critics
*classify* divergence (objection severity: `low | medium | high`)
but do not *quantify* the gap. Without a measurable difference
there is no gradient for a subagent to descend.

### C — No subagent population *paired to* differences

Idea 4's third part is the pairing: each subagent should be aroused
by *one specific* difference and should act to reduce *that*
difference. The plan's critics are paired to *categories of
objection* (evidence, style, blast-radius), not to *gaps from a
target*. A critic that detected the gap between a proposal and a
declared desired state does not currently exist in the catalogue.

### D — Goals are not first-class records

Idea 1 — that "goal" is a useful portmanteau — implies that the
plan should at least *have* the portmanteau. It does not. The
identity protocol
([`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md))
has no `goal` scope; the workspace
([`THE-SOCIETY-OF-REPO/07-workspace/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/07-workspace/))
has no `goals/` directory. Purposes exist implicitly inside frames
and settlements; they are never named, ranked, or tracked across
cycles.

### E — Felt complexity has no analogue (idea 5)

Idea 5 attributes the *felt* texture of goal pursuit (ambition,
frustration, satisfaction) to the *interactions among many
agencies*. The voice rules in [AGENTS.md](../../../AGENTS.md)
correctly forbid representing those feelings, but the *structural*
side-effects Minsky points to — accumulated tension across cycles,
shared expectations between agencies — are also absent. A society
that has been failing at one class of stimulus for many cycles has
no aggregated *state* recording that fact.

### F — Persistence is loop-driven, not goal-driven

Idea 3's persistence — *attempts continue until the goal is met* —
is, in the plan, *cycle-driven*: each cycle starts from a stimulus,
and persistence across cycles depends on an external scheduler
resending similar stimuli. The plan has no agency that *initiates*
a new cycle because a previous cycle's goal was not yet achieved.
Persistence is reactive, not goal-pursued.

---

## Summary table

| # | Idea from §7.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | "Goal" is a useful portmanteau | No | No `goal` scope, slot, or directory (gap D). |
| 2 | Goal-driven systems filter stimuli | Yes | `perceive`/`activate` filter by features and frames. |
| 3 | Persistence under interference | Partial | Per-cycle loop persists; cross-cycle pursuit absent (gap F). |
| 4 | Three parts: description, subagents, reductions | No | No desired-state slot (gap A); no scalar gap (gap B); no paired subagents (gap C). |
| 5 | Composite agencies make goal-character | Partial | Settlement composes signals; cross-cycle tension absent (gap E). |
| 6 | Most agents are difference-detectors | Yes | Critics, suppressors, memory agencies. |

---

## Implication for the plan (no changes proposed here)

§7.8 supplies the operational answer to the §1.1 *Intention* gap
(gap E there). The plan has six of the seven pieces a difference-
engine needs — perception, classification, multiple difference-
detectors, settlement, persistence within a cycle, and a population
of agencies that compose into goal-like behaviour — but lacks the
seventh, *a description of a desired situation*. That single
absence is what reduces the plan to a *reactive* difference engine
rather than a *driven* one. The other §7.8 gaps (cross-cycle
pursuit, scalar gap, paired subagents, cross-cycle tension) are
downstream of it: each is hard to add until the desired-state slot
exists.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the handoff and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the identity protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md),
and possibly the workspace layout in
[`THE-SOCIETY-OF-REPO/07-workspace/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/07-workspace/),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
