# Section 26.11 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-26.11.md](som-26.11.md) — *Grammar*
(Minsky, §26.11).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§26.11 reframes grammar as a stack of *mental-operation expressers*.
To say *very big box*, one activates a *box* polyneme, selects the
*size* agency, then adjusts that agency's sensitivities with an
isonome named *very*. Grammar is the public side of internal
agency-manipulation, layered over years from imitation through
isonome-controlling skills to clause-interrupting forms.

---

## The ideas Section 26.11 actually carries

1. **Words express agency operations.** *Box* arouses; *big*
   selects; *very* adjusts sensitivity.
2. **Grammar is layered.** Early imitation → polyneme→pronome
   routing → frame arrangement → isonome control → clause-
   interruption.
3. **Speaking and understanding may be learned twice.**
   Psychologists do not yet know.
4. **Conjunction words express chain- and tree-building.** *And*,
   *but*, *who*, *which* are operations on cognitive structure.
5. **Layered development is the rule, not the exception.** Each
   new linguistic capacity rides on prior structural skill.

---

## What the implementation already absorbs

### Words/labels routed to operations (idea 1, partial)

`label-polynemes.yml` and `phrase-polynemes.yml`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
map specific tokens to specific agency-effects (`excite:`,
`inhibit:`, `default_frame:`). The `directive.spock`,
`directive.safety`, `directive.memory`, `directive.critic` symbols
are explicit "select-this-agency" operators — Minsky's *big*-as-
selector pattern, applied at the issue level.

### Layered runtime (idea 5)

The pipeline is itself layered
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
— perceive → activate → deliberate → criticize → censor → settle →
act → remember → report. Each layer assumes the previous and adds
its operation.

### Chain- and tree-building (idea 4, partial)

`linked:` fields on durable records
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
*Relational memory*) carry typed graph links — `supersedes`,
`derived_from`, `contradicts`, `cites`, `reinforces`,
`analogous_to`, `learned_from`. These are the runtime's
*conjunctions*.

---

## What the implementation does not yet take into account

### A — No isonome (sensitivity-modulator) primitive

A polyneme excites or inhibits agencies; it does not *adjust the
sensitivity* of an agency. Minsky's *very* is a third kind of
operator the plan does not have. The closest is `policies/`-driven
threshold change, but a policy changes the rule globally, not as a
per-stimulus modifier.

### B — Speaking and understanding are one path

The conscious presenter
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
*integration family*) produces visible output; perception agencies
consume input. They are different agencies but share schemas. The
plan does not represent the possibility that the two halves might
follow *different rules* — Minsky's §26.11 explicitly raises this
as an open empirical question.

### C — No imitation / babble layer

Minsky's early-stage *vocal-sound agents* and *predestined
learning processes* have no analogue. The plan does not bootstrap
its language behaviour from imitation; the first-ship agency
catalogue is delivered fully-formed
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).

### D — Grammar-tactics are not represented at the output layer

The conscious presenter assembles "one coherent response" from the
settled blackboard
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
*Conscious bottleneck*). There is no typed catalogue of *output
grammar-tactics* (e.g. "use *by the way* to change topic", "use
*for example* to descend a level"). Discourse-shaping is delegated
to the model.

---

## Summary table

| # | Idea from §26.11 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Words express agency operations | Partial | Polynemes excite/inhibit; no sensitivity modulators (gap A). |
| 2 | Grammar is layered | Yes | Pipeline phases. |
| 3 | Speaking and understanding may be learned twice | N/A | One path serves both (gap B). |
| 4 | Conjunctions express chain/tree building | Yes | Typed `linked:` fields on records. |
| 5 | Layered development | Partial | First-ship catalogue is fully-formed (gap C). |

---

## Implication for the plan (no changes proposed here)

§26.11 names a third polyneme-like primitive (the *isonome*) and a
catalogue of output grammar-tactics. Both are coherent additions
that the plan's current schemas could support without structural
upheaval, but neither is present today, and adding them would shift
the boundary between *plan* and *protocol*.

This is recorded as analysis only. Any move toward isonomes or an
explicit output grammar-tactic catalogue would touch the polyneme
schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the activation protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and the integration family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
