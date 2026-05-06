# Forgejo Runner (act_runner)

The Forgejo Runner (also known as `act_runner`) is the CI/CD execution agent that listens for workflow jobs dispatched by the Forgejo forge and runs them in isolated Docker containers. In the Forgejo-Mind stack, all 16 runner nodes each run a single `forgejo-runner` process that connects outbound to the forge server, polls for queued jobs, and executes them in Docker containers — one container per job step. The runner registers itself with the forge using a one-time registration token and thereafter maintains a persistent polling connection. Each runner is configured with a capacity of 4 concurrent jobs, matching the 8-core CPU profile of the runner hardware.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — host OS must be fully configured.
- [Docker Engine](04-docker-engine.md) — Docker must be installed and running; the runner executes jobs inside Docker containers.
- [Forgejo](09-forgejo.md) — the forge must be running and accessible to generate a runner registration token.

---

## Installation

### 1. Download the Forgejo Runner Binary

Check https://forgejo.org/releases/ for the current stable act_runner release. Replace the version number as appropriate.

```bash
RUNNER_VERSION="6.3.1"
RUNNER_URL="https://code.forgejo.org/forgejo/runner/releases/download/v${RUNNER_VERSION}/forgejo-runner-${RUNNER_VERSION}-linux-amd64"
RUNNER_SHA_URL="${RUNNER_URL}.sha256"

# Download the binary and checksum
wget -O /tmp/forgejo-runner "${RUNNER_URL}"
wget -O /tmp/forgejo-runner.sha256 "${RUNNER_SHA_URL}"

# Verify the checksum
cd /tmp
sha256sum --check forgejo-runner.sha256
# Expected: forgejo-runner-x.x.x-linux-amd64: OK

# Install the binary
sudo install -m 755 /tmp/forgejo-runner /usr/local/bin/forgejo-runner

# Confirm
forgejo-runner --version
# Expected: forgejo-runner version x.x.x ...
```

### 2. Create the forgejo-runner System User

```bash
sudo adduser \
  --system \
  --group \
  --no-create-home \
  --shell /bin/bash \
  --comment "Forgejo Runner service account" \
  forgejo-runner

# Add to the docker group so the runner can manage containers
sudo usermod -aG docker forgejo-runner

# Verify
id forgejo-runner
# Expected: uid=NNN(forgejo-runner) gid=NNN(forgejo-runner) groups=NNN(forgejo-runner),NNN(docker)
```

### 3. Create the Runner Working Directory

```bash
sudo mkdir -p /var/lib/forgejo-runner
sudo chown -R forgejo-runner:forgejo-runner /var/lib/forgejo-runner
sudo chmod 750 /var/lib/forgejo-runner
```

### 4. Generate a Runner Registration Token

Log in to the Forgejo web UI as a site administrator:

1. Click your avatar → **Site Administration** → **Actions** → **Runners**
2. Click **Create new runner**
3. Copy the displayed registration token — it is shown only once

Alternatively, use the admin API with a personal access token:

```bash
FORGEJO_TOKEN="YOUR_ADMIN_API_TOKEN"
FORGEJO_URL="https://git.yourdomain.com"

curl -s -X POST "${FORGEJO_URL}/api/v1/admin/runners/registration-token" \
  -H "Authorization: token ${FORGEJO_TOKEN}" \
  -H "Content-Type: application/json" \
  | jq -r '.token'
# Save this token — it is used in the registration step below
```

### 5. Register the Runner

Run the registration command as the `forgejo-runner` user. This creates a `.runner` credentials file in the working directory.

```bash
sudo -u forgejo-runner forgejo-runner register \
  --no-interactive \
  --instance-url "https://git.yourdomain.com" \
  --token "YOUR_REGISTRATION_TOKEN" \
  --name "$(hostname)" \
  --labels "docker,ubuntu-24.04,linux" \
  --working-directory /var/lib/forgejo-runner
```

The registration creates `/var/lib/forgejo-runner/.runner` — confirm it exists:

```bash
sudo ls -la /var/lib/forgejo-runner/.runner
# Expected: .runner file owned by forgejo-runner
```

### 6. Create the Runner Configuration File

The configuration file controls concurrency, timeouts, Docker network settings, and caching:

```bash
sudo -u forgejo-runner tee /var/lib/forgejo-runner/config.yaml > /dev/null <<'EOF'
# Forgejo Runner configuration
# Hardware: i7 8-core @ 3 GHz, 8 GB RAM, 60 GB SSD

log:
  level: info

runner:
  # Maximum number of concurrent jobs (4 = half the core count, leaves headroom for the OS)
  capacity: 4
  # Directory for runner state and job workspaces
  working_directory: /var/lib/forgejo-runner/runner
  # Timeout for a single job
  timeout: 3h
  # Labels this runner accepts (must match the workflow runs-on value)
  labels:
    - "docker:docker://node:20-bookworm"
    - "ubuntu-24.04:docker://catthehacker/ubuntu:act-24.04"

cache:
  enabled: true
  # Cache directory on the host
  dir: /var/lib/forgejo-runner/cache

container:
  # Use the bridge network so containers can reach the internet
  network: bridge
  # Automatically remove containers when they finish
  auto_remove: true
  # Mount the Docker socket into containers that need Docker-in-Docker
  docker_host: ""
  # Valid Docker images to use as job environments
  valid_volumes: []
  options: ""

host:
  # Working directory inside the container
  workdir_parent: /workspace
EOF
```

Create the cache and runner workspace directories:

```bash
sudo mkdir -p /var/lib/forgejo-runner/{runner,cache}
sudo chown -R forgejo-runner:forgejo-runner /var/lib/forgejo-runner
```

### 7. Create the systemd Service

```bash
sudo tee /etc/systemd/system/forgejo-runner.service > /dev/null <<'EOF'
[Unit]
Description=Forgejo Actions Runner
After=network.target
After=docker.service
Requires=docker.service

[Service]
Type=simple
User=forgejo-runner
Group=forgejo-runner
WorkingDirectory=/var/lib/forgejo-runner
ExecStart=/usr/local/bin/forgejo-runner daemon \
  --config /var/lib/forgejo-runner/config.yaml
Restart=always
RestartSec=5s
Environment=HOME=/var/lib/forgejo-runner
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable forgejo-runner
sudo systemctl start forgejo-runner
sudo systemctl status forgejo-runner
```

### 8. Repeat for All 16 Runner Nodes

Repeat steps 1–7 on each of the 16 runner nodes. Each node requires its own registration token. Generate a new token for each node from the Forgejo admin UI or API. Use the hostname as the runner name (`--name "$(hostname)"`) to distinguish them in the Forgejo UI.

---

## Validation

- [ ] **forgejo-runner binary is installed**

```bash
forgejo-runner --version
# Expected: forgejo-runner version x.x.x
```

- [ ] **forgejo-runner service is active**

```bash
sudo systemctl status forgejo-runner
# Expected: active (running)
```

- [ ] **Runner appears as Online in Forgejo**

Log in to Forgejo web UI → Site Administration → Actions → Runners. The runner for this node should appear with a green "Online" status badge.

- [ ] **Runner log shows it is connected**

```bash
sudo journalctl -u forgejo-runner -n 50 --no-pager
# Expected: lines like "runner: connect to server" and no persistent errors
```

- [ ] **Run a test workflow**

Create a repository in Forgejo and push a workflow file:

```bash
mkdir test-ci && cd test-ci
git init && git remote add origin git@git.yourdomain.com:YOURORG/test-ci.git

mkdir -p .forgejo/workflows
cat > .forgejo/workflows/ci.yml <<'WORKFLOW'
name: hello-world
on: [push]
jobs:
  hello:
    runs-on: docker
    container:
      image: alpine:latest
    steps:
      - name: Say hello
        run: echo "Hello from Forgejo Runner on $(hostname)"
WORKFLOW

git add .
git commit -m "ci: add hello-world workflow"
git push -u origin main
```

Navigate to the repository in Forgejo → Actions tab → confirm the workflow run appears and completes with a green check.

---

## Deinstallation

```bash
# Step 1: Stop and disable the service
sudo systemctl stop forgejo-runner
sudo systemctl disable forgejo-runner

# Step 2: Remove the binary
sudo rm -f /usr/local/bin/forgejo-runner

# Step 3: Remove the systemd service
sudo rm -f /etc/systemd/system/forgejo-runner.service
sudo systemctl daemon-reload

# Step 4: Remove all runner data (job workspaces, cache, credentials)
sudo rm -rf /var/lib/forgejo-runner

# Step 5: Remove the forgejo-runner OS user
sudo userdel -r forgejo-runner 2>/dev/null || true

# Step 6: Deregister the runner from Forgejo
# In the Forgejo web UI: Site Admin → Actions → Runners → find this runner → Delete
# Or via API:
RUNNER_ID="THE_RUNNER_ID_FROM_FORGEJO_UI"
curl -X DELETE "https://git.yourdomain.com/api/v1/admin/runners/${RUNNER_ID}" \
  -H "Authorization: token YOUR_ADMIN_API_TOKEN"

# Step 7: Confirm the service is gone
systemctl status forgejo-runner
# Expected: Unit forgejo-runner.service could not be found.
```

---

## Continuity Controls

- **Runner health:** The Forgejo web UI shows the online/offline status of every runner. Set up a Prometheus alert or a scheduled script that calls the Forgejo API and alerts if any runner has been offline for more than 5 minutes during working hours.
- **Disk cleanup:** Docker images accumulate on runner nodes. Run `docker system prune -f` weekly via cron to reclaim space from unused images and stopped containers.
- **Capacity tuning:** The default capacity of 4 concurrent jobs matches the 8-core runner hardware. If jobs are CPU-bound and the node is consistently at 100% CPU, reduce capacity to 2. If jobs are I/O-bound and CPU is underutilised, increase capacity to 6.
- **Token rotation:** Runner registration tokens are long-lived credentials. If a runner node is decommissioned, delete the runner from the Forgejo UI immediately to revoke its token. Do not leave offline runners registered indefinitely.
- **Runner upgrades:** When Forgejo releases a new act_runner version, upgrade all 16 runner nodes within the same maintenance window. Mismatched versions between the forge and runners can cause job failures.
