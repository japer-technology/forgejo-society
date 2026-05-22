# Section 3.5 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-3.5.md](som-3.5.md) — *Destructiveness*
(Minsky, §3.5).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§3.5 is a short, sharp section. A higher-level agency (Play) loses
control of the body to a competitor (Sleep, Eat). The sub-agents Play
had recruited do not vanish cleanly: at least one — Wrecker — persists
long enough to take a final, destructive action. Minsky reads the
kick as multi-purposed: residual satisfaction for a freed sub-agent,
a communication of frustration at goal-loss, and a tidying of the
child's problem-space by reducing what is left to attend to. The
section closes by insisting that a suppressed activity can continue
internally — "a real child can go to bed yet still build towers in
its head" — i.e., suppression is not exclusion.

This analysis distils those ideas and tests each against the
implementation plan.

---

## The ideas Section 3.5 actually carries

1. **Higher-level agencies compete for the body.** Control transfers
   between top-level agencies (Play → Sleep) are real, observable
   events, not background noise.
2. **Sub-agents outlast the agency that recruited them.** When Play
   is suppressed, the agents Play controlled do not all cease at the
   same instant. At least one persists long enough to act.
3. **Released sub-agents can produce destructive residue.** Wrecker,
   freed from Play's constraint, takes one more kick. The destruction
   is a *trailing effect* of suppression, not a new initiative.
4. **Behaviour has multiple simultaneous causes.** "No single cause"
   — the kick is residual satisfaction, a frustration signal, and a
   tidying move at once.
5. **Destruction can serve constructive goals.** Reducing the
   problem space ("fewer problems to be solved") is itself useful;
   the mess outside tidies the mind inside.
6. **Frustration is communicated through action.** The scolding that
   follows confirms the message was received. Behaviour is an
   addressed signal, not just an output.
7. **Suppression is not exclusion.** Going to bed does not stop
   building towers; the activity continues internally, invisible to
   the outside world, and may surface later.

---

## What the implementation already absorbs

### Competition and inhibition as first-class mechanism (idea 1)

The pipeline has an explicit *graduated inhibition* step
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)),
the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
gives every agency an `inhibits:` list, polynemes carry `inhibit:`
weights ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
and signals carry an `inhibit:` list in `suggested_effects`
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The settlement schema records an `inhibited:` block with `agency`,
`weight_delta`, and `reason` per inhibited unit. Competition between
agencies is named at every layer.

### Suppression is auditable, not silent (idea 1, idea 6)

When a frame, polyneme, signal, or censor inhibits an agency, the
event is written to `activation.jsonl` and surfaces in the settlement
record. The "scolding that confirms transmission" maps cleanly onto
the audit trail: every inhibition leaves a Git-visible mark.

### Constructive removal as a real category (idea 5)

The plan already encodes "destruction can serve constructive goals"
in two distinct places:

- The meta-admin family has `agency.meta-admin.retirement-broker` and
  `agency.memory.forgetting-critic`
  ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
  whose function is removal in service of system health.
- Closed-without-merge branches are preserved as
  `memory/failure/rejected-candidates/<settlement_id>.yml`
  ([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
  so an abandoned candidate future is not waste — it is evidence. The
  kick that "tidies the child's mind" has a structural analogue:
  rejecting a branch reduces the open hypothesis count and the
  rejection itself becomes durable memory.

### Mechanical, not advisory, withdrawal of capability (idea 2)

[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
specifies that censors *mechanically alter the tool surface* rather
than advising the agency. If a sub-agent loses authority mid-flight
(its frame's ceiling lowers, a danger-zone trips), the tool set
becomes `[]` before the next model call. This is the cleanest
mechanism the plan offers for stopping a "Wrecker" from taking one
more action — at the boundary of the next tool grant.

### Multi-source signals into a single settlement (idea 4, partial)

Handoffs carry `signals[]`, `claims[]`, `objections[]`, and
`candidate_actions[]` together; the settlement aggregates contributions
from many agencies; the schema records `proposals[]` with
`alternatives_considered[]`. Composite causation is at least *visible*
in the record, even if not interpreted (see gap C).

---

## What the implementation does not yet take into account

These are the §3.5 ideas the plan leaves implicit, partial, or absent.
None are urgent; all are real.

### A — Released sub-agents have no "final-kick" phase

Idea 2 is the load-bearing one: when Play is suppressed, the agents
Play recruited do not cease at the same instant. The plan's activation
loop ([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md))
recomputes activation between cycles and re-selects candidates from
scratch. An inhibited agency's weight drops; its already-prepared
`candidate_actions[]` from the previous cycle either appear in the
settlement or do not, but there is no specified rule for what happens
to a partially-formed candidate when its parent agency is inhibited
between cycles. The plan does not represent the *trailing-effect*
window in which a freed sub-agent could still emit one final action.

### B — No mid-flight preemption between stimuli

Idea 1, taken seriously, includes the case where a new urge arrives
*while* the current one is acting. The workflow declares
`cancel-in-progress: false`
([`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)),
explicitly stating that "the society must finish settling once it
has begun, to preserve credit assignment and K-line integrity." This
is a defensible design choice — Sleep does not interrupt an
in-progress Play loop — but it means the §3.5 scenario of
*control wrested mid-act* is structurally impossible in the runtime.
Cross-stimulus dynamics are serial, not interleaved. The gap is
worth recording because Minsky treats mid-act preemption as the
*origin* of the destructive residue.

### C — Multi-cause behaviour is recorded but not interpreted

Idea 4 says a single act can simultaneously be residual satisfaction,
a frustration signal, and a problem-space tidier. The handoff schema
in [`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
records signals from many sources, and the settlement records
`proposals[]` with `alternatives_considered[]`, but there is no slot
on a `candidate_action` for *"this action serves these N distinct
purposes simultaneously, including purposes belonging to inhibited
agencies."* The plan resolves to a single best proposal at settlement
time. Composite intent is observable through the trace but is not
named in the schema.

### D — No representation of "constructive destruction" inside a cycle

The plan has `retirement-broker`, `forgetting-critic`, and
`rejected-candidates/` (above), but these operate at scheduled-cron
or settlement-archive timescales. There is no in-cycle agency whose
function is "remove this candidate or this hypothesis *now*, because
removal itself advances the goal." `agency.code.revert-path-finder`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
is about safety after-the-fact, not about removal-as-progress during
deliberation. Minsky's "kick that tidies the mind" has no in-cycle
analogue.

### E — No private rehearsal space ("towers in its head")

Idea 7 — suppression is not exclusion — has no operational form.
Every tree the runtime touches is committed to Git: `state/`,
`workspace/`, `memory/`, and `act`-phase imagination branches
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)).
An inhibited agency has no shadow space in which to continue
elaborating without producing visible effects. The plan's
transparency invariant — every cognitive step is reviewable in Git
history — is in direct, intentional tension with §3.5's claim that
some activity legitimately continues *out of sight*. This is a real
tension, not a missing feature, and is worth noting as such.

### F — Inhibited candidate actions are not specified

Tied to gap A: when an agency's weight drops below the threshold
between cycles, what happens to the `candidate_actions[]` it had
already emitted? The handoff schema does not say. The settlement
schema records `inhibited:` but does not link inhibited agencies to
their orphaned candidates. By default they likely just do not reach
settlement, but this is implicit. A residual candidate is a perfect
formal analogue of Wrecker's kick; the plan does not name it.

### G — No frustration / goal-loss signal category

Idea 6 reads the kick as a *communication* of frustration at
goal-loss. The signal vocabulary in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
covers danger, diff, and agent-state categories
(`danger.workflow_file`, `diff.needs_tests`, `agent.blocked_by_policy`)
but has no category for *"this agency's recruited goal was withdrawn
before completion."* Per gap H in
[som-1.1-sor.md](som-1.1-sor.md), sensibility is deliberately out of
scope, so framing this as "frustration" is foreclosed; the structural
form — a `goal_withdrawn` or `recruitment_interrupted` signal kind —
is not.

### H — Top-level competition (Play vs Sleep) is not modelled

Idea 1 distinguishes *high-level competing urges* from *signal-level
inhibition between workers*. The plan's first-ship family taxonomy
(perception / memory / code / safety / identity / integration /
assembly / meta-admin) has no level above family — no top-level
"drives" or "stances" between which the society must choose. Frames
are the closest analogue
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
but they are *stimulus-bound contexts*, not *competing intentions
under a single body*. Without that layer, the §3.5 scenario of one
high-level agency wresting control from another cannot be
represented at all; the runtime serialises stimuli instead.

---

## Summary table

| # | Idea from §3.5 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Higher-level agencies compete for the body | Partial | Inhibition is first-class at the agency level; no representation of competing high-level drives or mid-flight preemption (gaps B, H). |
| 2 | Sub-agents outlast the agency that recruited them | No | Activation is recomputed cleanly per cycle; no trailing-effect window (gap A). |
| 3 | Released sub-agents produce destructive residue | No | No specified handling of orphaned `candidate_actions[]` from inhibited agencies (gap F). |
| 4 | Behaviour has multiple simultaneous causes | Partial | Composite signals are recorded; no schema slot for multi-purpose intent (gap C). |
| 5 | Destruction can serve constructive goals | Yes | `retirement-broker`, `forgetting-critic`, `failure/rejected-candidates/` — but only at scheduled / post-settlement timescales (gap D for in-cycle). |
| 6 | Frustration is communicated through action | No | No goal-loss / recruitment-interrupted signal category (gap G); affective framing foreclosed by §1.1 gap H. |
| 7 | Suppression is not exclusion ("towers in its head") | No (by design) | Every tree is Git-committed; no private rehearsal space. Direct tension with the transparency invariant (gap E). |

---

## Implication for the plan (no changes proposed here)

§3.5 is one of the sections where Minsky and the implementation plan
sit in honest tension rather than simple alignment. The plan's
*transparency invariant* — every cognitive step lands in Git — and
its *serial stimulus loop* — `cancel-in-progress: false` — together
foreclose two of §3.5's core claims: that suppressed activity may
legitimately continue out of sight (gap E), and that one urge may
wrest control from another mid-act (gap B). These are deliberate
design choices in the service of auditability and credit assignment,
not oversights, and they should be read as such.

The other gaps are openings rather than tensions. Gap A
(trailing-effect window for inhibited sub-agents) and gap F
(orphaned candidate actions) are the same gap viewed from two angles
and would be closed by a single addition to the handoff or
settlement schema. Gap D (in-cycle constructive destruction) has
clean precedent in the existing meta-admin family. Gap H
(top-level competing drives) is the largest structural gap and would
require a new layer above family in the agency taxonomy — the kind
of change that touches the catalogue in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the identity scopes in
[`../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md),
and possibly the governance primitives in
[`../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/).

These are recorded here as analysis, not as a change request. Any
move to close them would fall under the stop-and-ask rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
