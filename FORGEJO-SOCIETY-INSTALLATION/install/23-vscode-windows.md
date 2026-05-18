# Visual Studio Code (Windows)

Visual Studio Code on Windows provides the same rich editing, debugging, and extension experience as the Linux version, with the additional benefit of the Remote-SSH extension allowing Windows developers to edit code that runs on the forge server or runner nodes directly — as if the remote files were local. In the Forgejo-Society stack, VS Code on Windows is the primary editor for developers working from Windows workstations. The configuration in this guide mirrors the Linux guide to ensure a consistent experience across operating systems. Note that the GitHub Pull Request and Issues extension (`GitHub.vscode-pull-request-github`) is intentionally excluded — all pull request work happens through the Forgejo forge, not GitHub.

---

## Prerequisites

- [Git for Windows](22-git-windows.md) — Git must be installed and configured with user identity before VS Code's Git integration is functional.

---

## Installation

### 1. Install VS Code via WinGet

Open PowerShell (as a regular user — administrator is not required):

```powershell
winget install --id Microsoft.VisualStudioCode -e --source winget
```

After installation completes, open a new PowerShell window:

```powershell
code --version
# Expected: 1.xx.x followed by commit hash and "x64"
```

### 2. Install Extensions

Run the following in PowerShell to install the full Forgejo-Society extension set:

```powershell
# GitLens — enhanced Git history, blame, and diff visualisation
code --install-extension eamodio.gitlens

# Remote-SSH — edit remote files over SSH
code --install-extension ms-vscode-remote.remote-ssh

# Remote-Containers — develop inside Docker containers
code --install-extension ms-vscode-remote.remote-containers

# Python — IntelliSense, linting, and debugging
code --install-extension ms-python.python

# Go — full Go language support
code --install-extension golang.go

# Rust Analyzer — Rust language server
code --install-extension rust-lang.rust-analyzer

# YAML — schema validation and autocompletion for .yml files
code --install-extension redhat.vscode-yaml

# Docker — Dockerfile and compose file support
code --install-extension ms-azuretools.vscode-docker

# Code Spell Checker — catches typos in code, comments, and strings
code --install-extension streetsidesoftware.code-spell-checker
```

> **Do NOT install** `GitHub.vscode-pull-request-github` — this extension routes pull request workflows to GitHub. All PRs in Forgejo-Society go through the Forgejo forge.

### 3. Configure Remote-SSH for the Forge Host

The SSH config created in guide 22 (`%USERPROFILE%\.ssh\config`) already contains the `forge` host entry. VS Code's Remote-SSH extension reads this file automatically.

To connect:

1. Press `Ctrl+Shift+P`
2. Type **Remote-SSH: Connect to Host**
3. Select **forge** from the dropdown
4. VS Code opens a new window and installs its server component on the forge host (requires internet access on the forge host on first connection)
5. After connection, the bottom-left status bar shows **SSH: forge**

### 4. Recommended User Settings

Open VS Code settings with `Ctrl+Shift+P` → **Open User Settings (JSON)** and add:

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
  "files.eol": "\n",
  "git.autofetch": true,
  "git.confirmSync": false,
  "gitlens.currentLine.enabled": true,
  "gitlens.hovers.currentLine.over": "line",
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "workbench.colorTheme": "Default Dark+",
  "remote.SSH.remotePlatform": {
    "forge": "linux"
  }
}
```

The `files.eol: "\n"` setting ensures that files created in VS Code on Windows use Unix line endings, matching the forge server and Git LFS configuration.

---

## Validation

- [ ] **VS Code version is reported**

```powershell
code --version
# Expected: 1.xx.x followed by commit hash and "x64"
```

- [ ] **All extensions are installed**

```powershell
code --list-extensions
# Expected output includes:
# eamodio.gitlens
# ms-vscode-remote.remote-ssh
# ms-vscode-remote.remote-containers
# ms-python.python
# golang.go
# rust-lang.rust-analyzer
# redhat.vscode-yaml
# ms-azuretools.vscode-docker
# streetsidesoftware.code-spell-checker
```

- [ ] **Unwanted extension is NOT installed**

```powershell
code --list-extensions | Select-String "github.vscode-pull-request"
# Expected: no output (this extension must not be installed)
```

- [ ] **VS Code opens a Forgejo repository**

```powershell
cd "$env:USERPROFILE\Documents\YOURREPO"
code .
# Expected: VS Code opens, Source Control panel shows Git status
```

- [ ] **GitLens blame is visible**

Open any file with commit history in VS Code. Hover over a line — the blame annotation should appear to the right of the cursor.

- [ ] **Remote-SSH connects to the forge host**

`Ctrl+Shift+P` → **Remote-SSH: Connect to Host** → **forge**. VS Code should open a new window with `SSH: forge` in the bottom-left status bar.

---

## Deinstallation

```powershell
# Step 1: Uninstall all extensions
code --list-extensions | ForEach-Object { code --uninstall-extension $_ }

# Step 2: Uninstall VS Code
winget uninstall --id Microsoft.VisualStudioCode

# Step 3: Remove user settings and extension data
Remove-Item -Recurse -Force "$env:APPDATA\Code" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.vscode" -ErrorAction SilentlyContinue

# Step 4: Confirm removal
code --version
# Expected: The term 'code' is not recognized (in a new terminal)
```

---

## Continuity Controls

- **Auto-updates:** VS Code on Windows checks for updates automatically and applies them in the background. The installed version can be checked in Help → About. Updates usually apply on the next restart.
- **Extension sync:** Enable VS Code Settings Sync (`Ctrl+Shift+P` → **Settings Sync: Turn On`) to synchronise settings and extensions across multiple developer machines. Authenticate with a Microsoft or GitHub account.
- **Remote-SSH server updates:** When VS Code is updated locally, it automatically updates its server binary on all remote hosts it connects to. This requires the remote hosts to be online and reachable. If a remote host is air-gapped, download the VS Code server vsix manually.
- **WSL integration:** If WSL2 is installed (see [WSL2](25-wsl2.md)), install the `ms-vscode-remote.remote-wsl` extension and use `code .` from inside a WSL terminal to open files in the WSL filesystem with full Linux tooling.
