# Section 15.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.5.md](som-15.5.md) — *The immanence
illusion* (Minsky, §15.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.5 names the *immanence illusion*: when an answer arrives
without noticeable delay, it feels as though it were already
present in the mind. The section uses this to argue that
perception and memory are not distinct in the way introspection
suggests, that *vividness* is descriptive rigidity, and that
sometimes a memory becomes more rigid than the reality it
purports to represent.

---

## The ideas Section 15.5 actually carries

1. **Memory cannot restore; it can only reproduce fragments.**
   Recall reassembles partial states; it does not bring the past
   back whole.
2. **Real-time experience is also indirect.** The closest we come
   to the world is through agent-made descriptions.
3. **The immanence illusion.** Any answer available without
   delay feels as though it were *already* active.
4. **Perception starts evoking memory before its own work is
   done.** Recognition leaks into seeing; we cannot cleanly
   separate them.
5. **Vividness is descriptive rigidity.** What feels "objective"
   is a representation that resists revision.
6. **Memory can be more rigid than reality.** Attitudes towards
   people, places, and things can persist beyond the reality
   that shaped them.

---

## What the implementation already absorbs

### Memory delivers fragments, not whole states (idea 1)

K-line `activation_snapshot` carries weighted boosts and
`useful_context` carries file paths and command lists
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
Neither is the prior settlement; they are fragments that the
present run must assemble. `memory/episodic/` is narrative
rather than executable, but a later run still reads it as
material, not as a state to inhabit.

### Reads from `memory/` are descriptive, not direct (idea 2)

Nothing in the runtime mistakes a `memory/decisions/` entry for
the world. The cartographer (`agency.code.codebase-cartographer`
in [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
treats files as the things to be re-read; the prior decision is
*about* them, not them. The descriptive layer is named.

### Recognition leaks into perception by design (idea 4)

The perception → frame-selection → K-line activation pipeline
is sequential
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
but tightly coupled: polynemes match while perception is still
classifying, and the activate phase boosts memory-derived
agencies before deliberation begins. The structural leak
Minsky describes is operational here as an early-boost from
memory into the active deliberation set.

### Some rigidities are explicitly desired (idea 5, partial)

The voice rules in [AGENTS.md](../../../AGENTS.md) and the
soul-file guardian
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
resist drift in the society's self-description. That is a chosen
rigidity, of the sort Minsky says often "truly reflects the
persistency and permanence of actual physical objects."

---

## What the implementation does not yet take into account

### A — No explicit "immanence" check

Idea 3 is the section's named claim, and the plan has no
counterpart. There is no rule that asks "was this answer
available without delay? If so, treat its feel of presence with
suspicion." A K-line that matches strongly and a reasoning step
that produced a fresh result both reach the settlement as plain
contributions. The presenter cannot mark the immanent-feeling
ones as such.

### B — Latency is not first-class on the blackboard

Idea 3 depends on a *latency signal* — the difference between
delayed answers and instantaneous ones. Signals carry timestamps
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
but the blackboard
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
does not summarise "this contribution arrived in 0.02s versus
this one took 4s of deliberation". Latency is recordable; it is
not yet read.

### C — Vividness has no measure

Idea 5 makes vividness *operational* as descriptive rigidity —
how much the rest of the mind tries and fails to revise the
representation. The plan has no field that records "this
representation resisted N revision attempts during this run".
Critic objections that are sustained against a candidate action
*could* feed such a measure; today they are recorded but not
aggregated into a per-representation rigidity score.

### D — Memory-more-rigid-than-reality is not detected

Idea 6 is the danger case: an attitude or memory persists beyond
the reality it represents. The contradiction-finder
(`agency.memory.contradiction-finder` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
flags *candidate actions* that contradict semantic memory. It
does not flag the converse: *semantic memory* contradicted by
the present world. A `semantic/decisions.log` entry that has
been silently invalidated by code changes since its writing has
no scheduled re-check.

### E — Perceptual rigidity has no counterpart

Idea 5's specific example — vision changes a black telephone
back to black even when the rest of the mind imagines it red —
maps loosely to suppressors
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
which reverse output that drifts in disallowed directions. But
suppressors fire on declared dangers, not on *anything that
disagrees with what is on disk*. The plan has no equivalent of
the vision-system's reflexive "no, the file says X".

### F — The presenter cannot mark "this felt obvious"

Idea 3 implies the visible response should at least sometimes
flag immanence. The presenter today produces a single composed
response without per-claim provenance of the form "this came
from a K-line match I trusted without checking" versus "this I
reasoned through the cartographer's reading". Both styles of
claim look the same in the final text.

---

## Summary table

| # | Idea from §15.5 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Memory reproduces fragments | Yes | K-line snapshots; episodic as material. |
| 2 | Real-time experience is also indirect | Yes | Cartographer + perception treat the codebase as material to describe. |
| 3 | The immanence illusion | No | No latency-based suspicion (gap A); latency unread (gap B). |
| 4 | Memory leaks into perception | Yes | Polyneme / frame / K-line activate before deliberate. |
| 5 | Vividness = descriptive rigidity | Partial | Soul-file rigidity yes; rigidity score absent (gap C); perceptual reflex absent (gap E). |
| 6 | Memory more rigid than reality | No | Contradiction-finder runs one way only (gap D). |
| — | Presenter provenance for immanence | No | No per-claim "felt obvious" marker (gap F). |

---

## Implication for the plan (no changes proposed here)

§15.5 is the chapter's caution: easy answers feel known. The plan
holds the structural pieces — K-lines as fragments, indirect
descriptions of the world, memory leaking into perception — but
does not yet have the *suspicion layer* §15.5 motivates. The most
consequential single opportunity is gap D (memory contradicted by
reality), because it is the failure mode most likely to produce
visibly wrong outputs: a stale `semantic/decisions.log` entry
quietly informing a new candidate action. The most distinctively
Minskyan opportunity is gap A — making immanence itself an
observable on the blackboard — because once latency is on the
blackboard, the other gaps (B, C, F) follow. Closing any of these
would touch
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(blackboard schema; semantic re-check pass),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(latency surfacing), and
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a reverse contradiction-finder). These are recorded here as
analysis, not as a change request. Any move to close them falls
under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
