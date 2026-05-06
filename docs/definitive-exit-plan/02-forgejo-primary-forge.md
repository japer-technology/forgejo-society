# Forgejo as the Primary Forge

Forgejo is the intended system of record because it is free, open, and aligned with a self-hosted exit strategy.

## Role in the exit plan

- Primary remote for all canonical repositories.
- Main home for issues, pull requests, releases, and documentation.
- Primary authentication and governance boundary for software work.

## Why Forgejo

- Open source and self-hostable.
- Git-centric and familiar to contributors.
- Lower dependency on a single commercial platform.

## Build-out checklist

- Provision Forgejo on Ubuntu.
- Configure domain, TLS, email, storage, and backups.
- Define organizations, teams, permissions, and branch protections.
- Import repositories and essential metadata.
- Recreate CI and release flows in a Forgejo-compatible form.

## Migration tasks

- Move canonical remotes from GitHub to Forgejo.
- Publish contributor instructions with new clone and push URLs.
- Replace GitHub issue and pull request references in active docs.
- Validate that releases, tags, and packages are reproducible from Forgejo.

## Continuity controls

- Back up database, repositories, configuration, and object storage.
- Test restore into a clean Ubuntu host.
- Keep a hosted mirror outside the primary infrastructure.

## Open decisions

- Which authentication method is the default?
- Which CI runner model will replace GitHub Actions?
- Which data classes must be imported versus archived?
