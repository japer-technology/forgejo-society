# Section 17.11 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-17.11.md](som-17.11.md) — *Intellectual ideals*
(Minsky, §17.11).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§17.11 closes the chapter: the response to intellectual trauma is the
formation of *intellectual ideals*. Thought has no universal logic;
each style has limits learned realm-by-realm. We acquire intellectual
attachments — heroes whose way of thinking we want to think like —
and these shape every stylistic choice we make, whether we notice
or not.

---

## The ideas Section 17.11 actually carries

1. **No single uniform logic governs thought.** Reasoning is
   plural: scripts, critics, censors, analogies, metaphors.
2. **Each style of reasoning has its own limits.** Limits must be
   learned per realm; there is no universal *too many*.
3. **Intellectual attachments exist.** One can want to think the
   way certain other persons think.
4. **Sources of intellectual ideals are varied.** Parents,
   teachers, friends, writers, even legendary figures.
5. **Style is not neutral.** Every choice — reductionism vs
   novelism, more evidence vs uniframe — is a stylistic disposition.
6. **Style depends on history.** Choices are shaped by what we
   have become, not by detached ideals.
7. **High pursuits are partly sublimated infantile impulses.**
   Adult intellectual life inherits motive structure from much
   earlier sources.

---

## What the implementation already absorbs

### Plural reasoning, not single logic (idea 1)

The agency families
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
— perception, memory, code, safety, identity, integration,
assembly, meta-admin — divide reasoning explicitly into incompatible
styles. The frames-and-polynemes layer
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md))
runs alongside scripts and critics. The plan does not assume a single
logic anywhere.

### Per-realm limits via frames (idea 2, partial)

Each frame slots its expectations
([`06-frames-polynemes-klines.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/06-frames-polynemes-klines.md));
a workflow-file frame has different default-slots than a
soul-file frame. The "what is permissible reasoning here" question
is partially answered by *which frame is active*. Realm-specific
limits exist as data.

### Style is encoded in the prose (ideas 5, 6, partial)

[AGENTS.md](../../../AGENTS.md) §4 ("voice and style") and the
authoritative
[`FORGEJO-SOCIETY-PROMOTION/08-style-guide.md`](../../../FORGEJO-SOCIETY-PROMOTION/08-style-guide.md)
record stylistic dispositions — *specifics over slogans*,
*mechanisms over mystique*, *restraint over hype*. These are
intellectual ideals in Minsky's sense; they are *not* derived from
neutral reason. Idea 5 is honoured cleanly.

### Cited intellectual heroes (idea 3, partial)

The repository's grounding in Minsky's *Society of Mind* is itself
an intellectual attachment. `THE-SOCIETY-OF-MIND/` and
`FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-MIND/` make the
relationship visible. The relationship is named in prose, not just
inherited silently.

---

## What the implementation does not yet take into account

### A — Per-realm reasoning limits are not declared

Idea 2 wants each style to know its own *too-many*. The plan has no
field that says "in the code realm, evidence chains beyond depth N
must be re-validated; in the policy realm, beyond depth M." Frames
imply realms but do not carry inference-depth caps.

### B — Stylistic choices are not justified per-settlement

Idea 6 says every choice depends on what the system has become. The
plan's settlements record *what* was chosen, not *why this style of
choice*. A reader cannot trace "this settlement preferred a
reductionist over a novelistic framing because of which history?"
The retrospect critics
([`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md))
do not surface stylistic reasoning.

### C — Intellectual heroes are not a registered class

Beyond the implicit Minsky attachment, the plan has no
`influences/` directory or manifest field that says "this agency
inherits its mode of reasoning from author X." Idea 3 is honoured at
the project level but not at the agency level.

### D — No "approval of heroes" signal type

In §17.2/17.8 terms, an intellectual ideal *carrying* approval is a
goal-modifying signal. The plan has no way for an agency to register
"my proposed output would or would not be approved by my
intellectual model" as a check distinct from the standard critics.

### E — Sublimation (idea 7) is not represented

The plan tracks current motives (via budgets, activation, K-line
reuse) but not the *genealogy* of a motive — the chain that links a
present sophisticated pursuit to an earlier crude one. Without that
chain, idea 7 cannot be tested against the system's own behaviour.

### F — Style-conflict among ideals is not detected

Two intellectual heroes can disagree (Minsky's own
McCulloch-watching-disapprovingly aside is the example). The plan
has no critic that asks "is this proposed output preferred by
ideal A and rejected by ideal B?" — a maintainer cannot see the
internal tension.

---

## Summary table

| # | Idea from §17.11 | In the plan? | Where / why not |
| --- | --- | --- | --- |
| 1 | No single uniform logic | Yes | Agency families plus frames. |
| 2 | Per-realm limits | Partial | Frames carry realm; no inference caps (gap A). |
| 3 | Intellectual attachments | Partial | Project-level only; no agency-level field (gap C). |
| 4 | Varied sources of ideals | Partial | Same gap. |
| 5 | Style is not neutral | Yes | Style guide is authoritative; voice rules enforce it. |
| 6 | Style depends on history | Partial | Settlements record choice, not stylistic reason (gap B). |
| 7 | High pursuits as sublimated impulses | No | Genealogy of motives not tracked (gap E). |
| — | Approval-of-ideals as a signal class | No | No such signal (gap D). |
| — | Conflict among ideals | No | No critic for it (gap F). |

---

## Implication for the plan (no changes proposed here)

§17.11 ends Chapter 17 by reframing the chapter: the same machinery
that makes attachment-learning possible in childhood makes
intellectual attachment possible in adulthood. The plan absorbs the
pluralism cleanly — many agency families, many critics, an explicit
style guide — and it has *its own* intellectual hero in plain view
(Minsky himself). What it lacks is the per-agency record of which
intellectual ideal an agency inherits from, the per-settlement trace
of *why this stylistic choice*, and the cross-ideal conflict
detector. Closing any of these would touch the manifest schema in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
(adding `influences`), the settlement shape in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md),
and
[`THE-SOCIETY-OF-REPO/01-governance/self-ideals.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/01-governance/self-ideals.md).
These are recorded here as analysis, not as a change request. Any
move to close them falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
