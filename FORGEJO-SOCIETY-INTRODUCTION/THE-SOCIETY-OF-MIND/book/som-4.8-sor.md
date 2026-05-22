# Section 4.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-4.8.md](som-4.8.md) — *Ideals* (Minsky, §4.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§4.8 widens *ideals* beyond ethics to include the standards we
maintain — consciously or otherwise — for how we ought to think
about ordinary matters. It treats conflict between transient
inclinations and long-term ideals (and between ideals themselves) as
a normal condition, settled by *multilayered* agencies formed early.
It closes by reframing ideals as *long-term memory* a culture has
formed across centuries — coherence depends on them.

---

## The ideas Section 4.8 actually carries

1. **Ideals are broader than ethics.** They include cognitive
   standards: how we *ought to think* about ordinary matters.
2. **Conflict is structural.** Transient wants clash with long-term
   ideals; ideals clash with each other. Discomfort, guilt, and
   shame are the felt signs of these clashes.
3. **Resolve by changing acts or changing feelings.** Either modify
   the candidate act or modify the standard. Both are valid moves.
4. **Multilayered agencies do the settling.** Conflict is resolved
   by an *infrastructure* built up over time, not by a single
   decision rule.
5. **Older agencies shape newer ones.** Growth happens in
   overlapping waves; earlier layers bias the formation of later
   ones.
6. **Outside-in inheritance.** Individuals absorb ideals from
   parents, peers, even from mythic figures — the source is
   external and social.
7. **Ideals stabilise coherence.** Without enduring self-ideals,
   neither individuals nor groups can trust their own continuity.
8. **Many "personal" principles are cultural memory.** Long-term
   social memory is stored in the ideals of individual minds.

---

## What the implementation already absorbs

### Ideals as cognitive standards (idea 1)

The plan's voice rules in [AGENTS.md](../../../AGENTS.md) — calm,
precise, specifics over slogans, mechanisms over mystique — are
*how the society ought to think*, not what it ought to value
ethically. `governance/self-ideals.md`
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
row `01-governance/self-ideals.md`) carries the broader-than-ethics
sense Minsky describes.

### Conflict is structural (idea 2)

Every settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
contains `proposals`, `critics`, `censors`, `objections`. Conflict
is the default substrate. Sustained objections shape outcomes; the
data model expects disagreement.

### Resolution by either side (idea 3, partial)

The plan can modify *the act* — settle on a different candidate
action, reject the candidate, branch instead of merge
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Branches as candidate futures"). It can also modify *the standard*
— `self-modification` frame edits to `self-ideals.md` and
`AGENTS.md`. Both sides are present, though with very different
costs.

### Multilayered settlement (idea 4)

The pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is exactly multilayered: perception, activation, deliberation,
criticism, censorship, settlement, action. Each layer has a
different rule and a different write surface
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The `assembly` family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
even has tiered summaries — Minsky's "multilayered agencies that are
formed in the early years" rendered as
`summary-tier-1`, `summary-tier-2`.

### Ideals stabilise coherence (idea 7)

`ideals_cited:` in the settlement schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
makes self-ideals load-bearing in every decision. They are the
society's stability axis.

### Ideals as long-term memory (idea 8)

`memory/semantic/project-laws.log`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
holds "invariants the society must respect" and is, structurally,
the place where cultural memory of a particular forge lives.

---

## What the implementation does not yet take into account

### A — Ideal-vs-ideal conflict is not represented

Idea 2 includes *conflicts between ideals.* The plan can record an
objection against a proposal; it has no mechanism to record an
objection of *one self-ideal against another self-ideal.* The
settlement's `ideals_cited:` is a flat list. If two cited ideals
pull in opposite directions, the settlement records both citations
but not the tension.

### B — No discomfort / guilt / shame analogue

Idea 2 names felt signals — discomfort, guilt, shame — that mark a
clash. The plan has scalar appraisals
(`agency.safety.blast-radius-fear`,
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but no signal whose role is to mark *ideal-violation by a proposal
the society otherwise endorses*. The voice rules in
[AGENTS.md](../../../AGENTS.md) correctly forbid anthropomorphism;
the gap is not the *feeling* but the *appraisal channel* — there
is no signal named, for example, `ideal.violation`.

### C — Asymmetry between modifying act and modifying standard

Idea 3 says both moves are valid. In the plan, modifying *the act*
is cheap (any settlement) and modifying *the standard* is expensive
(self-modification frame + human approval). This asymmetry is
correct as policy but is *not recorded as a deliberate choice* in
the plan documents. A reader cannot find a paragraph saying "we
weight standard-changes more heavily than act-changes because
[reason]".

### D — Older agencies shaping newer ones (idea 5) is missing

§4.8 names *overlapping waves* — older layers bias the formation of
new ones. The plan has K-lines that influence new activation
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
which is a partial echo, but no rule that says "when a new agency
manifest is proposed under `self-modification`, the existing self-
ideals must be consulted in its design." The
`agency.identity.spock-self-model` checks *responses* against
`AGENTS.md`; nothing checks *new agency drafts* against the
existing identity family.

### E — Outside-in inheritance (idea 6) is not modelled

Individuals absorb ideals from parents, peers, mythic figures. The
plan has channels
([`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
section `09-channels`) as a Phase C stub for inter-society
communication. There is no specific mechanism for *adopting an
ideal from a peer society*, no `imported_from:` field on a self-
ideal, no record of cultural lineage. Federation material
([`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/))
is where this would live and does not yet specify it.

### F — Cultural memory is per-society, not cross-society

Idea 8: "long-term memories in which our cultures store what they
have learned across the centuries." The plan stores cultural
memory *per society* (in `memory/`). Cross-society memory — the
federation's accumulated learning, shared across forges — has no
structure yet. This is the federation gap noted across several
§1.1-level analyses; §4.8 supplies a separate reason for closing it:
ideals are inherited across societies, not freshly invented in each.

---

## Summary table

| # | Idea from §4.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Ideals are broader than ethics | Yes | Voice rules + `self-ideals.md`. |
| 2 | Conflict is structural | Partial | Proposal-vs-critic yes; ideal-vs-ideal no (gap A); ideal-violation signal absent (gap B). |
| 3 | Resolve by changing acts or standards | Partial | Both possible; asymmetry not documented (gap C). |
| 4 | Multilayered settlement | Yes | Pipeline + assembly tiers. |
| 5 | Older agencies shape newer | Partial | K-lines bias activation; no manifest-design check (gap D). |
| 6 | Outside-in inheritance from peers | No | Channels stub; no `imported_from:` (gap E). |
| 7 | Ideals stabilise coherence | Yes | `ideals_cited:` in settlement schema. |
| 8 | Many personal principles are cultural memory | Partial | Per-society yes; cross-society absent (gap F). |

---

## Implication for the plan (no changes proposed here)

§4.8 closes Chapter 4 by tying *Self* to *culture*: ideals are
how individuals carry what their cultures learned. The plan has the
per-society half of this picture in good order — pipeline layers,
self-ideals citable in settlements, append-only cultural memory.
The unmet half is *cross-society* and *cross-time*: importing
ideals from peer societies, recording ideal-vs-ideal tension,
predicting how a new agency's draft will sit with the existing
identity family.

Any move to close gaps A–F would touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the channels / federation material in
[`THE-SOCIETY-OF-REPO/09-channels/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/09-channels/)
and
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
the self-ideals specification in
[`THE-SOCIETY-OF-REPO/01-governance/self-ideals.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/self-ideals.md),
and the inter-repo communication plan
([`FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md)),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
