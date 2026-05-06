# Ubuntu Foundation

Ubuntu is the base operating environment for the exit plan because it is fast, cheap, common, and well supported.

## Role in the exit plan

- Host the primary Forgejo deployment.
- Provide the standard development workstation environment.
- Run backup, sync, CI, and migration scripts.

## Required capabilities

- Reliable package management and security updates.
- SSH, Git, container, and reverse proxy support.
- Easy provisioning on low-cost local or cloud hardware.

## Build-out checklist

- Standardize on a supported Ubuntu LTS release.
- Define a baseline image for workstations and servers.
- Install Git, SSH, backup tooling, container runtime, and monitoring.
- Document user setup, key management, and disk encryption expectations.

## Continuity controls

- Use automated snapshots and off-machine backups.
- Keep infrastructure as code for host provisioning.
- Document restore steps for a new host from scratch.

## Open decisions

- Which Ubuntu LTS release is the baseline?
- Which provider or hardware pool is the preferred host target?
- Which backup target is the cheapest acceptable durable storage?
