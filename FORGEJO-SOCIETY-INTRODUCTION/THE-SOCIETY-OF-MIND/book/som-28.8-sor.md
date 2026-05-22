# Section 28.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-28.8.md](som-28.8.md) — *Overlapping minds*
(Minsky, §28.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§28.8 closes Chapter 28 by reframing the popular left-brain / right-
brain split. Brains are crowded with smaller mind-like processes
whose boundaries overlap; calling any one of them a "mind" depends on
finding coherent internal structure inside that boundary. Several
sub-minds can share agents with each other, and even with the larger
self, while keeping their internal lives sealed off. The unity we
experience is structural, not metaphysical — and trying to know
everything happening inside leaves no room to think.

---

## The ideas Section 28.8 actually carries

Pulled from Minsky's text:

1. **Any line drawn through a brain creates a candidate sub-mind.**
   Left/right, front/back, and every other partition is in principle
   admissible.
2. **A region counts as a mind only when its internal relationships
   cohere.** Coherence, not anatomy, is the test.
3. **The less the candidate resembles you, the less it means to call
   it a mind.** "Mind" is a graded attribution, anchored on the
   self.
4. **Some sub-agencies do solve hard problems in their own right.**
   Vision, locomotion, language carry intricate cognition that the
   self does not see.
5. **Sub-minds can share agents.** Several mini-minds may overlap
   without sharing mental lives — "like tenants in a rooming house."
6. **Selective awareness is possible but limited.** Some normally
   unconscious processes can be brought into view; total
   transparency is incompatible with thought.

---

## What the implementation already absorbs

### Coherent boundaries, not arbitrary cuts (idea 2)

The agency family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
— perception, memory, code, safety, identity, integration, assembly,
meta-admin — draws lines that pass §28.8's coherence test. Each
family shares a purpose, an authority profile, and an internal
working pattern. Arbitrary cuts (e.g. "files starting with letter
*c*") are not used.

### Several mini-minds with overlapping agents (idea 5)

Many agencies subscribe to overlapping `activates_on` triggers and
share polynemes and K-lines per
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md).
A single perception event can wake several agencies in different
families; the agencies share state via the layered blackboard
described in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
each runs its own deliberation. This is §28.8's rooming-house image
in workflow form.

### Hard problems solved inside sub-agencies (idea 4)

The agencies under `agency.code.*`, `agency.security.*`, and
`agency.identity.*` carry intricate, self-contained logic
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The conscious presenter at the top of
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
does not see the internal reasoning of those agencies; it sees their
emitted signals, candidate actions, and objections. The §1.1 analysis
already flagged this under Awareness; §28.8 confirms the asymmetry.

### Structural unity, not totalising transparency (idea 6)

The conscious-bottleneck phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
deliberately collapses many streams into a single visible utterance.
The introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md)
gives the society *some* selective access to its own state
(`unknowns`, `blind_spots` slots) without pretending to total
self-knowledge. The plan agrees with §28.8 that exposing everything
would prevent thought.

### Graded mind-attribution (idea 3)

The voice rules in [AGENTS.md](../../../AGENTS.md) refuse to call the
society "AI", "AGI", or "an AI brain." Internally, agencies are
*agencies*, not *minds*. There is exactly one place — Spock as a
whole — that earns the name. This matches §28.8's claim that "mind"
is graded and anchored.

---

## What the implementation does not yet take into account

### A — Overlapping boundaries are not first-class

The plan has agency *families* and agencies *within* families, but
not formal *overlapping* sub-minds. There is no construct for "this
subset of agencies, taken together, forms a mini-mind for *security
deliberation*" that is auditable as a unit. The closest analogue is
the frame, which scopes a set of agencies and rights for a single
stimulus — but a frame is per-cycle, not a standing sub-mind.

### B — No interior-vs-exterior view per agency

§28.8's image of mini-minds with sealed interiors implies the plan
should distinguish *external* signals (the agency's outputs, on the
blackboard, visible to the conscious presenter) from *internal*
deliberation (the agency's intermediate reasoning, not exposed). The
state model in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
captures the external view well (signals, objections, candidate
actions); the internal view of any given agency is mostly absent
from the file structure, by intention. §28.8 says that is right;
the plan does not yet *say* it is right.

### C — Selective awareness is not configurable

The introspection protocol grants `unknowns` and `blind_spots` slots
on the settlement, but the choice of *what* to expose is hand-coded
in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
and the relevant agency manifests. §28.8 suggests there is a real
question of *which* mini-mind activities to bring to the conscious
surface for a given stimulus class; the plan currently does not
parameterise the choice.

### D — Cross-cutting sub-minds are unrepresented

§28.8's example is left-brain / right-brain — a cross-cut that does
not respect the anatomy. The plan has hierarchical families; it has
no representation of cross-cutting sub-minds such as "the part of the
society that does *risk reasoning*" (some agencies from `safety`,
some from `identity`, some from `code`) or "the part that handles
*memory hygiene*" (parts of `memory`, `meta-admin`, `archivist`). A
*virtual sub-mind* concept would be a new primitive; none is
proposed here, but the absence is recorded.

### E — Sharing of agents across mini-minds is implicit

Polynemes and K-lines are shared across agencies, which is exactly
§28.8's "agents in common." But the plan does not surface a *sharing
graph* — which mini-minds share which agents, and what conflicts that
implies. The relational-link types in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
could carry the data; no document presents it.

### F — Many-minds claim not stated

§28.8's most striking sentence — that it *makes sense to think there
exists, inside your brain, a society of different minds* — is exactly
the plan's thesis when applied to a repository. The plan does not
quote it. A short statement, somewhere in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md),
that the society is a society of mini-minds with one outward voice
would complete the framing the rest of the document already enacts.

---

## Summary table

| # | Idea from §28.8 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Any partition is a candidate sub-mind | Partial | Families are coherent partitions; arbitrary cuts not modelled (gap A). |
| 2 | A region is a mind only if internally coherent | Yes | Agency families pass the test. |
| 3 | "Mind" is graded, anchored on self | Yes | Spock alone earns the name; voice rules enforce. |
| 4 | Sub-agencies solve hard problems independently | Yes | Code, security, identity agencies; conscious presenter sees only signals. |
| 5 | Sub-minds share agents | Yes (operationally) | Polynemes / K-lines shared; sharing graph not surfaced (gap E). |
| 6 | Selective awareness is bounded | Yes | Introspection protocol; conscious bottleneck; not configurable (gap C). |
| — | Standing overlapping sub-minds | No | Frames are per-cycle; no standing sub-mind primitive (gap A, gap D). |
| — | Interior vs exterior view per agency | Partial | External view in state; interior intentionally hidden, but not stated (gap B). |
| — | Many-minds thesis stated | No | Plan enacts; does not quote (gap F). |

---

## Implication for the plan (no changes proposed here)

§28.8 sits naturally with a repo-native architecture: a society of
overlapping mini-minds with one conscious voice is more or less what
the plan describes when its parts are read together. The gaps are
once again mostly descriptive (gap F, gap B) and partly structural
where formal overlap is concerned (gap A, gap D). The most useful
unforced opportunity is gap F: a one-paragraph statement in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
acknowledging that the society is a *society of mini-minds*, one
outward voice over many internal coherences. Gap A and gap D (standing
sub-minds, cross-cutting sub-minds) are interesting and structural;
they would touch the frames document and the family taxonomy and are
properly deferred.

This is recorded here as analysis, not as a change request. Any move
to close gap A or gap D would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
gap E would touch the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md);
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
