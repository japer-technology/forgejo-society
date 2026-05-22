# Section 16.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-16.7.md](som-16.7.md) — *Exploitation*
(Minsky, §16.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§16.7 details the mechanism by which exploitation actually works.
Thirst cannot find a cup; only See and Find and Get can. Rather than
sending a picture of a cup to Find, Thirst activates two connections:
one that makes See *hallucinate* a cup at a high level, and one that
activates Find. Find then activates Get. The scheme is unreliable —
See might be looking at something else — but unreliability is
acceptable when the alternative is to embed every other agency's
knowledge inside one's own. The section closes with the load-bearing
claim: complex goals are achievable only because higher-level
agencies *do not* concern themselves with low-level detail.

---

## The ideas Section 16.7 actually carries

1. **Worldly analogy.** We deal with people and machines without
   knowing their internals. The same holds inside the head.
2. **Goal-machinery is not knowledge-machinery.** Thirst knows water
   is in cups but does not know what a cup *looks like*; that
   knowledge lives in See.
3. **Activation, not transmission.** Thirst does not send a picture
   to Find; it *activates* See (to imagine a cup) and Find (to look).
4. **Chained activation.** Find later activates Get; the chain is
   built out of activations, not data passing.
5. **Unreliable but functional.** If See is occupied elsewhere, Get
   acquires the wrong object. The scheme is good enough to start
   building skill on.
6. **Speech-like exploitation.** "Please pass the cup" sends no
   picture; it exploits the other person's memory.
7. **Exploitation is the source of societal power.** No higher-level
   agency could pursue any complex goal if it had to micromanage
   every nerve and muscle.

---

## What the implementation already absorbs

### Activation, not transmission (idea 3)

Signals in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carry `suggested_effects.excite:` and `inhibit:` lists of *agent
ids*. They do not carry full data structures for the excited agency
to consume. The receiving agency, when it wakes, fetches what it
needs from its own tools and from the blackboard. This is
activation, not parcel-delivery.

### Chained activation through the deliberate loop (idea 4)

The deliberate loop in
[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
re-evaluates activation each cycle. An agency that emits an excite
signal in cycle *n* causes a different agency to be selected in
cycle *n+1*. K-line reactivation
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
"boosts the activation of every agency in each chosen K-line's
`activation_snapshot`" — exactly the chain Minsky describes.

### Goal-machinery separated from knowledge-machinery (idea 2)

The family taxonomy in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
separates *what* must happen from *how*. Integration's
`commit-steward` knows commits must be made; it does not know how to
read the codebase. Code's `codebase-cartographer` knows how to map
the codebase; it does not know whether to commit. The two cooperate
through signals and handoffs.

### Speech-like exploitation through directive polynemes (idea 6)

`directive.spock`, `directive.safety`, `directive.memory`,
`directive.critic` in `phrase-polynemes.yml`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
implement the `society <target>:` syntax. A user (or another agency)
can address an internal target by name, exploiting that target's
memory the way "please pass the cup" exploits another person's.

### Exploitation as the source of societal power (idea 7)

The conscious bottleneck
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md))
formalises exactly this. The conscious presenter does not "do" the
work; it assembles a coherent response from the settled blackboard.
The presenter is a higher-level agency that pursues a complex goal
(produce one coherent answer) by exploiting everything below it
without micromanaging any of it.

---

## What the implementation does not yet take into account

### A — No primitive for "hallucinate at the high level on behalf of X"

Idea 3's clearest move — Thirst makes See *hallucinate* a cup —
maps closely to K-line reactivation, but there is no manifest field
by which one agency *directs* another to reactivate a *specific*
K-line. K-line reactivation is cue-driven, not delegation-driven.
The pattern Minsky uses (cross-agency directed simulus) is not a
first-class shape. This is the same gap A as in
[`som-16.1-sor.md`](som-16.1-sor.md), viewed from the exploitation
side.

### B — Unreliability is allowed but not measured

Idea 5 accepts that exploitation chains misfire. The plan accepts
this in practice — every cycle can produce wrong activations — but
it does not *measure* misfire rates per exploitation edge. Without
that measurement, gap C below cannot be closed even if introduced:
there would be nothing to learn from.

### C — Chained activation has no per-chain credit assignment

Credit assignment
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md):
*Credit assignment*) attributes outcomes to "agencies that
contributed proposals, K-lines reactivated, frame selected, critics
sustained." It does not attribute outcomes to *exploitation chains*
— "Thirst → See → Find → Get worked; record that as a known good
chain". K-lines partially serve this purpose by snapshotting an
`active_agencies:` set, but a K-line is a configuration, not a
directed chain.

### D — Speech-like exploitation is restricted to a small directive set

Idea 6 is the most general form of exploitation. The plan exposes
only four `directive.*` polynemes. The general case — any agency
addressing any other by name, audited as an exploitation — is not
the default; the default communication path is via emitted signals
that policy then routes.

---

## Summary table

| # | Idea from §16.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Worldly analogy | Yes | Handoff/signal schemas mirror it. |
| 2 | Goal-machinery ≠ knowledge-machinery | Yes | Family taxonomy separates concerns. |
| 3 | Activation, not transmission | Yes | Signals carry agent ids, not data parcels. |
| 4 | Chained activation | Yes | Deliberate loop re-selects each cycle; K-lines boost chains. |
| 5 | Unreliable but functional | Partial | Accepted in practice; misfire not measured (gap B). |
| 6 | Speech-like exploitation | Partial | `directive.*` polynemes; small directive set (gap D). |
| 7 | Exploitation as source of power | Yes | Conscious bottleneck depends on it. |
|   | Directed simulus across agencies | No | K-line reactivation is cue-driven, not delegation-driven (gap A). |
|   | Per-chain credit | No | Credit is per-agent, per-K-line, per-critic (gap C). |

---

## Implication for the plan (no changes proposed here)

§16.7 confirms the plan's communication discipline: signals carry
intent, not data; chains form across cycles; the conscious presenter
exploits the rest without understanding the rest. The plan is
already, in shape, a society of exploiters.

The substantive opportunities are gap A — a delegation-driven
simulus primitive — and gap C — recording successful exploitation
*chains*, not just successful activations. Gap B (measurement) is
prerequisite to gap C. Gap D (general speech-like exploitation) is a
design choice the plan has made for safety reasons; widening it
would interact with the censor catalogue.

These are recorded here as analysis, not as a change request. Any
move to add an `arouses_via:` primitive, per-chain credit
assignment, misfire measurement, or general internal addressing
would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
and
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
