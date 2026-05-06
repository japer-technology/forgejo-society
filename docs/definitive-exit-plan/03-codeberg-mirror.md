# Codeberg Mirror

Codeberg is a strong hosted complement because it is community-oriented and Forgejo-based.

## Role in the exit plan

- Public mirror for important repositories.
- Fallback collaboration point if the primary Forgejo instance is unavailable.
- Public discovery surface that is not GitHub.

## Why include Codeberg

- Aligned with open infrastructure values.
- Familiar forge model if Forgejo is the primary system.
- Useful for redundancy without building another full self-hosted stack.

## Build-out checklist

- Create the Codeberg organization or account structure.
- Mirror the highest-priority repositories.
- Publish minimal profile and repository descriptions.
- Track any features that differ from the primary Forgejo deployment.

## Continuity controls

- Keep mirror cadence documented and automated.
- Confirm public clone access for all mirrored repositories.
- Maintain a small operating manual for switching public references to Codeberg.

## Open decisions

- Which repositories are mirrored continuously versus selectively?
- Will issues stay disabled on mirrors or act as emergency intake?
- What is the acceptable replication lag?
