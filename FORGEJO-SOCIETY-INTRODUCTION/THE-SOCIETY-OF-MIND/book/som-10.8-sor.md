# Section 10.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-10.8.md](som-10.8.md) — *Education and
development* (Minsky, §10.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§10.8 makes two points that cut at the plan from different
directions. First: direct instruction of children — explaining the
rule, drilling it — produces fragile, special-purpose performance
that does not transfer. Second: the early sections present agents
as competitive (Tall fights Thin) because cooperation and compromise
are *harder* mechanisms that need higher-level systems.

---

## The ideas Section 10.8 actually carries

1. **Special-cased rules don't transfer.** Children given direct
   "if-then" rules for conservation can perform on the trained case
   and fail on near-relatives.
2. **Inner signposts must develop.** Performance becomes general
   only when the learner has internal middle-level structure;
   external rules do not substitute.
3. **Multilayer simulation is too complex to inject.** A child
   cannot be handed the Appearance/History hierarchy directly; the
   number of special rules and exceptions exceeds their capacity.
4. **Competition is the easy resolution.** Switching among
   alternatives — picking a winner — is the simplest mechanism for
   resolving conflict.
5. **Cooperation is harder and comes later.** Negotiation,
   compromise, and pooled answers require richer interaction shapes
   than the early sections develop.

---

## What the implementation already absorbs

### Special-purpose rules are not the unit of growth (idea 1, idea 3)

The plan's growth mechanisms — `agency.meta-admin.differentiation-
broker`, `agency.meta-admin.retirement-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
and the bootstrap checklist
([`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md))
— operate on *agencies*, not on case-specific rules. The plan does
not encourage adding "if pull request title contains X, do Y"
patches; it encourages adding or modifying full agencies. This
matches Minsky's preference for structural growth over rule-pile-up.

### Competition is supported as the basic resolution (idea 4)

The settlement protocol
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
and the criticize/censor phases in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
implement winner-selection. The plan's first-pass conflict resolution
is exactly the "switching among alternatives" Minsky names as easy
and adequate-for-now.

### Inner middle-level structure (idea 2)

The assembly tiers (`summary-tier-1`, `summary-tier-2`) and the
integration tier (`conscious-presenter`) are *structural* middle
layers, not memorised rules
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
They are *authored*, not *grown* (gap A in
[som-10.4-sor.md](som-10.4-sor.md)), but at least the *kind* of
structure §10.8 says the learner must eventually possess is present
in the plan's substrate.

---

## What the implementation does not yet take into account

### A — Transfer failure has no diagnostic

§10.8's clearest empirical claim is that drilled rules do not
transfer. The plan has no test for this failure mode. There is no
mechanism that asks, after an agency change: "does this also work on
adjacent inputs that were not in the change's motivating case?"
Settlements are recorded individually
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md));
the *generalisation surface* of an agency change is not.

### B — Cooperation/compromise has no primitive

Idea 5 is the harder half of the section. The plan has no
representation of *pooled* answers. The settlement protocol selects
*one* proposal; it does not produce a synthesis of two. The
candidate-action and handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carry single proposals, not negotiated merges. "Two critics each
gave half the answer; the answer is the union" is not a representable
outcome.

### C — Higher-order interaction shapes are absent

The plan supports two interaction shapes: *signal* (a typed
notification) and *handoff* (a baton-pass between phases). Minsky's
later sections will need richer shapes — proposal-and-counter-
proposal, conditional acceptance, partial commitment. The
implementation has neither schema nor phase for such interactions.

### D — Instructive injection is the *only* mode of education

The first-ship catalogue is instructional: a maintainer writes a
manifest and the agency exists. The plan has no mode of *experiential*
education in which an agency emerges from repeated cases. §10.8's
warning against drilled rules is, in implementation terms, a warning
that the plan currently has *only* the failure mode the chapter
describes: the maintainer writes Appearance and History, and they
either work or they do not. There is no slower, more transferable
mode.

### E — Fragility is not measured

Even where the plan's instructional mode is necessary, §10.8 implies
the result should be *flagged as fragile* until evidence of transfer
arrives. No manifest field encodes "this agency was authored for
case X; its applicability to neighbours is unconfirmed." Maturity
or trust grading (gap E in [som-10.2-sor.md](som-10.2-sor.md)) is
absent.

---

## Summary table

| # | Idea from §10.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Special-cased rules don't transfer | Partial | Unit of change is the agency, not the rule; transfer not tested (gap A). |
| 2 | Inner middle structure must develop | Partial | Middle structure exists; it is authored, not developed (gap D). |
| 3 | Multilayer simulation can't be injected | Yes | Plan operates on agencies, not on rule-piles. |
| 4 | Competition is the easy resolution | Yes | Settlement selects rather than pools. |
| 5 | Cooperation / compromise comes later | No | No primitive for pooled answers (gaps B, C). |
| — | Fragility marker on instructed structure | No | No "transfer-unconfirmed" field (gap E). |

---

## Implication for the plan (no changes proposed here)

§10.8 lands a pointed observation: the plan's mode of growth is
exactly the mode Minsky says works poorly — direct, instructional,
case-specific authoring — and the plan's resolution mode is exactly
the mode he calls easy-but-limited — winner-take-all. Both are
defensible *as a starting point*; chapter 10 already foreshadows that
they will not be enough. The largest unforced opportunities are
gap A (a transfer test for agency changes) and gap B (a settlement
shape that allows pooled answers). Closing either would touch the
settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
the handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the evolution material in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/).
Nothing here is a change request. Any such move falls under the
"stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
