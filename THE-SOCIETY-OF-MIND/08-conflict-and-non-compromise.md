# 08 — Conflict and Non-Compromise

The Society of Mind is built out of agents that disagree. Disagreement is
not a bug; it is the substrate. The interesting question is *how
disagreements get resolved*, and Minsky's answer is sharper and stranger
than most engineering instincts.

This page collects the conflict-resolution machinery: censors,
suppressors, critics, the Non-Compromise Principle, escalation, and the
role of humour.

---

## The default move is *not* compromise

The intuitive engineering answer to "two agents disagree" is to *blend*
them: average their outputs, weight them by confidence, take a vote.
Minsky rejects this almost entirely.

> **Minsky:** "When agents [of equal rank] conflict, don't try to satisfy
> them both. It's better to abandon both and try to find another one —
> perhaps by appealing to agents of higher rank."

This is the **Non-Compromise Principle (P3)**. Three reasons it is right:

1. **Averaging produces nonsense.** Two agencies with internally
   coherent representations rarely produce a coherent representation
   when blended. The blend lives in a region of representation-space
   that neither agency understands.
2. **Averaging corrupts learning.** If an agency is rewarded for the
   average of its output and someone else's, the credit signal it
   receives is muddled. It cannot tell whether its part was good or
   bad.
3. **Averaging hides the conflict.** The system records "we agreed on
   X" when it should record "we disagreed and chose X under settlement".
   The latter is auditable; the former is not.

**Consequence.** Conflicts must be *resolved*, not *blended*. Resolution
is a structured event with a record.

---

## Censors and suppressors

Two related but distinct mechanisms.

### Suppressors

A **suppressor** prevents the output of an agency from being acted on. The
agency still ran; it still produced something; the suppressor caught it
before it could affect anything else.

Suppressors are *output-stage*. They are reactive. They are cheap to add
because they do not require understanding why the agency was wrong; they
just require recognising the wrong output.

### Censors

A **censor** prevents the agency from running in the first place — or
prevents the kind of *path* that leads to the wrong output. Censors are
*upstream*. They suppress not the conclusion but the line of reasoning.

> **Minsky:** "Censors don't suppress the bad ideas themselves; they
> suppress whatever processes were about to produce those ideas."

Censors are more expensive to build (they require pattern recognition on
*processes*, not on outputs), but they are more efficient at runtime
(they save the cost of the agency running at all).

### When to use which

| Situation | Use |
|---|---|
| The output is wrong but the reasoning is mostly right | Suppressor |
| The reasoning itself was a known dead-end | Censor |
| The output is fine but the cost of producing it was wasteful | Censor |
| The output looks fine but is subtly inappropriate to the context | Suppressor |

A mature society uses both. Censors handle the recurring wrong patterns.
Suppressors handle the residual surprises.

**SOR mapping.** Censors and suppressors are first-class agencies under
[05-censors/](../THE-SOCIETY-OF-REPO/05-censors/README.md). They are
explicitly distinguished by where they fire in the loop.

---

## Critics

A **critic** is different from both. A critic does not suppress; it
*evaluates*. It produces a judgement about the output (good / bad / why)
which the rest of the society can use to decide how to proceed.

> **Minsky:** "Critics are like teachers who do not give us answers but
> instead point out what is wrong with our own."

Critics enable settlement. Without critics, suppressors and censors
operate blindly: they suppress, but they do not explain. With critics,
the society has *reasons*, and reasons can be discussed.

**SOR mapping.** Critics under
[04-critics/](../THE-SOCIETY-OF-REPO/04-critics/README.md) produce verdicts
with rationale. Settlement uses critic verdicts as evidence.

---

## The full conflict pipeline

Putting the three together:

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
Output is acted on.
```

Each stage can record a learning event. A censor that fired records "this
path was correctly banned, and was about to be taken." A critic that
fired records "this output was judged X for reasons Y." A suppressor that
fired records "this output was caught at the boundary."

**Consequence.** Failure detection happens in three places. A society
that has only one of the three is missing two-thirds of its learning
signal.

---

## Escalation

When agencies of equal rank cannot resolve their conflict, they escalate
to a higher rank. The higher rank is *not* expected to know which agency
is right; it is expected to:

1. Recognise that a conflict exists at this level.
2. Decide whether the conflict can be resolved by adopting one position,
   abandoning both, or invoking a different representation.
3. Record the decision and its reasoning.

The higher rank does its work *without* needing to model the internals of
the disputing agencies. It works on the *shape* of the conflict, not its
substance.

This is structurally identical to how the B-brain works: it observes
patterns of activity in the A-brain without needing to understand them.

**Consequence.** Escalation is cheap *only if* the escalation target
operates on conflict-shape rather than conflict-substance. An escalation
target that has to fully understand both sides becomes the bottleneck
the hierarchy was meant to avoid.

**SOR mapping.** Settlement protocol
([02-protocols/05-settlement.md](../THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md))
records escalations and their outcomes; meta-admin agencies in
[03-agencies/](../THE-SOCIETY-OF-REPO/03-agencies/README.md) operate on
conflict-shape.

---

## Settlement as a record

A **settlement** is the durable record of a resolved conflict. It contains:

- Which agencies were in conflict.
- What each was proposing.
- What evidence each presented (critic verdicts, frame defaults,
  K-lines).
- Which one (if any) prevailed.
- What was abandoned (sometimes both).
- What the higher rank decided and why.
- What learning is to follow (new censor? new critic? new suppressor?
  new differentiation? new K-line?).

Settlements are not bureaucracy. They are the only place in the
architecture where the *reason* for a decision lives. Without
settlements, the next time the same conflict appears, the society has to
re-derive everything; with settlements, it has a precedent.

**Consequence.** A society without settlement records is condemned to
repeat its conflicts. Each repetition is wasted cycles plus a missed
learning event.

**SOR mapping.** Settlement protocol; settlements are first-class commits.

---

## Humour as a censor

The humour passages in the book are not light relief; they are the
clearest illustration of how a censor reinforces itself.

> **Minsky:** "Humour is a way of dealing with situations in which our
> usual modes of thought fail. … When we recognise that our reasoning is
> faulty, we may experience surprise; if a sufficient amount of pleasure
> accompanies that surprise, we call the experience 'humour'."

The structure:

- A reasoning path begins to form.
- A censor recognises the path as one of a known bad family
  (over-extension, false analogy, category error).
- The censor fires *and* releases a small pleasure signal.
- The reasoning path is abandoned.
- The censor is reinforced.

This explains why humour is so often about prohibitions and mistakes. It
is the felt-experience of a censor catching something. The pleasure is
the reinforcement.

It also explains why humour is *invisible to itself*: the censor that
fires also suppresses the agencies that would otherwise be busy
reflecting on it.

> **Minsky:** "When humour turns off other thoughts, it also shuts off
> thoughts about itself — and thus becomes invisible."

**Generalisation.** Any system that lacks an analogue of humour — a way
to mark "this line of reasoning is silly, do not pursue it again" with a
positive reinforcement — will be slower to learn what *not* to think.

**SOR mapping.** Failure memory plus the overconfidence and
analogy-overreach critics jointly play this role: they mark "do not
follow this path again" cheaply, and they reinforce themselves whenever
they catch a repeat.

---

## Why repressed conflicts are dangerous

A conflict that is *blended* (against the Non-Compromise Principle)
becomes a hidden tension in the system. The agencies on both sides drift
toward representations that produce blendable outputs, even at the cost
of internal coherence. Over time, both lose their original capability.

A conflict that is *escalated and settled* — even if neither side wins —
preserves the agencies on both sides. They retain their representations.
They learn from the settlement. The cost is paid once.

> **Minsky:** "It is better to lose a battle than to muddle a
> representation."

(Paraphrase. The book makes this point repeatedly without giving it a
single quotable line.)

**Consequence.** Compromise is *not* the cooperative move. Compromise is
the move that destroys the substrate of cooperation. Real cooperation is
disagreement, settlement, and durable record.

**SOR mapping.** Settlement is mandatory for cross-agency disagreements.
Implicit blending is a protocol violation.

---

## What a healthy conflict layer looks like

A society whose conflict layer is working well will exhibit:

1. **Frequent small censor firings** — the cheap learning signal.
2. **Regular critic verdicts with rationale** — the auditable
   evaluation signal.
3. **Occasional suppressor saves** — the boundary catch.
4. **Rare but well-recorded settlements** — the structural decisions.
5. **A growing failure memory** — the durable learning.
6. **Visible decreases in repeated mistakes** — the proof that the
   censors and critics are doing their job.

A society whose conflict layer is *not* working well will exhibit:

1. **Outputs that do not feel like any single agency's view** —
   evidence of blending.
2. **Repeated mistakes that no one catches** — censors are missing.
3. **Decisions whose reasoning cannot be reconstructed** — settlements
   are missing.
4. **Critics whose verdicts disagree with eventual outcomes** —
   miscalibrated critics.
5. **Suppressors that fire on the wrong things** — drifted
   suppressors.

Both lists are diagnostic. The conflict layer is one of the most
inspectable parts of a Society of Mind, because each of its mechanisms
is supposed to leave a record.
