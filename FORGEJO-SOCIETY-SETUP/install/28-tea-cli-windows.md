# tea CLI (Windows)

`tea` is the official command-line client for Gitea and Forgejo, providing a terminal interface for repository management, issue tracking, pull request operations, release management, and notifications. On Windows, `tea` runs natively in PowerShell and Command Prompt without requiring WSL2. In the Forgejo-Society stack, `tea` on Windows gives developers the same forge automation capabilities as on Linux — creating issues from scripts, automating release tagging, and querying repository state from PowerShell workflows. This guide covers downloading the tea binary for Windows, adding it to the user PATH, authenticating with the Forgejo forge, and validating the most common operations.

---

## Prerequisites

- [Git for Windows](22-git-windows.md) — the SSH configuration and Forgejo URL configured in guide 22 are referenced by this guide.
- [Forgejo](09-forgejo.md) — the Forgejo forge must be running and a personal access token must be available.

---

## Installation

### 1. Create the User Bin Directory

```powershell
# Create a dedicated bin directory for user-installed CLI tools
New-Item -ItemType Directory -Path "$env:USERPROFILE\bin" -Force | Out-Null

# Verify
Test-Path "$env:USERPROFILE\bin"
# Expected: True
```

### 2. Download the tea Binary

Check https://gitea.com/gitea/tea/releases for the current version. Replace `0.9.2` with the current release number.

```powershell
$TEA_VERSION = "0.9.2"
$TEA_URL = "https://dl.gitea.com/tea/$TEA_VERSION/tea-$TEA_VERSION-windows-amd64.exe"

# Download tea.exe to the bin directory
Invoke-WebRequest -Uri $TEA_URL -OutFile "$env:USERPROFILE\bin\tea.exe"

# Verify the file was downloaded
Get-Item "$env:USERPROFILE\bin\tea.exe" | Select-Object Name, Length
# Expected: tea.exe with a non-zero file size
```

### 3. Add %USERPROFILE%\bin to the User PATH

```powershell
# Add the bin directory to the current user's PATH permanently
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*$env:USERPROFILE\bin*") {
    [Environment]::SetEnvironmentVariable(
        "PATH",
        "$currentPath;$env:USERPROFILE\bin",
        "User"
    )
    Write-Host "Added $env:USERPROFILE\bin to user PATH"
} else {
    Write-Host "$env:USERPROFILE\bin is already in PATH"
}
```

Close and reopen PowerShell for the PATH change to take effect:

```powershell
# In the new terminal, verify tea is accessible
tea --version
# Expected: tea version 0.9.2 built with ...
```

### 4. Create a Forgejo Personal Access Token

If you do not already have a token from guide 21 (tea CLI Linux) or other setup:

1. Log in to `https://git.yourdomain.com`
2. Click your avatar → **Settings** → **Applications**
3. Enter a token name (e.g., `tea-cli-windows`)
4. Select permissions: **repository**, **issue**, **pull request**, **release** (all read/write)
5. Click **Generate Token**
6. Copy the token immediately — it is shown only once

### 5. Log In to the Forge

```powershell
tea login add `
  --name forge `
  --url https://git.yourdomain.com `
  --token YOUR_FORGEJO_TOKEN
```

Expected output:

```
Login name: forge
URL: https://git.yourdomain.com
Token: (hidden)
Successfully added forge
```

### 6. Set the forge Login as the Default

```powershell
tea login set-default forge

# Verify
tea login ls
# Expected:
# NAME   URL                           USER          DEFAULT
# forge  https://git.yourdomain.com    USERNAME      true
```

---

## Validation

- [ ] **tea version is reported**

```powershell
tea --version
# Expected: tea version 0.9.2 built with ...
```

- [ ] **Login is configured**

```powershell
tea login ls
# Expected: one login named "forge" with DEFAULT=true
```

- [ ] **Repository list is returned**

```powershell
tea repos ls
# Expected: a table of repositories from the Forgejo-Society forge
```

- [ ] **Issues can be listed**

```powershell
tea issues ls --repo YOURORG/YOURREPO
# Expected: table of open issues or empty result — no error
```

- [ ] **Create and close a test issue**

```powershell
# Create a test issue
tea issues create `
  --repo YOURORG/YOURREPO `
  --title "test: tea CLI Windows validation" `
  --body "Created by tea CLI on Windows during install validation."

# List issues to see the new issue number
tea issues ls --repo YOURORG/YOURREPO

# Close the test issue (replace N with the actual issue number)
tea issues close N --repo YOURORG/YOURREPO

# Confirm closure
tea issues ls --state closed --repo YOURORG/YOURREPO
```

- [ ] **Pull request list works**

```powershell
tea pulls ls --repo YOURORG/YOURREPO
# Expected: table of open PRs or empty result — no error
```

- [ ] **tea config file is present**

```powershell
# Check where tea stores its config
Test-Path "$env:APPDATA\tea\config.yml"
# Expected: True
# OR check:
Test-Path "$env:USERPROFILE\.config\tea\config.yml"
# Expected: True (location varies by tea version)
```

---

## Deinstallation

```powershell
# Step 1: Delete the forge login (removes it from the local config)
tea login delete forge

# Step 2: Remove the tea executable
Remove-Item -Force "$env:USERPROFILE\bin\tea.exe" -ErrorAction SilentlyContinue

# Step 3: Remove the tea configuration directory
Remove-Item -Recurse -Force "$env:APPDATA\tea" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.config\tea" -ErrorAction SilentlyContinue

# Step 4: Remove %USERPROFILE%\bin from PATH if it was added only for tea
# Check if any other tools use the directory first:
Get-ChildItem "$env:USERPROFILE\bin"
# If empty or only contained tea.exe, remove from PATH:
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$newPath = ($currentPath -split ";") | Where-Object { $_ -ne "$env:USERPROFILE\bin" } | Join-String -Separator ";"
[Environment]::SetEnvironmentVariable("PATH", $newPath, "User")

# Step 5: Remove the bin directory if empty
Remove-Item "$env:USERPROFILE\bin" -ErrorAction SilentlyContinue

# Step 6: Confirm removal (in a new terminal)
tea --version
# Expected: The term 'tea' is not recognized as the name of a cmdlet, function, ...
```

> **Note:** Deleting the local config does not invalidate the personal access token in Forgejo. To revoke the token, log in to the Forgejo web UI → Settings → Applications → find the `tea-cli-windows` token → Delete.

---

## Continuity Controls

- **Token security:** The tea config file (`%APPDATA%\tea\config.yml` or `%USERPROFILE%\.config\tea\config.yml`) contains the personal access token in plain text. Ensure this file is not in a directory synced to cloud storage. Set restrictive NTFS permissions: right-click → Properties → Security → restrict to your user account only.
- **Token rotation:** Rotate personal access tokens annually or when a machine is decommissioned. Delete the token in Forgejo, generate a new one, then run `tea login delete forge` and re-run `tea login add` with the new token.
- **tea updates:** tea does not auto-update on Windows. Check https://gitea.com/gitea/tea/releases periodically and repeat steps 2–3 to upgrade by downloading the new executable and overwriting the old one.
- **Scripting with tea:** In PowerShell scripts, use `tea --output json` with `ConvertFrom-Json` for machine-readable output. Example: `tea repos ls --output json | ConvertFrom-Json | Select-Object -ExpandProperty full_name`.
