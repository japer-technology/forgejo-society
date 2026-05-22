# Section 11.8 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-11.8.md](som-11.8.md) — *Half-brains* (Minsky, §11.8).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/).

§11.8 looks at the brain's paired hemispheres and refuses the
fashionable two-faculty story. The hemispheres are largely
similar; one side can take over for the other after damage; their
mirror layout is useful for *comparison* — keep a copy of an
initial state on one side and check progress on the other. Over
development, one side acquires more administrative reach, often
the language side, because so many agencies connect through it.

---

## The ideas Section 11.8 actually carries

1. **Pairs of mirror-image agencies are common.** The brain has
   many such pairs with massive cross-connections.
2. **Mirroring supports redundancy and recovery.** If a region is
   damaged early, the mirror can take over.
3. **Mirroring supports comparison.** One side can hold an initial
   state while the other works; difference yields progress.
4. **Asymmetry is acquired, not given.** Functional differences
   develop because one side takes administrative control to avoid
   conflict between two masters.
5. **The dominant side accretes connections to other agencies.**
   Often this is the language side, because that side already
   connects to many agencies for other reasons.
6. **The non-dominant side keeps lower-level skills.** It develops
   too, but with less administrative reach, so when isolated it
   looks less mature than it is.

---

## What the implementation already absorbs

### Settlement-as-comparison (idea 3)

The settlement schema in
[`09-handoff-and-signal-schemas.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/09-handoff-and-signal-schemas.md)
already records a "before" and an "after" for any reality
revision: `reality_revision.base_sha`, `proposed_sha`, `merge_sha`,
`outcome`. The candidate-future branch is the mirror-state held on
one side while `main` continues to be the accepted reality. Diff
between the two is the §11.8 "comparison between initial and final
to see what progress had been made".

### Candidate branches as mirror workspaces (ideas 2, 3)

[`02-workflow-design.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/02-workflow-design.md)
makes the candidate-future branch the default for any write to
`main`. The branch is structurally a mirror: a parallel state in
which work can be done without disturbing the accepted reality,
compared against `main`, then either merged or kept as a rejected
hypothesis. Rejected branches are preserved in
`memory/failure/rejected-candidates/`
([`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md))
— Minsky's "kept around in case the other side fails".

### Single administrator (ideas 4, 5)

The conscious-presenter rule in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
makes one agency the sole administrative voice. The §11.8 story —
one side takes control to prevent "two masters" paralysis —
matches the plan's discipline that only
`agency.integration.conscious-presenter` produces visible text and
only `agency.integration.commit-steward` decides commit-vs-PR-vs-
comment. Administration is concentrated by design.

---

## What the implementation does not yet take into account

### A — No mirror agencies

The plan has no *paired* agencies. Each agency in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
is a single file. The §11.8 redundancy story (idea 2) has no
analogue: if `agency.identity.spock-self-model` is degraded, no
mirror takes over. The federation material at
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
is the nearest place this could live, but cross-society failover
is not specified.

### B — Comparison machinery exists for git, not for cognition

Idea 3's comparison move is fully implemented for *artefacts* —
diffs between branches. It is *not* implemented for *cognitive
state*: there is no "snapshot the activation, do work, compare
activation" operation. K-line reactivation comes close (a stored
activation is restored) but the runtime never *compares* two
activations to measure progress.

### C — Asymmetry is asserted, not grown

The plan asserts the dominance of the integration family at boot
(authority defaults in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
give `conscious-presenter` and `commit-steward` the `act` level).
§11.8 would expect dominance to *develop* — and to be visible in
the connection graph: the dominant agency would be the one most
other agencies handoff to. The plan does not measure connection
counts and could not, today, name "the dominant agency by
connectivity".

### D — Lower-level skills without administrative reach are not
catalogued

Idea 6 — that the less-dominant side carries lower-level skills
but lacks administrative reach — has no plan analogue.
Perception, code, and safety families *are* lower-level skills,
and integration *is* the administrator, but there is no rule that
captures the §11.8 prediction: a perception agency severed from
integration should still detect, just not act. The kill switch and
authority registry stop work; they do not selectively isolate the
perceptual surface.

### E — "Dumbbell" framing is exactly what §11.9 will warn against

§11.8 already pushes back on the lay reading. The plan does not
yet have a critic that catches its own descriptions when they
collapse into two-faculty stories (e.g. "this is the logical
side, that is the creative side"). This is more a documentation
hygiene concern than a runtime one, but it foreshadows the
warning §11.9 will make load-bearing.

---

## Summary table

| # | Idea from §11.8 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Mirror pairs of agencies | No | One-of-each catalogue (gap A). |
| 2 | Mirroring supports recovery | No | No failover within a society (gap A). |
| 3 | Mirroring supports comparison | Yes (for artefacts) | Candidate-future branch + `reality_revision`; not for cognitive state (gap B). |
| 4 | Asymmetry is acquired | No | Asymmetry asserted by authority defaults (gap C). |
| 5 | Dominant side accretes connections | Partial | Integration family is dominant by design; connectivity not measured (gap C). |
| 6 | Non-dominant side keeps lower skills | Partial | Lower-level families exist; isolation behaviour not specified (gap D). |
| — | Self-warning against two-faculty stories | No | No `critic.dumbbell-framing` (gap E). |

---

## Implication for the plan (no changes proposed here)

§11.8 reads the plan's *git-as-comparison* discipline as a strong
fit — the candidate-future branch is exactly the kind of mirror
state §11.8 describes, and the settlement is the comparison
record. The plan's weakness is in the *cognitive* mirror: there
are no paired agencies, no failover within a society, no snapshot-
and-compare of activation.

The openings are larger than for previous sections because they
touch federation. Mirror agencies (gap A) and cognitive-state
comparison (gap B) would each require new structures, not just new
fields. Dominance-by-measurement (gap C) and isolation-aware
agency design (gap D) would touch the manifest schema.

These are recorded as analysis, not as a change request. Any move
to close them would touch
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md),
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md),
the introspection and hierarchy protocols at
[`THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/11-introspection.md)
and
[`THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/13-hierarchy-and-summaries.md),
and federation-scope material at
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/),
and so falls under the "stop and ask" rules in
[AGENTS.md](../../../AGENTS.md) §12 and [CLAUDE.md](../../../CLAUDE.md).
