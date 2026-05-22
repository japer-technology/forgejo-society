# Section 18.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-18.7.md](som-18.7.md) — *What is a number?*
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§18.7 takes the most impersonal example available — *Five* — and
shows that even there meaning is not a definition but a *network*.
Five-for-counting, Five-as-shape, Five-as-fingers, Five-as-syllable-
stream: each is a different problem world; together they are what
"five" means. Definitions are flimsy chains; meanings are
cross-connected webs that you can switch between when any single
sense fails.

---

## The ideas Section 18.7 actually carries

1. **Meaning depends on each mind's state.** No two minds mean
   exactly the same thing by any term; perfect agreement would
   require identical minds.
2. **Circularity is not a defect.** A network where each meaning
   depends on others is workable; theories about such networks are
   fine science even if no element is isolable.
3. **Even "Five" is a network.** Counting, matching, shape,
   syllable-stream, group — each is a different way to know Five.
4. **Each method helps the others.** Counting helps matching;
   shape helps counting; they form a mass of skills, not a hierarchy.
5. **Children may know larger before smaller.** A child who has
   played with hexagons may know Six before Five; meaning does not
   accrete by definition order.
6. **Flimsy logic chains vs robust meaning networks.** A chain of
   definitions breaks easily; a cross-connected network lets you
   switch senses when one fails.
7. **Numbers carry many Twos and Threes.** Two-hands, two-shoes,
   their interchangeabilities; Three-bears as Two-and-One, Three-
   porridge-bowls as too-hot-too-cold-just-right.

---

## What the implementation already absorbs

### Meaning as a network of records (ideas 2, 6)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
and
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
treat durable records as a graph: every record carries `linked:`
with typed edges (`supersedes`, `derived_from`, `contradicts`,
`cites`, `reinforces`, `analogous_to`, `learned_from`). A concept in
`memory/concepts/` is not a definition; it is a node with edges to
other records. This is structurally a meaning-network rather than a
definition-chain.

### Polynemes as cross-connected senses (idea 3)

A polyneme
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
"wakes many partial meanings across agencies". The same symbol
(`workflow-file`, `soul-file`, `directive.spock`) excites several
agencies at once. A polyneme is operationally a small
meaning-network: one symbol, several senses, each contributing to
activation. §18.7's "Five for counting, Five as shape, Five as
syllable stream" is the cognitive shape that polynemes mirror at
the operational level.

### Switch-when-one-fails via parallel branches (idea 6)

K-lines and analogies live side by side in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md):
when no K-line matches strongly, the analogy pass runs over
`memory/analogies/`. The activation layer falls through several
matchers (frame match, polyneme match, K-line cue, analogy) so a
weak match in one path does not silence the others. This is
"switch to another sense when one sense fails", at the activation
layer.

### Many partial meanings per concept (idea 7)

The concept folder in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(`memory/concepts/`) holds candidate abstractions awaiting
governance. A concept entry can accumulate multiple `linked:` edges
to settlements, decisions, K-lines, and other concepts. The shape is
right for a Two-hands-Two-shoes accumulation; the plan does not
restrict a concept to a single definition.

### Decisions over an open vocabulary (idea 1)

`memory/semantic/preferences.log` and `agency.identity.user-model-keeper`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
record that the user's meanings drift; the society does not assume
that "remember", "what did we decide", "you said before" mean the
same thing in every dialogue. Phrase polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md):
`memory-request`) gather the senses without merging them.

---

## What the implementation does not yet take into account

### A — A concept entry has no internal sense-table

`memory/concepts/<concept-id>.md` is a Markdown file with
provenance edges. It does not have a structured slot listing the
*different senses* of the concept and the contexts in which each
sense applies. A reviewer cannot ask "what are the three operative
senses of *settlement* in this society?" and get a single record;
they would have to read across the concept file and its links.

### B — Switching between senses is not a recorded operation

Idea 6 — "when one sense fails, switch to another" — is operational
in the activation layer (K-line fall-through to analogy) but not at
the concept layer. If `concept.evidence` is being read in two
different senses by two agencies, no record captures the *switch*
between senses, and credit assignment cannot attribute the outcome
to "we tried sense 1 first, it failed, sense 2 worked".

### C — No analogue of "child knows Six before Five"

Idea 5 says meanings do not accrete by definition order. The plan's
bootstrap checklist
([`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
referenced via
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md))
implies that the first-ship catalogue is the canonical seed; later
specialisations come from `self-modification` settlements. There is
no mechanism by which the society could *acquire* a richer
concept before a simpler one — the order is in the catalogue. This
is by design (governed evolution), but it is also the §18.7 gap.

### D — Relational links do not include sense-of

The link-type vocabulary (`supersedes`, `derived_from`, etc.) has
no `sense_of:` or `interpretation_of:`. A concept can be `cited` by
many records, but the citation does not specify *which sense* was
cited. §18.7 would warn that this collapses the very distinctions
that make a meaning-network useful.

### E — Numbers and discrete quantities are not first-class

§18.7 happens to use number meanings as its example. The plan has
no concept-of-number infrastructure: thresholds and budgets carry
numbers, but a *meaning* of "five files touched" versus "five
critics sustained" versus "five reuses logged" is collapsed into
the bare integer. This is a small gap rather than a load-bearing
one; §18.7's deeper point is about meaning networks in general, and
that point is the previous gaps.

---

## Summary table

| # | Idea from §18.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Meaning depends on each mind | Partial | User model exists; sense-drift is not first-class. |
| 2 | Circular dependence is workable | Yes | Records form a graph; no acyclicity requirement. |
| 3 | Even "Five" is a network | Yes | Polynemes wake multiple senses; concept files accumulate edges. |
| 4 | Each method helps the others | Yes | K-lines, frames, polynemes, analogies layer together. |
| 5 | Larger before smaller | No (by design) | First-ship catalogue fixes seed order (gap C). |
| 6 | Networks vs chains | Yes | Activation fall-through; relational-memory protocol. |
| 7 | Many partial meanings per concept | Partial | `memory/concepts/` permits it; structured sense-table absent (gap A). |
| — | Sense-switching as an operation | No | No record captures a switch between senses (gap B). |
| — | `sense_of:` link type | No | Not in the relational vocabulary (gap D). |

---

## Implication for the plan (no changes proposed here)

§18.7 makes the plan's strongest hidden case: that the relational
graph it already maintains is doing meaning-network work, not
definition-chain work. Polynemes wake several senses at once;
K-lines and analogies provide fall-through; concept files accumulate
edges rather than fixing definitions. The plan is already in the
network mode that §18.7 recommends.

The unfilled half is *fineness*. A concept's senses are not
structurally listed; switches between senses are not recorded; the
link vocabulary cannot mark "this citation is of sense 2 of concept
X". For most operations these are immaterial. For audit and for
later credit assignment over conceptual drift, they would matter.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the concept entries in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and the polyneme schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
