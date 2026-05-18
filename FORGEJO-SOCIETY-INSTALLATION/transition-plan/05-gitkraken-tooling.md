# GitKraken Tooling

GitKraken is an optional desktop Git client for contributors who prefer a GUI
workflow. It belongs in the tooling layer, not the system-of-record layer.

---

## Role in Forgejo-Society

- Optional desktop Git client for day-to-day repository operations.
- Visual history, diff, and merge tool that works against any Git remote.
- Complements but never replaces plain Git CLI, Forgejo web UI, or VS Code Git.

---

## Boundaries

- Do not make GitKraken the canonical home of repositories or project records.
- Every workflow documented elsewhere must remain reproducible with plain `git`.
- Credentials and remotes must be rotatable without touching GitKraken.

---

## Phase 1 — Install GitKraken on Ubuntu

### 1.1 Download and install

```bash
# Download the latest .deb from https://www.gitkraken.com/download
wget -O /tmp/gitkraken.deb \
  "https://release.gitkraken.com/linux/gitkraken-amd64.deb"

sudo dpkg -i /tmp/gitkraken.deb
sudo apt --fix-broken install -y   # resolve any dependency gaps

# Launch
gitkraken
```

### 1.2 Or install via Snap

```bash
sudo snap install gitkraken --classic
```

---

## Phase 2 — Connect GitKraken to Forgejo

### 2.1 Add your SSH key

1. In GitKraken, open **Preferences** → **SSH**.
2. Select **Use existing SSH key**.
3. Point to `~/.ssh/id_ed25519` (private key) and `~/.ssh/id_ed25519.pub` (public key).
4. Click **Generate SSH key and copy to clipboard** if you do not have one yet,
   then register the public key in Forgejo (**Settings** → **SSH / GPG Keys**).

### 2.2 Clone a Forgejo repository

1. In GitKraken, click **Clone a repo**.
2. Select **Clone with URL**.
3. Enter the SSH URL from Forgejo: `git@git.yourdomain.com:YOURORG/YOURREPO.git`
4. Choose a local folder and click **Clone the repo!**

### 2.3 Add a Forgejo remote to an existing repository

In the **Remotes** panel on the left:

1. Click **+** next to **Remotes**.
2. Choose **Add remote**.
3. Enter:
   - **Name**: `forgejo`
   - **Pull URL**: `git@git.yourdomain.com:YOURORG/YOURREPO.git`
   - **Push URL**: (same)
4. Click **Add remote**.

---

## Phase 3 — Connect GitKraken to GitHub (for mirror publishing)

1. In **Preferences** → **Integrations** → **GitHub**, click **Connect to GitHub**.
2. Authenticate via OAuth or paste a personal access token.
3. GitHub will appear as a remote alongside Forgejo in your repositories.

---

## Phase 4 — Verify CLI parity

Every GitKraken action must have a plain-git equivalent. This table confirms parity:

| GitKraken action | Plain git equivalent |
| --- | --- |
| Clone repository | `git clone <url>` |
| Fetch all remotes | `git fetch --all` |
| Create branch | `git checkout -b <name>` |
| Stage and commit | `git add . && git commit -m "msg"` |
| Push to Forgejo | `git push forgejo main` |
| Pull from Forgejo | `git pull forgejo main` |
| Open pull request | Open in Forgejo web UI |
| View history | `git log --oneline --graph` |
| Resolve merge conflict | Edit file, `git add`, `git commit` |

---

## Adoption checklist

- [ ] GitKraken installed and SSH key configured
- [ ] At least one Forgejo repository cloned and confirmed working
- [ ] GitHub remote added alongside the Forgejo remote
- [ ] Confirm every workflow is reproducible with plain `git` without GitKraken
- [ ] Document whether GitKraken is supported, optional, or discouraged in this project

---

## Open decisions resolved

- **GitKraken status:** Optional for contributors who prefer a GUI workflow. It is not
  part of the standard setup and is not required for any documented workflow.
  Every action documented for GitKraken has a plain-git equivalent listed in Phase 4.
- **Paid GitKraken features:** Do not depend on paid features (GitLens for GitKraken,
  Workspaces). If a paid feature is used, document the plain-git alternative so the
  workflow remains available without a GitKraken subscription.
