# Section 27.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-27.1.md](som-27.1.md) — *Demons*
(Minsky, §27.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§27.1 introduces Charniak's *demons*: silent recognition-agents
aroused by a phrase, which then lurk and watch for specific later
events. The section is short but seeds the whole chapter — every
suppressor, censor, and humor mechanism that follows is a special
kind of demon.

---

## The ideas Section 27.1 actually carries

1. **Demons are recognition-agents.** Their work is to *notice*, not
   to act.
2. **Demons are aroused by context.** A phrase about a gift wakes
   demons that watch for return, rejection, exchange.
3. **Demons lurk silently.** They consume no narrative attention until
   their pattern matches.
4. **Demons watch for *related* events, not just the original event.**
   The arousal forwards expectation across the predicate, not just
   onto the same noun.
5. **Comprehension is layered.** Some parts of a story are handled by
   isolated demons; others by larger scripts; others by micronemes.
   No single mechanism is enough.
6. **Arousal economics matter.** Too few demons leaves you slow; too
   many leaves you confused by false alarms. The *gain* of arousal is
   itself a design parameter.

---

## What the implementation already absorbs

### Demons as recognition-agents (ideas 1, 3)

The censor and critic manifests in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
declare an `activates_on` slot. An agency is silent until the trigger
matches; the file is loaded, the prompt is read, and the runner step
executes. The whole pipeline ([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is event-arrival-driven: perceive → activate. Activation is exactly
"a demon wakes when its pattern hits."

### Context-driven arousal (idea 2)

The activation phase reads the incoming signal and matches it against
the `activates_on` patterns. A signal carrying a particular
`event.type` (see
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
wakes the agencies whose patterns subscribe to that type — the
"phrase about a gift" analogue.

### Layered comprehension (idea 5)

The pipeline already has *several* recognition layers: perception
agencies, frames and polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
K-lines for recall, critics for evaluation. Different signals are
caught by different layers; there is no single "understander."

---

## What the implementation does not yet take into account

### A — Demons that *forward expectation* across a predicate

Idea 4 is the strongest one §27.1 carries. A gift-demon does not just
re-fire on the next gift mention; it watches for *return*,
*rejection*, *exchange*. The plan's `activates_on` is a flat pattern
match against the current signal, not a *time-extended subscription*
that says "having seen X, now watch for Y or Z." There is no
representation today of a demon that, once aroused, registers a new
listener for a *different* event type with bounded lifetime. This
would need an addition to the signal/handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md).

### B — Arousal gain and false-alarm economics (idea 6)

The manifest schema gives each agency a `budget` — token/time cost —
but it does not represent an *arousal threshold* or a *false-alarm
rate*. The plan cannot today answer "this demon fires too often;
raise its threshold" because there is no threshold slot. The
`evolution/reinforcement-log.md` referenced in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
records outcomes but does not feed back into a tunable parameter on
the demon.

### C — Lurking has no first-class representation

The plan's agencies are activated by an event and then return. They
do not *wait*. A demon that "lurks until something happens" would be
either a workflow waiting on a future event (Forgejo Actions has no
clean primitive for this within one settlement) or a registered
*pending watcher* persisted to memory. The latter shape is not yet
described in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).

---

## Summary table

| # | Idea from §27.1 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Demons are recognition-agents | Yes | `activates_on` + perception agencies. |
| 2 | Aroused by context | Yes | Signal-pattern matching at activation. |
| 3 | Lurk silently | Partial | Files are dormant until matched, but no persistent *watcher* abstraction exists (gap C). |
| 4 | Forward expectation across predicates | No | No time-extended subscription on a new event type (gap A). |
| 5 | Layered comprehension | Yes | Perception, frames, K-lines, critics each form a layer. |
| 6 | Arousal economics | Partial | `budget` exists; no threshold or false-alarm tuning (gap B). |

---

## Implication for the plan (no changes proposed here)

§27.1 is the seed of the censor chapter. The plan already treats
agencies as event-aroused recognisers, which is most of what
Charniak's demons need. The unforced gap is *predicate forwarding* —
the act of saying "now that gift was mentioned, watch for return" —
which would require either a `watch_for` slot on agency manifests or
a persisted-watcher abstraction in memory.

Any move to add this would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the signal/handoff schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the state model in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
