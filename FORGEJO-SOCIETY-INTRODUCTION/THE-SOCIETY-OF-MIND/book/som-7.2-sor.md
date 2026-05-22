# Section 7.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-7.2.md](som-7.2.md) — *Uncommon sense* (Minsky,
§7.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§7.2 inverts the conventional ranking of difficulty. Expert programs
for logic and calculus appeared in the 1950s and 1960s; programs that
could stack blocks like a child did not arrive until the 1970s. The
section's claim is that *expertise is easier than common sense*, and
the reason is structural: expertise needs *few representations*;
common sense needs *many*.

---

## The ideas Section 7.2 actually carries

1. **The paradox of childhood.** What looks easy (block-stacking,
   ordinary play) is computationally harder than what looks hard
   (theorem-proving, calculus).
2. **Few facts can carry a specialist.** The 1956 logic program and
   the 1961 calculus program ran on order-of-magnitude one hundred
   facts.
3. **Specialism = uniform representation.** Each specialty has *one*
   representational style; once a body of skills is invested in that
   style, accumulation is cheap.
4. **Common sense = many representations.** Ordinary reasoning
   requires shape, colour, space, time, support, balance, and the
   simultaneous management of all of them.
5. **The cost is in the *variety*.** Adding a new specialism (a new
   language, a new diagrammatic vocabulary) is more expensive than
   adding more depth within an existing one.
6. **Management cost is the bottleneck.** Many representations imply
   *more complicated management systems* — switching, mediation,
   translation between styles.

---

## What the implementation already absorbs

### Multiple representations as first-class structures

The plan already names several distinct representational styles and
gives each a home in the file tree:

- **Frames** — situational expectation schemas with required slots
  ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
  "Frames").
- **Polynemes** — symbol-like activators that match paths, labels, or
  phrases (same file, "Polynemes").
- **K-lines** — remembered mental configurations indexed by `cue`
  and `restore_when` (same file, "K-lines").
- **Analogies** — typed structural mappings between domains (same
  file, "Analogy fallback").
- **Settlements** — structured decision records
  ([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
- **Signals** — cheap high-frequency dotted-name records (same file).

Each style has its own schema, and the settlement layer is the
mediator between them. This is exactly Minsky's "many representations
need a management system."

### Family taxonomy as representational discipline

The agency families in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(perception, memory, code, safety, identity, integration, assembly,
meta-admin) keep each family within one representational habit:
perception speaks in percepts; memory speaks in retrievals; code
speaks in diffs; safety speaks in signals. A new bee added to an
existing family inherits that family's representation, which mirrors
Minsky's idea 3 (specialism = uniform representation).

### Layered blackboard as translation surface

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
("Two parallel write paths") and the `blackboard.md` /
`workspace.md` pair in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
implement the *layered blackboard* idea: each representation has a
layer, and translation between layers is the work of the assembly
family. This is the management-system response to idea 6.

### Common-sense breadth in the frame catalogue

The first-ship frame catalogue covers `question`, `bug`, `feature`,
`code-change`, `security-sensitive`, `self-modification`, `novel`.
This is breadth chosen for *administrative* common sense — the
several stylistically different situations a software repository
typically encounters. It is not childhood common sense, but it is
the same shape of answer.

---

## What the implementation does not yet take into account

### A — Common sense is not the default operating point

Minsky's claim is that *ordinary* behaviour is the hard case. The
plan is *expert-shaped*: the agencies, critics, and censors are
domain-narrow workers in software-engineering style. There is no
agency that contributes ordinary, undirected, low-stakes
understanding the way a child's block-stacker does. The closest
analogue is the `novel` frame, which is itself a fallback rather
than a baseline.

### B — Representational variety is named but not measured

Idea 5 says variety, not depth, is the cost. The plan has multiple
representations but no measurement of *how many distinct styles* a
given stimulus traversed. A settlement does not record "this run used
frame + 3 polynemes + 1 K-line + 2 analogies"; it records the
artefacts but not the *count of styles invoked*. The variety bill is
therefore invisible.

### C — Translation between representations is implicit

Idea 6 calls for a management system. The plan has assembly bees
(`agency.assembly.summary-tier-1`, `summary-tier-2` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
that compress signals into briefs, but it does not have *named
translators* between specific representations (e.g. frame→K-line,
polyneme→frame, analogy→candidate-action). The translations happen
inside `lifecycle/` modules
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Pipeline mapping table"), which is fine for execution but invisible
for review.

### D — Specialism's economy of scale is not exploited

Idea 3 says once an investment in a representation is made, depth is
cheap. The plan has no concept of *families maturing* — there is no
mechanism by which adding a fifth perception bee is administratively
cheaper than adding the first. The bootstrap checklist
([`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md))
and the `self-modification` settlement procedure
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
"Adding new agencies") treat each addition uniformly.

### E — No childhood phase

§7.2 implicitly describes a *developmental order*: ordinary
competence first, expertise grafted on later. The plan ships a
mature catalogue from the first commit
([`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md))
and has no "infancy" stage in which broad, shallow, multi-
representational competence is assembled before specialism.

### F — The block-world problem has no analogue

The section's anchor example — building a tower of blocks — is the
*physical-spatial* domain. The plan has no analogue: no spatial
representation, no support/balance reasoning, no notion of the
present tangible world. This is by construction (the substrate is
files and a forge), but it means a faithful reading of §7.2 leaves
a category that the plan can never enter without a sensor surface.

---

## Summary table

| # | Idea from §7.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | The paradox of childhood (ordinary is harder) | No | Plan is expert-shaped; no ordinary baseline (gap A). |
| 2 | Few facts carry a specialist | Yes | Frame catalogue, polyneme catalogue, critic catalogue are deliberately small. |
| 3 | Specialism = uniform representation | Yes | Family taxonomy in `05-agencies-critics-censors.md`. |
| 4 | Common sense = many representations | Partial | Multiple representations exist; common-sense breadth does not (gap A). |
| 5 | Cost is in variety, not depth | Partial | Variety exists; variety is not measured per stimulus (gap B); specialism's depth-economy not exploited (gap D). |
| 6 | Management cost is the bottleneck | Partial | Blackboard layers + assembly bees; translators between specific representations not named (gap C). |

---

## Implication for the plan (no changes proposed here)

§7.2 cuts against the plan's natural tendency. The implementation is
already a *small, expert* society; Minsky's section warns that small
and expert is the wrong frontier for *common sense*, and that the
real bill is paid in *variety management*. The plan's representational
catalogue is healthy; what it lacks is a way to *see* the variety it
already uses — a per-settlement count of representations invoked, a
named set of translators between them, and a place in the file tree
to record an "ordinary baseline" if one were ever attempted. The
absence of a physical-spatial domain (gap F) is structural and
should remain so.

These are recorded here as analysis, not as a change request. Closing
any of them would touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the assembly-bee specification in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the hierarchy-and-summaries protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md),
and possibly the bootstrap checklist in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
