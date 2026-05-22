# Section 20.9 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-20.9.md](som-20.9.md) — *Distributed
memory* (Minsky, §20.9).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§20.9 redraws the connection scheme as three layers — transmitters,
connectors, receivers — all built from evidence-weighing agents with
adjustable thresholds. Boltzmann-style machines hint at learning
those weights with a ring-closing capability. Minsky then breaks with
the mainstream: he doubts that *purely random* connection lines are
the right design. Small groups of connection lines, he suspects, will
turn out to have local significance — they will *be* the micronemes,
not just carry traffic between things.

---

## The ideas Section 20.9 actually carries

1. **The network has three roles.** Transmitter (K-line, memoriser),
   connector (shared wire), receiver (recogniser).
2. **All three can be evidence-weighing agents.** What differs is
   threshold, not kind.
3. **Branching at input and output is mandatory.** Real agents both
   excite and are excited by many others.
4. **Boltzmann machines suggest a route to learning weights.** With
   ring-closing they can also resolve ambiguities.
5. **Distributed reproduction of partial states of mind.** A network
   of this shape could function as K-line memory.
6. **Random connections have a mathematical convenience.** They
   minimise accidental interactions.
7. **But random is the wrong design.** It would be very hard for a
   transmitter to learn how to exploit a receiver's abilities.
8. **Connection lines themselves will be the micronemes.** Small
   groups of lines acquire local significance and become the most
   important agents of nearby levels.

---

## What the implementation already absorbs

### Three roles named, though differently (ideas 1, 3)

[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
distinguishes producers (perception, code, memory), consumers
(critics, censors, conscious-presenter), and integrators
(assembly, integration). The blackboard signals
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
are the "connectors." All three layers exist by name.

### Uniformity at the architectural level (idea 2)

Every agency is a Markdown file with YAML frontmatter; every critic
and censor uses the same manifest shape
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The kind difference is *configuration*, not *substance* — the
spirit of Minsky's "different thresholds, same agent."

### Distributed reproduction of past state (idea 5)

K-lines do exactly this: a record reproduces a partial activation
configuration when a similar stimulus arrives
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
The plan implements distributed memory in the Minskyan sense, even
though it does it with file lookup rather than network dynamics.

### Connection lines carry significance (idea 8)

The plan agrees with Minsky's break from randomness: polyneme symbols
are *named* and meaningful (`workflow-file`, `soul-file`,
`secret-file`, etc.)
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md)).
A path-polyneme is the most polyneme-like microneme the plan has:
a small group of "lines" (paths) carrying local meaning.

---

## What the implementation does not yet take into account

### A — No evidence-weighing agent type

Idea 2's uniform substrate — every node is an evidence-weighing
agent with a threshold — has no analogue. The plan's agencies run
prompted models or scripted critics, not weighted-sum recognisers
with adjustable thresholds
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)).
The "all kinds of agent are the same kind underneath" insight is
not represented.

### B — No learned weights

Idea 4's Boltzmann-style adjustment of weights from outcomes is
absent. Manifest fields are author-set; outcome data sits in
`reinforcement_log`
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md);
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
without a write path back to weights.

### C — No ring-closing disambiguation

Idea 4 ties Boltzmann to *ring-closing*. As noted in §20.2 and
§20.4 above, the pipeline does not iterate to convergence
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md));
disambiguation is single-pass.

### D — Branching at input/output is asymmetric

Idea 3 wants every agent to *both* excite and be excited by many
others. The plan's agencies cleanly excite via outputs and listen
via `activates_on`
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)),
but the *graph* of who-excites-whom is implicit, not rendered. The
symmetric branching that lets a Boltzmann-style network compute is
not visible as a structure.

### E — Microneme = connection-line is unrepresented

Idea 8 — small groups of *connection lines* become the most
important agents of nearby levels — has no analogue. The plan
treats signals as carriers, not as agents in their own right. A
signal in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
has no manifest, no authority, no decay score; it cannot itself be
the locus of meaning. The plan therefore does not realise Minsky's
deepest claim about distributed memory.

### F — Random connection is rejected by default, but not on principle

The plan happens not to use random projection (gap A in §20.8) but
not because it adopted Minsky's argument against it. There is no
note in
[`00-overview.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/00-overview.md)
or
[`11-mapping-sor-to-implementation.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/11-mapping-sor-to-implementation.md)
saying "we use named addressing because random projection makes
sender-receiver coupling unlearnable." The right thing is done; the
reason is unstated.

---

## Summary table

| # | Idea from §20.9 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Three roles (transmitter / connector / receiver) | Yes | Producers / signals / consumers across families. |
| 2 | One agent kind, varying thresholds | No | No evidence-weighing primitive (gap A). |
| 3 | Symmetric input/output branching | Partial | Implicit graph; not rendered (gap D). |
| 4 | Boltzmann-style learning + ring-closing | No | No weight adjustment, no iteration (gaps B, C). |
| 5 | Distributed reproduction of partial states | Yes | K-line reactivation. |
| 6 | Random connections minimise interference | N/A | Not used; gap A makes it moot. |
| 7 | Random is the wrong design | Yes (de facto) | Named addressing throughout; reason unstated (gap F). |
| 8 | Connection lines themselves are micronemes | No | Signals are carriers, not agents (gap E). |

---

## Implication for the plan (no changes proposed here)

§20.9 closes the chapter — and the long arc from §20.2 through §20.8
— with two claims the plan only partly honours. The *uniform
substrate* claim (one kind of evidence-weighing agent) is foreign
to a system built from prompted models and scripted critics. The
*connection-lines-as-micronemes* claim is foreign to a system that
treats signals as transport.

The plan's strongest agreement with §20.9 is the rejection of random
addressing: like Minsky, it gives its connection-bearing structures
*names*. That agreement is structural but not yet textual.

Closing gaps A, B, D, E would touch the agency schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
the signal schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
the K-line and microneme structure in
[`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md),
and the evolution and credit-assignment protocols in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md)
and
[`THE-SOCIETY-OF-REPO/10-evolution/`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/10-evolution/),
and therefore fall under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
