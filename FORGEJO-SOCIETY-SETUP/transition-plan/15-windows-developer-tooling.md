# Windows Developer Tooling

This guide installs the full developer tool stack on a **Windows** workstation so that
it connects to a private Forgejo forge, a private LLM inference server, and works
seamlessly with Microsoft Visual Studio and VS Code.

No GitHub dependency is required. Every step works against a self-hosted Forgejo instance.

**Prerequisites:** Forgejo is already live and reachable at `https://git.yourdomain.com` —
see [02 — Forgejo primary forge](02-forgejo-primary-forge.md).

---

## Overview: the Windows tool stack

| Tool | Role | Required |
|---|---|---|
| Git for Windows | Git CLI + OpenSSH bundled | Yes |
| Windows Terminal | Modern shell host | Recommended |
| VS Code | Lightweight editor + Git UI | Yes (or Visual Studio) |
| Visual Studio 2022 | Full IDE with built-in Git | Optional |
| GitKraken | GUI Git client | Optional |
| OpenSSH (Windows) | SSH key management | Yes |
| WinGet | Package manager | Recommended |
| Windows Subsystem for Linux 2 | Full Linux toolchain on Windows | Optional |
| LM Studio (Windows) | Local LLM inference | Required for AI-local work |
| OpenWebUI | Browser UI for local LLM | Optional |

---

## Phase 1 — Git for Windows

Git for Windows ships Git CLI, Git Bash, and the OpenSSH client in a single installer.

### 1.1 Install

```powershell
# Using WinGet (run in an elevated PowerShell or Windows Terminal)
winget install --id Git.Git -e --source winget
```

Or download the installer from https://git-scm.com/download/win and run it.
Recommended installer options:
- **Default branch name:** `main`
- **SSH executable:** Use bundled OpenSSH
- **Line endings:** Checkout as-is, commit as-is (LF) — `core.autocrlf=false`

### 1.2 Post-install configuration

Open **Git Bash** or **Windows Terminal** and run:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@yourdomain.com"
git config --global init.defaultBranch main
git config --global core.autocrlf false
git config --global pull.rebase true
git config --global color.ui auto
git config --global credential.helper wincred
git config --global core.editor "code --wait"

# Confirm
git --version
git config --global --list
```

### 1.3 Enable Git LFS

```bash
git lfs install
git lfs version
```

---

## Phase 2 — SSH keys

### 2.1 Generate a key pair

Open **Windows Terminal** (PowerShell or Git Bash):

```powershell
# PowerShell — uses the Windows built-in OpenSSH client
ssh-keygen -t ed25519 -C "you@yourdomain.com" -f "$env:USERPROFILE\.ssh\id_ed25519"
```

Or in Git Bash:

```bash
ssh-keygen -t ed25519 -C "you@yourdomain.com" -f ~/.ssh/id_ed25519
```

### 2.2 Start the SSH agent on Windows

```powershell
# Set the ssh-agent service to start automatically and start it now (run once as Admin)
Set-Service -Name ssh-agent -StartupType Automatic
Start-Service ssh-agent

# Add your key
ssh-add "$env:USERPROFILE\.ssh\id_ed25519"
```

### 2.3 Register your public key in Forgejo

```powershell
# Print the public key
Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"
```

1. Open `https://git.yourdomain.com` → **Settings** → **SSH / GPG Keys** → **Add Key**.
2. Paste the contents of `id_ed25519.pub`.
3. Save.

### 2.4 Create an SSH config file

Create (or edit) `%USERPROFILE%\.ssh\config`:

```
# Primary Forgejo instance
Host forge
    HostName git.yourdomain.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

Test:

```bash
# Git Bash or Windows Terminal
ssh -T forge
# Expected: Hi <username>! You've successfully authenticated...
```

---

## Phase 3 — Clone and push to Forgejo from Windows

### 3.1 Clone via SSH

```bash
git clone git@forge:YOURORG/YOURREPO.git
# Or using the full hostname:
git clone git@git.yourdomain.com:YOURORG/YOURREPO.git
```

### 3.2 Clone via HTTPS with a personal access token

```powershell
# Generate a token in Forgejo: Settings → Applications → Access tokens
# Scope: repository (read/write)

git clone https://YOUR_TOKEN@git.yourdomain.com/YOURORG/YOURREPO.git
```

Or store the token in the Windows Credential Manager:

```bash
# Git Bash — you will be prompted for username and password on first push
git config --global credential.helper wincred
git clone https://git.yourdomain.com/YOURORG/YOURREPO.git
# Username: your-forgejo-username
# Password: your-personal-access-token  (stored in Windows Credential Manager after first entry)
```

---

## Phase 4 — Visual Studio Code on Windows

VS Code on Windows works against Forgejo exactly as it does on Ubuntu.

### 4.1 Install

```powershell
winget install --id Microsoft.VisualStudioCode -e --source winget
```

### 4.2 Recommended extensions (same as Ubuntu)

```powershell
# Run in PowerShell or Git Bash
code --install-extension eamodio.gitlens
code --install-extension ms-vscode-remote.remote-ssh
code --install-extension ms-vscode-remote.remote-containers
code --install-extension ms-python.python
code --install-extension golang.go
code --install-extension rust-lang.rust-analyzer
code --install-extension redhat.vscode-yaml
code --install-extension ms-azuretools.vscode-docker
code --install-extension streetsidesoftware.code-spell-checker
```

**Do not install** `GitHub.vscode-pull-request-github` — it requires GitHub OAuth and
is not needed when working against Forgejo. Use the Forgejo web UI to open pull requests.

### 4.3 Clone a Forgejo repo directly from VS Code

1. Press `Ctrl+Shift+P` → **Git: Clone**.
2. Enter `https://git.yourdomain.com/YOURORG/YOURREPO.git` or `git@forge:YOURORG/YOURREPO.git`.
3. Choose a local folder. VS Code opens the repository automatically.

### 4.4 Configure VS Code to use the Forgejo remote over SSH

In VS Code, press `Ctrl+Shift+P` → **Remote-SSH: Connect to Host** → select `forge`
(as defined in `~/.ssh/config`). You can now edit files directly on the Forgejo server.

---

## Phase 5 — Microsoft Visual Studio 2022 with Forgejo

Visual Studio's built-in Git tools work against any Git remote, including Forgejo.

### 5.1 Install Visual Studio

Download the installer from https://visualstudio.microsoft.com/downloads/ or:

```powershell
winget install --id Microsoft.VisualStudio.2022.Community -e --source winget
```

During installation, select your workloads (e.g. **.NET desktop development**,
**ASP.NET and web development**, **C++ desktop development**).

### 5.2 Configure the Git credential manager

Visual Studio uses **Git Credential Manager** (GCM), which is bundled with Git for Windows.
No extra setup is needed for HTTPS tokens — GCM stores them in the Windows Credential Manager.

To confirm GCM is active:

```bash
git config --global credential.helper
# Expected: manager
```

If it shows something else, reset it:

```bash
git config --global credential.helper manager
```

### 5.3 Clone a Forgejo repository from Visual Studio

1. Open Visual Studio → **Clone a repository**.
2. In the **Repository location** field enter:
   ```
   https://git.yourdomain.com/YOURORG/YOURREPO.git
   ```
   or
   ```
   git@forge:YOURORG/YOURREPO.git
   ```
3. Choose a local path and click **Clone**.

On the first HTTPS clone, GCM will prompt for credentials. Enter:
- **Username:** your Forgejo username
- **Password:** your Forgejo personal access token

GCM stores these in Windows Credential Manager — you will not be prompted again.

### 5.4 Push, pull, and create pull requests from Visual Studio

- **Git menu** → **Push**, **Pull**, **Fetch**, **Sync** all operate against the Forgejo remote.
- **Branches** are managed in **Git → Manage Branches**.
- To open a pull request, use the Forgejo web UI at `https://git.yourdomain.com` — Visual Studio
  will show a **Create Pull Request** button only for GitHub. For Forgejo, click **Open in Browser**
  from the Git menu to navigate to the repository, then open the PR from the Forgejo UI.

### 5.5 SSH remote from Visual Studio

Visual Studio respects the system SSH configuration. If you have added `forge` to
`%USERPROFILE%\.ssh\config` and started `ssh-agent`, SSH remotes clone and push without
additional configuration.

---

## Phase 6 — GitKraken on Windows

See [05 — GitKraken tooling](05-gitkraken-tooling.md) for full details. The Forgejo
connection steps are identical on Windows.

Quick install:

```powershell
winget install --id Axosoft.GitKraken -e --source winget
```

---

## Phase 7 — LM Studio on Windows (private local LLM)

LM Studio provides a local OpenAI-compatible inference API. Use it on any Windows machine
with a capable GPU. The Forgejo-Society architecture runs LM Studio on the dedicated RTX 4090
host, but you can also run a smaller model locally on a developer workstation.

### 7.1 Install LM Studio

Download from https://lmstudio.ai (the Windows installer is a standard `.exe`).

Or use WinGet if the package is available:

```powershell
winget install --id LMStudio.LMStudio -e --source winget
```

### 7.2 Download a model

1. Open LM Studio.
2. Search the built-in model browser for a model suited to your GPU's VRAM:
   - **≥ 16 GB VRAM:** Gemma 3 27B (Q4), Llama 3.3 70B (Q4), Mistral Small 22B
   - **8–16 GB VRAM:** Gemma 3 12B, Mistral 7B (Q8), Llama 3.2 11B
   - **4–8 GB VRAM:** Gemma 3 4B, Phi-4 mini, Llama 3.2 3B
3. Click **Download**.

### 7.3 Start the local inference server

1. Open the **Local Server** tab in LM Studio.
2. Select your downloaded model.
3. Set the port to `1234`.
4. Click **Start Server**.

The local API is now live at `http://localhost:1234/v1` and is OpenAI API-compatible.

### 7.4 Test the local endpoint

```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:1234/v1/models"

Invoke-RestMethod -Uri "http://localhost:1234/v1/chat/completions" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"model":"gemma-3-12b","messages":[{"role":"user","content":"Hello, are you online?"}],"temperature":0.7}'
```

Or from Git Bash / WSL:

```bash
curl http://localhost:1234/v1/models

curl http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"gemma-3-12b","messages":[{"role":"user","content":"Hello, are you online?"}],"temperature":0.7}'
```

### 7.5 Point LM Studio at the shared forge-network LLM host

If you prefer to use the central RTX 4090 inference server instead of a local model,
simply change the endpoint URL from `http://localhost:1234/v1` to
`http://LLM_SERVER_IP:1234/v1` in any client configuration. No other change is needed.

---

## Phase 8 — Windows Subsystem for Linux 2 (optional)

WSL 2 gives you a full Ubuntu environment inside Windows. Use it when you need the
exact same toolchain as the Forgejo server or runner fleet.

### 8.1 Install WSL 2 with Ubuntu

```powershell
# Run in an elevated PowerShell
wsl --install -d Ubuntu-24.04

# After rebooting, set WSL 2 as default
wsl --set-default-version 2
```

### 8.2 Use the WSL Ubuntu environment

After installation, launch **Ubuntu 24.04** from the Start menu. Inside WSL, follow
[01 — Ubuntu foundation](01-ubuntu-foundation.md) and [14 — Developer tooling](14-developer-tooling.md)
to set up the identical Linux tool stack.

Your Windows files are accessible inside WSL at `/mnt/c/Users/YourName/`.
Your WSL home directory is accessible in Windows Explorer at `\\wsl$\Ubuntu-24.04\home\yourname\`.

### 8.3 Use VS Code with WSL

1. Install the **WSL** extension in VS Code: `code --install-extension ms-vscode-remote.remote-wsl`
2. In Windows Terminal, `cd` to a repository inside WSL and run `code .`.
3. VS Code opens with the full Linux environment; all extensions run inside WSL.

---

## Phase 9 — Forgejo CLI (`tea`) on Windows

The `tea` CLI lets you open pull requests, list issues, and manage repositories from
the command line.

```powershell
# Download the Windows binary from https://gitea.com/gitea/tea/releases
# Replace the version with the current release
$TEA_VERSION = "0.9.2"
Invoke-WebRequest `
  -Uri "https://dl.gitea.com/tea/${TEA_VERSION}/tea-${TEA_VERSION}-windows-amd64.exe" `
  -OutFile "$env:USERPROFILE\bin\tea.exe"

# Add %USERPROFILE%\bin to your PATH if not already present
[Environment]::SetEnvironmentVariable(
  "PATH", "$env:PATH;$env:USERPROFILE\bin", "User")
```

Log in and create a pull request:

```bash
tea login add \
  --name forge \
  --url https://git.yourdomain.com \
  --token YOUR_FORGEJO_TOKEN

tea pulls create \
  --repo YOURORG/YOURREPO \
  --head feature/short-description \
  --base main \
  --title "feat: short description" \
  --description "What this PR does and why."
```

---

## Guardrails

- Do not use GitHub Desktop — it is GitHub-only and adds nothing for a Forgejo workflow.
- Do not use the GitHub CLI (`gh`) for repository operations — it does not work with Forgejo.
- Do use `tea` (the Forgejo CLI) or the Forgejo web UI for pull requests and releases.
- Do not commit personal access tokens; store them in Windows Credential Manager or environment variables.
- SSH is preferred for interactive developer use; HTTPS with a token is acceptable for CI scripts.
- Rotate SSH keys and personal access tokens at least annually.

---

## Open decisions resolved

- **Dotfiles template:** Yes — distribute a `%USERPROFILE%\.gitconfig` template via the
  `dotfiles` repository in Forgejo. Windows contributors clone or copy it and adjust
  `user.name` and `user.email`. The template sets `core.autocrlf=false`,
  `pull.rebase=true`, `credential.helper=manager`, and `init.defaultBranch=main`.
- **WSL 2 status:** Recommended but not mandatory. It is the preferred environment
  for Windows contributors who run the same scripts as the Linux runner fleet.
  Git for Windows + Git Bash is the minimum requirement for contributors who do not
  need a full Linux toolchain.
- **Default model for Windows LM Studio:** Google Gemma 3 12B Q4 for machines with
  8–16 GB VRAM. Gemma 3 27B Q4 for machines with ≥ 16 GB VRAM. Use the
  central RTX 4090 inference server (`http://LLM_SERVER_IP:1234/v1`) by default
  and fall back to local inference only when the central server is unreachable.
- **SSH agent:** The Windows built-in OpenSSH agent (`ssh-agent` Windows service) is
  the mandatory standard. PuTTY/Pageant is not supported — it requires a different
  key format and complicates VS Code Remote SSH.
