# Section 20.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-20.7.md](som-20.7.md) — *Connections*
(Minsky, §20.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§20.7 asks the engineering question: can a K-line agent connect
*directly* to any of millions of other agents? Almost certainly no —
neither the brain's wiring nor any sensible architecture supports
that. Direct, all-to-all connections are not necessary either. Three
reductions make it tractable: a representative sample suffices, most
K-lines connect through nearby trees rather than all the way out, and
each polyneme need touch only one memoriser near each agency.

---

## The ideas Section 20.7 actually carries

1. **Arbitrary direct connection is impossible.** Neither brains
   nor reasonable architectures allow it.
2. **New connections form locally.** Brain cells connect only to
   what their fibres already reach; mature cells do not relocate.
3. **Indirect connection is sufficient.** Like telephone exchanges,
   the network can connect anything to anything without a wire
   between every pair.
4. **A representative sample suffices for reactivation.** To
   restore a remembered partial state, you do not need every
   agent — only enough to set the rest going.
5. **K-lines connect through nearby K-line trees.** Most
   connections are indirect by construction.
6. **Polynemes need only one local memoriser per agency.** They do
   not need to touch every member of an agency.
7. **A K-line only needs reach within a level-band.** Not across
   all levels — within the band where its work happens.

---

## What the implementation already absorbs

### No all-to-all direct connection (ideas 1, 3)

Agencies do not name each other in arbitrary point-to-point fields.
Coordination runs through the blackboard
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
through polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
and through the pipeline phases
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
These are the "exchanges" of idea 3 — bounded-fanout intermediates
that connect arbitrary pairs without dedicated channels.

### Locality of new connections (idea 2)

Self-modification is governed: a new agency arrives via the
`differentiation-broker` and is checked against
`agencies/`-touching policy
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
A new agency's `activates_on` and polyneme links are set on creation
and changed only through `self-modification.frame.yml`. The plan's
"connections form where the structure already permits" matches idea
2 in spirit.

### Representative-sample reactivation (idea 4)

K-line `cue` and `restore_when` fields in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
match on a *subset* of features (any of `terms`, `labels`, `paths`,
`symbols`); a single match contributes to reactivation. The full
prior state is not required to wake a configuration — a
representative sample is the design.

### Polyneme reaches an agency, not its members (idea 6)

`excite:` in polynemes maps to *agency IDs*, not to internal
sub-steps of an agency
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The "one memoriser per agency" pattern is approximated by the
agency manifest being a single addressable unit.

---

## What the implementation does not yet take into account

### A — Level-bands are not represented

Idea 7 requires that a K-line know which *level-band* it operates
within and connect only there. The agency catalogue has families but
no `level` field
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
and K-line `activation_snapshot.active_agencies` is a flat map
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
A K-line can in principle bind agencies of any level together.

### B — No bound on a K-line's reach

The schema does not cap how many agencies a K-line's snapshot may
touch. Minsky's argument depends on K-lines reaching a *bounded*
neighbourhood — otherwise reactivation becomes an avalanche. The
plan relies on per-cycle budget discipline at the agency level, not
on connection-bounds at the K-line level.

### C — K-line trees are not represented

Idea 5 makes most K-line connections *indirect through other
K-lines* — K-line trees. The plan stores K-lines as individual
records under `memory/klines/<class>/...`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
with `useful_context.prior_klines` listing references, but the
records are not arranged as a tree. There is no "K-line reaches
agency-X *via* K-line-Y" path.

### D — The "exchange" pattern is not named

The blackboard and the pipeline act as exchanges, but no document
*names* them as the bounded-fanout intermediaries that make
arbitrary cross-talk feasible
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md);
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
The architectural claim — *we connect anything to anything without
wiring every pair* — is implicit, not stated.

### E — Maturation of fibres has no analogue

Idea 2's "cells continue to mature for years" implies a *latent
capacity to connect* that exists before any specific connection
fires. The plan has either an agency or no agency; there is no
intermediate "agency present, channels still forming" state.
Differentiation
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is atomic.

---

## Summary table

| # | Idea from §20.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Arbitrary direct connection impossible | Yes | No point-to-point arbitrary channels exist. |
| 2 | New connections form locally | Partial | Self-modification governs; no maturation phase (gap E). |
| 3 | Indirect connection suffices | Yes (implicit) | Blackboard + pipeline are the exchanges; not named as such (gap D). |
| 4 | Representative sample for reactivation | Yes | `restore_when` uses subset match. |
| 5 | K-lines connect through K-line trees | Partial | References exist; tree structure does not (gap C). |
| 6 | One memoriser per agency | Yes | Polynemes `excite:` agencies, not internals. |
| 7 | K-line reach within a level-band | No | No level field, no reach bound (gaps A, B). |

---

## Implication for the plan (no changes proposed here)

§20.7 is the *engineering* defence of the society architecture: it
shows why the design is feasible at scale. The plan inherits the
right instincts — exchanges, representative samples, one-per-agency
polynemes — without naming them. The gaps are about making the
bounding-rules *explicit*: level-bands (A), reach bounds (B), tree
structure (C), and the exchange pattern itself (D).

Closing these would touch the agency schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and the K-lines deep-dive at
[`THE-SOCIETY-OF-REPO/deep-dive/klines.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/deep-dive/klines.md),
and therefore fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
