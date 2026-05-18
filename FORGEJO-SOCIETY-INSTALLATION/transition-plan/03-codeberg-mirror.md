# Codeberg Mirror

Codeberg is a Forgejo-based public forge. Because both the primary forge and
Codeberg run Forgejo, the API and workflow are identical. Codeberg serves as a
public continuity mirror — not the system of record.

---

## Role in Forgejo-Society

- Public mirror of selected repositories for visibility and redundancy.
- Fallback collaboration point if the primary Forgejo instance is unavailable.
- Public discovery surface that is not GitHub.
- Mirror only — Forgejo is always canonical.

---

## Phase 1 — Create the Codeberg account

1. Go to <https://codeberg.org> and create an account (or organization).
2. Generate a Codeberg API token: **Settings** → **Applications** → **Access tokens**.
3. Scope the token: `repository`, `read:user`, `write:repository`.
4. Store the token in your password vault.

---

## Phase 2 — Configure push mirroring in Forgejo

Forgejo supports push mirroring natively: every push to Forgejo is automatically
forwarded to Codeberg.

### 2.1 Enable a push mirror via the web UI

1. Open the repository in Forgejo.
2. Go to **Settings** → **Mirror settings** → **Push mirrors**.
3. Click **Add push mirror**.
4. Fill in:
   - **Remote URL**: `https://codeberg.org/YOURORG/YOURREPO.git`
   - **Authentication**: enter your Codeberg username and API token as the password.
   - **Sync on commit**: enabled.
   - **Interval**: `8h` (or shorter if needed).
5. Click **Add mirror**.
6. Click **Synchronize now** to do the initial push.

### 2.2 Enable a push mirror via the Forgejo API

```bash
FORGEJO_URL="https://git.yourdomain.com"
FORGEJO_TOKEN="your-forgejo-api-token"
CODEBERG_USER="your-codeberg-username"
CODEBERG_TOKEN="your-codeberg-api-token"
REPO_OWNER="your-forgejo-org"
REPO_NAME="your-repo"

curl -s -X POST \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors" \
  -H "Authorization: token $FORGEJO_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"remote_address\": \"https://codeberg.org/$CODEBERG_USER/$REPO_NAME.git\",
    \"remote_username\": \"$CODEBERG_USER\",
    \"remote_password\": \"$CODEBERG_TOKEN\",
    \"sync_on_commit\": true,
    \"interval\": \"8h\"
  }"
```

### 2.3 Bulk push mirror setup for multiple repositories

```bash
#!/usr/bin/env bash
set -euo pipefail

FORGEJO_URL="https://git.yourdomain.com"
FORGEJO_TOKEN="your-forgejo-api-token"
FORGEJO_ORG="your-forgejo-org"
CODEBERG_USER="your-codeberg-user"
CODEBERG_TOKEN="your-codeberg-api-token"

# List all repos in the Forgejo org
repos=$(curl -s \
  -H "Authorization: token $FORGEJO_TOKEN" \
  "$FORGEJO_URL/api/v1/orgs/$FORGEJO_ORG/repos?limit=50" \
  | jq -r '.[].name')

for repo in $repos; do
  echo "Setting up Codeberg mirror for: $repo"

  # Create the repo on Codeberg first (if it does not exist)
  curl -s -X POST "https://codeberg.org/api/v1/orgs/$CODEBERG_USER/repos" \
    -H "Authorization: token $CODEBERG_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$repo\", \"private\": false}" \
    > /dev/null

  # Register the push mirror in Forgejo
  curl -s -X POST \
    "$FORGEJO_URL/api/v1/repos/$FORGEJO_ORG/$repo/push_mirrors" \
    -H "Authorization: token $FORGEJO_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"remote_address\": \"https://codeberg.org/$CODEBERG_USER/$repo.git\",
      \"remote_username\": \"$CODEBERG_USER\",
      \"remote_password\": \"$CODEBERG_TOKEN\",
      \"sync_on_commit\": true,
      \"interval\": \"8h\"
    }"

  echo "  Mirror registered."
  sleep 0.5
done
```

---

## Phase 3 — Add a canonical source notice

Add this notice to the `README.md` of every mirrored repository so visitors know
where the real repository lives:

```markdown
> **Mirror notice:** This repository is a public mirror.
> The canonical source is at `https://git.yourdomain.com/YOURORG/YOURREPO`.
> Issues and pull requests are tracked on the primary forge.
```

---

## Phase 4 — Monitor mirror health

```bash
# Check mirror status for a specific repository
curl -s \
  -H "Authorization: token $FORGEJO_TOKEN" \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors" \
  | jq '.[] | {remote_address, last_error, last_update}'
```

A `last_error` value of `null` means the last sync succeeded.

---

## Continuity controls

- Check mirror sync status weekly; alert if any mirror has a `last_error`.
- Keep a documented procedure for manually force-syncing a stale mirror:

```bash
# Force a push mirror sync via the Forgejo API
curl -s -X POST \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors/sync" \
  -H "Authorization: token $FORGEJO_TOKEN"
```

- Test public clone access from Codeberg at least monthly:

```bash
git clone https://codeberg.org/YOURORG/YOURREPO.git /tmp/codeberg-test-clone
```

- Document the procedure for updating public Codeberg URLs if the Forgejo domain changes.

---

## Open decisions resolved

- **Mirror scope:** Mirror all repositories that are in the `public-showcase` or
  `open-contribution` class. Private and experimental repositories are not mirrored.
  Review the mirror list quarterly.
- **Issues on Codeberg:** Disable issues on all Codeberg mirrors. Codeberg is a
  read-only continuity mirror, not a collaboration point. The Forgejo instance is
  the only issue tracker.
- **Mirror lag alert threshold:** Alert if any mirror's `last_update` timestamp is
  more than 24 hours old. Check mirror status daily via a scheduled Forgejo Actions
  workflow that calls the API and posts an alert issue if the lag threshold is exceeded.
