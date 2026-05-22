# Section 22.11 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.11.md](som-22.11.md) — *Creative expression*
(Minsky, §22.11).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.11 closes chapter 22 with a generative observation. When we try
to express a complicated internal state, we are forced to
oversimplify — and in that very forcing, we sometimes discover
something new. The structure p we thought we wanted to say may not
have been definite; speaking *creates* a clearer q than was there
before. Words detached from their meanings can be rearranged freely.
What endures across people is what we call *culture*.

---

## The ideas Section 22.11 actually carries

1. **Expression rarely matches intent exactly.** What we say is
   almost never identical to what we meant.
2. **The source p may not be fixed.** What we are trying to describe
   is often a changing network of agencies, not a definite structure.
3. **Speaking can revise the source.** The act of expressing changes
   what we had to express. ("Thinking in words.")
4. **Oversimplification has loss and gain.** We lose nuance; we gain
   the chance to separate essence from accident.
5. **Talking to oneself reformulates.** "What was I really trying to
   accomplish?" is a question that simplifies and clarifies.
6. **Explaining to others reveals understanding.** Teachers know how
   often a thing is first understood while being explained.
7. **Detached words can be rearranged.** Once meanings are
   temporarily released, language can do what it wants, then
   re-bind.
8. **Transmission across people produces culture.** Successful
   formulations accumulate across history as conceptual treasures.

---

## What the implementation already absorbs

### Settlements turn deliberation into a written object (ideas 3, 4)

Writing the settlement makes the deliberation *visible to itself*
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
After the record is written the society can read its own thinking,
which is the operational form of "speaking changes the source."

### The git log as durable culture (idea 8)

Per
[AGENTS.md](../../../AGENTS.md), cognition persists as Git objects.
Settlements, K-lines, decisions, and procedural memory all live in
the repository's history; transmission across time *is* the log.
This is the within-society analogue of cultural accumulation.

### Failure log as record of what did not work (idea 4)

`memory/failure/` and `memory/failure/rejected-candidates/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
record what was tried and discarded. They preserve the "accident"
that the survivor of oversimplification was selected against.

### Self-talk surface (idea 5)

`state/mind/issues/<n>/workspace.md` and `blackboard.md` are
human-readable rolling records of "the current situation" and the
layered cognitive state. They are the closest analogue of
"saying to oneself, *what was I really trying to accomplish?*"

### A federation tier as outward-bound culture channel (idea 8)

[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
exists as the surface across which one society's formulations could
be transmitted to another. The destination exists; the protocol does
not yet.

---

## What the implementation does not yet take into account

### A — Speaking does not feed back into the source

The presenter's output is committed to `final.md` and shipped; the
*act* of producing it does not revise the settlement, the K-line, or
the proposal. §22.11's most striking claim — that expression revises
what was being expressed — has no implementation. The loop is open.

### B — No "thinking in words" agency

There is no agency whose role is to *use language internally* to
clarify a state that other agencies have left ambiguous. The
presenter speaks *outward*; nothing speaks *inward* to the deliberation
in language form.

### C — Loss / gain of oversimplification is unmeasured

Idea 4 makes oversimplification a trade. The plan has
`observability_limits` and `unknowns` in the settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
which can carry what was lost, but no field records what was *gained*
by the simplification — the clarification that came from forcing
expression.

### D — Detachment of words from meanings has no surface

Idea 7 — words rearranged freely while temporarily detached — would
require a stage in which generated phrases were treated as
manipulable tokens rather than as carriers of meaning. The plan has
no such stage. Output is composed and sent.

### E — Cross-society transmission has no protocol yet

The federation tier exists as a *place* (idea 8 has somewhere to
land), but the channel protocol for transmitting K-lines, frames,
decisions, or concepts from one society to another is not specified
in the implementation plan. Cultural accumulation across societies is
therefore aspirational rather than mechanical.

### F — No notion of "successful formulation"

What gets transmitted as culture is, in §22.11, the *successful*
formulation. The plan ranks settlements by `outcome.status`
(`success`, `partial`, `failed`, `blocked`) but has no separate
measure of *expressive success* — "this formulation continued to be
useful to other deliberations." `reuse_count` exists on K-lines;
nothing comparable exists on settlements or concepts.

### G — Reformulation has no first-class operator

Ideas 5 and 6 — talking to oneself, explaining to others — both
suggest a reformulation step distinct from initial expression. The
plan has *succession* via `supersedes:` links, but no operator that
takes an existing record and produces a *clearer* version of it on
purpose. The relational link kinds in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
do not include `reformulates` or `clarifies`.

---

## Summary table

| # | Idea from §22.11 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Expression rarely matches intent | Implicit | No mechanism, but voice rules encourage honest scope. |
| 2 | The source p may not be fixed | Partial | Layered blackboard exists; not modelled as moving target. |
| 3 | Speaking revises the source | No | Output does not feed back (gap A). |
| 4 | Loss / gain of oversimplification | Partial | `unknowns`/`observability_limits` for loss; no gain field (gap C). |
| 5 | Self-talk reformulates | No | No "thinking in words" agency (gap B); no reformulation operator (gap G). |
| 6 | Explaining reveals understanding | Partial | Settlement makes deliberation visible; nothing forces an explanatory pass (gap G). |
| 7 | Detached words can be rearranged | No | No detachment stage (gap D). |
| 8 | Culture is transmitted across people | Partial | Git log as within-society culture; no cross-society protocol (gap E); no "successful formulation" measure (gap F). |

---

## Implication for the plan (no changes proposed here)

§22.11 closes the chapter by pointing at two distinct loops the plan
has not yet drawn. The *inner* loop — expression revising the source —
would require the presenter's output to feed back into the
deliberation that produced it. The *outer* loop — culture across
societies — would require a federation-scale channel protocol and a
notion of "successful formulation" that survives transmission. The
plan has the destinations of both (settlement records, federation
tier) but neither operator.

Any move to make the presenter's output revise its source, to
introduce a thinking-in-words agency, a reformulation operator, a
detachment stage, or a cross-society transmission protocol would
touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the relational-memory protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md),
and the channel and federation material in
[`THE-SOCIETY-OF-REPO/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/)
and
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
