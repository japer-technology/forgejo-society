# Builder Onboarding and Runnable Examples

This document is the operator and contributor path for building a new agency safely.
It also points to concrete example assets in this repository.

---

## Start here

Use this order when onboarding a new builder:

1. Read [SOR-to-Forgejo Mapping and Bootstrap](17-sor-bootstrap-and-mapping.md).
2. Read [Runtime Protocols, Privacy Controls, and Reinforcement](18-runtime-protocols-and-automation.md).
3. Read [Operations, Upgrades, and Cognitive Observability](19-operations-upgrades-and-observability.md).
4. Run the [Forgejo Conformance Repo](../CONFORMANCE/forgejo-conformance-repo/README.md) against your target repository to confirm the Forgejo installation is ready.
5. Adapt the conformance fixtures into the first agency repo.
6. Enable the workflow template only after policy, tokens, and labels exist.

---

## Build your first agency

### Minimum deliverables

- one bounded mission statement
- one service account
- one repo with branch protection
- one workflow template
- one memory writeback format
- one critic path
- one rollback path

### Recommended first agency

Start with an intake or documentation agent, not a high-authority code-changing agent.
The first agency should be easy to review and easy to revert.

### Checklist

- [ ] Create repo from the conformance fixtures
- [ ] Set repo class to `agent`
- [ ] Register a service account with least privilege
- [ ] Add one activation label
- [ ] Configure one critic requirement
- [ ] Test one settlement from activation to merge

---

## Test an agency locally

1. Run the workflow by `workflow_dispatch` with sample payload values.
2. Validate that the workflow can create the settlement artifact without secrets leakage.
3. Replay the same payload against the local model endpoint.
4. Confirm the memory writeback matches the example JSON schema.
5. Confirm the critic path can reject the proposal cleanly.

Do not grant merge rights to the agent during local testing.

---

## Connect an agency to memory

Every completed action should write, at minimum:

- settlement ID
- agent name
- source repo and ref
- action type
- model route
- result (`merged`, `rejected`, `deferred`)
- timestamp

Write provenance first, then derived K-line updates after review.

---

## Promote an experimental agent safely

1. Keep the agent in `experimental` until it has enough settled history.
2. Review false positives, objection rate, and rollback count.
3. Require one governance decision for promotion to `probation` or `trusted`.
4. Keep the previous trusted route active until the promoted route proves stable.

---

## Debug why an activation did not happen

Check in this order:

1. missing or incorrect activation label
2. repo class blocked by policy
3. service-account token scope too narrow
4. required critic unavailable
5. workflow disabled or runner labels unmatched
6. censor blocked cloud or secret use
7. settlement branch already claimed by another actor

---

## Example assets in this repository

| Asset | Path | Purpose |
| --- | --- | --- |
| Conformance library | [`../CONFORMANCE/README.md`](../CONFORMANCE/README.md) | Entry point for conformance assets |
| Forgejo Conformance Repo | [`../CONFORMANCE/forgejo-conformance-repo/README.md`](../CONFORMANCE/forgejo-conformance-repo/README.md) | Drop-in workflows that prove a Forgejo install is ready for SOR |
| Agent manifest fixture | [`../CONFORMANCE/forgejo-conformance-repo/fixtures/agent-manifest.example.yaml`](../CONFORMANCE/forgejo-conformance-repo/fixtures/agent-manifest.example.yaml) | Repo-local role and routing config |
| Settlement fixture | [`../CONFORMANCE/forgejo-conformance-repo/fixtures/settlement.example.yaml`](../CONFORMANCE/forgejo-conformance-repo/fixtures/settlement.example.yaml) | In-flight settlement record |
| Critic response fixture | [`../CONFORMANCE/forgejo-conformance-repo/fixtures/critic-response.example.md`](../CONFORMANCE/forgejo-conformance-repo/fixtures/critic-response.example.md) | Blocking and approving review format |
| Provenance fixture | [`../CONFORMANCE/forgejo-conformance-repo/fixtures/provenance-record.example.json`](../CONFORMANCE/forgejo-conformance-repo/fixtures/provenance-record.example.json) | Memory writeback format |
| Conformance install workflow | [`../CONFORMANCE/forgejo-conformance-repo/.forgejo/workflows/forgejo-conformance-INSTALL.yaml`](../CONFORMANCE/forgejo-conformance-repo/.forgejo/workflows/forgejo-conformance-INSTALL.yaml) | Copy-and-dispatch workflow that scaffolds conformance assets |
| Conformance test workflow | [`../CONFORMANCE/forgejo-conformance-repo/.forgejo/workflows/forgejo-conformance-TESTS.yaml`](../CONFORMANCE/forgejo-conformance-repo/.forgejo/workflows/forgejo-conformance-TESTS.yaml) | Copy-and-dispatch workflow that runs the conformance suite |

---

## Definition of done for builder onboarding

- [ ] A new contributor can create one agent repo from the conformance fixtures
- [ ] The workflow can be tested by manual dispatch before live activation
- [ ] The agent can write provenance without merge rights
- [ ] A critic can stop the proposal
- [ ] A governor can explain how to debug a missing activation
