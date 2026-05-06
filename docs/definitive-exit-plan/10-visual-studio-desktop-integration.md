# Visual Studio and Desktop Integration

Desktop developer experience should work cleanly against Forgejo without requiring a vendor-specific client.

## Role in the exit plan

- Keep Git CLI, Forgejo web UI, and Visual Studio Git integration all viable.
- Make HTTPS and SSH both supported for normal repository access.
- Preserve a normal workstation flow for contributors who do not want specialized tooling.

## Baseline workflow

- Clone, fetch, branch, commit, push, and pull through standard Git remotes.
- Open pull requests and review work through the Forgejo web UI.
- Support Visual Studio users through standard Git integration rather than GitHub-only extensions.
- Keep contributor instructions consistent across Linux and desktop environments.

## Documentation checklist

- Publish standard remote URL patterns for Forgejo over HTTPS and SSH.
- Document authentication and credential rotation for desktop users.
- Document branch naming, pull request, and review expectations in forge-neutral terms.
- Keep vendor-neutral fallback instructions with plain Git for every documented workflow.

## Guardrails

- Avoid workflows that require one proprietary desktop client.
- Avoid automation that depends on GitHub-only APIs when a repository lives in Forgejo.
- Keep local repository state and remote state understandable without hidden tooling.

## Open decisions

- Which credential helper is the default for HTTPS users?
- Is SSH the preferred default for all maintainers?
- Which desktop environments must be documented alongside Ubuntu workstations?
