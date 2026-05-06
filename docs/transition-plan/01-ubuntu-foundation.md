# Ubuntu Foundation

Ubuntu 24.04 LTS (Noble Numbat) is the OS baseline for every host in this plan: the
primary Forgejo server, all 16 runner nodes, and the LLM inference machine.

---

## Role in the exit plan

- Host the primary Forgejo instance (governance layer).
- Provide a consistent, repeatable base for runner nodes.
- Run reverse proxy, TLS termination, monitoring, and backup services.
- Serve as the clean restore target for disaster recovery drills.

---

## System requirements

| Host | Minimum | Recommended |
|---|---|---|
| Forge server | 4 cores · 8 GB RAM · 100 GB disk | i9 20-core · 64 GB · 2 TB NVMe |
| Runner node | 2 cores · 4 GB RAM · 40 GB disk | i7 8-core · 8 GB · 60 GB SSD |
| LLM server | 8 cores · 32 GB RAM · GPU 16 GB VRAM | i9 32-core · 64 GB · RTX 4090 |

---

## Phase 1 — Base OS install

Install Ubuntu 24.04 LTS (Noble Numbat) on every host. Use the server ISO for
headless machines and the desktop ISO only for workstations.

Download: <https://releases.ubuntu.com/24.04/>

### Installation checklist

- [ ] Boot from Ubuntu 24.04 LTS server ISO
- [ ] Select language: English
- [ ] Select keyboard layout
- [ ] Choose "Ubuntu Server (minimized)" for runner nodes; full install for the forge host
- [ ] Configure network: assign a static IP on the local network
- [ ] Disk layout: use the full disk with LVM; enable disk encryption for the forge host
- [ ] Create admin user (not `root`); record credentials in the team password vault
- [ ] Skip optional snaps during install
- [ ] Reboot and log in via console to confirm the install

---

## Phase 2 — Post-install hardening

Run all commands as your admin user with `sudo`. Replace `YOUR_USERNAME` with the
actual account name.

### 2.0 Remove snap curl and replace it with the apt version

Ubuntu 24.04 desktop and some server ISOs ship `curl` as a snap. The snap version
runs in a confined sandbox and **cannot write to `/usr/share/keyrings`**, which
breaks every `curl | gpg --dearmor` key-import step used later for Docker, Caddy,
VS Code, and others. Purge it and install the real apt package **before running any
other command**.

```bash
# Check whether snap curl is installed (will print a path if so)
which curl

# Remove snap curl if present
sudo snap remove curl

# Install the real curl from apt
sudo apt install -y curl wget

# Confirm — must print /usr/bin/curl, NOT a snap path
which curl
curl --version
```

> **Do not skip this step on a desktop ISO.** On a server ISO you may find curl is
> already the apt version; `which curl` will confirm it. Either way, running the
> block above is safe.

### 2.1 Update the system

```bash
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y
```

### 2.2 Install essential packages

Ubuntu server and minimized ISOs ship without compilers. The `build-essential` meta-
package pulls in `gcc`, `g++`, `make`, and `libc-dev` in one shot. The SSL and zlib
dev headers are required by Rust's standard library and Python's `ssl`/`hashlib`
modules. Install everything here so no later step fails due to missing toolchain
components.

```bash
sudo apt install -y \
  build-essential pkg-config \
  libssl-dev libffi-dev zlib1g-dev \
  git curl wget unzip xz-utils gnupg2 lsb-release \
  software-properties-common apt-transport-https ca-certificates \
  ufw fail2ban \
  htop iotop iftop ncdu \
  tmux vim nano \
  net-tools dnsutils iputils-ping traceroute \
  rsync pv \
  jq yq \
  cron logrotate
```

### 2.3 Configure the firewall

```bash
# Deny everything inbound by default; allow SSH, HTTP, HTTPS
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

On runner nodes allow only SSH inbound (they connect out to the forge, not the reverse):

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw enable
```

### 2.4 Harden SSH

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

sudo tee /etc/ssh/sshd_config.d/hardening.conf > /dev/null <<'EOF'
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
X11Forwarding no
AllowTcpForwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
EOF

sudo systemctl reload sshd
```

> **Before disabling password authentication**, make sure your SSH public key is in
> `~/.ssh/authorized_keys` on the server. Test in a second terminal before closing
> your current session.

### 2.5 Configure fail2ban

```bash
sudo tee /etc/fail2ban/jail.d/ssh.conf > /dev/null <<'EOF'
[sshd]
enabled   = true
port      = ssh
maxretry  = 5
bantime   = 1h
findtime  = 10m
EOF

sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

### 2.6 Set the timezone

```bash
sudo timedatectl set-timezone UTC
timedatectl status
```

### 2.7 Configure automatic security updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

Accept the defaults to enable automatic security patches.

---

## Phase 3 — Install Docker

Forgejo runners and some workloads run inside containers.

```bash
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add the Docker repository
echo "deb [arch=$(dpkg --print-architecture) \
  signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to the docker group so you can run docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker run --rm hello-world
```

---

## Phase 4 — User and key management

### 4.1 Create the Forgejo service account (forge host only)

```bash
sudo adduser \
  --system \
  --shell /bin/bash \
  --gecos 'Forgejo' \
  --group \
  --disabled-password \
  --home /home/forgejo \
  forgejo
```

### 4.2 Generate an SSH key on a workstation

```bash
# On your local machine — Ed25519 is preferred
ssh-keygen -t ed25519 -C "you@yourdomain.com" -f ~/.ssh/id_ed25519

# Copy the public key to a remote host
ssh-copy-id -i ~/.ssh/id_ed25519.pub YOUR_USERNAME@SERVER_IP
```

### 4.3 Test SSH access

```bash
ssh -i ~/.ssh/id_ed25519 YOUR_USERNAME@SERVER_IP "echo OK"
```

---

## Phase 5 — Disk layout guidance

For the forge host, use a layout that separates OS, database, and repository data so
each can be expanded or backed up independently.

| Mount | Purpose | Minimum |
|---|---|---|
| `/` | OS and packages | 40 GB |
| `/var/lib/postgresql` | Database files | 20 GB |
| `/var/lib/forgejo` | Repository storage and uploads | 500 GB |
| `/backup` | Local backup staging area | 100 GB |

On an LVM system:

```bash
# List volume groups and logical volumes
sudo vgs
sudo lvs

# Extend the repository LV to 500 GB (adjust to your VG free space)
sudo lvextend -L 500G /dev/ubuntu-vg/forgejo-lv
sudo resize2fs /dev/ubuntu-vg/forgejo-lv

# Or create a new LV and mount it
sudo lvcreate -L 500G -n forgejo-lv ubuntu-vg
sudo mkfs.ext4 /dev/ubuntu-vg/forgejo-lv
sudo mkdir -p /var/lib/forgejo
echo '/dev/ubuntu-vg/forgejo-lv /var/lib/forgejo ext4 defaults 0 2' \
  | sudo tee -a /etc/fstab
sudo mount -a
```

---

## Phase 6 — Monitoring basics

```bash
sudo apt install -y prometheus-node-exporter

# The exporter listens on :9100 by default
# Add a UFW rule if Prometheus scrapes from another host
sudo ufw allow from PROMETHEUS_SERVER_IP to any port 9100
sudo systemctl enable --now prometheus-node-exporter
```

For a lightweight local view, `htop`, `iotop`, and `ncdu` are already installed.

---

## Phase 7 — Backup tooling

```bash
sudo apt install -y borgbackup restic

# Verify restic works
restic version
```

Full backup configuration and schedules are covered in [02 — Forgejo primary forge](02-forgejo-primary-forge.md)
and [13 — PostgreSQL database](13-postgresql-database.md).

---

## Continuity controls

- Run `sudo apt update && sudo apt upgrade -y` monthly on all hosts.
- Keep a host rebuild playbook (or Ansible role) that reproduces a clean host from this guide.
- Snapshot the forge host disk before any major upgrade.
- Test full restore to a clean Ubuntu host at least once per quarter.

---

## Open decisions

- [ ] Which LVM or ZFS layout is preferred for the forge host?
- [ ] Which provider or cloud is the off-site backup destination?
- [ ] Is Ansible used for host configuration management across the runner fleet?
