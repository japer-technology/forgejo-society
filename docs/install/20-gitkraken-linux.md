# GitKraken (Linux)

GitKraken is a cross-platform visual Git client that provides a graphical commit graph, interactive rebase, merge conflict resolution, pull request management, and Forgejo/GitHub/GitLab integrations in a single desktop application. In the Forgejo-Mind stack, GitKraken is the recommended visual Git client for developers who prefer a GUI for reviewing history, cherry-picking commits, and managing complex branching workflows. It connects to the Forgejo forge over SSH, using the same key pair configured in guide 13. This guide covers both the `.deb` package installation and the `snap` alternative.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be installed.
- [Git and Git LFS (Linux)](13-git-linux.md) — Git identity and SSH key must be configured.
- [Forgejo](09-forgejo.md) — Forgejo must be running to test the repository connection.

---

## Installation

### Option A: Install via .deb Package (Recommended)

The `.deb` package installs GitKraken as a system-wide application and receives updates through GitKraken's own APT mechanism.

```bash
# Download the GitKraken .deb installer
wget -O ~/Downloads/gitkraken-amd64.deb \
  "https://release.gitkraken.com/linux/gitkraken-amd64.deb"

# Install the package
sudo dpkg -i ~/Downloads/gitkraken-amd64.deb

# Fix any dependency issues (GitKraken depends on several system libraries)
sudo apt --fix-broken install -y

# Verify installation
gitkraken --version 2>/dev/null || \
  dpkg -l | grep gitkraken
# Expected: gitkraken package installed line
```

### Option B: Install via Snap

The snap version is sandboxed and updates automatically. The `--classic` flag is required because GitKraken needs unrestricted filesystem access.

```bash
sudo snap install gitkraken --classic

# Verify
snap info gitkraken | grep -E "^name|^version|^installed"
```

### Launch GitKraken

```bash
gitkraken &
# Or find GitKraken in the applications menu
```

On first launch, GitKraken prompts for sign-in. A free account supports public repositories; a paid account or the Pro plan is required for private repository features.

### Configure SSH Key

1. In GitKraken, go to **Preferences** (gear icon) → **SSH**
2. Select **Use existing SSH key pair**
3. Set the **SSH Key Path** to `~/.ssh/id_ed25519`
4. Set the **SSH Public Key Path** to `~/.ssh/id_ed25519.pub`
5. Click **Test Connection** (optional — requires a configured SSH entry in your Forgejo user settings)

If you have not yet added your SSH public key to Forgejo:

```bash
cat ~/.ssh/id_ed25519.pub
# Copy this output
```

In the Forgejo web UI: User Settings → SSH / GPG Keys → Add Key → paste the public key.

### Clone a Forgejo Repository

1. In GitKraken: **File** → **Clone Repo** → **Clone with URL**
2. Enter the SSH clone URL: `git@git.yourdomain.com:YOURORG/YOURREPO.git`
3. Choose a local directory and click **Clone the repo!**
4. GitKraken opens the repository showing the commit graph

### Configure a Second Remote (GitHub)

If developers also mirror repositories to GitHub:

1. In GitKraken with a repository open: click **Remote** in the left panel → **Add remote**
2. Set the remote name to `github`
3. Set the push URL to `git@github.com:YOURORG/YOURREPO.git`

---

## Validation

- [ ] **GitKraken is installed (deb)**

```bash
dpkg -l | grep gitkraken
# Expected: ii  gitkraken  x.x.x  amd64  ...
```

- [ ] **GitKraken is installed (snap)**

```bash
snap list | grep gitkraken
# Expected: gitkraken  x.x.x  ...  --classic
```

- [ ] **GitKraken launches without errors**

```bash
gitkraken &
# Expected: GitKraken window opens, no startup errors in the terminal
```

- [ ] **Clone a repository from Forgejo via SSH**

In GitKraken → Clone Repo → paste `git@git.yourdomain.com:YOURORG/YOURREPO.git` → Clone. The commit graph should be visible after cloning.

- [ ] **Commit graph is visible**

Open a cloned repository in GitKraken. The central panel should show a visual graph of commits, branches, and tags.

- [ ] **Push and pull work**

Make a test commit in GitKraken (edit a file in the repository, stage it, commit), then click **Push**. The commit should appear in the Forgejo web UI.

---

## Deinstallation

### Deinstallation (deb)

```bash
# Remove the GitKraken package
sudo apt remove --purge gitkraken
sudo apt autoremove -y

# Remove GitKraken user data
rm -rf ~/.gitkraken
rm -rf ~/.config/GitKraken

# Remove the downloaded .deb installer
rm -f ~/Downloads/gitkraken-amd64.deb

# Confirm removal
dpkg -l | grep gitkraken
# Expected: no output
```

### Deinstallation (snap)

```bash
# Remove the snap
sudo snap remove gitkraken

# Remove GitKraken user data
rm -rf ~/.gitkraken
rm -rf ~/.config/GitKraken

# Confirm removal
snap list | grep gitkraken
# Expected: no output
```

---

## Continuity Controls

- **SSH key rotation:** When SSH keys are rotated, update the key path in GitKraken Preferences → SSH and add the new public key to Forgejo. Remove the old key from Forgejo after confirming the new key works.
- **Updates (deb):** GitKraken updates itself via its bundled auto-updater or when you run `sudo apt upgrade` after the GitKraken repo is configured. Check **Help** → **Check for Updates** if auto-update does not trigger.
- **Large repository performance:** For repositories with long histories (>50,000 commits), GitKraken's graph rendering can be slow. Enable **Commit Graph Virtualization** in Preferences → Experimental to improve performance.
- **LFS support:** GitKraken supports Git LFS. Ensure the LFS hook is initialised in the repository (`git lfs install`) before opening it in GitKraken.
