# Ubuntu Zombie

> A fresh Ubuntu PC, prepared once at the physical console, then driven
> remotely by AI through Tailscale only. No public exposure.

This is the **minimum recommended install** for anyone who wants to turn
an Ubuntu machine into a host that an AI assistant can fully operate —
terminal, files, OS, Docker, GUI applications, browser — without
exposing the machine to the public internet.

You do not need to be a Linux expert to run it. You need to be willing
to sit in front of the machine once with a keyboard.

---

## What this gives you

After one run and a reboot:

| Surface | What the AI can do |
| --- | --- |
| Terminal | SSH in as a dedicated `agent` user with passwordless `sudo`, work inside a persistent `tmux` session |
| OS | Manage packages, services, files, logs, and Docker containers |
| Desktop (GUI) | Move the mouse, type, take screenshots, drive any application — via `xdotool` on a forced-Xorg session |
| Browser | Drive Chromium through Playwright |
| Network in | **Only** through your private Tailscale network. Nothing on the public internet can reach this host. |
| Network out | Standard outbound, used by the cloud LLM SDKs and `apt` |

The host is configured so it stays awake, never locks the screen, and
autologins the `agent` user so the X session is always available to
control.

---

## Trust model — read this first

This installer makes one deliberate trade-off so AI can do real work:

- The `agent` user has **passwordless `sudo`**.
- Whoever holds the SSH key for `agent` therefore holds full root on
  the host.
- The only protection against that key being abused is the **Tailscale
  network boundary** and **OpenSSH public-key auth** (no passwords, no
  root login, no other users allowed).

Decide before you run this that you are comfortable with that trade.
Treat the SSH private key the same way you would treat a root password.

This profile is **not** the Forgejo Society production runtime. The
production runtime is the self-hosted Forgejo described in the
[transition plan](../transition-plan/00-overview.md). This profile is a
controlled body that an agency can pilot for desktop and browser work.

---

## Before you start

You will need, sitting at the physical machine:

| Item | Detail |
| --- | --- |
| A fresh Ubuntu 24.04 LTS Desktop install | 22.04 LTS Desktop also works. Server-only installs are not the target — this script installs the desktop on top if needed. |
| A working internet connection | Wired is best. |
| A Tailscale account | Free personal plan is fine. Have your login ready. |
| One SSH public key | The key you will use to log in remotely. Bring it on a USB stick or in a password manager, ready to paste. Look for a line that starts with `ssh-ed25519` or `ssh-rsa`. |
| 20 minutes | Most of that is package downloads. |

---

## Run it

From the physical console of the Ubuntu machine, in a terminal:

```bash
chmod +x ai-full-control-ubuntu.sh
sudo ./ai-full-control-ubuntu.sh
```

The script will:

1. Show you a plan and wait for you to type `YES`.
2. Update the system and install everything it needs.
3. Ask for your SSH public key (paste the whole line).
4. Ask you to set a VNC password (this is only used over an SSH tunnel,
   never on the network).
5. Open a Tailscale login URL — open it on any device, sign in, approve
   the machine.

When it finishes:

```bash
sudo reboot
```

After the machine reboots it will autologin the `agent` user into an
Xorg desktop session. From any device on your Tailscale network:

```bash
ssh agent@<tailscale-name-or-ip>
/opt/ai-full-control/bin/verify
```

`verify` walks through every part of the install and prints a green or
red status for each. If anything is red, the message tells you exactly
what to do.

---

## Add your cloud LLM keys

```bash
sudoedit /opt/ai-full-control/secrets/env
```

Add lines such as:

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

This file is owned by the `agent` user and is mode `600`. The helper
scripts under `/opt/ai-full-control/bin/` source it automatically.

---

## Emergency desktop access

If you need to actually see the desktop (because something on screen is
blocking the AI), forward the loopback VNC port over your private SSH
session:

```bash
ssh -L 5900:localhost:5900 agent@<tailscale-name-or-ip>
```

Then point any VNC viewer at `localhost:5900` and use the VNC password
you set during install. VNC is bound to `127.0.0.1` on the host, so it
is **never** reachable directly over the network.

---

## What is installed

| Group | Packages |
| --- | --- |
| Base | `openssh-server`, `ufw`, `fail2ban`, `unattended-upgrades`, `tmux`, `git`, `curl`, `jq`, `ripgrep`, `fd-find`, `tree`, `htop`, `rsync` |
| Desktop & GUI control | `ubuntu-desktop-minimal`, `gdm3`, `xorg`, `x11vnc`, `xdotool`, `wmctrl`, `scrot`, `imagemagick`, `gnome-screenshot`, `xclip`, `xsel`, `at-spi2-core`, `x11-utils` |
| Runtime | `python3` + venv at `~agent/agent-env` with `openai`, `anthropic`, `playwright` (+ browsers), `pyautogui`, `pillow`, `mss`, `opencv-python`. Node + `typescript`, `ts-node`, `yarn`, `pnpm`. |
| Containers | `docker-ce` from Docker's official apt repository |
| Remote access | `tailscale` from Tailscale's official apt repository |

Helper scripts in `/opt/ai-full-control/bin/`:

| Script | What it does |
| --- | --- |
| `gui-env <cmd>` | Runs `<cmd>` with `DISPLAY`, `DBUS`, and `XDG_RUNTIME_DIR` set, and the secrets file sourced |
| `screenshot [path]` | Saves a PNG of the desktop (default: `/opt/ai-full-control/state/screen.png`) |
| `click X Y` | Moves the mouse to `(X,Y)` and clicks |
| `type-text "…"` | Types literal text into the focused window |
| `key ctrl+l` | Sends a keystroke (any `xdotool` key sequence) |
| `agent-shell` | Attaches to (or starts) a persistent `tmux` session called `ai-full-control` |
| `verify` | Runs the full post-install self-check |

---

## Re-running the installer

The script is safe to re-run. It will:

- Add to existing config rather than reset firewall state.
- Skip the SSH-key prompt if a key is already authorized for `agent`.
- Skip the VNC-password prompt if one is already stored.
- Skip the Tailscale auth step if the host is already logged in.

If you want to start from scratch, remove `/opt/ai-full-control/`,
`/etc/sudoers.d/90-agent-full-control`, and
`/etc/ssh/sshd_config.d/99-ai-full-control.conf`, then run again.

---

## Non-interactive install

For provisioning multiple identical hosts you can drive the installer
entirely from environment variables:

```bash
sudo AFC_NONINTERACTIVE=1 \
     SSH_PUBLIC_KEY="ssh-ed25519 AAAA... you@host" \
     VNC_PASSWORD="$(pwgen -s 24 1)" \
     TAILSCALE_AUTHKEY="tskey-auth-..." \
     ./ai-full-control-ubuntu.sh
```

`TAILSCALE_AUTHKEY` is optional. If it is omitted, the script will
print the interactive Tailscale login URL and continue; you can
approve the host afterwards.

---

## Public exposure summary

| Item | State |
| --- | --- |
| Inbound SSH on the public interface | Blocked by UFW |
| Inbound SSH on the Tailscale interface | Allowed, key-only |
| Inbound VNC anywhere | Bound to `127.0.0.1`, not reachable |
| Password SSH | Disabled |
| Root SSH | Disabled |
| Tailscale SSH | Disabled (we use OpenSSH only) |
| Unattended security upgrades | Enabled |
| UFW default policy | Deny inbound, allow outbound |

If any of these change after install, `verify` will tell you.
