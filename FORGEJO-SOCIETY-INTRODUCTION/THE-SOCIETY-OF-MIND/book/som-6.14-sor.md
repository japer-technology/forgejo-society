# Section 6.14 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-6.14.md](som-6.14.md) — *Confusion* (Minsky,
§6.14).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§6.14 is the chapter's coda: a single short paragraph with a sharp
point. Consciousness engages mainly when systems fail. We are
therefore more aware of small things that go wrong than of large
things that go right. Our intuitions about *which processes are
simple* are systematically misled, because the quiet ones become
invisible.

---

## The ideas Section 6.14 actually carries

1. **Awareness is asymmetric.** Consciousness is recruited by
   trouble, not by smoothness.
2. **The invisible is not the simple.** Processes we never notice
   may be the most complicated.
3. **Self-judgements about cognitive cost are unreliable.**
   Introspection cannot tell us which of our skills are easy.
4. **Other portions of the mind sense only the *quietness* of
   their peers.** Smooth running is the only signal of working
   well that an internal observer ever receives.

---

## What the implementation already absorbs

### Reflection appears in proportion to trouble (idea 1)

The plan's introspection slots — `unknowns`, `blind_spots`,
`unresolved_objections` — appear in the settlement when the cycle
*had* difficulty
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
Critic objections and suppressor activations are noisier when the
proposal is contested; a successful frame run is quiet.

### The conscious bottleneck narrates the difficult parts (idea 1)

`agency.integration.conscious-presenter` is the sole producer of
visible text and is structured around the settlement
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
"Conscious bottleneck"). Smoothly running phases — perception,
activation, deliberation when no critic objected — produce shorter
narrative than phases that produced objections, suppressions, or
unresolved questions. This matches Minsky's asymmetry by structure.

### Every step is logged regardless of awareness (ideas 2, 3)

The plan does not rely on the presenter for fidelity to *what
happened*; it relies on the per-cycle event logs in
`state/.../signals.jsonl`, `handoffs.jsonl`, `objections.jsonl`, and
`settlements.jsonl`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).
The conscious narrative is allowed to be selective, but the audit
trail is not. This is the right defence against §6.14's warning that
we mistake invisibility for simplicity: the *machinery* keeps the
full record, even when the *narrator* does not.

---

## What the implementation does not yet take into account

### A — No "quiet running" telemetry

Idea 4 is that the only signal of working well is *not raising a
signal*. The plan logs everything that happens but does not surface
*the rate at which agencies, frames, or critics never fire*. A
reviewer cannot easily ask "which agencies have been quiet for a
month?" — quietness has no published metric in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md).
The thing Minsky is warning against — invisibility being misread as
unimportance — is exactly what an unmeasured quiet rate produces.

### B — Complexity is not estimated independently of trouble

Ideas 2 and 3 say that the *cost* of a process and the *trouble it
causes* are not the same thing. The plan reports per-cycle budgets
in `budget`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and records actual costs in the settlement, but does not contrast
them with *visibility* in the presenter's narrative. An expensive,
silent agency and a cheap, noisy one would read identically to a
reviewer who reads only the narrative.

### C — The presenter is not warned about Minsky's bias

The presenter's instruction set
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
focuses on what to *include*: the settlement, the unresolved
items, the citations. It does not include a rule asking the
presenter to deliberately mention agencies that ran without
incident. The §6.14 risk — under-reporting the smoothly running —
is structural to the role and is not currently mitigated.

### D — No periodic "what is currently invisible?" audit

The plan has no scheduled review that asks "which parts of the
society have not produced a signal in the last N cycles, and is
that because they are healthy or because they are broken?" The
meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
has `differentiation-broker` and `retirement-broker` but neither is
specifically the "invisibility audit" §6.14 implies.

### E — "Working flawlessly" is not a recordable verdict

A settlement can record success, failure, or `partial`; it has no
field for "ran below the threshold of notice." The conscious-
presenter narrative can elide quiet runs; the settlement record
cannot mark them as deliberately elided.

---

## Summary table

| # | Idea from §6.14 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Awareness is asymmetric (trouble recruits it) | Yes | Introspection slots populated by difficulty; presenter narrates difficulty more. |
| 2 | The invisible is not the simple | Partial | Full per-cycle logs preserved; no contrast surfaced in narrative (gap B). |
| 3 | Self-judgement about cognitive cost is unreliable | Partial | Costs logged but not contrasted with visibility (gap B); presenter not warned (gap C). |
| 4 | Quietness is the only signal of working well | No | No quietness metric (gap A); no invisibility audit (gap D); no quiet-run verdict (gap E). |

---

## Implication for the plan (no changes proposed here)

§6.14 is short and the plan's structural answer to it is already
strong: the machinery records what the narrator omits. The
remaining gaps are the *positive* side of the same coin —
publishing a quietness metric, warning the presenter against the
§6.14 bias, scheduling an invisibility audit, and allowing the
settlement to mark a quiet run as such. None of these are urgent
and none are corrections; they are the second half of a discipline
the plan already has the first half of.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
the state and memory layout in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the conscious-presenter description in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and possibly the runtime pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md),
and so fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
