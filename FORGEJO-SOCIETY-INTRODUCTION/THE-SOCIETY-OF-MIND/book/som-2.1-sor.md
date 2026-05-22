# Section 2.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-2.1.md](som-2.1.md) — *Components and connections*
(Minsky, §2.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

This file inventories the ideas carried by §2.1 and checks each one
against the implementation plan. §2.1 is the section that follows the
Builder example and refuses the easy conclusion of §1.6: a list of
parts is not a system. Builder is its parts *plus* the wiring between
them, and "who talks to whom" is as much of the explanation as "what
each one does." So this analysis is, more than most, a check on
*topology* — not the agents themselves but the edges between them.

---

## The ideas Section 2.1 actually carries

Pulled from Minsky's text:

1. **Reduction is necessary but insufficient.** Builder reduces
   cleanly to Find, Get, Put, Move, Grasp, but the reduced list does
   not, by itself, predict Builder's behaviour.
2. **Connections are first-class.** A part list with a different
   wiring is a different system. The network of interconnections is
   part of the explanation, not a footnote to it.
3. **Three levels of understanding, in order.** First, how each part
   works in isolation. Second, how each part interacts with the parts
   it is connected to. Third, how all those local interactions combine
   into the externally visible behaviour of the whole.
4. **Heterogeneity of parts.** Brains have hundreds of distinct cell
   types. The default assumption of a homogeneous part-set is wrong.
5. **Heterogeneity of interactions.** Between those types there are
   thousands of different *kinds* of interaction. The edge vocabulary
   is large, not small.
6. **Society/community analogy.** Predicting a community's behaviour
   from individuals alone is impossible; you must also know the
   organisation — who talks to whom.
7. **Evolutionary descent eases analysis.** Knowing how a complex
   system evolved from simpler ancestors makes its present structure
   tractable.

These seven items are what the rest of this file tests against the
implementation plan.

---

## What the implementation already absorbs

### Reduction without flattening (ideas 1, 2)

The plan reduces every cognitive structure to one of two targets — a
file under `.forgejo-society/` or a step in the workflow
([`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md))
— but it does not flatten the system to its agencies. The polyneme
sheets in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
(`path-polynemes.yml`, `label-polynemes.yml`, `phrase-polynemes.yml`)
and the frame `linked_klines` / `linked_procedures` fields are *the
wiring*. They sit beside the agency manifests, not inside them, which
matches §2.1's instinct that the network is its own object.

### The agent and the edge as separate primitives (idea 2)

Polynemes carry `excite` and `inhibit` weights from a symbol to a set
of agencies; this is an explicit edge type with its own schema.
Handoffs ([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
carry `signals[]`, `objections[]`, and `candidate_actions[]`, each of
which is a different *kind* of message between agents. Settlement
holds the final activation graph
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)).
The wiring has files; it is not implicit in code.

### Level (a) — how each part works (idea 3a)

The manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(`id`, `agency`, `kind`, `authority`, `activates_on`, `inhibits`,
`outputs`, `budget`, prompt body) makes the behaviour of a single
agent fully describable from one file. Level (a) is the strongest
level in the plan.

### Level (b) — how parts interact (idea 3b)

The runtime pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
defines exactly four interaction shapes: *signal* (cheap,
high-frequency, structured), *handoff* (one agency's structured
return), *objection* (a typed disagreement attached to another
agent's claim), and *candidate action* (a proposed external effect).
Each has a JSON Schema. Level (b) is named, typed, and
machine-checked.

### Level (c) — how local interactions combine (idea 3c)

The settlement record is the level-(c) artefact: it names the
governing frame, the activated agencies with weights, the chosen
candidate actions, the objections that survived, and the visible
output. The conscious-presenter
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is the *sole* producer of the externally visible behaviour, which
makes the "behaviour as seen from the outside" of idea 3 a single,
locatable object per stimulus.

### Heterogeneity of parts (idea 4)

The agency family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
— perception, memory, code, safety, identity, integration, assembly,
meta-admin — refuses the single-worker default. Critics and censors
are deliberately different families with different authority ceilings
and different phases in the pipeline. The part-set is not homogeneous
by construction.

### The community analogy (idea 6)

The plan reads the system as a community throughout: `agencies/` are
the individuals, polynemes and frames are the social conventions that
say who responds to what, the settlement is the public minute of the
meeting, and `THE-SOCIETY-OF-REPO/02-protocols/07-service-channel.md`
formalises inter-society talk. The community framing is not a
metaphor on top of the plan; it is the plan's structure.

---

## What the implementation does not yet take into account

These are the §2.1 ideas that the plan currently leaves implicit,
partial, or absent. None are urgent; all are real.

### A — There is no single catalogue of the wiring

Idea 2 says connections are a first-class object. The plan has the
*pieces* of the catalogue — `path-polynemes.yml`,
`label-polynemes.yml`, `phrase-polynemes.yml`, the `excite` and
`inhibit` blocks in each frame manifest, the `activates_on` and
`inhibits` fields in each agency manifest — but no document or
generated artefact that *gathers* them into the single graph of
"who can talk to whom under what symbol." A reviewer who wants to
read the wiring has to assemble it by hand from at least five file
shapes. Level (b) of idea 3 is implemented but not summarisable.

### B — The interaction vocabulary is small, not large

Idea 5 expects *thousands* of distinct kinds of interaction. The
plan has four:
[*signal*, *handoff*, *objection*, *candidate action*](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md).
`signal.name` is open and dotted-lowercase, which lets the vocabulary
grow in practice, and `objection.kind` is a closed enum (`evidence`,
`scope`, `cost`, `privacy`, `risk`, `overconfidence`,
`source-quality`, `staleness`, `other`). This is deliberate — small
schemas are easier to validate — but it is a *chosen* simplification
of Minsky's heterogeneity claim, and the plan does not yet say so.
A future expansion would either widen the closed enums or introduce
new top-level record types beside *signal* / *handoff* / *objection*.

### C — Polyneme edges have only two polarities

Polynemes carry `excite` and `inhibit` as opposing scalar weights.
This is sufficient to express "wake this agency" and "quiet this
agency," but it is *not* sufficient to express the qualitative edge
variety Minsky names in idea 5 — gating, sequencing, prerequisite,
exclusion, suggestion, deference, escalation. The first-ship
polyneme catalogue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
treats every edge as a sign-and-magnitude relation. Frames partially
recover the missing edge types (`failure_conditions`,
`default_critics`, `default_censors`), but at frame granularity, not
at edge granularity.

### D — Connections are not budgeted

The manifest schema gives each agency a `budget` field
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the handoff record carries `tool_usage.calls` /
`tool_usage.wall_clock_s` / `tool_usage.cost_estimate`. Cost is
accounted *per part*. There is no concept of cost *per connection* —
a frequently-traversed polyneme edge is no more expensive than a
rare one, and an inhibition that fires on every stimulus is not
counted differently from an excitation that fires once a week. If
heterogeneity of interactions (idea 5) becomes structurally
important, the absence of an edge-cost accounting is the first place
that the plan will feel the pressure.

### E — Level-(c) coherence is only checked per stimulus

The settlement record is a brilliant level-(c) artefact *for one
event*. It does not aggregate. There is no document that traces
"across these N stimuli, the system's externally visible behaviour
matched the local interactions in M cases and diverged in N − M
cases." The mapping table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
is a *structural* check (SOR file → implementation target), not a
*behavioural* one (local rules → emergent outcome). §2.1's third
level is satisfied locally and unanswered globally. The
`evolution/reinforcement-log.md` referenced in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
is the closest candidate but is, by its own description, a *log*
rather than a coherence audit.

### F — Evolutionary descent is unrepresented

Idea 7 says understanding present structure is easier when you know
the simpler ancestors it evolved from. The plan has differentiation
and retirement brokers
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the git log itself
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
preserves the literal history of every manifest, but no manifest
field records *which* prior agency it descends from. There is no
`parent_agency` slot, no ancestry diagram, no "Builder evolved from
these earlier workers" trace. This overlaps with gap C of
[`som-1.1-sor.md`](som-1.1-sor.md) (Heredity) but is sharper here:
§2.1 says descent is an *aid to understanding the present*, not only
a question about the past.

### G — Heterogeneity of parts is named but not numbered

The agency family taxonomy lists eight families. Minsky's "hundreds
of types" is a quantitative claim about the *space* of part kinds.
The plan does not say whether eight is the intended ceiling, a
first-ship subset, or an open list to be grown. The
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
first-ship catalogue is finite and explicit; the meta-question "how
many families *should* exist when the society is mature?" is not
asked. As with gap H of [`som-1.1-sor.md`](som-1.1-sor.md), the
absence is defensible but worth recording.

---

## Summary table

| # | Idea from §2.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Reduction is necessary but insufficient | Yes | Two-target collapse rule; wiring sits beside agencies, not inside them. |
| 2 | Connections are first-class | Partial | Polynemes, handoffs and settlement carry the edges; no single wiring catalogue (gap A). |
| 3a | Level (a): how each part works | Yes | Manifest schema is fully descriptive. |
| 3b | Level (b): how parts interact | Yes | Four typed record shapes with JSON Schemas. |
| 3c | Level (c): combined behaviour | Partial | Settlement is per-stimulus; no cross-stimulus coherence audit (gap E). |
| 4 | Heterogeneity of parts | Partial | Eight families; ceiling and growth path unstated (gap G). |
| 5 | Heterogeneity of interactions | No | Four record types; closed `objection.kind` enum; two-polarity polyneme edges (gaps B, C). |
| 6 | Society / community analogy | Yes | Structural, not metaphorical. |
| 7 | Evolutionary descent | No | No `parent_agency`, no lineage trace (gap F). |
| Edges | Cost per connection | No | Budgets and tool-usage are per agent, not per edge (gap D). |

---

## Implication for the plan (no changes proposed here)

§2.1 is the chapter's hinge: it accepts the reduction of §1.6 and
then refuses to let the reduction stand alone. The implementation
plan honours the same move — every cognitive structure collapses to
a file or a step, and yet the wiring (polynemes, frames, signals,
handoffs, objections, settlement) is treated as its own primitive
with its own schemas. Levels (a) and (b) of Minsky's three-level
programme are well served.

The remaining work is on the third level and on the edge vocabulary.
The biggest unforced opportunity is gap A: a generated *connection
catalogue* that gathers every polyneme weight, every frame default,
and every `activates_on` / `inhibits` field into one readable graph,
so that a reviewer can read the wiring as a single object. The
biggest substantive opportunity is gap E: turning the
per-stimulus settlement into a periodic cross-stimulus coherence
audit, alongside `evolution/reinforcement-log.md`.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the polyneme and frame schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the handoff and settlement schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the mapping table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md),
and the credit-assignment and evolution protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
and
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
