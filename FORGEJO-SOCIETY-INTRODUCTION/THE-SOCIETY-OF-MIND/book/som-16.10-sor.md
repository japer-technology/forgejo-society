# Section 16.10 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-16.10.md](som-16.10.md) — *Adult emotions*
(Minsky, §16.10).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§16.10 closes Chapter 16 by undoing the common-sense psychology of
emotion. There is no consensus on which emotions exist, and the words
we use rarely correspond to distinct mental processes. What infants
use as signs of need, adults learn to use as social coin — to pretend
anger, to threaten or promise affection. Culture is ambivalent: it
asks for spontaneous feeling and for regulated feeling. We blame the
emotionally undisciplined more than the cognitively weak. Our adult
emotional repertoire is the built-in protospecialist set, overlaid by
many layers of parental, social, and self-imposed rules.

---

## The ideas Section 16.10 actually carries

1. **Emotion vocabulary is unreliable.** Common-sense psychology
   does not even agree on which emotions exist.
2. **Few emotion words match distinct processes.** Personal,
   variable accumulations of concept attach to words like "fear" or
   "love".
3. **From need-signs to social coin.** Adults learn to *use*
   emotional displays as currency — to pretend, threaten, promise.
4. **Cultural ambivalence.** Emotions are to be both spontaneous
   and regulated.
5. **Asymmetric blame.** We blame poor emotional self-control more
   than poor problem-solving.
6. **Innate, then overlaid.** Earliest emotional processes are
   built-in protospecialist responses; later rules overlay them.
7. **Layered authorities.** Parents, teachers, friends, and the
   self-ideals jointly shape *how and when* to feel and show each
   emotion sign.
8. **Adult emotion is opaque to introspection.** By adulthood the
   system has been rebuilt so many times that we cannot remember its
   infant form.

---

## What the implementation already absorbs

### Unreliable vocabulary held at arm's length (ideas 1, 2)

The voice rules in [AGENTS.md](../../../AGENTS.md) avoid the
emotional vocabulary entirely. The plan does not commit to *which*
emotions exist because it does not name any. Where appraisals exist
(`urgency-detector`, `blast-radius-fear`,
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
they are scalar and operational, not emotional. This honours
Minsky's caution against words that mean different things to
different readers.

### Built-in, then overlaid (ideas 6, 7)

The plan has an exact two-tier shape:

- **Built-in:** the first-ship catalogue
  ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
  is given at bootstrap and behaves identically across every
  instance.
- **Overlaid:** the `self-modification` frame, the
  `differentiation-broker` and `retirement-broker`, the
  `governance/self-ideals.md` file, and the `authority-registry.yml`
  collectively let parental, peer, and self-ideal rules overlay the
  initial behaviour.

That is, structurally, the §16.10 picture: protospecialists at the
base, rule-systems at the top.

### Layered authorities (idea 7)

`governance/authority-registry.yml`,
`governance/self-ideals.md`, the layered safety model
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)),
and the `human` authority level above the standard ladder
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md):
`read | draft | propose | act | govern | human`) implement layered
authority: kill switch / human / governance / authority / censor /
agency. Each layer can override the ones below.

### Regulated rather than spontaneous (idea 4 — one side only)

The plan is unambiguously on the *regulated* side of Minsky's
ambivalence. Settlements gate action; critics gate proposals;
censors gate tools; suppressors gate outputs. There is no
"spontaneous" path. This is the right choice for a safety-critical
runtime; it does mean the plan does not even partly model the other
side.

### Asymmetric blame as audit posture (idea 5, transformed)

In the plan, the analogue of "blame for lack of self-control" is the
audit posture: every safety failure is documented in
`memory/failure/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
while every cognitive failure ("poor problem-solving") becomes a
settlement with `outcome.status: failed` and a procedural
record. The audit treats safety failures more severely than reasoning
failures — the asymmetry Minsky observes, applied to a different
substrate.

---

## What the implementation does not yet take into account

### A — Social-coin use of signals (idea 3) is unrepresentable

Adults *use* emotional displays as currency. The plan's signals are
factual (`evidence` is required,
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md):
"No evidence, no trust"). An agency cannot *threaten* an objection
it does not hold, or *promise* a future signal it might not emit.
This is a defensible discipline — pretence has obvious safety
risks — but it forecloses the §16.10 social-coin shape entirely.

### B — Cultural ambivalence has no representation

Idea 4 is the *tension* between spontaneity and regulation, not the
resolution of it. The plan resolves the tension by choosing
regulation; nothing in the spec records that the other side exists
as a recognised alternative. A reviewer would not learn from the
plan that there is anything to be said for spontaneous behaviour.

### C — Opacity-to-introspection (idea 8) is the opposite of the plan's posture

Minsky says by adulthood the emotional system is unreadable from
inside. The plan's `unknowns:` and `blind_spots:` slots in
settlements
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
and the introspection protocol
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
are designed to keep the system *readable* across its whole life.
This is a chosen divergence, like gap D in
[`som-16.4-sor.md`](som-16.4-sor.md): the plan optimises for audit
where biology optimises for compactness.

### D — Layered authorities are static across time

Idea 7 implies that parental, then peer, then self-ideal rules
arrive at *different times* and reshape what is built. The plan's
layered authorities are present from bootstrap and do not change
phase. The `self-modification` frame can rewrite them, but there is
no model of, e.g., "in this society's first 30 days, peer-society
rules apply; after that, only self-ideal applies." This is again the
parent developmental-curve gap from
[`som-16.2-sor.md`](som-16.2-sor.md).

### E — Self-ideals are society-level, not agency-level

`governance/self-ideals.md` is one file at society scope. §16.10
implies that self-ideals can be agency-specific (each emotional
protospecialist gets its own overlay rules). The plan has no
agency-local ideals; the integration family applies one global
identity model. This is consistent with the keep-it-simple posture
and worth recording as the explicit decision it is.

---

## Summary table

| # | Idea from §16.10 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Emotion vocabulary unreliable | Yes (avoided) | Voice rules forbid the vocabulary. |
| 2 | Few words match distinct processes | Yes (avoided) | Scalar appraisals replace emotional words. |
| 3 | From need-signs to social coin | No | Signals are evidence-bound; pretence not representable (gap A). |
| 4 | Cultural ambivalence | Partial | Regulation side chosen; spontaneity side unmodelled (gap B). |
| 5 | Asymmetric blame | Yes | Failure tree distinguishes safety from reasoning. |
| 6 | Innate, then overlaid | Yes | First-ship catalogue + `self-modification` overlay. |
| 7 | Layered authorities | Partial | Layers exist but are static (gap D); self-ideals society-wide only (gap E). |
| 8 | Opacity to introspection | No (by design) | Plan keeps the system readable (gap C). |

---

## Implication for the plan (no changes proposed here)

§16.10 closes Chapter 16 with a list the plan answers in two
distinct ways. The voice and audit posture absorb ideas 1, 2, 5, 6,
and 7 directly. The plan diverges deliberately on ideas 3 and 8 —
no pretence, full readability — and chooses one side of the
ambivalence in idea 4.

The substantive opportunities lie in gap D — letting layered
authorities have *phase* — and gap E — letting self-ideals attach
to agencies as well as to the society. Gap A (social-coin use of
signals) and gap C (introspective opacity) are *chosen* divergences;
recording them explicitly in the spec, alongside the existing voice
rules, would help a reviewer understand that they are decisions, not
oversights. Gap B (recognised spontaneity) is editorial in the same
spirit.

These are recorded here as analysis, not as a change request. Any
move to add agency-local self-ideals, phased authority layers, or
to record the cultural-ambivalence trade-off explicitly would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and
[`THE-SOCIETY-OF-REPO/01-governance/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
