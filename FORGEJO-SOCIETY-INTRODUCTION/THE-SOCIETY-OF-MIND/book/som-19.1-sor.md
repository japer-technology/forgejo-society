# Section 19.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-19.1.md](som-19.1.md) — *The roots of intention*
(Minsky, §19.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§19.1 opens *Words and Ideas* with a warning: the inner monologue is not
the thing it appears to be. Words have no meanings by themselves; their
function is **control** — each word makes various agents change what
various other agents do. The section then names the two mysteries — what
brings a word to mind, and what the word goes on to do — and concludes
that introspection cannot answer either.

---

## The ideas Section 19.1 actually carries

1. **Words have no intrinsic meaning.** They are "special sorts of
   marks or sounds." Meaning lives in the agents they activate, not
   in the symbol.
2. **A word's function is control, not denotation.** Each word makes
   *various agents change what various other agents do*. Language is
   a switching scheme, not a labelling scheme.
3. **The inner monologue is a fragment.** Thinking-in-words shows
   only a sliver of mental activity; most cognition runs silently.
4. **The origins of words are opaque to consciousness.** We cannot
   trace why a particular word arrived in mind at a particular
   moment.
5. **The destinations of words are equally opaque.** We cannot
   inspect the chain by which "It's time to go" reaches "Where is
   the door?"
6. **Emptiness is the source of versatility.** A word's lack of
   intrinsic content is exactly what lets many agencies pour
   different responses into it — *the less there is in a treasure
   chest, the more you'll be able to put in it.*

---

## What the implementation already absorbs

### Words as control, not denotation (ideas 1, 2)

The polyneme schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
is exactly Minsky's "control" picture. A polyneme entry has `excite:`
and `inhibit:` maps from a symbol to agency weights — the symbol does
nothing by itself; it only causes other agents to change what they do.
`label-polynemes.yml` and `phrase-polynemes.yml` are the seed
catalogues, and `directive.*` phrases (`society spock:`,
`society memory:`) are the most literal case: a word that is purely a
switch.

### Emptiness as versatility (idea 6)

The polyneme symbol carries no payload — it is just an id. Each agency
"learns" (in the first-ship case, is configured to) its own response.
The mapping in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
places polynemes at
`.forgejo-society/nemes/{path,label,phrase}-polynemes.yml` precisely as
shared, contentless tokens.

### Inner monologue as a fragment (idea 3)

The runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
distinguishes `state/.../signals.jsonl`, `blackboard.md`, and the
single text output produced by `agency.integration.conscious-presenter`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The visible response is structurally a fragment of the run: most of
the activity is in the structured state trees, not in the user-visible
text.

---

## What the implementation does not yet take into account

### A — No trace of *why this word arose*

Idea 4 (origins of words). The pipeline records *that* a polyneme
fired (via `activation.jsonl`) but does not record *why this symbol
rather than another* was selected by the perception phase. The
introspection slot `unknowns` in the settlement is the closest
existing surface, but it is filled by deliberation, not by
perception's own diary.

### B — No trace of *what the word went on to do*

Idea 5 (destinations of words). The plan logs the agencies a polyneme
excited, but there is no per-polyneme **outcome ledger** that says
"this symbol, over its lifetime, has reliably led to these
settlements." Credit assignment in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
operates at the agency level, not the polyneme level.

### C — Intention as a primitive is absent

The section's title — *the roots of intention* — flags intention as
the deeper question. The plan has signals, objections, candidate
actions, and budgets, all of which describe state. No manifest field
encodes a *wish*; no polyneme is typed as *intentional*. (Same
absence noted for §1.1 gap E.)

### D — The control / denotation distinction is not stated in the plan's prose

[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
describes polynemes mechanically but does not say, in its own voice,
that *meaning is absent from the symbol on purpose*. A reader could
mistake the `symbol:` field for a denotational tag. The thesis of
§19.1 — emptiness as a feature — is not surfaced.

---

## Summary table

| # | Idea from §19.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Words have no intrinsic meaning | Yes | Polyneme schema: symbol is an id, payload lives in `excite`/`inhibit`. |
| 2 | A word's function is control | Yes | `excite:` / `inhibit:` maps; `directive.*` phrases. |
| 3 | Inner monologue is a fragment | Yes | Single-narrator rule; structured `state/` vs visible text. |
| 4 | Origins of words are opaque | Partial | Activation is logged; *why this polyneme* is not (gap A). |
| 5 | Destinations of words are opaque | Partial | Per-agency outcomes exist; per-polyneme outcomes do not (gap B). |
| 6 | Emptiness is the source of versatility | Yes | Polyneme symbol carries no payload (gap D for the prose). |
| — | Intention as a primitive | No | No `wish` / `goal` field (gap C). |

---

## Implication for the plan (no changes proposed here)

§19.1 is one of the sections the implementation already speaks the
language of: polynemes-as-switches is the single closest match between
*Society of Mind* and the plan. The absorbed ideas are absorbed
correctly. The open gaps are: a perception-side diary of *why this
symbol*, a polyneme-level outcome ledger, an explicit intention
primitive, and a prose statement that "emptiness is the point" inside
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md).
None of these are changes proposed here; closing any of them would
touch the polyneme schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the credit-assignment runtime in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
