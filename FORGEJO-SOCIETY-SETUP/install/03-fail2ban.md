# fail2ban

fail2ban is an intrusion-prevention daemon that monitors system log files for repeated authentication failures and automatically instructs the firewall to ban offending IP addresses for a configurable duration. In the Forgejo-Society stack, fail2ban is the second layer of SSH defence on every host — UFW limits which ports are reachable, and fail2ban ensures that any IP making repeated failed SSH login attempts is automatically banned before a brute-force attack can succeed. With the sshd jail configured to a 5-attempt threshold within 10 minutes and a 1-hour ban, automated credential-stuffing attacks are stopped long before they cause damage.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — fail2ban was installed as part of the essential packages in guide 01.
- [UFW Firewall](02-ufw-firewall.md) — fail2ban issues `ufw` ban commands by default on Ubuntu; UFW must be active for bans to take effect.

---

## Installation

fail2ban is already installed. Verify:

```bash
fail2ban-client --version
# Expected: Fail2Ban v1.0.x or later
```

If it is not installed:

```bash
sudo apt install -y fail2ban
```

### Understanding the Configuration Layout

fail2ban ships with a default configuration in `/etc/fail2ban/jail.conf`. This file is overwritten on package upgrades and must never be edited directly. Local overrides go in:

- `/etc/fail2ban/jail.d/` — drop-in jail configuration files (one per jail or logical group)
- `/etc/fail2ban/filter.d/` — custom filter patterns
- `/etc/fail2ban/action.d/` — custom action definitions

The convention is to create a file per jail in `/etc/fail2ban/jail.d/` that overrides only the settings you need.

### Create the SSH Jail Configuration

The following drop-in file enables the sshd jail with conservative but effective settings:

```bash
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

**Parameter explanations:**

| Parameter | Value | Meaning |
|-----------|-------|---------|
| `enabled` | `true` | Activate this jail |
| `port` | `ssh` | Monitor the SSH port (22) |
| `filter` | `sshd` | Use the built-in sshd filter pattern |
| `backend` | `systemd` | Read logs from the systemd journal (Ubuntu 24.04 default) |
| `logpath` | `/var/log/auth.log` | Also watch the traditional log file as a fallback |
| `maxretry` | `5` | Ban after 5 failures |
| `findtime` | `10m` | Count failures within a 10-minute window |
| `bantime` | `1h` | Ban for 1 hour |
| `ignoreip` | local and subnet | Never ban localhost or hosts on the management subnet |

### Enable and Start fail2ban

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
sudo systemctl status fail2ban
```

### Verify the Jail is Active

```bash
sudo fail2ban-client status
# Expected output includes:
# Number of jail: 1
# Jail list: sshd

sudo fail2ban-client status sshd
# Expected: shows the sshd jail with Currently banned count and IP list
```

### Viewing Banned IPs

```bash
# List currently banned IPs in the sshd jail
sudo fail2ban-client status sshd | grep "Banned IP"

# Or query iptables/UFW directly
sudo iptables -L f2b-sshd -n --line-numbers
```

### Manually Unbanning an IP

If a legitimate user gets banned (e.g., after too many typos), unban them immediately:

```bash
# Replace 203.0.113.45 with the actual IP address
sudo fail2ban-client set sshd unbanip 203.0.113.45
```

### Manually Banning an IP

To proactively ban a known-bad IP:

```bash
sudo fail2ban-client set sshd banip 203.0.113.45
```

---

## Validation

Run every check below to confirm fail2ban is correctly configured and active.

- [ ] **fail2ban service is running**

```bash
sudo systemctl status fail2ban
# Expected: active (running)
```

- [ ] **fail2ban client connects to the daemon**

```bash
sudo fail2ban-client ping
# Expected: Server replied: pong
```

- [ ] **fail2ban reports the expected jails**

```bash
sudo fail2ban-client status
# Expected:
# Number of jail: 1
# Jail list:   sshd
```

- [ ] **sshd jail is enabled and has zero or more bans**

```bash
sudo fail2ban-client status sshd
# Expected output:
# Status for the jail: sshd
# |- Filter
# |  |- Currently failed: 0
# |  |- Total failed:     0
# |  `- File list:        /var/log/auth.log
# `- Actions
#    |- Currently banned: 0
#    |- Total banned:     0
#    `- Banned IP list:
```

- [ ] **Configuration drop-in file is present and readable**

```bash
cat /etc/fail2ban/jail.d/ssh.conf
# Should show the sshd jail configuration created above
```

- [ ] **fail2ban socket exists**

```bash
ls -la /var/run/fail2ban/fail2ban.sock
# Should exist and be a socket file
```

---

## Deinstallation

```bash
# Step 1: Stop the service — this unbans all currently banned IPs
sudo systemctl stop fail2ban

# Step 2: Disable automatic startup
sudo systemctl disable fail2ban

# Step 3: Remove the package and its default configuration files
sudo apt remove --purge fail2ban
sudo apt autoremove -y

# Step 4: Remove the local SSH jail configuration we created
sudo rm -f /etc/fail2ban/jail.d/ssh.conf

# Step 5: Remove any remaining configuration directories
sudo rm -rf /etc/fail2ban/jail.d

# Step 6: Confirm the service is gone
systemctl status fail2ban
# Expected: Unit fail2ban.service could not be found.
```

> **Note:** Stopping fail2ban automatically releases all bans from UFW/iptables. The hosts that were banned will be able to connect again immediately after the service stops.

---

## Continuity Controls

- **Extend to Forgejo HTTP failures:** After Forgejo is installed, add a `/etc/fail2ban/jail.d/forgejo.conf` jail using the forgejo filter to ban IPs that trigger repeated HTTP 401 responses from the Forgejo web interface.
- **Log monitoring:** Review `/var/log/fail2ban.log` weekly for ban activity. A high ban count from a small number of source IPs warrants investigation.
- **Ban duration tuning:** For production forge servers with known-good operator IPs, increase `bantime` to `24h` or `1w` after initial deployment to make brute-force campaigns impractical.
- **recidive jail:** Consider adding a `[recidive]` jail that permanently bans IPs that get banned multiple times over a long period. See `/etc/fail2ban/jail.conf` for the default recidive stanza.
- **After OS reinstall:** fail2ban must be reinstalled and reconfigured from this guide. The `ignoreip` list should include all operator workstation IPs to prevent accidental self-lockout during setup.
