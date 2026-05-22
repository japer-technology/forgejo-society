# Section 26.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.4.md](som-26.4.md) — *A party-frame*
(Minsky, §26.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.4 unfolds the party-frame into a *script*: ARRIVAL, GIFT,
GAMES, DECOR, PARTY-MEAL, CAKE, CEREMONY, SONG. Each step has its
own sub-constraints (gift must be brand-new, suitably wrapped; cake
must have sugar frosting). The point is that an ordinary cultural
practice has a frame *that no dictionary could state*, learned
silently and treated as natural law.

---

## The ideas Section 26.4 actually carries

1. **Frames have ordered scripts.** A party is a *sequence* —
   arrival, gift, games, meal, cake, ceremony, song — not just a
   bag of features.
2. **Each step is a sub-frame with its own constraints.** The gift
   itself has sub-rules (new, of quality, not extravagant,
   party-wrapped).
3. **Cultural defaults look natural.** Practitioners do not perceive
   the structure as imposed; they perceive it as the way things are.
4. **Personal variants ride on shared scripts.** Minsky's
   strawberry-trade is a private subroutine on the public party
   script.
5. **No definition captures the script.** The script is operational
   knowledge that lives in the practice, not in a dictionary entry.

---

## What the implementation already absorbs

### Procedural memory as cultural script (ideas 1, 5)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
defines `memory/procedural/` as the place where *how-to* knowledge
is recorded, written by the archivist under the `self-modification`
frame. This is the runtime's analogue of operational cultural
knowledge.

### Frame plus default actions (idea 2)

`default_actions:` and `default_critics:` on a frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
give each frame a *standard sequence* of phases and a standard
critic set. The pipeline phases in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
(perceive → activate → deliberate → criticize → censor → settle →
act → remember → report) are themselves a script.

### Personal variants riding on shared scripts (idea 4)

The first-ship catalogues in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
are explicitly *seed* defaults that a deployment may extend via the
`self-modification` frame. This is the runtime version of "personal
variants on a shared script".

---

## What the implementation does not yet take into account

### A — Frames have no ordered slot scripts

A frame's `slots:` is a *set* with required flags, not a *sequence*
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
Minsky's party-frame is ordered: ARRIVAL precedes GIFT precedes
GAMES. The plan's `default_actions:` is a list of *phase hints*, not
an enforceable ordering of slot fills.

### B — Slot-internal constraints are not first-class

Minsky's gift slot carries sub-rules (brand-new, of quality, not
extravagant, party-wrapped). The plan's slots have `required:` and
`filled_by:` but no `must_satisfy:` predicate list. Such checks
exist at the critic and censor level
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
but they are *global*, not *slot-local*.

### C — Scripts are not the unit of memory

`memory/procedural/` files are free-form Markdown
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
There is no `script.schema.json`, no enumerated step sequence, no
mechanism by which a procedural memory becomes a runnable script
during deliberation. The party-frame, written into the plan today,
would be prose only.

### D — Cultural-default surfacing is absent

The plan does not have a mechanism to *expose* the implicit
defaults a deployment has accumulated. A maintainer cannot ask "what
is this society's gift-wrapping rule?" — the answer would live
scattered across critics, censors, and procedural notes, with no
index by frame slot.

---

## Summary table

| # | Idea from §26.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Frames have ordered scripts | Partial | `default_actions:` is a list; not an ordering of slot fills (gap A). |
| 2 | Each step is a sub-frame with constraints | Partial | Critics/censors exist globally; slot-local predicates do not (gap B). |
| 3 | Cultural defaults look natural | Yes | Procedural memory captures this stance. |
| 4 | Personal variants on shared scripts | Yes | First-ship catalogues + `self-modification` frame. |
| 5 | No definition captures the script | Partial | Procedural memory is prose, not schema (gap C). |

---

## Implication for the plan (no changes proposed here)

§26.4 reads as a request to make *scripts* a first-class structure:
ordered slot sequences with slot-local predicates, sittable beside
frames in the schema. The plan today has frames (situational
schemas) and procedural memory (how-to prose) but not a typed
artifact that combines them.

This is recorded as analysis only. Any move to add scripts would
touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and the procedural-memory section of
[`THE-SOCIETY-OF-REPO/06-memory/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
