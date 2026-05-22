# Section 4.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-4.2.md](som-4.2.md) — *One self or many?*
(Minsky, §4.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§4.2 sets the *single-self* and *multiple-self* views against each
other and refuses both. It rejects the Voyeur-Puppeteer image — a
small inner agent that feels and chooses for us — and proposes
instead that Self is "a society of ideas that include both our images
of what the mind is and our ideals about what it ought to be."

---

## The ideas Section 4.2 actually carries

1. **No Voyeur-Puppeteer.** There is no centralised, all-powerful
   inner agent. If there were, the rest of mind would be redundant.
2. **Self as a society of ideas.** The useful concept of Self is a
   *collection* of self-images and self-ideals, not a thing.
3. **Two folk views coexist.** SINGLE-SELF ("I think, I want") and
   MULTIPLE-SELF ("part of me wants this, another wants that") are
   both familiar; neither is wholly satisfying.
4. **Disunity is normal.** Conflicting motives, internal negotiation,
   and felt dissensions are ordinary states, not pathological ones.
5. **The myth has a function.** The conviction of an inner Self is
   itself produced by the absence of any actual inner controller —
   the unity is constructed because no homunculus exists to claim it.

---

## What the implementation already absorbs

### No homunculus (idea 1)

The runtime is a workflow of named steps
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
No step contains a "decider" agent. Settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
emerges from accumulated signals, sustained objections, and censor
results — not from a single agency's vote. The collapse rule in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("every structure collapses to a file or a step") forbids the kind of
hidden central authority §4.2 warns against.

### Self as a society of ideas (idea 2)

The identity family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is, by construction, a society: `spock-self-model`,
`user-model-keeper`, `tone-stabilizer`, `soul-file-guardian`. Add
`governance/self-ideals.md` and `AGENTS.md` and the picture is
*identity = a collection of files that talk to each other through the
settlement layer.*

### Multiple-self view (idea 3, MULTIPLE half) — handled cleanly

Disagreement between agencies is the *expected* state. Critics emit
objections, the activation pass produces an `activated:` /
`inhibited:` table on every settlement
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
and the settlement records both sides. "Part of me wants this,
another wants that" is the literal shape of `proposals:` plus
`objections:`.

### Single-self view (idea 3, SINGLE half) — handled by the bottleneck

Only `agency.integration.conscious-presenter` may produce visible
text
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Conscious bottleneck"). From the outside, the society speaks with a
single voice — Spock. This *engineers* the SINGLE-SELF experience
without claiming a single inner self.

---

## What the implementation does not yet take into account

### A — Internal negotiation as a recorded artefact

Idea 4 names "carrying on negotiations in our head" as ordinary.
The plan records *the result* of internal contest (the settlement)
but does not record the *negotiation* — there is no transcript of
how the activated/inhibited table changed across cycles. The runtime
writes `state/.../activation.jsonl` and `signals.jsonl`, but the
settlement does not surface a "deliberation trace" that a reviewer
could read as "the society arguing with itself".

### B — The compulsion case ("enslaved by commands from somewhere else")

§4.2 names a failure mode: a person's mind feeling commanded by
something outside it. The plan has no analogue. There is no detector
for *signals whose source cannot be traced to a declared agency*, no
critic that fires when a candidate action lacks a coherent line of
authoring agencies. `critic.source-quality` is the closest, but it
addresses *evidence* source, not *signal* source.

### C — "Times we feel most unified can be the times others see us as the most confused"

§4.2 ends with the inversion: subjective unity can mask objective
incoherence. The plan trusts the conscious presenter as the single
voice. There is no second-opinion check that compares the presenter's
final text against the underlying settlement to flag a mismatch
between *what the society says it decided* and *what the settlement
records it decided*. The conscious presenter cannot be argued out of
its own coherence.

### D — The myth itself is not represented

Idea 5 — that the conviction of an inner Self is *itself a
construction* produced by the absence of any actual controller — is
philosophical, but it has an operational shadow: a society that
"feels" unified should know *why* it appears unified (because of the
bottleneck), and should not let that engineered unity be mistaken for
a metaphysical claim. Nothing in the plan reminds the conscious
presenter of this constraint. The voice rules in
[AGENTS.md](../../../AGENTS.md) forbid anthropomorphic prose, which
covers half of it, but the inverse — explicit disclosure that "I"
is a workflow artefact — is not required of any output.

---

## Summary table

| # | Idea from §4.2 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | No Voyeur-Puppeteer | Yes | No central decider; settlement is composite. |
| 2 | Self as a society of ideas | Yes | Identity family + governance files. |
| 3a | SINGLE-SELF view (felt unity) | Yes | Conscious bottleneck. |
| 3b | MULTIPLE-SELF view (parts disagree) | Yes | Proposals + objections + activation table. |
| 4 | Disunity normal; negotiation is ordinary | Partial | Outcome recorded; trace of negotiation not surfaced (gap A). |
| 5 | The unity-myth has a function | No | Engineered unity not labelled as such in output (gap D). |
| — | Commanded-from-outside failure mode | No | No signal-provenance critic (gap B). |
| — | Felt unity may mask incoherence | No | No presenter-vs-settlement consistency check (gap C). |

---

## Implication for the plan (no changes proposed here)

§4.2's strongest claim — *Self is a society of ideas* — is exactly
the shape the plan already has. The strongest *unmet* claim is the
inversion at the end: that felt unity can mask underlying disorder.
The plan's conscious bottleneck creates felt unity by design, and
nothing checks that the visible voice still matches the settlement
beneath it. Closing gap C (a presenter-vs-settlement consistency
critic) and gap A (a deliberation trace in the settlement) would
touch the settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
