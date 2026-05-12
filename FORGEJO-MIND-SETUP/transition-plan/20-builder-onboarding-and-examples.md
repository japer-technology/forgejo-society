# Builder Onboarding and Runnable Examples

This document is the operator and contributor path for building a new agency safely.
It also points to concrete example assets in this repository.

---

## Start here

Use this order when onboarding a new builder:

1. Read [SOR-to-Forgejo Mapping and Bootstrap](17-sor-bootstrap-and-mapping.md).
2. Read [Runtime Protocols, Privacy Controls, and Reinforcement](18-runtime-protocols-and-automation.md).
3. Read [Operations, Upgrades, and Cognitive Observability](19-operations-upgrades-and-observability.md).
4. Copy the example assets from [`../examples/`](../examples/README.md).
5. Enable the workflow template only after policy, tokens, and labels exist.

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

- [ ] Create repo from the minimal example
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
|---|---|---|
| Example index | [`../examples/README.md`](../examples/README.md) | Entry point for starter assets |
| Minimal agent repo | [`../examples/minimal-agent-repo/README.md`](../examples/minimal-agent-repo/README.md) | Smallest useful repo layout |
| Agent manifest example | [`../examples/minimal-agent-repo/agent-manifest.example.yaml`](../examples/minimal-agent-repo/agent-manifest.example.yaml) | Repo-local role and routing config |
| Settlement example | [`../examples/minimal-agent-repo/settlement.example.yaml`](../examples/minimal-agent-repo/settlement.example.yaml) | In-flight settlement record |
| Critic response example | [`../examples/minimal-agent-repo/critic-response.example.md`](../examples/minimal-agent-repo/critic-response.example.md) | Blocking and approving review format |
| Provenance example | [`../examples/minimal-agent-repo/provenance-record.example.json`](../examples/minimal-agent-repo/provenance-record.example.json) | Memory writeback format |
| Workflow template | [`../../.forgejo/workflows-disabled/minimal-agent-cycle.yaml`](../../.forgejo/workflows-disabled/minimal-agent-cycle.yaml) | Forgejo Actions template kept disabled by default |

---

## Definition of done for builder onboarding

- [ ] A new contributor can create one agent repo from the examples
- [ ] The workflow can be tested by manual dispatch before live activation
- [ ] The agent can write provenance without merge rights
- [ ] A critic can stop the proposal
- [ ] A governor can explain how to debug a missing activation
