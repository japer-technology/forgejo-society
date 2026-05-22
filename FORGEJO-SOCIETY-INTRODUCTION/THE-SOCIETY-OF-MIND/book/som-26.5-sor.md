# Section 26.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.5.md](som-26.5.md) — *Story-frames*
(Minsky, §26.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.5 shifts up one level: the *story* itself is a frame.
*Once upon a time* is a frame-selector for the entire genre. It
sets the listener into expectation mode, locates the narrative in
time, and — crucially — *disables* the normal sympathies that real
events would invoke. Story-frames also impose listener discipline:
following a thread requires self-control over digressions.

---

## The ideas Section 26.5 actually carries

1. **Whole stories are framed.** A narrative has a meta-frame that
   precedes its content.
2. **Genre-openers select expectation-frames.** *Once upon a time*,
   *There was a man in the land of Uz* — these are surface markers
   that route the listener to the right mode.
3. **Story-frames suspend real-world stakes.** The opener tells the
   listener that monstrous events inside the frame should not
   activate normal protective reactions.
4. **Listening is a skill that constrains attention.** A child must
   *learn* to stay with the story rather than drift to *where does
   Mary live?*
5. **Stories have an internal script.** Scene-setting → characters
   → main event → development → resolution → moral.

---

## What the implementation already absorbs

### Stimulus-type framing (ideas 1, 2)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
*Trigger surface* tags every event with a *cognitive role* — stimulus
arrival, continued dialogue, proposed action, memory trace, periodic
review. This is the runtime's analogue of meta-frame selection by
opener.

### Listener discipline as conscious bottleneck (idea 4)

`agency.integration.conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is the sole producer of visible response, and the deliberate loop
has `max_cycles` and budgets
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
*deliberate step*). This is structural attention discipline: the
society cannot wander indefinitely.

### Suspending normal stakes for special modes (idea 3, partial)

The `self-modification` frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
explicitly *raises* stakes for one mode (changes to the society
itself). The inverse — a frame that *lowers* stakes by marking a
stimulus as hypothetical — does not exist.

---

## What the implementation does not yet take into account

### A — No "hypothetical" or "story" frame

There is no frame that says *this is a what-if, not a real
request*. A user comment that asks "if we did X, what would
happen?" is processed by the same frames as "do X". Branches as
candidate futures
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
*Branches as candidate futures*) carry hypotheticality in *act*, not
in *perceive*.

### B — No genre-opener parser

Minsky's openers (*once upon a time*, *let me tell you a story*)
have no analogue in `phrase-polynemes.yml`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The plan recognises directive prefixes (`society <target>:`) but not
narrative-mode prefixes.

### C — Story-script is not in the catalogue

The first-ship frame list
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
has `question`, `bug`, `feature`, `code-change`,
`security-sensitive`, `self-modification`, `novel`. None is a *story*
or *scenario* frame with scene-setting / characters / main-event
slots. A user who describes a long incident chronologically is
parsed as a `bug` or `feature` regardless of narrative shape.

### D — Stakes suspension is not selectable

The safety stack
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
is *unconditional*: censors fire regardless of whether the stimulus
is framed as hypothetical. This is almost certainly the correct
default; Minsky's §26.5 stakes-suspension is a *listener-side*
choice, not a *speaker-side* permission, so the plan's posture is
defensible. It is still worth noting as a divergence.

---

## Summary table

| # | Idea from §26.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Whole stories are framed | Partial | Cognitive-role tags on triggers; no narrative meta-frame (gap A). |
| 2 | Genre-openers select expectation-frames | No | No story-opener polyneme (gap B). |
| 3 | Story-frames suspend real-world stakes | No (by design) | Censors are unconditional (gap D, defensible). |
| 4 | Listener discipline | Yes | Conscious bottleneck + cycle budgets. |
| 5 | Internal story-script | No | No scene/characters/event slots in any frame (gap C). |

---

## Implication for the plan (no changes proposed here)

§26.5 highlights two distinct opportunities. The first is a
*hypothetical* or *story* frame that marks a stimulus as exploratory
without weakening any censor (the candidate-future branch already
provides the *output-side* answer; the *input-side* analogue is
missing). The second is recognising narrative shape in user input —
useful for incident reports and post-mortems — which would require a
new frame and a small set of phrase-polynemes.

This is recorded as analysis only. Any move in either direction
would touch the first-ship catalogues in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the protocol catalogue at
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
