# Section 7.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-7.9.md](som-7.9.md) — *Intentions* (Minsky,
§7.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§7.9 turns §7.8's difference-engine into a deflationary account of
*intention*. A ball rolling downhill avoids obstacles but only an
observer attributes goals to it. Builder rebuilds towers but only
because it persists *and* contains an image of what a tower is. The
question "does the engine *really* want?" is dismissed as a
distinction with no operational difference. Goal-talk is licensed
as *useful description*, not as a metaphysical claim.

---

## The ideas Section 7.9 actually carries

1. **Intention is observer-attributed.** A rolling ball has no goal;
   the impression of goal lives in the watcher.
2. **Persistence alone is not enough.** A persistent system without
   an image of where it wants to go is not yet goal-driven.
3. **An image of the desired outcome is the second ingredient.**
   Without it, persistence is mere repetition.
4. **The difference-engine fuses both ingredients.** It both
   *represents* an outcome and *acts persistently* to reach it.
5. **"Really wants?" is the wrong question.** Word-policing about
   wanting is a category error; words should be tools.
6. **Goal-talk has practical value.** Saying "the engine has a
   goal" replaces a long mechanical description with a short
   purposive one — and earns its keep that way.
7. **Goal-talk does not exhaust human wanting.** Many ways of
   wanting are not captured by the difference-engine; no single
   scheme covers them.

---

## What the implementation already absorbs

### The observer half of attribution (idea 1)

The plan's *conscious presenter*
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is the named place where attribution happens. The presenter
narrates the settlement and is *permitted* to describe it in
purposive language ("the society decided to …", "this critic
objected because …") without that language being treated as a
metaphysical claim. The voice rules in
[AGENTS.md](../../../AGENTS.md) keep this disciplined: purposive
verbs are allowed; consciousness-claims are not.

### Persistence (idea 2)

The cycle loop, the critic-objection round, and the unresolved-
objection slot in the settlement
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
implement the persistence half of §7.9. A proposal that is rejected
can be reshaped; a settlement that defers an item is, in effect,
asking a future cycle to keep trying.

### Goal-talk as useful description, not claim (idea 6)

The plan already speaks of agencies "trying", "proposing", and
"objecting" in its prose surfaces, and the introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
treats those verbs as shorthand for file-and-step combinations.
Minsky's licence — purposive description is fine as long as the
mechanism is recoverable — is the discipline the plan already
applies.

### Refusal to over-claim (ideas 5, 7)

[AGENTS.md](../../../AGENTS.md) §4 forbids the words that would
turn description into metaphysics ("AGI", "AI brain", "autonomous
developer"). This is, in operational form, Minsky's "words should
be our servants, not our masters". The plan refuses both directions
of error: it does not deny purposive description, and it does not
inflate it into a claim about wanting.

---

## What the implementation does not yet take into account

### A — The image of the desired outcome is still missing

Idea 3 is the load-bearing complement to §7.8 gap A. The plan has
persistence (yes) and purposive narration (yes) but no *image*
against which persistence can be evaluated. A frame's `slots` and
`failure_conditions`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
describe *what must be true to settle*, but a *desired outcome* —
the equivalent of Builder's representation of a tower — is not
declared. The plan therefore matches Minsky's rolling ball more
than his Builder: it persists, but it does not know where it is
trying to go.

### B — Persistence without image is still persistence

Idea 2's warning bites the plan twice. Without an image (gap A),
the persistence the cycle loop provides is structurally
indistinguishable from repetition. The plan has no slot saying
"this cycle is the *N*th attempt at the same underlying goal"; the
settlement can record an objection as unresolved, but cannot mark
it as *part of an ongoing pursuit*.

### C — Goal-talk is allowed in narrative, not licensed in schema

Idea 6 permits — even encourages — purposive description as a
*shorthand for mechanism*. The plan's presenter uses such
shorthand in narrative, but no schema field captures it
structurally. No `pursued_goal:` field on a settlement, no
`abandoned_goal:` field, no `restated_goal:`. A reviewer reading
the JSONL logs cannot reconstruct the purposive layer that the
presenter writes in prose
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The disciplined goal-talk Minsky permits is half-installed.

### D — No defence against attributing goals to incidents

Idea 1's other half — the *observer* attributes goals where there
are none — is the §7.9 risk a careful implementation should guard
against. The presenter is *not* warned about over-attribution. A
narration that says "the censor wanted to block this" is no
different in tone from "the cycle wanted to settle"; both are
licensed as shorthand, but the second is closer to the rolling-
ball error. No rule in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
asks the presenter to mark when goal-language is shorthand for a
single mechanism versus shorthand for a composite.

### E — Many ways of wanting (idea 7) are not catalogued

Idea 7 admits that the difference-engine does not cover all of
"wanting". The plan also has only one purposive shape — the cycle
+ frame + settlement chain — and offers no other ways. There is
no analogue for *standing intention* (a stable, low-priority pull),
*conditional intention* (only-if), or *aversion* (a goal of
non-arrival). The implementation has the simplest §7.8 engine and
no more.

---

## Summary table

| # | Idea from §7.9 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Intention is observer-attributed | Partial | Presenter is the attributor; no anti-over-attribution rule (gap D). |
| 2 | Persistence alone is not enough | Partial | Persistence present; image absent (gap A). |
| 3 | An image of desired outcome | No | No `desired:` slot (gap A). |
| 4 | Difference-engine fuses image + persistence | Partial | Plan has the persistence half only. |
| 5 | "Really wants?" is the wrong question | Yes | Voice rules disallow metaphysical claims. |
| 6 | Goal-talk is useful description | Partial | Allowed in narrative; not captured in schema (gap C). |
| 7 | Goal-talk does not exhaust human wanting | n/a | Only one purposive shape implemented (gap E). |

---

## Implication for the plan (no changes proposed here)

§7.9 makes the deflationary case the plan already lives by — goals
are descriptive shorthand for mechanisms — and the plan honours
that case on the narrative side. What is missing is the structural
side: the image of the desired outcome that turns persistence into
pursuit, a schema slot that captures purposive descriptions
alongside the prose, an anti-over-attribution rule for the
presenter, and additional shapes of wanting beyond the basic
difference-engine. Together with §7.8 gap A, this is the largest
single conceptual absence in the plan as it currently stands.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the handoff and signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and possibly the identity protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
