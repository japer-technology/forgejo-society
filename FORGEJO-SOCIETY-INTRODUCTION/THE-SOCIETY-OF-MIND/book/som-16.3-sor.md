# Section 16.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-16.3.md](som-16.3.md) — *Mental
proto-specialists* (Minsky, §16.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§16.3 makes the architectural sketch concrete. To build an animal,
list its basic needs and assign a *proto-specialist* to each, with
its own sensors, effectors, and mini-mind. Two economies follow:
specialists share common organs for interacting with the world, and
specialists share what they have learned. The first economy is
embodiment; the second is the observation that all goals end up
needing to solve the same subproblems.

---

## The ideas Section 16.3 actually carries

1. **Need-listing as design method.** Decide what the animal must do,
   then build one specialist per need.
2. **Proto-specialist anatomy.** Each one has its own sensors,
   effectors, and a small mini-mind specific to its job.
3. **Embodiment economy.** Most animals share a single set of organs
   across specialists, because per-specialist limbs would be ruinous.
4. **Knowledge-sharing economy.** Different initial goals converge on
   the same *subproblems* — finding ways around obstacles, conserving
   limited resources — so the machinery for those subproblems can be
   shared.
5. **Skill acquisition outgrows initial skills.** As problems get
   harder, prior techniques become less adequate, and the ability to
   acquire new knowledge and skills becomes the dominant capability.
6. **Most machinery is shared in the end.** For any ambitious goal,
   most of the required mechanisms can be shared with most other
   goals.

---

## What the implementation already absorbs

### Need-listing as the design method (idea 1)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
*is* a need-list. Each family — perception, memory, code, safety,
identity, integration, assembly, meta-admin — names a basic operating
need of the society, and each agency inside a family names a more
specific need within it. The same method is used; the only difference
is the substrate.

### Proto-specialist anatomy (idea 2)

Every agency manifest carries `tools:`, `activates_on:`, `outputs:`,
and `budget:` fields
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
These are the operational counterparts of "sensors, effectors,
mini-mind": the tools are the effectors, the activation conditions
are the sensors, and the prompt body is the mini-mind.

### Embodiment economy (idea 3)

The shared "set of organs" is the single workflow file
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
and the single runtime pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
Every agency uses the same runner, the same Forgejo bridge, the same
tool surface, the same state and memory trees. The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("every structure collapses to either a file under
`.forgejo-society/` or a step in the workflow") is the structural
guarantee that no agency carries its own organs.

### Knowledge-sharing economy (idea 4)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)'s
durable memory tree (`memory/semantic/`, `memory/procedural/`,
`memory/klines/`, `memory/concepts/`, `memory/analogies/`) is the
common pool every agency draws from. K-lines specifically are reused
across stimulus classes, and the analogy fallback in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
is designed to let one domain's solutions inform another's.

### Most machinery is shared (idea 6)

The critic catalogue is shared across all stimuli; the censor
catalogue is shared across all stimuli; the assembly family is shared
across all stimuli; the conscious presenter is the single producer of
visible response
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
Only the perception, memory, code, identity, and safety agencies are
specialised; everything else is shared infrastructure.

---

## What the implementation does not yet take into account

### A — Need-listing for the society itself is implicit

The plan's need-list is implicit in the catalogue. There is no
upstream document that says "these are the basic needs of a Forgejo
society" the way Minsky's diagram says "these are the basic needs of
an animal". A reviewer cannot trace `agency.perception.intake-bee`
back to the *need* it serves except by reading the prose.
[`THE-SOCIETY-OF-REPO/03-agencies/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/03-agencies/)
specifies families but not the underlying need-list.

### B — Subproblem-sharing is real but not catalogued

Idea 4 is the structural observation that goals converge on common
subproblems. The plan's shared substrate (memory, K-lines,
analogies) supports this, but there is no inventory of *which
subproblems are shared*. Compare with the danger-zone catalogue in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md):
those are named and enumerated. Convergent subproblems
("finding evidence", "estimating blast radius", "writing a revert
path") are present in the prose but not enumerated.

### C — Skill acquisition is gated to agencies, not skills

Idea 5 says the dominant capability of an advanced mind is the
ability to *acquire new skills*. The plan can acquire new agencies
through `self-modification`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md):
*Adding new agencies*). It cannot, today, acquire a new *skill* that
several existing agencies share without adding a new agency to carry
it. There is no "skill library" between agencies and tools.

### D — The "mini-mind" boundary is not parameterised

Idea 2's mini-mind is a small mind of its own. The plan's agency
manifest treats the prompt body as opaque; there is no schema for
*internal* sub-agencies of an agency, no recursion in the family
taxonomy. This is consistent with the keep-it-simple posture of the
first-ship catalogue, but it forecloses the literal protospecialist
picture where each specialist might itself be a small society.

---

## Summary table

| # | Idea from §16.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Need-listing as design method | Yes | First-ship catalogue is a need-list. |
| 2 | Proto-specialist anatomy | Yes | Manifest `tools:`/`activates_on:`/`outputs:`/`budget:`/prompt body. |
| 3 | Embodiment economy | Yes | Single workflow + shared runtime + collapse rule. |
| 4 | Knowledge-sharing economy | Partial | Shared memory exists; convergent subproblems not catalogued (gap B). |
| 5 | Skill acquisition outgrows initial skills | Partial | New agencies, yes; new shared skills, no (gap C). |
| 6 | Most machinery is shared | Yes | Critics, censors, assembly, presenter all shared. |
|   | Need-list documented as such | No | Implicit in catalogue (gap A). |
|   | Recursive agency structure | No | Manifest is flat (gap D). |

---

## Implication for the plan (no changes proposed here)

§16.3 confirms the plan's architectural method: list the needs,
build a specialist per need, share organs and knowledge. The plan
does this on a different substrate and arrives at a very similar
shape.

The substantive opportunity is gap B: enumerating the *convergent
subproblems* every stimulus class touches (evidence, blast radius,
revert path, freshness), so the shared machinery is visible the way
the danger zones are visible. Gap A is editorial: a one-page need-list
upstream of the catalogue would make the design method explicit.
Gaps C and D would require larger changes and are not implied by the
current scope.

These are recorded here as analysis, not as a change request. Any
move to add a need-list document, a subproblem inventory, or a skill
library between agencies and tools would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and possibly
[`THE-SOCIETY-OF-REPO/03-agencies/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/03-agencies/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
