# Minimal Agent Repo Example

This example is the smallest useful starting point for a Forgejo-Mind agency.
It assumes one bounded job: read an activation event, prepare a settlement draft,
and hand the result to a critic and human governor.

---

## Suggested layout

```text
minimal-agent-repo/
├── README.md
├── agent-manifest.example.yaml
├── settlement.example.yaml
├── critic-response.example.md
├── provenance-record.example.json
└── .forgejo/
    └── workflows/
        └── minimal-agent-cycle.yaml
```

---

## What each file does

- `agent-manifest.example.yaml` — declares the agent's mission, inputs, outputs, and model route
- `settlement.example.yaml` — shows the runtime record the workflow writes while work is in flight
- `critic-response.example.md` — shows how a critic records approval or a blocking objection
- `provenance-record.example.json` — shows the memory writeback payload after an outcome
- `.forgejo/workflows/minimal-agent-cycle.yaml` — the actual workflow template to copy into the live repo

Copy the workflow from [`../../../.forgejo/workflows-disabled/minimal-agent-cycle.yaml`](../../../.forgejo/workflows-disabled/minimal-agent-cycle.yaml) when you are ready to enable it.
