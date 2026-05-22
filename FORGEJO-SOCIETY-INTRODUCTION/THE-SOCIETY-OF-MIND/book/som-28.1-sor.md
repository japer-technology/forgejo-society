# Section 28.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-28.1.md](som-28.1.md) — *The myth of mental
energy* (Minsky, §28.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§28.1 opens Chapter 28 by refusing one of the oldest folk-psychology
moves: the idea that the mind runs on a special *mental energy* that
can accumulate, deplete, and overflow. Minsky's argument is structural:
an agency is "but a name for a certain assembly of agents," and so it
cannot need anything its agents do not need. Ordinary physical
causality, applied to the parts, is sufficient. The illusion of mental
energy is real and worth explaining, but it is not a substance.

---

## The ideas Section 28.1 actually carries

Pulled from Minsky's text:

1. **Mind has no extra fuel.** There is no second form of energy
   peculiar to thought. If the parts have physical energy enough to
   work, the assembly has whatever it needs.
2. **An agency is not more than its agents.** "Builder" is a name for
   a configuration; it cannot require what its agents do not.
3. **Causality is enough.** Goal-directed behaviour does not need a
   special motive substance — only mechanism.
4. **Words like *energy* and *force* are pre-scientific in everyday
   psychology.** They preserve centuries-old connotations of vitality.
5. **The illusion is real and must be explained.** "Feeling run down"
   is not nothing; later sections (§§28.2–28.4) will argue it arises
   as a *regulatory currency*, not as a depletion of a substance.
6. **Causes must be sought in transactions, not reservoirs.** The
   research move is to look at how agencies *negotiate*, not at how
   much mental fluid is left in the tank.

---

## What the implementation already absorbs

### Mind from mindless stuff (idea 1, idea 2)

The plan inherits the discipline from §1.1 and applies it here without
strain. Each agency in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is a Markdown manifest invoked as a step in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md);
nothing in the runtime claims an inner reserve of motivation. The
voice rules in [AGENTS.md](../../../AGENTS.md) actively forbid the
"mental fuel" register on repository surfaces ("AI brain", "autonomous
developer", anthropomorphic flourishes).

### Causality is enough (idea 3)

[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
describes the cognitive loop as a sequence of named, mechanical steps:
*perceive → activate → deliberate → criticize → censor → settle → act →
remember → report*. Goal-direction is produced by the *frames* in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and the *settlement* layer, not by any latent drive variable. This is
exactly the move Minsky asks for.

### Transactions, not reservoirs (idea 6)

The whole structure of
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
is transactional: signals, handoffs, objections, and settlements are
discrete records committed to `state/...signals.jsonl`. There is no
shared global "energy" reservoir in the state model in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
there is only the trace of what each agency emitted and what was acted
upon.

### Budgets exist, and they are physical (idea 1, again)

The `budget` field in each agency manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
caps the *ordinary* resources an agency consumes — tokens, runner
seconds, tool calls. These are physical accounting units, in Minsky's
sense; they are not mental energy. The plan honours the §28.1
distinction by tracking only what is actually scarce in the runner.

---

## What the implementation does not yet take into account

§28.1 is a *clearing* section: most of its work is removing a wrong
idea. The interesting gaps are the small footholds the wrong idea
still has in the runtime vocabulary.

### A — No statement that there is no mental-energy variable

§28.1 makes a specific refusal: no global vitality counter, no
"motivation level," no "fatigue index" governing agency behaviour.
The plan does not currently *say* this. A reader of
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
or
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
would have to *infer* the absence. A future revision could record, in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or under "what is explicitly out of scope," that there is no global
affect or drive variable, and that no agency's activation depends on
one.

### B — Some scalar fields are perilously close to fuels

Several runtime quantities, taken loosely, could be re-read as mental
energy:

- `decay_score` on durable records in
  [`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md);
- `reuse_count` and the reinforcement entries in
  `evolution/reinforcement-log.md`;
- the unnamed activation strength used in the *activate* phase of
  [`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md);
- the `budget` ceiling on each agency.

Each is operationally a *currency* (in the §28.2 sense), not a fuel.
The plan would be sharper if it labelled them that way explicitly,
with a one-line statement that none of them is a measure of vitality.
Today the labelling is implicit.

### C — Safety signals are explicitly *not* emotions, but this is implicit too

[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
describes censors and suppressors with names that sound affective
("blast-radius-fear" in surrounding material, "high-entropy-string").
§28.1 demands that the runtime not treat these as feelings, even when
they sound like ones. The §1.1 analysis already flagged this under
gap H (Sensibility). §28.1 strengthens the case: a short note in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
that safety scalars are *named appraisals* and not *energies* would
close the rhetorical gap.

### D — The illusion is not yet explained at the prose surface

§28.1's last paragraph promises that the *next few sections* will
explain why the energy illusion arises. §§28.2–28.4 deliver the
explanation in terms of currency and engineering. The plan can in
principle absorb that explanation (see the §28.2 and §28.3 analyses
beside this one), but it does not yet *announce* that the absence of
a fuel variable is a deliberate Minsky-style refusal. This is a
documentation gap, not a structural one.

---

## Summary table

| # | Idea from §28.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | No second form of mental energy | Yes (by construction) | No vitality variable exists; not stated (gap A). |
| 2 | An agency is not more than its agents | Yes | Manifest + workflow steps; no agency-level reservoir. |
| 3 | Causality is enough | Yes | The runtime pipeline is mechanical end-to-end. |
| 4 | *Energy* and *force* are pre-scientific words | Partial | Voice rules ban anthropomorphic prose; do not yet name scalars as currencies (gap B). |
| 5 | The illusion is real and must be explained | Partial | Plan absorbs the refusal but does not announce it (gap D). |
| 6 | Look at transactions, not reservoirs | Yes | Signals, handoffs, objections, settlements are the transaction record. |

---

## Implication for the plan (no changes proposed here)

§28.1 is a section the plan *already obeys* — there is no mental-energy
variable to remove — but it obeys it silently. The honest summary is
that the implementation passes §28.1 on structure and fails §28.1
slightly on documentation: a reader cannot tell, by inspection, that
the absence of a vitality counter is *deliberate* rather than
*forgotten*. The single most useful change would be a one-paragraph
statement, somewhere in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
recording the refusal in §28.1's own terms and labelling the existing
scalar fields (`decay_score`, `reuse_count`, activation strength,
`budget`) as accounting currencies rather than fuels.

This is recorded here as analysis, not as a change request. Any such
edit would touch overview prose and safety-document framing, and so
falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
