# Node.js via nvm

Node.js is the JavaScript runtime required by many Forgejo-Mind toolchain components — build scripts, GitHub Actions-compatible CI steps, frontend asset pipelines, and automation utilities. Rather than installing Node.js from the Ubuntu APT repository (which ships an older version) or from a separate APT source, this guide uses `nvm` (Node Version Manager). nvm installs Node.js into the user's home directory, allows multiple Node.js versions to coexist on the same machine, and makes it trivial to switch between versions when different projects require different runtimes. This is particularly valuable on developer workstations and CI runner nodes where multiple projects with different Node.js version requirements are built.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be installed and updated.
- [Git and Git LFS (Linux)](13-git-linux.md) — nvm uses Git internally for some operations; Git must be installed.

---

## Installation

### 1. Check for the Current nvm Release

Visit https://github.com/nvm-sh/nvm/releases and note the latest version. Replace `v0.40.1` in the commands below with the current release.

### 2. Install nvm

nvm is installed by running its install script, which clones the nvm repository into `~/.nvm` and adds a source line to your shell configuration files:

```bash
# Download and run the nvm install script
curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh" | bash
```

The install script appends the following to `~/.bashrc` (and `~/.bash_profile` if it exists):

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

### 3. Reload the Shell

```bash
source ~/.bashrc

# Verify nvm is available
nvm --version
# Expected: 0.40.1 (or current version)
```

### 4. Install the Latest LTS Release

```bash
# Install the LTS (Long Term Support) version
nvm install --lts

# Switch to the LTS version
nvm use --lts

# Verify
node --version
# Expected: v22.x.x (or current LTS)
npm --version
# Expected: 10.x.x (or current)
```

### 5. Set the LTS as the Default

```bash
# Set lts/* as the default version for new shell sessions
nvm alias default lts/*

# Verify
nvm alias default
# Expected: default -> lts/* (-> v22.x.x)
```

### 6. Install Global npm Packages

These global packages are commonly needed across projects in the Forgejo-Mind stack:

```bash
# Yarn — alternative package manager, faster installs for large monorepos
npm install -g yarn

# pnpm — fast, disk-efficient package manager
npm install -g pnpm

# Verify
yarn --version
# Expected: 1.x.x

pnpm --version
# Expected: 9.x.x or 10.x.x
```

---

## Validation

- [ ] **nvm is installed and reports a version**

```bash
nvm --version
# Expected: 0.40.1 (or current)
```

- [ ] **Node.js LTS is installed**

```bash
node --version
# Expected: v22.x.x (or current LTS)
```

- [ ] **npm is installed**

```bash
npm --version
# Expected: 10.x.x (or current)
```

- [ ] **node binary is in the nvm directory (not system path)**

```bash
which node
# Expected: /home/USERNAME/.nvm/versions/node/v22.x.x/bin/node
# NOT /usr/bin/node
```

- [ ] **nvm list shows installed versions**

```bash
nvm list
# Expected:
# ->    v22.x.x
# default -> lts/* (-> v22.x.x)
# lts/* -> lts/jod (-> v22.x.x)
```

- [ ] **Node.js executes successfully**

```bash
node -e "console.log('Node.js OK, version: ' + process.version)"
# Expected: Node.js OK, version: v22.x.x
```

- [ ] **yarn is available globally**

```bash
yarn --version
# Expected: 1.x.x
```

- [ ] **pnpm is available globally**

```bash
pnpm --version
# Expected: 9.x.x or 10.x.x
```

---

## Deinstallation

```bash
# Step 1: Remove all installed Node.js versions
# List all installed versions first
nvm ls --no-alias

# Uninstall each version (replace version numbers with your actual installed versions)
nvm ls --no-alias | grep -oP 'v[\d.]+' | xargs -I{} nvm uninstall {}

# Alternatively, uninstall the default LTS
nvm uninstall --lts

# Step 2: Remove nvm itself
rm -rf ~/.nvm

# Step 3: Remove the nvm lines from shell configuration files
# Edit ~/.bashrc and remove the NVM_DIR export and source lines
vim ~/.bashrc
# Delete the three lines added by the nvm installer

# Also clean up ~/.bash_profile and ~/.profile if they exist
grep -l "NVM_DIR" ~/.bash_profile ~/.profile ~/.zshrc 2>/dev/null

# Step 4: Reload the shell
source ~/.bashrc

# Step 5: Confirm removal
nvm --version
# Expected: command not found

node --version
# Expected: command not found (unless Node.js is installed system-wide)
```

---

## Continuity Controls

- **LTS upgrade cycle:** Node.js LTS releases follow a predictable schedule: new LTS versions are released annually in October and reach End of Life approximately 3 years later. Check https://nodejs.org/en/about/previous-releases to plan LTS upgrades.
- **Per-project version pinning:** Place a `.nvmrc` file in each repository's root with the required Node.js version (e.g., `22`). Running `nvm use` in that directory will automatically switch to the specified version. This prevents version-mismatch build failures in CI.
- **nvm in CI:** On runner nodes, nvm is available within workflow job containers. Use `actions/setup-node` or install nvm directly in the workflow step for consistent version management in CI.
- **Global package proliferation:** Global npm packages (installed with `npm install -g`) accumulate over time. Run `npm list -g --depth=0` to audit globals. Prefer local `devDependencies` over global packages to keep tooling reproducible across developer machines.
