# Section 16.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-16.9.md](som-16.9.md) — *Infant emotions*
(Minsky, §16.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§16.9 reads infant emotion through cross-exclusion. Infants flip
abruptly between well-defined states because cross-exclusion sharpens
the single most urgent signal at the expense of all others. The
sharpening is not biological accident but communication design: a
sharp signal is interpretable by a caregiver, where a mixed
expression would be ambiguous. The mechanism is matched at the other
end — adults have brains "wired to the remnants" of the same
protospecialists, so infant cries are read with the urgency the
adult would have to feel before crying so loudly themselves.

---

## The ideas Section 16.9 actually carries

1. **Separate-agency origins of infant mind.** Sudden switches
   between contentment, hunger, sleepiness, play, affection are
   evidence of relatively separate need-machines.
2. **Two readings of single-mindedness.** Either one agency captures
   control and suppresses the others, or many continue in parallel
   but only one is expressed. Minsky prefers the second.
3. **Cross-exclusion as sharpener.** Cross-exclusion magnifies small
   differences so the dominant need is unambiguous.
4. **Sharp signals serve caregiver-readability.** Mixed expressions
   would be uninterpretable; sharpening is for the *receiver*, not
   for the infant.
5. **Cross-exclusion also amplifies intensity.** The losing signals'
   energy is rolled into the winner — the cry is louder than any
   single need would warrant.
6. **Matched receivers.** Adults are wired to find baby signals
   irresistible. This is communication, not noise.
7. **Wiring to remnant protospecialists.** Adults read infant cries
   by re-running their own would-be cry response at the level
   needed to produce that intensity, and attribute the corresponding
   urgency to the infant.

---

## What the implementation already absorbs

### Sudden-state switching via the deliberate loop (ideas 1, 3)

The deliberate loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
recomputes activation each cycle; with cross-agency inhibition
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md):
`inhibits:`), the active agency set can change abruptly between
cycles. The settlement schema's `activated:` and `inhibited:` arrays
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
record exactly which agencies were sharpened up and which were
suppressed.

### Parallel cognition, single expression (idea 2)

The plan implements Minsky's preferred reading: many agencies run in
parallel during `deliberate`; only the conscious presenter speaks
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md):
*Conscious bottleneck*). The internal state is plural; the visible
state is single. This is exactly "many continue at once, only one is
expressed."

### Sharpening for receiver-readability (idea 4)

The assembly tier
(`agency.assembly.summary-tier-1/2`,
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
exists exactly to compress per-family signals into a
settlement-ready brief — a sharpening for the conscious presenter's
benefit, not the agencies' own. Spock's visible response is then
sharpened for the *user's* benefit.

### Urgency as a named appraisal (idea 5, indirectly)

`agency.perception.urgency-detector` and
`agency.safety.blast-radius-fear`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
produce scalar appraisals that bias selection downstream. They are
not feelings; they are operational urgency signals that drive the
loop's prioritisation, much as cross-exclusion amplification drives
the infant cry.

### Matched receivers across the surface boundary (idea 6)

The Forgejo bridge in `normalize`
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
is the matched receiver for the user's "cry" (the issue/comment).
Polynemes (`label-polynemes`, `phrase-polynemes` in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
make particular phrases and labels reliably trigger the right
internal cascade.

---

## What the implementation does not yet take into account

### A — No notion of an infant phase

Idea 1 is developmental: a *new* society's expressions should be
sharper and more single-minded than a mature one's, because its
agencies are not yet entangled. The plan has no notion of *time
since bootstrap* affecting how agencies relate. This is the parent
gap B from [`som-16.2-sor.md`](som-16.2-sor.md), seen through the
expressive surface.

### B — No amplification accounting

Idea 5 — the cry is *louder* than any single need would warrant —
has no representation in the plan. When an agency's signal wins
cross-cycle, the winner's `energy` does not absorb the losers'
energies; energies remain independent. There is no record like "this
high-urgency response was high-urgency because three other low
urgencies were inhibited into it."

### C — The receiver side of communication is single-direction

The plan models inputs from the user as stimuli and outputs to the
user as Spock's response. There is no symmetric model of the
*recipient* (the user) having matched-receiver machinery for the
society's signals. Public-fabric publishing is out of scope
([`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md));
inter-society communication is the closest analogue, and
[`13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md)
treats it as protocol negotiation, not as receiver design.

### D — Signal sharpening is not measured

The plan can sharpen signals (through cross-exclusion) but has no
metric that records *how much* sharpening happened. A reviewer
cannot ask "was this response sharp because the situation was
clearly one-of-five, or because four near-equal signals were
artificially suppressed?" The settlement records what survived; it
does not summarise the sharpening.

### E — No protected channel for high-urgency signals

Idea 6's "irresistible" property is partly the receiver's
prioritisation. The Forgejo trigger surface treats all events
identically until the runtime evaluates them. There is no
*pre-runtime* fast-path for high-urgency markers (e.g. a
`security` label) that bypasses the standard cycle ordering. The
guardrail and censor layers can divert flow, but they cannot lift
priority.

---

## Summary table

| # | Idea from §16.9 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Separate-agency origins | Partial | Modelled in the catalogue; no developmental sharpness (gap A). |
| 2 | Parallel cognition, single expression | Yes | Deliberate loop + conscious bottleneck. |
| 3 | Cross-exclusion as sharpener | Yes | `inhibits:` + cycle-recompute. |
| 4 | Sharp signals for receiver-readability | Yes | Assembly tier + Spock's single voice. |
| 5 | Cross-exclusion amplifies intensity | No | Energies are independent; no roll-up (gap B). |
| 6 | Matched receivers | Partial | Forgejo bridge + polynemes; no high-urgency fast path (gap E); recipient side not modelled (gap C). |
| 7 | Wiring to remnant protospecialists | N/A | Biological claim; no operational analogue. |
|   | Sharpening measurement | No | Settlement records survivors, not magnitude (gap D). |

---

## Implication for the plan (no changes proposed here)

§16.9 puts cross-exclusion under load and shows it doing two jobs at
once: arbitration and signal design. The plan does the arbitration
job (gap-free) and partly the signal-design job (assembly tier +
conscious presenter). The clearest weakness is amplitude bookkeeping:
the plan can produce a sharp answer but cannot tell a reviewer
*how* sharp, or *at whose expense*.

The substantive opportunities are gap B — amplitude bookkeeping —
and gap E — a high-urgency fast path informed by polynemes such as
`kind:security`. Gap D is editorial: a sharpening metric in the
settlement. Gap A is the developmental-curve absence shared with
[`som-16.2-sor.md`](som-16.2-sor.md). Gap C is federation-scope.

These are recorded here as analysis, not as a change request. Any
move to add amplitude bookkeeping, a high-urgency fast path, a
sharpening metric, or a developmental-stage field would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
