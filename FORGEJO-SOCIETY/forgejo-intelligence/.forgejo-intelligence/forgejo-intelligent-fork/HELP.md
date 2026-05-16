# Forgejo Intelligent Fork Help

`forgejo-intelligent-fork` is for fork and upstream/downstream repository
context where the Forgejo instance exposes the needed event and API behavior.

## Trigger

Fork intelligence may be driven by fork-related payloads, pull request payloads,
or scheduled scans depending on the target Forgejo instance. Keep the surface
enabled only when those payloads are validated for your instance.

## What It Can Track

- fork creation and orientation,
- upstream default branch and release context,
- ahead and behind counts,
- divergence risk,
- fork PRs back to the upstream,
- scheduled health summaries.

## State

Fork state should live under `.forgejo-intelligence/state/` with committed
session history in `.forgejo-intelligence/state/sessions/`.

## Security

Forks are trust boundaries. Do not run write-capable automation on untrusted
fork code. The default PR workflow skips fork pull requests. Any fork-specific
write workflow should be explicitly reviewed for token and secret exposure.

## Disable

```bash
rm -rf .forgejo-intelligence/forgejo-intelligent-fork
git add -A
git commit -m "forgejo-intelligence: disable fork surface"
git push
```

## Related

- [../../help/security.md](../help/security.md)
- [../../help/surfaces.md](../help/surfaces.md)
- [../../help/local-development.md](../help/local-development.md)
