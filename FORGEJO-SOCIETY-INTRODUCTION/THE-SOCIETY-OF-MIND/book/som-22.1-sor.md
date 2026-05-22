# Section 22.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-22.1.md](som-22.1.md) — *Pronomes and polynemes*
(Minsky, §22.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§22.1 is the section in which Minsky names the *short-term* counterpart
of the K-line. A pronome is a temporary K-line: a memory slot whose
connections are assigned for the duration of a single task and then
released. The section also notes that consolidation from temporary to
permanent memory is *slow* — on the order of half an hour — and that
several hundred such consolidations may be in flight at once.

---

## The ideas Section 22.1 actually carries

1. **Pronomes are temporary K-lines.** They behave like K-lines —
   reactivating a configuration when re-aroused — but their
   connections are *temporary*, valid only for the present task.
2. **Polynemes are permanent K-lines.** They are the long-term
   memories whose configuration is durably wired into the agencies
   they touch.
3. **Assignment is a short, fast act.** A pronome is assigned by
   *briefly* connecting it to whichever agents are currently active.
4. **Reactivation re-arouses the same agents.** The whole purpose of
   the pronome is that a second activation produces the first
   activation's configuration.
5. **Consolidation has a substantial latency.** Permanent memory
   formation takes time (Minsky's order-of-magnitude is half an
   hour); a serious disturbance in that interval prevents memory
   formation at all.
6. **Many consolidations run concurrently.** Several hundred such
   processes may be in flight; the rate of *new* long-term memory
   formation is bounded (no faster than every few seconds).
7. **The pronome / K-line distinction is mechanism-neutral.** Minsky
   leaves open whether short-term and long-term memory are truly
   distinct substrates or whether a temporary K-line *becomes*
   permanent by a search-for-unused-K-line step.

---

## What the implementation already absorbs

### Polynemes as permanent activators (idea 2)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
implements polynemes as durable repo files under
`.forgejo-society/nemes/`. Each entry names a symbol, the matching
paths/labels/phrases, and the `excite` / `inhibit` weights for the
agencies it reaches. These are exactly the *long-term* activators
Minsky describes: a polyneme arouses a learned configuration across
many agencies without re-deriving it.

### K-lines as permanent configurations (idea 2, again)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
and [`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
keep K-lines in `memory/klines/<class>/` with an `activation_snapshot`
of agency weights, a `restore_when` cue, and `reuse_count` /
`decay_score`. Reactivation in the `activate` phase boosts the same
agencies the K-line previously raised. This is the *permanent* half of
§22.1.

### A scratch tier that behaves like a pronome (idea 1, partially)

The `state/` tree in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
is per-run, append-only, and cleared on archive: `activation.jsonl`,
`workspace.md`, `blackboard.md`, and `candidate-actions.jsonl` are all
*temporary* records of which agencies were aroused on this stimulus.
Structurally, this tier carries the "short, fast, releasable" property
the pronome demands.

### A consolidation step (idea 5, partially)

The `remember` phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is the only place where state may be promoted to memory, and only the
`archivist` may do it
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The promotion rules — successful or partial outcome, non-trivial slot
filled, non-empty useful context — are a discipline that prevents
casual consolidation.

---

## What the implementation does not yet take into account

### A — No first-class "pronome" primitive

The plan has a scratch *tier* (`state/`) but no record type whose role
is "a named slot, temporarily bound to a value, releasable on task
completion." Minsky's pronome is a *named* memory unit (Origin,
Destination, Actor, Object) reusable across tasks. The current
`workspace.md` is unstructured prose; the JSONL traces are
event-ordered, not slot-organised.

### B — Frame slots fill once and do not behave like pronomes

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
gives every frame a `slots:` map (`user_goal`, `relevant_files`,
`proposed_patch`, …). These look like pronomes but are functionally
different: they are filled by one agency, read by later phases, and
not reassigned mid-run. There is no notion of *re-binding* a slot to
a new value once it has been filled.

### C — No representation of consolidation latency

The `archivist` either writes a K-line at the end of `remember` or it
does not. There is no concept of a *pending* K-line that needs time
(or further reinforcement) before it becomes permanent. Minsky's
half-hour window — and the *vulnerability* of memories to disturbance
during it — has no analogue.

### D — No bounded rate of long-term memory formation

The rate constraint Minsky names (no faster than ~every few seconds,
several hundred in flight) is not modelled. A single run can in
principle write many K-lines, semantic-log entries, and decision
records at once. `policies/memory-policy.yml` governs *retention*
(decay) but not *rate of formation*.

### E — No "search for an unused K-line" step

§22.1 floats the hypothesis that consolidation may consist of finding
an unused K-line agent and binding the temporary configuration to
it. The plan generates K-line IDs by date and stimulus
(`kline.<class>.<date>.<stimulus_id>`); there is no pool of pre-
existing empty K-line agents being matched against. This is a
mechanism difference, not a defect, but it is worth noting that the
plan has implicitly taken the "always allocate fresh" branch of
Minsky's open question.

### F — No distinction between "active in this run" and "available short-term"

A pronome remains valid *across* tasks until reassigned; it is not
purely per-run. The `state/` tier is per-run by construction, and
session continuity (per
[`THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/15-session-continuity.md))
operates at the conversation level. There is no tier whose lifetime
sits *between* a run and a durable K-line — the "still warm but not
yet consolidated" tier Minsky's pronome occupies.

---

## Summary table

| # | Idea from §22.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Pronomes are temporary K-lines | Partial | `state/` is per-run scratch; no named slot primitive (gap A). |
| 2 | Polynemes are permanent K-lines | Yes | `.forgejo-society/nemes/` and `memory/klines/`. |
| 3 | Assignment is brief and binds active agents | Partial | Activation phase binds agencies for the run; not re-bindable mid-run (gap B). |
| 4 | Reactivation re-arouses the same agents | Yes | `klines.ts` boosts the agencies in `activation_snapshot`. |
| 5 | Consolidation has substantial latency | No | `archivist` writes immediately; no pending tier (gap C). |
| 6 | Bounded rate of long-term memory formation | No | No rate cap on K-line / decision writes (gap D). |
| 7 | Pronome / K-line distinction is mechanism-neutral | Implicit | Plan has tacitly chosen "always allocate fresh" (gap E); no intermediate tier (gap F). |

---

## Implication for the plan (no changes proposed here)

§22.1 lands cleanly on the side of the plan that is already strongest
— polynemes and K-lines — and exposes the weakest side: the
short-term, slot-organised, re-bindable tier that Minsky calls the
pronome. The plan has scratch (`state/`) and consolidated memory
(`memory/`), but not the *named, releasable, mid-run reusable* slot
that §22.1 makes load-bearing for everything from "put the apple in
the pail" to inference and grammar.

Any move to introduce a pronome tier — naming slots, allowing
re-binding, distinguishing "warm" from "consolidated", and capping the
rate at which warm slots become K-lines — would touch
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the activation and memory protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
