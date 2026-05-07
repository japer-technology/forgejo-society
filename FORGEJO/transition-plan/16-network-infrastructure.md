# Network Infrastructure — Fixed IPs, Local DNS, and SSH Control

Running 20 machines as a unified forge requires three things before any software is
installed: every host must have a fixed IP address, every fixed IP must have a name
that the whole network can resolve, and one operator seat must be able to reach every
host over SSH without a keyboard or monitor on the target machine.

This document covers all three in order. Complete this guide **before** starting
[01 — Ubuntu foundation](01-ubuntu-foundation.md) on any runner or server node.

---

## Host inventory

Assign a role to every machine before configuring the router. The table below is the
authoritative host inventory. Fill in the MAC address and chosen IP from your router's
admin panel when you work through Phase 1.

| Hostname | Role | Fixed IP | MAC address |
|---|---|---|---|
| `forge` | Primary Forgejo server (i9 20-core · 64 GB · 2 TB NVMe) | `192.168.1.10` | — |
| `llm` | LLM inference server (i9 32-core · 64 GB · RTX 4090) | `192.168.1.11` | — |
| `runner-01` … `runner-16` | Forgejo runner fleet (i7 8-core · 8 GB · 60 GB SSD) | `192.168.1.20` … `192.168.1.35` | — |
| `workstation-01` | Developer workstation | `192.168.1.50` | — |
| `workstation-02` | Developer workstation | `192.168.1.51` | — |

All addresses are on the `192.168.1.0/24` subnet with gateway `192.168.1.1`. Adjust
to match your router's subnet if it differs.

---

## Phase 1 — Router DHCP reservations (fixed IPs)

Most home and office routers assign IPs by binding a static lease to a device's MAC
address. This is called a DHCP reservation, a DHCP static binding, or a manual
assignment depending on the router brand. The result is identical to a true static
IP on the host but requires no configuration on each individual machine: whenever a
host reboots and requests a new lease, the router always hands it the same address.

### 1.1 Find the MAC address of every host

Run this on each host (or read the label on the NIC/motherboard):

```bash
ip link show
```

The MAC address is the `link/ether` value, for example `b8:27:eb:4a:2c:d1`. Record
it in the host inventory table above.

Alternatively, if the machine has not been set up yet, read the MAC from the BIOS
setup screen or from the physical label on the network card.

### 1.2 Create a DHCP reservation in the router

The exact steps vary by router brand, but the logic is the same everywhere.

**Common home router (TP-Link / ASUS / Netgear / Linksys):**

1. Open the router admin panel — typically `http://192.168.1.1` in a browser.
2. Find **DHCP** → **Address Reservation** (or **Static Lease**, or **Manual
   Assignment**).
3. Click **Add** and enter:
   - **MAC address:** the value from step 1.1
   - **IP address:** the fixed IP from the host inventory table
   - **Hostname:** the short hostname (e.g. `runner-01`)
4. Save and repeat for every machine.
5. Reboot each host, or renew its lease, and confirm the correct IP:

```bash
ip addr show eth0   # substitute your interface name
```

### 1.3 Disable automatic IP assignment for managed hosts (recommended)

Once all reservations are confirmed, narrow the DHCP pool so the router only
auto-assigns addresses in a small range for unknown guests. For example, set the
dynamic pool to `192.168.1.100–192.168.1.200` and leave `192.168.1.1–99` reserved
for managed hosts.

### 1.4 Validation checklist — Phase 1

- [ ] MAC address recorded for every host
- [ ] DHCP reservation created in the router for every host
- [ ] Every host rebooted; each shows the correct fixed IP via `ip addr`
- [ ] No two hosts share the same IP
- [ ] Dynamic DHCP pool narrowed to a guest-only range

---

## Phase 2 — Local DNS

Fixed IPs are stable but not memorable. A local DNS layer lets you type
`ssh forge` or `git clone git@forge:org/repo.git` instead of raw IP addresses.

There are two approaches. Choose the one that matches your router's capability.

### Option A — Router-based DNS (recommended if your router supports it)

Many routers automatically advertise hostnames from their DHCP reservation table.
Check your router admin panel for a field called **Local DNS**, **LAN hostname**,
or **DHCP hostname broadcast**. If it exists:

1. Ensure each DHCP reservation has the short hostname filled in (e.g. `runner-01`).
2. Set your router's DHCP advertised domain suffix to your local domain (e.g.
   `forge.local` or `home.arpa`). This is usually under **LAN** → **DHCP Server** →
   **Domain name**.
3. Every host on the network will now resolve `runner-01.forge.local` automatically.

Verify from any host:

```bash
ping -c 2 forge.forge.local
ping -c 2 runner-01.forge.local
```

### Option B — dnsmasq on the forge server (full control)

If your router cannot serve local DNS, run **dnsmasq** on the forge server. dnsmasq
is a lightweight DNS and DHCP server that reads a plain text host file and broadcasts
names to the whole network.

#### 2.1 Install dnsmasq

```bash
sudo apt install -y dnsmasq
```

#### 2.2 Write the host file

Create `/etc/dnsmasq.d/forge-hosts.conf`:

```conf
# Forge-Mind local DNS — one line per host
# Format: address=/<hostname>.<domain>/<IP>

address=/forge.forge.local/192.168.1.10
address=/llm.forge.local/192.168.1.11
address=/runner-01.forge.local/192.168.1.20
address=/runner-02.forge.local/192.168.1.21
address=/runner-03.forge.local/192.168.1.22
address=/runner-04.forge.local/192.168.1.23
address=/runner-05.forge.local/192.168.1.24
address=/runner-06.forge.local/192.168.1.25
address=/runner-07.forge.local/192.168.1.26
address=/runner-08.forge.local/192.168.1.27
address=/runner-09.forge.local/192.168.1.28
address=/runner-10.forge.local/192.168.1.29
address=/runner-11.forge.local/192.168.1.30
address=/runner-12.forge.local/192.168.1.31
address=/runner-13.forge.local/192.168.1.32
address=/runner-14.forge.local/192.168.1.33
address=/runner-15.forge.local/192.168.1.34
address=/runner-16.forge.local/192.168.1.35
address=/workstation-01.forge.local/192.168.1.50
address=/workstation-02.forge.local/192.168.1.51
```

Adjust IPs to match your inventory. Add or remove lines as needed.

#### 2.3 Configure dnsmasq

Edit `/etc/dnsmasq.conf` (or create `/etc/dnsmasq.d/forge-main.conf`):

```conf
# Listen on the local network interface only
interface=eth0              # replace with your LAN interface name
bind-interfaces

# Local domain
local=/forge.local/
domain=forge.local
expand-hosts

# Do not read /etc/hosts for the forge.local domain
no-hosts

# Forward non-local queries to your ISP or a public resolver
server=1.1.1.1
server=8.8.8.8

# Cache size
cache-size=1000
```

#### 2.4 Advertise the dnsmasq server via DHCP

Point the router's DHCP DNS setting at the forge server's IP so every host on the
network automatically uses dnsmasq for name resolution.

In the router admin panel, find **DHCP** → **DNS Server** (or **Primary DNS**) and
set it to `192.168.1.10` (the forge server's fixed IP).

#### 2.5 Start and enable dnsmasq

```bash
sudo systemctl enable --now dnsmasq
sudo systemctl status dnsmasq
```

#### 2.6 Test resolution

From any host on the network:

```bash
dig runner-05.forge.local @192.168.1.10
ping -c 2 forge.forge.local
```

### 2.7 Validation checklist — Phase 2

- [ ] All 20 hostnames resolve correctly from the forge server
- [ ] All 20 hostnames resolve correctly from a workstation
- [ ] `ping forge.forge.local` and `ping runner-01.forge.local` both succeed
- [ ] External domain resolution (e.g. `ping google.com`) still works
- [ ] dnsmasq service is enabled and set to start on boot (if Option B)

---

## Phase 3 — SSH infrastructure and centralised control

With fixed IPs and DNS in place, set up SSH so that one operator seat (any workstation
or the forge server itself) can reach every machine without a password, without a
keyboard attached to the target, and without typing the full IP address.

### 3.1 Generate the operator key pair

Run this once on your primary operator workstation (or the forge server if that is your
control seat). Do not reuse the same key across different operators.

```bash
# Ed25519 is the recommended algorithm — fast, small key, strong
ssh-keygen -t ed25519 -C "operator@forge-mind" -f ~/.ssh/forge_operator

# Confirm the key pair exists
ls -la ~/.ssh/forge_operator*
```

Keep `~/.ssh/forge_operator` (private key) on the operator machine only. Never copy
the private key to any runner node or server.

### 3.2 Create a shared deploy user on every host

Create a dedicated non-root admin user on every host so operator access does not use
the installation account.

```bash
# Run on each target host, or automate with the loop in 3.4
sudo adduser --disabled-password --gecos "Forge Operator" forge-op
sudo usermod -aG sudo forge-op
```

### 3.3 Distribute the operator public key to every host

From the operator workstation:

```bash
# Replace the hostname list with your full inventory
HOSTS=(
  forge.forge.local
  llm.forge.local
  runner-01.forge.local
  runner-02.forge.local
  runner-03.forge.local
  runner-04.forge.local
  runner-05.forge.local
  runner-06.forge.local
  runner-07.forge.local
  runner-08.forge.local
  runner-09.forge.local
  runner-10.forge.local
  runner-11.forge.local
  runner-12.forge.local
  runner-13.forge.local
  runner-14.forge.local
  runner-15.forge.local
  runner-16.forge.local
  workstation-01.forge.local
  workstation-02.forge.local
)

for HOST in "${HOSTS[@]}"; do
  echo "→ Copying key to $HOST"
  ssh-copy-id -i ~/.ssh/forge_operator.pub forge-op@"$HOST"
done
```

You will be prompted for a password on the first connection to each host. After this
step completes, no further password prompts occur.

### 3.4 Configure the SSH client

Write `~/.ssh/config` on the operator workstation so short hostnames work and the
correct key is used automatically:

```sshconfig
# Forge-Mind — default settings for all managed hosts
Host *.forge.local
    User forge-op
    IdentityFile ~/.ssh/forge_operator
    IdentitiesOnly yes
    ServerAliveInterval 60
    ServerAliveCountMax 3
    StrictHostKeyChecking accept-new

# Short-name aliases so you can type: ssh forge
Host forge
    HostName forge.forge.local

Host llm
    HostName llm.forge.local

Host runner-01
    HostName runner-01.forge.local

Host runner-02
    HostName runner-02.forge.local

Host runner-03
    HostName runner-03.forge.local

Host runner-04
    HostName runner-04.forge.local

Host runner-05
    HostName runner-05.forge.local

Host runner-06
    HostName runner-06.forge.local

Host runner-07
    HostName runner-07.forge.local

Host runner-08
    HostName runner-08.forge.local

Host runner-09
    HostName runner-09.forge.local

Host runner-10
    HostName runner-10.forge.local

Host runner-11
    HostName runner-11.forge.local

Host runner-12
    HostName runner-12.forge.local

Host runner-13
    HostName runner-13.forge.local

Host runner-14
    HostName runner-14.forge.local

Host runner-15
    HostName runner-15.forge.local

Host runner-16
    HostName runner-16.forge.local

Host ws-01
    HostName workstation-01.forge.local

Host ws-02
    HostName workstation-02.forge.local
```

Test each alias:

```bash
ssh forge uptime
ssh runner-01 uptime
ssh llm uptime
```

### 3.5 Disable password authentication on all hosts

Once key-based login is confirmed, disable password SSH on every host to close the
brute-force attack surface.

```bash
# Run on each host (or use the loop below)
sudo sed -i \
  -e 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' \
  -e 's/^#\?ChallengeResponseAuthentication.*/ChallengeResponseAuthentication no/' \
  /etc/ssh/sshd_config

sudo systemctl reload sshd
```

Or run it across the whole fleet from the operator workstation in one step:

```bash
for HOST in "${HOSTS[@]}"; do
  echo "→ Hardening SSH on $HOST"
  ssh forge-op@"$HOST" '
    sudo sed -i \
      -e "s/^#\?PasswordAuthentication.*/PasswordAuthentication no/" \
      -e "s/^#\?ChallengeResponseAuthentication.*/ChallengeResponseAuthentication no/" \
      /etc/ssh/sshd_config
    sudo systemctl reload sshd
  '
done
```

### 3.6 Fan-out commands with parallel-ssh

**parallel-ssh** (`pssh`) lets you run a single command on multiple hosts simultaneously
and collect all output in one terminal. Install it once on the operator workstation:

```bash
sudo apt install -y pssh
```

Write a host file at `~/forge-hosts.txt`:

```
forge.forge.local
llm.forge.local
runner-01.forge.local
runner-02.forge.local
runner-03.forge.local
runner-04.forge.local
runner-05.forge.local
runner-06.forge.local
runner-07.forge.local
runner-08.forge.local
runner-09.forge.local
runner-10.forge.local
runner-11.forge.local
runner-12.forge.local
runner-13.forge.local
runner-14.forge.local
runner-15.forge.local
runner-16.forge.local
workstation-01.forge.local
workstation-02.forge.local
```

Run a command on every host at once:

```bash
# Check uptime on all 20 machines in parallel
parallel-ssh -h ~/forge-hosts.txt -l forge-op -i uptime

# Check disk space on all runner nodes
parallel-ssh -h ~/forge-hosts.txt -l forge-op -i df -h /
```

### 3.7 Install tmux for multi-pane operator sessions

For interactive work across several machines at once, **tmux** lets you split one
terminal into a grid of SSH sessions.

```bash
sudo apt install -y tmux
```

A minimal `~/.tmux.conf` for the operator workstation:

```conf
# Set prefix to Ctrl-a (easier to type than Ctrl-b)
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# Mouse support — click to select panes and resize
set -g mouse on

# Synchronize input to all panes: Ctrl-a + S
bind S setw synchronize-panes \; display "Sync: #{?pane_synchronized,ON,OFF}"

# Status bar
set -g status-right " #H | %H:%M "
```

Open a runner monitoring session:

```bash
tmux new-session -s runners

# In tmux: split into a 4x4 grid, one pane per runner node
# Then enable synchronize-panes (Ctrl-a S) to type in all 16 at once
```

### 3.8 Validation checklist — Phase 3

- [ ] Operator key pair generated on the operator workstation
- [ ] `forge-op` user created on every host
- [ ] Public key copied to all 20 hosts via `ssh-copy-id`
- [ ] `~/.ssh/config` written with short-name aliases for all hosts
- [ ] `ssh forge uptime` works without a password prompt
- [ ] `ssh runner-01 uptime` through `ssh runner-16 uptime` all work without prompts
- [ ] Password authentication disabled on all hosts
- [ ] `parallel-ssh` installed and tested with `uptime` across all hosts
- [ ] `~/forge-hosts.txt` contains all 20 hostnames
- [ ] No target machine requires a keyboard or monitor to be administered

---

## Phase 4 — Keeping the network map up to date

As machines are added, renamed, or retired, update these three files in order:

| File | What to update |
|---|---|
| Router DHCP reservations | Add or remove the MAC → IP binding |
| `/etc/dnsmasq.d/forge-hosts.conf` (if using Option B) | Add or remove the `address=` line |
| `~/.ssh/config` (operator workstation) | Add or remove the `Host` alias block |
| `~/forge-hosts.txt` (operator workstation) | Add or remove the hostname line |
| This document (host inventory table) | Update the row and commit the change |

Commit every change to this document so the host inventory table stays in sync with
the live network.
