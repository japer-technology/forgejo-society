# Security, Quotas, and Operational Governance

Runner governance has to be built before runner scale.

## Role in the exit plan

- Define who can spawn runners, what code they can execute, what secrets they can access, and how long they live.
- Set approval boundaries for sensitive jobs and sensitive repositories.
- Keep provenance, auditability, and retention rules ahead of convenience.

## Governance controls

- Treat agent-created repositories, workflows, and automation as untrusted until promoted.
- Scope permissions by repo class, environment, and task type.
- Require clear ownership for secrets, runner pools, and publication rights.
- Keep a documented approval path for privileged changes.

## Repository classes

- **Core infrastructure repos**: strict runner policy, strongest backups, limited publication.
- **Agent repos**: sandboxed execution, tighter quotas, explicit promotion rules.
- **Experimental repos**: short retention, cheap isolation, easy archival.
- **Public showcase repos**: stronger publication review and reputation controls.
- **Archive repos**: minimal execution, durable backups, read-only handling.

## Required safeguards

- Provenance records for builds, releases, and sensitive artifacts.
- Audit logs for runner creation, secret access, approval actions, and publication events.
- Artifact retention rules by repository class.
- Hard quotas for compute, storage, model spend, and concurrency.

## Continuity and failure planning

- Back up repositories, database, config, artifacts, packages, and secrets metadata.
- Test full restore to a clean Ubuntu host.
- Define operating procedures if GitHub disappears, a runner pool fails, one server dies, or a mirror goes stale.
- Keep a reduced-service mode documented for emergencies.

## Open decisions

- Which actions require human approval every time?
- Which secrets may ever reach a runner, and under what conditions?
- Which audit logs must be retained the longest?
