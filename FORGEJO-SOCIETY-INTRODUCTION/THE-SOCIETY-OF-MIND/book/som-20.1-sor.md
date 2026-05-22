# Section 20.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-20.1.md](som-20.1.md) — *Ambiguity* (Minsky,
§20.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§20.1 opens the chapter on context with an unexpected claim: the
problem of expressing a thought is not the ambiguity of words; it is
the ambiguity of *thoughts themselves*. A mental state is a
distribution across agencies, much of it inaccessible to language, and
its significance depends on agencies that have not yet acted. The act
of expressing changes the state being expressed.

---

## The ideas Section 20.1 actually carries

1. **Thoughts are themselves ambiguous.** The complaint that we
   cannot express what we think is not a translation failure between
   inner content and outer words — the inner content is not
   determinate to begin with.
2. **A mental state is a distribution.** "What you're thinking
   now" is the state of many agencies; much of it is inaccessible to
   the language-agency.
3. **Significance is forward-looking.** What an agency's state
   *means* depends on how it will affect other agencies; meaning is
   not present in the state alone.
4. **Expression is a state-change.** Producing an expression
   requires partially anticipating what other agencies will do; by
   the time the expression exists, the state has already moved.
5. **Expressing and thinking are not separable.** There is no clean
   line between *thinking a thought* and *putting it into words*;
   the second is part of the first.
6. **Listening relies on the same competence.** The listener
   resolves ambiguity by leaning on context. We tolerate the
   ambiguity of words because we are already competent at coping
   with the ambiguity of thoughts.

---

## What the implementation already absorbs

### A distributed mental state, not a single content (idea 2)

The blackboard in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and the activation snapshot in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
treat a cycle's mental state as a *distribution* of weights across
agencies, signals, and slots — not as a single piece of content.
There is no "current thought" variable. This honours idea 2 by
construction.

### A single narrator is acknowledged as a bottleneck (idea 2)

`agency.integration.conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is the *sole* producer of user-visible text. The plan names this as
a bottleneck rather than a window onto everything that happened —
which is exactly Minsky's point that the language-agency has access
only to a small slice of the distributed state.

### Expression as a separate phase (idea 5, partial)

The pipeline separates `settle` from `act` and from the final
presenter step
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
What is *decided* and what is *said* are produced by different
steps. This is closer to Minsky's "expression is its own activity"
than a system that simply prints intermediate state would be.

---

## What the implementation does not yet take into account

### A — Thoughts are treated as crystallisable

The settlement record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
is built as a *consistent, expressible artefact*: a list of signals,
objections, a chosen action, and a final response. The plan assumes
that whatever happened in the cycle can be reduced to a record. §20.1
warns that the reduction itself moves the state; the plan has no
field for "what was lost when this was made expressible," no
`expression_residue` slot.

### B — No model of significance as forward-looking

Idea 3 says an agency's state means what it *will cause* other
agencies to do. The plan records weights and slot fills at the
moment of settlement; it does not record *projected downstream
effect*. K-lines store `restore_when` for the future
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
but no agency declares "my signal is meant to propagate into these
others." Significance, as Minsky frames it, is not a first-class
shape.

### C — The presenter does not declare what it discarded

`agency.integration.conscious-presenter` produces a final response
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
but is not required to declare which signals it *chose not to
express*. The introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
records `unknowns` and `blind_spots`, but not "things that were
known internally and dropped on the way to language."

### D — Listener-side ambiguity is unmodelled

Idea 6 — the listener uses the same competence — applies to the
*intake* side. The `issue-kind-detector` and `ambiguity-detector`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
classify and flag, but they do not *negotiate* readings of the
user's words against active context. They produce one labelling
pass; if it is wrong, downstream work is wrong.

### E — Cycles do not record their own drift

Idea 4 — by the time you express it, the state has moved — has no
mechanism. The plan treats the per-stimulus cycle as a single state.
There is no notion of *early-cycle state* vs *late-cycle state* of
the same stimulus, and no record of how far the cycle drifted
between perception and presentation.

---

## Summary table

| # | Idea from §20.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Thoughts are themselves ambiguous | Partial | Distributed state honoured; reduction to settlement is treated as lossless (gap A). |
| 2 | A mental state is a distribution | Yes | Blackboard, activation snapshot, conscious-presenter bottleneck. |
| 3 | Significance is forward-looking | No | No `projected_effect` field on signals (gap B). |
| 4 | Expression is a state-change | No | No early-vs-late state of a cycle (gap E). |
| 5 | Expressing and thinking are not separable | Partial | `settle` and presenter are distinct phases; not modelled as one continuous activity. |
| 6 | Listener relies on the same competence | Partial | Intake classifies; does not negotiate (gap D). |
| — | Presenter discards in silence | No | No `not_expressed` field (gap C). |

---

## Implication for the plan (no changes proposed here)

§20.1 sits at the seam between the *internal* society and its
*external* surface. The plan is strong on the internal side: the
distributed state is real, the presenter bottleneck is named, and
expression is its own pipeline phase. It is weaker on the seam
itself — what is lost when distribution is reduced to language, and
what shifts in the process.

Closing gaps B–E would touch the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the conscious-presenter manifest in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and therefore falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
