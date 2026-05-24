# Forgejo Society: ubuntu-zombie

A jokingly named project for turning a fresh Ubuntu Desktop into a
workstation that a local AI Agent using cloud LLM can drive as root, 
without exposing anything to the public internet.

The goal is plain: a "Windows" user who wants to live on Ubuntu without
hand-rolling sysadmin work should be able to converse with an agent
that *is* the system administrator. The agent installs apps, edits
config, runs services, automates the GUI, drives a browser, and
explains what it did, all over a private Tailscale tunnel.

This is a candidate for minimum Ubuntu for Ubuntu R&D Requirements.

---

## Files

| File | Purpose |
| --- | --- |
| [`ai-full-control-ubuntu.sh`](ai-full-control-ubuntu.sh) | One-shot installer. Turns a fresh Ubuntu Desktop into an AI-admin-ready workstation. Most steps are idempotent (`apt_install`, the `id`-guarded `adduser`, `usermod -aG`, the `append_line_once` helper for `authorized_keys`, and the `cat >` drop-ins in `/etc/sudoers.d/`, `/etc/ssh/sshd_config.d/`, and `/etc/gdm3/`). Three steps re-prompt interactively on every run: the initial `Type YES` confirmation, the SSH public-key paste, the `x11vnc -storepasswd` password, and `tailscale up` if the device is not already authenticated. UFW is reset and re-applied on every run, so re-running after a transient failure is safe. |
| [`script-description.md`](script-description.md) | Short operator quick-reference for the installer. |

---

## Profile

The installer is written for one specific shape of machine:

- Local physical hardware (not a cloud VM).
- Intel CPU.
- No local GPU required — language work goes to a cloud LLM.
- Xorg desktop (Wayland disabled) so GUI automation actually works.
- Terminal **and** GUI **and** browser are all controllable by the
  agent.
- Tailscale is the only inbound network path. Nothing is public.
- SSH password authentication is disabled. SSH root login is
  disabled. Public-key authentication only, over Tailscale only.

If your machine does not match this profile, read
[`ai-full-control-ubuntu.sh`](ai-full-control-ubuntu.sh) before running
it and adjust.

---

## Prerequisites

- A fresh installation of Ubuntu Desktop (24.04 LTS recommended) on
  owned hardware, sitting at the physical console.
- An account on [tailscale.com](https://tailscale.com/) — free tier is
  fine — and a way to approve the new device.
- One SSH public key (e.g. `~/.ssh/id_ed25519.pub` from your laptop)
  pasted in when the installer asks for it. Without this, you will be
  locked out of SSH after the run completes; only the physical console
  will remain.
- At least one cloud LLM API key (OpenAI or Anthropic) to add to
  `/opt/ai-full-control/secrets/env` after the install.

---

## What the installer does

Run from the **physical** console of the Ubuntu machine:

```bash
chmod +x ai-full-control-ubuntu.sh
sudo ./ai-full-control-ubuntu.sh
```

In order, the script:

1. Confirms `sudo` (exits if `EUID` is not `0`), sources `/etc/os-release` and prints a warning if `ID` is not `ubuntu`, and asks you to type `YES` to continue.
2. Runs `apt update` and `apt upgrade -y`.
3. Installs base packages: `openssh-server`, `sudo`, common shell and
   network tooling, `ufw`, `fail2ban`, `unattended-upgrades`,
   `python3` + `pipx` + `venv`, `nodejs` + `npm`, `build-essential`,
   `ripgrep`, `fd-find`, `tree`, `rsync`, `cron`, `dbus-x11`,
   `dconf-cli`.
4. Installs the desktop and GUI-automation packages:
   `ubuntu-desktop-minimal`, `gdm3`, `xorg`, `x11vnc`, `xdotool`,
   `wmctrl`, `scrot`, `imagemagick`, `gnome-screenshot`, `xclip`,
   `xsel`, `xterm`, `at-spi2-core`, `x11-utils`, `python3-tk`.
5. Creates the `agent` user, adds it to `sudo`, and grants it
   `NOPASSWD: ALL` via a dedicated `/etc/sudoers.d/` drop-in. This is
   the identity the agent will operate under.
6. Asks for one SSH public key and writes it to
   `/home/agent/.ssh/authorized_keys` with correct permissions.
7. Drops `/etc/ssh/sshd_config.d/99-ai-full-control.conf` to disable
   root login, disable password authentication, allow only
   `AllowUsers agent`, and enable `X11Forwarding`. Restarts SSH.
8. Installs Tailscale via the upstream installer.
9. Resets UFW, sets default deny-inbound / allow-outbound, allows
   SSH **only on the `tailscale0` interface**, then enables UFW.
10. Enables `fail2ban` and `unattended-upgrades`.
11. Forces Xorg in GDM (`WaylandEnable=false`) and configures GDM
    autologin as `agent`. Sets `Session=ubuntu-xorg` for the user.
    Sets the default target to `graphical.target`.
12. Masks `sleep.target`, `suspend.target`, `hibernate.target`, and
    `hybrid-sleep.target` so the machine cannot drop the desktop the
    agent is driving. Disables the screensaver and idle lock via
    `gsettings` in a transient dbus session.
13. Creates `/opt/ai-full-control/{bin,logs,state,secrets,scripts,tools}`
    owned by `agent`, with `secrets/` at mode `0700`. Writes a
    placeholder `secrets/env` for cloud LLM keys.
14. Installs Docker Engine from the upstream Docker apt repository
    (`docker-ce`, `docker-ce-cli`, `containerd.io`,
    `docker-buildx-plugin`, `docker-compose-plugin`), adds `agent` to
    the `docker` group, and enables the service.
15. Creates a Python virtualenv at `/home/agent/agent-env` and
    installs the agent runtime: `openai`, `anthropic`, `requests`,
    `pydantic`, `rich`, `typer`, `python-dotenv`, `playwright`,
    `pyautogui`, `pillow`, `mss`, `opencv-python`, `python-xlib`.
    Then runs `playwright install --with-deps` to fetch Chromium and
    its system dependencies.
16. Upgrades `npm` and installs `yarn`, `pnpm`, `typescript`,
    `ts-node` globally.
17. Writes the GUI-control helper scripts into
    `/opt/ai-full-control/bin/` (see below).
18. Writes `tools/browser-test.py`, a 7-line Playwright smoke test
    that opens `example.com` and prints its title.
19. Asks you to set an x11vnc password (stored at
    `~agent/.vnc/passwd`) and writes a `~/.config/autostart/x11vnc.desktop`
    entry that runs `x11vnc -display :0 -forever -shared -localhost
    -rfbauth ... -rfbport 5900`. **Localhost-bound only**, never on
    the LAN or WAN.
20. Writes `/opt/ai-full-control/bin/verify`, the post-install
    verification script.
21. Runs `tailscale up --ssh=false` to print the device-auth URL.
    Approve the device in the Tailscale admin console.
22. Prints a final summary of what was installed and what to do next.

A reboot is required at the end.

---

## Control surfaces installed

| Surface | How the agent uses it |
| --- | --- |
| Shell | SSH (key-only, Tailscale-only) + `tmux` + `agent-shell` |
| OS | `apt`, `systemctl`, `journalctl`, file editing, `cron`, Docker |
| Desktop GUI | `xdotool`, `wmctrl`, `gnome-screenshot`, `scrot`, `xclip`, `xsel` |
| Browser | Playwright (Chromium) with system dependencies installed |
| Vision | `pillow`, `mss`, `opencv-python` for screen capture and analysis |
| Real desktop | `x11vnc` bound to `127.0.0.1:5900` only, reached via SSH tunnel |

Helper scripts under `/opt/ai-full-control/bin/`:

| Script | Purpose |
| --- | --- |
| `gui-env` | Sources `secrets/env` and exports `DISPLAY`, `XDG_RUNTIME_DIR`, and `DBUS_SESSION_BUS_ADDRESS` before exec-ing its arguments. |
| `screenshot [path]` | Saves a PNG of the current screen via `gnome-screenshot`. |
| `click X Y` | Moves the pointer and clicks via `xdotool`. |
| `type-text 'text'` | Types text into the focused window via `xdotool type`. |
| `key ctrl+l` | Sends a keysym/combo via `xdotool key`. |
| `agent-shell` | Sources `secrets/env`, `cd`s to `/opt/ai-full-control`, and enters a persistent `tmux` session named `ai-full-control`. |
| `verify` | Prints identity, sudo, SSH, UFW, Tailscale, Docker, X display, takes a screenshot, and runs the Python import smoke check. |

---

## After the installer finishes

```bash
# 1. Reboot the machine.
sudo reboot

# 2. From your laptop, over Tailscale only:
ssh agent@<tailscale-ip-or-name>

# 3. Run the verification script.
/opt/ai-full-control/bin/verify

# 4. Add cloud LLM keys.
nano /opt/ai-full-control/secrets/env

# 5. Start the persistent agent shell.
/opt/ai-full-control/bin/agent-shell
```

If you need the real desktop (e.g. to drive a stubborn GUI app), open
an SSH tunnel and connect a VNC viewer:

```bash
ssh -L 5900:localhost:5900 agent@<tailscale-ip-or-name>
# Then point a VNC viewer at localhost:5900
```

---

## Security posture

- **SSH:** key-only, root denied, `AllowUsers agent`, reachable only
  over the `tailscale0` interface.
- **UFW:** default deny inbound, default allow outbound, single allow
  rule for SSH on `tailscale0`.
- **VNC:** `x11vnc` is bound to `127.0.0.1` only. There is no UFW
  rule for it; the only way in is through an authenticated SSH
  tunnel.
- **Sudo:** `agent` has `NOPASSWD: ALL` so the AI can drive the
  machine non-interactively. This is the trade-off. Treat the SSH
  private key, the Tailscale account, and `secrets/env` as
  equivalently sensitive.
- **fail2ban** and **unattended-upgrades** are enabled.
- **Wayland is disabled** so GUI automation works reliably. Xorg has
  weaker isolation between apps; this is acceptable because the
  agent is the only user.

This is a **single-operator workstation** profile. Do not deploy it
as a shared host. Do not expose any port publicly. Do not weaken the
Tailscale-only rule.

---

## Undoing the install

There is no automated uninstaller. To revert:

1. `sudo ufw --force reset`
2. `sudo rm /etc/ssh/sshd_config.d/99-ai-full-control.conf && sudo systemctl restart ssh`
3. `sudo rm /etc/sudoers.d/90-agent-full-control`
4. `sudo deluser --remove-home agent`
5. `sudo rm -rf /opt/ai-full-control`
6. `sudo tailscale logout && sudo apt remove --purge tailscale`
7. `sudo rm /etc/apt/sources.list.d/docker.list /etc/apt/keyrings/docker.asc`
8. `sudo apt remove --purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`
9. Restore your previous GDM config in `/etc/gdm3/custom.conf`.

For a disposable host, reinstalling Ubuntu is usually faster.

---

## Example use

Once the install is finished, the keys are in place, and you are in
`agent-shell`, the workstation is driven by talking to the cloud LLM
the way you would talk to a junior sysadmin sitting at the keyboard.
For example:

> "I will call you Spock. Please install PostgreSQL (latest stable),
> create a role and database for me, and ensure it is managed moving
> forward."

A run like that uses the surfaces the installer provisioned:

- The conversation happens inside the `tmux` session
  `ai-full-control` started by `/opt/ai-full-control/bin/agent-shell`,
  so the transcript persists across SSH disconnects.
- The agent runs `apt-get update && apt-get install -y postgresql
  postgresql-contrib` non-interactively because `agent` has
  `NOPASSWD: ALL` sudo.
- The agent enables the service (`systemctl enable --now postgresql`)
  and confirms with `systemctl is-active postgresql`.
- The agent creates the role and database via `sudo -u postgres psql`
  and writes any generated credentials to a file under
  `/opt/ai-full-control/secrets/` with mode `0600`.
- "Managed moving forward" means the agent records what it did — a
  short note under `/opt/ai-full-control/state/` and the `tmux`
  scrollback — and re-uses `systemctl status postgresql` and the
  PostgreSQL log under `/var/log/postgresql/` whenever you ask about
  it later.

The same shape works for any other unit of work the operator wants
to delegate: installing a desktop app, configuring a service,
debugging a failing systemd unit, driving a GUI program through
`xdotool`, or running a browser flow through Playwright. The
operator stays in the conversation; the agent does the typing.

This is the workstation from which the operator then shepherds
Forgejo Society proper — the forge, the runner fleet, the agencies
described under [`../transition-plan/`](../transition-plan/00-overview.md).

---

## Relationship to the rest of Forgejo Society

This workstation is the operator's *hands*. It is the machine an
operator sits at — or remotes into via Tailscale — while shepherding a
Forgejo Society deployment. The forge itself and the runner fleet are
separate machines, described in
[`../transition-plan/00-overview.md`](../transition-plan/00-overview.md)
and
[`../transition-plan/09-runner-scale-strategy.md`](../transition-plan/09-runner-scale-strategy.md).
None of the agent code in this workstation executes against shared
Forgejo or against github.com infrastructure; the LLM calls go out to
the cloud provider you configure in `secrets/env`, and everything
else stays on the machine.
