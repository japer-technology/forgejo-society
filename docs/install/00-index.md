# Forgejo-Mind Install Library — Master Index

This index is the single entry point for every installation, validation, and deinstallation guide in the Forgejo-Mind project. Each document is fully standalone: it contains a description of the software, a prerequisites section with links to prior guides, a complete installation walkthrough, a validation section with every command needed to prove the install succeeded, a deinstallation section, and continuity controls. Real operators on production hardware can follow any guide from top to bottom without consulting a second source.

---

## Recommended Install Order

Follow this order when provisioning a host from scratch. Dependencies are satisfied in sequence so that every prerequisite guide has already been completed before the dependent guide begins.

### Forge Server (i9 20-core · 64 GB RAM · 2 TB NVMe)

1. [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md)
2. [UFW Firewall](02-ufw-firewall.md)
3. [fail2ban](03-fail2ban.md)
4. [Docker Engine](04-docker-engine.md)
5. [Restic Backup](05-restic-backup.md)
6. [Prometheus Node Exporter](06-prometheus-node-exporter.md)
7. [PostgreSQL 16](07-postgresql-16.md)
8. [Caddy Web Server](08-caddy-web-server.md)
9. [Forgejo](09-forgejo.md)

### Runner Fleet (16 × i7 8-core · 8 GB RAM · 60 GB SSD)

1. [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md)
2. [UFW Firewall](02-ufw-firewall.md)
3. [fail2ban](03-fail2ban.md)
4. [Docker Engine](04-docker-engine.md)
5. [Prometheus Node Exporter](06-prometheus-node-exporter.md)
6. [Forgejo Runner](10-forgejo-runner.md)

### LLM Inference Server (i9 32-core · 64 GB RAM · 1 TB NVMe · RTX 4090)

1. [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md)
2. [UFW Firewall](02-ufw-firewall.md)
3. [fail2ban](03-fail2ban.md)
4. [Prometheus Node Exporter](06-prometheus-node-exporter.md)
5. [NVIDIA Drivers](11-nvidia-drivers.md)
6. [LM Studio (Linux)](12-lm-studio-linux.md)

### Linux Developer Workstation

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

### Windows Developer Workstation

1. [Git for Windows](22-git-windows.md)
2. [Visual Studio Code (Windows)](23-vscode-windows.md)
3. [Visual Studio 2022](24-visual-studio-2022.md)
4. [WSL2](25-wsl2.md)
5. [GitKraken (Windows)](26-gitkraken-windows.md)
6. [LM Studio (Windows)](27-lm-studio-windows.md)
7. [tea CLI (Windows)](28-tea-cli-windows.md)

---

## Full Guide Catalogue

### Server Infrastructure

| # | Guide | Description |
|---|-------|-------------|
| 01 | [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) | Foundation OS install for all hosts. Covers ISO download, USB burn, installer walkthrough, static IP, LVM+encryption, essential packages, SSH hardening, and automatic security updates. |
| 02 | [UFW Firewall](02-ufw-firewall.md) | Per-role UFW configuration. Forge host opens 22/80/443; runner nodes open 22 only; LLM host opens 22 and 1234 to the local subnet. |
| 03 | [fail2ban](03-fail2ban.md) | SSH brute-force protection. Configures the sshd jail to ban IPs after 5 failures within 10 minutes for 1 hour. |
| 04 | [Docker Engine](04-docker-engine.md) | Official Docker CE install from Docker's APT repository. Required by runner nodes for container-based CI jobs. |
| 05 | [Restic Backup](05-restic-backup.md) | Off-site incremental encrypted backup using Restic with an S3-compatible backend. Protects Forgejo data, PostgreSQL dumps, and runner configuration. |
| 06 | [Prometheus Node Exporter](06-prometheus-node-exporter.md) | System metrics exporter. Installs the node exporter on every host and restricts the metrics port to the Prometheus server IP. |

### Database

| # | Guide | Description |
|---|-------|-------------|
| 07 | [PostgreSQL 16](07-postgresql-16.md) | Production-grade relational database for Forgejo. Covers installation, forgejo database/user creation, performance tuning for the 64 GB forge server, and nightly pg_dump backup. |

### Forge Stack

| # | Guide | Description |
|---|-------|-------------|
| 08 | [Caddy Web Server](08-caddy-web-server.md) | Reverse proxy with automatic TLS. Terminates HTTPS for git.yourdomain.com and proxies to Forgejo on port 3000. |
| 09 | [Forgejo](09-forgejo.md) | The self-hosted Git forge. Full binary install, app.ini configuration, systemd service, SSH setup, and backup automation. |
| 10 | [Forgejo Runner](10-forgejo-runner.md) | act_runner CI execution node. Registers with the forge, runs Docker-based workflow jobs. Deployed on all 16 runner nodes. |

### LLM Infrastructure

| # | Guide | Description |
|---|-------|-------------|
| 11 | [NVIDIA Drivers](11-nvidia-drivers.md) | RTX 4090 driver installation on Ubuntu 24.04. Covers driver selection, Secure Boot considerations, CUDA toolkit, and persistence mode. |
| 12 | [LM Studio (Linux)](12-lm-studio-linux.md) | Headless LLM inference server via LM Studio AppImage. Serves the OpenAI-compatible API on port 1234 for use by Forgejo-Mind agents. |

### Ubuntu Developer Tooling

| # | Guide | Description |
|---|-------|-------------|
| 13 | [Git and Git LFS (Linux)](13-git-linux.md) | Git and Large File Storage on Ubuntu. Global identity, sensible defaults, LFS initialisation, and a global .gitignore. |
| 14 | [Visual Studio Code (Linux)](14-vscode-linux.md) | VS Code on Ubuntu via the Microsoft APT repo. Installs the core extension set: GitLens, Remote-SSH, Python, Go, Rust, YAML, Docker, spell-check. |
| 15 | [Node.js via nvm](15-nodejs-nvm.md) | Node Version Manager for per-user Node.js management. Installs LTS and the yarn/pnpm package managers. |
| 16 | [Go](16-go.md) | Go toolchain from the official upstream tarball. Covers download, PATH setup, and test compilation. |
| 17 | [Rust via rustup](17-rust.md) | Rust toolchain via rustup. Installs stable, clippy, rustfmt, and cargo-edit. |
| 18 | [Python 3 and pipx](18-python3.md) | Python 3 development environment. Adds pip, venv, dev headers, and pipx with black/ruff/httpie. |
| 19 | [Zsh and Oh My Zsh](19-zsh-ohmyzsh.md) | Productive interactive shell. Changes default shell to Zsh, installs Oh My Zsh, and configures git/docker plugins and SSH agent auto-start. |
| 20 | [GitKraken (Linux)](20-gitkraken-linux.md) | Visual Git client on Ubuntu. deb or snap install, SSH key configuration, Forgejo repository clone. |
| 21 | [tea CLI (Linux)](21-tea-cli-linux.md) | Command-line client for Forgejo. Binary install, login configuration, and common repo/issue/PR workflows. |

### Windows Developer Tooling

| # | Guide | Description |
|---|-------|-------------|
| 22 | [Git for Windows](22-git-windows.md) | Git + Git LFS on Windows via WinGet. Covers global config, SSH key generation, ssh-agent, and Forgejo SSH connectivity. |
| 23 | [Visual Studio Code (Windows)](23-vscode-windows.md) | VS Code on Windows via WinGet. Same extension set as the Linux guide; configures Remote-SSH to the forge host. |
| 24 | [Visual Studio 2022](24-visual-studio-2022.md) | Full IDE for .NET/C++ development. Covers WinGet install, workload selection, GCM integration with Forgejo HTTPS auth. |
| 25 | [WSL2](25-wsl2.md) | Windows Subsystem for Linux 2 with Ubuntu 24.04. Full Linux environment inside Windows; VS Code WSL remote integration. |
| 26 | [GitKraken (Windows)](26-gitkraken-windows.md) | Visual Git client on Windows. WinGet install, SSH key setup, Forgejo clone, GitHub integration. |
| 27 | [LM Studio (Windows)](27-lm-studio-windows.md) | LLM inference on Windows for developer workstations. Model selection guide by VRAM tier; OpenAI-compatible local API. |
| 28 | [tea CLI (Windows)](28-tea-cli-windows.md) | Forgejo CLI on Windows PowerShell. Binary install to %USERPROFILE%\bin, PATH setup, login, and common workflows. |

---

## Continuity Controls

- Review this index whenever a new component is added to Forgejo-Mind and add its guide to the catalogue and the recommended install order.
- Every guide in this library is versioned alongside the main repository — pull requests that change a component's install procedure must update the corresponding guide.
- Maintain a tested install path: at least once per major Ubuntu LTS cycle, walk through the full forge-server install order on a fresh VM to verify every guide is still accurate.
