# Section 21.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-21.7.md](som-21.7.md) — *Generalizing with
pronomes* (Minsky, §21.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§21.7 splits a learned skill into two scripts: an *assignment script*
that binds polynemes to pronomes (apple-neme → Origin pronome,
pail-neme → Destination pronome) and an *action script* written only
against the pronomes. The action script transfers from putting apples
into pails to putting blocks into boxes, because it never mentions
apples or pails at all.

---

## The ideas Section 21.7 actually carries

1. **A first skill is concrete and brittle.** Played back, it would
   only work for the original objects.
2. **The split into assignment and action makes it generic.**
   Assignment binds objects to roles; action operates on roles only.
3. **K-lines and pronomes together describe a learned procedure.**
   Activation snapshot plus role assignment is the procedure's
   shape.
4. **Generality is purchased at the cost of an extra binding step.**
   The assignment script is a small price for cross-domain reuse.

---

## What the implementation already absorbs

- **Procedural memory is a tree.**
  [`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
  reserves `memory/procedural/` for how-to changes, written only
  under the `self-modification` frame. The tree exists.
- **K-lines record activation snapshots.**
  [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
  stores `activation_snapshot.active_agencies` and
  `useful_context.files_read`. This is the *action script* part — the
  agents to activate, in roughly the right order.
- **Reactivation is parameter-free.** K-lines are reactivated by
  similarity, not by being passed arguments
  ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
  The runtime has no concrete-vs-parametric distinction.

## What the implementation does not yet take into account

### A — No assignment script

A K-line records *which agencies were active* and *which files were
useful*; it does not record *which symbol was bound to which role*.
Without a role/pronome registry (see gaps in
[som-21.6-sor.md](som-21.6-sor.md) and
[som-21.2-sor.md](som-21.2-sor.md)), there is nothing for an
assignment script to bind to.

### B — K-lines are concrete, not parametric

The K-line cue is a fingerprint of the original stimulus
(`title_terms`, `labels`, `paths_touched`,
`symbols`). Reactivation matches the new stimulus against that
fingerprint as a whole. There is no template form in which an apple
slot has been generalised to *Object* and a pail slot to
*Destination*. The very generalisation Minsky describes is what
K-lines, in their current shape, do not perform.

### C — The split between bind and run is absent from the runtime

The runtime pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
does not have an *assignment* phase distinct from an *act* phase. The
`activate` phase wakes agencies; the `act` phase carries out the
authorised action. The bind step that would set pronome values for
the rest of the cycle is missing.

### D — Procedural records are descriptive, not executable

`memory/procedural/` holds Markdown notes about how-to changes
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
None of them are *scripts* the runtime can replay. A parametric
script equivalent of §21.7's *action script* would require a new
record kind.

---

## Summary table

| # | Idea from §21.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | A first skill is concrete | Yes | K-lines are exactly that. |
| 2 | Generality via assignment + action split | No | No assignment phase; no parametric form (gaps A, C). |
| 3 | K-lines plus pronomes describe a procedure | Partial | K-lines exist; pronomes do not (gap A). |
| 4 | Generality costs one binding step | No | No binding step exists (gap C). |

---

## Implication for the plan (no changes proposed here)

§21.7 reads, against the implementation, as one of the most precise
calls for a feature the plan does not have: a parametric K-line, or
equivalently, a binding phase in the runtime that sets role values
before the action script runs. Closing this would touch the K-line
schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and likely the representation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md).

Recorded here as analysis only. A parametric K-line is a new
governance primitive and a new record kind, and falls under the "stop
and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
