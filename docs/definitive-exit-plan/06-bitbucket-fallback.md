# Bitbucket Fallback

Bitbucket is a commercial fallback option that can serve as an additional remote and continuity layer.

## Role in the exit plan

- Secondary or tertiary mirror for critical repositories.
- Commercial hosted option if self-hosting capacity is temporarily constrained.

## Why include Bitbucket

- Gives another non-GitHub remote under a different provider.
- Can reduce concentration risk when combined with Forgejo and Codeberg.

## Build-out checklist

- Create a minimal workspace structure.
- Mirror only the repositories that truly need another hosted copy.
- Record authentication, remote, and access recovery procedures.

## Continuity controls

- Keep mirrored repositories current.
- Avoid unique process dependencies that exist only in Bitbucket.
- Document how to decommission Bitbucket without losing any source of truth.

## Open decisions

- Which repositories justify a Bitbucket mirror?
- Is Bitbucket temporary insurance or a standing long-term backup?
