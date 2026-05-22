# Section 8.11 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-8.11.md](som-8.11.md) — *Layers of
societies* (Minsky, §8.11).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§8.11 closes Chapter 8 and reframes K-line theory architecturally.
Original *S-agents* form an S-society. The K-lines built over them
form a *K-society*. Built carelessly, the K-society loses contact
with its substrate and "slows down". Arranged as a *layer* close
to the S-society, the pair forms a spiralling computer that a third
agency — a B-brain — can confine by selecting a level-band. The
construction is recursive: each new layer learns to exploit the
last, stabilises, and becomes substrate for the next. This,
Minsky proposes, is how minds develop in infancy.

---

## The ideas Section 8.11 actually carries

1. **Two-layer structure.** K-agents form a society *over* the
   underlying S-society.
2. **K-lines lose efficiency if they only point to other K-lines.**
   They must keep some direct connections to the S-substrate or
   computation slows.
3. **Layer pairs as a computer.** S-agents excite K-agents and
   vice versa; activity spirals between the layers.
4. **Unconfined spiralling becomes chaotic.** Without an external
   controller, activity drifts and spreads.
5. **A third agency confines by level-band.** A B-brain chooses
   which band of the K-S system stays active and suppresses the
   rest, without needing to know the fine details.
6. **Coarse meta-control suffices.** The third agency's
   interventions are "move up", "move down", "stay here" — not
   detailed redirections.
7. **The K-S distinction is not essential.** A K-society is
   itself an S-society for the next layer above it.
8. **Recursion makes layered minds.** Sequences of layers form,
   each one learning to exploit the last; mastery in one layer
   slows that layer's change and enables the next.
9. **A learning rhythm.** New layer learns, the layer's rate of
   change drops, the layer becomes both subject and teacher to
   the next.

---

## What the implementation already absorbs

### The K-S pair, at one layer (ideas 1, 2)

The plan has a clear S-layer (the agencies, critics, censors, and
their behaviours) and a clear K-layer (K-lines in
`memory/k-lines/` plus the K-line schema and reactivation rules in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
A K-line's `useful_context.files_read` plus the agencies it boosts
are exactly the K→S links Minsky asks for; the K-line does not
float free of the S-substrate. Idea 2's failure mode (K-lines
pointing only to other K-lines) is avoided by construction at the
first layer.

### A B-brain analogue (idea 5, partial)

The *meta-admin* family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
together with the conscious-presenter and the suppressor signals,
sits *above* the K-S layer and can intervene without needing the
fine detail of every agency. The introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
gives this layer a view; the suppressor pattern gives it a verb.

### Coarse rather than fine control (idea 6)

The plan's high-level controls are coarse: the approval gate, the
authority levels (`read | draft | propose | act | govern | human`),
the abort conditions in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md).
None of them micro-manages an individual agency; all act at the
*band* of "what is permitted at this level". This is the right
Minsky-shape for the B-brain's interventions.

### Catalogue evolution as a slow-rhythm process (idea 9, in part)

The plan separates fast routine cycles from slow structural change
(approval-gated `self-modification`,
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
This matches Minsky's pattern of a new layer that starts active,
stabilises, and slows. Differentiation and retirement
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
can be read as that rhythm at the catalogue level.

---

## What the implementation does not yet take into account

### A — Only one K-layer exists; no K-on-K

Idea 1 implies a K-layer above an S-layer. The plan ships exactly
that. But idea 7 — *the K-society is itself an S-society for the
next layer above* — has no analogue. There is no
`memory/k-lines-on-k-lines/`, no K-line whose `restore_when`
matches another K-line's prior activation, no recursive shape in
the K-line schema
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The plan implements one rung of Minsky's ladder.

### B — Layer identity is not first-class

The plan does not name *layers*. K-lines live in one directory;
there is no `layer:` field on a K-line, no
`layers/L0/`, `layers/L1/` partition, and nothing in the identity
protocol
([`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md))
that would let an agency or K-line declare which layer it belongs
to. Idea 8's "sequence of layers" cannot be expressed.

### C — No level-band controller (idea 5, the verb)

The meta-admin family sits at the right architectural position
(gap A in §8.10) but does not act on a *level band*. It can
retire an agency, split a family, or suppress a specific
proposal; it cannot say "for this cycle, run only at level *k*
and suppress activity at *k+1* and *k-1*". The plan has no
*level* field for activity to be confined to.

### D — Spiralling activity is not represented

Idea 3 — activity spirals between layers — assumes a *trajectory
through layers* that can be observed. The plan's cycle goes
through phases (perceive → activate → deliberate → criticize →
censor → settle → act → remember → report,
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)),
not through layers. Per-cycle telemetry records phase boundaries
but not "ascent into K-space" or "descent into S-space". The
B-brain's "move up / move down" verb has no thing to move along.

### E — Chaotic drift has no name

Idea 4 — unconfined spiralling becomes chaotic — would need a
*detector*. The plan has abort conditions on runaway cost and
runaway scope
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
but no detector for "the K-S activity is drifting in level". The
risk Minsky names is currently inaccessible because the level
axis is absent (gap C, D).

### F — Layer-maturation lifecycle is missing

Idea 9 — a learning rhythm in which a layer learns, slows, and
becomes substrate — is honoured at the *catalogue* level but not
at the *K-line* level. K-lines do not have a `stabilised:` field,
a `subject_for: <next-layer>` field, or any explicit lifecycle
that records "this K-layer's rate of change has dropped enough
that the next one may begin". The plan can grow K-lines and prune
them; it cannot mark them as ready to be *built upon*.

### G — Recursion erases the special status of S-agents

Idea 7 dissolves the K/S distinction: at each level it returns.
The plan, however, *encodes* a distinction: agencies are a
specific kind of file under `agencies/`; K-lines are a different
kind under `memory/k-lines/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
Even if recursive K-on-K were added (gap A), the schema would
treat one as agency-like and one as memory-like; the relative
nature of S-vs-K that §8.11 turns on is not yet a first-class
feature.

### H — Infant-development framing is unrepresented

Idea 8's developmental claim — that minds *grow* in layers over
time — corresponds to no notion of a society's developmental age.
There is no `society_age` field, no policy that treats the first
*N* cycles differently from later ones, no documented
"infancy" phase in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md).
The §1.1 gap A (no developmental timescale) reappears here in its
sharpest form.

---

## Summary table

| # | Idea from §8.11 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Two-layer K-over-S structure | Yes | Agencies + K-lines in memory layer. |
| 2 | K-lines must keep direct S-links | Yes | K-line schema preserves `useful_context.files_read`. |
| 3 | Layer pairs as a spiralling computer | No | Cycle has phases, not levels (gap D). |
| 4 | Unconfined spiralling becomes chaotic | No | No level-drift detector (gap E). |
| 5 | A B-brain confines by level-band | Partial | Meta-admin sits in the right place; no level-band verb (gap C). |
| 6 | Coarse meta-control suffices | Yes | Approval gate, authority levels, suppressors are coarse. |
| 7 | K-S distinction is not essential | No | Schema hard-codes the distinction (gap G). |
| 8 | Recursion makes layered minds | No | No K-on-K (gap A); no layer field (gap B); no developmental age (gap H). |
| 9 | Learning rhythm (learn, slow, teach) | Partial | Honoured at catalogue level; absent at K-line level (gap F). |

---

## Implication for the plan (no changes proposed here)

§8.11 is the most architectural section the plan must eventually
answer. It implements the bottom rung of Minsky's ladder cleanly:
one K-layer over one S-layer, with the right kind of memory
discipline and the right kind of coarse meta-control. It does not
yet implement the *ladder*. The path to closing this would not be
a tweak: it would require *layer* as a first-class concept, a
recursive K-line schema, a B-brain verb that operates on level-
bands, and an explicit developmental rhythm for K-layers.

This is also the section where the §1.1 *Three timescales* gap
(gap A) becomes operational: the developmental timescale Minsky
keeps invoking is, in §8.11, the act of *adding a new layer*. The
plan cannot represent that act today.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the K-line and frame schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(layer field; B-brain verb on the meta-admin family),
the state and memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
(layer partitioning; K-on-K),
the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
(level-band telemetry),
the identity protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md),
the policy and safety layer in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
(drift detection),
and the bootstrap checklist in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md)
(developmental age),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
