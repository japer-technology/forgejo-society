# Section 14.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-14.1.md](som-14.1.md) — *Using reformulation*
(Minsky, §14.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§14.1 opens the chapter on *reformulation* — the move of stepping
out of one description of a problem into another. Minsky uses the
arch to enumerate realms (aesthetic, dynamical, topological,
geometrical, architectural, constructional, circumventional,
transportational) and proposes that the *body–support* cut is so
useful because it bridges *thing* and *purpose*. This analysis asks
where the implementation already supports moving between realms, and
where it still treats a single framing as canonical.

---

## The ideas Section 14.1 actually carries

1. **Reformulation is the escape route.** When a method is
   exhausted, the productive move is not harder search inside the
   same description; it is changing the description.
2. **A realm is a description-world.** Each realm (aesthetic,
   geometrical, constructional, …) has its own vocabulary and its
   own admissible operations.
3. **Few themes, many variations.** The inventor's apparent
   inexhaustibility is, on the inside, a small number of cross-realm
   themes — the body–support cut being the canonical one.
4. **New techniques borrow from older agencies.** Reformulation is
   not invention from nothing; it adapts existing agency-skills to
   new purposes.
5. **The most productive thoughts produce new *descriptions*, not
   new *answers*.** A theory of mind that does not represent
   description-change has missed the leverage point.
6. **The body–support cut bridges thing and purpose.** The cut is
   psychologically loaded because it ties a structural part to the
   goal it serves; supports are recognised *as* supports only with
   reference to the body's function.
7. **To understand how something works, know how it can fail.** The
   leg-failure thought-experiment is the operational test of whether
   the body–support reading is real.

---

## What the implementation already absorbs

### Multiple description-worlds exist (ideas 1, 2)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
declares frames as the place where alternative readings of the same
situation are held simultaneously. The blackboard in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
admits multiple polynemes against the same signal, and the family
taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
gives different agency families (perception, memory, code, safety,
identity, integration, assembly) their own vocabulary. Several realms
can speak about the same input without one having to win first.

### Borrowing from older agencies (idea 4)

The self-modification frame and
`agency.meta-admin.differentiation-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
explicitly produce new agencies by *differentiation* of existing
ones, not from scratch. The provenance fields in the manifest record
the parent agency, so adaptation is auditable. This is Minsky's
"roots in older ones" expressed as a git-tracked lineage.

### Failure as understanding (idea 7)

`agency.safety.blast-radius-fear` and the censor phase
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
require every candidate action to be reasoned about in terms of what
its failure would do. The handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carries `risks` and `failure_modes` slots. The plan treats "how it
can fail" as a first-class field, which is the operational form of
Minsky's leg-failure test.

---

## What the implementation does not yet take into account

### A — Reformulation as a named pipeline step

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
has perceive, activate, deliberate, criticize, censor, settle, act,
remember, report. There is no *reformulate* phase. When the
settlement layer cannot reconcile, the plan currently has the
society escalate to `human` rather than re-describe the problem in a
different realm and try again. Minsky's central move is missing as
a phase.

### B — Realms are not first-class objects

Frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are individual, but there is no `realm` field grouping them into the
aesthetic / geometrical / constructional / transportational families
Minsky enumerates. As a result, the plan cannot say "we have tried
every reading in the constructional realm; switch to the
circumventional realm." Realm-level reasoning has no schema slot.

### C — Body–support is not a generic schema

The body–support cut is the chapter's canonical example, and it
appears nowhere in the manifest. There is no schema for "essential
part vs. supporting part" of a candidate plan, no critic that asks
"which part of this proposal is the body and which is the support?"
A reformulation primitive that the rest of Chapter 14 builds on is
absent.

### D — No metric for description-change productivity

Idea 5 — that the most productive thoughts are new descriptions
rather than new answers — has no analogue in
`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The plan logs which actions succeeded; it does not log which
*reframings* succeeded. There is therefore no pressure inside the
society to develop better reformulation skill over time.

### E — Cross-realm correspondences are not stored

Minsky's "systematic cross-realm correspondences" — translations
like `supported by` ↔ `horizontal surface underneath` — would
naturally live in `memory/semantic/` or
`02-protocols/14-relational-memory.md`
([SOR](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)).
At present, the relational memory protocol records relations between
*records*, not between *vocabularies*. The plan has no place to put
"in this society, *blocks an egress* means the same as *forms a
trap*."

---

## Summary table

| # | Idea from §14.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Reformulation as escape | Partial | Multiple polynemes coexist; no `reformulate` step (gap A). |
| 2 | Realms as description-worlds | Partial | Frames exist; realms unnamed (gap B). |
| 3 | Few themes, many variations | No | No representation of recurring cross-realm themes (gap E). |
| 4 | New techniques borrow from older | Yes | Differentiation-broker; provenance fields. |
| 5 | Productive thought = new descriptions | No | Reinforcement log records actions, not reframings (gap D). |
| 6 | Body–support bridges thing and purpose | No | Not a manifest schema (gap C). |
| 7 | Understand by knowing how it fails | Yes | `risks` / `failure_modes` slots; blast-radius-fear. |

---

## Implication for the plan (no changes proposed here)

§14.1 names the move — *reformulation* — that the rest of the
chapter operationalises. The implementation absorbs the *static*
half (multiple readings can coexist; failure is reasoned about) and
misses the *dynamic* half (no phase, schema, or metric for changing
the description itself). The biggest single gap is A: the absence of
a `reformulate` phase between `criticize` and a second `deliberate`
pass; the next is C: the absence of body–support as a generic
schema for distinguishing the part of a proposal that does the work
from the parts that merely support it.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the frame definitions in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
