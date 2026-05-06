# Ubuntu 24.04 LTS — Refresh Guide

This guide covers the most common Ubuntu maintenance workflows: cleaning up a running
system, repairing drifted configuration, resetting UFW or fail2ban back to the Forgejo-Mind
standard, and auditing what is actually running. Use it instead of a full reinstall.

Every section is self-contained. Jump directly to the section you need.

> **No reinstall required.** These are live-system operations. The host stays up throughout.

---

## Quick reference — which section do I need?

| Situation | Go to |
|-----------|-------|
| System feels sluggish / disk is filling up | [§1 System cleanup](#1--system-cleanup-and-update) |
| Packages are out of date | [§2 System update](#2--system-update) |
| UFW firewall is broken or misconfigured | [§3 UFW reset](#3--reset-ufw-firewall) |
| fail2ban is not running or has wrong rules | [§4 fail2ban reset](#4--reset-fail2ban) |
| SSH login is broken | [§5 SSH repair](#5--repair-ssh) |
| Need to see what is running / port audit | [§6 Service audit](#6--service-and-port-audit) |
| Hostname is wrong | [§7 Hostname fix](#7--fix-the-hostname) |
| Timezone is wrong | [§8 Timezone fix](#8--fix-the-timezone) |
| Automatic updates are off | [§9 Automatic updates repair](#9--repair-automatic-updates) |
| Something is using all the disk space | [§10 Disk investigation](#10--disk-investigation-and-cleanup) |
| Full health check — confirm everything is correct | [§11 Full validation script](#11--full-system-validation-script) |

---

## §1 — System cleanup and update

Run this block any time the system needs a general tidy-up. Safe on a live production host.

```bash
# Step 1: Refresh the package index
sudo apt update

# Step 2: Apply all available upgrades
sudo apt upgrade -y

# Step 3: Remove packages that were installed as dependencies but are no longer needed
sudo apt autoremove -y

# Step 4: Remove the local APT package cache (frees disk space — packages will be
#          re-downloaded if needed in future)
sudo apt clean

# Step 5: Remove stale package lists
sudo apt autoclean
```

**✓ Validation:**

```bash
# No upgradable packages should remain
sudo apt list --upgradable 2>/dev/null | grep -v "^Listing"
# Expected: empty output

# Disk usage before and after (run before §10 if disk is full)
df -h /
# Note the "Use%" column — it should have dropped after the clean steps
```

---

## §2 — System update

This is the focused upgrade-only version when you do not want the full cleanup.

```bash
sudo apt update && sudo apt upgrade -y
```

After a kernel upgrade, the running kernel differs from the installed kernel until you
reboot. Check whether a reboot is required:

```bash
# If this file exists, a reboot is pending
ls /run/reboot-required 2>/dev/null \
  && echo "REBOOT REQUIRED" \
  || echo "No reboot pending"
```

To apply the new kernel:

```bash
sudo reboot
# Log back in after the reboot and confirm the new kernel is active:
uname -r
# The version should match the most recently installed linux-image package
```

**✓ Validation:**

```bash
# Kernel version
uname -r

# Confirm no upgrades are pending
sudo apt list --upgradable 2>/dev/null | grep -v "^Listing"
# Expected: empty output
```

---

## §3 — Reset UFW firewall

Use this section when UFW is disabled, has wrong rules, or was accidentally reset.
This restores it to the Forgejo-Mind standard for the host's role.

### 3.1 Check the current state

```bash
sudo ufw status verbose
# If "Status: inactive" appears, UFW is disabled — follow the steps below to fix it
# If rules are wrong, follow the reset procedure
```

### 3.2 Reset UFW to a clean state

> ⚠ This removes **all** existing rules. UFW will be left in an inactive state with default
> policies after the reset — complete all steps before reconnecting from another terminal.

```bash
# Disable UFW — removes all active kernel rules
sudo ufw disable

# Reset to factory defaults — clears all rules
sudo ufw reset
# Type 'y' and Enter when prompted
```

### 3.3 Re-apply the standard rules

```bash
# Set the default policy
sudo ufw default deny incoming
sudo ufw default allow outgoing

# ── SSH — required on every host ─────────────────────────────────────────────
sudo ufw allow OpenSSH comment 'SSH administration'
```

Add the rules for your host role:

**Forge server only:**
```bash
sudo ufw allow 80/tcp  comment 'HTTP - ACME TLS challenge and redirect'
sudo ufw allow 443/tcp comment 'HTTPS - Forgejo web and git'
```

**LLM inference host only:**
```bash
# Replace 192.168.0.0/24 with your LAN subnet if different
sudo ufw allow from 192.168.0.0/24 to any port 1234 proto tcp \
  comment 'LM Studio API - local subnet only'
```

**Runner nodes:** SSH only — no additional rules needed.

```bash
# Enable UFW — you will be warned about disrupting existing connections, type 'y'
sudo ufw enable
```

**✓ Validation:**

```bash
sudo ufw status verbose
# Expected first line: Status: active
# Expected default line: deny (incoming), allow (outgoing)

sudo ufw status | grep -i ssh
# Expected: 22/tcp (OpenSSH)   ALLOW IN   Anywhere

# SSH from a second terminal to confirm you have not locked yourself out
# ssh forgeadmin@<this host's IP>
```

---

## §4 — Reset fail2ban

Use this section when fail2ban is stopped, has no jails, or has the wrong configuration.

### 4.1 Check the current state

```bash
sudo systemctl status fail2ban --no-pager
# Look for Active: active (running)

sudo fail2ban-client ping
# Expected: Server replied: pong
# If this fails, fail2ban is not running — follow the steps below
```

### 4.2 Stop and reset fail2ban

```bash
# Stop the service — this automatically unbans all currently banned IPs
sudo systemctl stop fail2ban
```

### 4.3 Restore the standard SSH jail configuration

```bash
# Write the Forgejo-Mind standard SSH jail
# The ignoreip line prevents you from accidentally banning yourself or LAN hosts
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
```

```bash
# Start and enable fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

**✓ Validation:**

```bash
sudo systemctl status fail2ban --no-pager
# Expected: Active: active (running)

sudo fail2ban-client ping
# Expected: Server replied: pong

sudo fail2ban-client status
# Expected: Jail list: sshd

sudo fail2ban-client status sshd
# Expected: shows the sshd jail details, Currently banned: 0

cat /etc/fail2ban/jail.d/ssh.conf
# Expected: shows the configuration you just wrote
```

### 4.4 Manually unban an IP if you accidentally banned yourself

```bash
# Replace 203.0.113.45 with the actual IP to unban
sudo fail2ban-client set sshd unbanip 203.0.113.45

# Confirm the IP is no longer banned
sudo fail2ban-client status sshd | grep "Banned IP"
# Expected: empty list (or the IP you just removed is gone)
```

---

## §5 — Repair SSH

Use this section if you cannot SSH into the host or the SSH daemon is failing.

### 5.1 Check the SSH daemon status

You must be logged in via the console or an existing terminal session to run these.

```bash
sudo systemctl status ssh --no-pager
# Look for Active: active (running)
# If it shows "failed" or "inactive", proceed below
```

### 5.2 Test the current SSH configuration for errors

```bash
sudo sshd -t
# No output = configuration is valid
# Any error message = there is a syntax error in sshd_config — fix it before restarting
```

### 5.3 Find which config file has the error

```bash
# List all active SSH configuration files
ls -la /etc/ssh/sshd_config /etc/ssh/sshd_config.d/ 2>/dev/null

# If the hardening drop-in has an error, inspect it
cat /etc/ssh/sshd_config.d/hardening.conf
```

### 5.4 Restore the hardening config to the known-good version

```bash
sudo tee /etc/ssh/sshd_config.d/hardening.conf > /dev/null <<'EOF'
# Forgejo-Mind SSH hardening
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

# Validate the configuration
sudo sshd -t
# No output = valid

# Restart SSH
sudo systemctl restart ssh
```

### 5.5 Check that your authorized_keys file is correct

```bash
# View the keys in your authorized_keys file
cat ~/.ssh/authorized_keys
# Each line should start with "ssh-ed25519" or "ssh-rsa" followed by a long string

# File and directory permissions must be exact — SSH ignores keys with wrong permissions
ls -la ~/.ssh/
# Expected: drwx------ (700) for ~/.ssh/
ls -la ~/.ssh/authorized_keys
# Expected: -rw------- (600) for the file

# Fix permissions if wrong
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**✓ Validation:**

```bash
sudo sshd -T | grep -E "permitrootlogin|passwordauthentication|pubkeyauthentication"
# Expected:
# permitrootlogin no
# passwordauthentication no
# pubkeyauthentication yes

sudo systemctl status ssh --no-pager
# Expected: Active: active (running)

# Test from a second terminal
# ssh forgeadmin@<this host's IP>
```

---

## §6 — Service and port audit

Use this section to see exactly what is running and what ports are open.

### List all running services

```bash
# All active systemd services
sudo systemctl list-units --type=service --state=running --no-pager
```

### List all listening ports

```bash
# All open TCP and UDP ports with the process name
sudo ss -tlnp
# t = TCP, l = listening, n = show port numbers, p = show process

# Or for a combined view including UDP
sudo ss -ulnp
```

### Cross-reference UFW rules against open ports

```bash
# Side-by-side: what is listening (ss) vs what UFW allows
echo "=== Listening TCP ports ==="
sudo ss -tlnp | awk 'NR>1 {print $4, $6}'

echo ""
echo "=== UFW rules ==="
sudo ufw status numbered
```

Any port shown as listening but **not** in the UFW allow list is either:
- Protected because UFW default-denies inbound (good — nothing to do), or
- An unintentional exposure you should investigate.

### Check failed systemd services

```bash
sudo systemctl --failed --no-pager
# Expected: 0 loaded units listed — no failed units
```

**✓ Validation:**

```bash
# No failed services
sudo systemctl --failed --no-pager | grep -c "loaded units listed"
# If the number is 0, no failed services

# UFW is active
sudo ufw status | head -1
# Expected: Status: active
```

---

## §7 — Fix the hostname

If the hostname was set incorrectly during installation, change it now.

```bash
# Set the new hostname — replace 'forge' with the correct name
sudo hostnamectl set-hostname forge

# Also update /etc/hosts so the hostname resolves locally
sudo sed -i "s/127.0.1.1.*/127.0.1.1\tforge/" /etc/hosts
```

**✓ Validation:**

```bash
hostname
# Expected: forge

hostnamectl | grep "Static hostname"
# Expected: Static hostname: forge

grep forge /etc/hosts
# Expected: 127.0.1.1    forge
```

> You do **not** need to reboot for the hostname change to take effect in most cases, but a
> reboot ensures all processes (including the SSH daemon banner) see the updated name.

---

## §8 — Fix the timezone

All Forgejo-Mind hosts must run UTC.

```bash
sudo timedatectl set-timezone UTC
```

**✓ Validation:**

```bash
timedatectl status | grep "Time zone"
# Expected: Time zone: UTC (UTC, +0000)
```

---

## §9 — Repair automatic updates

If `unattended-upgrades` was disabled or misconfigured, restore it.

```bash
# Reinstall the package (idempotent — safe if already installed)
sudo apt install -y unattended-upgrades

# Reconfigure — answer "Yes" when prompted
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Enable and start the service
sudo systemctl enable --now unattended-upgrades
```

**✓ Validation:**

```bash
cat /etc/apt/apt.conf.d/20auto-upgrades
# Expected:
# APT::Periodic::Update-Package-Lists "1";
# APT::Periodic::Unattended-Upgrade "1";

sudo systemctl is-active unattended-upgrades
# Expected: active
```

---

## §10 — Disk investigation and cleanup

When disk space is low, find and remove what is safe to delete.

### Find the biggest space consumers

```bash
# Overall disk usage by filesystem
df -h

# Top 20 directories by size, starting from /
sudo du -h --max-depth=3 / 2>/dev/null | sort -rh | head -20

# Find files larger than 500 MB anywhere on the system
sudo find / -type f -size +500M 2>/dev/null
```

### Clear APT cache

```bash
# Show how much space the APT cache is using
du -sh /var/cache/apt/archives/

# Remove all cached .deb files
sudo apt clean

# Remove only packages that can no longer be downloaded (stale cache)
sudo apt autoclean
```

### Remove old log files (safely)

```bash
# Show journal disk usage
sudo journalctl --disk-usage

# Keep only the last 7 days of journal logs
sudo journalctl --vacuum-time=7d

# Or limit by size — keep only 200 MB of journal
sudo journalctl --vacuum-size=200M
```

### Remove old kernel images

Ubuntu keeps multiple kernel versions after upgrades. Remove the old ones:

```bash
# Show installed kernels
dpkg -l 'linux-image-*' | grep ^ii | awk '{print $2}'

# Remove old kernels (safe — apt autoremove targets only unused ones)
sudo apt autoremove -y
```

### Clear old backups (if the /backup directory is full)

```bash
# Show backup directory sizes
du -sh /backup/*/ 2>/dev/null | sort -rh

# Remove PostgreSQL backups older than 30 days
sudo find /backup/postgresql -name "*.dump" -mtime +30 -delete

# Remove Forgejo backup directories older than 30 days
sudo find /backup/forgejo -maxdepth 1 -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true
```

**✓ Validation:**

```bash
df -h /
# The "Use%" column should now show acceptable usage (below 80% is a good target)

sudo journalctl --disk-usage
# Should show reduced journal size after vacuum
```

---

## §11 — Full system validation script

Run this to confirm the entire Ubuntu base is in the correct Forgejo-Mind state. Copy and
paste the whole block — it runs all checks in sequence and labels each result.

```bash
#!/usr/bin/env bash
# Ubuntu Refresh — Full Validation Script
# Run as your admin user (forgeadmin). Requires sudo.

PASS=0
FAIL=0

check() {
  local label="$1"
  local cmd="$2"
  local expected="$3"

  result=$(eval "$cmd" 2>/dev/null)
  if echo "$result" | grep -q "$expected"; then
    echo "  ✓  $label"
    ((PASS++))
  else
    echo "  ✗  $label"
    echo "     Expected to find: $expected"
    echo "     Got: $result" | head -3
    ((FAIL++))
  fi
}

echo "=== Ubuntu 24.04 LTS — Forgejo-Mind Validation ==="
echo ""

echo "--- OS and hostname ---"
check "Ubuntu 24.04 LTS"         "lsb_release -d"                        "Ubuntu 24.04"
check "Hostname is set"           "hostname"                               "."
check "Timezone is UTC"           "timedatectl | grep 'Time zone'"         "UTC"

echo ""
echo "--- Network ---"
check "Static IP is assigned"     "ip a | grep 'inet '"                    "192.168"
check "Default route exists"      "ip route show default"                  "default via"

echo ""
echo "--- Package state ---"
check "No pending upgrades"       "apt list --upgradable 2>/dev/null | grep -v '^Listing'" ""
check "curl is APT version"       "which curl"                             "/usr/bin/curl"
check "git is installed"          "which git"                              "/usr/bin/git"
check "jq is installed"           "which jq"                               "/usr/bin/jq"
check "ufw is installed"          "which ufw"                              "/usr/sbin/ufw"
check "fail2ban is installed"     "which fail2ban-client"                  "/usr/bin/fail2ban-client"

echo ""
echo "--- Security services ---"
check "UFW is active"             "sudo ufw status"                        "Status: active"
check "UFW default deny inbound"  "sudo ufw status verbose | grep Default" "deny (incoming)"
check "UFW allows SSH"            "sudo ufw status | grep -i ssh"          "ALLOW"
check "fail2ban is running"       "sudo fail2ban-client ping"              "pong"
check "fail2ban SSH jail active"  "sudo fail2ban-client status"            "sshd"

echo ""
echo "--- SSH hardening ---"
check "PermitRootLogin no"        "sudo sshd -T | grep permitrootlogin"    "permitrootlogin no"
check "PasswordAuth no"           "sudo sshd -T | grep passwordauth"       "passwordauthentication no"
check "PubkeyAuth yes"            "sudo sshd -T | grep pubkeyauth"         "pubkeyauthentication yes"
check "SSH service running"       "sudo systemctl is-active ssh"           "active"

echo ""
echo "--- System health ---"
check "No failed systemd units"   "sudo systemctl --failed --no-pager"     "0 loaded"
check "Unattended-upgrades active" "sudo systemctl is-active unattended-upgrades" "active"
check "Disk usage below 80%"      "df / | awk 'NR==2{print \$5}' | tr -d '%'" "[0-7][0-9]"

echo ""
echo "======================================"
echo "  PASSED: $PASS    FAILED: $FAIL"
echo "======================================"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "Fix the FAILED items above, then run this script again."
  echo "Each section of this guide has the repair commands for its check."
fi
```

---

## Quick unban / ban commands

```bash
# List currently banned IPs
sudo fail2ban-client status sshd | grep "Banned IP"

# Unban an IP immediately
sudo fail2ban-client set sshd unbanip <IP_ADDRESS>

# Manually ban an IP immediately
sudo fail2ban-client set sshd banip <IP_ADDRESS>

# Reload fail2ban configuration without restart (picks up jail.d changes)
sudo fail2ban-client reload
```

---

## Useful one-liners

```bash
# Show all open listening TCP ports and which process owns each one
sudo ss -tlnp

# Check whether a reboot is required after a kernel upgrade
cat /run/reboot-required 2>/dev/null || echo "No reboot required"

# Show disk usage for each top-level directory, sorted largest first
sudo du -h --max-depth=1 / 2>/dev/null | sort -rh | head -15

# Live-follow all system logs
sudo journalctl -f

# Show the last 50 lines of the SSH auth log (useful when debugging login failures)
sudo tail -50 /var/log/auth.log

# List all systemd services that have ever failed
sudo journalctl -p err -b --no-pager | tail -30

# Check UFW log for recent blocked connections
sudo tail -30 /var/log/ufw.log
```

---

## Related guides

| Guide | What it covers |
|-------|---------------|
| [Ubuntu Quick Start](ubuntu.md) | Fresh install from bare metal |
| [UFW Firewall](../install/02-ufw-firewall.md) | Full UFW documentation and advanced rules |
| [fail2ban](../install/03-fail2ban.md) | Full fail2ban documentation including Forgejo HTTP jail |
| [Forgejo-Mind Quick Start](forgejo-mind.md) | Full stack deployment (forge + runners + LLM) |
