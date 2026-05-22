# Section 30.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-30.7.md](som-30.7.md) — *The myth of the
third alternative* (Minsky, §30.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§30.7 finishes §30.6. The third region — Will, Spirit, Soul — is
postulated to escape Cause and Chance, and is forced to shrink
whenever either claims new territory. Yet the belief is
indispensable: praise, blame, responsibility, virtue, and child-rearing
are all built on it. We knowingly keep a belief we know is false
because too much social architecture depends on it.

---

## The ideas Section 30.7 actually carries

1. **Will is residual.** It holds whatever Cause and Chance have not
   yet claimed; it shrinks over time.
2. **Will is socially indispensable.** Praise, blame, responsibility,
   credit, and child-rearing rest on it.
3. **Self-ideals require it.** "Resisting temptation" requires a
   self that *chose* to resist; otherwise virtue evaporates.
4. **The belief is maintained knowingly.** We hold it because too
   much of our psychology rests on it, not because we think it true.

---

## What the implementation already absorbs

### A non-mystical substitute for Will (idea 1)

The plan answers "where does the choice live?" with the settlement
record + the authority chain
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
This is exactly the move Minsky would endorse: name the locus, do not
mystify it.

### Accountability without a soul (idea 2)

The credit-assignment protocol
([`02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md))
and the human-approval gates
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
give a structural basis for praise and blame: an action is attributed
to the agencies that produced it and the authority that permitted
it. Responsibility is located, not invented.

### Self-ideals as named files (idea 3)

`governance/self-ideals.md`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
makes ideals an editable, auditable artefact. "Resisting" a candidate
action that violates self-ideals is a recorded censor or critic step,
not a mystery.

---

## What the implementation does not yet take into account

### A — User-facing anthropomorphism is unmanaged

§30.7 says people will hold the Will belief *even when they know it
is false* because the social architecture demands it. The plan's voice
rules in [AGENTS.md](../../../AGENTS.md) forbid "AGI" and similar
language but do not specifically govern phrasings like *"the society
chose to…"* in reports produced by the conscious-presenter. Operators
will read attribution into bare attribution.

### B — Praise / blame have no schema beyond authorship

Credit-assignment records *who acted*; it does not record *who is
praiseworthy* or *who is blameworthy* in the moral sense §30.7 makes
load-bearing. The plan correctly resists adopting moral primitives,
but it does not document the resistance — leaving the gap unmarked.

### C — Self-ideals do not distinguish ideals from resistances

`governance/self-ideals.md` lists ideals but does not separate
*ideals* from *resistances* (the standing refusals that make virtue
visible). §30.7 makes the resistance — overriding a selfish impulse —
the place where virtue is *demonstrated*.

### D — No standing reminder that the substitute is not Will

The plan offers a structural substitute for Will but does not have a
visible statement (in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or [WARNING.md](../../../WARNING.md)) telling readers that
"settlement + authority chain" is *not* a Final Center, and that
attributions of choice to the society as a whole are conveniences,
not literal claims.

---

## Summary table

| # | Idea from §30.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Will is residual | Replaced | Settlement + authority chain locate choice without Will. |
| 2 | Will is socially indispensable | Partial | Credit-assignment + human gates give a structural basis; no praise/blame schema (gap B). |
| 3 | Self-ideals require Will | Partial | Self-ideals file present; ideals vs resistances not separated (gap C). |
| 4 | The belief is held knowingly | Partial | Voice rules guard against mysticism; user-facing attribution unmanaged (gap A); no standing reminder (gap D). |

---

## Implication for the plan (no changes proposed here)

§30.7 is the section the plan is most quietly aligned with: it
*replaces* the Final Center with a settlement record and an authority
chain, and locates virtue in named files rather than in an inner
soul. The remaining gaps are about how this substitution is
*communicated* (gaps A and D) and how *praise and blame* are
structurally distinguished from authorship (gap B).

Closing these would touch the voice rules in
[AGENTS.md](../../../AGENTS.md) / [CLAUDE.md](../../../CLAUDE.md), the
overview in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md),
the credit-assignment protocol
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and the governance material under
[`THE-SOCIETY-OF-REPO/01-governance/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
