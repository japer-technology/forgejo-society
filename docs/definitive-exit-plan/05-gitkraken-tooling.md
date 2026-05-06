# GitKraken Tooling

GitKraken belongs in the tooling layer, not the system-of-record layer.

## Role in the exit plan

- Optional desktop Git client for day-to-day repository operations.
- Optional productivity tool for contributors who prefer a GUI workflow.
- Secondary to plain Git, Forgejo web UI, and Visual Studio Git integration.

## Boundaries

- Do not make GitKraken the canonical home of repositories or project records.
- Keep every workflow reproducible with plain Git and web forge access.
- Keep the default documentation centered on Forgejo-compatible HTTPS and SSH remotes.
- Ensure credentials and remotes can be rotated without vendor lock-in.

## Adoption checklist

- Document whether GitKraken is supported, optional, or discouraged.
- Confirm it works cleanly with Forgejo, GitHub, Codeberg, GitLab, and Bitbucket remotes.
- Keep CLI-based instructions as the baseline documentation.

## Open decisions

- Is GitKraken part of the standard contributor setup or merely tolerated?
- Are there paid features that would create unnecessary dependency?
