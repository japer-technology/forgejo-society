# Ubuntu 24.04 LTS

Ubuntu 24.04 LTS (Noble Numbat) is the foundation operating system for every host in the Forgejo-Society stack — the primary forge server, all 16 runner nodes, and the RTX 4090 LLM inference host. It provides a stable, security-maintained base with a five-year standard support window (until April 2029) and a ten-year extended security maintenance window. Choosing a single LTS release across the entire fleet simplifies package management, kernel compatibility, and operational runbooks. This guide covers a fresh, bare-metal installation from ISO through to a fully hardened, updated, production-ready system.

---

## Prerequisites

None — this is the foundation guide. All other guides in this library depend on a completed Ubuntu 24.04 LTS install.

---

## Hardware Reference

| Host | CPU | RAM | Storage |
| --- | --- | --- | --- |
| Forge server | i9 20-core @ 5 GHz | 64 GB | 2 TB NVMe |
| Runner nodes (×16) | i7 8-core @ 3 GHz | 8 GB | 60 GB SSD |
| LLM inference host | i9 32-core @ 5 GHz | 64 GB | 1 TB NVMe |

---

## Installation

### 1. Download the Ubuntu 24.04 LTS Server ISO

Navigate to the official Ubuntu releases page and download the server image. Always verify the checksum to ensure the download is not corrupted.

```bash
# Download the ISO (run on a workstation with internet access)
wget -O ubuntu-24.04-live-server-amd64.iso \
  "https://releases.ubuntu.com/24.04/ubuntu-24.04.2-live-server-amd64.iso"

# Download the SHA256 checksum file
wget -O SHA256SUMS \
  "https://releases.ubuntu.com/24.04/SHA256SUMS"

# Verify the ISO against the checksum
sha256sum --check --ignore-missing SHA256SUMS
# Expected output: ubuntu-24.04.2-live-server-amd64.iso: OK
```

### 2. Burn the ISO to USB

Use `dd` on Linux/macOS or Rufus on Windows to write the ISO to a USB drive. Replace `/dev/sdX` with your actual USB device — confirm with `lsblk` before writing; writing to the wrong device destroys its data.

```bash
# On a Linux workstation — identify the USB device first
lsblk

# Write the ISO to the USB (replace /dev/sdX with your device)
sudo dd if=ubuntu-24.04.2-live-server-amd64.iso \
         of=/dev/sdX \
         bs=4M status=progress oflag=sync
```

On Windows, download Rufus from https://rufus.ie, select the ISO, choose GPT partition scheme, leave everything else at default, and click Start.

### 3. Boot the Installer

Insert the USB drive into the target host, power on, and press the appropriate key to enter the boot menu (commonly F12, F11, or Del depending on the motherboard). Select the USB device from the boot menu.

### 4. Step-by-Step Installer Walkthrough

The Ubuntu 24.04 server installer is a text-based curses interface. Navigate with the arrow keys and Tab; select items with Space or Enter.

#### Language and Keyboard

- **Language**: English
- **Keyboard layout**: English (US) — or your local layout

#### Network Configuration (Static IP)

Static IP is mandatory for every Forgejo-Society host. The installer uses Netplan under the hood. Select your network interface and choose **Edit IPv4**. Switch from DHCP to **Manual** and fill in:

| Field | Forge server | Runner node example | LLM host |
| --- | --- | --- | --- |
| Subnet | 192.168.0.0/24 | 192.168.0.0/24 | 192.168.0.0/24 |
| Address | 192.168.0.10 | 192.168.0.2x | 192.168.0.50 |
| Gateway | 192.168.0.1 | 192.168.0.1 | 192.168.0.1 |
| Name servers | 1.1.1.1,1.0.0.1 | 1.1.1.1,1.0.0.1 | 1.1.1.1,1.0.0.1 |
| Search domains | yourdomain.com | yourdomain.com | yourdomain.com |

Adjust addresses to match your actual network plan.

#### Storage Layout (LVM with Encryption — Forge Server)

On the forge server, use the full guided LVM layout **with encryption** to protect at-rest data:

1. Select **Use an entire disk** → select the 2 TB NVMe.
2. Check **Set up this disk as an LVM group**.
3. Check **Encrypt the LVM group with LUKS** — you will be prompted to create and confirm a passphrase. Store this passphrase in your organisation's password manager immediately.
4. Accept the default partition plan (a large `/` volume occupying the whole VG).

On runner nodes (60 GB SSD), LVM encryption is optional but recommended. On the LLM host (1 TB NVMe), follow the same encryption procedure as the forge server.

#### Profile Setup (Admin User)

Create the initial administrator account. This account is for initial setup only — after SSH hardening is complete, daily work is done as a named operator with sudo.

| Field | Value |
| --- | --- |
| Your name | Forge Admin |
| Server name | forge (or runner01..runner16, llm-host) |
| Username | forgeadmin |
| Password | (strong, stored in password manager) |

#### SSH Configuration

- Check **Install OpenSSH server**.
- Do **not** import SSH keys from GitHub/Launchpad at this point — keys will be added manually during hardening.

#### Snaps

The installer offers to pre-install snaps. Deselect everything — no snaps are required in Forgejo-Society, and snap versions of common tools (particularly curl) can cause path-resolution conflicts.

#### Start the Installation

Confirm the summary screen and press **Install Now**. The installer formats the disk, installs packages, and reboots. Remove the USB when prompted.

### 5. First Boot

If LUKS encryption was enabled you will see a passphrase prompt before the system boots. Enter the passphrase. Log in as `forgeadmin`.

### 6. System Update

The very first action on every new host is a full system update. This applies security patches released since the ISO was created.

```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
```

Reboot after the upgrade to ensure the running kernel matches the installed packages (especially important when a kernel upgrade lands):

```bash
sudo reboot
```

### 7. Remove the Snap Version of curl, Install the APT Version

Ubuntu 24.04 ships with a snap-managed `curl` in some configurations. The snap version runs in a confined environment and can produce unexpected behaviour in scripts. Replace it with the APT package:

```bash
# Check which curl is active
which curl
curl --version

# Remove the snap version if present
sudo snap remove curl 2>/dev/null || true

# Install the APT version
sudo apt install -y curl
which curl
# Expected: /usr/bin/curl
```

### 8. Install Essential Packages

These packages are required by subsequent guides and useful for day-to-day operations on any Forgejo-Society host.

```bash
sudo apt install -y \
  build-essential \
  pkg-config \
  libssl-dev \
  libffi-dev \
  zlib1g-dev \
  git \
  curl \
  wget \
  unzip \
  xz-utils \
  gnupg2 \
  lsb-release \
  software-properties-common \
  apt-transport-https \
  ca-certificates \
  ufw \
  fail2ban \
  htop \
  iotop \
  iftop \
  ncdu \
  tmux \
  vim \
  nano \
  net-tools \
  dnsutils \
  iputils-ping \
  traceroute \
  rsync \
  pv \
  jq \
  yq \
  cron \
  logrotate
```

> **Note:** `ufw` and `fail2ban` are installed here but configured in their own dedicated guides ([UFW Firewall](02-ufw-firewall.md) and [fail2ban](03-fail2ban.md)).

### 9. Set Timezone to UTC

All hosts in Forgejo-Society run UTC. This ensures log timestamps and cron schedules are unambiguous across the fleet regardless of operator location.

```bash
sudo timedatectl set-timezone UTC
timedatectl status
# Expected: Time zone: UTC (UTC, +0000)
```

### 10. Configure Automatic Security Updates

`unattended-upgrades` applies security patches automatically without operator intervention, closing the window between patch release and deployment.

```bash
sudo apt install -y unattended-upgrades

# Enable automatic updates
sudo dpkg-reconfigure --priority=low unattended-upgrades
# When prompted, select "Yes"

# Verify the configuration
cat /etc/apt/apt.conf.d/20auto-upgrades
```

The file should contain:

```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

Enable and start the timer:

```bash
sudo systemctl enable --now unattended-upgrades
sudo systemctl status unattended-upgrades
```

### 11. Harden SSH

Reduce the attack surface of SSH by disabling root login and password authentication. Key-based authentication only.

First, ensure your public key is in `~/.ssh/authorized_keys` **before** disabling password authentication — locking yourself out is unrecoverable without console access.

```bash
# On your workstation, copy your public key to the new host
ssh-copy-id forgeadmin@192.168.0.10
# Verify you can log in with the key before continuing
ssh forgeadmin@192.168.0.10
```

Now harden the SSH daemon configuration:

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

sudo tee /etc/ssh/sshd_config.d/hardening.conf > /dev/null <<'EOF'
# Forgejo-Society SSH hardening
PermitRootLogin no
PasswordAuthentication no
ChallengeResponseAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
X11Forwarding no
AllowTcpForwarding no
PrintMotd no
# Only allow the admin user and the forgejo service account
AllowUsers forgeadmin forgejo
EOF

# Validate the configuration before restarting
sudo sshd -t
# No output means the configuration is valid

sudo systemctl restart ssh
```

Test the connection from a **second terminal** before closing the current session:

```bash
ssh forgeadmin@192.168.0.10
```

### 12. Create the Forgejo Service Account

The `forgejo` system account runs the Forgejo process with a dedicated non-interactive identity. It has no login shell and no home directory in `/home`.

```bash
sudo adduser \
  --system \
  --group \
  --no-create-home \
  --shell /bin/bash \
  --comment "Forgejo service account" \
  forgejo
```

> **Runner nodes:** Do not create the `forgejo` user on runners. The [Forgejo Runner](10-forgejo-runner.md) guide creates a `forgejo-runner` system account instead.

---

## Validation

Run every check below after installation. All should pass before proceeding to subsequent guides.

- [ ] **OS version is correct**

```bash
lsb_release -a
# Expected: Description: Ubuntu 24.04.x LTS
```

- [ ] **Hostname is set correctly**

```bash
hostname
hostnamectl
```

- [ ] **Static IP is configured and active**

```bash
ip a
# The configured static IP should appear on the primary interface
ip route show default
# Default route should point to 192.168.0.1
```

- [ ] **curl is the APT version, not snap**

```bash
which curl
# Expected: /usr/bin/curl
curl --version
# Should show curl x.x.x without "snap" in the path
```

- [ ] **Essential packages are installed**

```bash
dpkg -l | grep build-essential
dpkg -l | grep git | grep -v "git-" | head -3
dpkg -l | grep ufw
dpkg -l | grep fail2ban
```

- [ ] **UFW is installed (not yet enabled — configured in guide 02)**

```bash
sudo ufw status
# Expected: Status: inactive  (will be enabled in guide 02)
```

- [ ] **fail2ban is installed (not yet configured — done in guide 03)**

```bash
sudo systemctl status fail2ban
```

- [ ] **Timezone is UTC**

```bash
timedatectl status
# Expected: Time zone: UTC (UTC, +0000)
```

- [ ] **Automatic updates service is running**

```bash
sudo systemctl status unattended-upgrades
```

- [ ] **SSH hardening config is in place**

```bash
sudo sshd -T | grep -E "permitrootlogin|passwordauthentication"
# Expected:
# permitrootlogin no
# passwordauthentication no
```

- [ ] **Forgejo system account exists**

```bash
id forgejo
# Expected: uid=NNN(forgejo) gid=NNN(forgejo) groups=NNN(forgejo)
getent passwd forgejo
```

---

## Deinstallation

Ubuntu 24.04 LTS is the host operating system — there is no in-place deinstallation. Removing the OS means wiping the machine and reinstalling. This is a destructive, irreversible operation.

> **Warning:** All data on the disk will be permanently destroyed. Ensure all Forgejo repositories, PostgreSQL dumps, and configuration files have been backed up (see [Restic Backup](05-restic-backup.md)) and verified restorable before proceeding.

### Wipe and Reinstall Procedure

1. Retrieve the LUKS passphrase from your password manager (if the disk was encrypted).
2. Restore the latest Restic snapshot to a temporary location to confirm the backup is valid.
3. Power off the host: `sudo poweroff`.
4. Insert the Ubuntu 24.04 LTS USB created in the installation section.
5. Boot from USB and select **Try or Install Ubuntu Server**.
6. In the installer, choose **Use an entire disk** with the option to **Erase disk** (which destroys the old LUKS container and all data).
7. Proceed with the full installation walkthrough from the beginning of this guide.
8. After reinstall, restore data from the Restic backup.

---

## Continuity Controls

- **Kernel updates:** `unattended-upgrades` handles security patches automatically. After a kernel update the machine must be rebooted for the new kernel to become active. Monitor pending reboots with `cat /run/reboot-required`.
- **Package drift:** Run `sudo apt update && sudo apt list --upgradable` weekly to review non-security upgrades. Apply them during a scheduled maintenance window with `sudo apt upgrade -y`.
- **SSH keys:** Rotate operator SSH keys annually. When removing a key, delete the relevant line from `~/.ssh/authorized_keys` on every host in the fleet.
- **LUKS passphrase:** Store the LUKS encryption passphrase in an offline copy in addition to the digital password manager. If the passphrase is lost, the disk is unrecoverable.
- **EOL tracking:** Ubuntu 24.04 LTS standard support ends April 2029. Begin migration planning to Ubuntu 26.04 LTS no later than January 2029.
