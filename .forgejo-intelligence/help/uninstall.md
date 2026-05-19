# Uninstall Forgejo Intelligence

Uninstall removes the Forgejo Intelligence runtime from a repository. Consider
disabling first if you only need a pause.

## Full Uninstall

```bash
rm -rf .forgejo-intelligence
rm -f .forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml
rm -f .forgejo/workflows/forgejo-intelligence-CI.yml
rm -f .forgejo/workflows/forgejo-intelligence-INSTALLER.yml
rm -f .forgejo/ISSUE_TEMPLATE/hatch.md
rm -f .gitea/ISSUE_TEMPLATE/hatch.md
git add -A
git commit -m "forgejo-intelligence: uninstall"
git push
```

Remove repository secrets that were only used by Forgejo Intelligence, such as
provider API keys or a custom Forgejo token secret.

## Preserve History Before Removing

State lives in:

```text
.forgejo-intelligence/state/
```

If you need an audit archive, copy that directory to your preferred archival
location before deleting the runtime.

## Partial Uninstall

Remove one surface:

```bash
rm -rf .forgejo-intelligence/forgejo-intelligent-package
git add -A
git commit -m "forgejo-intelligence: remove package surface"
git push
```

Disable all automation while keeping files:

```bash
rm .forgejo-intelligence/forgejo-intelligence-ENABLED.md
git add -A
git commit -m "forgejo-intelligence: disable"
git push
```

## After Uninstall

Confirm no active runtime paths remain:

```bash
test ! -d .forgejo-intelligence
test ! -f .forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml
```
