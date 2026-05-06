# Forgejo as the Primary Forge

Forgejo on Ubuntu is the intended system of record because it is free, open, and aligned with a self-hosted exit strategy.

## Role in the exit plan

- Canonical remote for all authoritative repositories.
- Main home for issues, pull requests, releases, packages, and documentation.
- Primary authentication and governance boundary for software work.
- Administrative control plane that stays small, reliable, and policy-focused.

## Why Forgejo

- Open source and self-hostable.
- Git-centric and familiar to contributors.
- Lower dependency on a single commercial platform.
- Clean separation between the governance layer and any external publication layer.

## Build-out checklist

- Provision Forgejo on Ubuntu.
- Configure domain, TLS, email, storage, and backups.
- Define organizations, teams, permissions, and branch protections.
- Define repository classes such as core infrastructure, agent, experimental, public showcase, and archive.
- Import repositories and essential metadata.
- Recreate CI and release flows in a Forgejo-compatible form without making Forgejo itself the heavy execution substrate.
- Define promotion rules for agent-created repositories and workflows before they become trusted.

## Migration tasks

- Move canonical remotes from GitHub to Forgejo.
- Publish contributor instructions with new clone and push URLs.
- Replace GitHub issue and pull request references in active docs.
- Validate that releases, tags, and packages are reproducible from Forgejo.
- Treat GitHub as an outbound mirror and release surface rather than the primary collaboration space.

## Continuity controls

- Back up database, repositories, configuration, and object storage.
- Test restore into a clean Ubuntu host.
- Keep a hosted mirror outside the primary infrastructure.
- Keep Forgejo administrative and offload high-volume execution to a separately governed runner fleet.

## Open decisions

- Which authentication method is the default?
- Which queueing and runner model will replace GitHub Actions at scale?
- Which data classes must be imported versus archived?
