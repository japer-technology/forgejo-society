# Section 3.1 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-3.1.md](som-3.1.md) — *Conflict*
(Minsky, §3.1).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§3.1 is the first section in the book where Minsky names the basic
problem of *settlement*: what happens when two agents at the same level
want different things, and what an honest theory must say about the
levels above them. The section is short, but it lays the groundwork
for everything Minsky later says about hierarchies, weakening, and
the upward migration of disagreement. This file inventories those
ideas and checks each one against the implementation plan.

---

## The ideas Section 3.1 actually carries

Pulled from Minsky's text:

1. **Same-level conflict is the primitive case.** Two agents
   (Builder, Wrecker) at the same level disagree about whether to
   continue or to stop. The conflict is not pathological; it is the
   normal condition of a many-agent mind.
2. **The naive resolution is "defer to the activator."** The simplest
   policy is to let whichever agent activated the other have the
   casting vote. Minsky names this only to mark it as insufficient.
3. **The realistic resolution is the common superior.** In a real
   mind, both agents were activated by a higher-level agency
   (Play-with-Blocks); that agency is the proper site of resolution.
4. **Agencies are stacked.** Play-with-Blocks is itself a competitor
   of Play-with-Dolls and Play-with-Animals, all under Play; Play
   competes with Eat and Sleep. The hierarchy is open-ended upward.
5. **Activation is contextual.** Play "is not an isolated thing"; it
   exists alongside real-life concerns and is shaped by them. No
   agency is evaluated on its own merits in isolation.
6. **Unresolved conflict weakens the parent.** A prolonged Builder /
   Wrecker dispute tends to *weaken* Play-with-Blocks itself.
7. **A weakened parent loses suppressive power.** Once
   Play-with-Blocks weakens, it can no longer keep its rivals
   (Play-with-Dolls, Play-with-Animals) inhibited.
8. **Unresolved conflict migrates upward.** The weakening propagates:
   level N's deadlock weakens level N+1, which loses suppression of
   its rivals, and so on.
9. **Rivals at a higher level can seize control.** Eventually, an
   entirely different higher-level agency (Eat, Sleep) can take over
   the field. This is not arbitration; it is regime change driven by
   exhaustion.

These nine items are what the rest of this file tests against the
plan.

---

## What the implementation already absorbs

### Same-level conflict as the primitive case (idea 1)

The pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
makes conflict the normal case. Agencies emit `signal`, `handoff`,
and `candidate_action` records in parallel; critics emit `objection`
records against them in the `criticize` phase; censors mechanically
alter the tool surface in the `censor` phase. The
[`Handoff`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
schema reserves an `objections[]` array on every agent return, and a
handoff with `objections[].blocking=true` can short-circuit the
cycle. Disagreement is a first-class record type, not an exception
path.

### Direct same-level inhibition (idea 1, mechanism)

The manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
gives every agency an `inhibits:` list, and every polyneme entry in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
carries an `inhibit:` map of `<agent-id>: <weight>`. A Builder-like
agency can damp a Wrecker-like one directly, with weights. This is
the same-level half of Minsky's picture.

### The common superior, in flattened form (idea 3, partial)

The plan does not have parent agencies, but it does have a *common
arbiter* — the **settlement layer**. Every cycle ends in one
settlement record
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
that collects activated agencies, inhibited agencies, sustained
critic objections, censor blocks, and the single `action_authorised`.
This is structurally the place where Play-with-Blocks's role —
deciding between Builder and Wrecker — is discharged. The arbiter is
just not itself an agency; it is a phase.

### Contextual activation (idea 5)

Frames carry context. The frame schema in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
biases which agencies are active and which critics and censors run by
default. The `code-change`, `security-sensitive`, and
`self-modification` frames give the same agency different defaults in
different situations — Minsky's "play is not an isolated thing"
restated in the language of frames. Polynemes
(path, label, phrase) add a second layer of context-sensitivity by
exciting or inhibiting agencies based on what the stimulus actually
contains.

### A single visible voice (idea 3, post-resolution)

Once the settlement closes, only
`agency.integration.conscious-presenter` may produce the visible
response
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
*Conscious bottleneck*). This is the operational form of "the parent
decides, the child does not speak past the parent."

### Authority as the formal tiebreaker (idea 2, replaced)

The plan does **not** adopt Minsky's naive "defer to the activator"
rule. Instead, conflict at the level of *action* is broken by the
authority registry
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)):
six values — `read`, `draft`, `propose`, `act`, `govern`, `human` —
operate as ceilings. Censors are `govern`, mechanical, and
unconditional; critics are `read` and emit objections only;
`code.implementer` is `act` only inside `code-change` frames and
outside danger zones. The plan's rejection of naive
activator-deference is principled, but it does mean idea 2 is
*absent* rather than implemented.

---

## What the implementation does not yet take into account

These are the §3.1 ideas the plan currently leaves implicit, partial,
or absent. None are urgent; all are real.

### A — Hierarchy of agencies is flat, not stacked

Ideas 3 and 4 require a *stack* of agencies, each capable of being
both a superior and a competitor: Builder under Play-with-Blocks
under Play under (the level that holds Play, Eat, Sleep). The plan's
agency taxonomy is a **family**, not a hierarchy:
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
lists eight families — perception, memory, code, safety, identity,
integration, assembly, meta-admin — but no family contains a
sub-agency that *activated* another. The identity protocol's
`{scope}.{kind}.{name}` shape
([`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md))
has no `parent` field. There is no representation of "Builder was
activated *by* Play-with-Blocks"; only "Builder was activated *by* a
matching signal or polyneme." The settlement records `activated[]`
and `inhibited[]` flatly.

### B — No activation lineage

Idea 2 (defer to the activator) and idea 3 (resolve at the common
superior) both presume that the runtime can answer the question *who
activated this agency, and through whom?* The
[`Handoff`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
record carries `source` on each signal, but the settlement does not
chain those sources into a lineage. There is no
`activated_by_chain: [...]` field in `Signal`, `Handoff`, or
`Settlement`. As a result, the plan cannot in principle ask "is there
a common ancestor that should resolve this dispute?" — it can only
pool all signals into one flat settlement.

### C — Conflict does not weaken anyone

Idea 6 says unresolved disagreement *weakens its parent*. The plan
has nothing that decreases the weight of an agency *because* its
subordinates are deadlocked. Critic objections raise or lower the
sustained-status of a *proposal*
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
`critics[].sustained`), and the `criticize` phase applies *graduated
inhibition* to activation
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)),
but inhibition flows from critic to agency, not from a deadlock to
the agency that holds the field. There is no rule of the form "if
agencies X and Y produce contradictory candidate_actions for N
cycles, reduce the activation weight of their common context (frame
F or polyneme symbol S)."

### D — Conflict does not migrate upward

Idea 8 is the load-bearing claim of §3.1: a deadlock does not just
fail to resolve; it *propagates* up the stack. The plan has no
upward-propagation channel. The pipeline runs one cycle per
stimulus (with the criticize-tail re-activation pass), and a
settlement either authorises an action, blocks it, or escalates to
human. There is no third option of "this conflict has weakened the
governing frame; switch frames." A blocked settlement names the
block and exits; the frame that governed the cycle is not penalised
in the next cycle.

### E — Frames cannot be displaced by exhaustion

Idea 9 — Eat or Sleep seizing control once Play weakens — has no
analogue in the plan. The `activate` phase performs frame selection
by signal match ([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)
`matches.any_signals` / `any_labels` / `any_paths` / `any_phrases`),
not by accumulated deadlock pressure. A long-running stimulus that
fails to settle under the `code-change` frame does not, in the
current plan, eventually be re-routed under a different frame
because `code-change` has been *exhausted*. The only failure mode is
the `pending_human` settlement, which is the human stepping in, not
a rival frame taking over.

### F — No representation of the upward gradient

Even where the plan has the right pieces (settlement as arbiter,
critics as objection-holders, frames as context), it lacks a
representation of *degree of contestation*. Minsky's picture is
quantitative: the more Builder and Wrecker fight, the weaker
Play-with-Blocks becomes. The plan has scalar `energy` on signals
and scalar `weight` on activation, but no derived scalar that says
"how contested is the current settlement?" — no count of competing
candidate_actions, no entropy over proposals, no measure of objection
density on the governing frame. The settlement records the *outcome*
of contestation, not its *intensity*.

### G — Long-running conflicts have no half-life

Implicit in §3.1 is the idea that conflict has *duration*: prolonged
disagreement is qualitatively different from a single-cycle clash.
The plan is largely single-cycle. K-lines
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
*K-line*) and `evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
record longitudinal data, but there is no *open dispute* record —
nothing that says "stimulus S has produced N settlements in a row
that contradict each other." Repeated contestation does not aggregate
into a higher-level signal.

### H — Activator-deference is rejected without being replaced

Idea 2 is the simplest of the §3.1 mechanisms. The plan correctly
declines to use it (authority by activator would route around the
authority registry and the censors). But the plan also does not
record *that* it has declined to use it. A reader of
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
will not find a paragraph saying "activator-deference is intentionally
not a tiebreak rule because authority must come from the registry,
not from causal history." This is a documentation gap, parallel to
gap H in [`som-1.1-sor.md`](som-1.1-sor.md) (Sensibility): a chosen
absence should be recorded as chosen.

---

## Summary table

| # | Idea from §3.1 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Same-level conflict is the primitive case | Yes | Critics, censors, `objections[]`, `inhibits:`, polyneme `inhibit:`. |
| 2 | Naive resolution: defer to the activator | No (by design) | Authority registry replaces it; the rejection is not documented (gap H). |
| 3 | Realistic resolution: the common superior | Partial | Settlement phase is the arbiter, but there is no parent agency; lineage is not chained (gap A, gap B). |
| 4 | Agencies are stacked | No | Families are flat; identity has no `parent` field (gap A). |
| 5 | Activation is contextual | Yes | Frames + polynemes bias activation by stimulus context. |
| 6 | Unresolved conflict weakens the parent | No | No rule reduces activation weight as a function of subordinate deadlock (gap C). |
| 7 | A weakened parent loses suppressive power | No | Follows from gap C; no representation of suppressive-power decay (gap C, gap F). |
| 8 | Conflict migrates upward | No | No upward-propagation channel; settlements do not penalise frames (gap D). |
| 9 | Rivals seize control on exhaustion | No | Frames are selected by signal match, not displaced by accumulated deadlock (gap E, gap G). |

---

## Implication for the plan (no changes proposed here)

§3.1 names a class of mechanisms — stacked agencies, activation
lineage, parent-weakening under deadlock, upward propagation of
contestation, regime change by exhaustion — that the plan currently
does not represent. The plan handles the *same-level* half of the
section well: critics, censors, inhibition, frame-bound activation,
and a settlement phase that arbitrates contradictions. It does not
yet handle the *upward* half: there is no stack of superiors, no
chain of activators, no measure of contestation intensity, no
mechanism by which a long-running deadlock weakens the governing
frame and allows a rival frame to take over.

The smallest documentation move that would honour §3.1 without
restructuring is gap H: a single paragraph in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
recording that activator-deference is intentionally not a tiebreak
rule, and that authority flows from
[`governance/authority-registry.yml`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/authority-registry.md)
rather than from causal history. The biggest substantive move would
be gap D: introducing some form of upward signal — perhaps an
`open_dispute` record keyed on `(governing_frame, stimulus_id)` —
that allows accumulated contestation to influence the next cycle's
frame selection.

These are recorded here as analysis, not as a change request. Any
move to close them would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the record schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the frame selection rules in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
the activation protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/04-activation.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/04-activation.md),
and possibly the identity scopes in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
