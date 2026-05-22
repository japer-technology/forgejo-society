# Section 10.3 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-10.3.md](som-10.3.md) — *Priorities*
(Minsky, §10.3).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§10.3 proposes the simplest answer to "what happens when reasoners
disagree?": put them in an *order of priority*. The young child
ranks Tall before Thin before Confined. The scheme is practical;
its limitation is that no fixed ranking works in every situation.
The Tall-first child is wrong on the water jar precisely because
Confined should have come first there.

---

## The ideas Section 10.3 actually carries

1. **Disagreement is the normal case.** Three reasonable agents
   (Tall, Thin, Confined) return three different answers on the
   same input.
2. **A static priority order is the cheapest resolution.** It is
   practical, fast, and decisive.
3. **Vertical extent is a perceptually privileged dimension.** Minsky
   does not claim it is innate, only that height-as-proxy-for-amount
   is reliable often enough to earn its top slot.
4. **Static priority is brittle.** The conditions that make Tall a
   good proxy fail in the water-jar configuration; the static
   ranking then mis-fires.
5. **"Opposite" is not symmetric in early reasoning.** Tall and
   Short are not just signed versions of one reasoner; they are
   separately-active agents. Logic compresses; the brain does not.

---

## What the implementation already absorbs

### Disagreement is named (idea 1)

The objections channel in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
and the criticize/censor phases in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
make disagreement a routine, recorded event rather than an error.
The settlement record names which reasoner said what, and which the
society sided with.

### A registry of priority (idea 2)

`authority-registry.yml`
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
plus the `authority` field in each manifest
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
implement a *static priority order* in the precise sense Minsky
describes: a fixed scheme that lets the runtime know whose word
wins. The six levels (`read`, `draft`, `propose`, `act`, `govern`,
`human`) give the resolution mechanism cheap, decisive, and easily
audited.

### Censor-over-critic-over-proposer (idea 2 again)

The pipeline phase order in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
encodes a *kind-based* priority: an `act`-level proposal is filtered
through critics, then censors, then the settlement. This is the
Tall→Thin→Confined ordering in a different vocabulary, and shares its
strengths.

### Non-symmetric agents (idea 5)

The plan does not assume opposing reasoners are signed versions of
one another. `agency.safety.blast-radius-fear` and an enthusiast
proposer are *separate* agencies with separate manifests, not poles
of one scalar. The shape Minsky points at — that "opposite of" is
two agents, not one negation — is honoured by construction.

---

## What the implementation does not yet take into account

### A — The priority scheme is *also* brittle

§10.3's lesson is not "use a static priority" but "static priorities
*fail* in predictable conditions." The authority levels are *exactly*
a static priority and inherit the brittleness Minsky names. The plan
has no mechanism by which the *applicable* priority order is itself
chosen per-frame. Censor always beats critic; critic always beats
proposer. There is no analogue of "in the water-jar configuration,
Confined comes first" — no per-frame re-ranking of which kind of
reasoner gets the deciding voice.

### B — No equivalent of the perceptually-privileged proxy

Idea 3 is the observation that Tall earns its top slot because
*usually* taller does mean more. The plan has no notion of a
*usually-reliable shortcut* with a recorded reliability score.
Critics and censors are deterministically wired in; they are not
chosen because they happen to be right most of the time. The
generalisation Minsky names — *empirically-justified priority* — is
absent.

### C — Conflict without resolution is not a first-class state

§10.3 implies three answers and a chooser. The settlement protocol
([`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
always produces a single outcome, possibly an escalation to `human`.
There is no representation of "agencies disagree; no resolution is
yet warranted; defer." The implementation forces resolution where
Minsky's child can simply give the wrong answer and live with it.

### D — Priority is not perceptual

In §10.3, the priorities sit *inside* the perceptual agency. In the
plan, priority sits *outside* — in `authority-registry.yml` — and
applies to all kinds of work the agency does. There is no
*per-percept* perceptual rank; the rank is uniform across inputs.

### E — The static scheme is not visibly *failed* anywhere

The plan does not record cases where the static authority resolution
produced an answer the society would later judge wrong. The
`evolution/reinforcement-log.md`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
is a log, not a backpropagator of priority failure. The Tall→Confined
revision that Minsky's chapter heads toward has no mechanism here.

---

## Summary table

| # | Idea from §10.3 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Disagreement is normal | Yes | Objections + criticize / censor phases. |
| 2 | Static priority resolves cheaply | Yes | `authority-registry.yml`; pipeline phase order. |
| 3 | Perceptually privileged proxies | No | No reliability-weighted shortcut concept (gap B). |
| 4 | Static priority is brittle | No | Authority order is global and unrevised (gaps A, E). |
| 5 | "Opposite" is two agents | Yes | Manifests are independent; no signed-pole assumption. |
| — | Conflict-without-resolution as a state | No | Settlement always produces an outcome (gap C). |
| — | Per-percept priority | No | Authority is uniform across inputs (gap D). |

---

## Implication for the plan (no changes proposed here)

§10.3 maps with rare cleanness onto the plan: `authority-registry.yml`
*is* the priority order Minsky describes. That is the strength and
the warning. Whatever the static order is, §10.3 says it will be
wrong in some configuration. The plan does not yet have the
machinery — per-frame re-ranking, reliability-weighted proxies,
deferred-resolution states — that the next sections of chapter 10
will start to require. None of this is a change request. Any move
in this direction would touch
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md),
the settlement protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md),
and likely the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
