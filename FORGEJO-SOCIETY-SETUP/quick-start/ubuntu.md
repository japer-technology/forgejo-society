# Ubuntu 24.04 LTS — Quick Start

This guide takes you from bare metal to a fully hardened, production-ready Ubuntu 24.04 LTS
host in one sitting. Every step is followed immediately by validation commands — run them all.
If a validation command does not produce the expected output, **stop and fix it** before moving
to the next step.

This guide applies to all Forgejo-Society hosts: the forge server, every runner node, and the
LLM inference host. Role-specific differences are noted inline.

> **Total time:** approximately 30–45 minutes per host on a wired network.

---

## What you need before you start

| Item | Detail |
|------|--------|
| Target machine | Powered off, connected to the LAN via ethernet |
| USB drive | ≥ 4 GB, empty (all data will be erased) |
| Working machine | A laptop or workstation with internet access |
| Network details | Static IP, gateway, DNS — confirm with your router admin panel |
| Password manager | You will generate several secrets during this guide; store every one immediately |

---

## Step 1 — Download and verify the Ubuntu 24.04 LTS ISO

Run on your working machine.

```bash
# Download the Ubuntu 24.04 LTS server ISO
wget -O ubuntu-24.04-live-server-amd64.iso \
  "https://releases.ubuntu.com/24.04/ubuntu-24.04.2-live-server-amd64.iso"

# Download the official checksum file
wget -O SHA256SUMS \
  "https://releases.ubuntu.com/24.04/SHA256SUMS"

# Verify: the ISO matches the checksum
sha256sum --check --ignore-missing SHA256SUMS
```

**✓ Validation — expected output:**
```
ubuntu-24.04.2-live-server-amd64.iso: OK
```

If you see `FAILED` instead of `OK`, the download is corrupt. Delete the ISO and download it
again before continuing.

---

## Step 2 — Write the ISO to a USB drive

### On Linux or macOS

```bash
# List all block devices so you can identify the USB drive
lsblk
# Look for a device roughly the size of your USB drive (e.g. /dev/sdb or /dev/disk4)

# ⚠ REPLACE /dev/sdX with YOUR USB device. Writing to the wrong device destroys its data.
sudo dd if=ubuntu-24.04-live-server-amd64.iso \
         of=/dev/sdX \
         bs=4M status=progress oflag=sync

# The command prints progress and exits when done. No separate validation step needed.
```

### On Windows

1. Download **Rufus** from <https://rufus.ie> (it is free and safe).
2. Open Rufus, select your USB drive from the **Device** drop-down.
3. Click **SELECT** and open the ISO you downloaded.
4. Set **Partition scheme** to `GPT`.
5. Leave everything else at default and click **START**.
6. When Rufus asks about writing in ISO mode or DD mode, choose **Write in ISO Image mode**.
7. Wait for the **READY** status.

---

## Step 3 — Boot the installer

1. Insert the USB drive into the target machine.
2. Power on the machine and immediately press the boot-menu key:
   - **Common keys:** `F12` (Lenovo/Dell), `F11` (Gigabyte), `F9` (HP), `Del` (ASUS/MSI)
   - If you miss it, power off and try again.
3. From the boot menu, select the USB device.
4. On the GNU GRUB screen that appears, select **Try or Install Ubuntu Server** and press Enter.

---

## Step 4 — Ubuntu Server Installer walkthrough

The installer is a text-based screen interface. Navigate with **arrow keys** and **Tab**;
toggle checkboxes with **Space**; confirm selections with **Enter**.

### 4.1 Language

Select **English** (or your preferred language) and press Enter.

### 4.2 Keyboard layout

Select **English (US)** (or your local layout). Press **Done**.

### 4.3 Type of install

Choose **Ubuntu Server** (not Minimized). Press **Done**.

### 4.4 Network — assign a static IP

> Static IP is **mandatory** for every Forgejo-Society host. DHCP addresses change on reboot and
> will break DNS, SSH access, and firewall rules.

1. Arrow-key to your network interface (e.g. `eth0` or `eno1`) and press Enter.
2. Select **Edit IPv4** → change **Automatic (DHCP)** to **Manual**.
3. Fill in the fields for your host role:

| Field | Forge server | Runner node (example) | LLM host |
|-------|-------------|----------------------|----------|
| Subnet | 192.168.0.0/24 | 192.168.0.0/24 | 192.168.0.0/24 |
| Address | 192.168.0.10 | 192.168.0.21–36 | 192.168.0.50 |
| Gateway | 192.168.0.1 | 192.168.0.1 | 192.168.0.1 |
| Name servers | 1.1.1.1,1.0.0.1 | 1.1.1.1,1.0.0.1 | 1.1.1.1,1.0.0.1 |
| Search domains | yourdomain.com | yourdomain.com | yourdomain.com |

Adjust every address to match your actual network plan. Press **Save**, then **Done**.

### 4.5 Storage — LVM with encryption

On the **forge server** and **LLM host** (NVMe drives), enable encryption:

1. Select **Use an entire disk** → choose your NVMe drive.
2. Check **Set up this disk as an LVM group**.
3. Check **Encrypt the LVM group with LUKS** → type a strong passphrase, confirm it.
4. **Write the passphrase in your password manager immediately** — if it is lost, the disk is
   permanently unrecoverable.
5. Accept the default partition layout (one large `/` volume).

On **runner nodes** (60 GB SSD), LUKS encryption is optional but recommended. Follow the same
steps above.

Press **Done**, then confirm **Continue** on the destructive-action warning.

### 4.6 Profile setup — create the admin user

| Field | Value |
|-------|-------|
| Your name | Forge Admin |
| Server name | `forge` / `runner01`…`runner16` / `llm-host` |
| Username | `forgeadmin` |
| Password | (strong, from your password manager) |

Press **Done**.

### 4.7 SSH configuration

- **Check** *Install OpenSSH server*.
- **Do not** import SSH keys from GitHub or Launchpad at this stage — you will add keys
  manually in Step 9.

Press **Done**.

### 4.8 Snaps — deselect everything

Arrow to any selected snap and press **Space** to deselect it. Ubuntu 24.04 ships a snap
version of `curl` that causes path-resolution conflicts in scripts. Install **nothing** here.

Press **Done**.

### 4.9 Start the installation

Review the summary screen and press **Install Now**. The installer formats the disk and
installs the base system. This takes 5–10 minutes on an SSD.

When prompted, **remove the USB drive** and press **Enter** to reboot.

---

## Step 5 — First boot

If you enabled LUKS encryption you will see a passphrase prompt before the login screen.
Enter the passphrase you set during installation.

Log in as `forgeadmin` with the password you set.

**✓ Validation — confirm you are logged in and can reach the internet:**

```bash
whoami
# Expected: forgeadmin

ping -c 3 1.1.1.1
# Expected: 3 packets transmitted, 3 received, 0% packet loss
```

---

## Step 6 — Set the hostname

Set the hostname so it matches the role of this host. Replace `forge` with the correct name
for your host (`runner01` through `runner16`, or `llm-host`).

```bash
sudo hostnamectl set-hostname forge
```

**✓ Validation:**

```bash
hostname
# Expected: forge  (or runner01, llm-host, etc.)

hostnamectl
# Expected: Static hostname: forge
```

---

## Step 7 — Full system update

Apply all security patches released since the ISO was built. This is the most important
first action on any new Ubuntu host.

```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
```

Reboot to activate any kernel upgrade that was just installed:

```bash
sudo reboot
```

Log in again after the reboot.

**✓ Validation:**

```bash
sudo apt list --upgradable 2>/dev/null | grep -v "Listing"
# Expected: empty output — no upgrades pending
```

---

## Step 8 — Remove snap curl, install APT curl

Ubuntu 24.04 may ship with a snap-managed `curl` that runs in a confined environment.
Replace it with the standard APT package to avoid script failures.

```bash
# Check the current curl
which curl
curl --version

# Remove the snap version (safe even if not installed)
sudo snap remove curl 2>/dev/null || true

# Install the APT version
sudo apt install -y curl
```

**✓ Validation:**

```bash
which curl
# Expected: /usr/bin/curl

curl --version
# Expected: curl X.X.X ...
# The path must be /usr/bin/curl — not /snap/bin/curl
```

---

## Step 9 — Install essential packages

These packages are required by every subsequent guide in the Forgejo-Society library.

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

**✓ Validation — check a sample of key packages:**

```bash
dpkg -l build-essential git curl wget ufw fail2ban jq 2>/dev/null \
  | awk '/^ii/{print $2, $3}'
# Expected: each of those package names listed with a version number
# Any "no packages found" means the install failed — re-run apt install for the missing item
```

---

## Step 10 — Set timezone to UTC

All Forgejo-Society hosts run UTC. This keeps log timestamps and cron schedules unambiguous
across the fleet regardless of operator location.

```bash
sudo timedatectl set-timezone UTC
```

**✓ Validation:**

```bash
timedatectl status | grep "Time zone"
# Expected: Time zone: UTC (UTC, +0000)
```

---

## Step 11 — Enable automatic security updates

`unattended-upgrades` applies security patches automatically, closing the gap between patch
release and deployment on your hosts.

```bash
sudo apt install -y unattended-upgrades

# Answer "Yes" when prompted
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Enable and start the service
sudo systemctl enable --now unattended-upgrades
```

**✓ Validation:**

```bash
# Check the auto-upgrades configuration file
cat /etc/apt/apt.conf.d/20auto-upgrades
# Expected output:
# APT::Periodic::Update-Package-Lists "1";
# APT::Periodic::Unattended-Upgrade "1";

# Check the service is running
sudo systemctl status unattended-upgrades --no-pager
# Expected: Active: active (running)
```

---

## Step 12 — Harden SSH

> ⚠ **Critical:** Copy your SSH public key to this host **before** running the commands below.
> If you disable password authentication without a working key, you will be locked out and
> will need physical console access to recover.

**On your workstation**, copy your public key to the new host:

```bash
# Replace forgeadmin and 192.168.0.10 with your username and the host's IP
ssh-copy-id forgeadmin@192.168.0.10

# Immediately verify you can log in with the key
ssh forgeadmin@192.168.0.10
# You should be logged in without being asked for a password
```

**Back on the target host**, now harden the SSH daemon:

```bash
# Back up the original config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# Write the hardening drop-in configuration
sudo tee /etc/ssh/sshd_config.d/hardening.conf > /dev/null <<'EOF'
# Forgejo-Society SSH hardening
PermitRootLogin no
PasswordAuthentication no
ChallengeResponseAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
X11Forwarding no
AllowTcpForwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
PrintMotd no
EOF

# Test the configuration before restarting — must produce no output
sudo sshd -t
# No output = config is valid. Any error message = fix before continuing.

# Restart SSH
sudo systemctl restart ssh
```

> ⚠ **Before closing your current terminal**, open a **second terminal** and confirm SSH
> still works:
> `ssh forgeadmin@192.168.0.10`
> If it fails, run `sudo ufw disable` and `sudo systemctl restart ssh` from the first terminal
> to recover.

**✓ Validation:**

```bash
# Confirm the hardening settings are active
sudo sshd -T | grep -E "permitrootlogin|passwordauthentication|pubkeyauthentication"
# Expected:
# permitrootlogin no
# passwordauthentication no
# pubkeyauthentication yes

# Confirm the backup exists
ls -la /etc/ssh/sshd_config.bak
# Expected: file listed with a timestamp from today
```

---

## Step 13 — Configure UFW firewall

UFW provides a default-deny inbound firewall. The rule set differs by host role.

```bash
# Set the default policy first — deny all inbound, allow all outbound
sudo ufw default deny incoming
sudo ufw default allow outgoing

# ── Always add SSH before enabling UFW ──────────────────────────────────────
sudo ufw allow OpenSSH comment 'SSH administration'
```

Now add the role-specific rules:

**Forge server only:**
```bash
sudo ufw allow 80/tcp  comment 'HTTP - ACME TLS challenge and redirect'
sudo ufw allow 443/tcp comment 'HTTPS - Forgejo web and git'
```

**LLM inference host only:**
```bash
# Allow LM Studio API from the local subnet only — replace 192.168.0.0/24 with your subnet
sudo ufw allow from 192.168.0.0/24 to any port 1234 proto tcp \
  comment 'LM Studio API - local subnet only'
```

**Runner nodes:** no extra rules needed beyond SSH.

Now enable UFW:

```bash
sudo ufw enable
# Type 'y' and press Enter when prompted
```

**✓ Validation:**

```bash
sudo ufw status verbose
# First line must be: Status: active
# Default line must show: deny (incoming), allow (outgoing)

# Confirm SSH is allowed
sudo ufw status | grep -i ssh
# Expected: 22/tcp (OpenSSH)   ALLOW IN   Anywhere

# Test SSH from a second terminal while UFW is active
# ssh forgeadmin@192.168.0.10  — must succeed
```

---

## Step 14 — Configure fail2ban

fail2ban bans IP addresses that make repeated failed SSH login attempts.

```bash
# Create the SSH jail configuration
sudo tee /etc/fail2ban/jail.d/ssh.conf > /dev/null <<'EOF'
[sshd]
enabled   = true
port      = ssh
filter    = sshd
backend   = systemd
logpath   = /var/log/auth.log
maxretry  = 5
findtime  = 10m
bantime   = 1h
ignoreip  = 127.0.0.1/8 ::1 192.168.0.0/24
EOF

# Enable and start fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

**✓ Validation:**

```bash
# Service must be running
sudo systemctl status fail2ban --no-pager
# Expected: Active: active (running)

# Daemon must respond
sudo fail2ban-client ping
# Expected: Server replied: pong

# SSH jail must be active
sudo fail2ban-client status
# Expected output includes:
# Jail list: sshd

sudo fail2ban-client status sshd
# Expected: shows the sshd jail with Currently banned: 0

# Drop-in config must be present
cat /etc/fail2ban/jail.d/ssh.conf
# Expected: shows the configuration you just wrote
```

---

## Step 15 — Create the Forgejo service account

> **Runner nodes and developer workstations:** skip this step. The Forgejo service account is
> only needed on the **forge server**.

```bash
sudo adduser \
  --system \
  --group \
  --no-create-home \
  --shell /bin/bash \
  --comment "Forgejo service account" \
  forgejo
```

**✓ Validation:**

```bash
id forgejo
# Expected: uid=NNN(forgejo) gid=NNN(forgejo) groups=NNN(forgejo)

getent passwd forgejo
# Expected: forgejo:x:NNN:NNN:Forgejo service account:/nonexistent:/bin/bash
```

---

## Full installation checklist

Run all of these in one pass after completing every step above to confirm the host is ready
for the next phase of the Forgejo-Society install.

```bash
echo "=== Ubuntu Quick Start — Final Validation ==="

echo ""
echo "--- OS version ---"
lsb_release -a
# Expected: Description: Ubuntu 24.04.x LTS

echo ""
echo "--- Hostname ---"
hostname
hostnamectl | grep "Static hostname"

echo ""
echo "--- Static IP ---"
ip a | grep "inet "
ip route show default
# Default route must point to your gateway

echo ""
echo "--- curl is APT version ---"
which curl
# Expected: /usr/bin/curl
curl --version | head -1

echo ""
echo "--- Key packages installed ---"
for pkg in build-essential git curl wget ufw fail2ban jq; do
  dpkg -l "$pkg" 2>/dev/null | awk '/^ii/{print "  OK: "$2}' \
    || echo "  MISSING: $pkg"
done

echo ""
echo "--- Timezone is UTC ---"
timedatectl | grep "Time zone"
# Expected: Time zone: UTC

echo ""
echo "--- Automatic updates service ---"
sudo systemctl is-active unattended-upgrades
# Expected: active

echo ""
echo "--- SSH hardening ---"
sudo sshd -T | grep -E "permitrootlogin|passwordauthentication"
# Expected: permitrootlogin no / passwordauthentication no

echo ""
echo "--- UFW is active ---"
sudo ufw status | head -1
# Expected: Status: active

echo ""
echo "--- fail2ban is running ---"
sudo fail2ban-client ping
# Expected: Server replied: pong

echo ""
echo "--- fail2ban SSH jail ---"
sudo fail2ban-client status | grep "Jail list"
# Expected: Jail list: sshd

echo "=== Validation complete. Review any lines above that do not match their expected output. ==="
```

---

## What comes next

This host is now a hardened Ubuntu 24.04 LTS base ready for the next layer of the stack.
Continue with the appropriate guide for the host's role:

| Host role | Next guide |
|-----------|-----------|
| Forge server | [Docker Engine](../install/04-docker-engine.md) → PostgreSQL → Forgejo |
| Runner node | [Docker Engine](../install/04-docker-engine.md) → Forgejo Runner |
| LLM inference host | [NVIDIA Drivers](../install/11-nvidia-drivers.md) → LM Studio |
| Developer workstation | [Git and Git LFS (Linux)](../install/13-git-linux.md) |

For the full sequential install order for each role, see
[Install library master index](../install/00-index.md).

For a single-document rapid deployment of the entire Forgejo-Society stack, see
[Forgejo-Society Quick Start](forgejo-society.md).
