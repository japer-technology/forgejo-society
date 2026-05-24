#!/usr/bin/env bash
set -euo pipefail

# AI Full Control Ubuntu
# Fresh Ubuntu Desktop -> novice-friendly AI-admin-ready workstation.
#
# Profile:
# - Local physical hardware
# - Intel CPU
# - No local GPU required
# - Cloud LLM primary
# - Xorg desktop control
# - Terminal + GUI + browser control
# - Tailscale-only remote ingress
# - No public exposure
#
# Run from the physical machine console:
#   chmod +x ai-full-control-ubuntu.sh
#   sudo ./ai-full-control-ubuntu.sh
#
# After reboot:
#   ssh agent@<tailscale-ip-or-hostname>
#   /opt/ai-full-control/bin/verify
#
# Emergency VNC over private SSH tunnel:
#   ssh -L 5900:localhost:5900 agent@<tailscale-ip-or-hostname>
#   Then connect a VNC viewer to localhost:5900

AGENT_USER="${AGENT_USER:-agent}"
AGENT_HOME="/home/${AGENT_USER}"
AFC_DIR="/opt/ai-full-control"
VNC_PORT="${VNC_PORT:-5900}"

die() {
  echo "ERROR: $*" >&2
  exit 1
}

section() {
  echo
  echo "============================================================"
  echo "$*"
  echo "============================================================"
}

need_root() {
  [[ "${EUID}" -eq 0 ]] || die "Run with sudo."
}

detect_ubuntu() {
  [[ -f /etc/os-release ]] || die "Cannot find /etc/os-release."
  . /etc/os-release
  [[ "${ID:-}" == "ubuntu" ]] || echo "WARNING: This is written for Ubuntu. Detected: ${PRETTY_NAME:-unknown}"
}

apt_install() {
  DEBIAN_FRONTEND=noninteractive apt install -y "$@"
}

append_line_once() {
  local line="$1"
  local file="$2"
  grep -qxF "$line" "$file" 2>/dev/null || echo "$line" >> "$file"
}

need_root
detect_ubuntu

section "AI Full Control Ubuntu installer"

echo "This installer will:"
echo "  - Create a full-control agent user"
echo "  - Enable SSH key-only access"
echo "  - Install Tailscale for private-only remote access"
echo "  - Deny public inbound access with UFW"
echo "  - Force Xorg instead of Wayland"
echo "  - Enable real desktop control through localhost-only x11vnc"
echo "  - Install GUI automation tools"
echo "  - Install browser automation through Playwright"
echo "  - Install Docker"
echo "  - Install Python/Node agent runtime tools"
echo
echo "Run this from the physical Ubuntu machine, not over public SSH."
echo

read -r -p "Continue? Type YES: " CONFIRM
[[ "${CONFIRM}" == "YES" ]] || die "Cancelled."

section "System update"

apt update
apt upgrade -y

section "Base packages"

apt_install \
  openssh-server \
  sudo \
  curl \
  wget \
  git \
  vim \
  nano \
  tmux \
  htop \
  unzip \
  zip \
  jq \
  net-tools \
  dnsutils \
  ca-certificates \
  gnupg \
  lsb-release \
  software-properties-common \
  ufw \
  fail2ban \
  unattended-upgrades \
  python3 \
  python3-pip \
  python3-venv \
  pipx \
  nodejs \
  npm \
  build-essential \
  ripgrep \
  fd-find \
  tree \
  rsync \
  cron \
  dbus-x11 \
  dconf-cli

section "Desktop, Xorg, and GUI-control packages"

apt_install \
  ubuntu-desktop-minimal \
  gdm3 \
  xorg \
  x11vnc \
  xdotool \
  wmctrl \
  scrot \
  imagemagick \
  gnome-screenshot \
  xclip \
  xsel \
  xterm \
  at-spi2-core \
  x11-utils

section "Create agent user"

if id "${AGENT_USER}" >/dev/null 2>&1; then
  echo "User ${AGENT_USER} already exists."
else
  adduser --gecos "" "${AGENT_USER}"
fi

usermod -aG sudo "${AGENT_USER}"

cat > "/etc/sudoers.d/90-${AGENT_USER}-full-control" <<EOF
${AGENT_USER} ALL=(ALL) NOPASSWD:ALL
EOF
chmod 440 "/etc/sudoers.d/90-${AGENT_USER}-full-control"

section "SSH key setup"

mkdir -p "${AGENT_HOME}/.ssh"
touch "${AGENT_HOME}/.ssh/authorized_keys"
chown -R "${AGENT_USER}:${AGENT_USER}" "${AGENT_HOME}/.ssh"
chmod 700 "${AGENT_HOME}/.ssh"
chmod 600 "${AGENT_HOME}/.ssh/authorized_keys"

echo "Paste the SSH public key that will be allowed to control this machine."
echo "Example: ssh-ed25519 AAAAC3... eric@mac"
echo "Leave blank only if you will add it manually later from the physical machine."
read -r -p "SSH public key: " SSH_PUBLIC_KEY || true

if [[ -n "${SSH_PUBLIC_KEY:-}" ]]; then
  append_line_once "${SSH_PUBLIC_KEY}" "${AGENT_HOME}/.ssh/authorized_keys"
fi

chown -R "${AGENT_USER}:${AGENT_USER}" "${AGENT_HOME}/.ssh"
chmod 700 "${AGENT_HOME}/.ssh"
chmod 600 "${AGENT_HOME}/.ssh/authorized_keys"

section "Harden SSH"

mkdir -p /etc/ssh/sshd_config.d

cat > /etc/ssh/sshd_config.d/99-ai-full-control.conf <<EOF
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
X11Forwarding yes
AllowUsers ${AGENT_USER}
EOF

systemctl enable --now ssh
systemctl restart ssh

section "Install Tailscale"

if ! command -v tailscale >/dev/null 2>&1; then
  curl -fsSL https://tailscale.com/install.sh | sh
else
  echo "Tailscale already installed."
fi

section "Firewall: never public"

ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# SSH only over Tailscale. This rule is interface-specific.
ufw allow in on tailscale0 to any port 22 proto tcp comment "SSH over Tailscale only"

# No direct LAN/WAN VNC rule. VNC binds to localhost only.
ufw --force enable

section "Security services"

systemctl enable --now fail2ban
systemctl enable --now unattended-upgrades || true

section "Force Xorg and autologin agent user"

mkdir -p /etc/gdm3

cat > /etc/gdm3/custom.conf <<EOF
[daemon]
WaylandEnable=false
AutomaticLoginEnable=true
AutomaticLogin=${AGENT_USER}
EOF

mkdir -p /var/lib/AccountsService/users

cat > "/var/lib/AccountsService/users/${AGENT_USER}" <<EOF
[User]
Session=ubuntu-xorg
XSession=ubuntu-xorg
SystemAccount=false
EOF

systemctl set-default graphical.target

section "Prevent sleep, suspend, and lockouts"

systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target || true

runuser -l "${AGENT_USER}" -c "dbus-run-session -- gsettings set org.gnome.desktop.session idle-delay 0" || true
runuser -l "${AGENT_USER}" -c "dbus-run-session -- gsettings set org.gnome.desktop.screensaver lock-enabled false" || true
runuser -l "${AGENT_USER}" -c "dbus-run-session -- gsettings set org.gnome.desktop.screensaver ubuntu-lock-on-suspend false" || true

section "Create AI Full Control workspace"

mkdir -p "${AFC_DIR}/"{bin,logs,state,secrets,scripts,tools}
chown -R "${AGENT_USER}:${AGENT_USER}" "${AFC_DIR}"
chmod 755 "${AFC_DIR}"
chmod 700 "${AFC_DIR}/secrets"

cat > "${AFC_DIR}/secrets/env" <<'EOF'
# Cloud LLM keys go here.
# Example:
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...

DISPLAY=:0
AFC_DIR=/opt/ai-full-control
AGENT_USER=agent
EOF

chown "${AGENT_USER}:${AGENT_USER}" "${AFC_DIR}/secrets/env"
chmod 600 "${AFC_DIR}/secrets/env"

section "Install Docker Engine"

for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do
  apt remove -y "$pkg" >/dev/null 2>&1 || true
done

install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc

chmod a+r /etc/apt/keyrings/docker.asc

. /etc/os-release
UBUNTU_CODENAME="${UBUNTU_CODENAME:-$VERSION_CODENAME}"

cat > /etc/apt/sources.list.d/docker.list <<EOF
deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${UBUNTU_CODENAME} stable
EOF

apt update

apt_install \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

usermod -aG docker "${AGENT_USER}"
systemctl enable --now docker

section "Python cloud-agent runtime"

runuser -l "${AGENT_USER}" -c "
set -e
python3 -m venv ~/agent-env
. ~/agent-env/bin/activate
pip install --upgrade pip wheel setuptools
pip install \
  openai \
  anthropic \
  requests \
  pydantic \
  rich \
  typer \
  python-dotenv \
  playwright \
  pyautogui \
  pillow \
  mss \
  opencv-python \
  python-xlib
python -m playwright install --with-deps
"

section "Node runtime"

npm install -g npm@latest || true
npm install -g yarn pnpm typescript ts-node || true

section "GUI control helper scripts"

cat > "${AFC_DIR}/bin/gui-env" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

if [[ -f /opt/ai-full-control/secrets/env ]]; then
  set -a
  source /opt/ai-full-control/secrets/env
  set +a
fi

export DISPLAY="${DISPLAY:-:0}"
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"
export DBUS_SESSION_BUS_ADDRESS="${DBUS_SESSION_BUS_ADDRESS:-unix:path=${XDG_RUNTIME_DIR}/bus}"

exec "$@"
EOF

cat > "${AFC_DIR}/bin/screenshot" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
OUT="${1:-/opt/ai-full-control/state/screen.png}"
/opt/ai-full-control/bin/gui-env gnome-screenshot -f "$OUT"
echo "$OUT"
EOF

cat > "${AFC_DIR}/bin/click" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
[[ $# -eq 2 ]] || { echo "Usage: click X Y"; exit 2; }
/opt/ai-full-control/bin/gui-env xdotool mousemove "$1" "$2" click 1
EOF

cat > "${AFC_DIR}/bin/type-text" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
[[ $# -ge 1 ]] || { echo "Usage: type-text 'text'"; exit 2; }
/opt/ai-full-control/bin/gui-env xdotool type --delay 10 "$*"
EOF

cat > "${AFC_DIR}/bin/key" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
[[ $# -ge 1 ]] || { echo "Usage: key ctrl+l"; exit 2; }
/opt/ai-full-control/bin/gui-env xdotool key "$@"
EOF

cat > "${AFC_DIR}/bin/agent-shell" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

if [[ -f /opt/ai-full-control/secrets/env ]]; then
  set -a
  source /opt/ai-full-control/secrets/env
  set +a
fi

cd /opt/ai-full-control
exec tmux new -A -s ai-full-control
EOF

chmod +x "${AFC_DIR}/bin/"*
chown -R "${AGENT_USER}:${AGENT_USER}" "${AFC_DIR}"

section "Browser automation test script"

cat > "${AFC_DIR}/tools/browser-test.py" <<'EOF'
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://example.com")
    print(page.title())
    browser.close()
EOF

chown "${AGENT_USER}:${AGENT_USER}" "${AFC_DIR}/tools/browser-test.py"

section "x11vnc localhost-only real desktop access"

runuser -l "${AGENT_USER}" -c "mkdir -p ~/.vnc ~/.config/autostart ~/.local/share"

echo
echo "Set a VNC password. This is for emergency physical-desktop access over an SSH tunnel only."
echo "VNC will bind to localhost, not public or LAN."
runuser -l "${AGENT_USER}" -c "x11vnc -storepasswd"

cat > "${AGENT_HOME}/.config/autostart/x11vnc.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=x11vnc Localhost Only
Exec=/usr/bin/x11vnc -display :0 -forever -shared -localhost -rfbauth ${AGENT_HOME}/.vnc/passwd -rfbport ${VNC_PORT} -o ${AGENT_HOME}/.local/share/x11vnc.log
X-GNOME-Autostart-enabled=true
EOF

chown -R "${AGENT_USER}:${AGENT_USER}" "${AGENT_HOME}/.config" "${AGENT_HOME}/.local" "${AGENT_HOME}/.vnc"

section "Verification script"

cat > "${AFC_DIR}/bin/verify" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

if [[ -f /opt/ai-full-control/secrets/env ]]; then
  set -a
  source /opt/ai-full-control/secrets/env
  set +a
fi

echo "== Identity =="
id
echo

echo "== Passwordless sudo =="
sudo -n true && echo "OK"
echo

echo "== SSH service =="
systemctl is-active ssh
echo

echo "== Firewall =="
sudo ufw status verbose
echo

echo "== Tailscale =="
if command -v tailscale >/dev/null 2>&1; then
  tailscale status || true
else
  echo "tailscale missing"
fi
echo

echo "== Docker =="
docker --version
docker compose version
echo

echo "== X display =="
echo "DISPLAY=${DISPLAY:-unset}"
if command -v xdotool >/dev/null 2>&1; then
  /opt/ai-full-control/bin/gui-env xdotool getdisplaygeometry || true
fi
echo

echo "== Screenshot =="
/opt/ai-full-control/bin/screenshot /opt/ai-full-control/state/screen.png || true
ls -lh /opt/ai-full-control/state/screen.png || true
echo

echo "== Python agent environment =="
source /home/agent/agent-env/bin/activate
python --version
python - <<'PY'
import openai
import anthropic
import requests
import pydantic
import rich
import typer
from playwright.sync_api import sync_playwright
print("Python packages: OK")
PY
echo

echo "== Browser automation =="
echo "Run this after desktop login/autologin:"
echo "  source ~/agent-env/bin/activate"
echo "  python /opt/ai-full-control/tools/browser-test.py"
echo

echo "Verification complete."
EOF

chmod +x "${AFC_DIR}/bin/verify"
chown "${AGENT_USER}:${AGENT_USER}" "${AFC_DIR}/bin/verify"

section "Tailscale authentication"

echo "Authenticate this machine into your private Tailscale network."
echo "This is the only intended remote ingress path."
echo

tailscale up --ssh=false || true

section "Final hardening reminder"

echo "Checking UFW state:"
ufw status verbose || true

echo
echo "Install complete."
echo
echo "Reboot now:"
echo "  sudo reboot"
echo
echo "After reboot:"
echo "  ssh ${AGENT_USER}@<tailscale-ip-or-name>"
echo "  /opt/ai-full-control/bin/verify"
echo
echo "Start persistent agent shell:"
echo "  /opt/ai-full-control/bin/agent-shell"
echo
echo "Add cloud LLM keys:"
echo "  nano /opt/ai-full-control/secrets/env"
echo
echo "Emergency VNC, still private:"
echo "  ssh -L 5900:localhost:5900 ${AGENT_USER}@<tailscale-ip-or-name>"
echo "  Connect VNC viewer to localhost:5900"
echo
echo "Installed control surfaces:"
echo "  Terminal: SSH + sudo + tmux"
echo "  OS: apt + systemctl + logs + files + Docker"
echo "  GUI: Xorg + xdotool + screenshot + x11vnc"
echo "  Browser: Playwright"
echo "  Network: Tailscale-only inbound"
echo
echo "Public exposure:"
echo "  SSH: Tailscale interface only"
echo "  VNC: localhost only"
echo "  Password SSH: disabled"
echo "  Root SSH: disabled"
echo "  UFW: deny inbound by default"
echo
echo "A reboot is required."
