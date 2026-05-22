# Section 24.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-24.3.md](som-24.3.md) — *How Trans-frames work*
(Minsky, §24.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§24.3 collapses a frame into its smallest possible mechanism: a bag
of AND-agents, each gated by the conjunction of (frame active) AND
(pronome active). This is the section that pins frames to a
specific computational shape.

---

## The ideas Section 24.3 actually carries

1. **A frame's behaviour is conjunction.** Each terminal is an
   AND-agent over (frame-active, pronome-active).
2. **Pronomes are the addressing layer.** Pronomes (Origin,
   Destination, Vehicle, …) are role-typed *handles* that select
   which terminal of the active frame to fill.
3. **A whole frame is a collection of identical primitives.** No
   special machinery per slot; just AND-agents and K-lines.
4. **Terminals learn by being initially virgin K-lines.** A new
   frame's slots are "blank K-lines"; what they come to mean is
   whatever they record across uses.
5. **Few ingredients suffice.** Minsky underlines the engineering
   point: this entire structure is built from one or two part-types.

---

## What the implementation already absorbs

### Frame + slot as gated activation (idea 1)

The `activate` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
gates agency response on *both* the selected frame and the matching
signals. An agency's manifest declares `activates_on.signals` *and*
optionally `activates_on.frames`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
This is exactly the AND-shape Minsky names: the agent fires when its
expected signal arrives *and* its frame is active.

### Few ingredients across the surface (idea 5)

[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)'s
collapse rule — *file under `.forgejo-society/` or step in the
workflow* — is the operational form of Minsky's minimalism. The
manifest schema, signal schema, handoff schema, and frame schema
together cover the whole runtime in a handful of repeated parts.

### K-line as the recordable substrate (idea 4)

The K-line schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
gives every K-line `cue`, `activation_snapshot`, and `restore_when`
fields. A new K-line file is exactly Minsky's "virgin K-line": it
records what it observes the first time and reactivates on
similarity afterwards.

---

## What the implementation does not yet take into account

### A — Pronomes are not a first-class structure

The most direct gap. The polyneme layer
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
covers *symbol-like activators* — path-polynemes, label-polynemes,
phrase-polynemes — but the plan has no **pronome** layer: no
role-typed handle by which an active frame picks which terminal to
fill. The frame schema's `slots.<name>` is named directly rather
than addressed by a separate pronome-id. The mapping table in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
does not list a `pronomes/` directory.

### B — Trans-frame as a category is absent

Minsky's Trans-frame (the action-with-origin-destination-vehicle
shape) is the chapter's worked example. The first-ship frame
catalogue contains situation-frames (`question`, `bug`, `feature`,
`code-change`, `security-sensitive`, `self-modification`,
`novel`) but no action-frame whose slot names are roles in a
transition. The `code-change.frame.yml` slot list (`user_goal`,
`proposed_patch`, `tests`, `risks`) is *narrative*, not
*transitional*.

### C — Slots have no AND-evidence requirement

Idea 1 says a slot fires on *two* inputs. In the plan, a slot is
considered filled when *any* permitted agent supplies it; there is
no schema field that requires the slot to be witnessed by both
frame-context and a specific signal before it counts. The `signals`
schema demands `evidence` to be non-empty
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
which is the right spirit, but the requirement is per-signal, not
per-slot.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Terminal = AND of frame + pronome | Partial | `activates_on.frames` + `activates_on.signals` AND; pronome dimension absent (gap A). |
| 2 | Pronomes as addressing layer | No | No pronome catalogue or schema (gap A). |
| 3 | Frame = collection of identical primitives | Yes | `slots` map is uniform; agents share one manifest schema. |
| 4 | Virgin K-lines as initial fillers | Yes | K-line schema supports first-use capture. |
| 5 | Few ingredients suffice | Yes | Collapse rule + small schema set. |
| 6 | Trans-frame as a worked shape | No | No action/transition frame in first-ship catalogue (gap B). |

---

## Implication for the plan (no changes proposed here)

§24.3 names a layer the plan does not have: pronomes. The polyneme
layer is named after Minsky and styled after his vocabulary, but it
covers *poly*-nemes (one-to-many symbol activators), not pro-nemes
(role-typed terminal addressers). Closing this would mean adding a
`nemes/pronomes.yml`-style catalogue, a pronome field on slot
schemas, and an addressing rule in the activation protocol. It
would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and possibly the frame and signal schemas, and so falls under the
"stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
