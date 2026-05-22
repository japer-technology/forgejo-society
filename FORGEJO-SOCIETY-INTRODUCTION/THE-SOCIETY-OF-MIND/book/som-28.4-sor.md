# Section 28.4 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-28.4.md](som-28.4.md) — *Mind over matter*
(Minsky, §28.4).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§28.4 makes a specific claim about apparently natural feelings: pain
and hunger are not inherent in injury or starvation; they are
*engineered* warning systems built by long evolution to fire *before*
genuine depletion. Higher-level feelings — fatigue, discouragement —
borrow that same warning machinery. The will is not a separate force
that overrules biology; it is a re-ordering of priorities among signals
that the mind itself produced.

---

## The ideas Section 28.4 actually carries

Pulled from Minsky's text:

1. **Warning signals are engineered, not inherent.** A car does not
   feel anything when its tire is punctured. Pain in a body required
   millions of years of selection to install.
2. **Useful warnings anticipate; they do not coincide with depletion.**
   A signal that arrives at the moment of failure is useless. Pain
   and hunger arrive in time to act.
3. **Higher-level discouragement borrows lower-level machinery.**
   Boredom and frustration feel like fatigue because they piggyback
   on the same ancient warning system.
4. **"Mind over matter" is priority re-ordering, not overruling.**
   Persisting beyond what looks tolerable does not require a
   supernatural force; the warnings can be down-weighted.
5. **What is *felt* is partly cultural.** The threshold of what counts
   as pain or fatigue depends on context and convention.
6. **Signals are not the conditions they signal.** Conflating the
   warning with the underlying state is the same mistake §28.1
   warned about with mental energy.

---

## What the implementation already absorbs

### Warning signals are engineered (idea 1)

The censor and suppressor catalogue in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
and
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is, in §28.4's terms, a hand-built warning system. Nothing in the
runtime experiences danger; danger is what
`suppressor.workflow-diff-keywords`, `suppressor.soul-file-diff`, and
`suppressor.high-entropy-string` *declare*. The danger-zone schema
makes each warning explicit: paths, content matchers, what is removed
from the tool surface, what is required before proceeding.

### Warnings fire before depletion (idea 2)

The danger zones in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
fire *before tool grant* and *before the candidate output crosses an
effect boundary*. The approval-gate fires *before* a human-required
action runs, not after. The candidate-future-branch policy in the
same document means write attempts to `main` are diverted to a branch
*before* the merge would happen. These are anticipatory signals in
exactly Minsky's sense.

### Priority re-ordering, not overruling (idea 4)

The authority ceiling in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
("an agency may operate at or below its declared level… a frame may
*lower* the ceiling… A frame may *not* raise it") is exactly priority
re-ordering. A frame like `security-sensitive` lowers
`code.implementer` from `act` to `propose` — the warning's effect is
re-prioritisation of what is permitted, not its abolition.

### Signals are recorded apart from outcomes (idea 6)

The state model in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
keeps `signals.jsonl` and `objections.jsonl` separate from
`outcome.json` and `final.md`. A censor block is logged as an event
even when nothing visible happened (Insight I5 in
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md));
the signal and the underlying condition are never collapsed.

---

## What the implementation does not yet take into account

### A — No statement that safety signals are not feelings

§28.4 demands that the runtime *not* confuse its warning signals with
feelings, even when their names (fear, danger, exhaustion) borrow
affective vocabulary. The plan obeys this, but does not announce it.
Earlier §1.1 analysis logged this under gap H (Sensibility) and §28.1
under gap C; §28.4 makes the case sharpest: the *purpose* of a censor
is to fire early, not to suffer.

### B — No engineered low-budget warning

§28.4's pattern is: install a warning that fires *before* the real
limit, not at it. The plan's budget ceilings in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
are simple caps; an agency runs until its tokens, runner seconds, or
tool-call count are exhausted. There is no early-warning band — no
state in which the agency receives a signal "approaching budget" with
time to compress or hand off. The result is a hard stop at depletion
rather than the anticipatory fade Minsky describes.

### C — No equivalent of fatigue at the loop level

§28.4's "discouragement" — the higher-level signal that borrows
fatigue's machinery — has no analogue in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md).
There is no signal that "this stimulus has cycled too many times
without convergence" or "this issue has produced too many sustained
objections in succession." Loops just end (settlement reached,
budget exhausted, approval pending). A meta-level signal for
*repeated unproductive cycles* is not a current feature.

### D — Cultural threshold not represented

§28.4's last paragraph notes that what is *felt* depends on culture.
The plan's safety thresholds (which paths are danger zones, which
diffs are suppressed, which actions require approval) are configured
*once* per society and not connected to user preferences or
context. `agency.identity.user-model-keeper` writes preferences to
`memory/semantic/preferences.log`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)),
but nothing reads those preferences back into the censor or
suppressor thresholds. Cultural thresholding is in principle possible
and not wired up.

### E — Reversibility plays the role pain plays — uncited

§28.4's deepest move is that a warning's value is *anticipatory*. The
plan's analogue is `agency.code.revert-path-finder` as a required
slot in `code-change` and `security-sensitive` frames
([`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)).
The runtime makes itself reversible *before* committing — which is
precisely the §28.4 pattern. The plan does not yet link the two: the
revert-path requirement is a safety guarantee in its own right, and
it is also an installed warning system. Naming the connection would
make the structure auditable.

---

## Summary table

| # | Idea from §28.4 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Warning signals are engineered | Yes | Censors, suppressors, danger zones; tool surface mechanically altered. |
| 2 | Warnings anticipate depletion | Partial | Censors and approval-gate fire before action; budgets do not (gap B). |
| 3 | Higher-level signals borrow lower-level machinery | No | No meta-level analogue of fatigue or discouragement (gap C). |
| 4 | Priority re-ordering, not overruling | Yes | Authority ceiling + frame lowering. |
| 5 | What is felt is partly cultural | No | Thresholds fixed per society; preferences not read back (gap D). |
| 6 | Signals are not the conditions they signal | Yes | Signals/objections logged separately from outcomes; censor invisibility addressed. |
| — | Safety signals are not feelings | Yes (by construction) | Not stated (gap A). |
| — | Revert path as installed warning | Yes (effectively) | Not framed that way (gap E). |

---

## Implication for the plan (no changes proposed here)

§28.4 is the most operationally relevant section of Chapter 28 for the
implementation, and the plan handles its core claim — that warnings
are engineered and must anticipate — well at the safety boundary and
poorly at the resource boundary. The most useful unforced opportunity
is gap B: turning agency budgets from hard caps into anticipatory
bands, so that an agency receives a *low-budget* signal in time to
compress or hand off, rather than failing at exhaustion. Gap C (a
loop-level discouragement signal) is interesting but more speculative;
gap D (cultural thresholds) would require user-preference plumbing
that does not yet exist.

This is recorded here as analysis, not as a change request. Any move
to close gap B would touch the budget schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and the signal schemas in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
