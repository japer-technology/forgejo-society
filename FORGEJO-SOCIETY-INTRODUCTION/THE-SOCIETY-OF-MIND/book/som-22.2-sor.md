# Section 22.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.2.md](som-22.2.md) — *Isonomes*
(Minsky, §22.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.2 introduces a third activator type alongside the polyneme.
An *isonome* has a built-in, *uniform* effect on many agencies; a
polyneme has *different, learned* effects on each. Pronomes are one
kind of isonome (memory-control); there must be others — *interruption
isonomes*, *level-band isonomes* — that act over larger spans.

---

## The ideas Section 22.2 actually carries

1. **Two activator kinds, not one.** Polynemes (learned, divergent
   effects) and isonomes (built-in, uniform effects) are
   complementary, not interchangeable.
2. **Polynemes are the memories themselves; isonomes control how
   memories are used.** Content versus control.
3. **Isonomes work because agencies are architecturally similar.**
   Common genetic origin gives the columns of the book a roughly
   parallel structure; a single signal can therefore land identically
   on many of them.
4. **Pronomes are one species of isonome.** They control short-term
   memory uniformly across recipients.
5. **There must be larger-scale isonomes.** *Interruption isonomes*
   save and restore the pronome assignments of an entire frame at
   once (the grammar-word case: *who*, *which*).
6. **There must be band-control isonomes.** Some isonomes adjust the
   activity level of another agency without entering its internals.
7. **Polyneme power comes from learning; isonome power comes from
   exploiting structural similarity.** Two different sources of
   leverage.

---

## What the implementation already absorbs

### Polynemes as learned, divergent activators (idea 2)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
defines polynemes with per-agency `excite` / `inhibit` weights. Each
polyneme touches its agencies *differently* — which is exactly the
divergent, learned character §22.2 names.

### Architectural similarity makes uniform effects possible (idea 3)

The manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
gives every agency the same shape: `id`, `agency`, `kind`, `authority`,
`activates_on`, `outputs`, `budget`. Because every agency presents the
same fields, a control signal that targets one of those fields (for
example, "lower budget", "raise required confidence") would land
identically on all of them — the structural precondition for an
isonome.

### Phase boundaries act as isonomes by structure (idea 1, partially)

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
broadcasts a single, uniform signal at each phase transition —
*perceive → activate → deliberate → criticize → censor → settle →
act → remember → report*. Each phase change has the same effect on
every agency it touches: open this kind of output, close that one.
This is an isonome in everything but name.

### A control / content split (idea 2)

The split between `nemes/` (polynemes, content activators) and
`policies/` (uniform behavioural constraints) in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
mirrors §22.2's "memories themselves" versus "how memories are used"
distinction. Policies behave isonomically: they apply the same rule to
every agency in scope.

---

## What the implementation does not yet take into account

### A — No first-class "isonome" record type

The plan has polynemes, signals, handoffs, and policies; it does not
have a record type whose declared role is "uniform control across many
agencies." Phase transitions and policies *behave* isonomically but
are not modelled as isonomes — which means new isonomes can only be
introduced by editing the pipeline or the policy layer, not by adding
a file.

### B — No interruption isonome

§22.2 specifies an isonome that saves and restores *all* the pronome
assignments of an entire frame at once, so that a sub-task may borrow
short-term memory and return it intact. The plan has no save/restore
primitive at the frame level. A single run holds one stimulus and one
frame; nesting a sub-frame inside a frame within the same run is not a
mechanism the implementation provides.

### C — No level-band isonome

The "control the level of activity in another agency without entering
its internals" case is unaddressed. The plan can `inhibit` an agency
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
but it cannot say "run the *memory* family at half their usual
budget for this stimulus" as a single isonomic signal that lands
identically across that family.

### D — Pronome / isonome relationship is unrepresented

Because the plan does not yet model pronomes as first-class slots (see
[som-22.1-sor.md](som-22.1-sor.md), gap A), it also cannot model the
fact that the pronome is *one species* of isonome. The genus-species
relationship Minsky uses to motivate larger isonomes (interruption,
band-control) has no scaffolding to attach to.

### E — Common-shape leverage is structural, not declared

The plan benefits from architectural similarity (gap-free idea 3) by
accident of schema design, not by declared intent. There is no
documented commitment that all manifests will keep the same shape so
that future isonomes will land uniformly; a future schema change
could quietly break that property without the plan noticing.

### F — No way to distinguish "content arrived" from "control arrived"

In the handoff schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
a `Signal` carries `name`, `energy`, `evidence`, `suggested_effects`.
There is no field that marks a signal as *isonomic* (uniform
control) versus *polynemic* (learned content). Critics and the policy
layer cannot tell the two apart.

---

## Summary table

| # | Idea from §22.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Two activator kinds (polyneme / isonome) | Partial | Polynemes explicit; isonomes implicit in phase transitions and policies (gap A). |
| 2 | Content vs control split | Yes | `nemes/` vs `policies/`. |
| 3 | Architectural similarity enables uniform effects | Yes (structural) | Common manifest schema; not declared as a commitment (gap E). |
| 4 | Pronomes are a species of isonome | No | No pronome primitive yet, so no genus (gap D). |
| 5 | Interruption isonome (frame-level save/restore) | No | No nested-frame mechanism in a single run (gap B). |
| 6 | Level-band isonome | No | Inhibition is per-agency; no family-wide band control (gap C). |
| 7 | Two distinct sources of leverage | Partial | Polyneme leverage realised; isonome leverage realised only in fixed places (gaps A, B, C). |

---

## Implication for the plan (no changes proposed here)

§22.2 names a control surface the plan operates on without modelling
it. Phase transitions, policy enforcement, authority bands, and the
budget block of every manifest are isonomic in behaviour; the plan
just does not call them that. The cost of leaving them unnamed is that
the *new* isonomes Minsky points at — interruption save/restore,
family-wide level-band control — have no schema to attach to.

Any move to introduce a first-class isonome record, distinguish
isonomic from polynemic signals in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
or add a frame-level save/restore primitive to the runtime would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
