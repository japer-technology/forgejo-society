# Zsh and Oh My Zsh

Zsh (Z Shell) is a powerful interactive shell that extends Bash with better tab completion, spelling correction, history sharing across terminals, and a rich plugin ecosystem. Oh My Zsh is the most widely-used Zsh configuration framework, providing a large library of plugins and themes that dramatically improve developer productivity — tab-completing Git branch names, showing the current Git status in the prompt, and making Docker and kubectl commands more discoverable. For Forgejo-Society developers who work extensively in the terminal, Zsh + Oh My Zsh is a significant quality-of-life improvement over the default Bash shell.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be installed and updated.
- [Git and Git LFS (Linux)](13-git-linux.md) — Oh My Zsh is installed from a Git repository; Git must be present.

---

## Installation

### 1. Install Zsh

```bash
sudo apt install -y zsh

zsh --version
# Expected: zsh 5.9 (x86_64-ubuntu-linux-gnu)
```

### 2. Change the Default Shell to Zsh

```bash
# Change the current user's login shell
chsh -s $(which zsh)

# Confirm the change is registered
grep "^$USER" /etc/passwd | cut -d: -f7
# Expected: /usr/bin/zsh

# Log out and log back in for the change to take effect
# (or start a Zsh shell immediately for the rest of this guide)
exec zsh
```

### 3. Install Oh My Zsh

The unattended install flag (`--unattended`) prevents the installer from changing your shell (which we already did) or opening a new Zsh session:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" \
  "" --unattended
```

The installer:
- Clones Oh My Zsh into `~/.oh-my-zsh`
- Creates `~/.zshrc` from the default template
- Keeps your existing shell as-is (because of `--unattended`)

### 4. Configure Plugins in ~/.zshrc

Open `~/.zshrc` and set the plugins list. The default Oh My Zsh theme is `robbyrussell` — this is a good choice for readability.

```bash
# Edit ~/.zshrc to add plugins
# Find the plugins line and replace it:
sed -i 's/^plugins=(.*/plugins=(git docker kubectl zsh-autosuggestions zsh-syntax-highlighting)/' ~/.zshrc

# Verify the change
grep "^plugins=" ~/.zshrc
# Expected: plugins=(git docker kubectl zsh-autosuggestions zsh-syntax-highlighting)
```

> **Note:** `zsh-autosuggestions` and `zsh-syntax-highlighting` are third-party plugins not bundled with Oh My Zsh. Install them below.

### 5. Install Third-Party Plugins

```bash
# zsh-autosuggestions — fish-style inline command suggestions from history
git clone https://github.com/zsh-users/zsh-autosuggestions \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"

# zsh-syntax-highlighting — highlights valid commands in green, invalid in red
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git \
  "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting"
```

### 6. Configure History and Shell Options

Append these settings to `~/.zshrc`:

```bash
cat >> ~/.zshrc <<'EOF'

# History configuration
HISTSIZE=50000
SAVEHIST=50000
HISTFILE=~/.zsh_history
setopt HIST_IGNORE_DUPS       # Don't record duplicate commands
setopt HIST_IGNORE_SPACE      # Don't record commands starting with a space
setopt SHARE_HISTORY          # Share history across all terminal sessions
setopt APPEND_HISTORY         # Append to history file, don't overwrite

# SSH agent auto-start
# Starts ssh-agent once per login session and reuses it across terminals
if [ -z "$SSH_AUTH_SOCK" ]; then
  eval "$(ssh-agent -s)" > /dev/null
  ssh-add ~/.ssh/id_ed25519 2>/dev/null || true
fi
EOF
```

### 7. Apply the Configuration

```bash
source ~/.zshrc

# Confirm Oh My Zsh is loaded
omz version
# Expected: master (YYYY-MM-DD) or similar version string
```

---

## Validation

- [ ] **Zsh version is reported**

```bash
zsh --version
# Expected: zsh 5.9 (or current)
```

- [ ] **Default shell is Zsh**

After logging out and back in:

```bash
echo $SHELL
# Expected: /usr/bin/zsh
```

- [ ] **Oh My Zsh version is reported**

```bash
omz version
# Expected: a version string or "master (date)"
```

- [ ] **Plugins are loaded**

```bash
echo ${plugins[@]}
# Expected: git docker kubectl zsh-autosuggestions zsh-syntax-highlighting
```

- [ ] **Git plugin provides completions**

```bash
# Type: git che<TAB>
# Expected: Tab-completes to "git checkout" or similar
```

- [ ] **The prompt shows Git branch in a Git repository**

```bash
cd ~/some-git-repo
# Expected: the Oh My Zsh prompt shows the current branch name
```

- [ ] **History is configured correctly**

```bash
echo $HISTSIZE
# Expected: 50000
echo $SAVEHIST
# Expected: 50000
```

- [ ] **SSH agent is running**

```bash
ssh-add -l
# Expected: either a list of loaded keys or "The agent has no identities."
# (not "Could not open a connection to your authentication agent.")
```

---

## Deinstallation

```bash
# Step 1: Change the default shell back to Bash
chsh -s $(which bash)

# Step 2: Run the Oh My Zsh uninstall script
~/.oh-my-zsh/tools/uninstall.sh
# This removes ~/.oh-my-zsh and renames ~/.zshrc to ~/.zshrc.omz-uninstalled-TIMESTAMP

# Step 3: Remove remaining Zsh configuration files
rm -f ~/.zshrc
rm -f ~/.zsh_history
rm -f ~/.zshrc.omz-uninstalled-* 2>/dev/null || true

# Step 4: Remove the Zsh package
sudo apt remove --purge zsh
sudo apt autoremove -y

# Step 5: Log out and back in for the shell change to take effect

# Step 6: Confirm removal
zsh --version
# Expected: command not found
echo $SHELL
# Expected: /bin/bash
```

---

## Continuity Controls

- **Oh My Zsh updates:** Run `omz update` periodically to get the latest plugins and theme fixes. Oh My Zsh can also auto-update; check the `zstyle ':omz:update' mode` setting.
- **Plugin updates:** The third-party plugins (`zsh-autosuggestions`, `zsh-syntax-highlighting`) are Git clones and do not auto-update with `omz update`. Run `git pull` in each plugin directory quarterly.
- **History backup:** The Zsh history file at `~/.zsh_history` contains all commands typed on this machine. Include it in the Restic backup or at least in a dotfiles repository if command history is valuable for audit purposes.
- **Propagating to new accounts:** When creating new operator accounts on the forge server or runner nodes, consider a shared skeleton configuration. Copy the Zsh and Oh My Zsh setup to `/etc/skel/` after testing it on a personal account.
