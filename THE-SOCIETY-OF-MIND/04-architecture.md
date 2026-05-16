# 04 — Architecture

The Society of Mind is not just a list of agent kinds; it is an architecture.
This page draws out that architecture explicitly: how agencies are stacked,
how information flows, where the boundaries are, what the load-bearing
asymmetries look like, and which structural choices are doing the most work.

---

## The base picture

```text
        +-----------------------------------------+
        |   Self-models, self-ideals, B-brain     |   higher
        +-----------------------------------------+
                       ^         |
                summary|         |directives
                       |         v
        +-----------------------------------------+
        |   Assembly agencies, frame organisers   |
        +-----------------------------------------+
                       ^         |
                       |         v
        +-----------------------------------------+
        |   Working agencies (vision, language,   |
        |   motor, planning, dialogue, etc.)      |
        +-----------------------------------------+
                       ^         |
                       |         v
        +-----------------------------------------+
        |   Polynemes, micronemes, K-lines,       |
        |   recognisers, censors, suppressors     |   lower
        +-----------------------------------------+
                       ^         |
                       |         v
        +-----------------------------------------+
        |   World, body, sensors, effectors       |
        +-----------------------------------------+
```

This is *not* a brain map. It is the shape that any organised society of
agencies tends toward. It is hierarchical but not strictly tree-shaped;
agencies inside a level often talk sideways through pronomes and isonomes.

---

## Why hierarchy at all

Minsky's argument for hierarchy is not that hierarchy is elegant. It is that
without hierarchy, the wiring cost of the mind explodes.

> **Minsky (ONR 1988):** "It would require too many wires to connect every
> agent to every other agent. … In typical applications the required
> numbers of connections per processor will approach a fixed and practical
> bound."

Hierarchy is what lets a finite brain support an enormous society of agents
*without* an exponential growth in connections. It also makes credit
assignment tractable — a higher level can reward or punish a whole agency
without addressing each agent.

**Consequence.** A flat society of LLM agents, however large, cannot scale
without inventing a hierarchy. The question is only whether the hierarchy
is designed or accidental.

---

## Level-bands

Communication does not span the whole stack. Most messages travel only
between adjacent layers, inside a *level-band*.

> **Minsky (ONR 1988):** "Hence relatively few direct connections are
> needed except between adjacent 'level bands'."

Why level-bands matter:

1. **Translation is expensive.** Different levels use different
   representations. Crossing more than one band at a time means doing more
   than one translation, which loses fidelity.
2. **Inhibition is local.** Censors and suppressors fire inside a band;
   they do not reach across the stack.
3. **Authority is local.** A level-band is the unit of *governance*: who
   can override whom, who reports to whom, who escalates to whom.

**Consequence.** Skipping level-bands ("the CEO talks directly to the
factory floor") is rare and expensive in real organisations for the same
reason it is rare and expensive in minds.

---

## Ascending and descending systems

The two flows up and down the hierarchy are *not symmetric*.

| Flow | Direction | Operation | Output |
| --- | --- | --- | --- |
| Ascending | Up | Compression, summarisation, abstraction | Few high-bandwidth, high-meaning signals |
| Descending | Down | Expansion, refinement, decomposition | Many low-bandwidth, low-meaning signals |

> **Minsky:** "The ascending system must compress large amounts of low-level
> information into simpler, more meaningful representations… The descending
> system must convert terse instructions from higher levels into multitudes
> of more specific signals for smaller agents."

The asymmetry has consequences:

- **Different agencies for different directions.** Summary agencies
  (compress upward) are not the same as directive agencies (expand
  downward). They use different representations and have different
  failure modes.
- **Different time scales.** Ascending traffic builds up slowly across many
  inputs; descending traffic resolves a single command into many
  parallel outputs.
- **Different memory needs.** Summary agencies need long context; directive
  agencies need precision and timing.

**SOR mapping.** Assembly agencies and directive agencies are explicitly
distinguished in
[02-protocols/13-hierarchy-and-summaries.md](../THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md).

---

## A-brain and B-brain

> **Minsky:** "Connect the A-brain's inputs and outputs to the real world,
> so it can sense what happens there. But don't connect the B-brain to the
> outer world at all; instead, connect it so that the A-brain is the
> B-brain's world!"

This is one of the most important architectural moves in the book.

The **A-brain** does the work: it sees the world, plans, acts. The
**B-brain** does *not* see the world — it sees only the A-brain. From its
point of view, the A-brain *is* the world.

What does the B-brain do?

- Detects when the A-brain is stuck in loops.
- Detects when the A-brain is repeating itself without progress.
- Detects when the A-brain is committing to one frame too quickly.
- Detects when the A-brain is being too confident.

Note what the B-brain does *not* need: it does not need to understand the
content of the A-brain's thoughts. It only needs to recognise patterns of
activity. This is why introspection feels both real and shallow — the
introspecting layer does not have access to what is being introspected;
it has access only to its shape.

**Generalisation.** The B-brain can be its own A-brain to a C-brain.
Multi-layer reflection is allowed. Each layer sees only the layer below.

**SOR mapping.** Meta-admin agencies in
[03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) — for example
`forgejo-ops-steward` — observe other agencies and the workspace, not the
external world. They are B-brains for the body of the society.

---

## Cross-realm bridges

Different agencies use different internal representations. Vision speaks
pixels; language speaks tokens; planning speaks plans. They cannot directly
share state.

What they share are *bridges*: small specialised agencies that translate
between realms. A bridge agency takes a representation in realm X and
produces a (necessarily approximate) representation in realm Y.

Bridges have specific properties:

1. **They are lossy.** No bridge is round-trip exact.
2. **They have direction.** A bridge from vision to language is not the
   same agency as a bridge from language to vision.
3. **They are themselves learned.** Children spend much of their early
   cognitive growth learning bridges.
4. **They are cheap targets for failure.** When two realms drift, the
   bridge between them silently produces nonsense.

**SOR mapping.** The Forgejo bridge module
([forgejo-intelligence-bridge](../REPO/forgejo-intelligence/.forgejo-intelligence/forgejo-intelligence-bridge/README.md))
is exactly this: a bridge from the Forgejo event realm to the SOR
normalised event realm. The protocol treats it as lossy, directional, and
testable on its own.

---

## Insulation and shared substrate

Two agencies that share a substrate cannot evolve independently. Minsky's
1988 example — a substance S used by both heart and brain — is the
canonical illustration: any improvement to S for one organ regresses the
other.

The architectural answer is **insulation**: deliberate independence
between agencies, with shared state declared explicitly and minimally.

What gets insulated:

- **Internal representations** (each agency owns its own).
- **State stores** (no shared mutable globals between agencies).
- **Dependencies** (each agency owns the libraries it needs; shared
  libraries are themselves treated as agencies).
- **Failure** (when an agency crashes, others keep going).

**SOR mapping.** The insulation protocol
([02-protocols/12-insulation.md](../THE-SOCIETY-OF-REPO/02-protocols/12-insulation.md))
makes this rule explicit and enforceable.

---

## Differentiation as the engine of growth

A society does not get smarter by adding random new agencies. It gets
smarter by **differentiating** existing ones.

The pattern (from the 1988 Duplication Principle):

```text
Agency A handles contexts X and Y, but begins to fail
when X and Y demand incompatible behaviour.
        |
        v
Duplicate A into A_x and A_y.
        |
        v
A_x specialises to X; A_y specialises to Y.
        |
        v
A retires (or remains as a shared base).
```

This is how skills become layered, how K-lines accumulate, and how the
hierarchy deepens. It is also why an old society is not just a young
society with more facts — it is a young society whose agencies have
differentiated under pressure.

**SOR mapping.** Differentiation under
[10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md) is governed:
forking an agency requires settlement, and the new agencies are tracked
separately from their parent.

---

## The role of failure

In this architecture, failure is not the enemy. Failure is the *signal*.

- A frame that produces a wrong default is the cheapest way to learn the
  exception.
- A K-line that activates the wrong agencies is how a new K-line gets
  built.
- A censor that blocks something useful is how the censor gets refined.
- A bridge that drifts is how the realms it connects are noticed.

> **Minsky:** "We can imagine two poles of self-improvement. On one side we
> can try to stretch the range of the ideas we generate: that leads to more
> ideas, but also to more mistakes. Then, on the other side, we try to
> learn not to repeat mistakes we've made before. We know that all
> societies evolve prohibitions and taboos to tell their members what they
> shouldn't do. That, too, must happen in our minds."

**Consequence.** A society without failure memory is a society that cannot
learn. The architecture must make failure cheap, observable, and stored.

**SOR mapping.** Failure memory and the censor layer in
[06-memory/](../THE-SOCIETY-OF-REPO/06-memory/README.md) and
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md).

---

## What this architecture *does not* prescribe

The Society of Mind is a *structure*; it does not prescribe:

- A specific learning algorithm.
- A specific representation language.
- A specific scheduler.
- A specific embodiment.

This is deliberate. The architecture is robust precisely because it is
indifferent to those choices. Many learning algorithms can drive a Society
of Mind. Many representation languages can fill its frames. Many bodies
can host it. The architecture is the part that has to remain stable
across those choices.

**Consequence for the workspace.** SOR adopts the architecture and adds
explicit choices on top: Git as the substrate, Forgejo as the runtime
body, settlements as decision records, structured memory kinds as
representation discipline. None of these choices is forced by Minsky;
all of them are compatible with him.
