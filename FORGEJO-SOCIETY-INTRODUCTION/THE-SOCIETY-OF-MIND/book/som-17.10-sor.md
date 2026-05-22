# Section 17.10 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.10.md](som-17.10.md) — *Intellectual trauma*
(Minsky, §17.10).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.10 extends attachment-style trauma into the intellectual realm:
the failure of an inference can wound the system the same way social
rejection can. The wound shows up as *avoidance* — refusing to attempt
a class of problem — and is socially licensed by labels like
*talent* and *aptitude* that disguise it as fate.

---

## The ideas Section 17.10 actually carries

1. **Intellectual failure can cause anxiety.** Failure to reach an
   intellectual goal is itself a disturbance, no person required.
2. **Plausible reasoning that yields absurdity is destabilising.**
   "10 is nearly 11" → "10 is nearly 100" challenges the reasoner's
   trust in its own method.
3. **The wound shows as avoidance.** "I just can't do that"
   marks a class of problems the system refuses to attempt.
4. **Cultural labels disguise the wound.** *Aptitude*, *talent*,
   and *gift* let avoidance be read as fate, not as injury.
5. **Censorship may hide the wounding episode itself.** The
   original frightening thought is often unrecoverable.

---

## What the implementation already absorbs

### Internal failure produces a recorded signal (idea 1)

The failure-memory class in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
captures internal failures (a critic objecting, an agency producing
inconsistent output) the same way it captures externally-driven
failures. The pipeline does not require a human reproach to register
something as wrong.

### Suppressors exist (idea 3, partial)

Censors ([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
suppress candidate actions of named kinds. `censor.scope-creep` and
`censor.cloud-egress` block whole *classes* of attempt, not single
attempts. The structural primitive Minsky describes — refusal of an
entire class — is present.

### Settlement records what was *not* attempted (idea 5, partial)

Settlement records carry `suppressed_candidates`
([`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md);
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)).
The plan does *not* let suppressed things disappear silently; a
maintainer can read back what was rejected and why.

---

## What the implementation does not yet take into account

### A — No record of self-inflicted intellectual wounds

Idea 1 needs a memory class for "the system tried to reason and the
reasoning collapsed." `memory/failure/` records *outcome* failures
but not *method-collapse* episodes — the cases where the agency
came back saying "my chain of inference produced nonsense." The
distinction (failure-of-result vs failure-of-confidence) is not in
the class list
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)).

### B — Avoidance is not surfaced as a learned pattern

A censor that learns to fire on a class of attempts is, in Minsky's
terms, an avoidance. The plan has no critic that watches censor
activity for "this censor fires on every instance of class C;
inspect whether the suppression is principled or reflexive." Idea 3's
warning — that avoidance can be a wound — has no detector.

### C — Aptitude-language is in voice rules but not in introspection

[AGENTS.md](../../../AGENTS.md) §4 forbids hype about intelligence,
but the *introspection* surface
([`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md))
has no rule against the society reporting "this society does not
attempt task class C because such tasks are beyond its capacity."
The "predestined fate" framing Minsky flags is not blocked from
self-reports.

### D — Censored episodes are not specially marked

Idea 5: the wounding episode may itself be censored, and so
unrecoverable. The plan's `suppressed_candidates` field
([`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md))
keeps the censored item, but only at the moment of censorship.
Older censored episodes are not aggregated into a "what we have
collectively refused to think about" register that a maintainer
could audit.

### E — No periodic re-attempt of avoided classes

Idea 3 is most concerning when avoidance is *permanent*. The plan
has no scheduled "shadow attempt at a class we usually suppress to
see whether it would now succeed." A wound, once formed, is forever.

### F — Recovery from intellectual wounds is undefined

Parallel to §17.9 gap D: even if a wound is detected, the plan has
no `recovery_policy` for how to rehabilitate a suppressed class
beyond a maintainer's manual edit of the offending censor.

---

## Summary table

| # | Idea from §17.10 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | Intellectual failure causes anxiety | Partial | Failure recorded; method-collapse class absent (gap A). |
| 2 | Absurd plausible reasoning destabilises | Partial | Critics catch absurdity; no record of trust-loss (gap A). |
| 3 | Wound shows as avoidance | No | No detector for reflexive censor patterns (gap B). |
| 4 | Cultural labels disguise the wound | Partial | Voice rules ban hype; introspection has no equivalent rule (gap C). |
| 5 | Wounding episode may be censored | Partial | Censored items kept at moment; no historical register (gap D). |
| — | Periodic re-attempt of avoided classes | No | No scheduled re-attempt (gap E). |
| — | Recovery procedure | No | Manual only (gap F). |

---

## Implication for the plan (no changes proposed here)

§17.10 extends the chapter's account of injury into the *cognitive*
realm. The plan honours the underlying mechanics — failure memory,
censors, suppressed-candidates — but treats avoidance as a feature,
not as a potential injury. The missing pieces are a *method-collapse*
memory class, a *reflexive-censor* detector, an introspection rule
against aptitude-style self-reports, and a *re-attempt* schedule.
Closing these would touch the class list in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the meta-admin family in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
and the introspection protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
