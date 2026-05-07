# Git and Git LFS (Linux)

Git is the distributed version control system that is the foundation of the entire Forgejo-Mind workflow — every line of code, configuration file, and documentation change flows through Git. Git LFS (Large File Storage) extends Git to handle large binary files (model weights, datasets, compiled artifacts, media) by storing the file content on the Forgejo LFS server and keeping only a pointer in the Git history. Without Git LFS, large binaries bloat the Git history and slow down every clone and fetch. This guide covers installing Git and Git LFS on Ubuntu 24.04 LTS, configuring sensible global defaults, and establishing a global `.gitignore` that prevents accidental commits of secrets, build artefacts, and IDE state.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be installed and updated.

---

## Installation

### 1. Install Git and Git LFS

Both packages are available in the Ubuntu 24.04 APT repository:

```bash
sudo apt install -y git git-lfs

# Verify versions
git --version
# Expected: git version 2.x.x

git lfs version
# Expected: git-lfs/3.x.x (GitHub; linux amd64; go x.x.x)
```

### 2. Configure Global Git Identity

Git requires a name and email address to attribute commits. Set them globally so they apply to every repository on this machine:

```bash
git config --global user.name "Your Full Name"
git config --global user.email "you@yourdomain.com"
```

### 3. Configure Global Git Defaults

```bash
# Default branch name for new repositories
git config --global init.defaultBranch main

# Use the credential store (persists passwords to ~/.git-credentials in plain text)
# For a more secure approach, install a keyring-backed credential helper instead
git config --global credential.helper store

# Rebase on pull instead of creating merge commits
git config --global pull.rebase true

# Colorise git output for readability
git config --global color.ui auto

# Default editor for commit messages, rebase scripts, etc.
git config --global core.editor vim

# Show the full diff in the commit message editor
git config --global commit.verbose true

# Always use --ff-only for merges (forces explicit rebase or merge --no-ff)
git config --global merge.ff only

# Prune remote-tracking references that no longer exist on the remote
git config --global fetch.prune true

# Set the push default to the current branch only
git config --global push.default current
```

### 4. Initialise Git LFS

Run this once per user account to install the Git LFS hooks into the global Git hooks directory:

```bash
git lfs install
# Expected: Git LFS initialized.
```

### 5. Create a Global .gitignore

A global `.gitignore` prevents common junk files from being accidentally committed in any repository on this machine:

```bash
cat > ~/.gitignore_global <<'EOF'
# macOS metadata
.DS_Store
.AppleDouble
.LSOverride
._*

# Secrets and keys — NEVER commit these
.env
.env.local
.env.*.local
*.pem
*.key
*.p12
*.pfx
id_rsa
id_ed25519
*.secret

# Python
__pycache__/
*.py[cod]
*.pyo
*.pyd
.Python
*.egg-info/
dist/
build/
.venv/
venv/
env/
*.egg

# Node.js
node_modules/
npm-debug.log*
yarn-error.log*
.pnp.js
.pnp/
dist/
build/

# Go
vendor/
*.exe
*.exe~
*.test
*.out

# Rust
target/

# IDE state
.vscode/
.idea/
*.iml
*.iws
*.ipr
.project
.classpath
.settings/
*.sublime-workspace
*.sublime-project

# Logs
*.log
logs/

# OS
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
EOF

# Register the global ignore file with Git
git config --global core.excludesfile ~/.gitignore_global
```

### 6. Verify the Full Configuration

```bash
git config --global --list
```

Expected output includes all the settings configured above, for example:

```
user.name=Your Full Name
user.email=you@yourdomain.com
init.defaultbranch=main
pull.rebase=true
core.editor=vim
core.excludesfile=/home/forgeadmin/.gitignore_global
color.ui=auto
```

---

## Validation

- [ ] **Git version is installed**

```bash
git --version
# Expected: git version 2.x.x
```

- [ ] **Git LFS version is installed**

```bash
git lfs version
# Expected: git-lfs/3.x.x (GitHub; linux amd64; ...)
```

- [ ] **Global identity is configured**

```bash
git config --global user.name
# Expected: non-empty string (Your Full Name)

git config --global user.email
# Expected: non-empty email address
```

- [ ] **Default branch is set to main**

```bash
git config --global init.defaultBranch
# Expected: main
```

- [ ] **Global .gitignore is in place**

```bash
ls -la ~/.gitignore_global
# Expected: file exists

git config --global core.excludesfile
# Expected: path to ~/.gitignore_global
```

- [ ] **Git LFS hooks are installed**

```bash
cat ~/.gitconfig | grep lfs
# Expected: [filter "lfs"] section with smudge, clean, process, required entries
```

- [ ] **Full config list contains no unexpected entries**

```bash
git config --global --list | wc -l
# Expected: 10 or more lines
```

---

## Deinstallation

```bash
# Step 1: Remove the packages
sudo apt remove --purge git git-lfs
sudo apt autoremove -y

# Step 2: Optionally remove the global Git configuration
rm -f ~/.gitconfig

# Step 3: Optionally remove the global .gitignore
rm -f ~/.gitignore_global

# Step 4: Confirm removal
git --version
# Expected: command not found

git lfs version
# Expected: command not found
```

> **Note:** Removing `git` and `git-lfs` does **not** delete any repositories from disk. All `.git` directories and working tree files remain in place. You will simply be unable to run `git` commands until the package is reinstalled.

---

## Continuity Controls

- **Keep Git current:** Ubuntu 24.04's Git package receives security updates via `unattended-upgrades`. Review new Git releases periodically (https://git-scm.com/downloads) for features relevant to the Forgejo-Mind workflow.
- **Global .gitignore maintenance:** Review and extend `~/.gitignore_global` when adding new tools or languages. Common omissions: Jupyter `.ipynb_checkpoints/`, Terraform `.terraform/`, AWS credentials `~/.aws/credentials` (add to the global ignore as a tripwire comment).
- **Credential security:** The `credential.helper store` setting writes passwords in plain text to `~/.git-credentials`. On developer workstations, prefer a keyring-backed credential helper (`libsecret` on Linux, `osxkeychain` on macOS). On servers, use SSH keys exclusively and remove the credential helper setting.
- **LFS configuration:** After initialising LFS, confirm each repository that contains large files has appropriate `.gitattributes` entries (e.g., `*.bin filter=lfs diff=lfs merge=lfs -text`). Run `git lfs track "*.bin"` in each relevant repository.
