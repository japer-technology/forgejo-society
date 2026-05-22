# 04 — Architecture

The Society of Mind is not just a list of agent kinds; it is an architecture.
This page draws out that architecture explicitly: how agencies are stacked,
how information flows, where the boundaries are, what the load-bearing
asymmetries look like, and which structural choices are doing the most work.

---

## Sources in the book

The architectural claims on this page are not collected in one place in
Minsky. They are spread across the book and the 1988 ONR Final Report.
Each subsection below is anchored to its primary source so the argument
can be checked against the original:

| Topic on this page | Primary source(s) |
| --- | --- |
| Why hierarchy at all | [book/som-3.3.md](book/som-3.3.md) *hierarchies*; [research/1988.md](research/1988.md) (wiring cost) |
| Hierarchies and heterarchies | [book/som-3.4.md](book/som-3.4.md) *heterarchies* |
| Level-bands (architectural) | [research/1988.md](research/1988.md); echoed in [book/som-8.11.md](book/som-8.11.md) *layers of societies* |
| Level-bands (K-line / default-reasoning sense) | [book/som-8.5.md](book/som-8.5.md) *level-bands* |
| Ascending and descending systems | [research/1988.md](research/1988.md) |
| A-brain and B-brain | [book/som-6.4.md](book/som-6.4.md) *B-Brains*; reinforced in [book/som-8.11.md](book/som-8.11.md) |
| Layers of societies (developmental) | [book/som-8.11.md](book/som-8.11.md) *layers of societies* |
| Cross-realm bridges | [book/som-29.3.md](book/som-29.3.md) *paranomes*; [book/som-29.4.md](book/som-29.4.md) *cross-realm correspondences* |
| Insulation and shared substrate | [research/1988.md](research/1988.md) (substance-S example) |
| Differentiation as the engine of growth | [research/1988.md](research/1988.md) (Duplication Principle); gestured at in [book/som-17.1.md](book/som-17.1.md) *Development* |
| The role of failure | [book/som-3.5.md](book/som-3.5.md) *destructiveness*; [book/som-27.3.md](book/som-27.3.md) *censors* |

When a subsection below quotes Minsky, the quote is drawn from one of
these sources; the section pointer is given inline.

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

Minsky's argument for hierarchy is not that hierarchy is elegant. It is
worked out twice, in two different registers.

In the book (§3.3 *hierarchies*), the argument is functional. Builder
turns on Begin, Add, and End; Add orders Find, Put, and Get; those split
again into Move and Grasp; eventually the chain ends in muscle-motor
agents that actually move a finger.

> **Minsky (§3.3):** "When any enterprise becomes too complex and large
> for one person to do, we construct organizations in which certain
> agents are concerned, not with the final result, but only with what
> some other agents do."

Hierarchy is what lets the high-level agent stay small: Builder does no
physical work; it only routes.

In the 1988 ONR report, the same argument is made in connectionist
terms — as a wiring economy.

> **Minsky (ONR 1988):** "It would require too many wires to connect
> every agent to every other agent. … In typical applications the
> required numbers of connections per processor will approach a fixed
> and practical bound."

Hierarchy is what lets a finite brain support an enormous society of
agents *without* an exponential growth in connections. It also makes
credit assignment tractable — a higher level can reward or punish a
whole agency without addressing each agent.

**Consequence.** A flat society of LLM agents, however large, cannot
scale without inventing a hierarchy. The question is only whether the
hierarchy is designed or accidental.

---

## Hierarchies and heterarchies

Pure hierarchy is unstable as soon as two agencies need each other's
skills. The book makes this explicit (§3.4 *heterarchies*) with the
canonical See/Move example: to decide whether a scene contains three
blocks or two, See may need to ask Move to clear the line of sight;
but to move, Move must in turn ask See whether anything is in the
arm's trajectory.

> **Minsky (§3.4):** "When two agents need to use each other's skills,
> then neither one can be *on top.* … This would be impossible inside
> a simple hierarchy."

Three consequences for the architecture:

1. **Loops are required.** Beyond a certain complexity, agencies form
   *heterarchies* — cross-connected rings — rather than trees. The
   architectural picture above is therefore best read as "hierarchy
   plus loops", never as a strict tree.
2. **Loops require memory.** As soon as an agency can re-enter itself,
   it needs a way to remember "what I was doing before I was
   interrupted". §3.4 introduces this as the structural reason memory
   becomes load-bearing in the rest of the book.
3. **Roles are relative.** "To Builder, Add is a subordinate; to Find,
   Add is a boss." Authority is not a global property; it is local to
   the question being asked.

**SOR mapping.** Heterarchical loops are why agencies in
[03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) hand off
through *signals* and *settlements*, not through call/return: the
caller need not stay on the stack waiting for the callee. The memory
discipline in [02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md)
is what makes resumption safe.

---

## Level-bands

The phrase *level-band* is used in two related senses across Minsky's
work. Both matter for the architecture, and conflating them obscures
what each is doing.

**Sense 1 — connectivity (ONR 1988).** Communication does not span the
whole stack. Most messages travel only between adjacent layers.

> **Minsky (ONR 1988):** "Hence relatively few direct connections are
> needed except between adjacent 'level bands'."

Why this sense of level-band matters:

1. **Translation is expensive.** Different levels use different
   representations. Crossing more than one band at a time means doing
   more than one translation, which loses fidelity.
2. **Inhibition is local.** Censors and suppressors fire inside a band;
   they do not reach across the stack.
3. **Authority is local.** A level-band is the unit of *governance*:
   who can override whom, who reports to whom, who escalates to whom.

**Consequence.** Skipping level-bands ("the CEO talks directly to the
factory floor") is rare and expensive in real organisations for the
same reason it is rare and expensive in minds.

**Sense 2 — attachment strength (book §8.5).** When a K-line learns,
it does not attach to every active agent with equal firmness. There is
a strongly attached central band and weaker fringes above and below.

> **Minsky (§8.5):** "We make strong connections at a certain level of
> detail, but we make weaker connections at higher and lower levels."

This is what makes default reasoning possible at all: fringe agents
supply assumptions (Jack's kite is red and diamond-shaped) that are
easily displaced when better information arrives. The same level-band
discipline is then re-applied to the K-society itself (§8.9) so that
trees of K-lines do not collect too much unrelated detail.

The two senses connect in §8.11: the band that is *strongly attached*
on the K-side tends to coincide with the band that is *most cheaply
addressable* by an overseeing agency, which is what makes B-brain
control (next section) practical at all.

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

> **Minsky (§6.4):** "Connect the A-brain's inputs and outputs to the
> real world, so it can sense what happens there. But don't connect
> the B-brain to the outer world at all; instead, connect it so that
> the A-brain is the B-brain's world!"

This is one of the most important architectural moves in the book.

The **A-brain** does the work: it sees the world, plans, acts. The
**B-brain** does *not* see the world — it sees only the A-brain. From
its point of view, the A-brain *is* the world.

§6.4 enumerates the A-shapes B might learn to recognise and act on,
and the list is worth keeping intact:

- A seems disordered and confused → inhibit that activity.
- A appears to be repeating itself → make A stop; do something else.
- A does something B considers good → make A remember this.
- A is occupied with too much detail → make A take a higher-level view.
- A is not being specific enough → focus A on lower-level details.

Note what the B-brain does *not* need: it does not need to understand
the *content* of the A-brain's thoughts. It only needs to recognise
patterns of activity — what §6.4 frames as a counsellor or management
consultant who can diagnose a client's mental strategy without
mastering the client's profession. This is why introspection feels
both real and shallow: the introspecting layer does not have access to
*what* is being introspected; it has access only to its *shape*.

§6.4 immediately admits two caveats. First, B can become a *nuisance*
— suppressing a column-addition loop as if it were idle repetition,
producing the experience of boredom. Second, "there is no reason to
stop with only two levels": a C-brain can watch B, and so on, but
tight A↔B coupling can make the whole system unstable, so the regress
is bounded in practice rather than in principle.

**SOR mapping.** Meta-admin agencies in
[03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) — for
example `forgejo-ops-steward` — observe other agencies and the
workspace, not the external world. They are B-brains for the body of
the society. The nuisance-risk caveat is why those agencies require
human confirmation before acting on A.

---

## Layers of societies (developmental)

§8.11 (*layers of societies*) extends the A/B picture into a
developmental architecture, and it is the section that most directly
constrains how a Society-of-Mind system should *grow* over time.

Minsky starts with an S-society of original agents. As K-lines learn
on top of S, they form a K-society. If new K-lines are linked only to
older K-lines, addressing the original S-agents becomes increasingly
indirect, and the system slows down. The architectural fix is to
arrange the K-society as a *layer* close to its S-society, so K and S
keep cross-talking.

> **Minsky (§8.11):** "As S-agents excite K-agents and vice versa, a
> sort of spiraling activity would ensue. Over time, the location of
> that activity might tend to drift upward or down and might also tend
> to spread out; without some control, the system might soon become
> chaotic."

Two architectural ideas fall out of this:

1. **B-brains control the level of activity, not its content.** A
   third agency confines the K/S spiral by selecting which level-band
   stays active and suppressing the rest — exactly the coarse control
   §6.4 attributed to the B-brain. This is the bridge between the
   B-brain mechanism and the level-band mechanism.
2. **Development is a sequence of layers.** New layers form on top of
   layers that have stopped changing. Each new layer "begins as a
   student, learning new ways to use what older layers can already
   do"; once it stabilises, "yet another new layer can begin to learn
   to exploit the capabilities of the last."

**Consequence.** Growth is not "add more agencies" but "wait for a
layer to settle, then build the next layer on top of it." Layers that
keep changing cannot be exploited by anything above them.

**SOR mapping.** This is the structural reason
[10-evolution/](../THE-SOCIETY-OF-REPO/10-evolution/README.md) treats
layer stability — settlements that have stopped accumulating
amendments, K-lines whose reuse has plateaued — as a *prerequisite*
for opening the next round of differentiation. Building on a still-
changing substrate is the architectural mistake §8.11 warns against.

---

## Cross-realm bridges

Different agencies use different internal representations. Vision speaks
pixels; language speaks tokens; planning speaks plans. They cannot directly
share state. The book treats this directly in §29 *The Realms of
Thought*: each realm has its own vocabulary, its own typical
operations, and its own characteristic failures.

> **Minsky (§29.4):** "Cross-realm correspondences" — the work the
> mind has to do to make a token in one realm count as the "same
> thing" as a structure in another.

What realms share are *bridges*: small specialised agencies that
translate between realms. A bridge agency takes a representation in
realm X and produces a (necessarily approximate) representation in
realm Y. §29.3 calls the entities that fire across realms in parallel
*paranomes*; the bridge is what *makes* the parallel firing meaningful.

Bridges have specific properties:

1. **They are lossy.** No bridge is round-trip exact.
2. **They have direction.** A bridge from vision to language is not the
   same agency as a bridge from language to vision.
3. **They are themselves learned.** Children spend much of their early
   cognitive growth learning bridges.
4. **They are cheap targets for failure.** When two realms drift, the
   bridge between them silently produces nonsense.

**SOR mapping.** The Forgejo bridge module
([forgejo-intelligence-bridge](../../FORGEJO-SOCIETY/forgejo-intelligence/.forgejo-intelligence/forgejo-intelligence-bridge/README.md))
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

The pattern (from the 1988 Duplication Principle; the book gestures at
the same dynamic in §17.1 *Development*, where new skills form by
specialising older ones under pressure rather than by acquiring
unrelated facts):

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
The book treats this from two angles: §3.5 *destructiveness*, where
agencies that go wrong are how the society learns what *not* to do, and
§27 *censors and jokes*, where the censor layer is literally built out
of remembered failures.

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
