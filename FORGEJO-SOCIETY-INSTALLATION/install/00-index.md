# Forgejo Society Install Library — Master Index

This index is the single entry point for every installation, validation, and deinstallation guide in the Forgejo Society project. It exists so that an operator on production hardware can pick one document and follow it from top to bottom without consulting a second source.

Parent surface: [FORGEJO-SOCIETY-INSTALLATION/README.md](../README.md). For checklist-style navigation across the whole installation library, see [TASK-LISTS.md](../TASK-LISTS.md).

---

## How to use this index

1. Identify the host you are provisioning in [Host roles](#host-roles).
2. Open the matching install order in [Recommended install order](#recommended-install-order).
3. Work through the listed guides in sequence. Each guide names its prerequisites in its own opening section, so the order in this index is the authoritative one.
4. Use [Full guide catalogue](#full-guide-catalogue) when you need to locate a single component without following an order.

Every guide in this library is self-contained, command-level, and intended to be reproducible on a clean Ubuntu 24.04 LTS or current Windows installation.

---

## Standard structure of every guide

Every numbered guide in this directory follows the same outline. If a guide is missing one of these sections, that is a defect — raise it.

1. **Description.** What the software is and why Forgejo Society uses it.
2. **Prerequisites.** Named guides that must be completed first, linked.
3. **Installation.** The full command-level walkthrough.
4. **Validation.** Every command needed to prove the install succeeded, with expected output.
5. **Deinstallation.** The clean removal path.
6. **Continuity controls.** What to re-check on upgrade, rebuild, or drift.

---

## Host roles

The four install orders below correspond to the four physical roles in the reference deployment described in [FORGEJO-SOCIETY-THE-FEDERATION/HARDWARE.md](../../FORGEJO-SOCIETY-THE-FEDERATION/HARDWARE.md). Hardware figures are the reference build; the procedures work on any host that meets or exceeds them.

| Role | Reference hardware | Purpose |
| --- | --- | --- |
| Forge server | i9 20-core · 64 GB RAM · 2 TB NVMe | Hosts Forgejo, PostgreSQL, Caddy, and backups. One per deployment. |
| Runner fleet | 16 × i7 8-core · 8 GB RAM · 60 GB SSD | Executes Forgejo Actions workflow jobs via `act_runner`. |
| LLM inference server | i9 32-core · 64 GB RAM · 1 TB NVMe · RTX 4090 | Serves the OpenAI-compatible local API consumed by Forgejo Society agencies. |
| Developer workstation | Linux or Windows | Authors commits, runs editors, talks to the forge. |

---

## Recommended install order

Follow these in sequence. Each list satisfies prerequisites top-down so that no guide is started before its dependencies are in place.

### Forge server (i9 20-core · 64 GB RAM · 2 TB NVMe)

1. [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md)
2. [UFW Firewall](02-ufw-firewall.md)
3. [fail2ban](03-fail2ban.md)
4. [Docker Engine](04-docker-engine.md)
5. [Restic Backup](05-restic-backup.md)
6. [Prometheus Node Exporter](06-prometheus-node-exporter.md)
7. [PostgreSQL 16](07-postgresql-16.md)
8. [Caddy Web Server](08-caddy-web-server.md)
9. [Forgejo](09-forgejo.md)

### Runner fleet (16 × i7 8-core · 8 GB RAM · 60 GB SSD)

1. [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md)
2. [UFW Firewall](02-ufw-firewall.md)
3. [fail2ban](03-fail2ban.md)
4. [Docker Engine](04-docker-engine.md)
5. [Prometheus Node Exporter](06-prometheus-node-exporter.md)
6. [Forgejo Runner](10-forgejo-runner.md)

### LLM inference server (i9 32-core · 64 GB RAM · 1 TB NVMe · RTX 4090)

1. [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md)
2. [UFW Firewall](02-ufw-firewall.md)
3. [fail2ban](03-fail2ban.md)
4. [Prometheus Node Exporter](06-prometheus-node-exporter.md)
5. [NVIDIA Drivers](11-nvidia-drivers.md)
6. [LM Studio (Linux)](12-lm-studio-linux.md)

### Linux developer workstation

1. [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md)
2. [UFW Firewall](02-ufw-firewall.md)
3. [Git and Git LFS (Linux)](13-git-linux.md)
4. [Visual Studio Code (Linux)](14-vscode-linux.md)
5. [Node.js via nvm](15-nodejs-nvm.md)
6. [Go](16-go.md)
7. [Rust via rustup](17-rust.md)
8. [Python 3 and pipx](18-python3.md)
9. [Zsh and Oh My Zsh](19-zsh-ohmyzsh.md)
10. [GitKraken (Linux)](20-gitkraken-linux.md)
11. [tea CLI (Linux)](21-tea-cli-linux.md)

### Windows developer workstation

1. [Git for Windows](22-git-windows.md)
2. [Visual Studio Code (Windows)](23-vscode-windows.md)
3. [Visual Studio 2022](24-visual-studio-2022.md)
4. [WSL2](25-wsl2.md)
5. [GitKraken (Windows)](26-gitkraken-windows.md)
6. [LM Studio (Windows)](27-lm-studio-windows.md)
7. [tea CLI (Windows)](28-tea-cli-windows.md)

---

## Full guide catalogue

### Server infrastructure

| # | Guide | Description |
| --- | --- | --- |
| 01 | [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) | Foundation OS install for all hosts. Covers ISO download, USB burn, installer walkthrough, static IP, LVM with full-disk encryption, essential packages, SSH hardening, and unattended security updates. |
| 02 | [UFW Firewall](02-ufw-firewall.md) | Per-role UFW configuration. Forge host opens 22, 80, 443; runner nodes open 22 only; LLM host opens 22 and 1234 to the local subnet. |
| 03 | [fail2ban](03-fail2ban.md) | SSH brute-force protection. Configures the `sshd` jail to ban source IPs after 5 failed attempts within 10 minutes for 1 hour. |
| 04 | [Docker Engine](04-docker-engine.md) | Official Docker CE install from Docker's APT repository. Required by runner nodes for container-based CI jobs. |
| 05 | [Restic Backup](05-restic-backup.md) | Off-site incremental encrypted backup using Restic with an S3-compatible backend. Protects Forgejo data, PostgreSQL dumps, and runner configuration. |
| 06 | [Prometheus Node Exporter](06-prometheus-node-exporter.md) | System metrics exporter. Installs the node exporter on every host and restricts the metrics port to the Prometheus server IP. |

### Database

| # | Guide | Description |
| --- | --- | --- |
| 07 | [PostgreSQL 16](07-postgresql-16.md) | Production-grade relational database for Forgejo. Covers installation, `forgejo` database and role creation, performance tuning for the 64 GB forge server, and nightly `pg_dump` backup. |

### Forge stack

| # | Guide | Description |
| --- | --- | --- |
| 08 | [Caddy Web Server](08-caddy-web-server.md) | Reverse proxy with automatic TLS. Terminates HTTPS for `git.yourdomain.com` and proxies to Forgejo on port 3000. |
| 09 | [Forgejo](09-forgejo.md) | The self-hosted Git forge. Full binary install, `app.ini` configuration, `systemd` service, SSH setup, and backup automation. |
| 10 | [Forgejo Runner](10-forgejo-runner.md) | `act_runner` CI execution node. Registers with the forge and runs Docker-based workflow jobs. Deployed on all 16 runner nodes. |

### LLM infrastructure

| # | Guide | Description |
| --- | --- | --- |
| 11 | [NVIDIA Drivers](11-nvidia-drivers.md) | RTX 4090 driver installation on Ubuntu 24.04. Covers driver selection, Secure Boot considerations, the CUDA toolkit, and persistence mode. |
| 12 | [LM Studio (Linux)](12-lm-studio-linux.md) | Headless LLM inference server via the LM Studio AppImage. Serves the OpenAI-compatible API on port 1234 for use by Forgejo Society agencies. |

### Ubuntu developer tooling

| # | Guide | Description |
| --- | --- | --- |
| 13 | [Git and Git LFS (Linux)](13-git-linux.md) | Git and Large File Storage on Ubuntu. Global identity, sensible defaults, LFS initialisation, and a global `.gitignore`. |
| 14 | [Visual Studio Code (Linux)](14-vscode-linux.md) | VS Code on Ubuntu via the Microsoft APT repo. Installs the core extension set: GitLens, Remote-SSH, Python, Go, Rust, YAML, Docker, spell-check. |
| 15 | [Node.js via nvm](15-nodejs-nvm.md) | Node Version Manager for per-user Node.js management. Installs the current LTS and the `yarn` and `pnpm` package managers. |
| 16 | [Go](16-go.md) | Go toolchain from the official upstream tarball. Covers download, `PATH` setup, and a compile-and-run smoke test. |
| 17 | [Rust via rustup](17-rust.md) | Rust toolchain via `rustup`. Installs `stable`, `clippy`, `rustfmt`, and `cargo-edit`. |
| 18 | [Python 3 and pipx](18-python3.md) | Python 3 development environment. Adds `pip`, `venv`, dev headers, and `pipx` with `black`, `ruff`, and `httpie`. |
| 19 | [Zsh and Oh My Zsh](19-zsh-ohmyzsh.md) | Productive interactive shell. Changes the default shell to Zsh, installs Oh My Zsh, and configures the `git` and `docker` plugins along with SSH agent auto-start. |
| 20 | [GitKraken (Linux)](20-gitkraken-linux.md) | Visual Git client on Ubuntu. `deb` or `snap` install, SSH key configuration, Forgejo repository clone. |
| 21 | [tea CLI (Linux)](21-tea-cli-linux.md) | Command-line client for Forgejo. Binary install, login configuration, and common repo, issue, and pull-request workflows. |

### Windows developer tooling

| # | Guide | Description |
| --- | --- | --- |
| 22 | [Git for Windows](22-git-windows.md) | Git and Git LFS on Windows via WinGet. Covers global config, SSH key generation, `ssh-agent`, and Forgejo SSH connectivity. |
| 23 | [Visual Studio Code (Windows)](23-vscode-windows.md) | VS Code on Windows via WinGet. Same extension set as the Linux guide; configures Remote-SSH to the forge host. |
| 24 | [Visual Studio 2022](24-visual-studio-2022.md) | Full IDE for .NET and C++ development. Covers WinGet install, workload selection, and Git Credential Manager integration with Forgejo HTTPS auth. |
| 25 | [WSL2](25-wsl2.md) | Windows Subsystem for Linux 2 with Ubuntu 24.04. A full Linux environment inside Windows with VS Code WSL remote integration. |
| 26 | [GitKraken (Windows)](26-gitkraken-windows.md) | Visual Git client on Windows. WinGet install, SSH key setup, Forgejo clone, and GitHub integration. |
| 27 | [LM Studio (Windows)](27-lm-studio-windows.md) | LLM inference on Windows for developer workstations. Model selection guide by VRAM tier; OpenAI-compatible local API. |
| 28 | [tea CLI (Windows)](28-tea-cli-windows.md) | Forgejo CLI on Windows PowerShell. Binary install to `%USERPROFILE%\bin`, `PATH` setup, login, and common workflows. |

---

## Continuity controls

- When a new component is added to Forgejo Society, add its guide to both the [Full guide catalogue](#full-guide-catalogue) and the relevant entries in [Recommended install order](#recommended-install-order) in the same change.
- Every guide in this library is versioned alongside the main repository. A pull request that changes a component's install procedure must update the corresponding guide in the same pull request.
- Maintain a tested install path. At least once per major Ubuntu LTS cycle, walk the full forge-server install order on a fresh virtual machine to verify every guide is still accurate. Record the run date and outcome in the change that ships the verification.
- Filenames in this directory are load-bearing — every link in this index is a relative path. Renames must be done with a sweep across the whole [`FORGEJO-SOCIETY-INSTALLATION/`](../) tree.
