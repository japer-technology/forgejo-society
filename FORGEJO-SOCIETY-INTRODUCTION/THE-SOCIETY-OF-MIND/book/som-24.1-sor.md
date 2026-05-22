# Section 24.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-24.1.md](som-24.1.md) — *The speed of thought*
(Minsky, §24.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§24.1 opens the *Frames* chapter by asking a deceptively simple
question: how can recognition feel instantaneous when so many cues
must be reconciled? Minsky's answer is that perception is *not*
construction from scratch — it is reactivation of pre-existing
structure from memory. This section sets the stage; the operational
question for the plan is whether the runtime treats frames as
pre-existing memory rather than as on-demand reasoning.

---

## The ideas Section 24.1 actually carries

1. **Perception is reactivation, not construction.** First
   impressions arise because sight is *intertwined with memory*: the
   stimulus reminds the mind of something it already has.
2. **Sparse cues, dense responses.** Three words ("It's raining
   frogs") arouse a whole network of inferences; the additional
   detail is supplied internally, not externally.
3. **The chunk-size problem.** Older theories failed because their
   units were either too small (low-level cues) or too large (whole
   scenes). The frame is a deliberate middle scale.
4. **Stereotyped situations as the unit of recall.** A frame
   represents a *kind of* situation — meeting a certain kind of
   person, being in a certain kind of room — not a particular one.
5. **Speed is the cost of pre-commitment.** The mind reacts quickly
   precisely *because* it commits, in advance, to a small library of
   stereotyped expectations. Speed and bias share a mechanism.

---

## What the implementation already absorbs

### Frames as pre-existing structure (ideas 1, 3, 4)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
defines a frame as a *structured expectation about a kind of
situation*. The first-ship catalogue (`question.frame.yml`,
`bug.frame.yml`, `feature.frame.yml`, `code-change.frame.yml`,
`security-sensitive.frame.yml`, `self-modification.frame.yml`,
`novel.frame.yml`) is precisely the stereotyped-situation library
Minsky calls for. Frames live as repo files; the `activate` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
selects one rather than building a response from raw percepts.

### Sparse cues activating dense responses (idea 2)

The polyneme layer in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
turns small surface cues (a path glob, a label, a phrase) into broad
excitation patterns across many agencies. A single
`secret-file` path-polyneme excites the safety family wholesale.
The signal record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
carries `suggested_effects.excite` lists so that one perception step
can prime many downstream agencies — Minsky's three-word stimulus,
recast as a polyneme firing into a frame.

### The middle scale, explicitly (idea 3)

The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
forbids both extremes: no per-token cue processing, no whole-issue
monolith. Everything must collapse to a file under `.forgejo-society/`
or a workflow step. The frame schema enforces the middle scale by
naming `slots`, `default_actions`, and `failure_conditions`.

---

## What the implementation does not yet take into account

### A — "Speed of thought" is not measured

§24.1's whole motivation is *blinding speed*. The plan has no latency
discipline. There is no wall-clock budget on frame selection in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md);
agency-level budgets (`max_wall_clock_s`) exist in the manifest
schema ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but the *frame activation* step is not budgeted as a fast-path
distinct from deliberation.

### B — No "first impression" pass distinguished from full deliberation

Minsky's point is that a quick reading precedes a revised one. The
runtime has no two-stage shape: a cheap *first-impression* pass that
commits a frame and a default response, then a *revision* pass that
checks. The pipeline is single-pass through `perceive → activate →
deliberate`. The conscious bottleneck delays output but does not
itself model the *revision of an initial reading*.

### C — Stereotype as a recognised risk is absent

§24.1 names stereotypes and empathy as two faces of the same
mechanism. The plan's critic catalogue
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
includes evidence and scope critics but no *stereotype critic* — no
agent whose job is to ask "is the chosen frame here a lazy default
that ignores what is unusual about this stimulus?" The `novel.frame`
exists, but only as a fallback when nothing else matches; it does
not challenge a *confident* frame match.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Perception is reactivation | Yes | Frame catalogue + `activate` phase. |
| 2 | Sparse cues, dense responses | Yes | Polynemes + `suggested_effects` on signals. |
| 3 | Middle-scale chunks | Yes | Frame schema + collapse rule. |
| 4 | Stereotyped situations as unit | Yes | First-ship frame catalogue. |
| 5 | Speed and bias share a mechanism | Partial | Bias side is engineered; speed side is unmeasured (gap A) and unstaged (gap B); stereotype side is uncriticised (gap C). |

---

## Implication for the plan (no changes proposed here)

§24.1 hands the plan its core vindication: frames as a middle-scale,
pre-existing library are exactly the shape the implementation has
already adopted. The unforced opportunities are on the *speed* and
*self-criticism* sides of the same mechanism — staging the loop into
a fast first reading and a slower revision, budgeting frame
activation as a distinct phase, and naming a critic that questions
confident frame matches. Any move on those fronts would touch
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
