# Section 10.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-10.7.md](som-10.7.md) — *The concept of
concept* (Minsky, §10.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§10.7 turns on the word *concept*. Minsky warns against
"thingifying" mental processes — converting dispositions, skills,
and arrangements into objects that the mind is said to *have*. The
section also names a constructive principle: always try to combine
*related* agents first, where related means "close in character or
in substrate," not "syntactically similar."

---

## The ideas Section 10.7 actually carries

1. **Thingification is a hazard.** Calling something a "concept" or
   "idea" disguises that it is a process or disposition.
2. **Vocabulary biases theory.** The poverty of words for processes
   pushes us to over-use object-words.
3. **Children accumulate methods, not concepts.** The question is
   not which concepts a child acquires but how agents like Tall,
   Thin, Short, Wide get grouped into subagencies.
4. **The combinatorial cost of bad grouping.** "Green-and-Tall-and-
   recently-touched" is a possible concept; the child has no time
   to test all such combinations.
5. **The grouping heuristic: combine related agents first.** Tall
   and Thin are close because they share substrate (spatial
   comparisons) and probably brain neighbourhood.

---

## What the implementation already absorbs

### The plan describes processes, not concepts (idea 1)

The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("every structure collapses to either a file under `.forgejo-society/`
or a step in the workflow") makes the unit *a file or a step* — that
is, a piece of disposition or a piece of process. No file in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
declares itself a "concept." The voice rules in
[AGENTS.md](../../../AGENTS.md) also forbid the surface-level
thingification Minsky warns against.

### The vocabulary is mechanism-flavoured (idea 2)

The canonical vocabulary in
[`THE-SOCIETY-OF-REPO/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/)
is deliberately process-leaning: *signal*, *handoff*, *settlement*,
*K-line*, *runner*, *workflow*. The plan inherits this. There is no
"Idea" file, no "Concept" file, no "Belief" file.

### Methods, not concepts, are first-class (idea 3)

An agency in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is defined by its `activates_on`, its prompt body, its `outputs`,
and its `inhibits`. These are *methods*, not concepts. The plan
honours Minsky's distinction structurally.

---

## What the implementation does not yet take into account

### A — Similarity over agencies is unrepresented

This is the same absence noted under §10.4 gap C, restated in
§10.7's terms: the grouping heuristic *requires* a notion of "two
agencies are related." The plan has no first-class similarity
relation between agencies. The relational-memory protocol
([`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md))
relates *records*, not *agencies*.

### B — Shared substrate is not encoded

Minsky's reason for combining related agents is that they share
substrate — neighbour neurons, common signals. The plan's substrate
is files and workflow steps. Two agencies that share `activates_on`
slots or share `outputs` types or share family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
*are* related in a defensible sense, but the plan does not derive
this relation; the manifest author asserts the family directly.

### C — The combinatorial-cost argument is not carried

Idea 4 is a *resource* claim: bad grouping is too expensive to test.
The plan has resource accounting via the `budget` field and pipeline
phase budgets
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)),
but does not apply this accounting to *grouping decisions*. The cost
of considering "should agencies X and Y form a new middle-level
group?" is not budgeted because the decision is not made
algorithmically — it is made by manifest authors.

### D — Nonsense groupings are not even possible to propose

The plan structurally cannot produce a "Green-and-Tall-and-recently-
touched" grouping, because grouping is authored not derived (gap A
in [som-10.4-sor.md](som-10.4-sor.md)). This is *good*; it would
also be good if the absence of nonsense were the result of an active
filter rather than the absence of any generator. The chapter implies
both halves are needed.

### E — Naming and the concept-of-concept

§10.7's deeper claim is that the *vocabulary itself* shapes what
ideas can be thought. The plan has a careful, mechanism-leaning
vocabulary, but no protocol for *renaming* a process when its meaning
shifts. If `agency.safety.blast-radius-fear` later turns out to be a
process rather than an appraisal, renaming it touches every
manifest, settlement, and memory entry that referenced it. The
identity protocol
([`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md))
defines stable IDs, not migration paths for renamings.

---

## Summary table

| # | Idea from §10.7 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Thingification is a hazard | Yes | Collapse rule + voice rules; units are files / steps. |
| 2 | Vocabulary biases theory | Yes | Process-leaning canonical vocabulary. |
| 3 | Methods, not concepts, are first-class | Yes | Manifest is method-shaped: activation, body, outputs. |
| 4 | Combinatorial cost of bad grouping | Partial | Budgets exist; not applied to grouping decisions (gap C). |
| 5 | Combine related agents first | No | No similarity relation over agencies (gaps A, B). |
| — | Names can become wrong over time | No | Identity protocol covers stability, not migration (gap E). |

---

## Implication for the plan (no changes proposed here)

§10.7 is, in effect, methodological: it tells the implementation
*how to talk about itself*. On that count the plan does well — the
canonical vocabulary, the collapse rule, and the voice rules all
push against thingification. The constructive half — "combine
related agents first" — needs primitives the plan does not yet
have: a similarity relation between agencies, a derived notion of
shared substrate, and a way to budget the *consideration* of
re-grouping. Closing any of these would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and the identity protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md).
None of this is proposed here. Any such move falls under the
"stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
