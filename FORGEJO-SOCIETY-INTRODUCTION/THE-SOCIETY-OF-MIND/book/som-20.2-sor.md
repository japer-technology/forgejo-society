# Section 20.2 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-20.2.md](som-20.2.md) — *Negotiating
ambiguity* (Minsky, §20.2).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§20.2 watches sentences disambiguate themselves: *the astronomer
married the star*; *John shot two bucks*. Each word wakes its
candidate polynemes; cross-exclusion groups force the senses to
compete; the ring-closing effect amplifies a mutually consistent
alliance until one reading dominates. Disambiguation is a few cycles
of competition, not a lookup.

---

## The ideas Section 20.2 actually carries

1. **Words wake multiple polynemes.** A single word arouses several
   sense-polynemes at once.
2. **Initial bias comes from earlier words.** *Astronomer* biases
   *star* toward the celestial sense before any second-pass check
   happens.
3. **Other agents create conflict.** The marriage-agent flinches at
   "celestial body" + "married" and forces another pass.
4. **Cross-exclusion groups make senses compete.** Senses of the
   same word are assembled into groups that suppress each other so
   one wins.
5. **Ring-closing amplifies the consistent alliance.** Mutually
   supporting polynemes (outdoors → hunting → gun → deer) reinforce
   one another until the alliance is sharp.
6. **A few cycles suffice.** The process terminates fast, not by
   exhaustive search.
7. **Implausible interpretations are pruned by prior odds.** *Bet
   deer* and *shoot dollars* are dismissed because people rarely
   do them, not by re-reading the sentence.

---

## What the implementation already absorbs

### Polynemes wake many agencies (ideas 1, 2)

Polynemes in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
carry an `excite` map: each symbol can raise multiple agency
weights at once. Path-polynemes like `workflow-file` wake safety
*and* code agencies in a single step. The "earlier words bias later
ones" effect (idea 2) is approximated by the order of polyneme
firing in perception.

### A frame-choice is a small competition (idea 4, partial)

The frame catalogue in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
makes frames mutually exclusive at settlement: `question`, `bug`,
`feature`, `code-change`, `security-sensitive`, `self-modification`,
`novel`. Only one frame is chosen per cycle. That is a small
cross-exclusion group at the frame level.

### Prior odds exist (idea 7)

Polyneme `excite`/`inhibit` weights and the `default_frame` overrides
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
encode "this combination is more likely than that one" without
re-examining the stimulus. A `secret-file` path immediately biases
toward `security-sensitive` rather than waiting for a critic to
notice.

---

## What the implementation does not yet take into account

### A — Senses of a single symbol have no cross-exclusion group

The schema lets a polyneme excite many agencies, but it does not let
a symbol declare *its own competing senses*. There is no
`exclusion_group` field on agencies or polynemes
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The plan can boost both readings; it has no mechanism that forces
one to suppress the other.

### B — No ring-closing iteration

The pipeline
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is linear: `perceive → activate → deliberate → criticize → censor →
settle → act → remember → report`. There is no inner loop in which
activated agencies feed back into perception or activation to
strengthen a mutually consistent alliance over several cycles. The
plan does the equivalent of one ring-closing step, not several.

### C — Conflict between two agencies does not trigger a retry

In Minsky's example the marriage-agent's flinch *forces a second
pass*. In the plan, an objection in `criticize`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
becomes a slot in the settlement; it does not re-run `activate`
with the offending sense suppressed.

### D — Alliances are not first-class

Idea 5's "mutually supporting set" — outdoors + hunting + gun + deer
— has no representation. The blackboard
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
holds individual signals; no record names "this group of signals
formed a self-supporting cluster." K-lines record post-hoc successful
configurations
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
but a within-cycle alliance has no name.

### E — Prior-odds inhibition is not pruned by implausibility

The plan boosts likely paths but does not actively inhibit
implausible combinations the way "people rarely bet deer" rules out
a reading. There is no `implausible_combinations.yml` and no critic
that fires on "this combination of senses is incoherent."

---

## Summary table

| # | Idea from §20.2 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Words wake multiple polynemes | Yes | `excite` is many-to-many. |
| 2 | Initial bias from earlier words | Partial | Order of polyneme firing carries some bias; no explicit primacy. |
| 3 | Other agents create conflict | Partial | Critics object after the fact; no retry (gap C). |
| 4 | Cross-exclusion groups | Partial | At frame level only; no per-symbol sense competition (gap A). |
| 5 | Ring-closing amplifies an alliance | No | Pipeline is linear (gap B); alliances not first-class (gap D). |
| 6 | A few cycles suffice | N/A | No inner cycles to count. |
| 7 | Implausible interpretations pruned by prior odds | Partial | Boost yes; inhibit-incoherent no (gap E). |

---

## Implication for the plan (no changes proposed here)

§20.2 describes disambiguation as a fast *competition* among
self-supporting alliances. The plan honours the *competition* at
frame-selection but flattens the *alliance* dynamics into a single
linear pass. Cross-exclusion groups, ring-closing iteration, and
implausibility-inhibition are the three structural shapes most
clearly missing.

Closing gaps A, B, D would touch the polyneme and frame schemas in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the pipeline shape in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and therefore fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
