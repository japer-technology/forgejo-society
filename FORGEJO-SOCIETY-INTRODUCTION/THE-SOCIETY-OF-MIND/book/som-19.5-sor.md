# Section 19.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-19.5.md](som-19.5.md) — *Polynemes*
(Minsky, §19.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§19.5 is the formal introduction of the polyneme as a primitive. Its
load-bearing claim is that *each receiving agency must have its
private dictionary* — a local memorizer that turns the broadcast
signal into an agency-appropriate partial state. Memories are stored
*close to where they are used.*

---

## The ideas Section 19.5 actually carries

1. **A polyneme is one agent broadcasting to many.** Different
   effects on different receivers.
2. **Each receiver must learn its own response.** Diversity is on
   the listener's side, not the speaker's.
3. **Per-agency dictionaries / memory banks.** Each agency has its
   private mapping from polyneme symbol to local response.
4. **K-lines as the local memorizers.** A "little memorizer" of
   K-lines next to each receiving agency mediates the response.
5. **Memories stored close to where they are used.** Locality
   principle.
6. **Meaning needs context.** No schema for polyneme meaning will
   be adequate by itself.

---

## What the implementation already absorbs

### Polyneme as one-to-many broadcaster (idea 1)

The `excite:` and `inhibit:` maps in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are exactly the one-to-many topology. Each entry names a single
`symbol:` and many `<agent-id>: <weight>` pairs.

### Different effect per receiver (idea 2)

Each agency manifest in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
declares its own `activates_on.signals` list and its own prompt body.
The polyneme excites; the *response* is whatever the receiver's
prompt says it is. This is the listener-side specialisation Minsky
describes.

### Meaning needs context (idea 6)

The frame layer in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
exists specifically to give context. A polyneme's `default_frame`
field couples symbol to situation, and the frame's slot set tells the
agencies *which* partial states matter here. The plan refuses to let
a symbol mean anything on its own — exactly Minsky's closing point.

---

## What the implementation does not yet take into account

### A — There is no per-agency K-line dictionary

Ideas 3 and 4 are the section's central architectural claim: each
agency has *its own little memorizer of K-lines* next to it. The plan
puts K-lines in a *shared* tree at `memory/klines/<class>/...`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and reactivates them centrally in `klines.ts`. A K-line records
`active_agencies` *across* the society, not a per-agency local
response table. Per-agency K-line locality is not a structure the
plan currently has.

### B — Memory locality is the opposite of what Minsky describes

Idea 5. The plan's memory is *centralised* by design: `state/` is
per-run, `memory/` is durable, and both are owned by the runtime, not
by the agencies. Agencies cannot write their own files; only the
`archivist` promotes settled material
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
This is a deliberate audit-and-governance choice, not an oversight,
but it is the *opposite* of Minsky's "stored close to where they are
used."

### C — Polyneme excite-maps are not agency-local

The polyneme catalogues
(`path-polynemes.yml`, `label-polynemes.yml`, `phrase-polynemes.yml`)
are *speaker-side* registries: the polyneme entry names its receivers
and their weights. Minsky's §19.5 puts the dictionary on the
*listener* side. The plan could be reread either way for the
first-ship catalogues (the data is the same), but the *authoring
locus* is the polyneme file, not the agency manifest.

### D — Learning the per-agency response is absent

Idea 2 ("each receiver must learn its own response"). In the
first-ship catalogue, the response is hand-authored in the polyneme
file. No loop updates an agency's reaction to a polyneme based on
whether the resulting settlements succeeded. (Same family of gap as
§1.1 gap D and §19.3 gap C.)

---

## Summary table

| # | Idea from §19.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Polyneme = one-to-many broadcaster | Yes | `excite:` / `inhibit:` maps. |
| 2 | Each receiver learns its own response | Partial | Differentiation by manifest; no learning loop (gap D). |
| 3 | Per-agency dictionary | No | Centralised polyneme registry (gap C); centralised K-lines (gap A). |
| 4 | K-lines as local memorizers | No | K-lines are shared and central (gap A). |
| 5 | Memories stored close to use | No (by design) | Centralised audit-first memory (gap B). |
| 6 | Meaning needs context | Yes | Frames + default_frame coupling. |

---

## Implication for the plan (no changes proposed here)

§19.5 is the section that diverges most sharply from the plan's
architecture. Minsky's "little memorizer next to each agency" is the
*opposite* of the centralised, audit-friendly memory the plan adopts
for governance reasons. The divergence is principled, but it is real
and should be recorded: per-agency K-line dictionaries and
locality-of-memory would require touching
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the representation-discipline protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/09-representation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/09-representation.md),
and the K-line deep dive at
[`THE-SOCIETY-OF-REPO/deep-dive/klines.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/deep-dive/klines.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
