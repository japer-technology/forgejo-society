# Enable Forgejo Intelligence

Forgejo Intelligence runs only when this sentinel file exists:

```text
.forgejo-intelligence/forgejo-intelligence-ENABLED.md
```

## Enable

Create or restore the sentinel:

```bash
cat > .forgejo-intelligence/forgejo-intelligence-ENABLED.md <<'EOF'
# Forgejo Intelligence Enabled

This repository intentionally enables Forgejo Intelligence automation.
EOF
git add .forgejo-intelligence/forgejo-intelligence-ENABLED.md
git commit -m "forgejo-intelligence: enable"
git push
```

After pushing, run the workflow manually with `run_agent=false` for a no-op
preflight, or open a test issue.

## Confirm Enabled

```bash
test -f .forgejo-intelligence/forgejo-intelligence-ENABLED.md && echo enabled
```

Also confirm the workflow exists:

```bash
test -f .forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml && echo workflow-present
```

## Enable A Surface

A surface is enabled when its folder is present under `.forgejo-intelligence/`.
To restore a removed surface, copy the folder back from the source package and
commit it, then ensure the workflow triggers include the corresponding Forgejo
event.

## Related

- [Disable](disable.md)
- [Actions](action-management.md)
- [Surfaces](surfaces.md)
