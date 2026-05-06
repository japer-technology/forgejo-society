# Ubuntu Foundation

Ubuntu is the base operating environment for the exit plan because it is common, well supported, and suitable for a repeatable self-hosted stack.

## Role in the exit plan

- Host the primary Forgejo deployment.
- Provide the standard workstation and server baseline.
- Run runner hosts, backup hosts, reverse proxy and TLS, and monitoring services.
- Provide the clean restore target for disaster recovery drills.

## Required capabilities

- Reliable package management and security updates.
- SSH, Git, container, and reverse proxy support.
- Easy provisioning on low-cost local or cloud hardware.
- Repeatable host imaging and configuration management.
- Enough operational consistency that Forgejo, runners, and backups can be rebuilt the same way every time.

## Build-out checklist

- Standardize on a supported Ubuntu LTS release.
- Define baseline images for workstations, Forgejo hosts, runner hosts, and backup hosts.
- Standardize reverse proxy, TLS, monitoring, backup tooling, and container runtime choices.
- Install Git, SSH, backup tooling, container runtime, and monitoring.
- Document user setup, key management, disk encryption, and patching expectations.
- Keep provisioning and restore procedures documented and reproducible.

## Continuity controls

- Use automated snapshots and off-machine backups.
- Keep infrastructure as code for host provisioning.
- Document restore steps for a new host from scratch.
- Test full restore to a clean Ubuntu host.

## Open decisions

- Which Ubuntu LTS release is the baseline?
- Which provider or hardware pool is the preferred host target?
- Which backup target is the cheapest acceptable durable storage?
