# Git for Windows

Git for Windows provides the Git version control system, Git LFS, and a POSIX-compatible Bash shell (Git Bash) on Windows 10/11. It is the foundation for all developer tooling on Windows in the Forgejo-Society stack — VS Code, GitKraken, Visual Studio, and the tea CLI all depend on Git being present. This guide installs Git for Windows via WinGet, configures global settings to match the Linux conventions used on the forge server, generates an SSH key pair for authenticating to the Forgejo forge, and validates end-to-end SSH connectivity.

---

## Prerequisites

- Windows 10 version 2004 or later, or Windows 11 — with an administrator account.
- [Forgejo](09-forgejo.md) — the Forgejo forge must be running to test SSH connectivity.

---

## Installation

### 1. Install Git for Windows via WinGet

Open PowerShell as an administrator:

```powershell
winget install --id Git.Git -e --source winget
```

WinGet downloads and runs the Git for Windows installer silently. When the installer runs interactively (if WinGet prompts to open the installer), use these recommended settings:

| Installer screen | Recommended choice |
|-----------------|--------------------|
| Default editor | Visual Studio Code (if installed) |
| Initial branch name | Override to `main` |
| PATH environment | Git from command line and 3rd-party software |
| SSH executable | Use bundled OpenSSH |
| HTTPS transport backend | Use the OpenSSL library |
| Line ending conversions | **Checkout as-is, commit as-is** (disables autocrlf) |
| Terminal emulator | Use Windows' default console window |
| Default behavior of git pull | Rebase |
| Git credential helper | Git Credential Manager |
| Enable file system caching | Checked |
| Enable symbolic links | Checked |

After installation, open a new PowerShell window (not as administrator) or Git Bash:

```powershell
git --version
# Expected: git version 2.x.x.windows.x
```

### 2. Configure Global Git Identity

Run the following in PowerShell or Git Bash:

```powershell
git config --global user.name "Your Full Name"
git config --global user.email "you@yourdomain.com"
```

### 3. Configure Global Git Defaults

```powershell
# Default branch name for new repositories
git config --global init.defaultBranch main

# Disable line ending conversion (match the Linux convention)
git config --global core.autocrlf false

# Rebase on pull
git config --global pull.rebase true

# Colour output
git config --global color.ui auto

# Credential helper (Git Credential Manager is installed by Git for Windows)
git config --global credential.helper manager

# Default editor — wait for VS Code to close before Git continues
git config --global core.editor "code --wait"

# Prune stale remote-tracking branches on fetch
git config --global fetch.prune true

# Push only the current branch
git config --global push.default current
```

### 4. Install and Configure Git LFS

Git LFS is bundled with Git for Windows. Initialise it for the current user:

```powershell
git lfs install
# Expected: Git LFS initialized.
```

### 5. Create the Global .gitignore

```powershell
# Create the global .gitignore file
New-Item -ItemType File -Path "$env:USERPROFILE\.gitignore_global" -Force | Out-Null

Set-Content "$env:USERPROFILE\.gitignore_global" @"
# macOS metadata
.DS_Store
._*

# Secrets and keys
.env
.env.local
.env.*.local
*.pem
*.key
*.p12
*.pfx

# Python
__pycache__/
*.py[cod]
.venv/
venv/
dist/
build/

# Node.js
node_modules/
npm-debug.log*

# Rust
target/

# IDE state
.vscode/
.idea/
*.iml

# Windows
Thumbs.db
Desktop.ini
$RECYCLE.BIN/
"@

# Register with Git
git config --global core.excludesfile "$env:USERPROFILE\.gitignore_global"
```

### 6. Generate an SSH Key Pair

```powershell
# Generate a new ED25519 SSH key
ssh-keygen -t ed25519 -C "you@yourdomain.com" -f "$env:USERPROFILE\.ssh\id_ed25519"
# Press Enter to accept the default filename
# Enter a strong passphrase when prompted (stored in Windows Credential Manager via ssh-agent)
```

### 7. Configure and Start the SSH Agent

On Windows, the built-in OpenSSH Authentication Agent service manages the SSH key:

```powershell
# Set the SSH agent to start automatically
Set-Service -Name ssh-agent -StartupType Automatic

# Start the service
Start-Service ssh-agent

# Add the SSH key to the agent
ssh-add "$env:USERPROFILE\.ssh\id_ed25519"
# Enter the passphrase when prompted — ssh-agent caches it
```

### 8. Add the SSH Public Key to Forgejo

```powershell
# Display the public key
Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub"
# Copy the output
```

In the Forgejo web UI: User Settings → SSH / GPG Keys → Add Key → paste the public key → Save.

### 9. Create an SSH Config File for the Forge Host

```powershell
# Create the .ssh directory if it doesn't exist
New-Item -ItemType Directory -Path "$env:USERPROFILE\.ssh" -Force | Out-Null

# Create or append to the SSH config
Add-Content "$env:USERPROFILE\.ssh\config" @"

Host forge
  HostName git.yourdomain.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  Port 22
  ServerAliveInterval 60
"@
```

---

## Validation

- [ ] **Git version is reported**

```powershell
git --version
# Expected: git version 2.x.x.windows.x
```

- [ ] **Git LFS version is reported**

```powershell
git lfs version
# Expected: git-lfs/3.x.x (GitHub; windows amd64; go x.x.x)
```

- [ ] **Global configuration is correct**

```powershell
git config --global --list
# Expected: user.name, user.email, init.defaultbranch=main, core.autocrlf=false,
# pull.rebase=true, credential.helper=manager
```

- [ ] **SSH agent is running**

```powershell
Get-Service ssh-agent | Select-Object Status, StartType
# Expected: Status=Running, StartType=Automatic
```

- [ ] **SSH key is loaded in the agent**

```powershell
ssh-add -l
# Expected: the fingerprint of id_ed25519 is listed
```

- [ ] **SSH connection to Forgejo succeeds**

```powershell
ssh -T forge
# Expected: Hi USERNAME! You've successfully authenticated, but Forgejo does not provide shell access.
```

- [ ] **Git clone via SSH works**

```powershell
cd $env:USERPROFILE\Documents
git clone git@git.yourdomain.com:YOURORG/YOURREPO.git
# Expected: clones successfully
```

- [ ] **Git clone via HTTPS works**

```powershell
git clone https://git.yourdomain.com/YOURORG/YOURREPO.git test-https-clone
# Expected: prompts for credentials (or uses GCM stored credentials), clones successfully
Remove-Item -Recurse -Force test-https-clone
```

---

## Deinstallation

```powershell
# Step 1: Uninstall Git for Windows
winget uninstall --id Git.Git

# Step 2: Remove the global Git configuration
Remove-Item -Force "$env:USERPROFILE\.gitconfig" -ErrorAction SilentlyContinue

# Step 3: Remove the global .gitignore
Remove-Item -Force "$env:USERPROFILE\.gitignore_global" -ErrorAction SilentlyContinue

# Step 4: Optionally remove the SSH config forge entry
# Edit %USERPROFILE%\.ssh\config and delete the forge Host block

# Step 5: Remove Forgejo credentials from Windows Credential Manager
# Control Panel → Credential Manager → Windows Credentials
# Find and remove entries like:
# git:https://git.yourdomain.com

# Step 6: Confirm Git is removed
git --version
# Expected: The term 'git' is not recognized (in a new PowerShell window)
```

---

## Continuity Controls

- **Git updates:** Git for Windows can be updated with `winget upgrade --id Git.Git`. Major version upgrades occasionally change the bundled OpenSSH version — retest SSH connectivity after upgrading.
- **GCM token rotation:** When Forgejo personal access tokens are rotated, the old token cached in Windows Credential Manager must be removed. Go to Control Panel → Credential Manager → Windows Credentials → find the Forgejo entry → Edit or Delete.
- **SSH key security:** The SSH key passphrase is cached by the Windows ssh-agent service. On shared or low-trust machines, add an auto-lock policy so the agent does not indefinitely cache the key after the user steps away.
- **line endings:** The `core.autocrlf=false` setting means Git stores files exactly as they are. Ensure all team members use the same setting to avoid line-ending noise in diffs. Enforce this at the repository level with a `.gitattributes` file.
