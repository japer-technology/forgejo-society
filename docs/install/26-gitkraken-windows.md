# GitKraken (Windows)

GitKraken is a cross-platform visual Git client that provides a graphical commit graph, interactive rebase, merge conflict resolution, and a rich set of forge integrations. On Windows, GitKraken integrates directly with the SSH keys generated in guide 22 and connects to the Forgejo forge over SSH or HTTPS. It is the recommended visual Git client for Forgejo-Mind developers working on Windows who prefer a GUI for managing complex branching, reviewing history, and handling merge conflicts. This guide covers WinGet installation, SSH configuration, connecting to the Forgejo forge, and optionally adding GitHub as a secondary integration.

---

## Prerequisites

- [Git for Windows](22-git-windows.md) — Git must be installed, and the SSH key pair at `%USERPROFILE%\.ssh\id_ed25519` must exist.
- [Forgejo](09-forgejo.md) — the Forgejo forge must be running to test the repository connection. Your SSH public key must be registered in Forgejo User Settings → SSH Keys.

---

## Installation

### 1. Install GitKraken via WinGet

Open PowerShell (administrator not required):

```powershell
winget install --id Axosoft.GitKraken -e --source winget
```

Alternatively, download the installer from https://www.gitkraken.com/download and run it.

### 2. Launch GitKraken

Launch GitKraken from the Start menu. On first launch:

1. Sign in with a GitKraken account (free tier is sufficient for public repos; paid plan for private repos)
2. Skip the "Connect to a service" prompt for now — we configure it manually below

### 3. Configure SSH Key in GitKraken Preferences

1. In GitKraken, click the gear icon (⚙️) in the top-right → **Preferences**
2. Navigate to **SSH**
3. Select **Use existing SSH key pair**
4. Set **SSH Key Path** to `C:\Users\YourUsername\.ssh\id_ed25519`
5. Set **SSH Public Key Path** to `C:\Users\YourUsername\.ssh\id_ed25519.pub`
6. Click **Generate and copy public key to clipboard** is NOT needed here — the key was already created in guide 22

### 4. Clone a Forgejo Repository

1. In GitKraken: **File** → **Clone Repo**
2. Select **Clone with URL**
3. Enter the SSH clone URL: `git@git.yourdomain.com:YOURORG/YOURREPO.git`
4. Select a local directory and click **Clone the repo!**
5. GitKraken opens the repository commit graph

If the SSH clone fails, fall back to HTTPS for the initial test:

```
https://git.yourdomain.com/YOURORG/YOURREPO.git
```

GitKraken will prompt for credentials; enter your Forgejo username and a personal access token as the password.

### 5. Add GitHub as a Secondary Integration (Optional)

If repositories are also mirrored to GitHub:

1. GitKraken → Preferences → **Integrations** → **GitHub**
2. Click **Connect to GitHub**
3. Authenticate with your GitHub account
4. GitKraken can now show pull requests from both Forgejo and GitHub in the same interface

For adding a GitHub remote to an existing repository:

1. Open the repository in GitKraken
2. In the left panel, click **+** next to **Remote**
3. Enter the remote name `github` and the GitHub SSH URL
4. Click **Add Remote**

---

## Validation

- [ ] **GitKraken is installed**

```powershell
winget list --id Axosoft.GitKraken
# Expected: Axosoft.GitKraken  x.x.x  ...
```

- [ ] **GitKraken launches without errors**

Launch GitKraken from the Start menu. The application should open with no startup errors or authentication failures.

- [ ] **Clone a Forgejo repository via SSH**

In GitKraken → File → Clone Repo → Clone with URL → `git@git.yourdomain.com:YOURORG/YOURREPO.git`. The clone should complete and the commit graph should be visible.

- [ ] **Commit graph is visible**

Open a cloned repository. The central graph panel should show commits, branch labels, and tag markers.

- [ ] **Push a test commit to Forgejo**

1. Make a minor change to a file in the repository
2. In the **Unstaged Files** panel, stage the change
3. Enter a commit message and click **Commit changes**
4. Click **Push** in the toolbar
5. Navigate to the repository in the Forgejo web UI and confirm the commit appears

---

## Deinstallation

```powershell
# Step 1: Uninstall GitKraken via WinGet
winget uninstall --id Axosoft.GitKraken

# Step 2: Remove GitKraken application data
Remove-Item -Recurse -Force "$env:APPDATA\GitKraken" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\gitkraken" -ErrorAction SilentlyContinue

# Step 3: Remove GitKraken profile from the user directory (if present)
Remove-Item -Recurse -Force "$env:USERPROFILE\.gitkraken" -ErrorAction SilentlyContinue

# Step 4: Confirm removal
# Start menu should no longer show GitKraken
winget list --id Axosoft.GitKraken
# Expected: no results
```

---

## Continuity Controls

- **SSH key rotation:** When SSH keys are rotated, update the key path in GitKraken Preferences → SSH to point to the new key file. Add the new public key to Forgejo User Settings → SSH Keys and remove the old key.
- **Auto-updates:** GitKraken checks for updates automatically on startup. Updates are applied in the background and become active after a restart. Use Help → Check for Updates to force an immediate check.
- **Large repository performance:** For repositories with extensive history (>50,000 commits), enable **Commit Graph Virtualization** in GitKraken Preferences → Experimental Features.
- **Credential management:** If HTTPS authentication to Forgejo stops working in GitKraken, check Windows Credential Manager for a stale token entry (`git:https://git.yourdomain.com`) and delete it. GitKraken will prompt for fresh credentials on the next operation.
