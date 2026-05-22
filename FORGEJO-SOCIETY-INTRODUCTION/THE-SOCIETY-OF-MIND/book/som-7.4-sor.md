# Section 7.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-7.4.md](som-7.4.md) — *Problem solving*
(Minsky, §7.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§7.4 names three escapes from brute generate-and-test: the *progress
principle* (hill-climbing toward a recognisable improvement), the
*goal/subgoal split* (decomposition into smaller solvable
sub-problems), and *using knowledge* (avoiding search by remembering
how to solve). The section also restates the §7.2 paradox: knowledge-
based machines tend to handle "hard" specialist problems before they
handle "easy" everyday ones.

---

## The ideas Section 7.4 actually carries

1. **The progress principle.** Exhaustive search shrinks if there is
   a way to detect when progress has been made; one can then ascend
   a gradient toward a solution.
2. **Hill-climbing has a known failure mode.** Without an overview,
   the climber may get stuck on a minor peak; there is *no foolproof
   way* to avoid this.
3. **Goals and subgoals.** The strongest method for hard problems
   is decomposition: split into simpler sub-problems, recursively if
   needed.
4. **Using knowledge.** The most efficient way to solve is already
   to know how — search is then avoided entirely.
5. **Knowledge has three parts.** Acquisition, representation, and
   exploitation must each be solved; partial answers are not
   sufficient.
6. **Selective memory.** Memories should represent the
   *relationships that help reach goals*, not vast amounts of small
   detail.
7. **Expert systems are the offspring of (4)–(6),** and they
   reproduce the §7.2 paradox: easier specialism, harder everyday.

---

## What the implementation already absorbs

### Hill-climbing inside the deliberate loop

The deliberate cycle in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
("The deliberate step (agency loop)") recomputes activation after
each cycle and exits when "the frame is satisfied or a blocking
objection arrives." Frame slots act as the *progress recogniser*:
filled-slot count over required-slot count is a gradient the loop
implicitly climbs. The plan never calls this hill-climbing, but the
shape is identical.

### Decomposition through frames and assembly bees

The goal/subgoal split appears in two layers. Frames carry *slots*
that decompose the stimulus into smaller filled questions
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
"Frames"). Assembly bees (`agency.assembly.summary-tier-1`,
`summary-tier-2` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
compose partial results into the brief that settlement consumes.
Together they implement idea 3 at two granularities: per-stimulus
(frame slots) and per-family (assembly tiers).

### Using knowledge: K-lines and memory

K-lines
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
"K-lines") are the operational form of "already knowing how": when
`restore_when` matches the current cue, the prior winning activation
is reused and the prior `useful_context.files_read` is preloaded.
Semantic memory (`memory/semantic/decisions.log`,
`preferences.log`, `project-laws.log` in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
covers durable knowledge; procedural memory (`memory/procedural/`)
covers learned how-tos. The three knowledge pillars Minsky names —
acquire, represent, exploit — each have a place:

- **Acquire:** the `remember` phase
  ([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
- **Represent:** schemas under `.forgejo-society/schemas/`
  ([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
- **Exploit:** the `activate` phase via K-line reactivation
  ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
  "When a K-line reactivates").

### Selective memory through representation discipline

Idea 6 (relationships, not raw detail) maps onto the *representation
discipline* protocol referenced by
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
("Two parallel write paths") and
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
("Relational memory"). Only settled material reaches `memory/`; raw
event traces stay in `state/`; durable records carry typed `linked:`
fields that *are* the relationships. This is a precise structural
realisation of Minsky's selectivity.

### The §7.2 paradox is acknowledged

The plan ships a deliberately *expert-shaped* catalogue (software-
engineering specialism) and explicitly defers everyday-breadth
behaviour. The catalogue choice in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is the same trade-off Minsky describes: specialist competence is
easier to ship.

---

## What the implementation does not yet take into account

### A — No explicit progress score

Idea 1 calls for a *measurable* sense of progress. The deliberate
loop exits on satisfaction, but no field in the handoff or settlement
schemas
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
records "this cycle moved the frame from N/M slots filled to (N+k)/M
slots filled." Progress is binary (satisfied / not satisfied), not
graded. A society stuck on a local peak therefore looks identical to
a society that has not yet started.

### B — Local-peak detection is absent

Idea 2 warns that hill-climbing gets stuck. The plan has `max_cycles`
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
"The deliberate step") and budget caps, which *bound* the climb, but
no critic specifically named to recognise that *no progress is being
made*. `critic.staleness` deals with old evidence, not stalled
deliberation. A "no-progress" critic that would trip when slot fill
counts stop changing across cycles is missing.

### C — No backtracking primitive

Decomposition (idea 3) is one-way in the plan: slots are filled, not
unwound. If a filled slot turns out to be wrong, the cycle either
proceeds with bad input or the loop exits as blocked. There is no
named *retract* primitive that invalidates a slot and re-opens it.
The candidate-future branch mechanism handles retraction at the
*output* level (the branch is discarded), but not at the
*subgoal* level inside the deliberate cycle.

### D — Knowledge acquisition is partial

Idea 5 wants all three knowledge stages. Acquisition is the weakest
of the three in the plan: K-lines are *written* by the `archivist` on
successful settlement
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
"When a K-line is written"), but no agency or phase is responsible
for *acquiring knowledge from external sources* (documentation,
prior repositories, user instruction) and turning it into durable
memory. The `evolution/reinforcement-log.md` records what already
exists; nothing seeds new knowledge.

### E — Selectivity has no pruning loop

Idea 6 (selective memory) is honoured at write time by the
representation discipline, but the durable memory tree is *append-
only*
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
"Append-only enforcement"). Decay scores update; retirement is
proposed via `evolution/retirement-log.md`; but selectivity in the
sense of "the memory should *forget* the irrelevant" is not yet a
runtime operation, only a meta-admin proposal pending human
confirmation. Minsky's idea 6 is honoured at *insertion* but not yet
at *retention*.

### F — Expert systems' brittleness is not measured

§7.4's last paragraph is a warning: expert systems are brittle at the
edges of their representation. The plan has no critic or censor
specifically tuned to detect *out-of-domain* stimuli that the expert
catalogue is about to mishandle. The `novel` frame covers the case
where no frame matches strongly, but a stimulus that *barely* matches
the `code-change` frame and is mishandled gets no special signal.

---

## Summary table

| # | Idea from §7.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | The progress principle | Partial | Slot satisfaction is implicit progress; no graded progress field (gap A). |
| 2 | Hill-climbing gets stuck | Partial | `max_cycles` bounds the climb; no no-progress critic (gap B). |
| 3 | Goals and subgoals | Yes | Frame slots + assembly-bee tiers. |
| 4 | Using knowledge | Yes | K-lines and semantic memory. |
| 5 | Acquire, represent, exploit | Partial | Representation and exploitation strong; acquisition only from own outcomes (gap D). |
| 6 | Selective memory | Partial | Selective on insertion; not yet on retention (gap E). No backtracking primitive (gap C). |
| 7 | Expert-system paradox | Acknowledged | Plan ships expert-shaped; out-of-domain detection missing (gap F). |

---

## Implication for the plan (no changes proposed here)

§7.4 is the section where the plan's mechanics show their family
resemblance to AI of the 1970s in the best sense: frame slots are
subgoals, K-lines are the knowledge-base, settlement is the brief.
The gaps are the same gaps that family was known for — local peaks,
no backtracking, brittleness at the edge, acquisition that depends on
prior success — and the plan should be expected to *exhibit* them
until they are explicitly addressed.

The cleanest unforced opportunities are diagnostic: a graded progress
field (gap A), a no-progress critic (gap B), an out-of-domain critic
(gap F). The harder, structural opportunities are a retract primitive
inside the deliberate cycle (gap C) and a way to acquire knowledge
that the society did not itself produce (gap D).

These are recorded here as analysis, not as a change request. Closing
any of them would touch the deliberate-cycle specification in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md),
the critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/06-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/06-memory.md),
the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and possibly the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
