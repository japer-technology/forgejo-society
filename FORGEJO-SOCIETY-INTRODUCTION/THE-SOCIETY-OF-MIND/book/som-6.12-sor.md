# Section 6.12 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-6.12.md](som-6.12.md) — *Internal communication*
(Minsky, §6.12).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§6.12 explains why human conversation works despite §6.11's
pessimism: shared *examples* and *common heritage* let us *evoke*
the right structures in another mind, even though we cannot *transmit*
them. And meaning itself is relative to the scale of the system in
which it lives.

---

## The ideas Section 6.12 actually carries

1. **We overestimate how much we communicate.** Most of what gets
   across rides on shared experience, not on transmitted content.
2. **We cite examples to evoke structures the listener already
   has.** Communication is *pointing*, not *moving*.
3. **High-level words and low-level signals are different.**
   Higher agencies cannot probe the fine details of the
   submachines they exploit.
4. **Meaning is relative to size.** It is meaningful to speak of
   *meaning* only in a system large enough to have many meanings.
5. **The smaller the system, the smaller the language.** A toy
   subsystem (Get, Put, Add) does not need any *sense* of
   meaning; it is just wired up.
6. **Translation between small languages is *harder*, not
   easier.** Few things in common, not many. The challenge
   inverts the human-translation case.

---

## What the implementation already absorbs

### Pointing, not moving (ideas 1–2)

Polynemes are the operational shape of "pointing"
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)):
a symbol does not carry meaning, it activates a *structure already
present* in the receiving agencies. K-lines do the same at memory
scale — a K-line does not transmit a solution, it *reactivates the
configuration* that produced one.

### Higher and lower agencies cannot probe each other (idea 3)

The conscious-bottleneck rule
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
is exactly this asymmetry: the presenter (high-level) cannot read
the internals of the censors (low-level mechanical safety). The
Assembly family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
`summary-tier-1`, `summary-tier-2`) is the engineered concession:
summarisation is *necessary* because direct probing is forbidden.

### Meaning is system-scale (idea 4)

The plan refuses to define "meaning" at the level of a single
record. A signal in isolation is a name and an energy
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md));
its meaning is the policy effect it produces *in context*. A K-line
is meaningful only relative to the agencies it reactivates. The
mapping in
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
exists because *the whole table* has to be present for any single
row to be coherent.

### Small subsystems do not need meaning (idea 5)

Censors that fire mechanically at `pre_tool_grant`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
are exactly Minsky's "Get, Put, Add": they are *wired up* to do
what they do, with no notion of what their action means in the
society's wider picture. The plan acknowledges this in the
`unconditional: true` flag on censor manifests.

### Common heritage as routing (ideas 1–2)

Inter-agency calls go through shared schemas, shared frames, and
shared polyneme symbols — never through ad-hoc payloads. The
"common heritage" Minsky names is the schema substrate. P does not
explain itself to Q; both subscribe to the same signal name and
both validate against the same schema.

---

## What the implementation does not yet take into account

### A — No surface for "shared examples"

Idea 2's mechanism is *example-citing*. The plan has prior K-lines
as a form of cited example, but no inter-agency move that says
"agency P wants Q to do something *like X*, where X is the prior
settlement settlement.code.2026-014." Handoffs
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
carry `claims` with evidence but not "exemplars cited." The
example-shaped routing is structurally possible but unmodelled.

### B — Tier-jumping is forbidden but not enforced

The asymmetry of idea 3 is realised by *convention*: the presenter
"should" read only the settled blackboard, not raw signals. The
plan does not have a hard policy that forbids an agency from
reading another's lower-tier output. `policy.ts` controls *tools*
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)),
not *which files an agency may read inside `state/`*. Tier
discipline is implicit.

### C — No metric for "language size"

Idea 6 inverts the human-translation case: smaller languages are
*harder* to translate between, because there are fewer
correspondences to find. The plan has no metric for the *size* of
an agency's signal vocabulary, nor a check on whether two agencies
that try to communicate share enough signal names. A small agency
with a four-signal vocabulary that tries to handshake with another
small agency with a different four-signal vocabulary will simply
silently fail to communicate.

### D — Small-system "no need for meaning" is not declared

The plan's mechanical censors *are* wired up without a sense of
meaning, but the plan does not say so doctrinally. A reader of
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
might infer that `censor.workflow-danger` "reasons about" workflow
files. It does not; it pattern-matches. The doctrinal statement
that *some* parts of the society are deliberately denied semantic
flexibility is missing.

### E — Higher-language vs lower-signal split is not enumerated

Idea 3 implies a clean two-tier split: words at the top, signals at
the bottom. The plan has multiple tiers (raw signals, family
summaries via Assembly tier-1, settlement brief via tier-2, final
text via the presenter), but does not declare which agencies
inhabit which tier. The Assembly family is *structurally* the
translation layer; this is not labelled in the documents as such.

---

## Summary table

| # | Idea from §6.12 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Communication is mostly shared heritage | Yes | Shared schemas; shared polynemes. |
| 2 | Pointing, not moving | Yes | Polynemes and K-lines as reactivation. |
| 3 | High and low cannot probe each other | Partial | Conscious bottleneck by convention; not enforced (gap B). |
| 4 | Meaning is system-scale | Yes | Mapping table; in-context interpretation. |
| 5 | Small systems need no meaning | Partial | Mechanical censors exist; doctrinal statement missing (gap D). |
| 6 | Small-language translation is harder | No | No vocabulary-size metric (gap C). |
| — | Shared-example citation move | No | Gap A. |
| — | Tier labelling | No | Gap E. |

---

## Implication for the plan (no changes proposed here)

§6.12 is the section where the plan is on its strongest ground:
schemas, polynemes, K-lines, the Assembly family, and the
conscious-bottleneck rule together implement Minsky's
"communication-as-evocation" thesis. The recorded gaps are about
*hardening conventions into checks* (B, C) and *making the
tier structure explicit* (D, E), plus *exposing example-citation as
a first-class move* (A).

Any move to close them would touch
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
(exemplars-cited slot; vocabulary-size metric),
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
(tier-read policy; mechanical-by-design statement), and
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(explicit tier labelling on the Assembly family), and so fall under
the "stop and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
