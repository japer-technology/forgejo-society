# Caddy Web Server

Caddy is a modern, production-grade web server written in Go that provides automatic TLS certificate provisioning and renewal via ACME (Let's Encrypt or ZeroSSL) without any manual certificate management. In the Forgejo-Mind stack, Caddy acts as the HTTPS reverse proxy in front of Forgejo: it terminates TLS, applies gzip compression, logs requests in JSON format, and forwards traffic to Forgejo on port 3000. Caddy's automatic certificate renewal eliminates the operational burden of certbot cron jobs and expired certificates, which are a leading cause of forge outages. Caddy's built-in HTTP/2 and HTTP/3 support also ensures that Git HTTPS operations — which make heavy use of streaming — perform well.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be fully configured.
- [UFW Firewall](02-ufw-firewall.md) — ports 80 and 443 must be open (configured in guide 02).

---

## Installation

### 1. Install Required APT Dependencies

Caddy's official APT repository requires these packages to be present:

```bash
sudo apt install -y \
  debian-keyring \
  debian-archive-keyring \
  apt-transport-https \
  curl
```

### 2. Add Caddy's GPG Key and APT Repository

```bash
# Download and store Caddy's signing key
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor \
  -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

# Add the Caddy stable APT repository
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list

# Update package list
sudo apt update
```

### 3. Install Caddy

```bash
sudo apt install -y caddy

# Verify the installed version
caddy version
# Expected: v2.x.x ...
```

The APT package:
- Creates a `caddy` system user and group
- Installs the binary to `/usr/bin/caddy`
- Installs a systemd service at `/lib/systemd/system/caddy.service`
- Creates `/etc/caddy/` for configuration
- Creates `/var/log/caddy/` for logs
- Enables and starts `caddy.service`

### 4. Create the Caddyfile

Replace `git.yourdomain.com` with your actual domain name. Caddy will automatically provision a TLS certificate for this domain via Let's Encrypt.

```bash
# Create the log directory with correct ownership
sudo mkdir -p /var/log/caddy
sudo chown caddy:caddy /var/log/caddy

sudo tee /etc/caddy/Caddyfile > /dev/null <<'EOF'
# Forgejo-Mind Caddy reverse proxy configuration
# Replace git.yourdomain.com with your actual domain

git.yourdomain.com {
    # Reverse proxy all requests to Forgejo on port 3000
    reverse_proxy 127.0.0.1:3000

    # Enable gzip and zstd compression
    encode gzip zstd

    # JSON access logging to a dedicated file
    log {
        output file /var/log/caddy/forgejo-access.log {
            roll_size     100mb
            roll_keep     10
            roll_keep_for 720h
        }
        format json
        level INFO
    }

    # Security headers
    header {
        # Prevent browsers from sniffing MIME types
        X-Content-Type-Options nosniff
        # Prevent clickjacking
        X-Frame-Options DENY
        # Enable XSS filter in older browsers
        X-XSS-Protection "1; mode=block"
        # Only send referrer for same-origin requests
        Referrer-Policy strict-origin-when-cross-origin
        # Remove server header
        -Server
    }
}
EOF
```

### 5. Validate and Reload Caddy

Always validate the Caddyfile syntax before reloading:

```bash
# Validate the configuration
sudo caddy validate --config /etc/caddy/Caddyfile
# Expected: Valid configuration

# Reload Caddy with the new configuration (no downtime)
sudo systemctl reload caddy
# Or use the caddy API:
# sudo caddy reload --config /etc/caddy/Caddyfile

sudo systemctl status caddy
```

### 6. Verify DNS Resolves to This Host

Caddy's ACME challenge requires that the domain resolves to the public IP of this server. Verify this before the certificate is provisioned:

```bash
# Confirm the domain resolves to this server
dig git.yourdomain.com +short
# Expected: the public IP of the forge server
```

Caddy will attempt the ACME HTTP-01 challenge as soon as a request arrives for the domain. The first HTTPS request may take a second or two longer while the certificate is issued.

### 7. Test the End-to-End HTTPS Connection

With Forgejo running (see [Forgejo](09-forgejo.md)), verify that HTTPS works:

```bash
# Test with curl — expect HTTP/2 200 or 302 redirect
curl -I https://git.yourdomain.com
# Expected: HTTP/2 200 (or 302 if Forgejo is not yet installed)

# Inspect the TLS certificate
echo | openssl s_client -connect git.yourdomain.com:443 2>/dev/null \
  | openssl x509 -noout -subject -dates
# Expected: Let's Encrypt or ZeroSSL certificate, valid dates in the future
```

---

## Validation

- [ ] **Caddy binary is installed and the correct version**

```bash
caddy version
# Expected: v2.x.x h1:...
```

- [ ] **Caddy service is running**

```bash
sudo systemctl status caddy
# Expected: active (running)
```

- [ ] **Caddyfile syntax is valid**

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
# Expected: Valid configuration (no errors)
```

- [ ] **Caddy is listening on ports 80 and 443**

```bash
ss -tlnp | grep -E ":80|:443"
# Expected: caddy listening on 0.0.0.0:80 and 0.0.0.0:443
```

- [ ] **TLS certificate has been issued**

```bash
sudo ls /var/lib/caddy/.local/share/caddy/certificates/
# Expected: directory tree with acme-v02.api.letsencrypt.org or similar
# and a .crt file for git.yourdomain.com
```

- [ ] **HTTPS responds with HTTP/2**

```bash
curl -sI https://git.yourdomain.com | head -3
# Expected: HTTP/2 200 or HTTP/2 302
```

- [ ] **TLS certificate is valid and not expiring soon**

```bash
echo | openssl s_client -connect git.yourdomain.com:443 2>/dev/null \
  | openssl x509 -noout -dates
# Expected: notAfter date is at least 30 days in the future
```

- [ ] **Access log file is being written**

```bash
sudo ls -lh /var/log/caddy/forgejo-access.log
# After at least one HTTP request, this file should exist and have content
```

- [ ] **Reverse proxy is forwarding to Forgejo (requires guide 09)**

```bash
curl -s https://git.yourdomain.com/api/v1/version
# Expected: JSON with forgejo version (after Forgejo is installed)
```

---

## Deinstallation

```bash
# Step 1: Stop the Caddy service
sudo systemctl stop caddy

# Step 2: Disable automatic startup
sudo systemctl disable caddy

# Step 3: Remove the Caddy package
sudo apt remove --purge caddy
sudo apt autoremove -y

# Step 4: Remove the Caddyfile configuration
sudo rm -f /etc/caddy/Caddyfile
sudo rmdir /etc/caddy 2>/dev/null || true

# Step 5: Remove access logs
sudo rm -rf /var/log/caddy

# Step 6: Remove TLS certificates and Caddy data
# WARNING: This removes the issued TLS certificates.
# Let's Encrypt rate limits re-issuance (5 per domain per week).
sudo rm -rf /var/lib/caddy

# Step 7: Remove the Caddy GPG key and APT source
sudo rm -f /usr/share/keyrings/caddy-stable-archive-keyring.gpg
sudo rm -f /etc/apt/sources.list.d/caddy-stable.list
sudo apt update

# Step 8: Confirm Caddy is gone
caddy version
# Expected: command not found
```

---

## Continuity Controls

- **TLS renewal:** Caddy renews certificates automatically 30 days before expiry. No operator action is required. Monitor renewal by checking the `notAfter` date periodically or by setting up an alerting rule in Prometheus based on the expiry metric.
- **Configuration changes:** Always run `sudo caddy validate --config /etc/caddy/Caddyfile` before `sudo systemctl reload caddy`. An invalid Caddyfile after a reload causes Caddy to continue with the previous configuration; an invalid file after a restart causes Caddy to fail to start.
- **Log rotation:** The Caddyfile configures log rotation at 100 MB with 10 kept files (720 hours = 30 days). Adjust these values if the forge serves high traffic.
- **Certificate storage:** The `/var/lib/caddy` directory contains the issued TLS certificates and ACME account credentials. Include this directory in the Restic backup (see [Restic Backup](05-restic-backup.md)) to avoid needing to re-provision certificates after a disaster recovery restore.
- **Domain changes:** If the forge domain name changes, update `git.yourdomain.com` in the Caddyfile, run `sudo caddy validate`, reload, and allow Caddy to provision a new certificate for the new domain.
