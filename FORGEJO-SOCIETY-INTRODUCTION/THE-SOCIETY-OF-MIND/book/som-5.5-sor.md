# Section 5.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-5.5.md](som-5.5.md) — *Fashion and style*
(Minsky, §5.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§5.5 reframes style as a cognitive economy. We like things that have
"no earthly use" because making each arbitrary choice the way we did
before saves the cost of choosing. Style is the discipline that ends
deliberation when reasons cancel out. It is not a personal flourish
but a coordination layer: recognisability for the perceiver,
uniformity against distraction, predictability among many actors. The
chapter names *Fredkin's Paradox* — the harder a choice is, the less
it matters, because the alternatives are equally attractive — and
draws the conclusion that style is precisely the right brake for
equally-good options.

---

## The ideas Section 5.5 actually carries

1. **"I just like it" is a cognitive economy in disguise.**
   Aesthetic choices that resist explanation often save the cost of
   reasoning when reasons would cancel out.
2. **Recognisability is a function of style.** Familiar forms make
   classification cheap; novelty costs cycles.
3. **Uniformity protects attention.** If every object were
   interesting, attention would be consumed by interestingness.
4. **Predictability is a coordination layer.** Rules of style make
   no sense for an individual yet are decisive when many actors
   must coordinate.
5. **Fredkin's Paradox.** The more equally attractive two
   alternatives seem, the harder choice becomes — and the *less*
   it matters in proportion.
6. **Style should kick in only when further reasoning would waste
   time.** It is a brake, not a substitute for reasoning.
7. **Aesthetic freedom is a feeling, not a fact.** The choice feels
   unconstrained precisely because the constraints (the hidden
   rules) are invisible to the chooser.

---

## What the implementation already absorbs

### Voice and tone as enforced style (ideas 1, 2, 4)

[`AGENTS.md`](../../../AGENTS.md) §4 and the authoritative
`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md` set a uniform style
for the society. Banned phrasings, capitalisation rules, the
"specifics over slogans / mechanisms over mystique / restraint
over hype" triad — each is a pre-decided answer that saves the
society the cost of re-litigating tone every cycle.
`agency.identity.tone-stabilizer`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
applies the brake.

### Defaults as cognitive economy (ideas 1, 6)

`policies/write-policy.yml` with `default: branch_and_settle`
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)),
the read-only default tool surface
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)),
and the per-family authority defaults
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
all carry the "stop reasoning at the default" idea. The loop does
not deliberate over each write whether to branch; the answer is
already in.

### Recognisability via polynemes (idea 2)

The polyneme catalogue
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
pre-classifies stimuli by paths, labels, and phrases, biasing
frames in familiar directions before reasoning begins. The pattern
that fires for `.forgejo/workflows/**` is identical across runs —
exactly the recognisability Minsky names.

### First-ship catalogues as a societal style (ideas 1, 4)

The frame, critic, censor, and agency catalogues in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and [`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
are intentionally small. Every society installed from the plan
starts identically. Minsky's "societies need rules that make no
sense for individuals" is the founding rule of the bootstrap.

### Style as habit, not absolute law (idea 6)

The `self-modification` frame
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
exists precisely so style can be revised when revision is worth
the cost. Style is a brake, not a fence.

---

## What the implementation does not yet take into account

### A — No detector for Fredkin's Paradox

The deliberate loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
has `max_cycles`, but it does not detect "two candidate actions
are scoring equally and the loop is about to spend cycles ranking
them." Without that detector, the loop will exhaust budget on
choices that style could have closed cheaply. Minsky's paradox is
operationally invisible to the plan.

### B — No stylistic tiebreak operator

If two candidates rank close after critics and censors, the
settlement layer
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
has no declared tiebreak — no "in a tie, prefer the candidate that
matches the previous settlement's shape" — and no field recording
that a tie was resolved by style rather than by reason. A reviewer
of the settlement cannot tell which decisions were arbitrary.

### C — Style applies to output, not to internal habits

`tone-stabilizer` shapes Spock's outward voice. There is no
declared style for *internal cognitive habits*: how critics phrase
objections, how the cartographer reports a file map, how the
patch-imaginer structures a diff. Cycles are spent re-deciding
these shapes every run. Minsky's economy argument applies inward
as much as outward.

### D — Style is not measured

`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
attributes credit to agencies, K-lines, frames, and critics. It
does not reward a *style choice* for saving cycles. Style cannot
be tuned by the same mechanism that tunes the rest of the mind.

### E — Defaults are not flagged as defaults to the reader

A settlement that fast-forwarded to `main` because everything
passed does not record "this was the default path; no deliberation
was required." Idea 7 — that hidden defaults make choices feel
free — applies in reverse to readers: a reader of a settlement
that proceeded by default may mistake the absence of debate for
the absence of an alternative.

### F — No notion of *abandoning thought too recklessly*

Minsky closes the section with a quiet caveat: the guilt we feel
about "just liking" art may be the mind reminding itself not to
abandon thought too recklessly. The plan has frames and critics
that block insufficient evidence, but no agency or critic whose
job is to flag *"this proposal was accepted by style alone, with
reasoning available and skipped."* The brake has no brake.

---

## Summary table

| # | Idea | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Style is cognitive economy | Yes, at output | Tone discipline ([`AGENTS.md`](../../../AGENTS.md), [`05`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)). |
| 2 | Recognisability via familiar form | Yes | Polynemes ([`06`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)). |
| 3 | Uniformity protects attention | Yes | Defaults + read-only tool surface ([`02`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)). |
| 4 | Predictability for coordination | Yes | First-ship catalogues, single voice. |
| 5 | Fredkin's Paradox | No | No equally-attractive detector in the deliberate loop. |
| 6 | Style as a brake on wasted reasoning | Partial | Defaults exist; no measurement, no tuning. |
| 7 | Aesthetic choice feels free because rules are hidden | Implicit | Defaults not flagged as defaults in settlements. |

---

## Implication for the plan (no changes proposed here)

§5.5 reads, against the plan, as a small theory of *defaults*. The
plan installs many defaults at the right places — voice, write
policy, tool surface, polynemes, first-ship catalogues — and
benefits from the economy Minsky describes. The unfinished business
is at the points where reasoning *should* close but the plan has
not yet given it a stylistic close: Fredkin's tie, the unflagged
default, the unmeasured cost saving, and the internal habits that
are re-decided every run. The same insight underwrites the close
of §5.5: a brake is needed on the brake, lest style become
indistinguishable from inattention.

This file records the gap; it does not propose changes. Per
[`AGENTS.md`](../../../AGENTS.md) §12, adding new authority levels,
identifier scopes, governance primitives, or new fields on the
load-bearing schemas requires the maintainer's explicit direction.
This analysis is offered as a reading, not a request.
