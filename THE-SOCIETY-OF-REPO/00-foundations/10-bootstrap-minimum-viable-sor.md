# Bootstrap: Minimum-Viable Society of Repo

A common failure mode of architectural specifications is that they describe the mature system but leave no path from *empty disk* to *first governed action*. This document defines the **minimum-viable Society of Repo (MV-SOR)** — the smallest configuration that is recognisably a society and not just a folder of markdown.

MV-SOR is *not* a toy. It is the smallest structure under which all the architectural commitments of SOR (insulation, settlement, censors, frames, credit-assignment, B-brain observation) are *actually present*, even if each is represented by a single instance.

---

## The minimum viable seven repos

MV-SOR requires exactly seven repositories on day one. Any fewer and the architectural commitments collapse into one place; any more is unjustified for bootstrap.

| Repo | Role | Why required on day one |
|---|---|---|
| `sor-constitution` | Constitution, principles, plurality contract, ideals, self-models registry, self-ideals registry | Without it, no proposal can cite anything; settlements have no ground |
| `sor-protocols` | The 19 protocol documents under `02-protocols/` plus `00-foundations/` | Without it, agencies cannot interoperate |
| `sor-orchestrator` | Activation, settlement, and routing logic; reads stimuli from a `stimuli/` directory and opens settlement PRs | Without it, nothing actually runs |
| `sor-agency-coder` | One real working agency with full constitution, frames, K-lines | The minimum society needs at least one *worker* |
| `sor-critic-evidence` | One critic that objects when a proposal is unsupported by cited frames or memory | Without a critic, settlement is monologue |
| `sor-censor-egress` | One censor on the `cloud-egress` boundary, fail-closed | Without a censor, the society has no hard limits and cannot be trusted with action |
| `sor-memory` | Frames, K-lines, failure-memory, settlement archive, all under git history | Without it, learning does not compound |

That is the floor. Every architectural commitment in SOR is exercised by these seven.

---

## What is *deliberately* deferred

To stay grounded in the possible, MV-SOR explicitly *defers* the following — and names what triggers their introduction:

| Deferred | Triggered when |
|---|---|
| Suppressors as separate repos | The first time a proposal that *should* have been blocked by `sor-censor-egress` reaches a boundary. Until then, the censor IS the suppressor. |
| Bridges (`02-protocols/18-bridges.md`) | The first time SOR needs to translate to or from another representation realm (e.g., Forgejo intelligence, an external schema). Bridges are not pre-built. |
| Plural B-brain stewards | Once any one of (activation, memory, representation, evaluation, ecology) generates more than one weekly digest worth reviewing. Until then, a single `meta-steward` issue tracker fills all five roles, and that is recorded as a known compromise. |
| Additional agencies, critics, censors | Only when a *settled* governance PR cites either repeated suppressor catches, repeated failure-memory entries, or a representation-steward gap report. Growth is evidence-driven, never speculative. |
| External integrations (issue trackers, chat, dashboards) | Never as part of bootstrap. They become candidates only after the cognitive observability surface (`00-foundations/09-cognitive-observability.md`) is producing real signal. |

This explicit deferral list is itself a constitutional commitment: MV-SOR refuses to scaffold what cannot yet be justified by experience.

---

## First-day artifacts

Inside the seven repos, the following hand-written artifacts must exist before the first stimulus is accepted:

### In `sor-constitution`
- `principles.md` — the seven principles (Plurality, Insulation, Non-Compromise, Differentiation, Credit Assignment, Honesty, Diversity)
- `ideals/` — at least one self-ideal: typically `prefer-evidence-over-fluency.md`
- `self-models.md` — at least one honest self-model entry, e.g. `coverage-self-model` with non-empty `known_blind_spots`
- `plurality-contract.md` — explicit statement that no agency, critic, or censor speaks for the whole

### In `sor-agency-coder`
- `constitution.md` — scope, authority (`propose` only, never `act`), inputs, outputs, frames it owns
- `frames/` — at least three frames covering its declared scope, each with explicit defaults and exceptions
- `klines/` — empty but with the schema present; the first K-lines will be hand-written after the first three real settlements
- `failure-memory.md` — empty but present; the first entry will likely arrive within the first ten stimuli

### In `sor-critic-evidence`
- `constitution.md` — scope, the single objection rule it enforces, the fields it consults
- `objection-templates/` — at least one canonical objection text

### In `sor-censor-egress`
- `constitution.md` — its single boundary, its fail-closed default, its escalation path
- `boundary-spec.md` — a precise definition of "cloud egress" as it applies to this society
- `firing-log/` — empty but present

### In `sor-memory`
- `frames/index.md` — pointers to per-agency frame folders
- `klines/index.md` — pointers to per-agency K-line folders
- `failure-memory/index.md` — pointers to per-agency failure folders
- `settlements/` — empty; populated by the orchestrator

### In `sor-orchestrator`
- `stimuli/inbox/` — drop-folder for new stimuli (a markdown file per stimulus is enough)
- `runtime-config.yaml` — the values from `02-protocols/05-settlement.md` *Runtime semantics* section, with conservative defaults
- A single CI workflow that, on a new file in `stimuli/inbox/`, opens a settlement PR

---

## First governed action

The first action MV-SOR is allowed to take is itself a settled decision, not a hand-run command. The minimum acceptable first action is:

> **Stimulus:** "Add a single sentence to `sor-constitution/principles.md` clarifying the wording of the Honesty principle."

This stimulus is chosen because it:
- exercises every protocol (activation, frame selection, K-line lookup against an empty store, settlement, critic objection, censor non-firing, credit-assignment, consolidation window),
- has bounded blast radius (one repo, one file, one sentence),
- produces a useful first failure-memory entry regardless of outcome,
- generates the first real K-line candidate,
- and proves that the orchestrator can drive the loop end-to-end.

If the society cannot complete this stimulus through a settled PR, MV-SOR is not yet operational and no further stimuli should be accepted.

---

## Anti-bootstrap warnings

Three patterns destroy a bootstrap and must be refused:

1. **Skipping the censor.** "We'll add safety later" guarantees that the first failure is unrecoverable. The egress censor is non-negotiable on day one.
2. **Pre-building agencies in anticipation.** Agencies that have never settled anything carry no learning and clutter the activation surface. Add the second worker agency only after the first has produced a non-trivial credit-assignment record.
3. **Treating the orchestrator as the mind.** The orchestrator is plumbing, not authority. It MUST NOT contain frames, K-lines, ideals, or critic logic. Any such logic is migrated to its proper home before the next stimulus is accepted.

---

## Exit criteria from MV-SOR

MV-SOR is meant to be outgrown. It exits the bootstrap phase only when *all* of the following are true and have been recorded in a settled review:

- ≥ 30 settlements have closed with full credit-assignment records
- ≥ 1 K-line has reached `warm` temperature through real reinforcement
- ≥ 1 failure-memory entry exists and has prevented a recurrence
- The egress censor has fired at least once and the firing has been reviewed
- The single `meta-steward` has issued at least four weekly digests and identified at least one pattern from the B-brain pattern catalogue

Until those criteria are met, no expansion of the seven-repo set is permitted.
