# Section 20.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-20.6.md](som-20.6.md) — *The nemeic spiral*
(Minsky, §20.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§20.6 describes the network of polynemes and micronemes as a *spiral*:
roughly hierarchical, but riddled with shortcuts, exceptions, and
cross-connections. Near speech, the elements correspond to expressible
thought; deeper in, they vary across people and resist words. Higher
agencies *regulate without comprehending* — they tune sensitivity and
direct activity to spiral down toward detail or spiral up toward
diagnosis, but they do not understand the local meanings beneath them.

---

## The ideas Section 20.6 actually carries

1. **The neme network is hierarchical-ish.** Real shape: layers
   with many cross-connections and exceptions.
2. **It is too large for any single comprehension.** No one mind
   grasps the entire connection set of another mind.
3. **Speech proximity correlates with expressibility.** Nemes near
   the speech agencies map to words; deeper nemes vary by person.
4. **Higher agencies regulate but do not comprehend.** They tune
   the activity below without understanding its local meanings.
5. **Regulation works on aggregate signs.** A supervisor sees
   "responding to too many micronemes" or "too few" — a scalar — and
   adjusts sensitivity accordingly.
6. **Spiral down for detail.** When work goes well, push lower-level
   processes into finer detail.
7. **Spiral up for diagnosis.** When obstacles appear, raise the
   activity to higher levels capable of changing the plan.

---

## What the implementation already absorbs

### Hierarchical-ish family taxonomy (idea 1)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
organises agencies into families (perception, memory, code, safety,
identity, integration, assembly, meta-admin) with cross-family
linkage via polynemes, frames, and shared signals. It is hierarchical
at the family level, networked at the signal level.

### Supervision without local comprehension (ideas 4, 5)

The meta-admin family
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
— `differentiation-broker`, `retirement-broker`, `forgetting-critic`,
`decay-scheduler` — judges agencies by scalar metrics
(`reuse_count`, `decay_score`, `objection rate`) rather than by
local meanings. The `agency.integration.conscious-presenter` decides
*what to say* without re-understanding each contributing signal in
detail. Regulation by aggregate sign is the operating mode.

### Spiral-down via cartographer and budget (idea 6)

When the cycle is going well, the `cartographer`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
narrows attention to the most relevant files; the budget discipline
in agency manifests
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
deepens detail within bounds. This is "spiral down toward small
details" in mechanism.

### Spiral-up via approval gate and self-modification (idea 7)

When obstacles appear — failing tests, conflicting critics, security
risk — the cycle escalates to the approval gate
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
or routes through `self-modification.frame.yml`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)),
which raises the level at which the situation is analysed. The plan
has a spiral-up path.

---

## What the implementation does not yet take into account

### A — The network is shape-flat in representation

The agency catalogue is a list, not a graph. There is no rendered
neme/agency *network* — no level annotations, no
`upper_neighbour`/`lower_neighbour` fields, no notion of which
agencies sit "near speech" and which sit "deeper in"
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md);
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The §20.6 picture has no place to live.

### B — Expressibility is not a property anywhere

Idea 3 — speech-near is expressible, deep is not — has no analogue.
The plan does not distinguish *which* agency outputs are surfaceable
by the conscious-presenter and which are constitutively internal.
The presenter
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
can in principle quote any signal it sees.

### C — Spiral direction is not a control input

Spiral-down and spiral-up happen as *consequences* of frame choice
(narrow vs `self-modification`) rather than as a *control signal* a
supervising agency can issue. There is no
`spiral: up`/`spiral: down` directive in the signal schema
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)),
no meta-admin agency whose job is to push the cycle to a different
level on the basis of aggregate progress signs.

### D — Regulation lacks an "ineffective plan" detector

Idea 7's trigger — "too many obstacles, raise the level" — is not
named. The plan has objection counts in the settlement and
`decay_score` in memory, but no critic
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
whose role is *to notice that the current plan is failing and ask
for a higher-level retry*. Escalation today is triggered by single
events (security, self-modification, failing critic), not by an
aggregate "this isn't working" reading.

### E — No per-mind connection-set variation

Idea 2's "no one comprehends the full connection set of another
mind" anticipates federation-level diversity. The plan does not yet
represent *which* connections a peer society has
([`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
is reserved for federation work but does not yet describe a
connection-set diff between two societies).

---

## Summary table

| # | Idea from §20.6 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Hierarchical-ish network | Partial | Family taxonomy yes; graph shape no (gap A). |
| 2 | Too large for full comprehension | Partial | Acknowledged spiritually; not represented (gap E). |
| 3 | Speech-near ↔ expressibility | No | No expressibility property (gap B). |
| 4 | Regulate without comprehending | Yes | Meta-admin family; conscious-presenter. |
| 5 | Aggregate scalar signs drive regulation | Yes | `reuse_count`, `decay_score`, objection counts. |
| 6 | Spiral down for detail | Yes | Cartographer + budget discipline. |
| 7 | Spiral up for diagnosis | Partial | Escalation paths exist; no aggregate "ineffective plan" trigger (gap D); no explicit spiral control (gap C). |

---

## Implication for the plan (no changes proposed here)

§20.6 is the plan's most operationally familiar territory: supervision
without comprehension is what every CI pipeline does. The plan
honours that well. The gaps are about *making the spiral a thing*:
giving the network a graph shape (A), making expressibility a
property (B), letting an agency choose to push the cycle up or down
levels (C), and naming when the current plan is no longer working
(D).

Closing these would touch the agency schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
and the evolution layer in
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and therefore fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
