# Bitbucket Fallback

Bitbucket is a commercial hosted fallback that gives a non-GitHub, non-self-hosted
copy of critical repositories under a different provider.

---

## Role in Forgejo-Mind

- Secondary or tertiary mirror for critical repositories only.
- Commercial hosted option if self-hosting capacity is temporarily constrained.
- Reduces concentration risk alongside Forgejo and Codeberg.
- Never the system of record.

---

## Phase 1 — Create the Bitbucket workspace

1. Go to <https://bitbucket.org> and sign in or create an account.
2. Create a **Workspace** that matches your organization name.
3. Generate an **App password** for API access:
   - **Profile picture** → **Personal settings** → **App passwords** → **Create app password**.
   - Permissions needed: `Repositories: Write`, `Pull requests: Write`.
4. Store the app password in your vault.

---

## Phase 2 — Create mirror repositories on Bitbucket

```bash
BB_USER="your-bitbucket-username"
BB_APP_PASSWORD="your-app-password"
BB_WORKSPACE="your-workspace-slug"
REPO_NAME="your-repo"

curl -s -X POST \
  "https://api.bitbucket.org/2.0/repositories/$BB_WORKSPACE/$REPO_NAME" \
  -u "$BB_USER:$BB_APP_PASSWORD" \
  -H "Content-Type: application/json" \
  -d "{
    \"scm\": \"git\",
    \"is_private\": false,
    \"description\": \"Mirror of https://git.yourdomain.com/$BB_WORKSPACE/$REPO_NAME\"
  }"
```

---

## Phase 3 — Configure push mirroring from Forgejo

Use Forgejo's push mirror feature to forward every push to Bitbucket.

```bash
FORGEJO_URL="https://git.yourdomain.com"
FORGEJO_TOKEN="your-forgejo-api-token"
REPO_OWNER="your-forgejo-org"
REPO_NAME="your-repo"
BB_USER="your-bitbucket-username"
BB_APP_PASSWORD="your-app-password"
BB_WORKSPACE="your-workspace-slug"

curl -s -X POST \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors" \
  -H "Authorization: token $FORGEJO_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"remote_address\": \"https://bitbucket.org/$BB_WORKSPACE/$REPO_NAME.git\",
    \"remote_username\": \"$BB_USER\",
    \"remote_password\": \"$BB_APP_PASSWORD\",
    \"sync_on_commit\": true,
    \"interval\": \"24h\"
  }"
```

Use a 24-hour interval for Bitbucket since it is a lower-priority mirror than Codeberg.

---

## Phase 4 — Add a canonical source notice

In the `README.md` of every Bitbucket mirror:

```markdown
> **Mirror notice:** This repository is a read-only mirror.
> The canonical source is at `https://git.yourdomain.com/YOURORG/YOURREPO`.
> Do not open issues or pull requests here.
```

---

## Phase 5 — Decommission procedure

When Bitbucket is no longer needed:

```bash
# 1. Remove the push mirror from Forgejo
# List mirrors to find the mirror ID
curl -s \
  -H "Authorization: token $FORGEJO_TOKEN" \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors" \
  | jq '.[] | {id, remote_address}'

# Delete the mirror by ID
curl -s -X DELETE \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors/MIRROR_ID" \
  -H "Authorization: token $FORGEJO_TOKEN"

# 2. Archive or delete the Bitbucket repository
# Do this in the Bitbucket web UI or via the API
```

---

## Continuity controls

- Confirm Bitbucket mirror sync is current at least weekly.
- Keep the decommission procedure documented and tested so Bitbucket can be dropped cleanly.
- Do not build any workflow that can only run in Bitbucket.

---

## Open decisions resolved

- **Repositories that justify Bitbucket:** Only the top five most critical core
  repositories (Forgejo configuration, runner images, governance policies, and any
  repository whose loss would halt all development). All others are covered by the
  Codeberg and GitLab mirrors.
- **Duration:** Bitbucket is long-term standing insurance. Keep it active as long as
  the annual cost is negligible relative to the continuity benefit. Review annually.
