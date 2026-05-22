# Section 28.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-28.3.md](som-28.3.md) — *Quantity and quality*
(Minsky, §28.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§28.3 is the costed twin of §28.2. Currencies enable choice — but every
turn to quantity terminates thinking. Numbers conceal the structure
that gave rise to them; *thirteen* never tells you it came from *five
plus eight*. A theory of mind, and a runtime modelled on one, must
therefore be cautious about which decisions it lets a scalar finish.

---

## The ideas Section 28.3 actually carries

Pulled from Minsky's text:

1. **Higher-level operations rely less on measurement.** Quantitative
   schemes are routine at low levels (evidence summation, link
   strengths) and *diminish* as the level rises.
2. **Measurement terminates thinking.** Once a magnitude is computed,
   the comparison is done; the reasons that produced it stop being
   examined.
3. **Numbers perfectly conceal their origins.** Addition is
   irreversible at the result; you cannot recover the operands.
4. **Sometimes there is no choice but to choose.** When the alternatives
   are mutually exclusive and time is short, falling back on a
   currency is honest.
5. **Any limited substance can become a currency.** Properties of a
   currency are *conventional*, not inherent.
6. **Do not confuse the currency with its function.** The quality of
   "sweetness" is not in sugar; it is in the agency that detects
   sugar and treats the signal as a sign of success.

---

## What the implementation already absorbs

### Measurement diminishes with level (idea 1)

The runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
uses scalars heavily in early phases (*activate* uses activation
strength; the candidate-action stream carries confidence) and
qualitative records in later phases. The *settlement* output is a
structured YAML in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md):
chosen action, reasons, dissents, revert path, reality revision. The
visible output produced by `agency.integration.conscious-presenter` is
prose. The plan's higher levels are not numeric.

### Numbers do not finish the argument (idea 2, idea 3)

Critics produce *objections* with reasons in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md);
a sustained objection cannot be overridden by a higher confidence
number alone. Censors in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
*mechanically alter the tool surface* — they do not vote with a
weight. The approval-gate requires *human* confirmation, not a score
above a threshold. At each of these places the plan refuses to let a
single magnitude end the deliberation.

### Sometimes there is no choice but to choose (idea 4)

The *settlement* layer compresses incompatible candidates exactly when
forced. The plan does not pretend the compression is free; it records
the dissents alongside the winning option (per
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
preserving the structure that the scalar would otherwise conceal.

### The currency is not the function (idea 6)

The reinforcement entries in `evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
record *what happened* — sustained objections, accepted candidates,
merged branches — and only secondarily compute scalars. The numbers
sit beside the events, not above them. This is the §28.3 discipline
in operation, even if not by that name.

---

## What the implementation does not yet take into account

### A — No explicit "do-not-finish-with-a-scalar" rule

§28.3's core warning — that letting a number settle a question
terminates thinking — has no policy statement in the plan.
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
covers kill switches, danger zones, censors, suppressors, and
candidate-future branches, but it does not say: *no settlement may be
decided by confidence alone; structured reasons are required*. In
practice the plan probably behaves this way, because settlements have
required slots; the rule is not stated.

### B — Confidence is unbounded by structure

The candidate-action and handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carry confidence numbers without specifying what those numbers *mean*
or how comparable they are across agencies. A 0.8 from one perception
agency and a 0.8 from a different one may not denote the same thing.
§28.3 would predict — and warn — that combining them as if they did
will, eventually, terminate a thought that should not have ended.

### C — Decay and reuse risk reification

`decay_score` and `reuse_count` on durable records
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
are well-defined as bookkeeping, but their use in the cron pass that
proposes retirements
(`evolution/retirement-log.md`) is a place where a structure (a
K-line, a frame) can be quietly removed because a scalar fell below
a floor. The retirement is proposed, not executed automatically, but
the *evidence* the cron presents is a single number. A future critic
that demanded a *structural* reason alongside the number would close
this. None is proposed in the plan today.

### D — No analogue of "thinking too much"

§28.3's image of quantitative judgement helping by *keeping us from
thinking too much* has no positive form in the plan. The plan has
budgets (token caps, runner-seconds caps) that *limit* deliberation
externally; it does not record *why* deliberation should stop — that
is, what makes a decision *ripe*. A ripeness signal beyond "budget
exhausted" or "objections sustained" is absent.

### E — Cross-level interaction is not documented

§28.3's claim that measurement is appropriate at low levels and
unsuitable at high levels invites an explicit level decomposition. The
plan has many implicit levels (perception, deliberation, settlement,
integration, presentation), but does not pair them with a *policy on
quantity*. A short table in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
saying "at this level, scalars terminate; at this level, only
structured records do" would make the §28.3 discipline auditable. It
is not present.

---

## Summary table

| # | Idea from §28.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Quantitative schemes diminish at higher levels | Yes | Activate uses scalars; settlement and presentation are structured/prose. |
| 2 | Measurement terminates thinking | Partial | Critics, censors, approval-gate refuse scalar finishes; not stated as a rule (gap A). |
| 3 | Numbers conceal their origins | Partial | Settlements record dissents; confidence comparability is unspecified (gap B). |
| 4 | Sometimes there is no choice but to choose | Yes | Settlement layer compresses when forced; dissents preserved. |
| 5 | Any limited substance can become a currency | Yes (implicitly) | Budgets and scalars exist; §28.2 already documented the absence of a unifying frame. |
| 6 | Do not confuse currency with function | Partial | Reinforcement log records events first, but `decay_score` retirement risks reification (gap C). |
| — | Ripeness / stopping criterion | No | Budget exhaustion is the only mechanism (gap D). |
| — | Level-by-level quantity policy | No | Levels exist informally; no documented rule (gap E). |

---

## Implication for the plan (no changes proposed here)

§28.3 is a section the plan *honours* in practice — sustained
objections, structured settlements, mechanical censorship — while
*neglecting* in vocabulary. The two unforced opportunities are gap A
(stating in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
that no settlement is decided by a scalar alone) and gap E (adding,
in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
a small table that documents which phases may finish with a number
and which may not). Gap B (confidence comparability) is a more serious
move that would touch the signal schemas and is properly a later
question.

This is recorded here as analysis, not as a change request. Any move
to close gap A or gap E would touch safety and pipeline documents;
gap B would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md);
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
