# Section 21.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-21.3.md](som-21.3.md) — *Trans-frames*
(Minsky, §21.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§21.3 names the Trans-frame: a shape with Origin, Destination,
Trajectory, Difference. Schank's P-Trans (physical motion), M-Trans
(transmission of information), and A-Trans (transfer of ownership)
share this shape, and that is why they all chain — the Destination of
one Trans-frame becomes the Origin of the next.

---

## The ideas Section 21.3 actually carries

1. **A single shape spans many realms.** The Trans-frame is the same
   structure whether the action is physical, mental, or social.
2. **Origin and Destination are first-class slots.** Both endpoints
   must be representable for chaining to work.
3. **Trajectory and Difference are equally first-class.** Chains need
   a bridge between endpoints, and the change between them.
4. **Chains are constructed by slot-linking.** *Replace each
   Trans-frame's Destination with the next one's Origin* is the
   chain-building rule.
5. **Cross-realm equivalence enables transfer of skill.** Mental
   chaining-skills learned in one realm apply to others because the
   frame is the same.

---

## What the implementation already absorbs

- **Settlements link by typed edges.**
  [`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
  defines a settlement's `linked:` field with kinds including
  `derived_from`, `supersedes`, `analogous_to`. A chain of settlements
  is recoverable from these links.
- **Reality revision records the journey.** The `reality_revision`
  block in
  [`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
  carries `base_sha` and `merge_sha`, which is a P-Trans-like Origin
  and Destination for the *code* realm.
- **Memory promotion is a one-way Trans.**
  [`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
  describes `state/` → `workspace/` → `memory/` as a transit with
  named origins and destinations, governed by who may write.

## What the implementation does not yet take into account

### A — No Trans-frame archetype

The frame catalogue
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
contains `question`, `bug`, `feature`, `code-change`,
`security-sensitive`, `self-modification`, `novel`. None of them
expose the Trans shape (Origin, Destination, Trajectory, Difference)
as a top-level pattern. A frame for *moving a settlement from one
state to another* would have to be authored from scratch.

### B — No chaining operator

Settlements can be linked by `derived_from`, but the plan has no
operator that says *the Destination of settlement A is the Origin of
settlement B*. Chains exist as backward references, not as composed
journeys. A reviewer cannot ask the runtime to traverse a Trans-chain
end-to-end.

### C — No cross-realm reuse of the chain machinery

P-Trans, M-Trans, A-Trans share machinery because they share shape.
In the plan, *code change*, *governance change*, and *memory
promotion* are all transits, but they share no Trans-frame and so
share no chaining machinery. Any improvement to chain traversal in
one realm would not transfer to the others.

### D — Difference is not a tracked slot

Trans-frame's Difference (what changed between Origin and
Destination) is computed in some places — `diff-summary.md` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
— but is not a slot of any frame. It cannot be queried uniformly.

---

## Summary table

| # | Idea from §21.3 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | One shape across realms | No | No Trans archetype (gap A). |
| 2 | Origin and Destination as first-class slots | Partial | Present only in `reality_revision` for code changes. |
| 3 | Trajectory and Difference as first-class slots | Partial | `diff-summary.md` exists; no slot (gap D). |
| 4 | Chaining by slot-linking | Partial | Typed `linked:` edges; no chain operator (gap B). |
| 5 | Cross-realm transfer of chaining skill | No | Each realm uses its own machinery (gap C). |

---

## Implication for the plan (no changes proposed here)

§21.3 suggests that *transit* is itself a shape worth naming. The
plan has many transits but no Trans-frame. Closing this would touch
the frame catalogue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the relational-link types in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md).

Recorded here as analysis only. Any move to introduce a Trans-frame
archetype is a schema and protocol change and falls under the "stop
and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
