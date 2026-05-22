# Section 10.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-10.4.md](som-10.4.md) — *Papert's principle*
(Minsky, §10.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§10.4 is the chapter's load-bearing section. It introduces the
middle-level administrators (Appearance, History) that group lower-
level agents, and it states Papert's Principle: *some of the most
crucial steps in mental growth are based not simply on acquiring new
skills, but on acquiring new administrative ways to use what one
already knows.* The growing-up of an agency is, on this view, mostly
a re-organisation problem, not a knowledge-acquisition problem.

---

## The ideas Section 10.4 actually carries

1. **Administrative agents are a real kind.** Their job is not to
   reason about the world but to compose the reasoning of others.
2. **Non-compromise plus composition.** When low-level agents
   conflict, the answer is not to average them but to call in a
   higher-level administrator who selects.
3. **Papert's Principle (the load-bearing claim).** Growth is mostly
   re-organisation of existing skills, not addition of new ones.
4. **Grouping matters and is not arbitrary.** Tall and Thin belong
   together (so Confined can over-rule them when they conflict);
   Tall and Confined would be a bad group.
5. **Similarity drives grouping.** Agents are grouped by character —
   what kind of input they consume, what kind of judgment they make
   — not by syntactic accident.

---

## What the implementation already absorbs

### Administrative agencies exist as a family (idea 1)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
defines several families whose entire purpose is administration:
`agency.assembly.summary-tier-1`, `agency.assembly.summary-tier-2`,
`agency.integration.conscious-presenter`, and the `agency.meta-admin.*`
brokers (`differentiation-broker`, `retirement-broker`). These do
not perceive the world; they organise the work of those that do.
This is exactly the *kind* Minsky introduces in §10.4.

### Non-compromise and selection (idea 2)

The settlement protocol
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
does not average competing proposals; it selects, with reasons. The
criticize-censor-settle order in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is structurally what §10.4 calls "look for help from other agencies"
when lower-level reasoners conflict.

### A composition layer above the workers (idea 4 partially)

The two-tier assembly (`summary-tier-1` rolls up reasoners into
themes; `summary-tier-2` rolls themes into a coherent draft) gives
the plan a real intermediate layer. The single narrator
`agency.integration.conscious-presenter` sits above the assembly
tier, just as Appearance and History sit above Tall and Thin in
§10.4. The shape is right.

---

## What the implementation does not yet take into account

### A — Papert's Principle has no operational form

This is the chapter's central claim and it is the largest unmodelled
idea in chapter 10. The plan has rich mechanisms for *adding*
agencies (the first-ship catalogue,
`agency.meta-admin.differentiation-broker`) and for *retiring* them
(`agency.meta-admin.retirement-broker`), but it has no mechanism for
*re-organising the administrative layer above an unchanged set of
workers*. Growth, in the plan, looks like new files; Papert's
Principle says growth often looks like new *grouping* of the same
files.

### B — Administrative composition is authored, not learned

Idea 4 (grouping matters) has its mechanism in the plan — the
assembly tiers — but the grouping itself is fixed by the manifest
author. There is no signal of the form "Tall and Thin conflict
often; consider grouping them under a new middle-tier administrator."
The `evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
could carry such a signal but does not derive grouping suggestions
from it.

### C — Similarity is not a represented relation

Idea 5 says groupings are *not* arbitrary; they follow similarity of
character. The plan has no first-class similarity relation between
agencies. Each manifest declares its own `agency`, `kind`,
`activates_on`, `inhibits`, `outputs`, and `budget`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
but nothing computes "these two agencies are similar in character."
The relational memory protocol
([`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md))
links *records*, not *agencies*.

### D — No intermediate manager between assembly and the workers

The plan has *two* tiers (`summary-tier-1`, `summary-tier-2`). §10.4
implies *many* intermediate tiers, born as needed in response to
particular conflict patterns. There is no mechanism for spawning a
new middle-level administrator when, say, two perception agencies
chronically disagree. Tier depth is set at design time, not at run
time.

### E — Conflict patterns are not catalogued

For Papert's growth-as-reorganisation to be possible, the society
would need to know *which* low-level agencies most often disagree
and on *what* slots. The settlement record names the agencies that
contributed to each decision
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
so the data is in principle there; no aggregation reads it as a
catalogue of recurring conflicts.

---

## Summary table

| # | Idea from §10.4 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Administrative agents are a real kind | Yes | Assembly + integration + meta-admin families. |
| 2 | Non-compromise + composition | Yes | Settlement selects rather than averages. |
| 3 | Papert's Principle: growth = re-organisation | No | Change mechanisms add/retire files, not regroup them (gap A). |
| 4 | Grouping matters; the right group enables override | Partial | Composition layer exists; groupings authored, not derived (gap B). |
| 5 | Similarity drives grouping | No | No similarity relation over agencies (gap C). |
| — | Many intermediate tiers, growable | No | Tier depth fixed at design time (gap D). |
| — | Conflict patterns catalogued | No | Data present in settlements; no aggregation (gap E). |

---

## Implication for the plan (no changes proposed here)

§10.4 is, with §1.1, one of the highest-leverage sections of the
book against the implementation plan. The *kind* of agency Minsky
introduces — the middle-level administrator — already exists in the
plan as `agency.assembly.*` and `agency.integration.*`. What does
not yet exist is Papert's Principle itself: a way for the society
to grow by *re-arranging* the administrative layer over a stable
set of lower-level workers. Closing this would touch the manifest
schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and the evolution material in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
