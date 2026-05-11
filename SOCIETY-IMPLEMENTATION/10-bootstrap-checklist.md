# 10 — Bootstrap Checklist

The minimum viable Society of Repo. Everything else is optional and can be
added later through `self-modification` settlements once the loop is alive.

This list is intentionally small. The aim is one PR that turns the existing
seed (`.forgejo/workflows/forgejo-society.yaml` + `.forgejo-society/README.md`)
into a working society shell, with the conscious bottleneck wired and the
kill switch effective, even if many agencies and frames are still empty.

Sources: `THE-REPO-IS-THE-MIND/possibility-2.md` *the first commit I would
make*, and `SOCIETY-OF-REPO/00-foundations/10-bootstrap-minimum-viable-sor.md`.

Agents implementing this checklist MUST also follow
`12-agent-implementation-playbook.md`. This checklist says *what* must exist;
the playbook says the safe order and acceptance standard for creating it.

---

## Phase A — Skeleton (one PR)

### Workflow

- [ ] `.forgejo/workflows/forgejo-society.yaml`
  - [ ] triggers: `issues`, `issue_comment`, `pull_request`, `push`,
        `schedule`, `workflow_dispatch`
  - [ ] concurrency group keyed by stimulus
  - [ ] least-privilege `permissions:` at top
  - [ ] one job with named steps for each phase from `02-workflow-design.md`
  - [ ] `guard` step checks `forgejo-society-ENABLED.md` and
        `policies/kill-switch.yml`
  - [ ] `report` step always runs (`if: always()` after `guardrail`) and
        commits `state/` changes

### Mind root files

- [ ] `.forgejo-society/forgejo-society-ENABLED.md`
- [ ] `.forgejo-society/AGENTS.md`             (Spock’s self-model)
- [ ] `.forgejo-society/APPEND_SYSTEM.md`      (character law)
- [ ] `.forgejo-society/README.md` (already exists; expand to point at
      AGENTS, SOCIETY-IMPLEMENTATION, SOCIETY-OF-REPO)

### Config

- [ ] `.forgejo-society/config/society.yml` (mode, max_cycles,
      activation_threshold, default_frame, paths)
- [ ] `.forgejo-society/config/tools.yml` (read/grep/find/ls + edit/write/bash
      groups)
- [ ] `.forgejo-society/config/providers.yml` (model + provider, secrets by
      reference)
- [ ] `.forgejo-society/config/budgets.yml`

### Governance (minimum)

- [ ] `.forgejo-society/governance/constitution.md` (excerpt of SOR)
- [ ] `.forgejo-society/governance/authority-registry.yml`
- [ ] `.forgejo-society/governance/approval-gate.yml`
- [ ] `.forgejo-society/governance/rights-registry.yml`
- [ ] `.forgejo-society/governance/policy-ledger.yml` (empty list; first entry
      is the ledger creation itself)
- [ ] `.forgejo-society/governance/self-ideals.md`

### Policies

- [ ] `.forgejo-society/policies/kill-switch.yml`
- [ ] `.forgejo-society/policies/danger-zones.yml` (the six first-ship zones
      from `07-policies-and-safety.md`)
- [ ] `.forgejo-society/policies/tool-policy.yml`
- [ ] `.forgejo-society/policies/write-policy.yml`
- [ ] `.forgejo-society/policies/memory-policy.yml`
- [ ] `.forgejo-society/policies/self-modification-policy.yml`

### Schemas

- [ ] `.forgejo-society/schemas/signal.schema.json`
- [ ] `.forgejo-society/schemas/handoff.schema.json`
- [ ] `.forgejo-society/schemas/settlement.schema.json`
- [ ] `.forgejo-society/schemas/kline.schema.json`
- [ ] `.forgejo-society/schemas/frame.schema.json`
- [ ] `.forgejo-society/schemas/manifest.schema.json`

### Frames (minimum three)

- [ ] `.forgejo-society/frames/question.frame.yml`
- [ ] `.forgejo-society/frames/code-change.frame.yml`
- [ ] `.forgejo-society/frames/security-sensitive.frame.yml`

### Polynemes

- [ ] `.forgejo-society/nemes/path-polynemes.yml`
- [ ] `.forgejo-society/nemes/label-polynemes.yml`
- [ ] `.forgejo-society/nemes/phrase-polynemes.yml`
- [ ] `.forgejo-society/nemes/symbols.yml`

### Agencies (minimum seven)

- [ ] `.forgejo-society/agencies/perception/intake-bee.md`
- [ ] `.forgejo-society/agencies/memory/kline-retriever.md`
- [ ] `.forgejo-society/agencies/code/codebase-cartographer.md`
- [ ] `.forgejo-society/agencies/code/test-hunger.md`
- [ ] `.forgejo-society/agencies/code/diff-skeptic.md`
- [ ] `.forgejo-society/agencies/safety/danger-zone-watcher.md`
- [ ] `.forgejo-society/agencies/integration/conscious-presenter.md`

### Critics (minimum two)

- [ ] `.forgejo-society/critics/evidence-critic.md`
- [ ] `.forgejo-society/critics/risk-critic.md`

### Censors (minimum two)

- [ ] `.forgejo-society/censors/workflow-danger-censor.md`
- [ ] `.forgejo-society/censors/secret-smeller.md`

### Memory and workspace (empty trees with READMEs)

- [ ] `.forgejo-society/memory/README.md`
- [ ] one empty subdir per memory class (events, episodic, semantic,
      procedural, failure, frames, analogies, concepts, klines, decisions)
- [ ] `.forgejo-society/workspace/README.md`
- [ ] empty subdirs: global-workspace, current-focus, active-settlements,
      owner-briefings

### Lifecycle

- [ ] `.forgejo-society/lifecycle/mind.ts` (entrypoint)
- [ ] `.forgejo-society/lifecycle/perceive.ts`
- [ ] `.forgejo-society/lifecycle/activate.ts`
- [ ] `.forgejo-society/lifecycle/frames.ts`
- [ ] `.forgejo-society/lifecycle/klines.ts`
- [ ] `.forgejo-society/lifecycle/critics.ts`
- [ ] `.forgejo-society/lifecycle/censors.ts`
- [ ] `.forgejo-society/lifecycle/settle.ts`
- [ ] `.forgejo-society/lifecycle/act.ts`
- [ ] `.forgejo-society/lifecycle/memory.ts`
- [ ] `.forgejo-society/lifecycle/credit-assignment.ts`
- [ ] `.forgejo-society/lifecycle/policy.ts`
- [ ] `.forgejo-society/lifecycle/lib/forgejo.ts`
- [ ] `.forgejo-society/lifecycle/lib/git.ts`
- [ ] `.forgejo-society/lifecycle/lib/pi.ts`
- [ ] `.forgejo-society/lifecycle/lib/sessions.ts`
- [ ] `.forgejo-society/lifecycle/lib/comments.ts`
- [ ] `.forgejo-society/lifecycle/lib/config.ts`

### State (created on first run)

- [ ] `.forgejo-society/state/schema-version` (committed empty + version)
- [ ] `.forgejo-society/state/sessions/` (empty)
- [ ] `.forgejo-society/state/runs/` (empty)
- [ ] `.forgejo-society/state/mind/` (empty)

### Agent completion rules

- [ ] The implementing agent records which checklist items were completed,
      deferred, or blocked by missing external services.
- [ ] Every emitted runtime artifact has either a committed schema or an
      explicit Phase B/C deferral.
- [ ] Every dangerous path in `07-policies-and-safety.md` is represented in
      `policies/danger-zones.yml`.
- [ ] Every agency, critic, and censor manifest validates against
      `schemas/manifest.schema.json`.
- [ ] The workflow has no model prompt, authority decision, or memory rule
      embedded directly in YAML.
- [ ] The workflow can exit successfully before agent code runs when the enable
      sentinel is absent.
- [ ] A reviewer can trace one accepted event from initial stimulus through
      perception, activation, settlement, action, report, and memory paths.

---

## Phase A acceptance checks

A reviewer can:

1. Open an issue with the `activate:intake` label. The workflow runs and
   leaves a comment from Spock that quotes the chosen frame and lists the
   activated agencies. Trace appears under
   `.forgejo-society/state/mind/issues/<n>/`.
2. Open an issue that asks for a workflow change. The workflow runs, the
   `workflow-danger-censor` blocks write tools, the response is a comment
   describing the proposed change without modifying any file.
3. Delete `.forgejo-society/forgejo-society-ENABLED.md` in a PR. After
   merge, no further events trigger any agent activity. The workflow runs
   and exits cleanly at the `guard` step.
4. Open an issue that asks to modify `AGENTS.md`. The settlement records
   `pending_human` and writes an owner briefing. No commit to the soul file
   occurs.
5. Trigger `workflow_dispatch` with the existing `prepare-settlement`
   inputs (`settlement_id`, `source_repo`, `source_ref`, defined at
   `.forgejo/workflows/forgejo-society.yaml` lines 5–14 of the seed
   workflow) from the seed workflow. The new pipeline absorbs them and
   writes a settlement with `outcome=success`.

If any of those five fail, Phase A is not complete.

---

## Phase B — Real cognition (subsequent PRs)

Each item is its own PR, gated by the `self-modification` frame:

- [ ] add the remaining frames (`bug`, `feature`, `self-modification`,
      `novel`)
- [ ] add the remaining agencies from `05-agencies-critics-censors.md`
- [ ] add the remaining critics and censors
- [ ] enable K-line writing in the `archivist` after first successful
      settlements
- [ ] enable analogy fallback once `memory/analogies/` has at least one entry
- [ ] enable scheduled cron pass (decay, ecology review)
- [ ] enable imagination branches for non-danger-zone code changes
- [ ] add the assembly tier when traffic justifies summarisation
- [ ] add the meta-admin family

---

## Phase C — Inter-society (deferred)

- [ ] flesh out `services/` and `channels/`
- [ ] write the first reciprocal channel agreement
- [ ] register the society as a service to one external SOR

These are explicitly deferred per `00-overview.md` *out of scope here*.

---

## Deferred items (acknowledged but not in any phase yet)

- Choice of LLM provider, model, and exact SDK
- Specific egress allowlist
- Public-fabric publishing
- Migration tooling for `state/` schema bumps

Each becomes its own settlement when needed.
