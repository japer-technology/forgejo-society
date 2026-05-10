# Issues Management

Forgejo issues are the primary conversation surface for Forgejo Intelligence.
Each issue can become a persistent agent session.

## How Issue Sessions Work

1. A user opens or edits an issue.
2. Forgejo Actions sends the event payload to the workflow.
3. The bridge normalizes the payload to an `issue` event.
4. `forgejo-intelligent-issue/handler.ts` builds the prompt.
5. The orchestrator maps the issue number to a session file.
6. The agent replies with a Forgejo issue comment.
7. The session mapping and JSONL transcript are committed to git.

State files live under:

```text
.forgejo-intelligence/state/issues/
.forgejo-intelligence/state/sessions/
```

Commenting on the same issue resumes the same session.

## Good Issue Prompts

The agent can answer questions, inspect code, propose changes, or make edits
when the token and tools allow it. Helpful issue bodies include:

- The goal.
- Relevant files or commands.
- Expected behavior.
- Current behavior.
- Constraints or acceptance criteria.

Example:

```markdown
Title: Add Forgejo smoke instructions to the docs

Please update the local development docs with the environment variables needed
for `bun run smoke:local-forgejo`. Keep it focused on disposable test
repositories.
```

## Continue A Conversation

Add a comment to the same issue. The agent loads the mapped session from
`.forgejo-intelligence/state/issues/<number>.json` and continues from prior
context.

## Hatching

The optional hatching template creates an issue with the `hatch` label. Use it
to define the agent name, voice, and project-specific behavior. The resulting
identity lives in `.forgejo-intelligence/AGENTS.md`.

## Trigger Control

If your public repository accepts issues from anyone, anyone who can open or
edit an issue can trigger the issue workflow. Control that with:

- repository permissions,
- workflow `if` conditions,
- label filters,
- sentinel removal during maintenance,
- limiting enabled surfaces,
- using a token with the smallest practical write scope.

## Comment Size

The orchestrator caps posted replies at 60,000 characters. Longer output
remains visible in workflow logs and, when relevant, in committed files.

## Troubleshooting

No reply:

- Check the Actions run.
- Confirm the sentinel file exists.
- Confirm the provider secret is available.
- Confirm `forgejo-intelligent-issue` exists under `.forgejo-intelligence/`.
- Confirm the event was not rejected as a bot actor or over-large payload.

Session did not resume:

- Check `.forgejo-intelligence/state/issues/<number>.json`.
- Confirm the referenced JSONL file exists in
  `.forgejo-intelligence/state/sessions/`.

The agent should not run:

- Remove `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` and commit.
- Or remove `.forgejo-intelligence/forgejo-intelligent-issue/` to disable issue
  intelligence specifically.
