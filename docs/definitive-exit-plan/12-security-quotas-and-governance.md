# Security, Quotas, and Operational Governance

Governance must be established before runner scale. This document defines who can
spawn runners, what code they can execute, what secrets they can access, how long
runners live, and what the approval path is for privileged changes.

---

## Repository classes and their controls

| Class | Runner policy | Secret access | Backup priority | Publication |
|---|---|---|---|---|
| `core` | Dedicated runners only | Org-level secrets allowed | Daily + off-site | Private by default |
| `agent` | Shared runners; sandboxed | Repo-level secrets only | Daily | Controlled |
| `experimental` | Shared runners; 30-min timeout | No secrets | Weekly | Not published |
| `public-showcase` | Shared runners | No production secrets | Daily | Public |
| `archive` | No runners | Read-only | Monthly | Read-only |

---

## Phase 1 — Forgejo security configuration

### 1.1 Disable open registration (after initial setup)

In `/etc/forgejo/app.ini`:

```ini
[service]
DISABLE_REGISTRATION = true
```

Restart Forgejo:

```bash
sudo systemctl restart forgejo
```

New users must be created by an admin.

### 1.2 Require two-factor authentication for admins

In the Forgejo web UI:

**Site Administration** → **Authentication Sources** → require 2FA for admin accounts.

Or enforce via policy: every admin account must have TOTP enabled under **Settings** → **Security**.

### 1.3 Enable Forgejo audit log

In `/etc/forgejo/app.ini`:

```ini
[log]
MODE      = file, console
LEVEL     = info
ROOT_PATH = /var/lib/forgejo/log

[log.file]
FILENAME  = /var/lib/forgejo/log/forgejo.log
MAX_DAYS  = 90
```

Restart:

```bash
sudo systemctl restart forgejo
```

### 1.4 Rotate the Forgejo SECRET_KEY annually

```bash
# Generate a new key
openssl rand -base64 32

# Update /etc/forgejo/app.ini [security] SECRET_KEY
# This invalidates all existing sessions — users must log in again
sudo systemctl restart forgejo
```

---

## Phase 2 — Secret management

### 2.1 Secret scoping rules

| Secret type | Where to store | Who can access |
|---|---|---|
| Database password | Forgejo org secret `DB_PASSWORD` | Core infra repos only |
| API tokens for mirrors | Forgejo repo secret | That repository only |
| Cloud model API key | Forgejo org secret `CLOUD_MODEL_KEY` | Agent repos with explicit policy |
| SSH deploy keys | Forgejo repo deploy key | That repository's runners |
| LM Studio endpoint | Forgejo org variable (not secret) | All runner workflows |

### 2.2 Create a repository-level secret

```bash
FORGEJO_URL="https://git.yourdomain.com"
FORGEJO_TOKEN="your-admin-token"
REPO_OWNER="your-org"
REPO_NAME="your-repo"

curl -s -X PUT \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/actions/secrets/MY_SECRET" \
  -H "Authorization: token $FORGEJO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": "secret-value-here"}'
```

### 2.3 Create an organisation-level secret

```bash
curl -s -X PUT \
  "$FORGEJO_URL/api/v1/orgs/$ORG_NAME/actions/secrets/MY_ORG_SECRET" \
  -H "Authorization: token $FORGEJO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": "secret-value-here"}'
```

### 2.4 Secret rotation procedure

When rotating a secret:

1. Generate the new credential at the source (database, API service, etc.).
2. Update the Forgejo secret via the API or web UI.
3. Trigger any workflows that depend on the secret to confirm they still pass.
4. Revoke the old credential at the source.
5. Record the rotation date in the team log (an issue in `governance-policies`).

---

## Phase 3 — Runner quotas

Set these defaults in each runner's `config.yaml`:

```yaml
runner:
  capacity: 4          # max concurrent jobs per node
  timeout: 3h          # maximum job run time

cache:
  enabled: true
```

And in individual workflows:

```yaml
jobs:
  build:
    runs-on: ubuntu-standard
    timeout-minutes: 60    # hard deadline per job
```

### 3.1 Per-repository concurrency limits

In Forgejo, concurrency limits are enforced at the workflow level:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### 3.2 Artifact retention

In `/etc/forgejo/app.ini`:

```ini
[actions]
ARTIFACT_RETENTION_DAYS = 30   # delete artifacts after 30 days
```

---

## Phase 4 — Approval gates

### 4.1 Branch protection on `main`

Configure via the Forgejo web UI for each core repository:

**Repository** → **Settings** → **Branches** → **Add rule** for `main`:

- [ ] Require pull request before merging
- [ ] Require approvals: 1
- [ ] Dismiss stale approvals when new commits are pushed
- [ ] Require status checks to pass (specify the CI workflow name)
- [ ] Restrict who can push to matching branches (maintainers only)

### 4.2 Required approval for privileged changes

Document in `governance-policies/approval-gates.md`:

| Change type | Approval required |
|---|---|
| Merging to `main` in a core repo | 1 human reviewer |
| Promoting an agent from `experimental` to `probation` | Lead maintainer |
| Publishing a new repository publicly | Lead maintainer |
| Rotating a production secret | 2 maintainers |
| Changing Forgejo site configuration | Lead maintainer |
| Adding a new runner to the fleet | Lead maintainer |

---

## Phase 5 — Audit log review

Review the Forgejo audit log weekly for anomalies:

```bash
# Recent Forgejo log entries (last 100 lines)
sudo tail -100 /var/lib/forgejo/log/forgejo.log

# Filter for authentication events
sudo grep -i "login\|auth\|token" /var/lib/forgejo/log/forgejo.log | tail -50

# Filter for admin actions
sudo grep -i "admin\|site\|delete\|ban" /var/lib/forgejo/log/forgejo.log | tail -50
```

---

## Phase 6 — Disaster recovery procedures

### 6.1 Scenario: GitHub disappears

**Impact:** No new public mirrors; no inbound GitHub webhooks.
**Response:**
1. Internal development continues uninterrupted on Forgejo.
2. Update public-facing documentation to point to Codeberg or GitLab mirrors.
3. Re-point any external integrations that used GitHub webhooks.

### 6.2 Scenario: One runner node fails

**Impact:** Reduced CI capacity.
**Response:**
1. Remove the failed node from the runner pool: **Site Administration** → **Runners** → delete runner.
2. Jobs automatically re-queue and run on remaining nodes.
3. Rebuild the failed node from the standard runner provisioning procedure.

### 6.3 Scenario: Forge server dies

**Impact:** All development work halted.
**Response:**

```bash
# 1. Boot a new Ubuntu 24.04 LTS server
# 2. Run the Ubuntu foundation setup (01-ubuntu-foundation.md)
# 3. Run the PostgreSQL setup (13-postgresql-database.md)
# 4. Restore the database from the latest backup
zcat /backup/postgresql/forgejo-TIMESTAMP.sql.gz | sudo -u postgres psql forgejo

# 5. Restore Forgejo data
sudo -u forgejo tar -xzf /backup/forgejo/TIMESTAMP/forgejo-data-TIMESTAMP.tar.gz -C /

# 6. Restore Forgejo config
sudo cp /backup/forgejo/TIMESTAMP/app.ini.bak /etc/forgejo/app.ini

# 7. Install the Forgejo binary (02-forgejo-primary-forge.md Phase 1)
# 8. Start Forgejo
sudo systemctl start forgejo

# 9. Update DNS A record to new server IP
# 10. Verify runners can reconnect
```

Target recovery time: under 2 hours from a clean server with current backups.

### 6.4 Scenario: Mirror goes stale

```bash
# Force a sync on all push mirrors for a repository
curl -s -X POST \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors/sync" \
  -H "Authorization: token $FORGEJO_TOKEN"
```

---

## Continuity controls

- Run disaster recovery drill at least once per quarter.
- Verify backup integrity weekly: restore the database to a test instance.
- Review audit logs weekly for unexpected admin actions or authentication failures.
- Rotate all secrets and tokens annually; record rotation dates.
- Keep the `governance-policies` repository updated whenever a rule changes.

---

## Open decisions

- [ ] Which actions require human approval every time, with no automation exception?
- [ ] Which audit logs must be retained the longest (compliance or legal requirements)?
- [ ] Is a SIEM or centralized log management system needed for the runner fleet?
