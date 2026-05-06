# Publication and Reputation Strategy

Public visibility is a governed publication layer. Private and active work lives
in Forgejo. Selected repositories are reflected outward to GitHub and other
public surfaces on purpose, as a deliberate release step.

---

## Role in the exit plan

- Keep private and active work inside Forgejo.
- Publish selected repositories outward to GitHub, Codeberg, and GitLab as governed mirrors.
- Preserve public credibility and discoverability without making GitHub the center of operations.

---

## Repository publication classes

| Class | Where it lives | Mirror cadence | Issues open? |
|---|---|---|---|
| `private` | Forgejo only | — | Internal only |
| `mirrored-public` | Forgejo + GitHub + Codeberg | On commit | Disabled on mirrors |
| `open-contribution` | Forgejo + GitHub | On commit | Open on GitHub mirror for intake |
| `archive` | Forgejo only (read-only) | — | Closed |

---

## Phase 1 — Mirror to GitHub for public visibility

### 1.1 Create the GitHub repository

```bash
# Using the GitHub CLI
gh repo create YOURORG/YOURREPO --public --description "Mirror of https://git.yourdomain.com/YOURORG/YOURREPO"
```

Or create it manually at <https://github.com/new>.

### 1.2 Add a canonical source notice in the GitHub README

Edit `README.md` to include:

```markdown
> **Mirror notice:** This repository is a public mirror.
> The canonical source and issue tracker are at
> [`https://git.yourdomain.com/YOURORG/YOURREPO`](https://git.yourdomain.com/YOURORG/YOURREPO).
```

### 1.3 Configure the push mirror in Forgejo

```bash
FORGEJO_URL="https://git.yourdomain.com"
FORGEJO_TOKEN="your-forgejo-api-token"
REPO_OWNER="your-forgejo-org"
REPO_NAME="your-repo"
GITHUB_USER="your-github-username"
GITHUB_TOKEN="your-github-pat"

curl -s -X POST \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors" \
  -H "Authorization: token $FORGEJO_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"remote_address\": \"https://github.com/$GITHUB_USER/$REPO_NAME.git\",
    \"remote_username\": \"$GITHUB_USER\",
    \"remote_password\": \"$GITHUB_TOKEN\",
    \"sync_on_commit\": true,
    \"interval\": \"1h\"
  }"
```

### 1.4 Initial push to the GitHub mirror

```bash
# Force a one-time sync to populate the GitHub mirror immediately
curl -s -X POST \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors/sync" \
  -H "Authorization: token $FORGEJO_TOKEN"
```

---

## Phase 2 — Publish a release

Releases in Forgejo are the source of truth. Mirror the release assets to GitHub
for public download visibility.

### 2.1 Create a release in Forgejo

```bash
curl -s -X POST "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/releases" \
  -H "Authorization: token $FORGEJO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tag_name": "v1.0.0",
    "name": "v1.0.0",
    "body": "Release notes here.",
    "draft": false,
    "prerelease": false
  }'
```

### 2.2 Create a matching release on GitHub

```bash
# Tag must already be mirrored to GitHub via the push mirror
gh release create v1.0.0 \
  --repo YOURORG/YOURREPO \
  --title "v1.0.0" \
  --notes "Release notes here. Canonical release: https://git.yourdomain.com/YOURORG/YOURREPO/releases/tag/v1.0.0"
```

---

## Phase 3 — Manage open contributions on GitHub

For `open-contribution` repositories, GitHub can act as an intake point for
external contributors who are not yet registered on the primary forge.

### 3.1 Set up a CONTRIBUTING.md that points to the primary forge

```markdown
# Contributing

Thank you for your interest in contributing.

**Canonical repository:** https://git.yourdomain.com/YOURORG/YOURREPO

You may open issues and pull requests here on GitHub as intake. The maintainer
team will triage and bring accepted contributions into the primary forge.

For direct contribution access, [register on the primary forge](https://git.yourdomain.com).
```

### 3.2 Triage GitHub issues and pull requests

GitHub issues opened by external contributors should be triaged regularly:

- Accepted → open a corresponding issue in Forgejo and link back.
- Declined → close with a polite explanation.
- Duplicate → link to the Forgejo issue.

---

## Phase 4 — Repository metadata consistency

Keep repository descriptions, topics, and README headers consistent across mirrors.

```bash
# Update GitHub repo description and topics
gh repo edit YOURORG/YOURREPO \
  --description "Short description — canonical at git.yourdomain.com" \
  --add-topic forgejo \
  --add-topic self-hosted \
  --add-topic open-source

# Verify
gh repo view YOURORG/YOURREPO
```

---

## Publication checklist (per repository)

- [ ] Repository exists in Forgejo as canonical source
- [ ] Push mirror configured to GitHub (and Codeberg if applicable)
- [ ] Canonical source notice in `README.md`
- [ ] `CONTRIBUTING.md` explains the primary forge
- [ ] Repository description and topics are consistent across all surfaces
- [ ] Releases are published to Forgejo first, then mirrored to GitHub
- [ ] Mirror sync confirmed after first push

---

## Open decisions

- [ ] Which projects are public showcase projects versus private internal work?
- [ ] Which public mirrors accept issues or pull requests directly?
- [ ] What approval is required before a private Forgejo repository becomes public?
