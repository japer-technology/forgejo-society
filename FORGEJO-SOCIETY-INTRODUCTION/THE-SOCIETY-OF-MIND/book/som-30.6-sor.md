# Section 30.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-30.6.md](som-30.6.md) — *Freedom of will*
(Minsky, §30.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§30.6 sets up the problem the next section will resolve. We feel a
Final Center of Control choosing at every fork. The modern scientific
view leaves no room for that: every event is determined by prior
state or by chance, and neither leaves space for *choice* in the
ordinary sense. Resistance to compulsion is itself a learned habit of
difference-engines defending long-range goals.

---

## The ideas Section 30.6 actually carries

1. **The felt Ego / Final Center.** A subjective sense that "I"
   choose at each fork.
2. **Cause + Chance exhausts the room.** Determinism and randomness
   leave no third region for a choice-making self.
3. **Difference-engines must resist compulsion.** Long-range goals
   require defending themselves against other processes that would
   change them.
4. **Both Cause and Chance feel intolerable to self-respecting
   minds.** Submitting to either is psychologically unacceptable.

---

## What the implementation already absorbs

### The fork made structural (idea 1)

The settle phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is the literal fork: many candidate actions converge, one is
recorded, the rest become objections. The plan does not place an
Ego in this seat; it places a *settlement record*. The Final Center
is replaced by an auditable file.

### Authority instead of inner soul (idea 1, structural answer)

The authority registry
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
locates the right to act in file-granted permissions
(`read`, `draft`, `propose`, `act`, `govern`, `human`). Choice is
attributed to a *named authority chain*, not to a hidden chooser.

### Long-range-goal defence (idea 3)

`governance/self-ideals.md`, censors, and the meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
together perform the function Minsky describes: they resist changes
to long-range goals proposed by short-horizon agencies. Resistance
to compulsion is built into the safety layer.

---

## What the implementation does not yet take into account

### A — Cause and Chance are not separated in the trace

When a settlement records a decision, the trace does not distinguish
*deterministic policy* (a rule fired) from *stochastic generation*
(a sampled output from a language model). §30.6 makes that
distinction central. Without it, an outside reader cannot tell which
share of an action came from Cause and which from Chance.

### B — No record of the *felt* sense of agency

The plan correctly does not claim to *feel*. But §30.6 makes the
felt centre an ordinary part of how minds describe themselves. The
plan has no document acknowledging that operators and readers will
project a Final Center onto the society, and offering a structural
counter-description.

### C — Internal compulsion-resistance is undocumented

Censors handle *external* compulsion (unsafe egress, scope
violations). The plan does not specify the symmetric case: an
internal agency that attempts to overwrite `governance/self-ideals.md`
or modify the authority registry without governance approval. The
meta-admin family supports this in principle, but the resistance
policy is not codified.

### D — Forks are not classified

A settlement does not classify its fork as routine vs novel, low-stakes
vs irreversible, or local vs governance-scope. §30.6 treats *every*
fork as the same thing; the plan would benefit from distinguishing
them, but does not.

---

## Summary table

| # | Idea from §30.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Felt Ego / Final Center | Replaced | Settlement record + authority registry; no Ego claimed. |
| 2 | Cause + Chance exhausts the room | Partial | The plan acts deterministically + stochastically; trace does not separate them (gap A). |
| 3 | Difference-engines resist compulsion | Partial | Self-ideals + censors + meta-admin; internal resistance undocumented (gap C). |
| 4 | Submission to Cause or Chance is intolerable | n/a | Not modelled; user-facing projection unaddressed (gap B). |
| — | Forks are uniformly handled | Partial | Settlement is uniform; fork-classification absent (gap D). |

---

## Implication for the plan (no changes proposed here)

§30.6 makes the plan's structural answer to "where is the chooser?"
visible: it is in the settlement record and the authority chain, not
in an inner self. The cleanest absences are the lack of a Cause /
Chance separation in the trace (A), the unaddressed projection of an
Ego by readers (B), and the missing internal-compulsion policy (C).

Any work in these directions would touch
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the credit-assignment protocol
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and the introspection protocol
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
