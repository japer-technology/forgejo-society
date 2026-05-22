# Section 7.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-7.7.md](som-7.7.md) — *Local responsibility*
(Minsky, §7.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§7.7 is Minsky's most concrete treatment of credit assignment: the
parable of Alice the owner, Bill the manager, and Charles the
salesman. Charles closes an unfulfillable sale and pleases Bill but
disgraces Alice. The section sets up two opposing schemes — *local
reward* (each supervisor rewards its subordinate) and *global reward*
(only contributions to top-level success are rewarded) — and argues
that any real mind needs both, and a way to pick between them.

---

## The ideas Section 7.7 actually carries

1. **Local reward.** Each supervisor rewards each subordinate that
   accomplished the supervisor's local goal.
2. **Global reward.** Only agents whose work traces all the way up
   to a satisfied top-level goal receive credit.
3. **Local reward is mechanically cheap.** It depends only on the
   pair (supervisor, subordinate).
4. **Global reward is mechanically expensive.** It requires tracing
   an unbroken chain of accomplished subgoals back to the original
   purpose.
5. **Each scheme has its own virtues.** Local reward learns fast;
   global reward learns *responsibly*. Local is generous; global is
   parsimonious.
6. **A mind needs both, and a way to choose.** The choice between
   local and global credit is itself situational; other agencies
   must learn *which scheme* to use, depending on circumstance.
7. **Even global reward must subdivide.** It must distinguish not
   only *which* agents helped, but *which subproblems* they helped
   with — pushing a block helps build a tower in a *particular*
   way, not as a general practice.
8. **"I was only obeying orders" is unavailable under global.**
   The global scheme refuses the local-success excuse and so
   produces more responsible agents over time.

---

## What the implementation already absorbs

### A credit-assignment surface exists

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
("Credit assignment") writes per-attribution records, and
`evolution/reinforcement-log.md` accumulates them. The settlement
schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
includes `attributions` and `commitments`, which is the file-level
analogue of "who helped, who is responsible afterward".

### Per-stimulus, per-frame attribution (idea 7 in part)

Attribution is keyed to the *settlement* and the *cycle*, not to the
agency in the abstract
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
This avoids the most naive form of cancellation Minsky warns about
in §7.6, and is the structural precondition for any §7.7 scheme:
without per-context attributions, neither local nor global reward
could be applied later.

### Supervisor / subordinate relations exist as handoffs

Agencies produce signals and handoffs that other agencies consume
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The chain Alice→Bill→Charles is representable: a `handoff` from an
upstream agency to a downstream one is the "supervisor asks
subordinate" relation in file form. The trace exists.

### Top-level outcome is recorded

The settlement records the cycle's overall verdict, and the act
phase records whether the resulting action succeeded
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
This is the precondition for any *global* reward computation: the
"Alice verdict" is on disk.

---

## What the implementation does not yet take into account

### A — Only one assignment scheme is contemplated

The plan does not distinguish local from global credit. There is
one `evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
no `local-attributions.jsonl` or `global-attributions.jsonl`, and
no field on a settlement saying which scheme an attribution belongs
to. Minsky's central distinction is currently invisible.

### B — Supervisor-of relation is implicit, not declared

To run local reward (idea 1), one must know who Charles's
supervisor is. The plan has handoffs from one agency to another but
no manifest field declaring *which* upstream agency is the
authority over a downstream one's credit. `inhibits` exists in the
schema, but `supervises` does not
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
Local credit, if it were applied, would have to invent the relation
at compute time.

### C — Subgoal chain is not traced end-to-end

Idea 4's requirement — an unbroken chain of accomplished subgoals
back to the top-level goal — needs a chain. The plan has linked
signals, handoffs, and objections per cycle, but no explicit
`subgoal_of:` edge connecting each agency's output to the parent
purpose. A reviewer trying to ask "did Charles's order contribute
to Alice's top-level goal?" has no path of record to walk.

### D — No selection policy for local vs global

Idea 6 asks for a *learner of learning strategies*: an agency that
picks the right credit scheme for the situation. The plan has the
meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
but none of its current roles selects credit scheme; differentiation-
broker and retirement-broker act on the catalogue, not on the credit
policy. There is no `agency.meta.credit-scheme-chooser`.

### E — Subgoal-specific credit is absent

Idea 7's tower example — pushing a block helps tower-building in
*this* circumstance, but should not become a general practice —
requires credit that is scoped to a *subgoal*, not just to a
*context*. The plan's attribution is per-settlement and per-frame
but not per-subgoal-within-a-frame; the same complaint as §7.6 gap D
in a slightly different key. A K-line generalised from a single
push could overfire next time.

### F — The "blamelessness" defence has no slot

Idea 8 — refusing "I was only obeying orders" — implies that the
settlement should be able to *record* that an agency did exactly
what it was asked but the result was bad. The plan's `attributions`
list does not distinguish "contributed to a good outcome",
"contributed to a bad outcome", and "did what was asked, outcome
was bad". Charles's defence is unrepresentable.

### G — Local credit risks the cancellation problem on its own

A pure local scheme would update Charles's record favourably (he
sold the radios) and Bill's record unfavourably (he failed to
check inventory) in the same cycle. The plan, having no chain
representation (gap C), would have no way to *temper* a future
local update with the eventual global verdict. Minsky's central
caveat (a mind needs both, weighed against each other) is currently
unsatisfiable, even in principle.

---

## Summary table

| # | Idea from §7.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Local reward | No | No scheme distinction (gap A); no supervisor field (gap B). |
| 2 | Global reward | No | No subgoal chain to trace (gap C). |
| 3 | Local is mechanically cheap | n/a | Cannot apply (gap A). |
| 4 | Global is mechanically expensive | n/a | Cannot apply (gap C). |
| 5 | Each scheme has virtues | n/a | No scheme to weigh (gap A). |
| 6 | A mind needs both, with a chooser | No | No meta agency for credit-scheme selection (gap D). |
| 7 | Subgoal-specific credit | Partial | Attribution is per-settlement, not per-subgoal (gap E). |
| 8 | "I was only obeying orders" disallowed | No | No blamelessness slot (gap F). |

---

## Implication for the plan (no changes proposed here)

§7.7 is one of the most operationally specific sections in the book,
and the plan currently meets only its preconditions: an attribution
surface, per-cycle handoffs, and a recorded top-level outcome. It
does not yet meet any of its substantive claims. The reinforcement
loop is deferred (see §1.1 gap D, §7.5 gap A, §7.6 gap A), so this
is not an active failure; but when the loop is finally closed, all
seven §7.7 gaps will need to be addressed together. The largest
single gap is the absence of a *subgoal chain* (gap C); without it,
neither global reward nor the §7.6 cancellation defence can run.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(supervisor relations; meta-admin role; blamelessness slot),
the handoff and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(subgoal edges; per-subgoal attribution),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and the state and memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
