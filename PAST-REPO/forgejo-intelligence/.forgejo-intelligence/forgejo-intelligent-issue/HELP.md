# Forgejo Intelligent Issue Help

`forgejo-intelligent-issue` turns Forgejo issues into persistent agent
conversations.

## Trigger

The default Forgejo Actions workflow listens for issue events such as opened,
edited, reopened, closed, label changes, and assignment changes.

## Flow

1. Forgejo sends an `issues` event.
2. The bridge normalizes it to the `issue` surface.
3. The guardrail checks that `forgejo-intelligent-issue` is active.
4. `handler.ts` builds a prompt from the issue title, body, or edited comment
   metadata.
5. The orchestrator stores the session mapping under
   `.forgejo-intelligence/state/issues/<number>.json`.
6. The agent replies through the Forgejo issue comment API.

## State

```text
.forgejo-intelligence/state/issues/
.forgejo-intelligence/state/sessions/
```

Commenting on the same issue resumes the mapped JSONL session.

## What To Write

Good issue prompts include:

- the goal,
- relevant files or commands,
- expected behavior,
- current behavior,
- constraints,
- acceptance criteria.

## Security

Anyone who can create or edit issues in the repository can trigger this surface
unless the workflow adds label, actor, or permission conditions. Public
repositories should use a deliberately scoped token and explicit workflow
filters.

Do not put secrets in issue titles, bodies, or comments. Issue content can be
sent to the configured LLM provider.

## Disable

Remove the folder:

```bash
rm -rf .forgejo-intelligence/forgejo-intelligent-issue
git add -A
git commit -m "forgejo-intelligence: disable issue surface"
git push
```

Or remove `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` to disable
all surfaces.

## Related

- `README.md` in this folder for trigger, API, state, and unsupported behavior.
- `../../help/issues-management.md` for user-facing issue workflow help.
- `../../help/security.md` for token and trigger guidance.
