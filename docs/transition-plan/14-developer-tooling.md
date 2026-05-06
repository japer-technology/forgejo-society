# Developer Tooling

This guide sets up the full developer tool stack on an Ubuntu 24.04 LTS workstation
or the primary server. It covers Git, SSH key management, shell configuration,
VS Code, GitKraken, language runtimes, and LM Studio on the RTX 4090 host.

**Complete [01 — Ubuntu foundation](01-ubuntu-foundation.md) before starting this guide.**

---

## Phase 1 — Git configuration

### 1.1 Install and configure Git

```bash
sudo apt install -y git git-lfs

# Set your identity (run as your user, not sudo)
git config --global user.name "Your Name"
git config --global user.email "you@yourdomain.com"

# Use main as the default branch name
git config --global init.defaultBranch main

# Use a credential helper so you are not prompted on every HTTPS push
git config --global credential.helper store

# Rebase by default when pulling
git config --global pull.rebase true

# Enable coloured output
git config --global color.ui auto

# Set a default editor
git config --global core.editor "vim"

# Show the full config
git config --global --list
```

### 1.2 Enable Git LFS

```bash
git lfs install
# Confirm
git lfs version
```

### 1.3 Set up a global .gitignore

```bash
tee ~/.gitignore_global > /dev/null <<'EOF'
# OS files
.DS_Store
Thumbs.db
*.swp
*~

# Editor directories
.vscode/
.idea/
*.sublime-project
*.sublime-workspace

# Environment and secrets
.env
.env.local
*.pem
*.key
id_rsa
id_ed25519

# Build artefacts
__pycache__/
*.pyc
node_modules/
dist/
build/
EOF

git config --global core.excludesfile ~/.gitignore_global
```

---

## Phase 2 — SSH key management

### 2.1 Generate a key pair

```bash
# Ed25519 is the recommended algorithm
ssh-keygen -t ed25519 -C "you@yourdomain.com" -f ~/.ssh/id_ed25519

# Start the SSH agent and add the key
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Print the public key to copy into Forgejo / GitHub
cat ~/.ssh/id_ed25519.pub
```

### 2.2 Register your public key in Forgejo

1. Open `https://git.yourdomain.com` → **Settings** → **SSH / GPG Keys**.
2. Click **Add Key**.
3. Paste the contents of `~/.ssh/id_ed25519.pub`.
4. Save.

### 2.3 Configure SSH shortcuts

```bash
tee -a ~/.ssh/config > /dev/null <<'EOF'

# Primary Forgejo instance
Host forge
    HostName git.yourdomain.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes

# GitHub (outbound mirror publishing)
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config
```

Test:

```bash
ssh -T forge        # Expected: Hi <username>! You've successfully authenticated…
ssh -T github.com   # Expected: Hi <username>! You've successfully authenticated…
```

### 2.4 Use a persistent SSH agent on Ubuntu desktop

Add this to `~/.bashrc` or `~/.zshrc`:

```bash
# Auto-start SSH agent and add key if not already loaded
if [ -z "$SSH_AUTH_SOCK" ]; then
  eval "$(ssh-agent -s)" > /dev/null
  ssh-add ~/.ssh/id_ed25519 2>/dev/null
fi
```

---

## Phase 3 — Shell and terminal tools

### 3.1 Install zsh and Oh My Zsh

```bash
sudo apt install -y zsh
chsh -s $(which zsh)

# Install Oh My Zsh (unattended)
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
```

### 3.2 Install useful terminal tools

```bash
sudo apt install -y \
  tmux \
  fzf \
  ripgrep \
  bat \
  fd-find \
  exa \
  tree \
  jq \
  yq \
  httpie \
  moreutils \
  colordiff \
  ncdu \
  duf
```

### 3.3 Useful tmux configuration

```bash
tee ~/.tmux.conf > /dev/null <<'EOF'
# Use Ctrl+a as prefix
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Split panes with | and -
bind | split-window -h
bind - split-window -v

# Enable mouse
set -g mouse on

# Start window numbering at 1
set -g base-index 1

# Status bar
set -g status-bg black
set -g status-fg white
set -g status-right '%Y-%m-%d %H:%M'
EOF
```

---

## Phase 4 — Visual Studio Code

### 4.1 Install VS Code

```bash
# Add the Microsoft repository
wget -qO- https://packages.microsoft.com/keys/microsoft.asc \
  | gpg --dearmor \
  | sudo tee /usr/share/keyrings/microsoft-archive-keyring.gpg > /dev/null

echo "deb [arch=amd64,arm64,armhf \
  signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] \
  https://packages.microsoft.com/repos/code stable main" \
  | sudo tee /etc/apt/sources.list.d/vscode.list

sudo apt update && sudo apt install -y code

# Launch
code --version
```

### 4.2 Recommended extensions

Install via the CLI:

```bash
# Git and forge integration
code --install-extension eamodio.gitlens
code --install-extension GitHub.vscode-pull-request-github

# Remote development
code --install-extension ms-vscode-remote.remote-ssh
code --install-extension ms-vscode-remote.remote-containers

# Language support
code --install-extension ms-python.python
code --install-extension golang.go
code --install-extension ms-vscode.cpptools
code --install-extension rust-lang.rust-analyzer

# Utilities
code --install-extension redhat.vscode-yaml
code --install-extension ms-azuretools.vscode-docker
code --install-extension streetsidesoftware.code-spell-checker
```

### 4.3 Configure VS Code to use the Forgejo remote

In VS Code, open the Command Palette (`Ctrl+Shift+P`) → **Git: Clone** → enter:

```
https://git.yourdomain.com/YOURORG/YOURREPO.git
```

Or from the terminal:

```bash
git clone git@forge:YOURORG/YOURREPO.git
cd YOURREPO
code .
```

---

## Phase 5 — Language runtimes

### 5.1 Python

```bash
sudo apt install -y python3 python3-pip python3-venv python3-dev

# Confirm
python3 --version
pip3 --version

# Install pipx for globally isolated tools
pip3 install --user pipx
pipx ensurepath
```

### 5.2 Node.js (via nvm)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install and use the latest LTS
nvm install --lts
nvm use --lts

# Confirm
node --version
npm --version
```

### 5.3 Go

```bash
GO_VERSION="1.23.4"   # check https://go.dev/dl/ for latest

wget -O /tmp/go.tar.gz "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz"
sudo tar -C /usr/local -xzf /tmp/go.tar.gz

# Add to PATH
echo 'export PATH="$PATH:/usr/local/go/bin:$HOME/go/bin"' >> ~/.profile
source ~/.profile

go version
```

### 5.4 Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
rustc --version
cargo --version
```

---

## Phase 6 — GitKraken

See [05 — GitKraken tooling](05-gitkraken-tooling.md) for install and Forgejo connection.

---

## Phase 7 — LM Studio on the RTX 4090 host

LM Studio provides a local OpenAI-compatible API endpoint. Run it on the dedicated
LLM inference machine (i9 32-core, 64 GB, RTX 4090).

### 7.1 Install LM Studio

```bash
# Download the AppImage from https://lmstudio.ai (Linux build)
# Replace the version number with the current release
wget -O ~/lmstudio.AppImage \
  "https://releases.lmstudio.ai/linux/x86/0.3.6/latest/LM-Studio-0.3.6-x86_64.AppImage"

chmod +x ~/lmstudio.AppImage

# Install FUSE if needed for AppImage support
sudo apt install -y libfuse2

~/lmstudio.AppImage
```

### 7.2 Start the local inference server

1. Open LM Studio.
2. Load a model (e.g. Google Gemma 3 27B — fits in the RTX 4090 at Q4).
3. Go to **Local Server** tab.
4. Set the port to `1234` (default).
5. Click **Start Server**.

The server is now reachable at `http://LLM_SERVER_IP:1234/v1` and is compatible
with the OpenAI API.

### 7.3 Open the inference port to the local network

On the LLM host:

```bash
# Allow the forge server and runner nodes to reach the LM Studio API
sudo ufw allow from 192.168.0.0/24 to any port 1234 proto tcp
```

### 7.4 Test the endpoint

```bash
curl http://LLM_SERVER_IP:1234/v1/models

curl http://LLM_SERVER_IP:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma-3-27b",
    "messages": [{"role": "user", "content": "Hello, are you online?"}],
    "temperature": 0.7
  }'
```

### 7.5 NVIDIA driver setup (if not already installed)

```bash
# Check current driver
nvidia-smi

# If no driver installed, install the recommended one
sudo ubuntu-drivers install

# Or install a specific version
sudo apt install -y nvidia-driver-565

# Reboot and verify
sudo reboot
nvidia-smi
```

---

## Phase 8 — Docker Desktop (optional, workstations only)

For workstations that need a GUI Docker experience:

```bash
# Docker Desktop for Linux — download from https://docs.docker.com/desktop/install/ubuntu/
# The CLI tools installed in 01-ubuntu-foundation.md are sufficient for headless servers.
```

---

## Continuity controls

- Pin nvm and Go versions in team documentation so all workstations stay in sync.
- Keep VS Code settings synchronized via **Settings Sync** pointing at the Forgejo instance.
- Keep a `SETUP.md` in each repository listing the language runtime and tool versions required.
- Update this guide whenever a runtime reaches end of life.

---

## Open decisions

- [ ] Is a dotfiles repository maintained in Forgejo for standard shell and editor config?
- [ ] Which model is the default for background cognition on the LLM host?
- [ ] Is there a headless LM Studio server mode or alternative (Ollama, llama.cpp) preferred?
