# Forgejo-Mind Examples

These examples turn the architecture into concrete starter assets.
Copy them into real Forgejo repositories and adapt names, tokens, and labels to your
installation.

---

## Included examples

| Example | Path | What it gives you |
|---|---|---|
| Minimal agent repo | [`minimal-agent-repo/`](minimal-agent-repo/README.md) | Smallest bounded agency with workflow, settlement, critic, and provenance examples |
| Disabled root workflow template | [`../../.forgejo/workflows-disabled/minimal-agent-cycle.yaml`](../../.forgejo/workflows-disabled/minimal-agent-cycle.yaml) | Site-level template kept disabled until you are ready |

---

## How to use these examples

1. Start with the minimal agent repo.
2. Replace example names, labels, and domains.
3. Keep the workflow disabled until runner labels and token scopes exist.
4. Test with `workflow_dispatch` before enabling live event triggers.
5. Record the first successful settlement in memory before scaling out.
