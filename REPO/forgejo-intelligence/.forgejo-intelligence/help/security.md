# Security Expectations

Forgejo Intelligence is write-capable automation. Treat installation like adding
any other repository automation that can comment, commit, label, and call APIs.

## Who Can Trigger The Agent

The workflow can run for the events configured in:

```text
.forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml
```

By default, issue, pull request, release, push, schedule, and manual dispatch
events can start a run.

Important implications:

- In public repositories, anyone who can open or edit an issue may trigger the
  issue surface unless you add label, actor, or permission conditions.
- The guardrail blocks known bot actors, unknown event surfaces, inactive
  surfaces, and over-large payloads.
- The sentinel file must exist before any runtime step proceeds.
- Fork pull requests are skipped by default.

## Token Used

The default token is Forgejo Actions' automatic `FORGEJO_TOKEN`.

The installer can render a workflow that uses a repository secret instead:

```bash
bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts \
  --yes \
  --force \
  --api-token-strategy secret:FORGEJO_PAT
```

The Forgejo API adapter authenticates with:

```text
Authorization: token <FORGEJO_TOKEN>
```

Do not add scattered API calls from surface modules. Add missing platform
behavior to `.forgejo-intelligence/platform/forgejo-api.ts`.

## Repository Units That May Need Write Access

Grant only what enabled surfaces require:

| Unit | Needed for |
| --- | --- |
| Contents | Committing `.forgejo-intelligence/state/` and agent file changes. |
| Issues and comments | Issue chat, progress comments, reactions, labels, and assignments. |
| Pull requests | PR comments, PR metadata, and diff-aware behavior. |
| Labels and milestones | Triage and planning surfaces. |
| Releases | Release drafting or release response surfaces. |
| Wiki | Wiki knowledge and decision log surfaces. |
| Packages, projects, teams | Instance-specific surfaces when enabled and validated. |

Forgejo Actions may ignore compatibility `permissions:` declarations. Enforce
scope through Forgejo repository and token administration.

## Fork Pull Requests

The default workflow condition allows pull request runs only when the PR head
repository is the same as the target repository.

Keep that policy unless you build a separate read-only fork workflow. Untrusted
fork code must not receive write tokens or LLM provider secrets.

## Secrets

Secrets belong in Forgejo Actions repository secrets, not in issues, comments,
wiki pages, pull request bodies, state files, or prompts.

The workflow dumps redacted Forgejo context for diagnostics. It redacts common
secret-like fields, but maintainers should still avoid putting secret values in
event bodies.

Provider secrets are passed only to the `Run` step. If you change providers,
update both `.forgejo-intelligence/.pi/settings.json` and the workflow secret
mapping through the installer.

## Fail-Closed Controls

Use these controls in order:

1. Remove `.forgejo-intelligence/forgejo-intelligence-ENABLED.md` to stop all
   runtime execution.
2. Remove a `forgejo-intelligent-*` folder to disable one surface.
3. Tighten workflow triggers or add job-level `if` conditions.
4. Reduce token scope or switch to a dedicated secret token.
5. Disable the workflow in the Forgejo UI for an immediate UI-level stop.

## Public Repository Checklist

- Add label or actor filters before enabling issue automation.
- Keep fork pull request skipping enabled.
- Use a token with minimal write access.
- Warn contributors not to paste secrets into issues or comments.
- Review state commits regularly.
- Run `bun run check:phase9` before release changes.
