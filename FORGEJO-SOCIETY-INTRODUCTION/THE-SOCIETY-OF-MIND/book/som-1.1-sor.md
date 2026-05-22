# Section 1.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-1.1.md](som-1.1.md) — *The agents of the mind*
(Minsky, §1.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

This file inventories the ideas carried by §1.1 and checks each one
against the implementation plan. §1.1 is the section that sets the
*entire* agenda of *Society of Mind* — it names three timescales, one
foundational move ("explain mind from mindless stuff"), and the
thirteen questions a theory of mind must answer. So this analysis is
unusual: it is the first place where the plan can be measured against
the whole book's stated programme, not against a single figure.

---

## The ideas Section 1.1 actually carries

Pulled from Minsky's text:

1. **Three timescales of mind.** A good theory must span the
   evolutionary (billions of years), the developmental (weeks and
   months of childhood), and the historical (centuries of ideas).
2. **Mind from mindless stuff.** Mind has to be built from parts
   that have *no thoughts or feelings of their own*. If the parts
   are already smart, the explanation is circular.
3. **The agent is the primitive.** The unsplittable theoretical
   unit is the *agent* — a small, narrow worker.
4. **A society of agents, not an isolated mechanism.** No single
   answer suffices; the questions illuminate each other only when
   the agents are taken together.
5. **Thirteen questions as a closed agenda.** Function, Embodiment,
   Interaction, Origins, Heredity, Learning, Character, Authority,
   Intention, Competence, Selfness, Meaning, Sensibility, Awareness.
   Minsky treats these as the columns of any honest mind theory.
6. **Severing the questions destroys them.** The questions become
   tractable *only* when their connections are preserved. A theory
   that answers them one at a time has already failed.
7. **A theory of mind is also a theory of explanation.** The
   section's last paragraph reframes the project: the test is not
   whether each answer is right, but whether the answers form a
   single coherent picture.

These seven items, expanded through the thirteen questions, are what
the rest of this file tests against the implementation plan.

---

## What the implementation already absorbs

### Mind from mindless stuff (idea 2)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
makes every agency, critic and censor *a Markdown file with YAML
frontmatter*. None of those files claim inner life. The workflow
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
is a series of named steps that read those files. Nothing in the
runtime claims to think. This is exactly the "no thoughts or feelings
of their own" discipline Minsky asks for, and the binding voice rules
in [AGENTS.md](../../../AGENTS.md) enforce it on the prose surface as
well: no "AGI", "AI brain", or anthropomorphic flourishes.

### The agent as primitive (idea 3)

The manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
gives every agent an `id`, `agency` family, `kind`, `authority`,
`activates_on`, `inhibits`, `outputs`, and `budget`. The agent is the
unit of identity, of authority, and of accounting. The identity
protocol in `THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`
formalises this with the `{scope}.{kind}.{name}` shape.

### A society, not an isolated mechanism (idea 4)

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is explicitly composite — perceive, activate, deliberate, criticize,
censor, settle, act, remember, report — and the *settlement* layer
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
is the place where many partial signals become one decision. The plan
refuses the single-agent shortcut; the smallest unit that does
anything visible is the loop, not the worker.

### Questions answered together (idea 6)

[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
is the operational form of "answers illuminate the rest": each
specification concept maps to a file *and* a workflow step, and the
mapping is verified as a whole, not piecewise. The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("every structure collapses to either a file under
`.forgejo-society/` or a step in the workflow") is the structural
guarantee that the answers stay connected.

### The thirteen questions — one-by-one

| # | Question | Where it lives in the plan | Notes |
| --- | --- | --- | --- |
| 1 | **Function** — how agents work | [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md) (prompt body + `outputs`) | Strong: each agency's behaviour is its manifest. |
| 2 | **Embodiment** — what they are made of | Markdown + YAML files, executed via Forgejo Actions runners | Strong: embodiment is the file plus the runner step. |
| 3 | **Interaction** — how they communicate | [`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md), polynemes ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)), blackboard, signals/handoffs/objections | Strong: typed channels exist. |
| 7 | **Character** — most important kinds of agents | Family taxonomy in [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md) (perception / memory / code / safety / identity / integration / assembly / meta-admin) | Strong: character is the family. |
| 8 | **Authority** — what happens when agents disagree | Critics in `criticize` phase, censors in `censor` phase, the `authority-registry.yml`, settlement, approval-gate ([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md), [`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)) | Strongest area of the plan. Disagreement is named, scoped, and resolved by a settlement record. |
| 10 | **Competence** — groups doing what individuals cannot | The settlement layer + `agency.assembly.summary-tier-1/2` + `agency.integration.conscious-presenter` | Strong: competence is composition. |

These six questions are the plan's solid ground. The rest are weaker;
see the next section.

---

## What the implementation does not yet take into account

These are the §1.1 ideas that the plan currently leaves implicit,
partial, or absent. None are urgent; all are real.

### A — Three timescales: only one is represented

Idea 1 names *three* timescales: evolution (billions of years),
development (weeks to months), and history (centuries). The plan has:

- **Historical**: yes, this is the strongest. `memory/decisions/`,
  `memory/episodic/`, `evolution/reinforcement-log.md`, and the git
  log itself ([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
  carry the "centuries of ideas" timescale, just compressed.
- **Developmental**: partial. The `self-modification` frame and
  `agency.meta-admin.differentiation-broker` /
  `agency.meta-admin.retirement-broker`
  ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
  give shape-change a mechanism, but there is no notion of a
  *developmental curve*: the plan has no "infancy", "stabilisation"
  or "maturity" phase of an agency's life with different rules in
  each.
- **Evolutionary**: absent. There is no representation of selection
  pressure across societies, no analogue of a billion-year baseline,
  and no place where the existing agency set is treated as the *output
  of* a longer-running process. Minsky's evolutionary scale would
  require a federation-level memory that the implementation does not
  yet describe.

### B — Origins: the first agents are seeded, not derived

Question 4 (Origins): the plan supplies the first agents via a
human-authored *first-ship catalogue*
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and a bootstrap checklist
([`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)).
This is honest, but it is *not* an answer to "where do the first
agents come from?" — it is a deferral. Nothing in the plan generates
its own minimal seed; the seed is given. Minsky's question is left
to the maintainer.

### C — Heredity: no concept of inherited agency genome

Question 5 (Heredity): the plan has no way to ask "are all Forgejo
societies born with the same agencies?" Every instance is bootstrapped
identically from the same first-ship catalogue, which makes the
question trivially yes by construction, but there is no
*representation* of heredity — no genome file, no descent record from
a parent society, no diff against an ancestral agent set. The
federation material in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
is where this would eventually live, and at present does not.

### D — Learning: change exists, learning does not

Question 6 (Learning): the plan has *mechanisms for change* —
`self-modification` frame, differentiation-broker, retirement-broker,
`evolution/reinforcement-log.md` — but it does not yet have a
**learning loop**. There is no place where outcome statistics drive a
change to an agency's prompt, no place where a critic's hit rate
modifies its weight, no place where a K-line's reactivation success
adjusts its `restore_when`. Reinforcement is *logged*, not *applied*.
Closing this would touch
[`02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
and
[`10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/)
in the specification, not just the plan.

### E — Intention: no primitive for "wanting"

Question 9 (Intention): Minsky asks how a network of agents could
*want* or *wish*. The plan has *signals*, *objections*, *candidate
actions*, and *budgets* — all of which describe state, not desire. No
agency declares a *goal*; no manifest field encodes a wish; the
authority levels (`read`, `draft`, `propose`, `act`, `govern`,
`human`) describe what an agency may *do*, not what it *wants*. The
closest analogue is `governance/self-ideals.md`, which describes
ideals at the society level rather than at the agency level. An
agency-local notion of intention is not yet a first-class shape.

### F — Selfness: unity is asserted, not built

Question 11 (Selfness): the plan asserts unity through a single
narrator — `agency.integration.conscious-presenter` is the *sole*
producer of visible text ([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
— and a self-model file (`AGENTS.md`, plus
`agencies/identity/spock-self-model.md`). This is *structural* unity:
one voice, one model. Minsky's §1.1 question, taken seriously, asks
how unity *emerges* from many agents. The plan's answer is
"engineered, not emerged," which is defensible but not the same
answer. The gap is worth recording.

### G — Meaning: not represented at all

Question 12 (Meaning): the plan has *semantic memory* in the file
sense — `memory/semantic/decisions.log`, `memory/concepts/` — and
*relational links* in record schemas
([`02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)).
It does not have any notion of *what it means* for the society to
understand something. There is no comprehension test, no internal
re-representation check, no analogue of K-line generalisation
considered as *grasp* rather than *recall*. This is one of the
sections of Minsky most cleanly missing from the plan.

### H — Sensibility: explicitly out of scope

Question 13 (Sensibility): the plan does not represent feelings or
emotions, and the voice rules in [AGENTS.md](../../../AGENTS.md)
*forbid* anthropomorphic prose that would suggest them. This is a
*chosen* absence, not a missed one. It must still be noted, because a
faithful reading of §1.1 demands that Sensibility have *some*
operational treatment — even if that treatment is the explicit
decision not to model it. The plan would benefit from a one-paragraph
statement in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
recording that Sensibility is intentionally not represented and that
*safety signals* (e.g. `agency.safety.blast-radius-fear`) are not
emotions, only named scalar appraisals.

### I — Awareness: only the structural half

Question 14 (Awareness): the plan covers *one* half — the *structural*
half — well. The conscious bottleneck
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Conscious bottleneck") and the introspection protocol
([`02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
make the society *observable to itself* via `unknowns` and
`blind_spots` slots in the settlement. The plan does not — and
correctly should not — claim *experiential* awareness. As with
Sensibility (gap H), the absence is real, defensible, and worth
recording explicitly.

### J — The thirteen questions are not used as an index

The plan does not (today) reference Minsky's thirteen-question
agenda anywhere. The mapping table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
indexes by SOR file, not by §1.1 question. As a result, a reviewer
cannot ask "where does the plan answer *Heredity*?" and get an
answer. This is a documentation gap rather than a structural one;
closing it would be a small addition to the mapping document.

---

## Summary table

| # | Idea from §1.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Three timescales (evolution, development, history) | Partial | Historical strong; developmental weak; evolutionary absent (gap A). |
| 2 | Mind from mindless stuff | Yes | Markdown + YAML + workflow steps; voice rules enforce non-anthropomorphism. |
| 3 | The agent as primitive | Yes | Manifest schema; identity protocol. |
| 4 | A society, not an isolated mechanism | Yes | Composite pipeline; settlement layer. |
| 5 | Thirteen questions as a closed agenda | Partial | Six questions answered cleanly; seven partial or absent (gaps B–I). |
| 6 | Severing destroys the questions | Yes | Collapse rule + mapping table keep the structure connected. |
| 7 | A theory of mind is a theory of explanation | Partial | Mapping table is the coherence check; it is not yet indexed by §1.1's questions (gap J). |
| Q4 | Origins | No | Seeds are given, not derived (gap B). |
| Q5 | Heredity | No | No genome / descent representation (gap C). |
| Q6 | Learning | Partial | Change mechanisms exist; learning loop does not (gap D). |
| Q9 | Intention | No | No primitive for "wanting" (gap E). |
| Q11 | Selfness | Partial | Unity engineered, not emerged (gap F). |
| Q12 | Meaning | No | Comprehension not represented (gap G). |
| Q13 | Sensibility | No (by design) | Out of scope; should be stated explicitly (gap H). |
| Q14 | Awareness | Partial | Structural half present; experiential half correctly absent (gap I). |

---

## Implication for the plan (no changes proposed here)

§1.1 is the book's *entire programme*. The implementation plan honours
the four foundational moves — mind from mindless stuff, agent as
primitive, society over isolated mechanism, and answers that
illuminate each other — and answers six of the thirteen questions
solidly through workflow phases, manifest schemas, and the settlement
layer.

The other seven questions are either partial (Origins, Learning,
Selfness, Awareness), structurally absent (Heredity, Meaning), or
deliberately excluded (Sensibility). The biggest unforced opportunity
is gap J: indexing
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
by §1.1's thirteen questions, so that a reviewer can trace each
question to its file/step pair (or to its explicit non-representation).
The biggest substantive opportunity is gap D: turning
`evolution/reinforcement-log.md` from a *log* into a *loop*.

These are recorded here as analysis, not as a change request. Any move
to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the credit-assignment and evolution protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
and
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and possibly the identity scopes in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
