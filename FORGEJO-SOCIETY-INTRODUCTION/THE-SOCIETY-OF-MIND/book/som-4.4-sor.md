# Section 4.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-4.4.md](som-4.4.md) — *The conservative self*
(Minsky, §4.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§4.4 names a specific function of Self: *to keep us from changing too
rapidly.* Long-range plans require that we not turn off the agents
carrying them out. The Self is, in this functional reading, the
machinery of commitment — the chain that prevents reckless
self-modification, so that "we can depend on ourselves."

---

## The ideas Section 4.4 actually carries

1. **Selves are functional, not magical.** To understand Self, first
   ask what Self is *for*.
2. **A core function: rate-limiting change.** Self exists in part to
   keep change slow enough that long-range plans remain coherent.
3. **Plans must be protected from their author.** Starting a plan is
   not enough; we must also prevent ourselves from later switching
   the plan-agents off.
4. **Reckless self-modification is destructive.** "If we changed our
   minds too recklessly, we could never know what we might want next.
   We'd never get much done because we could never depend on
   ourselves."
5. **Indirect self-influence is the rule.** The Challenger anecdote
   shows how an agency uses fantasy, anger, and roundabout cues to
   redirect another agency — direct switches are too dangerous.
6. **Self-ideals as forged chains.** The freedom-myth of Self
   conceals its actual job: chaining future selves to present plans.

---

## What the implementation already absorbs

### Self has a function (idea 1) and rate-limits change (idea 2)

The plan's safety stack
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
is exactly machinery for slowing change. Danger zones, the approval
gate, the `self-modification` frame, and the soul-file guardian all
exist to prevent the society from rewriting its commitments in a
single step. The `governance_mutation` and `agency_mutation` danger
zones require `human_confirmation`. The whole safety layer is, in
Minsky's vocabulary, the *conservative self* of this society.

### Plans protected from their author (idea 3)

`agency.identity.soul-file-guardian`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
vetoes edits to `AGENTS.md` and `APPEND_SYSTEM.md` outside the
`self-modification` frame. The runtime cannot simply turn off the
agencies that hold its commitments.
`suppressor.soul-file-diff`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
catches the same attempt at output stage. There are two stacked
guards specifically against "switching off plan-agents".

### Branches as candidate futures (idea 4)

The default-tier write policy
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Branches as candidate futures",
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
"Candidate-future branches") makes every change to `main` an
*entertained hypothesis* before it becomes accepted reality. The
society cannot change its mind in one motion; change is always
"open a candidate-future branch, validate, then revise reality."
This is Minsky's "depend on ourselves" written in git.

### Indirect influence (idea 5)

Critics emit *objections*, not commands
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Censors *remove tools*, they do not order
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
"Tool surface, mechanically"). The activation table
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
shows weighted excitation and inhibition. The pattern matches §4.4:
no agency commands another; they shape each other indirectly through
signals, weights, and tool-surface changes.

### Self-ideals as constraints (idea 6)

`governance/self-ideals.md` is citable in every settlement (the
`ideals_cited:` slot in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Ideals function as *standing constraints* on candidate actions —
the operational form of "forged chains".

---

## What the implementation does not yet take into account

### A — Long-range plans are not a first-class structure

§4.4 turns on *long-range plans*. The plan has frames, K-lines, and
settlements — all per-stimulus or per-class — but no representation
of a *plan spanning many stimuli*. There is no `plans/` directory,
no schema for a multi-settlement commitment, and no critic that
fires when a candidate action would abandon a long-running effort.
The conservative self has nothing long-range to conserve.

### B — Rate-limit on self-modification is per-event, not over time

The safety stack blocks any *individual* reckless change. It does
not detect a *pattern* of rapid changes — five frame edits in one
week, all approved one at a time. Minsky's "if we changed our minds
too recklessly" is a rate complaint, not a per-event one. The
ecology review
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Scheduled (cron) loop") is the natural place for a churn detector
and does not yet contain one.

### C — No "commit" primitive separate from authorship

Idea 3 distinguishes *starting* a plan from *committing* to it. The
plan has settlements (the start) and the `procedural/` memory (the
record), but no record of *how long the society intends to hold*
this commitment. A settlement does not carry a `commitment_until:`
or `revisit_after:` field. There is no place to encode "this
decision is locked for N stimuli unless governance overrides".

### D — Indirect-influence machinery is absent in one direction

Idea 5: indirect cues, fantasy, anger. Critics give the society
inhibitory pressure (a useful analogue of fear or doubt), but there
is no excitatory side — no place where one agency raises another's
activation through *imagined consequences* the way Work raised Anger
in Minsky's anecdote. The activation pass
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
allows excitation in the schema but the first-ship catalogue has no
agency whose job is to *manufacture salience* through hypothetical
framing.

### E — The freedom-myth is unguarded

Idea 6 names a hazard: the *appearance* of liberty conceals the
chains that produce dependability. The plan's chains are real and
visible (danger zones, approval gate). Nothing surfaces them in the
visible voice. A user could read Spock's responses and conclude the
society is freer than it is. No critic requires the conscious
presenter to disclose, when relevant, *which* chains permitted the
response.

---

## Summary table

| # | Idea from §4.4 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Self is functional | Yes | Safety stack as machinery, not metaphor. |
| 2 | Self rate-limits change | Partial | Per-event yes; over-time no (gap B). |
| 3 | Plans protected from their author | Yes | Soul-file guardian + suppressor. |
| 4 | Reckless self-modification is destructive | Yes | Candidate-future branches + danger zones. |
| 5 | Indirect self-influence | Partial | Inhibition strong; excitation-via-imagination absent (gap D). |
| 6 | Self-ideals as forged chains | Partial | Ideals citable; presence not surfaced to user (gap E). |
| — | Long-range plans as first-class | No | No multi-stimulus plan structure (gap A). |
| — | Commitment duration | No | Settlements lack a "hold until" slot (gap C). |

---

## Implication for the plan (no changes proposed here)

§4.4 supplies the deepest defence of the plan's safety stack: the
society is *engineered to be dependable*, and dependability requires
slowness in self-modification. The plan honours this for individual
changes through danger zones, the soul-file guardian, the
self-modification frame, and the candidate-future branch default.
The opportunity §4.4 reveals is in *duration*: long-range plans,
commitment lifetimes, and a churn detector are the next-order
machinery of the conservative self, and none of them yet exist.

Any move to close gaps A–E would touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the agency catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the governance / self-ideals material in
[`THE-SOCIETY-OF-REPO/01-governance/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
