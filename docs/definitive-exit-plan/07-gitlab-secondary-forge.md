# GitLab as a Secondary Forge

GitLab.com is the strongest full-featured hosted secondary forge in this plan.
It provides a richer CI/CD ecosystem and broader ecosystem integrations as a backup.

---

## Role in the exit plan

- Secondary forge for redundancy and wider ecosystem compatibility.
- Additional public mirror for repositories that benefit from GitLab's discovery and CI features.
- Stays subordinate to Forgejo as the system of record.

---

## Phase 1 — Create the GitLab account and group

1. Go to <https://gitlab.com> and sign in or create an account.
2. Create a **Group** that matches your organization name.
3. Generate a personal access token:
   - **Profile** → **Preferences** → **Access Tokens**.
   - Scopes: `api`, `read_repository`, `write_repository`.
4. Store the token in your vault.

---

## Phase 2 — Configure push mirroring from Forgejo

Forgejo's push mirror feature forwards every commit to GitLab automatically.

```bash
FORGEJO_URL="https://git.yourdomain.com"
FORGEJO_TOKEN="your-forgejo-api-token"
REPO_OWNER="your-forgejo-org"
REPO_NAME="your-repo"
GL_USER="your-gitlab-username"
GL_TOKEN="your-gitlab-pat"
GL_NAMESPACE="your-gitlab-group"

# First create the GitLab project if it does not exist
curl -s -X POST "https://gitlab.com/api/v4/projects" \
  -H "PRIVATE-TOKEN: $GL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"namespace_id\": $(curl -s "https://gitlab.com/api/v4/groups/$GL_NAMESPACE" \
      -H "PRIVATE-TOKEN: $GL_TOKEN" | jq '.id'),
    \"visibility\": \"public\"
  }"

# Register the push mirror in Forgejo
curl -s -X POST \
  "$FORGEJO_URL/api/v1/repos/$REPO_OWNER/$REPO_NAME/push_mirrors" \
  -H "Authorization: token $FORGEJO_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"remote_address\": \"https://gitlab.com/$GL_NAMESPACE/$REPO_NAME.git\",
    \"remote_username\": \"$GL_USER\",
    \"remote_password\": \"$GL_TOKEN\",
    \"sync_on_commit\": true,
    \"interval\": \"8h\"
  }"
```

---

## Phase 3 — Use GitLab CI as a secondary pipeline (optional)

If you want to run a GitLab CI pipeline on mirrored repositories, add a minimal
`.gitlab-ci.yml` to the repository root:

```yaml
# .gitlab-ci.yml
# This pipeline runs on GitLab's shared runners as a secondary validation.
# The canonical CI runs on Forgejo Actions.

stages:
  - validate

lint:
  stage: validate
  image: ubuntu:24.04
  script:
    - echo "Secondary GitLab validation pipeline"
    - echo "Canonical CI is at https://git.yourdomain.com"
  rules:
    - when: always
```

---

## Phase 4 — Add a canonical source notice

In the `README.md` of every GitLab mirror:

```markdown
> **Mirror notice:** This repository is a public mirror hosted on GitLab.
> The canonical source is at `https://git.yourdomain.com/YOURORG/YOURREPO`.
> Issues and pull requests are tracked on the primary forge.
```

---

## Phase 5 — Prevent GitLab from becoming a shadow system of record

Review these rules periodically:

- [ ] No team member treats GitLab as the authoritative issue tracker.
- [ ] No release is published from GitLab that is not also published from Forgejo.
- [ ] No secret or credential exists only in GitLab CI variables.
- [ ] All GitLab pipelines are secondary validations, not the primary build gate.

---

## Continuity controls

- Check GitLab mirror sync status weekly.
- Keep the GitLab access token expiry date in the team calendar so it is renewed before it expires.
- Test public clone from GitLab monthly:

```bash
git clone https://gitlab.com/YOURGROUP/YOURREPO.git /tmp/gitlab-test-clone
```

---

## Open decisions

- [ ] Is GitLab a temporary bridge, a permanent mirror, or a full standby forge?
- [ ] Should GitLab CI run on mirrored repositories to provide a second CI opinion?
- [ ] Are there specific GitLab features (Container Registry, Package Registry) worth using?
