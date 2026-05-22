# 08 — Conflict and Non-Compromise

The Society of Mind is built out of agents that disagree. Disagreement
is not a bug; it is the substrate. The interesting question is *how
disagreements get resolved*, and Minsky's answer — developed mainly
across [Chapter 3 *Conflict And Compromise*](book/som-3.1.md) and
[Chapter 27 *Censors And Jokes*](book/som-27.1.md) — is sharper and
stranger than most engineering instincts.

This page is the analytical companion to those two chapters. Every
section links to the book section it annotates, so claims can be
checked against Minsky's own words rather than against paraphrase.
The structure mirrors the order in the book: same-level conflict
first, then the Non-Compromise Principle and its time-pressure
corollaries, then hierarchies and heterarchies, then the special
cases of destruction and of pain/pleasure, then the negative
machinery — demons, suppressors, censors — and finally humour as the
learning channel for inhibition.

---

## What this page annotates

| Theme | Primary book sections |
| --- | --- |
| Same-level conflict; Builder vs Wrecker; activator-deference | [§3.1 *conflict*](book/som-3.1.md) |
| The Principle of Non-Compromise; time pressure; dismissal | [§3.2 *Noncompromise*](book/som-3.2.md) |
| Hierarchies as administration; the bureaucracy quote | [§3.3 *hierarchies*](book/som-3.3.md) |
| Heterarchies; why strict hierarchy breaks; the need for memory | [§3.4 *Heterarchies*](book/som-3.4.md) |
| Destructiveness as constructive housekeeping | [§3.5 *destructiveness*](book/som-3.5.md) |
| Pain and pleasure both simplify the field | [§3.6 *Pain and pleasure simplified*](book/som-3.6.md) |
| Demons; recognition-agents that lurk and wait | [§27.1 *demons*](book/som-27.1.md) |
| Suppressors; "Stop thinking that!" | [§27.2 *suppressors*](book/som-27.2.md) |
| Censors; "Don't even begin to think that!"; their exponential memory cost | [§27.3 *censors*](book/som-27.3.md) |
| Exceptions to logic; islands of consistency; *usual* not *true* | [§27.4 *exceptions to logic*](book/som-27.4.md) |
| Jokes as two-frame mis-direction; Freud's puzzle of nonsense jokes | [§27.5 *jokes*](book/som-27.5.md) |
| Humour as the learning channel for censors; scolding vs laughing | [§27.6 *humor and censorship*](book/som-27.6.md) |
| Laughter as state-freezing for censor construction | [§27.7 *laughter*](book/som-27.7.md) |
| Good humour; conciliation; persistence of self-ideal censors | [§27.8 *good humor*](book/som-27.8.md) |

For each of these book sections the local archive also carries a
companion `*-sor.md` file with an existing implementation-side
analysis; those are cited inline where they sharpen a claim.

---

## Same-level conflict is the primitive case

The simplest case Minsky considers is two agents at the same level,
both subordinate to a common superior, disagreeing about whether to
continue or stop.

> **Minsky** ([§3.1 *conflict*](book/som-3.1.md)):
> "Suppose Wrecker gets aroused, but there's nothing in sight to
> smash. Then Wrecker will have to get some help — by putting Builder
> to work, for example. But what if, at some later time, Wrecker
> considers the tower to be high enough to smash, while Builder wants
> to make it taller still? Who could settle that dispute?"

Two ideas land in this opening:

1. **Disagreement is structural.** Two agencies with internally
   coherent goals will reach contradictory recommendations whenever
   their interests overlap a shared resource (the tower, the hand,
   the next cycle). Disagreement is not pathology; it is what a
   many-agent mind looks like under normal load.
2. **The conflict has no internal solver.** Neither Builder nor
   Wrecker has the standing to settle the dispute on its own terms.
   The settlement, if any, must come from somewhere else.

**Consequence.** Any society that treats disagreement as an exception
will under-build its resolution machinery; any society that treats
it as the default will over-build it. The right posture is to treat
disagreement as the *substrate* of cooperation — common enough to
deserve a first-class record, sharp enough not to be averaged away.

**SOR mapping.** Critics under
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) and the
settlement records under
[02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
make same-level disagreement a first-class record type with its own
fields, not an exception flow.

---

## Why activator-deference is too weak

Before reaching the Non-Compromise Principle, §3.1 considers the
naive policy and rejects it.

> **Minsky** ([§3.1](book/som-3.1.md)):
> "The simplest policy would be to leave that decision to Wrecker,
> who was responsible for activating Builder in the first place. But
> in a more realistic picture of a child's mind, such choices would
> depend on many other agencies."

Activator-deference is the policy of giving the casting vote to
whichever agent caused the other to start running. Minsky names it
only to discard it: it is too local. The realistic picture is that
*both* Builder and Wrecker were activated by a common higher-level
agency (Play-with-Blocks), which is the proper site of resolution.

**Consequence.** Causal precedence is not the same as authority.
Building a system in which "whoever called the function decides" is
fast and wrong: it makes authority an accident of activation order.

**SOR mapping.** Authority in the Society of Repo flows from the
explicit registry at
[01-governance/authority-registry.md](../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md)
— the six values `read`, `draft`, `propose`, `act`, `govern`,
`human` — not from who activated whom. The book's rejection of
activator-deference is therefore directly reflected in the registry's
existence; the companion analysis in
[`book/som-3.1-sor.md`](book/som-3.1-sor.md) notes that this
intentional rejection is itself a design fact worth recording.

---

## The Principle of Non-Compromise

§3.2 is the load-bearing section. Minsky gives the principle a name
and a one-paragraph statement.

> **Minsky** ([§3.2 *Noncompromise*](book/som-3.2.md)):
> "The Principle of Noncompromise: The longer an internal conflict
> persists among an agent's subordinates, the weaker becomes that
> agent's status among its own competitors. If such internal
> problems aren't settled soon, other agents will take control and
> the agents formerly involved will be *dismissed*."

This is the **Non-Compromise Principle (P3)** of
[03-principles.md](03-principles.md). The intuitive engineering
answer to "two agents disagree" is to *blend* them — average their
outputs, weight by confidence, take a vote. Minsky rejects this. The
right move is to abandon both and appeal upward, or to let a rival
take the field. Three reasons compromise corrupts:

1. **Averaging produces nonsense.** Two agencies with internally
   coherent representations rarely produce a coherent representation
   when blended. The blend lives in a region of representation-space
   that neither agency understands.
2. **Averaging corrupts learning.** If an agency is rewarded for the
   average of its output and someone else's, the credit signal it
   receives is muddled. It cannot tell whether its part was good or
   bad. The cache-transfer machinery of
   [05-learning-and-credit-assignment.md](05-learning-and-credit-assignment.md)
   stops working.
3. **Averaging hides the conflict.** The system records "we agreed
   on X" when it should record "we disagreed and chose X under
   settlement". The latter is auditable; the former is not.

> **Minsky** ([§3.2](book/som-3.2.md)):
> "But we should not try to find a close analogy between the
> low-level agents of a single mind and the members of a human
> community. Those tiny mental agents simply cannot know enough to
> be able to negotiate with one another or to find effective ways
> to adjust to each other's interference."

This is the second cut of the principle: even if compromise *worked*
in some abstract sense, the agents at the bottom of a Society of
Mind are too narrow to perform it. Negotiation is a capability of
larger agencies; the low-level workers cannot trade because they
cannot model each other.

**Consequence.** Conflicts must be *resolved*, not *blended*.
Resolution is a structured event with a record. The architecture
must provide the record; the agents themselves cannot.

**SOR mapping.** Settlement is mandatory for cross-agency
disagreements
([02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)).
Implicit blending is a protocol violation. The companion analysis in
[`book/som-3.2-sor.md`](book/som-3.2-sor.md) traces each of §3.2's
nine ideas against the implementation plan.

---

## Time pressure makes conflict expensive

The Non-Compromise Principle is not a statement about a single
moment; it is a statement about *duration*. The longer the conflict
persists, the more it costs.

> **Minsky** ([§3.2](book/som-3.2.md)):
> "So long as playing with blocks goes well, Play can maintain its
> strength and keep control. … However, any conflict inside Play
> will weaken it and make it easier for Eat or Sleep to take over.
> Of course, Eat or Sleep must conquer in the end, since the longer
> they wait, the stronger they get."

Two coupled mechanisms are at work:

- **Weakening from below.** A supervisor whose subordinates cannot
  settle becomes weaker among *its* competitors. The supervisor is
  evaluated on whether its house is in order; deadlock is a failure
  of that evaluation.
- **Strengthening from below in rivals.** Held-down rivals accumulate
  activation while they wait. Delay is itself a force in the system,
  and it acts on the side of whoever is currently being suppressed.

The combination explains why no static analysis of a Society of Mind
will be adequate. The same conflict, settled in one cycle, is a
local cost; left to persist, it migrates upward and re-routes the
whole governing context.

**Consequence.** A society that has no notion of *how long* a
conflict has been running has no way to apply the Non-Compromise
Principle at all. Time-stamping a dispute is not bookkeeping; it is
the only way to detect the conditions under which dismissal becomes
appropriate.

**SOR mapping.** Settlement records carry timestamps; recurring
contestation should aggregate into a higher-level signal (the
companion analysis in [`book/som-3.1-sor.md`](book/som-3.1-sor.md)
flags this as gap G in the current implementation plan, an explicit
acknowledgement that "open disputes" are not yet first-class).

---

## Dismissal is not deletion

A loss in the Society of Mind is not annihilation. §3.2 is explicit
about this.

> **Minsky** ([§3.2](book/som-3.2.md)):
> "Now, when any of our agencies loses the power to control what
> other systems do, that doesn't mean it has to cease its own
> internal activity. An agency that has lost control can continue
> to work inside itself — and thus become prepared to seize a later
> opportunity."

A dismissed agency keeps its representations, keeps its K-lines (see
[06-memory-and-k-lines.md](06-memory-and-k-lines.md)), and keeps its
internal work. What it loses is the *floor* — the ability to make
the rest of the society act on its outputs. The next time conditions
favour it, it is ready to be re-activated rather than rebuilt from
scratch.

**Consequence.** Suppressing an agency must not destroy it.
Architectures that delete losing agents in order to "clean up" are
throwing away the substrate that made later re-activation cheap.
What looks like waste (a dormant agency still computing) is the
mechanism of fast re-entry.

**SOR mapping.** Critics and censors are first-class agencies under
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) and
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md); when an
agency is suppressed in a cycle it is *inhibited*, not removed.
K-lines under
[02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md)
preserve the state needed to re-activate it cheaply.

---

## Conflict migrates upward — and there is no required top

The mechanism of §3.2 chains. A deadlock at level *N* weakens the
parent at level *N+1*; that parent then loses suppression of *its*
rivals; the conflict propagates until something can resolve it or
until a different regime takes over entirely.

> **Minsky** ([§3.1](book/som-3.1.md)):
> "Any prolonged conflict between Builder and Wrecker will tend to
> weaken their mutual superior, Play-with-Blocks. In turn, this will
> reduce Play-with-Blocks' ability to suppress its rivals,
> Play-with-Dolls and Play-with-Animals. Next, if that conflict
> isn't settled soon, it will weaken the agent Play at the
> next-higher level. Then Eat or Sleep might seize control."

The natural follow-up question is: *where does this stop?* Minsky's
answer is deliberately anti-architectural.

> **Minsky** ([§3.2](book/som-3.2.md)):
> "Where does it stop, this process of yielding control to other
> agencies? Must every mind contain some topmost center of control?
> Not necessarily. We sometimes settle conflicts by appealing to
> superiors, but other conflicts never end and never cease to
> trouble us."

There is no required apex. Some conflicts settle by escalation;
others persist indefinitely, working themselves out across long
stretches of the system's life. A mind is not obliged to come to
peace with itself.

**Consequence.** Designs that *insist* on a single root arbiter are
adding structure Minsky's theory does not require. The cost of the
insistence is that the apex becomes the bottleneck the whole
hierarchy was meant to avoid. Architectures that *allow* escalation
to bottom out into "this conflict persists, we move on" are more
honest about the mind they claim to model.

**SOR mapping.** Escalation in the Society of Repo terminates at
the `human` authority level only when the censor or critic layer
demands it; below that, settlements can record "no consensus" as a
legitimate outcome rather than forcing a winner. Meta-admin
agencies under
[03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md)
operate on conflict-shape, not conflict-substance, so they can
arbitrate without modelling either side's internals.

---

## Hierarchy is mostly administration

§3.3 makes a point that is easy to lose: most of what high-level
agents do is *not* productive work. They are supervisors.

> **Minsky** ([§3.3 *hierarchies*](book/som-3.3.md)):
> "As an agent, Builder does no physical work but merely turns on
> Begin, Add, and End. Similarly, Add just orders Find, Put, and Get
> to do their jobs. Then these divide into agents like Move and
> Grasp. … Builder is like a high-level executive, far removed from
> those subordinates who actually produce the final product."

Minsky opens the section with a wry dictionary quotation:

> **Minsky** ([§3.3](book/som-3.3.md)):
> "**bu·reauc·ra·cy** *n.* the administration of government through
> departments and subdivisions managed by sets of officials following
> an inflexible routine."

The point is that bureaucracy is not a pejorative in the Society of
Mind; it is the necessary form. Without administrative agents,
lower-level workers have nothing to coordinate them; with them,
coordination is itself the work.

But Minsky is careful not to overstate the analogy:

> **Minsky** ([§3.3](book/som-3.3.md)):
> "The Builder we described is not much like a human supervisor. It
> doesn't decide which agents to assign to which jobs, because that
> has already been arranged. It doesn't plan its future work but
> simply carries out fixed steps until End says the job is done. Nor
> has it any repertoire of ways to deal with unexpected accidents."

The mental supervisor is narrower than the human supervisor.
Treating them as the same thing imports political assumptions that
do not belong inside the head.

**Consequence.** "Just remove the middle layer" is almost always
wrong. The middle layer is doing real work; it just isn't producing
the final output. Architectures that flatten in pursuit of
"directness" usually rediscover the need for the middle and rebuild
it under a different name.

**SOR mapping.** The runtime pipeline at
[02-protocols/04-activation.md](../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md)
keeps integration and meta-admin as named phases distinct from the
agencies that produce candidate actions, exactly so that
administrative work has a place to live.

---

## Heterarchies and the limit of strict hierarchy

§3.4 punctures the assumption that the previous section might have
encouraged: that every coordinating structure is a clean tree.

> **Minsky** ([§3.4 *Heterarchies*](book/som-3.4.md)):
> "But hierarchies do not always work. Consider that when two agents
> need to use each other's skills, then neither one can be *on top*."

The example is See and Move: See may need Move to clear a line of
sight; Move may need See to check the arm's trajectory. Each is
temporarily the other's subordinate. A strict tree cannot represent
this; a *heterarchy* — a graph with cycles, mediated by working
memory — can.

> **Minsky** ([§3.4](book/som-3.4.md)):
> "If each of See's agents could do only one thing at a time, it
> would soon run out of resources and be unable to solve complicated
> problems. But if we have enough memory, we can arrange our agents
> into circular loops and thus use the same agents over and over
> again to do parts of several different jobs at the same time."

Cycles in the coordination graph are made tractable by *memory*, not
by additional control. The temporary memory of an in-flight job is
what allows See to call Move to call See without losing track of
either's original purpose.

**Consequence.** Hierarchical thinking is a useful first
approximation, but a system that *only* offers hierarchical
composition will hit the See/Move wall the first time two capable
agencies need each other. Memory of in-flight work is not a
nice-to-have; it is the substrate of heterarchical cooperation.

**SOR mapping.** Working memory under
[06-memory-and-k-lines.md](06-memory-and-k-lines.md) and the
in-flight workspace at
[07-workspace/](../THE-SOCIETY-OF-REPO/07-workspace/README.md)
provide exactly this — a place where partial state can survive
re-entry between cooperating agencies.

---

## Destructiveness as housekeeping

§3.5 is short and easy to skip, but it carries a specific claim that
shows up later in the censor machinery: destruction can serve
constructive goals by simplifying the field.

> **Minsky** ([§3.5 *destructiveness*](book/som-3.5.md)):
> "Destructive acts can serve constructive goals by leaving fewer
> problems to be solved. That kick may leave a mess outside, yet
> tidy up the child's mind."

The vengeful kick that smashes the tower when Play is interrupted is
not a breakdown of inner discipline. It is Wrecker, freed from
Play's constraint, taking the one short action that resolves the
unsettled state. The external mess is the cost of an internal
tidy-up.

The deeper point is about what the system does with a context that
can no longer be advanced:

> **Minsky** ([§3.5](book/som-3.5.md)):
> "Besides, it isn't true in a human mind that, when Sleep starts,
> then Play must quit and all its agents have to cease. A real child
> can go to bed — yet still build towers in its head."

Loss of the field is not the same as loss of the agents. Compare
this to the §3.2 point about dismissed agents continuing to work
internally: the same structural fact (an agency keeps running
inside itself after losing control) is what allows both phenomena —
the parting kick and the bedtime tower.

**Consequence.** A system that has no graceful way to *close out* a
context, and no place for losing agencies to continue, will tend to
produce thrash. The "vengeful kick" is the symptom of a missing
closeout step.

**SOR mapping.** Settlements carry a `closed_out` outcome alongside
`action_authorised` and `pending_human`; that is the place where a
context can be ended cleanly without forcing a winner.

---

## Pain and pleasure both simplify

§3.6 closes Chapter 3 with a structural claim about the affective
machinery that is easy to misread as poetic.

> **Minsky** ([§3.6 *Pain and pleasure simplified*](book/som-3.6.md)):
> "When you're in pain, it's hard to keep your interest in other
> things. … Pain's power to distract us from our other goals is not
> an accident; that's how it helps us to survive."

> **Minsky** ([§3.6](book/som-3.6.md)):
> "When something gives you pleasure, then, too, it's hard to think
> of other things. … That's why pleasure is so powerful. It also
> simplifies your point of view."

The pair are *not* opposites in mechanism. Both narrow the field of
active concerns. Both make it harder to maintain the complex
machinery of long-term plans. Both, in excess, "diminish us by
restricting the complexities that constitute our very selves."

The point matters for conflict resolution because it locates strong
affective signals in the same category as censors and suppressors:
they all *remove* options from the active field.

**Consequence.** Affect, censorship, and suppression are members of
the same family — mechanisms for cutting the size of the active
context. A system that treats affect as a separate "feelings layer"
will fail to see its functional similarity to its inhibitory layer.

**SOR mapping.** Energy / weight scalars on signals
([02-protocols/03-events.md](../THE-SOCIETY-OF-REPO/02-protocols/03-events.md))
play the affective role; the censor layer plays the inhibitory
role; both deplete the candidate set the settlement phase has to
consider.

---

## Demons: the recognition primitive under censors

Chapter 27 turns to the negative machinery proper. It opens with a
historical note that doubles as a description of how
condition-watching agents work.

> **Minsky** ([§27.1 *demons*](book/som-27.1.md)):
> "He suggested that whenever we hear about a particular event,
> specific recognition-agents are thereby aroused. These then proceed
> actively to watch and wait for other related types of events.
> (Because these recognition-agents lurk silently, to intervene only
> in certain circumstances, they are sometimes called *demons*.)"

Demons are the substrate of both suppressors and censors. They are
agencies whose contribution is *negative* in two senses: they do not
themselves produce output, and they fire only when a pattern they
have been primed for actually occurs.

Minsky names the tuning problem immediately:

> **Minsky** ([§27.1](book/som-27.1.md)):
> "How easy should it be to activate demons? How long should they
> then remain active? If too few demons are aroused, we'll be slow
> to understand what's happening. But if too many become active,
> we'll get confused by false alarms."

This is the same trade-off that all later censor work inherits:
sensitivity versus precision, recall versus false-positive rate.

**Consequence.** Any inhibitory layer in a Society of Mind has a
tuning problem. There is no "set it once" solution. The cost of
under-tuning (slow understanding) and the cost of over-tuning
(noise) are both real, and the right operating point depends on the
frame the agency is currently inside.

**SOR mapping.** Demons map onto the *condition-watching* critics
under [04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md):
agencies that consume the cycle's signal stream but emit only on
recognised patterns. Their activation thresholds belong in the
critic manifest, not in code.

---

## Suppressors: "Stop thinking that!"

§27.2 introduces suppressors as the first line of inhibitory
defence.

> **Minsky** ([§27.2 *suppressors*](book/som-27.2.md)):
> "Suppressor-agents wait until you get a certain *bad idea*. Then
> they prevent your taking the corresponding action, and make you
> wait until you think of some alternative. If a suppressor could
> speak, it would say, *Stop thinking that!*"

A suppressor is *output-stage*. The agency still ran; it still
produced something; the suppressor caught it before it could affect
anything else. Suppressors are cheap to add because they do not
require understanding *why* the agency was wrong; they just require
recognising the wrong output.

Minsky also names their cost:

> **Minsky** ([§27.2](book/som-27.2.md)):
> "But it is inefficient to wait until we actually reach undesirable
> states, then have to *backtrack*. It would be more efficient to
> anticipate such lines of thought so that we never reach those
> states at all."

The cost of a suppressor is paid in *wasted intermediate work*: the
agency runs to completion, only for the result to be discarded. The
remedy is the censor — but the remedy has its own price, addressed
in §27.3.

**Consequence.** Suppressors are the right tool when the wrong
output is rare and the reasoning that produced it is mostly fine.
They are the wrong tool when the same wrong output keeps occurring
along the same path; in that case the path itself should be cut by
a censor.

**SOR mapping.** Suppressors are the output-stage censors in
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md) that
fire after a candidate action has been produced but before it is
authorised by the settlement phase.

---

## Censors: "Don't even begin to think that!"

§27.3 introduces the censor proper and explains why it is more
efficient — and more expensive to construct — than the suppressor.

> **Minsky** ([§27.3 *censors*](book/som-27.3.md)):
> "Suppressors work by interceding to prevent actions just before
> they would be performed. This leads to a certain loss of time …
> Censors avoid this waste of time by interceding earlier. Instead
> of waiting until an action is about to occur, and then shutting
> it off, a censor operates earlier, when there still remains time
> to select alternatives."

A censor cuts the *line of reasoning* before the wrong output is
produced. Where the suppressor said *Stop thinking that!*, the
censor says:

> **Minsky** ([§27.2](book/som-27.2.md)):
> "Censor-agents need not wait until a certain bad idea occurs;
> instead, they intercept the states of mind that usually precede
> that thought. If a censor could speak, it would say, *Don't even
> begin to think that!*"

The advantage is runtime efficiency. The cost is construction:
recognising preconditions is strictly harder than recognising
outputs.

### The exponential price of moving earlier

The natural follow-up — "why not move the censor even further back
in time?" — has a structural answer.

> **Minsky** ([§27.3](book/som-27.3.md)):
> "As we extend a censor's range back into time, the amount of
> inhibitory memory that would be needed (in order to prevent turns
> in every possible wrong direction) would grow exponentially. To
> solve a complex problem, it is not enough to know what might go
> wrong. One also needs some positive plan."

This is the most important constraint on censor design that Minsky
states explicitly. There is no architecture in which moving every
censor as early as possible is correct. The size of the inhibitory
memory needed grows combinatorially with how far back the censor
reaches. Past some point the censor layer is larger than the rest
of the agency it is meant to govern.

This also explains why censors *and* positive plans must coexist:
inhibition alone cannot solve a problem, because the space of bad
moves outgrows the space of good ones the further back you reach.

**Consequence.** A censor layer must be tuned not only by its
firing rate but by *how early* it fires. Early-firing censors are
fast but memory-hungry; late-firing censors approach suppressors,
losing their main advantage. The healthy distribution is mixed.

**SOR mapping.** The censor manifest in
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md) is the
place to declare a censor's *reach*: how many steps back from the
candidate action it can intercept. Reach is a manifest field, not
an emergent property; making it explicit is what allows the
exponential cost to be budgeted.

### Censors and suppressors must sometimes themselves be suppressed

Minsky closes §27.3 with the inhibitor's paradox.

> **Minsky** ([§27.3](book/som-27.3.md)):
> "Sometimes, though, our censors and suppressors must themselves be
> suppressed. In order to sketch out long-range plans, for example,
> we must adopt a style of thought that clears the mind of trivia
> and sets minor obstacles aside. But that could be very hard to do
> if too many censors remained on the scene; they'd make us shy
> away from strategies that aren't guaranteed to work, and tear
> apart our sketchy plans before we can start to accomplish them."

A society whose censors are always on cannot draft. Long-range
planning, exploratory thinking, and counterfactual reasoning all
require a context in which some censors are temporarily off.

**Consequence.** A censor layer with no off-switch is not safer;
it is more brittle. The architecture must support *modes* in which
selected censors are quiesced — and the choice of which censors to
quiesce must itself be auditable.

**SOR mapping.** Frame-bound activation in
[02-protocols/04-activation.md](../THE-SOCIETY-OF-REPO/02-protocols/04-activation.md)
lets a `draft` or `exploration` frame quiesce specific censors;
the quiescence is recorded as a frame property, not as silent code.

---

## Exceptions to logic: *usual* not *true*

§27.4 makes an epistemological point that anchors the whole
censor/suppressor apparatus.

> **Minsky** ([§27.4 *exceptions to logic*](book/som-27.4.md)):
> "We search for *islands of consistency* within which ordinary
> reasoning seems safe. We work also to find and mark the unsafe
> boundaries of those domains."

Censors are not luxuries on top of a logical engine; they are the
*markers of the boundary*. Inside the islands, ordinary reasoning is
allowed to proceed. Outside, the censor catches the move before it
extrapolates into nonsense.

Minsky then states the principle in its starkest form:

> **Minsky** ([§27.4](book/som-27.4.md)):
> "In ordinary life we have to deal with *usual* instead of *true*."

This is the matching epistemology to defaults under
[07-frames-and-representation.md](07-frames-and-representation.md).
Defaults work because real-world facts are rarely always true;
censors are needed because no representation can foresee every
exception in advance.

> **Minsky** ([§27.4](book/som-27.4.md)):
> "Exceptions are a fact of life because few *facts* are always
> true. Logic fails because it tries to find exceptions to this
> rule."

**Consequence.** A society whose conflict layer is built as if
reasoning were logical proof will fail at the first exception. The
right design is the opposite: assume *usual* is the operative
idiom, and use censors to mark the places where *usual* breaks.

**SOR mapping.** Frame defaults under
[07-frames-and-representation.md](07-frames-and-representation.md)
carry the *usual* claim; critics and censors under
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) and
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md) mark the
boundary of where those defaults stop applying.

---

## Critics

A **critic** is different from both suppressor and censor. A critic
does not suppress; it *evaluates*. It produces a judgement about
the output (good / bad / why) which the rest of the society can use
to decide how to proceed. In Minsky's text the critic-role often
appears under names like "negative recognizer" or "B-brain"; the
clearest single statement in this neighbourhood is the closing of
§27.3.

> **Minsky** ([§27.3](book/som-27.3.md)):
> "Once we recognize the importance of censors and other forms of
> *negative recognizers*, we'll find that they constitute large
> portions of our minds."

Critics enable settlement. Without critics, suppressors and censors
operate blindly: they suppress, but they do not explain. With
critics, the society has *reasons*, and reasons can be discussed.

**Consequence.** A conflict layer with suppressors and censors but
no critics is a conflict layer that cannot teach. The next
suppression looks identical to the previous one; nothing
accumulates. Critics are the part of the conflict layer that *says
why*, and "why" is what makes settlement records useful.

**SOR mapping.** Critics under
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) produce
verdicts with rationale. Settlement uses critic verdicts as
evidence; that is what makes a settlement reviewable later.

---

## The full conflict pipeline

The three roles assemble into a pipeline. Each stage is named in the
book sections cited above; the diagram is just a re-statement.

```text
Agency proposes output
        |
        v
Censor: was the path itself banned?  -- yes --> drop, log, learn
        |
        v
Critic: judge the output             -- bad --> push verdict to settlement
        |
        v
Suppressor: catch known-bad outputs  -- yes --> drop, log, learn
        |
        v
Output is acted on (or escalated).
```

Each stage can record a learning event. A censor that fired records
"this path was correctly banned, and was about to be taken." A
critic that fired records "this output was judged X for reasons Y."
A suppressor that fired records "this output was caught at the
boundary."

**Consequence.** Failure detection happens in three places. A
society that has only one of the three is missing two-thirds of its
learning signal.

---

## Escalation as conflict-shape work

When agencies of equal rank cannot resolve their conflict, they
escalate to a higher rank. The higher rank is *not* expected to know
which agency is right; it is expected to:

1. Recognise that a conflict exists at this level.
2. Decide whether the conflict can be resolved by adopting one
   position, abandoning both, or invoking a different
   representation.
3. Record the decision and its reasoning.

The higher rank does its work *without* needing to model the
internals of the disputing agencies. It works on the *shape* of the
conflict, not its substance. This is structurally identical to how
the B-brain works in [04-architecture.md](04-architecture.md): it
observes patterns of activity in the A-brain without needing to
understand them.

**Consequence.** Escalation is cheap *only if* the escalation
target operates on conflict-shape rather than conflict-substance.
An escalation target that has to fully understand both sides
becomes the bottleneck the hierarchy was meant to avoid.

**SOR mapping.** Settlement protocol
([02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
records escalations and their outcomes; meta-admin agencies in
[03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md)
operate on conflict-shape, never reaching into the disputing
agencies' internals.

---

## Settlement as a durable record

A **settlement** is the durable record of a resolved conflict. It
contains:

- Which agencies were in conflict.
- What each was proposing.
- What evidence each presented (critic verdicts, frame defaults,
  K-lines).
- Which one (if any) prevailed.
- What was abandoned (sometimes both).
- What the higher rank decided and why.
- What learning is to follow (new censor? new critic? new
  suppressor? new differentiation? new K-line?).

Settlements are not bureaucracy. They are the only place in the
architecture where the *reason* for a decision lives. Without
settlements, the next time the same conflict appears, the society
has to re-derive everything; with settlements, it has a precedent.

**Consequence.** A society without settlement records is condemned
to repeat its conflicts. Each repetition is wasted cycles plus a
missed learning event.

**SOR mapping.** Settlement protocol; settlements are first-class
commits under
[06-memory/decisions/](../THE-SOCIETY-OF-REPO/06-memory/decisions/).

---

## Jokes as censor training

§27.5 introduces Freud's two-frame theory of jokes and reaches the
limit Freud himself reached.

> **Minsky** ([§27.5 *jokes*](book/som-27.5.md)):
> "A joke's power comes from a description that fits two different
> frames at once. The first meaning must be transparent and
> innocent, while the second meaning is disguised and reprehensible.
> The censors recognize only the innocent meaning because they are
> too simple-minded to penetrate the forbidden meaning's disguise.
> Then, once that first interpretation is firmly planted in the
> mind, a final turn of word or phrase suddenly replaces it with
> the other one. The censored thought has been slipped through; a
> prohibited wish has been enjoyed."

Freud's puzzle was nonsense jokes — humour that has no obvious
taboo content. Minsky's contribution is to widen the scope of
"censorable" to include *intellectual* failure, not only social
taboo:

> **Minsky** ([§27.5](book/som-27.5.md)):
> "Once we recognize that ordinary thinking, too, requires censors
> to suppress ineffectual mental processes, then all the
> different-seeming forms of jokes will seem more similar. Absurd
> results of reasoning must be tabooed as thoroughly as social
> mistakes and inanities! And that's why stupid thoughts can seem
> as humorous as antisocial ones."

The two-frame mechanism is the same; what differs is the censor
being trained.

**Consequence.** Humour, in Minsky's account, is the mechanism by
which a society *teaches its censors* to recognise paths that
should not be pursued. It is therefore a load-bearing part of how
the inhibitory layer learns, not a decorative one.

---

## Humour as the learning channel for inhibition

§27.6 sharpens the previous point into a functional claim.

> **Minsky** ([§27.6 *humor and censorship*](book/som-27.6.md)):
> "When we learn in a serious context, the result is to change
> connections among ordinary agents. But when we learn in a humorous
> context, the principal result is to change the connections that
> involve our censors and suppressors."

The two learning channels are different on purpose. Scolding tends
to produce suppressors; laughter tends to produce censors. The
distinction matches §27.2 and §27.3: suppressors learn *which
states are undesirable*; censors learn *which states preceded
undesirable states*.

> **Minsky** ([§27.6](book/som-27.6.md)):
> "I suspect that scolding and laughing have somewhat different
> effects: scolding tends to produce suppressors, but laughing tends
> to produce censors."

Minsky also explains why humour is *invisible to itself*:

> **Minsky** ([§27.6](book/som-27.6.md)):
> "Perhaps it has a funny side effect: while shutting off those
> censored thoughts, our censors also shut off thoughts about
> themselves — and make themselves invisible."

The censor that fires also suppresses the agencies that would
otherwise be busy reflecting on it. This is the same opacity that
shows up in [09-self-and-consciousness.md](09-self-and-consciousness.md):
the inhibitory layer's invisibility to introspection is not an
accident.

**Consequence.** Any system that lacks an analogue of humour — a
way to mark "this line of reasoning is silly, do not pursue it
again" with a positive reinforcement — will be slower to learn what
*not* to think. The marker does not have to be funny; it has to
fire on the cheap-to-recognise side and reinforce itself when it
catches a repeat.

**SOR mapping.** Failure memory under
[02-protocols/06-memory.md](../THE-SOCIETY-OF-REPO/02-protocols/06-memory.md)
plus the overconfidence and analogy-overreach critics under
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) jointly
play this role: they mark "do not follow this path again" cheaply,
and they reinforce themselves whenever they catch a repeat.

---

## Laughter as state-freezing for censor construction

§27.7 makes a mechanical claim about laughter that is easy to miss
under the surface peculiarity.

> **Minsky** ([§27.7 *laughter*](book/som-27.7.md)):
> "Laughter seems to freeze one's present state of mind in its
> tracks and hold it up to ridicule. All further reasoning is
> disrupted, and only the joke-thought remains in sharp focus."

Why does the disruption matter? Because building a censor is
expensive:

> **Minsky** ([§27.7](book/som-27.7.md)):
> "By preventing you from *taking seriously* your present thought,
> and thus proceeding to develop it, laughter gives you time to
> build a censor against that state of mind. In order to construct
> or improve a censor, you must retain your records of the recent
> states of mind that made you think the censored thought. This
> takes some time, during which your short-term memories are fully
> occupied — and that will naturally disrupt whichever other
> processes might try to change those memories."

The seemingly grotesque social spectacle of laughter is, on this
account, a memory-preservation mechanism. The recent state of mind
has to be held still long enough for a censor to be carved out of
it. Anything that would over-write the state would defeat the
construction.

**Consequence.** Constructing a new censor requires *freezing the
state that produced the censored thought*. A system that
immediately moves on cannot build censors at all; it can only
suppress. The cost of the freeze is real; it is the necessary
overhead of long-term inhibitory learning.

**SOR mapping.** When a critic verdict or settlement creates a new
censor, the surrounding cycle's signals, frames, and K-lines must
be captured into the censor's manifest so the path-recogniser has
something to fire on. The freeze is the snapshot.

---

## Conciliation: why bad-news mechanisms must be gracious

§27.8 adds a social consideration that matters for any
multi-participant system, human or otherwise.

> **Minsky** ([§27.8 *good humor*](book/som-27.8.md)):
> "But a peculiar problem arises when we tell another person that
> something is wrong, for if this is interpreted as an expression
> of disapproval and rejection, it can evoke a sense of pain and
> loss — and lead to withdrawal and avoidance. Accordingly, to
> point out mistakes to someone whose loyalty and love we want to
> keep, we must adopt some pleasant or conciliatory form. Thus
> humor has evolved its graciously disarming ways to do its
> basically distasteful job!"

The relevance to the Society of Repo is direct: a critic verdict
that reads as pure rejection invites the critiqued agency (or
human) to disengage. The verdict's *form* matters as much as its
content. Minsky's note is the cognitive-evolutionary reason why
this is so.

Minsky also notes the *decay* of jokes with repetition:

> **Minsky** ([§27.8](book/som-27.8.md)):
> "Why, by the way, are jokes usually less funny when heard again?
> Because the censors learn some more each time and prepare to act
> more quickly and effectively."

And the *persistence* of jokes around self-ideal-bound subjects:

> **Minsky** ([§27.8](book/som-27.8.md)):
> "Why do certain kinds of jokes, particularly those about
> forbidden sexual subjects, seem to remain persistently funny to
> so many people? Why do those censors remain unchanged for so
> long? … Because these areas relate to self-ideals, their
> memories, once formed, are slow to change."

Two operational lessons follow. First, the *fading* of a humour
signal over time is a sign that the censor it serves has finished
learning — which is a feature, not a defect. Second, the *failure
to fade* in self-ideal-bound regions is a sign that the censor
there is intentionally slow; rapid revision in that region would
threaten the self-model itself.

**Consequence.** Critic and censor verdicts should be designed to
be received, not just to be correct. And the longevity of an
inhibitory signal is itself diagnostic: a censor that never stops
firing is either operating in a self-ideal-bound region or has been
mis-tuned.

**SOR mapping.** Critic verdicts under
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) carry a
`rationale` field precisely so they can be reviewable rather than
purely judgmental; self-ideal-bound zones map onto the
`govern`-level censors in the authority registry
([01-governance/authority-registry.md](../THE-SOCIETY-OF-REPO/01-governance/authority-registry.md)),
whose slowness to change is by design.

---

## Why repressed conflicts are dangerous

A conflict that is *blended* — in violation of the Non-Compromise
Principle — becomes a hidden tension in the system. The agencies on
both sides drift toward representations that produce blendable
outputs, even at the cost of internal coherence. Over time, both
lose their original capability.

A conflict that is *escalated and settled* — even if neither side
wins — preserves the agencies on both sides. They retain their
representations. They learn from the settlement. The cost is paid
once.

This is the operational form of Minsky's
[§3.2](book/som-3.2.md) point that dismissed agencies continue to
work inside themselves: settlement preserves the loser as a coherent
agency, ready to be re-activated later. Compromise destroys both
parties' coherence, leaving neither ready.

**Consequence.** Compromise is *not* the cooperative move.
Compromise is the move that destroys the substrate of cooperation.
Real cooperation is disagreement, settlement, and durable record.

**SOR mapping.** Settlement is mandatory for cross-agency
disagreements. Implicit blending is a protocol violation. The
record schemas in
[02-protocols/03-events.md](../THE-SOCIETY-OF-REPO/02-protocols/03-events.md)
distinguish "agreed on X" from "settled to X under disagreement"
as separate event types.

---

## What a healthy conflict layer looks like

A society whose conflict layer is working well will exhibit:

1. **Frequent small censor firings** — the cheap learning signal.
2. **Regular critic verdicts with rationale** — the auditable
   evaluation signal.
3. **Occasional suppressor saves** — the boundary catch.
4. **Rare but well-recorded settlements** — the structural
   decisions.
5. **A growing failure memory** — the durable learning.
6. **Visible decreases in repeated mistakes** — the proof that the
   censors and critics are doing their job.
7. **Humour-shaped signals around new mistakes** — the
   reinforcement channel by which censors form ([§27.6](book/som-27.6.md)).
8. **Fading of those humour-shaped signals as the censors mature**
   — the natural decay of a learned inhibition
   ([§27.8](book/som-27.8.md)).

A society whose conflict layer is *not* working well will exhibit:

1. **Outputs that do not feel like any single agency's view** —
   evidence of blending.
2. **Repeated mistakes that no one catches** — censors are missing.
3. **Decisions whose reasoning cannot be reconstructed** —
   settlements are missing.
4. **Critics whose verdicts disagree with eventual outcomes** —
   miscalibrated critics.
5. **Suppressors that fire on the wrong things** — drifted
   suppressors.
6. **A censor layer with no off-switch** — long-range planning
   becomes impossible ([§27.3](book/som-27.3.md) inhibitor's
   paradox).
7. **An apex arbiter that has to model both sides' substance** —
   the escalation target has become the bottleneck.

Both lists are diagnostic. The conflict layer is one of the most
inspectable parts of a Society of Mind, because each of its
mechanisms is supposed to leave a record.

---

## Source map

Sections of *The Society of Mind* this page annotates, with the
local companion archive under [book/](book/):

| Topic | Sections |
| --- | --- |
| Same-level conflict; Builder/Wrecker; activator-deference rejected | [§3.1](book/som-3.1.md) (analysis: [§3.1-sor](book/som-3.1-sor.md)) |
| Non-Compromise Principle; time pressure; dismissal; no required top | [§3.2](book/som-3.2.md) (analysis: [§3.2-sor](book/som-3.2-sor.md)) |
| Hierarchy as administration; bureaucracy quote; supervisor limits | [§3.3](book/som-3.3.md) |
| Heterarchies; cycles; memory as the substrate of mutual call | [§3.4](book/som-3.4.md) |
| Destructiveness as housekeeping; the parting kick | [§3.5](book/som-3.5.md) |
| Pain and pleasure simplify the field | [§3.6](book/som-3.6.md) |
| Demons as recognition-agents; activation/persistence trade-off | [§27.1](book/som-27.1.md) |
| Suppressors; "Stop thinking that!"; backtracking cost | [§27.2](book/som-27.2.md) |
| Censors; "Don't even begin to think that!"; exponential inhibitory memory; inhibitor's paradox | [§27.3](book/som-27.3.md) |
| Exceptions to logic; islands of consistency; *usual* not *true* | [§27.4](book/som-27.4.md) |
| Jokes as two-frame mis-direction; intellectual failure as taboo | [§27.5](book/som-27.5.md) |
| Humour as censor-learning channel; scolding vs laughing; censors invisible to themselves | [§27.6](book/som-27.6.md) |
| Laughter as state-freezing for censor construction; B-brain origin | [§27.7](book/som-27.7.md) |
| Good humour; conciliation; fading of jokes; persistence of self-ideal censors | [§27.8](book/som-27.8.md) |

For the Society of Repo crosswalk of these constructs see
[12-crosswalk-to-society-of-repo.md](12-crosswalk-to-society-of-repo.md);
for the principles see
[03-principles.md](03-principles.md) (P3 Non-Compromise); for the
glossary entries see
[02-glossary.md](02-glossary.md) and the book's own
[glossary](book/som-glossary.md).
