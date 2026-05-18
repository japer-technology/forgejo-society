# tea CLI (Forgejo CLI, Linux)

`tea` is the official command-line client for Gitea and Forgejo. It provides a terminal interface for every major forge operation — listing and creating repositories, managing issues and pull requests, creating releases, browsing notifications, and interacting with the CI pipeline — without opening a browser. In the Forgejo-Society stack, `tea` is the primary tool for automation scripts and for operators who prefer to stay in the terminal. A single `tea login add` command authenticates the CLI against the forge using a personal access token, after which all operations work against the Forgejo-Society forge by default.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be installed.
- [Forgejo](09-forgejo.md) — the Forgejo forge must be running and accessible to authenticate the CLI.

---

## Installation

### 1. Check the Current tea Release

Visit https://gitea.com/gitea/tea/releases to find the current version. Replace `0.9.2` in the commands below with the current release number.

```bash
TEA_VERSION="0.9.2"
TEA_URL="https://dl.gitea.com/tea/${TEA_VERSION}/tea-${TEA_VERSION}-linux-amd64"
TEA_SHA_URL="${TEA_URL}.sha256"
```

### 2. Download and Install the tea Binary

```bash
# Download the binary
wget -O ~/Downloads/tea "${TEA_URL}"

# Download the checksum
wget -O ~/Downloads/tea.sha256 "${TEA_SHA_URL}"

# Verify the checksum
cd ~/Downloads
sha256sum --check tea.sha256
# Expected: tea-x.x.x-linux-amd64: OK

# Install to /usr/local/bin
sudo install -m 755 ~/Downloads/tea /usr/local/bin/tea

# Confirm
tea --version
# Expected: tea version 0.9.2 built with ...

# Clean up downloads
rm ~/Downloads/tea ~/Downloads/tea.sha256
```

### 3. Create a Forgejo Personal Access Token

Before logging in, generate a personal access token in the Forgejo web UI:

1. Log in to `https://git.yourdomain.com`
2. Click your avatar → **Settings** → **Applications**
3. Under **Manage Access Tokens**, enter a token name (e.g., `tea-cli`)
4. Select the required permissions:
   - **repository** — read/write
   - **issue** — read/write
   - **pull request** — read/write
   - **release** — read/write
5. Click **Generate Token**
6. Copy the token — it is shown only once

### 4. Log In to the Forge

```bash
tea login add \
  --name forge \
  --url https://git.yourdomain.com \
  --token YOUR_FORGEJO_TOKEN

# Expected:
# Login name: forge
# URL: https://git.yourdomain.com
# Token: (hidden)
# Successfully added forge to /home/USERNAME/.config/tea/config.yml
```

### 5. Set the forge Login as the Default

```bash
tea login set-default forge

# Verify
tea login ls
# Expected:
# NAME   URL                           SSH HOST              USER    INSECURE  DEFAULT
# forge  https://git.yourdomain.com    git.yourdomain.com    YOUR_USERNAME  false   true
```

---

## Validation

- [ ] **tea version is reported**

```bash
tea --version
# Expected: tea version 0.9.2 built with ...
```

- [ ] **Login is configured**

```bash
tea login ls
# Expected: one login named "forge" with DEFAULT=true
```

- [ ] **Repository list is returned**

```bash
tea repos ls
# Expected: a table of repositories (name, description, language, stars, forks, updated)
# If you have no repos, the table will be empty but no error is returned
```

- [ ] **Issues can be listed for a specific repository**

```bash
tea issues ls --repo YOURORG/YOURREPO
# Expected: a table of open issues, or "No issues found." if there are none
```

- [ ] **Create a test issue and close it**

```bash
# Create an issue
tea issues create \
  --repo YOURORG/YOURREPO \
  --title "test: tea CLI validation" \
  --body "This issue was created by tea CLI as part of the install validation."

# List to confirm it was created
tea issues ls --repo YOURORG/YOURREPO | head -5

# Note the issue number from the list, then close it:
tea issues close ISSUE_NUMBER --repo YOURORG/YOURREPO

# Confirm closure
tea issues ls --state closed --repo YOURORG/YOURREPO | head -3
```

- [ ] **Pull request list command works**

```bash
tea pulls ls --repo YOURORG/YOURREPO
# Expected: list of open PRs or empty table — no error
```

---

## Deinstallation

```bash
# Step 1: Delete the forge login (revokes the local token config)
tea login delete forge

# Step 2: Remove the tea binary
sudo rm -f /usr/local/bin/tea

# Step 3: Remove the tea configuration directory
rm -rf ~/.config/tea

# Step 4: Confirm removal
tea --version
# Expected: command not found

ls ~/.config/tea 2>/dev/null
# Expected: no such file or directory
```

> **Note:** Deinstalling tea does not invalidate the personal access token in Forgejo. If the token should be revoked, log in to the Forgejo web UI → Settings → Applications → find the `tea-cli` token → Delete.

---

## Continuity Controls

- **Token security:** The `tea` configuration file at `~/.config/tea/config.yml` contains the access token in plain text. Ensure this file has restricted permissions (`chmod 600 ~/.config/tea/config.yml`) and is never committed to any repository.
- **Token rotation:** Rotate personal access tokens annually or whenever a machine is decommissioned. Generate a new token in Forgejo, run `tea login delete forge`, and re-run `tea login add` with the new token.
- **tea updates:** tea does not auto-update. Check https://gitea.com/gitea/tea/releases periodically and repeat the download and install steps to upgrade.
- **Scripting with tea:** tea is suitable for scripting forge operations in shell scripts and Forgejo Actions workflows. Use `--output json` for machine-readable output that can be parsed with `jq`. Example: `tea repos ls --output json | jq '.[].full_name'`.
