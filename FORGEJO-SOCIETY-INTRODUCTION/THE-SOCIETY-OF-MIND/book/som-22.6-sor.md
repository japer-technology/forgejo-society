# Section 22.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.6.md](som-22.6.md) — *Expression*
(Minsky, §22.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.6 names a mental move Minsky calls *thing-ification* (or
*conceptualisation*): when a structure becomes too large, the mind
replaces it with a compact symbol so the rest of cognition can
continue. The price is that an idea must then behave like a stable
worldly thing — it must persist, occupy a "place", and be findable.
Without that move there is no general intelligence.

---

## The ideas Section 22.6 actually carries

1. **Thoughts are treated as things.** We grasp, find, and place ideas
   as though they were objects.
2. **Thing-ification is reuse of object machinery.** Once an idea
   behaves like a thing, our object-handling agencies can operate
   on it.
3. **Thing-ification is also relief.** It lets an overburdened agency
   continue by collapsing a structure into a symbol.
4. **Good ideas need substantiality.** They must remain unchanged for
   long enough and stay in some kind of mental "place" so they can be
   found again.
5. **No mind works without stable states or memories.** Persistence
   is not optional.
6. **Place is metaphorical but useful.** A mental "place" is itself a
   linkage of memories and processes; metaphor and machinery overlap.
7. **Reflection requires this capacity.** Thinking *about* thoughts —
   the precondition of general intelligence — depends on treating
   them as things.

---

## What the implementation already absorbs

### Settlements as thing-ified deliberations (ideas 1, 3)

The settlement record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
collapses an entire deliberation — proposals, critics, censors,
ideals, action, outcome — into a single file with one ID. After it is
written, later phases reference it as a unit. This is exactly the
"replace the structure with a compact symbol" move §22.6 demands.

### Polynemes and K-lines as handles (idea 1)

A polyneme symbol or a K-line ID is a small, findable name for an
otherwise distributed configuration. The plan grasps, names, and
re-activates these as units —
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md).

### Stable mental "place" via the file system (ideas 4, 6)

Every durable record lives at a fixed path (`memory/decisions/`,
`memory/klines/<class>/`, `memory/concepts/`,
`memory/procedural/`). The path *is* the mental place. The
append-only discipline in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
guarantees substantiality: a record that exists remains findable.

### A concepts subtree (ideas 1, 7)

`memory/concepts/` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
exists specifically for "candidate abstractions awaiting governance".
Its presence is the plan's acknowledgement that thing-ified ideas
need a home.

### Self-model as a thing-about-thoughts (idea 7)

The identity family's `spock-self-model` and the soul files
(`AGENTS.md`, `APPEND_SYSTEM.md`,
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
let the society reference and reason about its own dispositions as
named objects. This is reflection at the file level.

---

## What the implementation does not yet take into account

### A — No agency forms concepts

`memory/concepts/` exists as a destination, but no agency in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
has the role of *manufacturing* a concept from observed patterns. A
cluster of similar K-lines, a repeatedly-cited proposal, a recurring
relational graph — none of these are turned into concept candidates
by a named worker.

### B — No "agency is overburdened" signal

§22.6's motivation for thing-ification is relief: an agency cannot
proceed without compressing a structure. The plan has `budget`
fields and `tool_usage` counters in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
but no signal that fires when an agency is overwhelmed and *requests*
compression. Compression is therefore reactive (budget exhaustion)
rather than cognitive (request).

### C — Substantiality is filesystem-substantiality, not cognitive

Records persist because the filesystem persists; the plan does not
distinguish a *findable* idea from a merely *stored* one. Decay
metadata exists, but findability — "is this idea in a mental place
where the agency that needs it will look?" — has no metric. A K-line
with high `decay_score` but bad `restore_when` cues is
operationally invisible despite being substantial.

### D — Place is not a first-class concept

The file path is the place, but the plan does not name *place* as a
concept it manipulates. There is no record type "mental location"
that an agency could be told to "look in." Memory retrieval works by
schema rules, not by traversing named places.

### E — Reflection is partial

The plan reflects on *records* (settlements, K-lines, decisions) but
not on *current cognition*. The `unknowns` and `blind_spots` fields
in the settlement schema are the closest analogue: an in-run record
of what the society could not see. There is no agency whose job is
to examine the live blackboard and produce a thing-ified summary of
"what we are currently thinking."

### F — The risk of empty thoughts is unaddressed

Minsky notes the cost side: thing-ification permits *This statement
is false* and similar empty constructs. The plan has critics for
evidence, scope, and overconfidence, but none for *self-reference
without referent* — a settlement that cites only itself or a concept
that resolves only to a placeholder.

---

## Summary table

| # | Idea from §22.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Thoughts are treated as things | Yes | Settlements, K-lines, polynemes, soul files. |
| 2 | Reuse of object machinery | Yes | Records have IDs, paths, links. |
| 3 | Relief: collapsing structures into symbols | Partial | Settlement and K-line do this; no "overburdened" signal (gap B). |
| 4 | Good ideas need substantiality | Yes (substrate-wise) | Append-only memory tree. |
| 5 | No mind without stable states | Yes | Three memory trees with declared lifetimes. |
| 6 | Place is metaphorical but useful | Partial | File path serves; no first-class "place" (gap D). |
| 7 | Reflection requires conceptualisation | Partial | Reflects on records, not live cognition (gap E). |
| — | Concept-formation agency | No | `memory/concepts/` lacks a writer (gap A). |
| — | Guard against empty thoughts | No | No self-reference critic (gap F). |

---

## Implication for the plan (no changes proposed here)

§22.6 reveals that the plan has the *destinations* of
thing-ification (records, paths, soul files) but not the *operation*
that produces a fresh thing-ified concept. The concepts subtree is a
mailbox without a sender. The reflection capacity is partial: the
society can look at its archived past but has no compact "what we are
thinking now" object short of `workspace.md`'s prose.

Any move to introduce a concept-formation agency, a signal for
overburdened agencies, a "mental place" record type, or a critic
for empty self-reference would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the representation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
