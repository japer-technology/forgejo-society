# Section 11.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-11.9.md](som-11.9.md) — *Dumbbell theories*
(Minsky, §11.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§11.9 closes the chapter with a methodological warning. We are
drawn to two-part oppositions — reason and emotion, mechanical and
vital, cold and warm — because they organise the world cheaply.
But many such pairs are not two ideas at all: they are one idea
and its negation, dressed up as a polarity. Dividing in two is a
good way to start; finding a third alternative is the discipline
that keeps the division honest. The Wordsworth fragment closes the
chapter on the right note: distinctions we made can be mistaken
for distinctions we found.

---

## The ideas Section 11.9 actually carries

1. **Two-part frames are seductively cheap.** Splitting a domain
   into a pair of opposites is fast to produce and easy to remember.
2. **Most pairs are one idea and a foil.** What looks like a
   contrast is often a thing and "the absence of that thing"
   wearing a costume.
3. **Always seek a third alternative.** If a third does not exist,
   suspect the dichotomy. If a third exists, the original split is
   at best provisional.
4. **Similarity of opposing pairs creates false analogies.**
   Several different pairs all "look like" the reason/emotion split,
   so reasoning across them feels deeper than it is.
5. **We mistake our own distinctions for the world's.** The closing
   Wordsworth lines: distinctions we *made* are taken for
   distinctions we *perceive*.

---

## What the implementation already absorbs

### Multi-valued authority (ideas 1, 3)

The authority ladder in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
is exactly six values: `read → draft → propose → act → govern →
human`. The plan refuses any *allowed / forbidden* dichotomy. Each
level is a third (or fourth, fifth, sixth) alternative to the
ones around it, and a frame can lower a ceiling but cannot raise
it. This is the §11.9 discipline made constitutional.

### Multi-valued outcomes (ideas 1, 3)

Settlement `outcome.status` in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
takes `success | partial | failed | blocked | pending_human`.
Action `kind` takes `comment | patch | open_pr | merge | noop |
escalate_human`. Reality-revision outcomes take `merged |
closed-without-merge | superseded | pending`. The plan does not
let itself collapse into "did it work or didn't it" — every
binary is broken into at least three.

### Families, not dyads (ideas 1, 4)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
defines *eight* agency families (perception, memory, code, safety,
identity, integration, assembly, meta-admin) and distinguishes
agencies, critics, censors, suppressors, narrators, assemblers,
and meta-units. The plan resists the cognitive/affective and
logic/intuition dichotomies §11.9 warns against by simply not
naming them.

### Plural critics over single arbiter (idea 2)

The critic catalogue is plural: evidence, scope, cost, privacy,
risk, overconfidence, source-quality, staleness. No single critic
is the negation of any other; each adds a separate axis. A
proposal is not "good or bad" — it is judged on eight independent
qualities.

### Voice discipline forbids the worst dichotomies (idea 5)

[AGENTS.md](../../../AGENTS.md) and
[CLAUDE.md](../../../CLAUDE.md) ban "AGI", "AI brain",
"autonomous developer", "revolutionary", "game-changing",
"next-generation" — language that overwhelmingly trades in
dumbbell oppositions. The Wordsworth warning is honoured in the
project's prose rules.

---

## What the implementation does not yet take into account

### A — No `critic.false-dichotomy` or `critic.dumbbell-framing`

The single most direct §11.9 mechanism would be a critic that
objects to proposals or settlements framed as A-vs-not-A. The
critic catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
does not contain one. `critic.overconfidence` is the nearest
neighbour, but it judges *strength*, not *shape*.

### B — Frames are not required to declare a third alternative

A `code-change` frame requires `proposed_patch`; a
`security-sensitive` frame requires a `revert_path`. Neither
requires the proposer to *name an alternative*. §11.9 would want
every frame with a structural choice to require at least one
declared alternative in the slot schema —
`alternatives_considered` does appear on `proposals` in the
settlement schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
but it may be empty. The discipline is suggested, not enforced.

### C — Polynemes and labels can pair as opposites unnoticed

A pair of phrase polynemes like `kind:bug` and `kind:feature`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
is a useful dichotomy until it isn't. The plan has no detector for
"two polynemes whose excite/inhibit sets are near-mirror-images of
each other" — exactly the §11.9 sign of a one-idea-with-foil.

### D — Settlements do not declare what they excluded

The settlement records what was activated, what was inhibited,
what was proposed, what was sustained. It does not record what
*alternative framings* were considered and rejected. Idea 5's
Wordsworth move — distinguishing distinctions-found from
distinctions-made — would want a settlement slot that names the
frames *not* chosen and why.

### E — No periodic "false analogy" review

§11.9 ends with the worry that several different dyads merge into
one apparent insight. The plan's meta-admin family runs ecology
review on a schedule
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
but does not specifically scan `memory/analogies/` for
analogy-on-analogy chains that may share only their dumbbell
shape.

---

## Summary table

| # | Idea from §11.9 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Two-part frames are seductively cheap | Yes (resisted) | Authority has six levels; outcomes have five; eight families. |
| 2 | Most pairs are one idea and a foil | Partial | Plural critics; no false-dichotomy critic (gap A). |
| 3 | Always seek a third alternative | Partial | `alternatives_considered` exists but is optional (gap B). |
| 4 | Similar pairs create false analogies | No | No periodic false-analogy scan (gap E). |
| 5 | We mistake our distinctions for the world's | Partial | Voice rules ban worst language; settlements do not record what was excluded (gap D). |
| — | Mirror-shaped polyneme pairs | No | No detector for excite/inhibit mirror sets (gap C). |

---

## Implication for the plan (no changes proposed here)

§11.9 is the friendliest §11 section toward the plan's
*constitutional* shape — multi-valued authority, plural critics,
many families — and the most exposing of its *operational*
softness. The plan refuses the obvious dichotomies in its
vocabulary; it does not yet *audit* itself for subtler ones.

The openings are pointed and small: a `critic.false-dichotomy`
(gap A), a slot requirement that `alternatives_considered` be
non-empty on non-trivial proposals (gap B), a meta-admin scan for
mirror-shaped polyneme pairs (gap C), an "excluded framings" slot
on the settlement (gap D), and a periodic false-analogy review in
the cron loop (gap E). Each is a small addition; together they
would let the plan enforce §11.9 instead of merely respecting it.

These are recorded as analysis, not as a change request. Any move
to close them would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
the settlement protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
and the introspection protocol at
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
