# Section 3.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-3.6.md](som-3.6.md) — *Pain and pleasure simplified*
(Minsky, §3.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§3.6 is one of the shortest sections in the book, but it is load-bearing:
it claims that pain and pleasure are not feelings to be *modelled* but
*simplifying mechanisms* — short-circuit operators that narrow attention,
crowd out rival goals, and transfer control to lower-level agencies. This
analysis treats those operators as architectural primitives and checks
which of them the implementation plan already contains and which it does
not.

---

## The ideas Section 3.6 actually carries

Pulled from Minsky's text:

1. **Pain simplifies the field.** Pain narrows attention by making
   rival goals seem small. Its power is its capacity to *crowd out*,
   not its qualia.
2. **Pleasure simplifies the field too.** Pleasure operates by the same
   narrowing mechanism with the opposite valence — both are
   *attention-collapsing operators*.
3. **Pain transfers control to lower-level agencies.** Special channels
   bypass long-term-planning machinery and route signals to immediate,
   simpler responders. The override is structural, not advisory.
4. **Simplification is functional, not incidental.** Pain helps
   survival precisely *because* it disrupts complex planning when an
   immediate problem appears.
5. **Over-simplification is itself a failure mode.** Too much
   suffering "diminishes us by restricting the complexities that
   constitute our very selves." The simplifier must be bounded; the
   same goes for pleasure.
6. **Apparent opposites share machinery.** Pain and pleasure look
   opposed only because they engage the *same* attention-simplifying
   agencies, just in opposite directions. Two states can be opposite
   only if they touch the same substrate.
7. **Valence is symmetric in mechanism, asymmetric in vector.** Pain
   pushes away, pleasure draws near, but both act on the same
   selection layer. Asymmetric outcomes from a symmetric machinery.

These seven items are what the rest of this file tests against the
implementation plan.

---

## What the implementation already absorbs

### A simplification layer exists — the censor stage (ideas 3, 4)

The censor phase in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
is exactly the kind of attention-collapsing operator Minsky describes.
A censor's outcome under
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
*mechanically alters the tool surface* (`allowed := []` on block) and
short-circuits the model call entirely. This is the operational
analogue of "transferring control to the lowest-level agencies":
deliberation is bypassed; a simpler, fail-closed responder runs in its
place. The kill switch and danger-zone suppressors compound the same
behaviour at coarser grain.

### Aversive signals are first-class (ideas 1, 4)

The first-ship catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
already contains two appraisal agencies whose job is precisely the
"detect impending injury" role Minsky assigns to pain:
`agency.safety.blast-radius-fear` (scope estimate) and
`agency.perception.urgency-detector` (response budget and indicator
level). Both emit scalar signals on the
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
`energy ∈ [0,1]` channel, and both can populate
`suggested_effects.excite` / `suggested_effects.inhibit`.

### Inhibition is named and graduated (ideas 1, 2)

`inhibits:` on the manifest schema, the dedicated *graduated
inhibition* tail of the `criticize` phase, and the `inhibited:` block
in the settlement record together give the plan a mechanism by which
one high-energy signal can lower the activation of rivals. The
machinery for "rival goals seem small" exists at the signal-graph
level.

### Single focus, single narrator (idea 1)

`workspace/current-focus/` ([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
and the *sole-producer* rule for
`agency.integration.conscious-presenter` enforce a structural form of
attentional bottleneck: only one focus, one voice. This is the
ambient simplification on which any pain-like override would operate.

### Reinforcement is two-sided (idea 7, partial)

[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
notes that "reinforcement is always two-sided": both success and
failure update `evolution/reinforcement-log.md` symmetrically. This
respects idea 7 (symmetric mechanism, asymmetric vector) but only
*post hoc*, at credit-assignment time — see gap C below for the
present-tense version.

---

## What the implementation does not yet take into account

These are the §3.6 ideas the plan currently leaves implicit, partial,
or absent. None are urgent; all are real.

### A — No present-tense appraisal scalar at the cycle level

Idea 1 requires that an aversive signal, once raised, *modulates the
current cycle's attention field*. The plan has the components — energy
on signals, `inhibits:` on manifests, graduated inhibition in
`criticize` — but no single cycle-scoped scalar (a "pain level" or
"alarm level") that is read by every agency's activation calculation.
`agency.safety.blast-radius-fear` produces a signal; nothing in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
specifies that a high blast-radius reading *contracts the participating
agency set* before deliberation continues. The narrowing is
declarative (via `inhibits:`), not stateful (via a running scalar).

### B — No "transfer to lower-level agencies" rule for non-censor cases

Idea 3 is sharper than "stop." Minsky's pain mechanism does not only
halt; it *re-routes* to simpler responders. The censor layer halts;
nothing in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
or
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
describes a graduated handoff *to a smaller, faster agency set* when
an appraisal scalar exceeds threshold without triggering a hard block.
The plan has two modes — full deliberation and full block — and no
"reduced deliberation under pressure" mode between them.

### C — No pleasure-side primitive

Idea 2 is symmetric: a simplifier with positive valence belongs in the
same place as the aversive one. The plan has
`agency.safety.blast-radius-fear` but no
`agency.X.satisfaction`-style counterpart that *amplifies* a candidate
action's downstream agencies the way fear *attenuates* them.
Reinforcement exists, but it is logged in
`evolution/reinforcement-log.md` after the fact
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md));
it does not run as a current-cycle excitation analogue of the
aversive path. The asymmetry is currently lopsided toward pain.

### D — No shared substrate for pleasure and pain

Idea 6 demands that the two appear opposed *only* because they engage
the same simplifying agencies. In the plan, safety appraisals
(`agency.safety.*`) and reinforcement
(`evolution/reinforcement-log.md`, credit assignment) sit in
different families with no shared signal-graph node and no common
schema field for valence. There is no `valence` slot on the Signal
record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
that would let an attention-simplifying operator be parameterised by
sign rather than by emitter family.

### E — No complexity floor against over-simplification

Idea 5 is the most easily overlooked. Pain is dangerous *because* it
can collapse the complexities that constitute the agent. The plan has
no invariant of the form "if the active agency count or the
deliberation depth falls below threshold X under an aversive signal,
escalate to human." The `unknowns` and `blind_spots` slots in the
settlement ([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
record what was *not known*, but not what was *crowded out*. A
high-energy aversive signal that legitimately silences ten agencies is
indistinguishable, in the settlement record, from a low-energy signal
that silenced none.

### F — Budgets are static, not modulated by appraisal

Idea 4 (functional simplification) implies that budgets should
*tighten* under high aversive signal — that pain shortens the horizon.
`budget:` on every manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
and the central `config/budgets.yml`
([`01-target-layout.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/01-target-layout.md))
are read at activation time and not modulated by the current
cycle's appraisal state. The `urgency-detector` estimates a response
budget but no part of the runtime is specified to *apply* that
estimate to the per-agency ceilings.

### G — Asymmetric pre-cycle priors

Idea 7 calls for symmetric mechanism, asymmetric vector. The plan's
safety machinery is mechanically thorough on the aversive side
(censors, suppressors, danger zones, kill switch, fail-closed
defaults) and structurally thin on the appetitive side (no
"approach" censor, no `excitor` symmetric to `suppressor`, no
mandatory pleasure-side appraisal at `pre_tool_grant`). The asymmetry
is intentional from a safety standpoint and entirely correct as a
deployment choice; it is recorded here only because §3.6 predicts
that an asymmetry of mechanism will produce a quieter, less visible
failure mode than an asymmetry of vector.

### H — No declaration that appraisal scalars are not emotions

As with Sensibility in
[som-1.1-sor.md](som-1.1-sor.md) (gap H), the plan correctly avoids
modelling feeling, but §3.6's reading forces a sharper statement: the
existing appraisal-shaped names (`blast-radius-fear`,
`urgency-detector`) are *operators*, not affect. A one-paragraph
statement in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
making this explicit would prevent the appraisal vocabulary from
being read anthropomorphically by future contributors.

---

## Summary table

| # | Idea from §3.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Pain simplifies the field | Partial | `inhibits:`, graduated inhibition, single focus exist; no cycle-scoped scalar that modulates the field (gap A). |
| 2 | Pleasure simplifies the field too | No | No pleasure-side primitive (gap C). |
| 3 | Pain transfers control to lower-level agencies | Partial | Censor halt + kill switch exist; no graduated handoff to a smaller agency set (gap B). |
| 4 | Simplification is functional, not incidental | Partial | Safety appraisals exist; budgets do not tighten under aversive signal (gap F). |
| 5 | Over-simplification is itself a failure mode | No | No complexity floor; settlement does not record what was crowded out (gap E). |
| 6 | Opposites share machinery | No | Safety and reinforcement live in separate families with no common valence field (gap D). |
| 7 | Symmetric mechanism, asymmetric vector | Partial | Reinforcement is two-sided post hoc; pre-cycle priors are one-sided (gap G). |
| — | Appraisal vocabulary is operator, not affect | Implicit | Voice rules cover prose; no explicit operational declaration (gap H). |

---

## Implication for the plan (no changes proposed here)

§3.6 reframes pain and pleasure as *attention-simplifying operators*
rather than feelings. Read against this, the implementation plan has
the right shape on the aversive half — censors, suppressors, danger
zones, `blast-radius-fear`, `urgency-detector`, graduated inhibition,
and the single-focus bottleneck together implement the *halt-and-narrow*
pattern Minsky names. The appetitive half is thinner, the shared
substrate that would make the two visibly opposed is absent, and the
*over-simplification* failure mode that §3.6 explicitly warns against
has no detector.

The biggest unforced opportunity is gap E: a complexity-floor
invariant that records, per settlement, how many agencies were
silenced and by which signal, so that pain-like collapse is auditable
rather than invisible. The biggest substantive opportunity is gap D:
a `valence` field on the Signal record in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
that would let pleasure-side and pain-side operators share one
mechanism with opposite sign.

These are recorded here as analysis, not as a change request. Any move
to close them would touch the Signal and Settlement schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
the budget and policy layers in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
and possibly the first-ship agency catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
