# Section 26.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.8.md](som-26.8.md) — *Frames for verbs*
(Minsky, §26.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.8 introduces *nesting*. *The thief who took the moon moved it
to Paris* is a Trans-frame for *moved* whose Actor terminal is
*another* Trans-frame for *took*. The word *who* signals a
subframe. Languages also expose differing conventions for
identifying pronome roles (English word order vs Latin inflection
vs prepositions like *for*, *by*, *with*).

---

## The ideas Section 26.8 actually carries

1. **Frames nest as values.** A terminal may hold not a word but a
   filled frame.
2. **Nesting is signalled by markers.** *Who*, *which* — small
   words open subframes.
3. **Role assignment is by convention.** English uses word order;
   Latin uses inflection; both use prepositions for secondary
   roles.
4. **Different verb types reuse prepositional markers.** The
   *systematic metaphors* (§21.2's *from*/*to*) carry across
   domains.
5. **Working with several frames at once is the difficulty.**
   Nesting reduces vocabulary cost and raises orchestration cost.

---

## What the implementation already absorbs

### Frames link to other artifacts (idea 1, partial)

`linked_klines:` and `linked_procedures:` on a frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
let one frame reference other frame-shaped material. K-line
`useful_context.prior_settlements` does similarly for memory.

### Markers triggering routing (idea 2)

`society <target>:` directive polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
`phrase-polynemes.yml`) are the runtime's analogue of *who*-style
markers: small surface patterns that redirect activation into a
named subsystem.

### Role assignment by typed slot (idea 3, partial)

Handoff `candidate_actions[].kind` and `payload`
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
*Handoff*) impose a typed structure on what a proposed action is.
Each `kind` (comment, patch, run_command, open_pr, merge, label,
react, noop) has its own payload shape — a small per-verb frame.

### Orchestration cost (idea 5)

The deliberate loop manages many agencies per cycle
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
*deliberate step*) with budgets and `max_cycles`. The plan
acknowledges that running many subsystems at once is the cost paid
for compositionality.

---

## What the implementation does not yet take into account

### A — Frames cannot nest in slots

A slot's `filled_by:` lists agency IDs, not other frames
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
A frame can *link* to a K-line (which carries a prior frame's
activation snapshot) but cannot *contain* another active frame as a
slot value. The settlement records `governing_frame:` as singular
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).

### B — No subframe-open marker convention

Beyond `society <target>:`, the plan has no general pattern for
*here begins a subframe*. A complex multi-clause user comment is
processed as one stimulus by one frame; embedded "if … then …"
hypotheticals do not open sub-settlements.

### C — No pronome role layer

Minsky's pronome roles (Actor, Object, Origin, Destination,
Recipient, Instrument) are a fixed small set that every verb-frame
inherits. The plan has frame-specific slot names; there is no
inherited base set of cross-frame roles. Two frames cannot easily
share a *Recipient* slot semantically because the schema does not
recognise *Recipient* as a type.

### D — Systematic metaphors are not encoded

§26.8 ends on systematic metaphors (*from*/*to* mapping space to
time, per §21.2). The plan has analogies as a memory subtree
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
`memory/analogies/`) but the first-ship analogy catalogue is empty
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
*Analogy fallback*). Cross-domain metaphor reuse is supported by
the schema and unused by the seed.

---

## Summary table

| # | Idea from §26.8 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Frames nest as values | No | Slots are filled by agencies, not by frames (gap A). |
| 2 | Nesting markers open subframes | Partial | `society <target>:` exists; general convention does not (gap B). |
| 3 | Role assignment by convention | Partial | Typed action payloads; no shared pronome set (gap C). |
| 4 | Systematic metaphors carry across domains | Partial | Schema supports analogies; catalogue is empty (gap D). |
| 5 | Orchestration is the cost | Yes | Deliberate loop + budgets + cycles. |

---

## Implication for the plan (no changes proposed here)

§26.8 makes a strong case for two structural additions: nested
frames (slot value = another filled frame) and a shared *pronome*
type system across frames. The plan today gets some of the benefit
via K-line linkage and typed action payloads, but the compositional
expressivity Minsky illustrates with a single ten-word sentence is
not reachable with the current schema.

This is recorded as analysis only. Any move toward nested frames
would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the activation protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
