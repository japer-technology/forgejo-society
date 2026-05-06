# Desktop Integration

Desktop development should work cleanly against Forgejo using VS Code, Git CLI,
or GitKraken. Every workflow must be reproducible with plain `git` without any
vendor-specific client.

**See [14 — Developer tooling](14-developer-tooling.md) for full tool installation instructions.**

---

## Role in Forgejo-Mind

- Keep Git CLI, Forgejo web UI, and VS Code Git all viable and documented.
- Make HTTPS and SSH both work for every contributor.
- Provide a complete onboarding path from a fresh Ubuntu workstation.

---

## Phase 1 — Fresh workstation setup checklist

- [ ] Ubuntu 24.04 LTS installed — see [01](01-ubuntu-foundation.md)
- [ ] Git installed and configured with name, email, and default branch
- [ ] SSH key pair generated and public key registered in Forgejo
- [ ] `~/.ssh/config` entry for the Forgejo host
- [ ] Git LFS installed: `git lfs install`
- [ ] VS Code installed with Remote SSH and GitLens extensions
- [ ] At least one repository cloned via SSH and one via HTTPS
- [ ] Pull request opened and merged from the workstation as an onboarding test

---

## Phase 2 — HTTPS workflow

HTTPS is the lowest-friction option for contributors who are not yet using SSH keys.

### 2.1 Clone via HTTPS

```bash
git clone https://git.yourdomain.com/YOURORG/YOURREPO.git
```

### 2.2 Authenticate with a personal access token

Forgejo supports token-based HTTPS authentication.

1. In Forgejo: **Settings** → **Applications** → **Access tokens** → **Generate token**.
2. Scope: `repository` (read and write).
3. On your workstation, use the token as your password:

```bash
# Store credentials so you are not prompted every time
git config --global credential.helper store

# On the next git push, enter:
# Username: your-forgejo-username
# Password: your-personal-access-token
git push origin main
```

Or embed the token in the URL for CI or scripted use (do not commit this):

```bash
git clone https://YOUR_TOKEN@git.yourdomain.com/YOURORG/YOURREPO.git
```

---

## Phase 3 — SSH workflow

SSH is the recommended default for maintainers and regular contributors.

### 3.1 Clone via SSH

```bash
git clone git@git.yourdomain.com:YOURORG/YOURREPO.git
# Or with the SSH config shortcut:
git clone forge:YOURORG/YOURREPO.git
```

### 3.2 Change an existing clone from HTTPS to SSH

```bash
cd YOURREPO
git remote set-url origin git@git.yourdomain.com:YOURORG/YOURREPO.git
git remote -v   # verify
```

---

## Phase 4 — Standard branch and pull request workflow

### 4.1 Create a feature branch

```bash
git checkout main
git pull origin main
git checkout -b feature/short-description
```

### 4.2 Commit and push

```bash
git add .
git commit -m "feat: short description of what changed"
git push origin feature/short-description
```

### 4.3 Open a pull request

Open the Forgejo web UI. A banner will appear offering to open a pull request for
the recently pushed branch. Click **Create pull request**.

Or use the Forgejo CLI:

```bash
# Install the Forgejo CLI (tea)
TEA_VERSION="0.9.2"   # check https://gitea.com/gitea/tea/releases
wget -O /tmp/tea \
  "https://dl.gitea.com/tea/${TEA_VERSION}/tea-${TEA_VERSION}-linux-amd64"
sudo install -m 755 /tmp/tea /usr/local/bin/tea

# Log in
tea login add \
  --name forge \
  --url https://git.yourdomain.com \
  --token YOUR_FORGEJO_TOKEN

# Open a pull request
tea pulls create \
  --repo YOURORG/YOURREPO \
  --head feature/short-description \
  --base main \
  --title "feat: short description" \
  --description "What this PR does and why."
```

### 4.4 Review and merge

1. Reviewer opens the PR in the Forgejo web UI.
2. Reviews inline diffs, posts comments, requests changes, or approves.
3. Author addresses review comments and pushes follow-up commits.
4. Once approved, click **Merge pull request**.

---

## Phase 5 — VS Code integration

### 5.1 Remote SSH into the forge server

1. In VS Code, press `Ctrl+Shift+P` → **Remote-SSH: Connect to Host**.
2. Select `forge` (from your `~/.ssh/config`).
3. Open a terminal in VS Code and work directly on the server.

### 5.2 Git operations in VS Code

- The **Source Control** panel (Ctrl+Shift+G) shows staged, unstaged, and untracked files.
- Use **GitLens** for commit history, blame annotations, and branch comparison.
- VS Code will detect the Forgejo remote URL automatically from the cloned repository.

### 5.3 Open a pull request from VS Code

With GitLens installed:

1. Open the **Source Control** panel.
2. Click **Open on Remote** or use GitLens → **Open Pull Request**.
3. This opens the Forgejo PR creation page in your browser.

---

## Guardrails

- Do not create workflows that require a GitHub-only tool (GitHub Desktop, GitHub CLI `gh`).
- Do not document steps that only work through a GUI without a CLI alternative.
- Keep remote URLs in HTTPS and SSH forms — never use proprietary URL schemes.
- Rotate SSH keys and personal access tokens at least annually; document the rotation procedure.

---

## Open decisions resolved

- **SSH vs HTTPS:** SSH is the mandatory default for all maintainers and regular
  contributors with write access. HTTPS with a personal access token is acceptable
  for read-only clones and CI scripts where SSH key management is impractical.
- **Credential helper:** Use `store` for scripts and headless environments. Use the
  system keyring helper (`libsecret-1-0` + `git-credential-libsecret`) on Ubuntu
  desktop workstations for better security — it encrypts stored credentials in the
  GNOME keyring rather than storing them in plaintext.
- **`tea` CLI:** Yes — include `tea` in the standard workstation setup. It allows
  opening pull requests, listing issues, and managing repositories from the terminal
  without switching to a browser. Document it in the onboarding guide.
