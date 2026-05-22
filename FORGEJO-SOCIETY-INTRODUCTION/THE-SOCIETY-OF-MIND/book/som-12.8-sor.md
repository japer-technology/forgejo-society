# Section 12.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.8.md](som-12.8.md) — *Problems of disunity*
(Minsky, §12.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.8 is the structural payoff of the chapter. Many useful ideas
are *two ideas in one*, bridging structure and function or two
points of view. When the bridge is built, a compact uniframe on
one side typically corresponds to an *accumulation* on the other:
the goal of *reaching something high up* admits a stick, a chair,
or a taller friend. Disunity is not a defect; it is the price of
crossing realms.

---

## The ideas Section 12.8 actually carries

1. **The uni-vs-accumulate choice depends on purpose.** Sometimes
   form-likeness matters; sometimes use-likeness does.
2. **Uniframes can embed sub-accumulations.** "Block or wedge"
   inside the arch uniframe.
3. **Many good ideas are bridges between realms.** Goal-side and
   means-side rarely match one-to-one.
4. **A uniframe on one side implies an accumulation on the
   other.** This asymmetry is structural.
5. **Disunity is unavoidable when ideas cross realms.** Birds /
   airplanes; flight crosses the animal / machine cut.
6. **Cross-realm unifying schemes are precious and few.** Most
   bridging metaphors are scarce resources.

---

## What the implementation already absorbs

### Uniframes can embed accumulations (idea 2)

The frame schema
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
lets a slot be `filled_by:` a *list* of agencies. A frame is a
uniframe; an open list of fillers is an accumulation inside it.
The `code-change` frame's `relevant_files` slot, for example, is
an accumulation embedded in a uniframe.

### Cross-realm channels exist (ideas 3, 6)

`THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md` and the
inter-repo communication model
([`13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md))
explicitly treat *bridges between societies* as named, governed
constructs. The named bridge agencies under
`agencies/integration/`
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md))
are the operational analogue of Minsky's cross-realm schemes.

### Disunity recorded, not denied (idea 5)

`memory/failure/` and the `blind_spots:` slot in the settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
record disunity rather than smoothing over it. A `pending_human`
outcome
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
is the explicit acknowledgement that the society could not
unify on its own.

### Purpose-dependence of strategy (idea 1)

Different frames choose different default actions and critics
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
so the *same* stimulus can be treated structurally or functionally
depending on which frame matches.

---

## What the implementation does not yet take into account

### A — No representation of the structure ↔ function bridge per concept

§12.8's central observation — that the two sides of a useful
concept are usually a uniframe and an accumulation — has no place
in the concept schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).
A `memory/concepts/` entry cannot declare "structural side:
uniframe; functional side: accumulation".

### B — Sub-accumulation is implicit

Frame slots can carry lists of fillers, but the runtime does not
*notice* that a slot is acting as a sub-accumulation, nor cap its
membership the way §12.7 implies should eventually happen. There
is no formal "this slot has become an accumulation" event.

### C — Cross-realm schemes are not catalogued

Bridges and inter-repo channels exist
([`13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md)),
but the plan does not maintain a registry of *cross-realm
unifying schemes* (e.g. metaphors, analogies that span domains).
`memory/analogies/` is reserved
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
but, per §12.4, its production mechanism is unspecified.

### D — Disunity is recorded but not quantified

The plan can record a `blind_spot` or a failure but does not
*measure* disunity. There is no metric like "this frame has 3
sub-accumulations, each over the soft cap, suggesting two-realm
strain". The ecology-monitor cron pass could compute it; the
contract is not defined.

### E — The "two ideas in one" criterion is absent from concept promotion

`memory/concepts/` entries become first-class only via governance
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The promotion criterion is unspecified. §12.8 suggests a useful
criterion — *the concept must bridge realms* — but the plan does
not adopt it.

---

## Summary table

| # | Idea from §12.8 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Uni-vs-accumulate depends on purpose | Yes | Frame matches drive strategy. |
| 2 | Uniframes can embed sub-accumulations | Yes (informally) | List-valued slots; not labelled as sub-accumulation (gap B). |
| 3 | Many good ideas are bridges between realms | Yes (substrate) | Bridges protocol, inter-repo channels. |
| 4 | Uniframe on one side ↔ accumulation on the other | No | Concept schema does not record this duality (gap A). |
| 5 | Disunity is unavoidable across realms | Yes | `blind_spots`, `failure/`, `pending_human`. |
| 6 | Cross-realm unifying schemes are precious | Partial | Bridges exist; cross-realm scheme registry does not (gap C). |
| — | Disunity quantified | No | No metric (gap D). |
| — | "Two ideas in one" as promotion criterion | No | Concept promotion criterion unspecified (gap E). |

---

## Implication for the plan (no changes proposed here)

§12.8 turns disunity from a defect into a structural fact about
useful ideas. The plan already *tolerates* disunity (records
blind spots, escalates to human, preserves failure) and has the
*substrate* for bridges (bridges protocol, inter-repo channels).
What it lacks is a *representational* commitment: nowhere does
the plan record, for a given concept, *which side is uniframed
and which is accumulated*.

Closing this gap would touch the concept schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(a two-sided shape), the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(sub-accumulation labels and caps), and the bridges protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/18-bridges.md)
(a cross-realm scheme registry). These are governance-shape
changes, not edits to runnable code, and fall under the
stop-and-ask rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md). This file records the analysis;
it does not request the change.
