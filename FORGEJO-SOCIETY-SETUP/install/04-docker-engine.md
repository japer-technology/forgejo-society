# Docker Engine

Docker Engine is the container runtime that powers the Forgejo-Society CI/CD pipeline. Each of the 16 runner nodes uses Docker to execute workflow jobs in isolated containers — a job requesting `runs-on: docker` spins up a fresh container, runs the workflow steps, and destroys the container on completion. This hard isolation means a failing or compromised job cannot affect the host OS or other jobs. Docker is also available on the forge server for running auxiliary containers (e.g., a local registry or monitoring stack). This guide installs the official Docker CE release from Docker's own APT repository rather than the older version shipped in Ubuntu's default repositories.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be fully configured with essential packages, static IP, SSH hardening, and the forgejo service account before Docker is installed.

---

## Installation

### 1. Remove Any Conflicting Packages

Ubuntu 24.04 ships stub packages for `docker.io`, `docker-compose`, and `podman-docker`. These conflict with the official Docker CE packages and must be removed first.

```bash
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  sudo apt remove --purge "$pkg" 2>/dev/null || true
done
```

### 2. Add Docker's Official GPG Key

Docker's APT packages are signed. Add the signing key to the system keyring so APT can verify package integrity.

```bash
# Install prerequisites
sudo apt install -y ca-certificates curl gnupg

# Create the keyring directory
sudo install -m 0755 -d /usr/share/keyrings

# Download and dearmor the GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Verify the key fingerprint
sudo gpg --no-default-keyring \
  --keyring /usr/share/keyrings/docker-archive-keyring.gpg \
  --fingerprint
# Expected fingerprint:
# 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
```

### 3. Add the Docker APT Repository

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update the package index to include Docker's repository
sudo apt update
```

### 4. Install Docker CE

```bash
sudo apt install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
```

**Package roles:**

| Package | Purpose |
| --- | --- |
| `docker-ce` | The Docker daemon (dockerd) |
| `docker-ce-cli` | The `docker` CLI client |
| `containerd.io` | Low-level container runtime |
| `docker-buildx-plugin` | BuildKit-based multi-platform image builds |
| `docker-compose-plugin` | `docker compose` subcommand |

### 5. Enable and Start the Docker Service

```bash
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker
```

### 6. Add the Admin User to the Docker Group

By adding the operator account to the `docker` group, you can run `docker` commands without `sudo`. This is safe on a dedicated host where the admin user is trusted.

```bash
sudo usermod -aG docker forgeadmin

# The change takes effect in the next login session
# To activate without logging out, run:
newgrp docker
```

### 7. Add the forgejo-runner System User to the Docker Group (Runner Nodes Only)

On runner nodes, the `forgejo-runner` service account needs Docker access to pull and run job containers. The `forgejo-runner` user is created in [Forgejo Runner](10-forgejo-runner.md), but the Docker group membership can be set up now if the user already exists, or it can be done after guide 10.

```bash
# Only on runner nodes — skip on forge server and LLM host
sudo usermod -aG docker forgejo-runner
```

### 8. Test with Hello World

```bash
docker run --rm hello-world
```

Expected output ends with:
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

### 9. Configure the Docker Daemon for Production Use

Create a daemon configuration file with sensible production defaults:

```bash
sudo tee /etc/docker/daemon.json > /dev/null <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true
}
EOF
```

**Option explanations:**

| Option | Value | Reason |
| --- | --- | --- |
| `log-driver` | `json-file` | Default JSON log driver with rotation |
| `max-size` | `10m` | Rotate container logs at 10 MB |
| `max-file` | `3` | Keep 3 rotated log files per container |
| `storage-driver` | `overlay2` | Recommended storage driver on Ubuntu |
| `live-restore` | `true` | Keep containers running if the daemon restarts |

Reload the daemon after changing its configuration:

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

---

## Validation

Run every check below to confirm Docker is correctly installed and operational.

- [ ] **Docker CLI version is reported**

```bash
docker --version
# Expected: Docker version 27.x.x, build xxxxxxx (or current stable)
```

- [ ] **Docker Compose plugin is available**

```bash
docker compose version
# Expected: Docker Compose version v2.x.x
```

- [ ] **Docker daemon is running**

```bash
sudo systemctl status docker
# Expected: active (running)
```

- [ ] **docker info reports no errors**

```bash
docker info
# Expected: large block of system information with no critical errors
# Confirm: Storage Driver: overlay2
# Confirm: Logging Driver: json-file
```

- [ ] **Hello World container runs successfully**

```bash
docker run --rm hello-world
# Expected: "Hello from Docker!" message
```

- [ ] **Admin user is in the docker group**

```bash
groups
# Expected: includes "docker" in the list
```

- [ ] **Runner nodes: forgejo-runner user is in the docker group**

```bash
# Run on runner nodes only
id forgejo-runner 2>/dev/null | grep docker || echo "user not yet created"
```

- [ ] **daemon.json is valid**

```bash
sudo docker info 2>&1 | grep -i "daemon"
# No JSON parse errors should appear
```

---

## Deinstallation

Removing Docker stops all running containers and removes the container runtime. Back up any important container data and images before proceeding.

```bash
# Step 1: Stop all running containers
docker ps -q | xargs -r docker stop

# Step 2: Stop the Docker service
sudo systemctl stop docker
sudo systemctl stop containerd

# Step 3: Remove the Docker CE packages
sudo apt remove --purge \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
sudo apt autoremove -y

# Step 4: Remove all Docker data (images, containers, volumes, networks)
# WARNING: This is irreversible — all container data is lost
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd

# Step 5: Remove the daemon configuration
sudo rm -f /etc/docker/daemon.json
sudo rmdir /etc/docker 2>/dev/null || true

# Step 6: Remove the Docker GPG key and APT source
sudo rm -f /usr/share/keyrings/docker-archive-keyring.gpg
sudo rm -f /etc/apt/sources.list.d/docker.list
sudo apt update

# Step 7: Remove the docker group (if no longer needed)
sudo groupdel docker 2>/dev/null || true

# Step 8: Confirm Docker is gone
docker --version
# Expected: command not found
```

---

## Continuity Controls

- **Version pinning:** Docker CE uses a rolling release model. Review Docker release notes before running `sudo apt upgrade` to check for breaking changes in major versions.
- **Log rotation:** The `daemon.json` configuration rotates container logs at 10 MB × 3 files. For long-lived containers with high log volume, adjust `max-size` accordingly.
- **Disk usage:** Docker can accumulate large amounts of disk usage from unused images, stopped containers, and dangling volumes. Run `docker system prune -f` weekly on runner nodes to reclaim space. Use `docker system df` to audit usage.
- **live-restore:** The `live-restore: true` setting means containers keep running across daemon restarts. This is important on runner nodes so that in-progress CI jobs survive a daemon configuration change.
- **Security updates:** Docker CE security patches arrive via the Docker APT repository. Ensure `unattended-upgrades` (configured in guide 01) is allowed to update Docker packages, or apply Docker updates manually during maintenance windows.
