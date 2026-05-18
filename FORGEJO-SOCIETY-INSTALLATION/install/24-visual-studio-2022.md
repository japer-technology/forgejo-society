# Visual Studio 2022

Visual Studio 2022 is Microsoft's full-featured integrated development environment for Windows, providing the most complete experience for .NET, C++, ASP.NET, and desktop application development. In the Forgejo-Society stack, Visual Studio 2022 is used by developers building .NET services, C++ tooling, or Windows desktop components that integrate with the forge. It connects to the Forgejo forge over HTTPS using Git Credential Manager (GCM), which stores credentials in the Windows Credential Manager — the same mechanism used by Git for Windows. This guide covers WinGet installation, workload selection, and GCM-based authentication to Forgejo.

---

## Prerequisites

- [Git for Windows](22-git-windows.md) — Git Credential Manager is installed and configured as `credential.helper manager`. Visual Studio uses GCM for Forgejo authentication.
- Windows 10/11 with at least 8 GB RAM and 20 GB of free disk space (a typical Visual Studio install with common workloads uses 10–20 GB).

---

## Installation

### 1. Install Visual Studio 2022 Community via WinGet

The Community edition is free for individual developers and open-source projects:

```powershell
winget install --id Microsoft.VisualStudio.2022.Community -e --source winget
```

WinGet downloads the Visual Studio Installer and launches it. The installer runs interactively to allow workload selection — it cannot be silently configured with workloads via WinGet alone.

### 2. Select Workloads in the Installer

When the Visual Studio Installer opens, select the workloads relevant to the Forgejo-Society stack:

| Workload | When to select |
| --- | --- |
| **.NET desktop development** | For WPF, WinForms, and console .NET applications |
| **ASP.NET and web development** | For .NET web APIs, Blazor, and MVC applications |
| **Desktop development with C++** | For native C++ applications and CMake projects |
| **Node.js development** | For Node.js applications in VS (alternative to VS Code) |

Leave the default individual components unless you have a specific need to add or remove components.

Click **Install** and wait for the download and installation to complete. This can take 20–40 minutes depending on internet speed.

### 3. Verify Git Credential Manager is Active

Visual Studio uses GCM for Git authentication. Confirm that GCM is the configured credential helper:

```powershell
git config --global credential.helper
# Expected: manager
```

If it is not set to `manager`:

```powershell
git config --global credential.helper manager
```

### 4. Clone a Forgejo Repository from Visual Studio

1. Launch Visual Studio 2022
2. On the start screen, click **Clone a repository**
3. Enter the Forgejo HTTPS URL: `https://git.yourdomain.com/YOURORG/YOURREPO.git`
4. Choose a local path and click **Clone**
5. Visual Studio will prompt for credentials on first clone — enter your Forgejo username and a personal access token as the password
6. GCM stores the credentials in Windows Credential Manager; future operations are automatic

> **Use a personal access token, not your Forgejo password.** Generate a token at Forgejo → User Settings → Applications → Manage Access Tokens. Grant it `repository` read/write permissions.

### 5. Verify GCM Stored the Credentials

After the first successful clone:

```powershell
# Open Windows Credential Manager
Start-Process "control.exe" "/name Microsoft.CredentialManager"
# Navigate to: Windows Credentials
# Look for an entry like: git:https://git.yourdomain.com
```

---

## Validation

- [ ] **Visual Studio 2022 is installed**

Launch Visual Studio from the Start menu. The splash screen should show **Visual Studio 2022**.

- [ ] **Git menu is present**

In Visual Studio with a repository open, the menu bar should contain a **Git** menu.

- [ ] **Open a Forgejo repository in Solution Explorer**

File → Open → Folder (or File → Open → Project/Solution if a .sln file is present). The repository should open and the Solution Explorer should show the file tree.

- [ ] **Git pull / push / fetch work**

With a repository open:
- Git → Pull (downloads latest commits)
- Git → Push (uploads local commits)
- Git → Fetch (refreshes remote tracking without merging)

All three should complete without authentication errors.

- [ ] **GCM credentials are stored**

```powershell
# Check Windows Credential Manager via command line
cmdkey /list | Select-String "git.yourdomain.com"
# Expected: one or more lines referencing git:https://git.yourdomain.com
```

---

## Deinstallation

### Uninstall via the Visual Studio Installer

The recommended uninstall method uses the Visual Studio Installer:

1. Open the Start menu and search for **Visual Studio Installer**
2. Find the Visual Studio 2022 Community installation
3. Click the three-dot menu (⋮) to the right
4. Select **Uninstall**
5. Confirm the uninstallation

### Uninstall via WinGet

```powershell
winget uninstall --id Microsoft.VisualStudio.2022.Community
```

### Remove Forgejo Credentials

After uninstalling, optionally remove the stored credentials:

```powershell
# Remove via cmdkey
cmdkey /delete:"git:https://git.yourdomain.com"

# Or use the GUI:
# Control Panel → Credential Manager → Windows Credentials
# Find git:https://git.yourdomain.com → Remove
```

### Clean Up Residual Files

```powershell
# Remove Visual Studio user settings and component caches
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\Microsoft\VisualStudio" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\Microsoft\VisualStudio" -ErrorAction SilentlyContinue
```

---

## Continuity Controls

- **Visual Studio updates:** Visual Studio 2022 prompts for updates automatically. Apply updates via Help → Check for Updates or via the Visual Studio Installer. Major version updates (e.g., 17.x) may require a reboot.
- **Workload additions:** Additional workloads can be added at any time without a full reinstall. Open the Visual Studio Installer, click **Modify** next to the installation, and add workloads.
- **GCM token expiry:** If a personal access token in Forgejo expires or is revoked, Visual Studio will prompt for credentials again on the next push/pull. Delete the old entry from Windows Credential Manager and re-enter the new token.
- **Line endings in Visual Studio:** Visual Studio respects the `.editorconfig` file for line ending settings. Add a project-root `.editorconfig` with `end_of_line = lf` to prevent Windows-style CRLF line endings from being committed to the forge.
