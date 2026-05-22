# Section 24.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-24.2.md](som-24.2.md) — *Frames of mind*
(Minsky, §24.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§24.2 is the structural definition of a frame: a skeleton of
*terminals* that come with *default assignments* already attached.
This is the section against which the plan's `frames/*.frame.yml`
schema must be measured most literally.

---

## The ideas Section 24.2 actually carries

1. **A frame is a skeleton of terminals (slots).** The frame's
   structure is its named blanks.
2. **Terminals can be attached to anything.** K-lines, polynemes,
   isonomes, memory-control scripts, other frames — the terminal is
   a typed connection point, not a typed payload.
3. **Default assignments are the normal state.** Terminals are
   *never* empty in practice; they always carry a pre-attached
   default that the situation may override.
4. **Defaults supply unseen parts.** When stimulus is incomplete
   (shoes on, feet unseen), the frame fills the missing terminal
   from default — and that filling is *cognitively visible*.
5. **Frames rarely fit perfectly; adaptation is a skill.** New
   situations require learned mechanisms for stretching a frame to
   fit.
6. **Competing frames may both arouse; one suppresses the rest.**
   Locking-in negotiations decide which frame influences other
   agencies, while the losers lurk offstage.

---

## What the implementation already absorbs

### Frame schema as terminal skeleton (ideas 1, 2)

The schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
gives every frame a `slots` map keyed by slot name. Each slot has a
`filled_by` list naming the agent-ids permitted to fill it. The
slot is exactly Minsky's *terminal*; `filled_by` is the typed
connection point. The same schema also lists `linked_klines` and
`linked_procedures`, so a slot or a frame may be connected to a
K-line or a procedural memory — Minsky's "virtually any kind of
agent can be attached to a frame-terminal."

### Required vs optional slots (idea 3, partial)

`slots.<name>.required: true|false` is the structural form of
*default assignment present*. A non-required slot can be left
unfilled; a required slot blocks settlement via
`failure_conditions`. The `code-change.frame.yml` example requires
`user_goal`, `relevant_files`, `proposed_patch`, `tests`, `risks`,
`final_user_response`.

### Competing frame match resolution (idea 6, partial)

The `activate` phase
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
selects *one* frame and writes `frame:` into the workspace. The
losers do not commit to the blackboard. This is the "locking-in"
result, though the mechanism by which one frame wins is not yet
fully specified beyond the `matches` block in the frame schema.

---

## What the implementation does not yet take into account

### A — `default_filled_by` is not in the schema

Idea 3 is the load-bearing one: terminals come *pre-attached*. The
plan's slot schema lists `filled_by` (a set of *permitted* fillers)
but has no `default_filled_by` (a *pre-attached* default agent or
literal that supplies the slot when no stimulus does). Today, a
slot left unfilled simply stays absent or blocks settlement; it
does not silently inherit a default. The "shoes therefore feet"
inference (idea 4) has no operational analogue.

### B — Default assumptions are not marked as such

Minsky stresses that defaults are *weakly held* and easily detached
when reality contradicts. The handoff/signal schemas
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
have a `confidence` field on claims, but the *source* of a slot's
fill (observed-from-stimulus vs filled-by-default) is not
distinguished. A reviewer cannot ask "which slots in this
settlement were filled by default, and how confidently?"

### C — Frame adaptation is not a named skill

Idea 5 names the learned skill of *stretching* a frame. The plan
has no analogue. A frame either matches or it does not; there is
no agency in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
whose job is to *adapt* the active frame's slot definitions to a
near-fit stimulus. The `novel.frame.yml` fallback is a different
mechanism — it covers *no* match, not *imperfect* match.

### D — Losing frames are dropped, not "lurking offstage"

Idea 6 explicitly preserves the runners-up so they may intervene
later. The plan's `activate` step records one chosen frame and
discards the rest. There is no representation of *secondary
frames* on the workspace, no place where a critic can later say
"reconsider — the suppressed `bug.frame.yml` candidate matches the
new evidence better than the chosen `feature.frame.yml`."

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Frame = terminal skeleton | Yes | `slots` map in `frame.schema.json`. |
| 2 | Terminals accept any agent | Yes | `filled_by` + `linked_klines` + `linked_procedures`. |
| 3 | Defaults are the normal state | Partial | `required` exists; `default_filled_by` does not (gap A). |
| 4 | Defaults fill the unseen | No | Slots cannot inherit pre-attached defaults (gap A); fill source not tracked (gap B). |
| 5 | Adaptation is a learned skill | No | No adaptation agency (gap C). |
| 6 | Losers lurk offstage | Partial | One frame wins; runners-up dropped (gap D). |

---

## Implication for the plan (no changes proposed here)

§24.2 puts the most pressure on a single missing schema field:
`default_filled_by`. Without it, the plan implements frames as
*templates* (slots wait for stimulus) rather than as *expectations*
(slots arrive already filled and are overridden by stimulus). The
gap is small in lines and large in meaning. Closing any of A–D
would touch the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and possibly the settlement and handoff schemas, and so falls under
the "stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
