# Section 10.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-10.6.md](som-10.6.md) — *About Piaget's
experiments* (Minsky, §10.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§10.6 is the chapter's Q&A: a parent, a critic, a psychologist, and
a biologist push back on Piaget. The answers refuse three easy
escapes — that this is all about words, that having a skill defeats
the experiment, that genes do it all — and admit one genuinely
hard problem: what happens when Appearance and History deadlock?

---

## The ideas Section 10.6 actually carries

1. **The phenomenon is not lexical.** Word-free presentations
   produce the same misjudgment. The Society-of-More is not just a
   vocabulary problem.
2. **Possessing a method ≠ using it.** Children who can count the
   eggs still misjudge the row. The implementation form of this
   gap is "deployment policy" (re-stated from §10.2).
3. **Deadlock is real and must have a fallback.** When Appearance
   and History conflict, the answer cannot be paralysis; the society
   needs further levels and alternative explanations (magic,
   evaporation, theft) or different drivers (frustration, boredom,
   restlessness).
4. **Other agencies set the deadlock outcome.** What happens under
   deadlock depends on the state of agencies *outside* the
   conflicting pair.
5. **Genes do not directly carry late-developmental ideas.** The
   biologist's question is profound but not a refutation: heredity
   acts on substrate, not on concepts like "quantity."

---

## What the implementation already absorbs

### Non-lexical surfaces are normal (idea 1)

The perception phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
accepts any frame the workflow yields — diffs, file trees, structured
events — not only natural-language prose. The polyneme schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
treats text as one slot among many. The plan does not assume
language is the medium of cognition.

### Censors and escalation as fallback (idea 3 partially)

When critics and proposers deadlock, the plan does not freeze: the
censor phase in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
and the settlement record in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
produce either a chosen proposal, an objection-and-defer, or an
escalation to `human`. The pipeline is structurally non-paralytic.

### Heredity acts on substrate (idea 5)

The plan's "genome" is the first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and the bootstrap in
[`10-bootstrap-checklist.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/10-bootstrap-checklist.md);
these supply substrate (agencies, manifests, prompt bodies), not
concepts. Whatever the society later learns about, say, "contract
risk" is *not* born into it. This matches §10.6's biologist answer.

---

## What the implementation does not yet take into account

### A — Critic's deadlock has no named outcome

§10.6's critic asks the sharpest question: what happens when
Appearance and History conflict? The plan answers in one of two
ways — pick a winner (settlement) or escalate to `human` — but does
not carry the third outcome §10.6 hints at, namely *alternative
explanation* (magic, evaporation, theft). There is no concept of "I
cannot decide between the contending readings, so here is a third
reading that reframes the input." The plan's space of outcomes is
narrower than the chapter's.

### B — State of "other agencies" is not consulted at deadlock

Idea 4 — that the deadlock outcome depends on the *rest* of the
society (frustration, boredom, restlessness) — has no analogue. The
settlement protocol consults the proposers and the critics; it does
not consult, say, `agency.meta-admin.differentiation-broker` to ask
"is this a chronic conflict pattern?" or a budget-aware agency to
ask "are we tired?" Deadlock resolution is local.

### C — Possessing-but-not-using is invisible in audit

§10.6's psychologist points out that the young child *has* the
counting skill but does not deploy it. The plan has no way to
record the analogous case: an agency that *could* have activated
on a frame but did not. The settlement names the agencies that
*did* fire
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md));
it does not name the qualified-but-silent. A reviewer cannot ask
"was a perception agency that *could* have settled this question
present but unactivated?"

### D — The biologist's profound question is deferred

The biologist asks how late, abstract concepts can be heredity-
influenced at all. Minsky promises an answer in the appendix; the
plan defers the question entirely. The first-ship catalogue is a
*chosen* substrate, not a *derived* one. As recorded under §1.1
(gap B, Origins), the plan does not generate its own minimal seed.

### E — Affective state has no representation

Idea 4 names frustration, restlessness, and boredom as load-bearing
on deadlock. The plan, by binding voice rules in
[AGENTS.md](../../../AGENTS.md), *forbids* anthropomorphic prose
about feelings, and (per §1.1 gap H) does not represent them at all.
The chapter is asking for a representation that is intentionally out
of scope. The gap should be marked, not closed: the substitute is
budget exhaustion, retry counts, and `agency.safety.blast-radius-
fear`-style named appraisals. Whether that substitute is sufficient
for §10.6 is an open question.

---

## Summary table

| # | Idea from §10.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Phenomenon is not lexical | Yes | Frames + polynemes; perception is not text-only. |
| 2 | Possessing a method ≠ using it | No (audit) | Silent-but-qualified agencies are invisible (gap C). |
| 3 | Deadlock needs fallback | Partial | Settlement + escalation yes; alternative-reading outcome no (gap A). |
| 4 | Other agencies' state shapes deadlock | No | Settlement consults contenders only (gap B); affect not represented (gap E). |
| 5 | Genes act on substrate, not concepts | Yes | First-ship catalogue is substrate, not concepts. |
| — | Where does the substrate come from? | No | Seeds are given, not derived (gap D). |

---

## Implication for the plan (no changes proposed here)

§10.6 mostly confirms the plan: non-lexical surfaces, non-paralytic
pipeline, substrate-only heredity. Its uncomfortable contribution is
the deadlock material. The plan's deadlock outcomes are narrower
than the chapter's, and its deadlock inputs are narrower too — the
state of the wider society is not consulted, and no agency carries
the affective signals §10.6 names. Closing any of this would touch
the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the safety material in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md);
the affective half intersects the deliberately-excluded "sensibility"
question recorded under [som-1.1-sor.md](som-1.1-sor.md) (gap H).
Nothing here is a change request. Any such move falls under the
"stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
