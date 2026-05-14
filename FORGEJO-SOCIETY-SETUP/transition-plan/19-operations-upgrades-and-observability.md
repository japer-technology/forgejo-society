# Operations, Upgrades, and Cognitive Observability

This document covers the day-two operating discipline for Forgejo-Society: recovery,
maintenance, validation, and cognition-aware telemetry.

---

## Runbooks

### Forge server recovery runbook

1. Confirm host reachability, disk health, and free space.
2. Restore the latest Forgejo application config from backup.
3. Restore the PostgreSQL dump to a clean PostgreSQL instance.
4. Restore repository data, LFS data, and attachments.
5. Start Forgejo and verify HTTP, SSH, background jobs, and Actions registration.
6. Validate one clone, one login, one issue page, and one protected-branch policy.
7. Record the incident and recovery settlement in memory.

### Runner failure, drain, and replacement

1. Mark the runner host `draining` in inventory.
2. Disable new job assignment before maintenance.
3. Wait for active jobs to complete or expire by policy.
4. Rebuild the node from the runner install order.
5. Register a fresh runner token; never reuse tokens from failed hosts.
6. Validate labels, concurrency, and one known-good workflow.

### Certificate failure runbook

1. Check DNS resolution and firewall reachability for ports 80 and 443.
2. Inspect Caddy logs and certificate renewal timestamps.
3. Confirm the system clock and ACME challenge reachability.
4. Re-run renewal or replace with the staged fallback certificate.
5. Validate browser trust, `curl -I`, and Git-over-HTTPS.

### Database restore validation runbook

1. Restore to a non-production host first.
2. Compare backup timestamp with the expected recovery point objective.
3. Run `psql` integrity checks and count key tables.
4. Start Forgejo against the restored database.
5. Verify login, repository list, issues, pull requests, releases, and SSH clones.
6. Record restore duration and data-loss window.

---

## Troubleshooting matrix

| Symptom | Check first | Likely fault domain |
|---|---|---|
| Forgejo UI unreachable | DNS, Caddy, `systemctl status forgejo` | network or service |
| Clone over SSH fails | SSH host key, port, `app.ini`, firewall | SSH config |
| Workflows queue forever | runner online state, labels, token scope | runner fleet |
| Agent activated but no PR created | workflow logs, settlement branch, token permissions | agent runtime |
| Cloud escalation blocked | proxy allowlist, censor result, repo class policy | privacy policy |
| Memory missing after merge | provenance job logs, memory repo protection, write token | memory path |

---

## Upgrade and rollback procedures

### Forgejo upgrade

1. Review release notes and required config changes.
2. Snapshot config, binary version, and database backup before change.
3. Apply the upgrade to staging or a maintenance window host first.
4. Run smoke checks: login, clone, PR view, Actions dispatch, webhook delivery.
5. Keep the prior binary and config for fast rollback.

### Forgejo rollback

- Stop Forgejo.
- Restore the previous binary and config.
- Restore the pre-upgrade database only if schema changes require it.
- Re-run smoke checks and record the rollback cause.

### Runner fleet rolling upgrade

1. Drain one runner at a time.
2. Upgrade the runner binary or base image.
3. Run one validation workflow on the upgraded node.
4. Continue only if the validation job succeeds.
5. Keep at least one known-good runner pool available during the rollout.

### LM Studio and model upgrade policy

- Add new models beside the current approved model, not in place of it.
- Test latency, prompt fit, and refusal behaviour on the example task pack.
- Promote only after governance records the approved default.
- Keep the last approved model available for rollback until the next review cycle.

### Config migration checks before restart

- validate `app.ini` and reverse-proxy config syntax
- confirm secret files and permissions
- verify runner labels and token scopes still match policy
- confirm outbound allowlists still reflect policy

---

## Cognitive observability

### Required metrics

| Metric | Why it matters | Source |
|---|---|---|
| activation rate by agency | Shows whether routing is sensible | workflow events / settlement logs |
| K-line hit rate | Shows whether memory is helping | memory lookup logs |
| critic objection frequency | Shows quality pressure and noisy agents | PR review data |
| settlement latency by path | Shows operational friction | settlement timestamps |
| cloud-escalation frequency and cost | Shows whether local-first is holding | proxy / billing logs |
| failure taxonomy by agent | Shows where automation breaks | incident and workflow records |

### Minimum dashboards

1. **Society health** — activation volume, settlement completion, objection rate
2. **Memory quality** — K-line usage, reinforcement changes, retirements
3. **Execution health** — runner availability, queue time, workflow failures
4. **Privacy and spend** — cloud escalations, blocked attempts, monthly cost

### Review cadence

- Daily: runner health, queue depth, failed workflows
- Weekly: failed settlements, critic objections, recovery readiness
- Monthly: agent promotion/demotion review, K-line retirement review, cloud cost review
- Quarterly: full backup restore drill and upgrade rehearsal

---

## Definition of done for operations

- [ ] Recovery runbooks exist for forge, runners, certificates, and database restores
- [ ] Upgrade and rollback procedures are explicit
- [ ] Troubleshooting starts with a simple matrix
- [ ] Cognitive metrics are defined alongside host metrics
- [ ] Reviews have daily, weekly, monthly, and quarterly cadence
