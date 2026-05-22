# Section 28.7 — Implementation analysis (SOR / FORGEJO-SOCIETY-IMPLEMENTATION)

**Source section:** [som-28.7.md](som-28.7.md) — *Individual identities*
(Minsky, §28.7).
**Analysis target:** [`FORGEJO-SOCIETY-IMPLEMENTATION/`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/)
(plan-of-record for `.forgejo-society/` and
`.forgejo/workflows/forgejo-society.yaml`).

§28.7 — the boat-of-Theseus section — argues that identity is never
absolute, always graded. *Same* is never a fact; it is a judgement
about which differences matter. For minds, the relevant equivalence is
not the substrate but the *succession of states*. Replacing parts
preserves the mind exactly to the extent that it preserves how each
state gives rise to the next.

---

## The ideas Section 28.7 actually carries

Pulled from Minsky's text:

1. **"Same" is a matter of degree.** No absolute identity exists; only
   judgements about salience.
2. **Identity tracks function, not substance.** A boat that behaves
   like your boat is, for nearly all practical questions, your boat.
3. **A mind is a particular pattern of state-to-state transition.**
   What persists in identity is the *rule* by which the next state
   is produced.
4. **Substrate change does not change the mind, unless it changes the
   succession of states.** This is the operational test for personal
   identity.
5. **Perfect duplication is impractical but the asymptote is real.**
   A close-enough copy is, for all behavioural purposes, the same
   mind.
6. **You are not the same as a moment ago either.** Strict equality
   would make even continuous existence fail; identity must tolerate
   microscopic drift.

---

## What the implementation already absorbs

### Identity by manifest, not by substrate (idea 2, idea 4)

The identity protocol in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
makes the agency identifier `{scope}.{kind}.{name}[.{version}]` —
substrate-free by construction. An agency is identified by what it
*is for*, not by which model or runner ran it. Two runs of
`agency.code.implementer.v3` on different model providers are, for
identity purposes, the same agency.

### State-transition continuity is the spine (idea 3)

The state model in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
and the pipeline in
[`03-runtime-pipeline.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/03-runtime-pipeline.md)
treat the society as a sequence of `run_id`s, each producing a fresh
trace that flows into `memory/`. Continuity is the *git history of
`.forgejo-society/`*. The society's "self" is what that history
records about how each state gave rise to the next.

### Version supersession instead of mutation (idea 1, idea 6)

The append-only memory rule in
[`08-state-and-memory.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/08-state-and-memory.md)
("edits in place are forbidden; corrections happen via a new entry
that supersedes the old") is the §28.7 discipline applied to records:
the boat is not patched plank-by-plank without acknowledgement; each
plank-change becomes a record with a `supersedes:` link. Identity
survives change because change is *traced*.

### Self-model as the spine (idea 4)

`agency.identity.spock-self-model.md` (referenced in
[`05-agencies-critics-censors.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/05-agencies-critics-censors.md)
and the §1.1 analysis) plus
`.forgejo-society/AGENTS.md` as the soul-file (per
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md))
hold the answer to "who is this society?" across runs. Changing them
requires the `self-modification` frame and human confirmation. Spock's
identity is structurally protected from silent drift.

### Continuity tolerates microscopic difference (idea 6)

Two runs are never bit-identical (timestamps, run IDs, model
non-determinism). The plan treats this as expected: the comparison
unit is the *settlement record*, not the *trace transcript*. The
state in `state/` is per-run; the memory in `memory/` is consolidated.
Identity rides on the consolidation, not the noise.

---

## What the implementation does not yet take into account

### A — No operational test of mind-equivalence

§28.7's central claim — that two systems with the same state
succession are the same mind — has no operational test in the plan.
The §28.5 analysis raised this as gap B (trace equivalence); §28.7
sharpens it: not just "same trace" but "same rule by which the next
state is produced from the previous one." A future
forgejo-conformance-test under
[`FORGEJO-SOCIETY-INSTALLATION/repo/forgejo-conformance-test/`](../../../FORGEJO-SOCIETY-INSTALLATION/repo/forgejo-conformance-test/)
could in principle bear the load; it does not today.

### B — Version semantics are unspecified

The `[.{version}]` suffix in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
is permitted but not described. When is `agency.code.implementer.v4`
*the same agency* as `.v3` (preserved memory, preserved frames,
preserved reinforcement) and when is it a different one? §28.7
predicts there is no absolute answer; it also predicts the question
will arise. The plan has the suffix but not the rule for using it.

### C — Forking a society is undefined

The federation material in
[`FORGEJO-SOCIETY-THE-FEDERATION/`](../../../FORGEJO-SOCIETY-THE-FEDERATION/)
and
[`13-inter-repo-communication.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/13-inter-repo-communication.md)
do not describe what happens when one society's `.forgejo-society/`
is forked into a new repository. Is the descendant the *same*
society at a new substrate, or a new society inheriting memory? §28.7
allows either answer; the plan picks neither.

### D — Soul-file change versus identity continuity

The soul-file (`.forgejo-society/AGENTS.md`) is protected from edit
by
[`07-policies-and-safety.md`](../../../FORGEJO-SOCIETY-IMPLEMENTATION/07-policies-and-safety.md)
("soul_mutation"), but §28.7 would say even *permitted* edits
constitute a graded change of identity. The plan has the gate; it
does not record, for each soul-file edit, *how much* of the previous
self is preserved. A change-summary slot in the soul-mutation
settlement would close this.

### E — "You are not the same as a moment ago" — not extended to runs

§28.7's last move (microscopic drift even within a single individual)
suggests the runtime should explicitly accept that each run produces
a *slightly different* society, not the *same one*. The plan's
current language implies the latter. A small clause noting that the
society is continuous through change rather than identical across
runs would align it with §28.7's final claim.

### F — No measure of identity-distance

§28.7's grading move ("same is a matter of degree") would be
operationally useful: a distance between two `.forgejo-society/`
states (over agency manifests, frames, K-lines, soul-files) would let
governance ask "how far has this society drifted from its first-ship
configuration?" No such metric exists.

---

## Summary table

| # | Idea from §28.7 | In the plan? | Where (or why not) |
| --- | --- | --- | --- |
| 1 | Same is a matter of degree | Yes (implicitly) | Supersession links acknowledge change; no distance measure (gap F). |
| 2 | Identity tracks function, not substance | Yes | Manifest IDs are substrate-free. |
| 3 | Mind = pattern of state transitions | Yes (operationally) | Git history of `.forgejo-society/`. |
| 4 | Substrate change does not change the mind if transitions persist | Yes (by design) | Model provider is out of scope; identity rides on manifests. |
| 5 | Close-enough copies are the same mind | Yes (in principle) | No operational test (gap A). |
| 6 | Even continuous existence has drift | Partial | Runs differ; not stated as identity drift (gap E). |
| — | Version semantics | Partial | Suffix permitted; rule absent (gap B). |
| — | Forking a society | No | Undefined in plan and federation docs (gap C). |
| — | Soul-file edit identity accounting | Partial | Gated; not measured (gap D). |
| — | Identity-distance metric | No | Would require a comparison facility (gap F). |

---

## Implication for the plan (no changes proposed here)

§28.7 sits comfortably with the plan: the substrate-free identifier
shape, the append-only-with-supersession memory rule, and the
soul-file protection together carry most of the section's weight. The
gaps are at the edges where identity is *contested*: versions
(gap B), forks (gap C), and drift over time (gap E, gap F). The most
useful unforced opportunity is gap B: a one-paragraph rule in
[`THE-SOCIETY-OF-REPO/02-protocols/01-identity.md`](../../../FORGEJO-SOCIETY-INTRODUCTION/THE-SOCIETY-OF-REPO/02-protocols/01-identity.md)
describing when a version bump is the same agency and when it is a
new one. Gap C is best deferred until the first real federation
channel exists; gap F is genuinely speculative.

This is recorded here as analysis, not as a change request. Any move
to close gap B would touch the identity protocol document; gap C
would touch the federation material; and so falls under the "stop
and ask" rules in [AGENTS.md](../../../AGENTS.md) §12 and
[CLAUDE.md](../../../CLAUDE.md).
