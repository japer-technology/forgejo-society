# Section 27.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-27.4.md](som-27.4.md) — *Exceptions to logic*
(Minsky, §27.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§27.4 argues that perfect logic rarely works, both because there are
few foolproof rules and because there are almost no foolproof facts.
The mind survives by mapping *islands of consistency* and marking
their boundaries. *Usual* matters more than *true*. Frames carry
default expectations that can be locally overridden without
collapsing the rest of the structure.

---

## The ideas Section 27.4 actually carries

1. **Certainty is unreachable.** Risk-taking is required to avoid
   paralysis.
2. **Two complementary kinds of knowledge.** Islands of consistency
   *and* marked boundaries of those islands.
3. **Communities and philosophers post warning signs.** Negative
   knowledge has a social form.
4. **"Usual" replaces "true" in real reasoning.** A rule that holds in
   typical cases is sufficient — and necessary.
5. **Frames support default-with-exception.** Learning Rover lacks a
   tail edits Rover-frame; it does not destroy the dog-frame.
6. **Logic fails on exceptions to its own rules.** Foolproof
   reasoning needs foolproof premises, which the world rarely
   supplies.

---

## What the implementation already absorbs

### Marked boundaries of safe domains (idea 2)

The policy layer in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
is exactly a set of *boundary markers*: `cloud-egress.yml`,
`identity-protection.yml`, `repo-modification.yml`. These name where
the safe domain ends; the censor agencies in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
enforce them.

### Default-with-exception (idea 5)

Frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
carry default terminal values that can be overridden per instance.
This is the file form of "your Rover-frame edits without
self-destructing." The K-line mechanism in the same document allows
specific past contexts to override the current frame's defaults.

### "Usual" over "true" (idea 4)

The conscious presenter in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
emits *settled* views rather than *proved* ones. Settlements in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
record confidence and `unknowns`, never claims of universal truth.

### Social warning signs (idea 3)

The compliance documents
([WARNING.md](../../../WARNING.md),
[forgejo-compliance.md](../../../forgejo-compliance.md),
[github-compliance.md](../../../github-compliance.md)) and the
authority registry are warning signs placed by a *community* — the
maintainers. They mark the unsafe boundaries that the censors then
enforce automatically.

---

## What the implementation does not yet take into account

### A — No explicit "island of consistency" abstraction

Idea 2's first half — *islands of consistency* within which ordinary
reasoning is safe — has no file representation. The plan has policies
(boundaries) but no positive declarations of the form "within these
contexts, the following inference rules can be trusted." A reviewer
cannot ask "what is the safe domain of `agency.code.implement`?" and
get an answer; they can only ask what censors might stop it.

### B — Frame exceptions exist; *learning* the exception does not

Idea 5 in §27.4 implies a *write*: encountering tail-less Rover edits
the Rover-frame. The plan's frames in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
allow per-instance overrides but do not describe a mechanism by which
*the frame itself* updates after a contradictory observation. There
is no "frame revision" step in the runtime pipeline. The
self-modification frame and `differentiation-broker` could be the
seat of this, but they are scoped to creating new agencies rather
than editing existing frame defaults.

### C — Certainty is not represented in the candidate schema

Idea 1 asks for risk-taking under uncertainty. The signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carries a candidate, an objection, and a reason — but no calibrated
confidence band that distinguishes "usually true" from "always true."
A critic cannot today demand that a proposer mark a claim as
*default* rather than *proved*.

### D — Logic-fails-on-exceptions has no analogue diagnostic

Idea 6 implies a diagnostic: when an apparently rigid rule produces a
contradiction, that is a signal to weaken the rule rather than to
keep applying it. The plan has no such diagnostic. A repeatedly
firing censor is logged but not flagged as "this rule has so many
exceptions that it should be reframed as a default."

---

## Summary table

| # | Idea from §27.4 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Certainty is unreachable | Partial | Settlements record confidence; no calibrated band on candidates (gap C). |
| 2 | Islands and their boundaries | Partial | Boundaries strong; islands not first-class (gap A). |
| 3 | Communities post warning signs | Yes | Compliance docs + authority registry. |
| 4 | "Usual" replaces "true" | Yes | Settlement records views, not proofs. |
| 5 | Frames support default + override | Partial | Override allowed; frame revision absent (gap B). |
| 6 | Logic fails on exceptions to its rules | No | No diagnostic for over-firing rules (gap D). |

---

## Implication for the plan (no changes proposed here)

§27.4 supplies one of the cleanest fits with the plan's *frame*
machinery and one of its cleanest gaps: an *island of consistency* is
the positive counterpart to a policy file, and the plan does not yet
have it. The other quiet gap is frame-revision-on-contradiction —
the mechanism that makes Minsky's Rover example work.

Any move to close these would touch the frame definition in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the policy layer in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
the signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
