# Section 27.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-27.8.md](som-27.8.md) — *Good humor*
(Minsky, §27.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§27.8 closes the chapter by softening the censor-learning theory of
humor: humor in an adult is not a single thing, because in biology
nothing is. *Functional autonomy* — the way a mechanism evolves
beyond its original purpose — applies to humor as much as to any
other faculty. The section also makes a social-pedagogical point:
pointing out a mistake to someone whose loyalty matters requires a
*disarming* form, and humor is the form that evolved for it. Finally,
it notes that jokes wear out as the censors learn — and that the
persistent ones are persistent because they touch self-ideals, where
memories change slowly.

---

## The ideas Section 27.8 actually carries

1. **No single theory explains adult humor.** Mechanisms accumulate
   purposes by composition.
2. **Functional autonomy.** A mechanism's later use need not match
   its original function.
3. **Pointing out mistakes to a loved one needs a disarming form.**
   The messenger problem is real; humor solves it socially.
4. **Repeat exposure dulls jokes.** Censors learn faster on each
   replay.
5. **Persistent humor tracks slow-changing self-ideals.** Sexual,
   taboo, and identity material stays funny because its censors
   update slowly.
6. **Most jokes are not actually frivolous.** Their dressed-up
   content is often "see what happened to someone else; aren't you
   glad it wasn't you?"
7. **Understanding a feeling requires both its evolutionary and its
   individual history.** A single time-slice is insufficient.

---

## What the implementation already absorbs

### Mechanisms composed from sub-mechanisms (idea 1)

The agency families in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
already reuse each other across roles: the same `evidence` critic is
invoked by code, research, and integration paths. The collapse rule
in [`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
("file under `.forgejo-society/` or step in the workflow") forces
composition rather than purpose-specific duplication.

### Repeat exposure changes outcomes (idea 4, partial)

The episodic memory layer in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
records prior runs, and K-lines in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
give the same input a different (faster, more confident) handling on
repeat. So the "censors learn each time" structure has an analogue:
*recognisers* improve with replay. The slot for censors specifically
to learn is missing (gaps in §27.6 and §27.7), but the recognition
machinery does change.

### Disarming forms for negative feedback (idea 3)

The style guide in
[`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../../../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md)
asks for calm, specific, restrained prose even when delivering
unwelcome findings. The critic-objection schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
gives every veto a *reason*, not just a refusal. These are the file
forms of "do not shoot the messenger": negative feedback is
structured, signed, and traceable, so it lands as evidence rather
than as attack.

---

## What the implementation does not yet take into account

### A — No representation of functional autonomy

Idea 2 is genuinely structural. An agency's *original* purpose may
differ from how it is *now* used. The plan today gives each manifest
a `kind`, a family, and an `activates_on` pattern, but no history of
*previous purposes* or migration of *current callers*. A reviewer
cannot ask "what was this agency originally for, and what does it
now mostly do?" The git history of the manifest would have to be
read manually. A `historical_purposes` log slot would be the file
form; it does not exist.

### B — No evolutionary-versus-individual history split

Idea 7 says: to understand a faculty, you need both its
evolutionary history (selection across societies) and its individual
history (this agency, this society, this trace). The plan covers
the individual half through episodic memory and the reinforcement
log. The evolutionary half — selection across societies — has no
representation. Federation material in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
is the right home, but no record format exists for *which agency
manifests succeeded in other societies* and influenced this one.

### C — No self-ideals slot at the agency level

Idea 5 — persistent humor tracks self-ideals that change slowly —
implies that self-ideals are a real category. The plan has
`governance/self-ideals.md` at the *society* level (per
[`THE-SOCIETY-OF-REPO/01-governance/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/)),
but no per-agency self-ideal slot. So the plan cannot today represent
"this censor protects a self-ideal and should therefore change
slowly," nor enforce a slower learning rate on such censors.

### D — No social-pedagogy framing

Idea 3 implies that *how* feedback is delivered shapes whether it is
absorbed. The plan formalises the *content* of feedback (objections
with reasons) but not its *register*. There is no field on an
objection that distinguishes "private, terse, internal" from
"surfaced, conciliatory, human-facing." The conscious presenter in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
chooses register at output time, not at objection time.

### E — Humor as a mechanism — still absent, still on purpose

The plan does not represent humor itself, and the style guide
actively bans humor-as-decoration on repository surfaces. §27.8's
deeper point — that humor evolved to handle a real social-learning
problem — does not require the plan to *produce* humor, but it does
suggest that the plan's substitute (calm prose plus structured
objections) bears the same load. That substitution is real but
nowhere stated; if it were stated, the plan would be honest about
inheriting humor's job without inheriting its form.

---

## Summary table

| # | Idea from §27.8 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | No single theory of adult humor | Yes | Composition rather than purpose-specific duplication. |
| 2 | Functional autonomy | No | No historical-purpose slot (gap A). |
| 3 | Disarming form for negative feedback | Partial | Style guide + objection reasons; no register field on objections (gap D). |
| 4 | Repeat exposure dulls jokes | Partial | K-lines change recognition on replay; no censor learning (gaps from §27.6–7). |
| 5 | Persistent humor tracks self-ideals | Partial | Society-level self-ideals exist; no per-agency slot (gap C). |
| 6 | Most jokes are not frivolous | n/a | Not directly applicable; analogue would be that critic objections carry weight. |
| 7 | Evolutionary + individual history both needed | Partial | Individual half present; evolutionary half absent (gap B). |

---

## Implication for the plan (no changes proposed here)

§27.8 closes the chapter by tempering the censor-learning theory and
pointing at three structural absences in the plan: history of
purpose (gap A), evolution across societies (gap B), and per-agency
self-ideals (gap C). It also adds a quiet observation worth
recording: the plan inherits humor's social-pedagogical job — making
negative feedback land — through calm prose and structured
objections, and could state that inheritance explicitly without
representing humor itself.

Any move to close these would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the governance documents in
[`THE-SOCIETY-OF-REPO/01-governance/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/),
the federation material under
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
and the signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
