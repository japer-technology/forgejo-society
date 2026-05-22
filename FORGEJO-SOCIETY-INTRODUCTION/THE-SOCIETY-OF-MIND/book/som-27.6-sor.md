# Section 27.6 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-27.6.md](som-27.6.md) — *Humor and censorship*
(Minsky, §27.6).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§27.6 makes a claim that few other sections of *Society of Mind*
make: humor is not a luxury but a *learning channel*, and
specifically the channel by which censors are formed and updated. It
also draws a sharp distinction between *positive* memory (which
mental states are desirable) and *negative* memory (which ones are
not), and proposes that these need different signals — encouragement
for the first, scorn or laughter for the second.

---

## The ideas Section 27.6 actually carries

1. **Humor changes censor connections, not ordinary ones.** Its
   pedagogical target is the inhibitory machinery.
2. **Two kinds of learning need two kinds of signal.** Positive
   reinforcement updates proposers; scorn / laughter updates
   suppressors / censors.
3. **Scolding tends to produce suppressors; laughing tends to produce
   censors.** Different social signals, different agent types.
4. **Building a censor freezes short-term memory.** The recent state
   trace must be preserved long enough for the censor to learn the
   precursor.
5. **Censors hide themselves.** While shutting off the censored
   thought, they shut off thoughts about themselves.
6. **Inappropriate comparison is a productive error.** Metaphor and
   analogy are valuable *and* mistake-prone, which is why so many
   jokes target them.
7. **Some intellectual mistakes are self-detectable.** A tower
   falling teaches without a parent's scolding.

---

## What the implementation already absorbs

### Two channels for two kinds of memory (idea 2, in part)

The plan does keep positive and negative memory in different
categories:
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
distinguishes semantic memory (what the society knows), episodic
memory (what it did), and the policy / censor manifests (what it
must not do). The git log applies to both. So the *storage* split is
real, even though the *learning signal* split is not (see gap A).

### Self-detection of intellectual mistakes (idea 7)

The critic family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
— `evidence`, `consistency`, `coherence` — detects intellectual
failure without requiring an external scolder. The runtime applies
them automatically. This corresponds to Minsky's tower-falling
example: the society itself notices the loop or contradiction.

### Building a censor requires the recent state trace (idea 4)

The settlement record in
[`THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/05-settlement.md)
captures contributing signals and the deliberation trace, which is
the structural prerequisite for ever learning "this precursor leads
to that bad outcome." The trace is there; the *learning step that
reads it* is not (gap A below).

---

## What the implementation does not yet take into account

### A — No distinct signal for "form a censor"

Idea 1 — that humor is the channel that updates censors specifically
— has no counterpart in the plan. `evolution/reinforcement-log.md`
records outcomes generically; it does not distinguish "this should
strengthen proposer X" from "this should create a censor against
precursor Y." Without that distinction, the positive and negative
learning loops cannot run on different schedules with different
guardrails.

### B — Scolding versus laughing not modelled

Idea 3 implies *two* negative signals with different effects: scolds
build suppressors (late, terminal); laughs build censors (early,
deflective). The plan's objection schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
carries only `reason`; there is no field that marks the negative
feedback as "block this kind of action" versus "rule out this kind
of precursor." So even if a learning loop existed (gap A), it could
not yet route the feedback differently.

### C — Censors-hide-themselves has no audit counterpart

Idea 5 is a real worry for an auditable system. If a class of
agencies tends to silence reflection on its own activity, audit
becomes harder. The plan's introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md)
asks the society to report `blind_spots`, but no censor manifest is
*required* to declare what reflection it suppresses. A censor that
silently filters introspection traffic could go unrecorded.

### D — Metaphor and analogy as productive-but-risky processes (idea 6)

The plan has no first-class representation of *analogical* reasoning
distinct from literal reasoning. Frames and polynemes can carry
analogy structurally, but the runtime pipeline does not mark a
particular draft as "produced by analogy from frame F." Without that
marker, the productive-but-error-prone class cannot get its own
critics.

### E — Humor as a mechanism (whole section)

The plan does not represent humor at all. This is correct for now,
but it should be recorded that the *mechanism* §27.6 proposes —
negative learning routed through a distinct affective channel — has
no analogue. The closest piece is the deliberate ban in
[AGENTS.md](../../../AGENTS.md) on emoji-as-decoration and
anthropomorphic flourishes, which is a *suppression* of humor, not a
use of it.

---

## Summary table

| # | Idea from §27.6 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Humor updates censors specifically | No | One generic reinforcement log (gap A). |
| 2 | Two kinds of learning need two kinds of signal | Partial | Two memory categories exist; one learning signal (gap A). |
| 3 | Scolding vs laughing distinction | No | Objection schema has no negative-signal subtype (gap B). |
| 4 | Building a censor freezes short-term memory | Partial | Settlement trace preserves precursor; no learner reads it. |
| 5 | Censors hide themselves | No | No required declaration of suppressed reflection (gap C). |
| 6 | Inappropriate comparison is productive | No | Analogical reasoning not marked separately (gap D). |
| 7 | Some mistakes are self-detectable | Yes | Critic family fires automatically. |

---

## Implication for the plan (no changes proposed here)

§27.6 stresses that *how* a society receives negative feedback
shapes what kind of agent it learns to be. The plan has the
infrastructure to record outcomes but not the typing to route them
into the right learner. The auditability worry (gap C) is the more
interesting one: a censor that silently filters reflection is hard
to detect by construction, and the introspection protocol could
require censor manifests to declare their reflection scope.

Any move to close these would touch the credit-assignment protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/10-credit-assignment.md),
the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md),
the signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
