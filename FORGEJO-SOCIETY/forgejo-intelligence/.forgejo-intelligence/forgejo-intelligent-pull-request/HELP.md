# Forgejo Intelligent Pull Request Help

`forgejo-intelligent-pull-request` handles Forgejo pull request events and PR
comment context.

## Trigger

The default workflow listens for pull request opened, synchronized, reopened,
closed, edited, label, and assignment events.

Fork pull requests are skipped by default unless the head repository matches the
target repository.

## Flow

1. Forgejo sends a `pull_request` event.
2. The bridge normalizes it to the `pull-request` surface.
3. The guardrail checks that `forgejo-intelligent-pull-request` is active.
4. `handler.ts` builds a prompt from PR title, body, branch, diff context, or
   comment metadata.
5. The orchestrator stores the mapping under
   `.forgejo-intelligence/state/pull-requests/<number>.json`.
6. The response is posted through Forgejo's issue comment API because Forgejo
   pull requests share issue-style comments.

## State

```text
.forgejo-intelligence/state/pull-requests/
.forgejo-intelligence/state/sessions/
```

New commits on the same PR resume the mapped session.

## Security

The write-capable PR path must not run on untrusted fork code. Keep the default
fork skip policy unless you create a separate read-only workflow.

Do not pass LLM provider secrets or custom write tokens to fork PR runs.

## Review Event Boundaries

Forgejo Intelligence does not enable separate GitHub review event streams as
runtime infrastructure. Review-like context belongs in the PR surface when
Forgejo payloads and instance APIs provide it.

## Disable

```bash
rm -rf .forgejo-intelligence/forgejo-intelligent-pull-request
git add -A
git commit -m "forgejo-intelligence: disable pull request surface"
git push
```

## Related

- [../../help/action-management.md](../help/action-management.md)
- [../../help/security.md](../help/security.md)
- [../../help/surfaces.md](../help/surfaces.md)
