# Section 15.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-15.3.md](som-15.3.md) — *Memory* (Minsky,
§15.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§15.3 introduces memory as the substrate that lets a mind juggle
fragments of itself. It splits memory into long-term and short-term;
it denies that everything is remembered; it asserts selective,
unconscious classification by usefulness, danger, novelty, or
significance; and it ends by noting that the organising principle
of memory is itself hidden from consciousness.

---

## The ideas Section 15.3 actually carries

1. **Thought requires juggling fragments of mental state.** A
   single attention is not enough; the mind shifts between versions.
2. **Memory is the storage for those fragments.** Without it, the
   alternatives could not coexist.
3. **Two timescales are required at minimum.** Long-term memory
   (days to a lifetime) and short-term memory (seconds to minutes).
4. **Backtracking needs short-term memory.** Solving problems
   requires recording recent attempts in order not to repeat them.
5. **We do not remember everything.** Photographic memory is a
   myth; total recall is not the design.
6. **Selection is unconscious and criteria-driven.** Agencies
   classify states as useful, dangerous, unusual, or significant
   and promote only those.
7. **Unindexed storage is useless.** Memory must be organised so
   that retrieval is possible; flooding is as bad as having no memory.
8. **The organisation itself is inaccessible.** How memory is
   organised cannot be learned by introspection.

---

## What the implementation already absorbs

### Two timescales are structurally enforced (ideas 2, 3)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
makes the split explicit: `state/` is per-run scratch (short-term),
`workspace/` is short-term cognitive attention swept after
settlement, and `memory/` is durable, governed, append-only
(long-term). Promotion is one-way; lifetimes are different by
construction.

### Backtracking has somewhere to read from (idea 4)

`state/mind/issues/<n>/` keeps `signals.jsonl`,
`activation.jsonl`, `candidate-actions.jsonl`, and
`objections.jsonl`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Within a run, this trace lets later phases see what earlier phases
tried and rejected. Critics, in particular, read prior signals
when deciding which objections to raise
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).

### Not everything is promoted to long-term (idea 5)

The archivist
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
writes to `memory/` only on settlement, only against fixed write
rules
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Run traces stay in `state/` and are pruned by the meta-admin
sweep. The plan does not consolidate every signal.

### Selection is criteria-driven (idea 6)

K-line writes require non-trivial slot fill and non-empty useful
context
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
`memory/failure/` is written on outcomes of `failed` or `blocked`.
`memory/semantic/decisions.log` records *durable decisions* only.
Each subtree of `memory/` has a classifying rule.

### Organised storage with indices (idea 7)

Records carry relational metadata (`supersedes`, `derived_from`,
`contradicts`, `cites`, `reinforces`, `analogous_to`,
`learned_from`) per
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md).
K-lines have `restore_when` cues that the activate phase scores
against the current stimulus. Memory is not a flat heap.

### Internal organisation is partially opaque (idea 8)

The introspection protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md)
gives the society named slots for `unknowns` and `blind_spots`,
acknowledging that the society does not have a privileged view of
its own internals.

---

## What the implementation does not yet take into account

### A — Only two timescales are named; Minsky implies more

Idea 3 says *at least* two. The plan has exactly two (plus
per-run scratch). There is no medium-term tier between the swept
`workspace/` and the durable `memory/` — no "this week's habits"
shelf. Goals, styles, and habits "held for days or weeks" (§15.3)
fall through the gap: either they are durable (and
`memory/semantic/`-ish) or they vanish.

### B — Selection criteria are not labelled in records

Idea 6 names four criteria: useful, dangerous, unusual,
significant. The plan's records do not carry a field that says
"this was promoted because it was *dangerous*" or "because it was
*unusual*". The promotion *path* (which subtree it landed in) is
the only trace of why. The criterion itself is implicit in the
write rule, not declared in the record.

### C — "Unusual" is structurally absent

Of Minsky's four criteria, *unusual* (novelty) is the one with no
counterpart in the plan. There is no novelty-detector agency, no
schema field that says "this stimulus did not match any frame
strongly" (although a `novel.frame.yml` exists
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
and no rule that promotes records on novelty alone. The other
three criteria — usefulness (via K-line reuse), danger (via
`policies/danger-zones.yml` and the safety family), and
significance (via `semantic/decisions.log`) — have counterparts.

### D — "We do not remember everything" is not policy

Idea 5 is asserted by §15.3 as a *design choice*. The plan stores
the entire `state/` trace per run until pruning. Within a run,
nothing is forgotten. The policy
([`policies/memory-policy.yml`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
prunes after the issue closes, not during deliberation. The plan
inherits photographic in-run recall and only forgets later.

### E — Retrieval-flood is possible at activation

Idea 7 warns against flooding. `klines.ts` does load up to
`memory.max_k_lines_loaded` K-lines per activation
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
which caps quantity. But there is no further pressure on
*relevance density* — a stimulus that weakly matches many K-lines
can still load the cap, diluting useful context with marginal
matches.

### F — Indexing is on relational metadata, not on retrieval cues

The relational-memory protocol describes graph links between
records, which helps navigation *after* a record is found. K-line
`restore_when` is the only first-class retrieval cue. Memory
classes like `semantic/`, `procedural/`, and `episodic/` have no
analogue of `restore_when`. Finding the right `episodic/` entry
for a new stimulus is left to ad-hoc search, not to a declared cue.

### G — The hidden-organisation point is honoured but not labelled

Idea 8 — the organisation of memory is inaccessible to
consciousness — is structurally present (the presenter does not
read raw indices), but is not surfaced. A user who asks "how do you
remember things?" would get an answer composed from
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
itself rather than an honest "the indexing is not part of what I
can introspect at runtime."

---

## Summary table

| # | Idea from §15.3 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Thought juggles fragments | Yes | Multi-phase pipeline; multiple candidate actions. |
| 2 | Memory stores them | Yes | Three trees. |
| 3 | Long-term + short-term | Partial | Two tiers exist; medium-term tier absent (gap A). |
| 4 | Backtracking needs short-term | Yes | Per-run JSONL trace. |
| 5 | Do not remember everything | Partial | Long-term selection yes; in-run forgetting no (gap D). |
| 6 | Criteria-driven selection | Partial | Criteria implicit in write path; not labelled (gap B); novelty absent (gap C). |
| 7 | Unindexed storage is useless | Partial | Relational links + K-line cues; flood guard weak (gap E); other classes uncued (gap F). |
| 8 | Organisation is hidden from consciousness | Partial | Structurally yes; not surfaced honestly (gap G). |

---

## Implication for the plan (no changes proposed here)

§15.3 is the chapter's foundation for *memory as substrate*. The
plan absorbs the substrate (three trees), the criteria-driven
selection (write rules), the indexing (relational metadata,
K-line cues), and the opacity of internal organisation. The
gaps are about *grain* and *labelling*: a missing medium-term
tier (gap A), unlabelled selection criteria (gap B), absent
novelty as a promotion ground (gap C), in-run forgetting (gap D),
weak flood guards (gap E), and retrieval cues only for K-lines
(gap F). The most consequential single opportunity is gap C —
novelty — because it is the criterion the plan most cleanly lacks
and the one Minsky most depends on for learning. Closing any of
these would touch
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(memory tiers and write rules),
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a novelty-detector agency), and
[`THE-SOCIETY-OF-REPO/06-memory/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/06-memory/).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
