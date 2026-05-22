# Section 21.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-21.2.md](som-21.2.md) — *Pronomes*
(Minsky, §21.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§21.2 generalises pronomes by way of grammar. A verb such as *drive*
engages a small constellation of role-concerns — Actor, Vehicle, Time,
Origin, Destination — and each language has evolved word-forms that
fill those roles. The same prepositions *from*, *to*, *at* serve
both space and time. Pronomes are the mental fixtures these
grammatical roles attach to.

---

## The ideas Section 21.2 actually carries

1. **A verb selects a constellation of roles.** Hearing *drive*
   engages role-concerns for Actor, Vehicle, Origin, Destination,
   Time.
2. **Roles are language-universal.** Every language has evolved
   special forms for the same recurring concerns.
3. **Word-position and inflection bind roles to fillers.** *Jack
   drove* binds Jack to Actor because Actor precedes the verb;
   *drove* itself marks Time as past.
4. **The same role-grammar serves multiple realms.** *From … to* works
   for places and for moments because both fit a shared
   shape-of-change.
5. **Cross-realm correspondence is a powerful thinking move.** Reusing
   one grammar across realms is what lets the mind transfer skills
   between them.

---

## What the implementation already absorbs

- **Frames declare slot constellations.** The `code-change` frame in
  [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
  requires `user_goal`, `relevant_files`, `proposed_patch`, `tests`,
  `risks`, `final_user_response`. The frame *is* the verb-and-roles
  bundle for a class of stimulus.
- **Selectors bind fillers to slots.** A polyneme's
  `excite`/`inhibit` map and a frame's `filled_by` list together do
  the binding work that grammar does in language
  ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
- **Default fillers exist.** The Instrument-by-default pattern of
  natural language is mirrored by the frame's `default_actions`,
  `default_critics`, `default_censors`.

## What the implementation does not yet take into account

### A — No shared role vocabulary across frames

Each frame names its own slots (`user_goal`, `relevant_files`, …).
There is no canonical set of role names — no Actor, Object, Origin,
Destination — reused across frames. A cartographer cannot ask "what
is the Actor of this settlement?" because no frame declares one.

### B — No cross-realm reuse

§21.2's central observation is that one grammar serves space and time.
The plan has no analogue: a frame for a code change and a frame for a
governance change are independent schemas, not the same shape applied
to two realms. The analogy machinery in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
exists but its first-ship catalogue is empty.

### C — No grammar of inflection on stimulus

Word-form carries information: *dr-o-ve* encodes past tense. The
runtime normalises stimuli
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
*normalize* step) but does not extract role-inflection signals such as
tense, mood, or aspect from the incoming text. Time, in particular,
is recorded as an ISO timestamp on the record, not as a *grammatical*
property of the stimulus.

---

## Summary table

| # | Idea from §21.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Verb selects a role constellation | Yes | Frames declare required slots. |
| 2 | Roles are universal across instances | Partial | Universal *within* a frame; not across frames (gap A). |
| 3 | Position and inflection bind fillers | Partial | Polynemes and `filled_by` bind; no inflection extraction (gap C). |
| 4 | Same role-grammar across realms | No | Per-frame schemas, no shared role registry (gap A, B). |
| 5 | Cross-realm correspondence as a thinking move | No | Analogy catalogue is empty (gap B). |

---

## Implication for the plan (no changes proposed here)

§21.2 suggests that the strength of frames comes not from each frame
being well-designed but from many frames sharing a small set of role
names. The plan's frames are well-designed individually and do not
share role names. Closing this would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and possibly the relational-link types in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md).

Recorded here as analysis only. Any move to introduce a shared role
vocabulary would constitute a new governance primitive and falls under
the "stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
