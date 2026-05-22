# Section 1.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-1.6.md](som-1.6.md) — *Agents and Agencies*
(Minsky, §1.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§1.6 is the section that fixes the *terminology* of the entire
book. It restates the chess-machine warning, exposes the
double-life of Builder (knows-how from outside; only-switches from
inside), and offers the steering-wheel parable to argue that
*which view is correct depends on the question*. The
*agent / agency* dyad is the load-bearing primitive: any honest
implementation must keep both views available and let the reviewer
pick which one to use.

---

## The ideas Section 1.6 actually carries

Pulled from Minsky's text:

1. **Reductionism is the construction rule.** Whenever an agent
   appears to do something complicated, replace it with a
   sub-society of simpler agents.
2. **The chess-machine warning is binding.** No agent may secretly
   contain "a human dwarf inside". Apparent intelligence at the
   leaf is a debugging signal, not an explanation.
3. **The sense-of-loss is to be accepted.** Decomposed parts look
   "dry as dust"; this aesthetic cost is the price of honesty.
4. **Knowing is not localisable to any single part.** Builder's
   *knowing-how-to-build* is in none of Find, Get, Move; it is in
   their interrelation.
5. **Two viewpoints, both correct.** From outside, an agency
   *knows*; from inside, an agent only *switches*. Both views are
   required.
6. **The choice of view is question-driven.** The steering wheel
   is *an agency* when you are driving and *an agent* when you are
   debugging the linkage.
7. **Switching viewpoints is the normal mode.** "We'll always be
   switching between agents and agencies." Neither view is the
   privileged one.

---

## What the implementation already absorbs

### Reductionism as construction rule (idea 1)

The differentiation-broker
(`agency.meta-admin.differentiation-broker` in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is the explicit mechanism for "replace with a sub-society". The
collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
guarantees that the result is still expressible as files and
workflow steps.

### Chess-machine warning (idea 2)

The closed authority set (`read`, `draft`, `propose`, `act`,
`govern`, `human`) in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
is the structural form of the warning: no agency can quietly
acquire capabilities it does not declare. The voice rules in
[AGENTS.md](../../../AGENTS.md) keep the prose from re-introducing
a hidden dwarf.

### Sense-of-loss accepted (idea 3)

The promotion style guide
([`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../../../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md))
chooses the dry register on purpose: specifics over slogans,
mechanisms over mystique, restraint over hype.

### Knowing is relational (idea 4)

The settlement
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
is the plan's "where the knowing lives": no single agency carries
the decision, and the record is the composition of signals,
objections, and resolution. The deliberate / criticize / censor /
settle sequence in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is the structural form of "knowing is in the interrelation".

### Both viewpoints available (idea 5)

The manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
exposes the *outside* view (`id`, `kind`, `authority`,
`activates_on`, `outputs`, `budget`). The prompt body, plus the
runtime trace, exposes the *inside* view (what was actually
evaluated, with what inputs, producing what signals). The mapping
table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
is where the two views are placed side by side.

### Switching as normal mode (idea 7)

The introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md)
lets the society interrogate its own state, which is the operational
form of switching from agency-view ("what does it do?") to
agent-view ("how did it just do it?").

---

## What the implementation does not yet take into account

### A — The agent / agency dyad is not named in the schema

Idea 5 is honoured in practice but not in vocabulary. The manifest
schema has no field that marks "this is the *agency* description
(outside view)" versus "this is the *agent* description (inside
view)". A reviewer asking "show me the agent view of
`agency.assembly.summary-tier-1`" gets the prompt body and a trace
log, but the plan does not formalise the two-view distinction as
part of the file format. The terminology Minsky fixes in §1.6 is
left implicit.

### B — The question-driven view-choice is not surfaced

Idea 6 (the steering wheel as agency-when-driving, agent-when-
debugging) requires the *consumer* of the view to declare which
view they need. The plan's surfaces — settlement records, episodic
memory, introspection responses — present one view at a time
without asking which one was wanted. There is no flag, slot, or
query parameter that says "I am asking the agency question" versus
"I am asking the agent question".

### C — "Knowing is in the interrelation" has no diagnostic

Idea 4 implies that, when a settlement goes wrong, the diagnostic
question is *where in the interrelation* the failure sits, not
*which agency was wrong*. The plan logs objections and the
prevailing resolution, but it does not represent *the joint* —
the specific signal-pair or handoff-pair whose composition
produced the bad outcome. Failure is attributed to participants,
not to the relations between them.

### D — Sub-societies are not auditable as wholes

Idea 1 (replace with a sub-society) is supported mechanically by
the differentiation-broker, but the plan has no notion of a
*sub-society identifier*: nothing groups the agencies that emerged
from a single differentiation into a single unit that can be
audited, retired, or revised together. The result is a flat
catalogue. A `cluster` or `subsociety` reference on the manifest
would close this; it does not exist today.

### E — The leaf-intelligence smell-test is not automated

Idea 2 forbids leaves that are themselves intelligent. The plan
forbids the *prose* signs of this (voice rules) but has no
*structural* test: nothing flags an agency whose `outputs` cover
suspiciously many kinds, or whose prompt body asks the model to
"reason about" rather than to "produce one signal". A reviewer
must catch it by reading.

---

## Summary table

| # | Idea from §1.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Replace complex agents with sub-societies | Partial | Differentiation-broker exists; no sub-society identifier (gap D). |
| 2 | Chess-machine warning (no hidden dwarf) | Partial | Closed authority set + voice rules; no structural smell-test (gap E). |
| 3 | Accept the sense-of-loss | Yes | Style guide and voice rules choose the dry register. |
| 4 | Knowing is in the interrelation | Partial | Settlement composes signals; failure not attributed to relations (gap C). |
| 5 | Two viewpoints, both correct | Partial | Both views recoverable; not named in the schema (gap A). |
| 6 | View choice is question-driven | No | No flag/slot for "which view did you ask for" (gap B). |
| 7 | Switching viewpoints is normal | Yes | Introspection protocol supports interrogation. |

---

## Implication for the plan (no changes proposed here)

§1.6 is the section that fixes the vocabulary the rest of the book
uses. The plan honours every load-bearing move — reductionism, the
chess-machine warning, the sense-of-loss, knowing-as-relation, and
the availability of both views. The gaps are all about *making the
dyad legible*: naming it in the schema (A), surfacing the
question-driven choice (B), attributing failures to relations and
not only to participants (C), grouping emerged sub-societies (D),
and adding a structural smell-test for leaf-intelligence (E). None
of these blocks the plan from working; each one would make the
plan easier to read against Minsky's terms.

Closing any of A–E would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the identity scopes in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md),
the settlement record in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
or the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
