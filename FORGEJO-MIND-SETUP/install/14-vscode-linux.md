# Visual Studio Code (Linux)

Visual Studio Code is the primary code editor for Forgejo-Mind developers working on Ubuntu. It provides intelligent code completion, integrated Git source control with GitLens for in-editor blame and history, Remote-SSH for editing files directly on the forge server or runner nodes without local checkouts, and a rich extension ecosystem covering every language in the stack. VS Code is installed via the official Microsoft APT repository to ensure it receives updates through the standard `apt upgrade` mechanism. This guide installs VS Code and a curated set of extensions that cover the Forgejo-Mind technology stack.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be installed and updated.
- [Git and Git LFS (Linux)](13-git-linux.md) — Git must be configured with user identity before VS Code's Git integration is useful.

---

## Installation

### 1. Add the Microsoft GPG Key

```bash
# Download and install the Microsoft GPG key
wget -qO- https://packages.microsoft.com/keys/microsoft.asc \
  | gpg --dearmor \
  | sudo tee /usr/share/keyrings/microsoft-archive-keyring.gpg > /dev/null

# Verify the key was saved
sudo gpg --no-default-keyring \
  --keyring /usr/share/keyrings/microsoft-archive-keyring.gpg \
  --fingerprint
# The fingerprint should match Microsoft's published VS Code signing key
```

### 2. Add the VS Code APT Repository

```bash
echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] \
  https://packages.microsoft.com/repos/code stable main" \
  | sudo tee /etc/apt/sources.list.d/vscode.list > /dev/null

sudo apt update
```

### 3. Install VS Code

```bash
sudo apt install -y code

# Verify the installed version
code --version
# Expected: 1.xx.x (or current stable)
# Build hash
# x64
```

### 4. Install Required Extensions

Install the curated Forgejo-Mind extension set. Run these commands from a terminal (not inside VS Code):

```bash
# GitLens — enhanced Git history, blame, and visual diff
code --install-extension eamodio.gitlens

# Remote-SSH — edit files on remote servers over SSH
code --install-extension ms-vscode-remote.remote-ssh

# Remote-Containers — develop inside Docker containers
code --install-extension ms-vscode-remote.remote-containers

# Python — IntelliSense, linting, debugging
code --install-extension ms-python.python

# Go — full Go language support
code --install-extension golang.go

# C/C++ — IntelliSense and debugging for C and C++ code
code --install-extension ms-vscode.cpptools

# Rust Analyzer — Rust language server
code --install-extension rust-lang.rust-analyzer

# YAML — schema validation, autocompletion for .yml files
code --install-extension redhat.vscode-yaml

# Docker — Dockerfile and docker-compose IntelliSense
code --install-extension ms-azuretools.vscode-docker

# Code Spell Checker — catches typos in comments and strings
code --install-extension streetsidesoftware.code-spell-checker
```

### 5. Configure Remote-SSH for the Forge Host

Add the forge host to your local SSH config so VS Code's Remote-SSH can connect with one click:

```bash
# On this machine (workstation), add to ~/.ssh/config
cat >> ~/.ssh/config <<'EOF'

Host forge
  HostName git.yourdomain.com
  User forgeadmin
  IdentityFile ~/.ssh/id_ed25519
  Port 22
  ServerAliveInterval 60
  ServerAliveCountMax 3
EOF
```

Then in VS Code: press `Ctrl+Shift+P` → type `Remote-SSH: Connect to Host` → select `forge`. VS Code installs its server component on the remote host on first connection.

### 6. Recommended User Settings

Open VS Code settings (`Ctrl+,`) and add the following to `settings.json` (`Ctrl+Shift+P` → `Open User Settings (JSON)`):

```json
{
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "editor.rulers": [80, 120],
  "editor.formatOnSave": true,
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "trailing",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "gitlens.currentLine.enabled": true,
  "gitlens.hovers.currentLine.over": "line",
  "terminal.integrated.defaultProfile.linux": "bash",
  "workbench.colorTheme": "Default Dark+",
  "remote.SSH.remotePlatform": {
    "forge": "linux"
  }
}
```

---

## Validation

- [ ] **VS Code is installed and reports a version**

```bash
code --version
# Expected: 1.xx.x followed by commit hash and architecture
```

- [ ] **All extensions are installed**

```bash
code --list-extensions
# Expected output includes:
# eamodio.gitlens
# ms-vscode-remote.remote-ssh
# ms-vscode-remote.remote-containers
# ms-python.python
# golang.go
# ms-vscode.cpptools
# rust-lang.rust-analyzer
# redhat.vscode-yaml
# ms-azuretools.vscode-docker
# streetsidesoftware.code-spell-checker
```

- [ ] **VS Code opens in a repository directory**

```bash
cd ~/some-git-repository
code .
# Expected: VS Code opens with the Source Control panel showing Git status
```

- [ ] **GitLens blame is visible**

In VS Code, open any file with commit history. Hover over a line — a blame annotation showing the author, date, and commit message should appear to the right of the cursor.

- [ ] **Remote-SSH connects to the forge host**

In VS Code: `Ctrl+Shift+P` → `Remote-SSH: Connect to Host` → `forge`. VS Code should open a new window with `SSH: forge` in the bottom-left status bar.

---

## Deinstallation

```bash
# Step 1: Remove all extensions
code --list-extensions | xargs -L 1 code --uninstall-extension

# Step 2: Remove the VS Code package
sudo apt remove --purge code
sudo apt autoremove -y

# Step 3: Remove the Microsoft GPG key and APT source
sudo rm -f /usr/share/keyrings/microsoft-archive-keyring.gpg
sudo rm -f /etc/apt/sources.list.d/vscode.list
sudo apt update

# Step 4: Remove VS Code user data and extensions directory
rm -rf ~/.vscode
rm -rf ~/.config/Code

# Step 5: Confirm removal
code --version
# Expected: command not found
```

---

## Continuity Controls

- **Auto-updates:** VS Code updates itself automatically when installed via the Microsoft APT repository and `unattended-upgrades` is active. Check `code --version` after updates to confirm the update applied.
- **Extension management:** Extensions are stored in `~/.vscode/extensions/`. When setting up a new machine, the list of installed extensions can be exported with `code --list-extensions > extensions.txt` and reinstalled in bulk with `cat extensions.txt | xargs -L 1 code --install-extension`.
- **Remote-SSH server:** VS Code installs a server binary in `~/.vscode-server/` on every remote host it connects to. After upgrading VS Code locally, the server on remote hosts will be updated automatically on the next connection. This update requires internet access on the remote host (or a pre-downloaded vsix).
- **Settings sync:** Consider enabling VS Code's built-in Settings Sync (`Ctrl+Shift+P` → `Settings Sync: Turn On`) to keep settings and extensions consistent across multiple developer workstations.
