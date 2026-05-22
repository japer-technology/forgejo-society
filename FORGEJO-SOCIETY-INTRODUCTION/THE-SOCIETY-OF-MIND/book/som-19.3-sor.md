# Section 19.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-19.3.md](som-19.3.md) — *Words and ideas*
(Minsky, §19.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§19.3 is where Minsky introduces the two language-agent kinds that the
rest of the chapter develops: **polynemes** (long-term, broadcasting
the same signal that different agencies have learned different
responses to) and **isonomes** (controlling a *short-term* memory in
each of many agencies — e.g. the pronoun *it*).

---

## The ideas Section 19.3 actually carries

1. **Language and thought are not separable.** Studying syntax,
   grammar, and semantics in isolation loses what was never apart.
2. **The right questions are not "what is language?" but "how are
   words involved with mental processes?" and "how does language
   enable people to communicate?"**
3. **Polynemes:** broadcast a simple signal; each receiving agency
   has *learned for itself* what to do with it. A polyneme "knows
   nothing whatever about" its referent — it is a switch.
4. **Polynemes are a type of K-line.** They activate by reactivating
   prior configurations across many agencies.
5. **Isonomes:** control a *short-term* memory in each of many
   agencies. Pronouns like *it* carry no fixed content; they steer
   what agencies do with their most recent contents.
6. **The same agency receives both kinds.** A word like *apple*
   reaches color, shape, taste, size etc. via a polyneme; the next
   sentence's *it* reaches the same agencies via an isonome.

---

## What the implementation already absorbs

### Polynemes as switches (idea 3)

Exactly as Minsky describes: a polyneme entry in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
has `symbol:` (the contentless id), `excite:` / `inhibit:` maps (the
broadcast), and `match:` (what triggers it). The symbol carries no
semantics; the receiving agency carries the response. The first-ship
catalogues — `path-polynemes.yml`, `label-polynemes.yml`,
`phrase-polynemes.yml` — illustrate the same shape across three
sources of stimulus.

### Polynemes as kin to K-lines (idea 4)

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
makes the relationship operational: polynemes "wake agencies and bias
frame selection (cheap, immediate)"; K-lines "reactivate prior winning
configurations (experiential)." The K-line schema's
`activation_snapshot.active_agencies` is an explicit weight map,
mirroring how Minsky frames a polyneme as a K-line-shaped object.

### Language is not separable (ideas 1, 2)

There is no `language/` agency family. Language enters via
`perception` (phrase polynemes), exits via `integration` (conscious
presenter), and is judged by `identity` (tone, soul-file guardian).
The plan answers Minsky's *how is language involved with mental
processes?* operationally — language is everywhere a frame can
match — without ever treating it as a study of its own.

---

## What the implementation does not yet take into account

### A — Isonomes are absent

Ideas 5 and 6. The plan has nothing that does the work of an isonome.
Phrase polynemes match fixed strings; there is no schema for a token
that, instead of broadcasting a *meaning*, broadcasts a *steering
instruction over recent agency state* — e.g. "the thing we were just
discussing." `agency.identity.user-model-keeper` tracks dialogue
context but is a single agent, not a per-agency short-term-memory
controller. Pronoun-resolution, *it*, *that one*, *the same problem*
have no first-class representation.

### B — No short-term agency-local memory

Even if an isonome existed, there is nothing for it to steer.
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
distinguishes `state/` (per-run, append-only) and `memory/` (durable,
governed). There is no notion of an agency carrying its own short-term
buffer across stimuli within a session that an isonome could address.

### C — Polynemes do not yet *learn* their excite-maps

Idea 3 says "each of those agencies must already have learned its own
response." In the first-ship catalogues the maps are hand-authored.
There is no learning loop that updates `excite:` / `inhibit:` weights
from outcome statistics. (Same family of gap as §1.1 gap D — change
mechanisms exist, learning loops do not.)

### D — The plan's prose does not articulate the polyneme / isonome
distinction

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
describes polynemes thoroughly but never names isonomes or the
short-term-vs-long-term axis Minsky uses. A reader of the plan would
not know the second kind of language-agent exists.

---

## Summary table

| # | Idea from §19.3 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Language and thought are not separable | Yes | No `language/` family; language enters and exits across families. |
| 2 | Right questions are operational | Yes | The pipeline answers "how is language involved" by being a pipeline. |
| 3 | Polynemes as content-free switches | Yes | Polyneme schema; `directive.*` phrases. |
| 4 | Polynemes are a type of K-line | Yes | K-line `activation_snapshot` mirrors polyneme excite-map. |
| 5 | Isonomes (short-term steering) | No | No isonome schema (gap A). |
| 6 | Same agency receives both | No | Cannot, without (5). |
| — | Polynemes learned, not authored | Partial | First-ship hand-authored; no learning loop (gap C). |

---

## Implication for the plan (no changes proposed here)

§19.3 is the section where the plan's polyneme work is most clearly
*Minsky's polyneme*; the absorption is high-fidelity. The corresponding
absence is the isonome — and the absence is structural, not cosmetic.
There is no short-term, per-agency buffer in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
for an isonome to steer, and no schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
to declare one. Any move to add isonomes would touch the memory layer,
the polyneme schema, the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
