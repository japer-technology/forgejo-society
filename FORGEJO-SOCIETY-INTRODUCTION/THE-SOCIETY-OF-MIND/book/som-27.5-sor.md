# Section 27.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-27.5.md](som-27.5.md) — *Jokes*
(Minsky, §27.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§27.5 picks up Freud's theory of jokes and rebuilds it: a joke is a
description that fits *two* frames at once. The first frame is
innocent enough to slip past the censors; the second is the
forbidden one. Once the innocent reading is installed, a final twist
substitutes the forbidden reading and the censored thought is
enjoyed. Minsky extends Freud by claiming this mechanism applies as
much to *intellectual* censorship as to social taboo: nonsense jokes
work because absurd reasoning is also a thing the mind is trained to
suppress.

---

## The ideas Section 27.5 actually carries

1. **A joke fits two frames simultaneously.** Dual-interpretation is
   load-bearing, not decorative.
2. **The innocent frame disarms the censors.** A simple recogniser
   cannot see through disguise.
3. **The forbidden frame is then substituted.** The censor is not
   defeated — it is bypassed by sequencing.
4. **Censorship is broader than social taboo.** Intellectual nonsense
   is also "naughty," so it is also funny.
5. **The mind enforces taboos on its own ineffectual reasoning.**
   Stupid thoughts are suppressed for the same reason as antisocial
   ones.
6. **Censors are simple-minded by design.** Their tractability comes
   from not parsing all the way into the dangerous interpretation.

---

## What the implementation already absorbs

### Censors as simple recognisers (idea 6)

The censor manifests in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
deliberately use narrow `activates_on` patterns rather than full
semantic understanding of a draft. `agency.censor.cloud-egress`
matches surface patterns (URLs, DNS calls, network primitives), not
deep intent. This is exactly Minsky's "simple-minded by design,"
arrived at independently for engineering reasons.

### Intellectual mistakes are also caught (idea 5)

Critics in the `evidence`, `consistency`, and `coherence` families
(see
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
do flag *ineffectual reasoning* — uncited claims, contradictions,
loops. So the plan does treat intellectual error as a thing worth
intercepting, even if it does not (and need not) call it taboo.

---

## What the implementation does not yet take into account

### A — No representation of dual-frame interpretation

Idea 1 is the structural core of §27.5 and is entirely absent from
the plan. Frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are activated *one at a time* against a polyneme. Nothing in the
runtime carries the notion of a candidate that *simultaneously*
matches two frames with conflicting consequences. A dual-frame
detector would need a new perception step that, on each polyneme,
scored the *second-best* frame and flagged the gap.

### B — No model of "censor bypass by sequencing"

Idea 3 implies a temporal trick: present innocent first, substitute
forbidden later. The plan's censor phase runs once per pipeline pass
on the settled candidate. There is no notion of a draft whose later
reinterpretation flips its category. This is partly a *safety
strength* — the censor doesn't fall for puns — and partly a
*blindness*: a multi-turn proposer could legitimately ship a draft
whose meaning changes under composition, and no censor checks
post-composition.

### C — Humor is not represented at all

Section 27.5 doesn't ask the plan to *be* funny, but it does identify
humor as a *mechanism* that exists in minds. The plan has no
representation of humor as a learning channel, of jokes as objects
that the conscious presenter could use, or of comedic
under-saturation as a signal. This is a structural absence, not a
flaw; §27.6 will give it sharper teeth.

### D — No "second-best frame" scoring

Even outside humor, the technique of §27.5 — score the runner-up
interpretation, flag when it is forbidden — would be a useful safety
addition. Today a critic returns the best score for the chosen
interpretation; there is no slot for "and here is the dangerous one
you almost picked."

---

## Summary table

| # | Idea from §27.5 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | A joke fits two frames at once | No | No dual-frame match (gap A). |
| 2 | Innocent frame disarms censors | Partial | Narrow censors are intentionally simple (idea 6); but no "innocent decoy" notion. |
| 3 | Forbidden frame is substituted later | No | One-pass censorship; no post-composition recheck (gap B). |
| 4 | Censorship is broader than social taboo | Yes | Evidence / consistency critics handle intellectual error. |
| 5 | Ineffectual reasoning is taboo | Yes | Same as 4. |
| 6 | Censors are simple-minded by design | Yes | Narrow `activates_on` patterns. |

---

## Implication for the plan (no changes proposed here)

§27.5 highlights a sequencing vulnerability that the plan does not
currently model: a candidate that means one thing in isolation and
another in context. The constructive form of the gap is a
*second-best-frame* score added to the critic schema, and a
*post-composition censor recheck* added to the runtime pipeline.

Any move to close these would touch the critic and censor manifests
in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
