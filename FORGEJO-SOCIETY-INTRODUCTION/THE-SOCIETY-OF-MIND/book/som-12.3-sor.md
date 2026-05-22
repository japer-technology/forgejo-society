# Section 12.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.3.md](som-12.3.md) — *Uniframes*
(Minsky, §12.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.3 defines *uniframe* — "a description constructed to apply to
several different things at once" — and then dissects the
sub-mechanisms by which one is built: *enforcement* (insist on this
relation), *prevention* (reject that configuration), and *tolerance*
(do not distinguish here). It closes with the warning that *most
differences are redundant, most of the rest are accidents*, and that
there is therefore no single magic trick to learning: a society
needs *many* ways to learn.

---

## The ideas Section 12.3 actually carries

1. **A uniframe is a single description that fits many cases.**
2. **Uniframes are built in stages.** First dissect the scene; then
   *enforce* important relations; then *prevent* unwanted ones; then
   *tolerate* the irrelevant.
3. **Enforcement, Prevention, Tolerance are distinct operations.**
   Each adds, blocks, or removes a constraint.
4. **Selectivity is mandatory.** Recording every fact would generate
   a universe of useless, accidental, and misleading facts.
5. **Most differences are redundant; most of the rest are
   accidents.** Compression is not a luxury; it is the work.
6. **Relevance depends on purpose.** "Which facts are useful?" has
   no purpose-free answer.
7. **No single learning trick.** The mind needs a *society* of
   ways to learn.

---

## What the implementation already absorbs

### A uniframe-shaped object exists (idea 1)

Frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
*are* uniframes in operational form. A frame describes a kind of
situation by listing the signals it expects, the slots that must be
filled, the default critics and censors, and the failure conditions
that block settlement. One frame fits many stimuli.

### Stages of construction (idea 2)

The frame schema includes `matches:` (the scene dissection),
`slots:` (what must be present), and `failure_conditions:` (what
must not). The pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
performs perception, then frame selection, then deliberation in
order — the staged construction of an interpretation.

### Prevention and tolerance (idea 3)

*Prevention* maps cleanly to `failure_conditions:` in frames and to
censors in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
("if X, refuse"). *Tolerance* maps to the absence of a check: paths,
labels, or symbols not listed are not weighted.

### Selectivity by polyneme weights (idea 4)

Polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
explicitly *excite* and *inhibit* by weight. Nothing in the runtime
treats every observable as equally relevant; the path-, label-, and
phrase-polynemes are exactly the selectivity layer Minsky calls for.

### Many learning paths, not one (idea 7)

The plan distinguishes K-lines, frames, analogies, concepts,
procedural memory, and reinforcement
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Multiple meta-admin agencies
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
shape the society over time. There is no single learning agency.

---

## What the implementation does not yet take into account

### A — Enforcement is not named

§12.3's *enforcement* — "insist this relation must hold" — does not
have a clean home. Frame `slots:` declare what must be filled, but
they do not declare *relations between* slots. The plan has no field
like:

```yaml
enforced_relations:
  - "<slot-a> supports <slot-b>"
```

This is one of three operations Minsky treats as primitive; the plan
has the other two and is missing this one.

### B — No frame-construction loop

The plan can run, evaluate, and revise frames via
`agency.meta-admin.differentiation-broker`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
but the differentiator only *splits*. There is no broker that
*constructs* a new frame by inspecting a cluster of similar
stimuli and proposing the enforce / prevent / tolerate set. Uniframe
*construction* (idea 2) is not represented; only uniframe *editing*
is.

### C — "Most differences are redundant" has no runtime form

Idea 5 is a deep claim about compression. The plan does not compute
mutual information between observables, does not detect redundant
signals, and does not have a critic that flags an objection like
"this evidence is already implied by an earlier one". The
*compression discipline* §12.3 demands is absent.

### D — Purpose-relativity is implicit

Idea 6 says relevance depends on purpose. The plan has *goals* only
through frames and settlements; an agency has no explicit `purpose:`
field. Polyneme weights are static. A reviewer cannot ask "which
features are relevant *for this stimulus*?" and read the answer from
a manifest.

### E — Scene dissection is not its own phase

§12.3 makes "dissect the scene into blocks with specific properties
and relationships" the first step. The plan's `perceive` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
emits percepts but does not produce *typed relational structure* —
a graph of objects and relations — that later phases can inspect.
Relational memory exists for *durable* records
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
but not for the immediate scene of a stimulus.

---

## Summary table

| # | Idea from §12.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | A uniframe (description fitting many cases) | Yes | Frames in `frames/*.frame.yml`. |
| 2 | Uniframes built in stages | Partial | Pipeline is staged; *frame construction* is not (gap B). |
| 3 | Enforcement / Prevention / Tolerance | Partial | Prevention (failure_conditions / censors) and tolerance present; enforcement not named (gap A). |
| 4 | Selectivity is mandatory | Yes | Polyneme weights, signal energy, activation thresholds. |
| 5 | Most differences are redundant | No | No compression critic, no redundancy detector (gap C). |
| 6 | Relevance depends on purpose | Partial | Purpose lives in frames; not per-agency (gap D). |
| 7 | No single learning trick | Yes | Many learning substrates and meta-admin brokers. |
| — | Scene dissection as typed relational structure | No | Percepts are flat; relational graph only for durable records (gap E). |

---

## Implication for the plan (no changes proposed here)

§12.3 is the section that names the *micro-operations* of concept
formation. The plan already has *frames*, the macro-shape of a
uniframe, and the *prevention* and *tolerance* halves of its
construction toolkit. What is missing is *enforcement* as a typed
operation on slot relations, a *frame-construction* broker to
complement the splitter, and any account of *compression*: nothing
in the plan today notices that two pieces of evidence are
near-duplicates.

Closing these gaps would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(an `enforced_relations:` field), the meta-admin family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a frame-construction broker and a redundancy critic), and the
percept layer in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
(typed relational percepts). These are governance-shape changes,
not edits to runnable code, and fall under the stop-and-ask rules
in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md). This file records the analysis; it
does not request the change.
