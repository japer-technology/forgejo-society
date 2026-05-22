# Section 19.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-19.2.md](som-19.2.md) — *The language-agency*
(Minsky, §19.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§19.2 proposes that language is itself an *agency* — and one with a
peculiar capacity to control its own memory. Minsky divides it into
three regions: word-handlers on top, the wider mental processes below,
and a middle layer that couples words to recollections and
expectations.

---

## The ideas Section 19.2 actually carries

1. **Language is an agency, not a separate module.** It sits next to
   perception, memory, and the rest, with its own internal structure.
2. **Three regions.** Upper: agents concerned with words. Middle:
   agents that couple words to recollections and expectations.
   Lower: agencies affected by words.
3. **Language is not all of thought.** "We sometimes seem to think in
   words — and sometimes not." A theory must account for both.
4. **Word-machinery may be shared between speaking and hearing.** The
   plan-of-mind question — one machine or two — is left open.
5. **Self-control over memory.** The language-agency has unusual
   power over the memory-systems of other agencies, *as if it could
   exploit itself as just another agency*.

---

## What the implementation already absorbs

### Language as one agency among many (idea 1)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
treats `perception`, `memory`, `code`, `safety`, `identity`,
`integration`, `assembly`, and `meta-admin` as the first-ship
families. Language work falls partly into `perception` (phrase
polynemes), partly into `integration` (the conscious presenter), and
partly into `identity` (`agency.identity.tone-stabilizer`). Language
is *not* privileged as a separate top-level concept — exactly the
move Minsky is making.

### Three regions, loosely (idea 2)

A rough mapping of Minsky's three regions onto the plan:

- **Upper (word-handlers):** `phrase-polynemes.yml` and
  `agency.perception.intake-bee`, which classify and route incoming
  text ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
  [`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
- **Middle (coupling to recollection):** the `activate` phase,
  K-line retrieval (`agency.memory.kline-retriever`), and prior-
  decision resonance
  ([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
  [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
- **Lower (agencies affected by words):** every other family that
  fires on a polyneme — code, safety, identity, memory.

### Self-control over memory (idea 5)

`agency.integration.archivist` and the `remember` phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
let one agency — itself written in language — decide what is promoted
from `state/` to `memory/`. The conscious-presenter's text becomes
the canonical record. In that narrow sense, the language-handling part
of the society does exploit itself as just another agency.

---

## What the implementation does not yet take into account

### A — No explicit "language-agency"

Idea 1 is honoured in spirit but the plan has no single referent
called "the language-agency." Phrase polynemes live in
`.forgejo-society/nemes/`, presentation lives in
`agencies/integration/`, and tone in `agencies/identity/`. Tracing the
full path "stimulus text → polyneme → frame → settlement → presenter
text" requires reading several documents. Minsky's framing as a *named
agency* is not made explicit.

### B — Speaking and hearing are not distinguished

Idea 4 is left open in the plan, but in the opposite direction from
Minsky's question. The runtime has one phrase-polyneme catalogue used
for *incoming* text; the presenter generates *outgoing* text via an
LLM prompt assembled in `agency.integration.conscious-presenter`. The
two pipelines are wholly different *kinds* of mechanism, but the plan
does not say so anywhere. The "one machine or two" question is
implicitly answered "two, and they share nothing."

### C — Thought that is not in words is not represented

Idea 3. All inter-agency communication in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
is JSONL records with named string fields. There is no notion of a
non-verbal signal — e.g. a vector, a configuration, a remembered
activation pattern — that has not yet been described in words. The
plan's substrate is verbal end-to-end, which is the opposite of
§19.2's claim that language is only *part* of thought.

### D — The middle region is implied, not named

Idea 2's middle layer (coupling words to recollections and
expectations) is exactly what frames + K-lines + polyneme excitation
do — but no document calls it a "middle region" or treats it as a
unit. The `activate` phase is the closest operational surface.

---

## Summary table

| # | Idea from §19.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Language as one agency among many | Partial | Honoured by family taxonomy; no single "language-agency" named (gap A). |
| 2 | Three regions (word / coupling / affected) | Partial | Mappable to polynemes / activate / other families; middle is unnamed (gap D). |
| 3 | Thought is not all in words | No | All signals are verbal/JSON (gap C). |
| 4 | Speaking vs hearing as plan-of-mind question | No | Implicitly two unrelated pipelines (gap B). |
| 5 | Self-control over memory | Yes | Archivist + `remember` phase; presenter is itself language. |

---

## Implication for the plan (no changes proposed here)

§19.2's framing of language as *an* agency — neither central nor
peripheral — is the same architectural move the plan already makes by
refusing to privilege any family. The two structural gaps that
register most cleanly are the absence of any non-verbal signal type
(gap C) and the un-named middle region (gap D). Either would touch
the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and the framing prose in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and any move to introduce a "language-agency" first-class concept
would also touch the family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
