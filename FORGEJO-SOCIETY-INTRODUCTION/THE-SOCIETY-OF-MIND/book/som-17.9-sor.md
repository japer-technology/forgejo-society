# Section 17.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.9.md](som-17.9.md) — *Different spans of memories*
(Minsky, §17.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.9 asserts that memories of different *kinds* have different
*time-spans*: attachment-bonds form quickly and decay slowly; the
disparity is functional, not accidental. The time-span profile of a
memory class is itself a designed property; mourning, peer pressure,
and the persistence of trauma are consequences.

---

## The ideas Section 17.9 actually carries

1. **Different memory classes have different time-spans.** Span
   is a property of the class, not of the content.
2. **Attachment-memory: fast to form, slow to change.** This
   asymmetry is its functional signature.
3. **Time-spans evolved for ancestral conditions.** They do not
   adapt automatically to present needs.
4. **Shared machinery means cross-effects.** Attachment and
   sexuality use related mechanisms; trauma to one disturbs the
   other.
5. **Recovery from disturbance is time-bound, not will-bound.**
   The owner cannot decide an attachment-memory back into order;
   only time reconstructs it.

---

## What the implementation already absorbs

### Multiple memory classes with distinct policies (idea 1)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
defines events, episodic, semantic, procedural, failure, frames,
analogies, concepts, K-lines, and decisions as separate classes.
Each has its own `decay_score`, write path, and pruning rule. Span
is configured per class — exactly the shape idea 1 demands.

### Decay scores and pruning (idea 2, partial)

The forgetting-critic
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
proposes retirement of low-scored records. Different classes can
configure different decay constants; the substrate for "fast to
form, slow to change" is present in the schema.

### Decision records as the long span (idea 1)

`memory/decisions/` carries settlements that are intended to
persist indefinitely
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
[AGENTS.md](../../../AGENTS.md) §7). The plan already has a class
whose explicit purpose is long-term retention; commitments live
there.

---

## What the implementation does not yet take into account

### A — Span asymmetry (fast-form / slow-change) is not encoded

The decay model treats *forming* and *changing* symmetrically. A
high-value record decays slowly *and* would be amended slowly only
because nobody happens to touch it. There is no `formation_rate` vs
`mutation_rate` distinction; idea 2's signature property is not
representable.

### B — No "attachment-class" memory

The class list in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
covers cognitive content. It does not include a class for *value
bonds* — "these particular humans / these particular societies are
attached." Such a class would, by idea 2, be fast to form and slow
to change; the plan has no place to put it.

### C — Cross-class effect-tracking is absent

Idea 4 requires recognition that disturbances to one class can
disturb another. The plan's classes are isolated: an injury to
`memory/episodic/` does not appear as a derived signal on
`agencies/identity/*`. There is no `shared_machinery` link in the
schema.

### D — No "time-only-heals" annotation on damaged records

Idea 5 forbids in-loop attempts to repair certain damage by
reasoning. The plan has no record-level `recovery_policy: time_only`
flag that would tell agencies to *leave alone* a damaged class
until enough cycles pass.

### E — Time-spans inherit from "ancestral" defaults silently

Idea 3 warns that evolved spans may not suit present conditions.
The plan's per-class decay constants are configured *once* at
bootstrap and carried forward; nothing flags "this class's span
configuration has not been reviewed in N cycles; current usage may
require revision." Ancestral defaults persist unexamined.

### F — Mourning analogue (slow letting-go) is not modelled

When an agency is retired
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
its K-lines may continue to match incoming stimuli briefly before
the retirement propagates. The plan has no documented "mourning"
window — a deliberate interval during which the society *expects*
references to the retired agency and handles them gracefully.

---

## Summary table

| # | Idea from §17.9 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Different classes, different spans | Yes | Per-class decay in `08-state-and-memory.md`. |
| 2 | Fast-form, slow-change | Partial | Decay is symmetric (gap A). |
| 3 | Spans inherit ancestral defaults | No | No review signal on span configuration (gap E). |
| 4 | Shared machinery → cross-effects | No | Classes isolated; no `shared_machinery` link (gap C). |
| 5 | Recovery is time-bound | No | No `recovery_policy` flag (gap D). |
| — | Attachment-class memory | No | Not in the class list (gap B). |
| — | Mourning interval after retirement | No | Retirement is instantaneous (gap F). |

---

## Implication for the plan (no changes proposed here)

§17.9 is the chapter's clearest engineering claim: the *temporal
profile* of a memory class is a design parameter, and getting the
profile wrong has long-lasting consequences. The plan has the
substrate — per-class decay, separate write paths, the
forgetting-critic — but treats span as a single scalar and treats
classes as independent. Closing the gaps would touch the memory
class definitions in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(adding `formation_rate`, `mutation_rate`, `recovery_policy`,
`shared_machinery`), the retirement procedure in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and
[`THE-SOCIETY-OF-REPO/06-memory/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
