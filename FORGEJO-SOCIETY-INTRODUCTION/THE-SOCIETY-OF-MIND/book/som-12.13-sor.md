# Section 12.13 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-12.13.md](som-12.13.md) — *Bridge-definitions*
(Minsky, §12.13).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§12.13 closes the chapter. Purposeful definitions are too loose;
structural definitions are too tight. The remedy is the
*bridge-definition*: capture an idea by squeezing in from several
sides at once. Minsky generalises: meanings are not particular
structures but *connections among fragments of the great
interlocking networks of constraints* among agencies. Networks
grow and change, so meanings are rarely sharp, and learning a
word is rebuilding the thought from materials already at hand.

---

## The ideas Section 12.13 actually carries

1. **Purposeful definitions are too loose.** They admit too
   much.
2. **Structural definitions are too tight.** They reject too
   much.
3. **Squeeze in from several sides at once.** Two or more
   description kinds together can isolate what one cannot.
4. **The best ideas bridge between worlds.** Structure ↔
   purpose; ends ↔ means.
5. **Meanings are not particular structures.** They are
   *connections* across fragments of the agency network.
6. **Networks grow and change, so meanings are not sharp.** A
   verbal definition is a hint, not a delivery.
7. **Learning a word is rebuilding the thought from your own
   materials.** No transmission is direct.

---

## What the implementation already absorbs

### Multi-sided definitions exist (ideas 3, 4)

A frame
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
already squeezes from several sides: `matches.any_signals`,
`matches.any_labels`, `matches.any_paths`, `matches.any_phrases`,
required `slots`, `default_actions`, `failure_conditions`,
`linked_klines`. The same situation is recognised by *agreement
among multiple cheap cues*, exactly the bridge-definition shape.

### Meaning as connection (idea 5)

Relational memory
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`)
gives every durable record typed graph links. A concept's
*meaning*, in the plan, is the set of records that cite it,
supersede it, are derived from it, or contradict it. The closer
a record sits to many others, the richer its meaning. This is
the operational form of §12.13's "connections among fragments".

### Networks grow and change (idea 6)

`memory/` is append-only with `supersedes:` corrections
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Meaning shifts as new records join the network and as old ones
acquire `superseded_by` and decay scores. The plan does not
treat any meaning as final.

### Verbal definition as hint (idea 7)

The `intake-bee` agency
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the perception family treat a stimulus's prose as one input
among many, not as a delivery of intent. The plan never grants a
user's wording the last word; the settlement is the joint
product of percepts, frames, K-lines, critics, and censors.

---

## What the implementation does not yet take into account

### A — "Bridge-definition" as a named shape

§12.13's headline is that a useful definition is a *bridge*
between description kinds. The plan offers the substrate (frames
with many `matches:` channels, concepts in relational memory)
but does not have a *named* construct called a bridge-definition
that an agency could emit, critique, or store. The label is
missing even though the shape is present.

### B — No "squeeze from several sides" critic

The plan can detect missing evidence (`critic.evidence`) and
overconfidence (`critic.overconfidence`), but has no critic that
complains "this definition was built from only one side; please
add a complementary side". §12.13 implies that single-sided
definitions are a recognisable failure mode.

### C — Concepts can be promoted without being bridge-shaped

`memory/concepts/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
holds candidate abstractions awaiting governance. The promotion
criterion is unspecified (gap E in
[som-12.8-sor.md](som-12.8-sor.md)). §12.13 supplies a candidate
criterion — *must bridge two description kinds* — that the plan
does not adopt.

### D — Networks are typed but bridge-typing is not measured

`linked:` records carry kinds (`supersedes`, `derived_from`,
`contradicts`, `cites`, `reinforces`, `analogous_to`,
`learned_from`). The plan does not classify any of these
*specifically* as cross-realm bridges. A concept that links
only structural records and a concept that bridges structural
and functional records look identical to the runtime.

### E — User-side rebuilding is not modelled

Idea 7 — that the listener rebuilds the thought from their own
materials — is the *user*'s side of any settlement, and the
plan has only the *user-model-keeper*
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
as a stand-in. There is no record of "what the user *probably*
rebuilt from Spock's reply", and therefore no way for the
remember phase to notice when the rebuild failed.

### F — "Hints, not deliveries" is not a documented stance

The plan operates this way (no user prose is decisive) but does
not declare the stance in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or the protocol set. A new contributor reading the plan could
miss that user wording is treated as a hint, not a directive.

---

## Summary table

| # | Idea from §12.13 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Purposeful definitions are too loose | Yes (implicit) | Frames pair purposeful side with structural matches. |
| 2 | Structural definitions are too tight | Yes (implicit) | Same: structural side complemented by purposeful side. |
| 3 | Squeeze from several sides at once | Yes | Frame `matches.*` is multi-channel by design. |
| 4 | Best ideas bridge worlds | Partial | Bridges protocol exists; bridge-definitions not named (gap A). |
| 5 | Meanings are connections, not structures | Yes | Relational memory; typed `linked:` fields. |
| 6 | Networks grow; meanings not sharp | Yes | Append-only memory with supersession and decay. |
| 7 | Learning a word is rebuilding the thought | Partial | User wording is treated as hint; not documented (gap F); user-side rebuild not modelled (gap E). |
| — | Bridge-criterion enforced on concept promotion | No | Promotion criterion unspecified (gap C). |
| — | "Single-sided definition" critic | No | No such critic (gap B). |
| — | Bridge-typing measured on links | No | Link kinds exist; cross-realm classification does not (gap D). |

---

## Implication for the plan (no changes proposed here)

§12.13 is the chapter's coda and the closest §12 comes to a
*positive theory* of meaning. The plan already meets the structural
requirements: multi-channel frame matching, typed relational
memory, append-only growth, user-prose-as-hint. What it lacks is
the *naming* and *enforcement* layer: bridge-definitions as a
labelled shape, a single-sided-definition critic, a promotion
criterion that demands bridging, and link-kind classification
that distinguishes bridges from in-cluster ties.

Closing these gaps would touch the concept schema in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(bridge-definition shape, promotion criterion), the critic
catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(a one-sided-definition critic), the relational-memory protocol
in
[`THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/14-relational-memory.md)
(cross-realm link classification), and a single paragraph in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
documenting the user-prose-as-hint stance. These are
governance-shape changes, not edits to runnable code, and fall
under the stop-and-ask rules in [AGENTS.md](../../../AGENTS.md)
§12 and [CLAUDE.md](../../../CLAUDE.md). This file records the
analysis; it does not request the change.
