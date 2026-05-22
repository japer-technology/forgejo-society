# Section 7.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-7.3.md](som-7.3.md) — *The puzzle principle*
(Minsky, §7.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§7.3 introduces *generate-and-test* and names it the *puzzle
principle*: any problem whose solution we can recognise can in
principle be solved by exhaustively generating candidates and testing
each. Minsky immediately argues that the principle is rarely practical
— the combinatorial cost is ruinous — and that the disconnect between
generator and test is what defeats it.

---

## The ideas Section 7.3 actually carries

1. **The puzzle principle.** A computer can solve any problem by
   trial and error if there is a recogniser for the solved state.
2. **Generate need not make sense.** The generator may produce
   arbitrary, meaningless candidates; correctness is the test's job.
3. **Test is the load-bearing half.** Without a recogniser, the
   generator's output is unevaluated noise.
4. **Generate-and-test is in-principle universal but practically
   useless** without further structure: a billion ways to nail four
   boards together is already past usefulness.
5. **The unsolved problem is the connection.** What is missing in
   the naive scheme is feedback from the test to the generator — a
   notion of *progress toward a goal*.
6. **Replace mystery with efficiency.** The contribution of the
   puzzle principle is philosophical: it converts the question
   "how can a machine be creative?" into the question "how can a
   machine search efficiently?"

---

## What the implementation already absorbs

### The generator: candidate actions and imagination branches

The plan has an explicit generator. Agents emit `candidate_actions`
in their handoff
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
and the `act` step opens
`society/<stimulus_id>/candidate-<n>` branches as candidate futures
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
"The act step", [`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Branches as candidate futures"). The branch namespace is
`possibility-2.md`'s *branches as imagination*: many imagined diffs
can coexist before any becomes reality.

### The test: critics, censors, suppressors, validation

The recogniser side is rich. Critics in `criticize`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
attack candidates on evidence, scope, cost, privacy, risk,
overconfidence, source quality, and staleness. Censors in `censor`
mechanically alter the tool surface
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
"Tool surface, mechanically"). Suppressors fire on candidate outputs
(same file, "Suppressors"). Validation runs on the candidate branch
before merge
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
"The act step", step 3). This is Minsky's *test* as a layered
discipline rather than a single check.

### The connection: progress signals via frames

Idea 5 calls for feedback from the test back to the generator. The
plan supplies this through *frames*: the `code-change` frame requires
slots like `user_goal`, `relevant_files`, `proposed_patch`, `tests`,
`risks`, `final_user_response`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
"Frames"). Missing slots are *failure conditions* that block
settlement, which in turn directs the next deliberate cycle. The
frame is the difference-engine that converts "untested noise" into
"progress toward a known slot set." (Minsky's own answer arrives in
§7.4 and §7.8; the plan uses both already.)

### Efficiency rather than mystery (idea 6)

The plan never claims creativity. Budgets, costs, and risk estimates
are first-class on every candidate
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
`tool_usage`, `candidate_actions[].estimated_risk`). Settlement
records the *method* used by each proposal
(`retrieval|rule|local-model|hybrid`), which is precisely Minsky's
efficiency reformulation.

---

## What the implementation does not yet take into account

### A — The generator is not pluggable as such

Minsky's *generator* is an abstract role. In the plan, generation is
diffuse: any agency may emit `candidate_actions`, and there is no
single component called the generator. This is consistent with the
"society over isolated mechanism" thesis, but it means there is no
place to *swap* a generation strategy (random, template, search,
sampler) for a given frame. Generation policy is implicit in each
agency's prompt and tools rather than expressed as a named strategy.

### B — No record of *rejected* candidates as a corpus

Idea 2 says generators may produce nonsense. The plan keeps rejected
hypotheses
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
`memory/failure/rejected-candidates/`) and records them per
settlement, but does not aggregate them into a *generator corpus* that
could be mined for patterns. The puzzle principle's diagnostic value
— "what kinds of candidates does this society repeatedly produce that
the tests reject?" — has nowhere to live.

### C — Generate-and-test is single-shot per cycle

The deliberate loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
runs agencies in cycles bounded by `max_cycles`, and a cycle ends
when the frame is satisfied or a blocking objection arrives. There is
no concept of *generating multiple candidates in parallel and ranking
them*; candidates accumulate in `candidate-actions.jsonl` but the
settlement layer effectively chooses among them rather than ranking
them against each other in a documented way. Minsky's puzzle
principle, taken straightforwardly, would expect a *population* of
candidates, not a stream.

### D — No combinatorial-cost ceiling

Idea 4 warns that brute generation is ruinous. The plan caps
*per-agent* cost (`budget.max_tool_calls`, `max_wall_clock_s` in the
manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and *per-run* cycles (`max_cycles` in `config/society.yml`), but does
not cap *total number of candidate actions per stimulus*. A society
that learned to over-generate has no fence.

### E — Test/generator decoupling is structural rather than measured

Idea 3 (test is load-bearing) and idea 5 (the connection is missing)
together imply a useful metric: *fraction of candidates surviving
each gate*. The plan emits the necessary records — `candidate_actions`,
`objections`, censor blocks, suppressor activations — but does not
synthesise a generator/test productivity score in
`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Credit assignment"). Whether the generator is improving relative to
the test is not visible at a glance.

---

## Summary table

| # | Idea from §7.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | The puzzle principle | Yes | Candidate-future branches + critic/censor/suppressor recognisers. |
| 2 | Generate need not make sense | Partial | Generator is diffuse, not pluggable (gap A); rejected candidates are kept but not mined (gap B). |
| 3 | Test is load-bearing | Yes | Layered tests: critics, censors, suppressors, branch validation. |
| 4 | Combinatorial cost is ruinous | Partial | Per-agent and per-run caps exist; no per-stimulus candidate cap (gap D). |
| 5 | The missing link is progress feedback | Yes | Frames carry required slots and failure conditions. |
| 6 | Replace mystery with efficiency | Yes | Budgets, method tags, and risk estimates on every proposal. |

---

## Implication for the plan (no changes proposed here)

§7.3 is the load-bearing principle behind everything the plan calls
*candidate-future branch*. The implementation already runs generate-
and-test under another name and protects it from naïve
combinatorics with budgets, frames, and a layered recogniser. The
remaining unforced opportunities are diagnostic, not architectural: a
named generator strategy per frame (gap A), an aggregated rejected-
candidate corpus (gap B), a population-style multi-candidate cycle
(gap C), a per-stimulus candidate ceiling (gap D), and a survival-
rate metric in the reinforcement log (gap E). None of these are
urgent; all would make the existing puzzle-principle behaviour
*legible*.

These are recorded here as analysis, not as a change request. Closing
any of them would touch the deliberate-cycle specification in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md),
the handoff and settlement schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and possibly the policy file in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
