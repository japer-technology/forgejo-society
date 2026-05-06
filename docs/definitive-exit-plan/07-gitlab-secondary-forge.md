# GitLab as a Secondary Forge

GitLab is the strongest full-featured hosted or self-managed secondary forge in this plan.

## Role in the exit plan

- Secondary forge for redundancy, collaboration, or staged migration.
- Backup venue for repositories that need richer integrated project features.
- Additional continuity mirror that stays subordinate to Forgejo as the source of truth.

## Why include GitLab

- Mature forge with broad ecosystem support.
- Flexible choice between hosted and self-managed operation.
- Useful hedge if the primary Forgejo stack needs time to mature.

## Build-out checklist

- Define whether GitLab is hosted or self-managed in this strategy.
- Mirror or import priority repositories.
- Map groups, permissions, and protected branches.
- Avoid letting GitLab become the only place where an essential workflow can run.

## Continuity controls

- Prevent GitLab from silently becoming the only place where a workflow works.
- Keep the system of record explicit for every repository.
- Test repository export and recovery paths.

## Open decisions

- Is GitLab a temporary bridge, a permanent mirror, or a full standby forge?
- Which GitLab features are acceptable without increasing lock-in?
