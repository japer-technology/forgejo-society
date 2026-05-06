# Restic Backup

Restic is a modern, fast, encrypted backup program that supports deduplicated, incremental snapshots stored on a wide variety of backends including S3-compatible object storage (Backblaze B2, Wasabi, AWS S3). In the Forgejo-Mind stack, Restic protects the forge server's PostgreSQL database dumps, Forgejo repository data, and system configuration against hardware failure, ransomware, and accidental deletion. Every backup is client-side encrypted before it leaves the host — even the storage provider cannot read backup contents. Snapshots are deduplicated at the chunk level, so successive nightly backups of largely-unchanged data consume very little additional space.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be installed and updated.

---

## Installation

### 1. Install Restic and BorgBackup

Restic is the primary backup tool. BorgBackup is installed alongside it as a complementary option for local-network backup targets.

```bash
sudo apt install -y restic borgbackup

# Verify installation
restic version
# Expected: restic 0.x.x compiled with go1.x.x on linux/amd64
borg --version
# Expected: borg 1.x.x
```

### 2. Configure the S3-Compatible Backend

Restic supports multiple backends. This guide uses Backblaze B2 as the primary off-site target. Wasabi S3 is equally suitable — substitute the endpoint URL and bucket name as appropriate.

#### Backblaze B2 Setup

1. Create a Backblaze account at https://www.backblaze.com/b2/
2. Create a private bucket named `forgejo-mind-backup` (do not make it public)
3. Create an Application Key with read/write access to that bucket
4. Note your:
   - **Account ID** (also called keyID)
   - **Application Key** (the secret)
   - **Bucket name**

#### Store Credentials in a Protected Environment File

```bash
sudo mkdir -p /etc/restic
sudo chmod 700 /etc/restic

sudo tee /etc/restic/b2.env > /dev/null <<'EOF'
# Backblaze B2 credentials
export B2_ACCOUNT_ID="YOUR_ACCOUNT_ID"
export B2_ACCOUNT_KEY="YOUR_APPLICATION_KEY"
export RESTIC_REPOSITORY="b2:forgejo-mind-backup:/forge"
export RESTIC_PASSWORD="YOUR_STRONG_REPOSITORY_PASSWORD"
EOF

sudo chmod 600 /etc/restic/b2.env
```

> **Security note:** The `RESTIC_PASSWORD` is the encryption passphrase for the repository. Store it in your password manager immediately. If it is lost, the backup data is unrecoverable — Restic encryption cannot be brute-forced.

For Wasabi S3, use:

```bash
sudo tee /etc/restic/wasabi.env > /dev/null <<'EOF'
export AWS_ACCESS_KEY_ID="YOUR_WASABI_KEY"
export AWS_SECRET_ACCESS_KEY="YOUR_WASABI_SECRET"
export RESTIC_REPOSITORY="s3:https://s3.eu-central-1.wasabisys.com/forgejo-mind-backup/forge"
export RESTIC_PASSWORD="YOUR_STRONG_REPOSITORY_PASSWORD"
EOF
sudo chmod 600 /etc/restic/wasabi.env
```

### 3. Initialise the Restic Repository

```bash
# Source the credentials
source /etc/restic/b2.env

# Initialise the repository (creates the encryption keys and metadata)
restic init

# Expected output:
# created restic repository xxxxxxxxxxxxxxxx at b2:forgejo-mind-backup:/forge
# Please note that knowledge of your password is required to access the repository.
# Losing your password means that your data is irrecoverably lost!
```

### 4. Create the Backup Script

The backup script runs as root, sources the credentials, and backs up the critical Forgejo-Mind directories.

```bash
sudo tee /usr/local/bin/restic-backup-forge.sh > /dev/null <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

# Load credentials
source /etc/restic/b2.env

LOG="/var/log/restic-backup.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] Starting restic backup" >> "$LOG"

# Run the backup
restic backup \
  /var/lib/forgejo \
  /etc/forgejo \
  /etc/caddy \
  /var/backups/postgres \
  --tag forge \
  --tag "$(hostname)" \
  --exclude-caches \
  2>&1 | tee -a "$LOG"

# Apply retention policy: keep 7 daily, 4 weekly, 12 monthly snapshots
restic forget \
  --keep-daily 7 \
  --keep-weekly 4 \
  --keep-monthly 12 \
  --prune \
  --tag forge \
  2>&1 | tee -a "$LOG"

echo "[$TIMESTAMP] Restic backup complete" >> "$LOG"
SCRIPT

sudo chmod 755 /usr/local/bin/restic-backup-forge.sh
```

### 5. Test the Backup Script

Run the script manually first to confirm it completes without errors before scheduling it.

```bash
sudo /usr/local/bin/restic-backup-forge.sh
# Watch the output for errors
# Final lines should show the backup summary and forget output

# Confirm the snapshot was created
source /etc/restic/b2.env
restic snapshots
# Expected: one or more snapshot lines with timestamp, host, tags, and path list
```

### 6. Schedule with Cron

```bash
sudo crontab -e
```

Add the following line to run nightly at 03:00:

```bash
0 3 * * * /usr/local/bin/restic-backup-forge.sh >> /var/log/restic-backup.log 2>&1
```

Save and exit. Verify the cron entry:

```bash
sudo crontab -l | grep restic
```

---

## Validation

- [ ] **Restic version is installed**

```bash
restic version
# Expected: restic 0.x.x
```

- [ ] **BorgBackup version is installed**

```bash
borg --version
# Expected: borg 1.x.x
```

- [ ] **Credentials file exists and has restricted permissions**

```bash
ls -la /etc/restic/
# Expected: b2.env (or wasabi.env) owned by root, mode 600
```

- [ ] **Repository is initialised and accessible**

```bash
source /etc/restic/b2.env
restic snapshots
# Expected: zero or more snapshot lines (no authentication or connection error)
```

- [ ] **Repository integrity check passes**

```bash
source /etc/restic/b2.env
restic check
# Expected: no errors found
```

- [ ] **At least one snapshot exists**

```bash
source /etc/restic/b2.env
restic snapshots --json | jq length
# Expected: integer >= 1 after the first manual backup run
```

- [ ] **Cron job is scheduled**

```bash
sudo crontab -l | grep restic-backup
# Expected: the 0 3 * * * line
```

- [ ] **Restore test (spot-check a single file)**

```bash
source /etc/restic/b2.env
# List snapshot IDs
restic snapshots

# Restore a single file from the latest snapshot to a local path
restic restore latest \
  --target /var/backups/restic-restore-test \
  --include /etc/forgejo/app.ini

ls /var/backups/restic-restore-test/etc/forgejo/app.ini
# The file should be present

# Clean up the test restore
sudo rm -rf /var/backups/restic-restore-test
```

---

## Deinstallation

```bash
# Step 1: Remove the cron job
sudo crontab -e
# Delete the restic-backup-forge.sh line, save and exit

# Step 2: Optionally prune and delete all remote snapshots before removing
# This is irreversible — only do this if you want to discard all backup data
source /etc/restic/b2.env
restic forget --keep-last 0 --prune 2>/dev/null || true
# Note: forget --keep-last 0 is not a supported restic flag;
# to truly delete all snapshots, remove all snapshot IDs manually:
restic snapshots --json | jq -r '.[].id' | xargs -I{} restic forget --prune {}

# Step 3: Remove the backup script
sudo rm -f /usr/local/bin/restic-backup-forge.sh

# Step 4: Remove the credentials
sudo rm -rf /etc/restic

# Step 5: Remove the packages
sudo apt remove --purge restic borgbackup
sudo apt autoremove -y

# Step 6: Confirm removal
restic version
# Expected: command not found
```

> **Warning:** Deleting remote snapshots is irreversible. If there is any chance you will need to restore data from this backup, keep the snapshots in the object storage bucket and simply remove the local configuration files.

---

## Continuity Controls

- **Repository integrity:** Run `restic check` monthly to detect bit-rot or corruption in the remote repository. The check command verifies that all data blobs referenced by snapshots are present and intact.
- **Restore testing:** Quarterly, perform a full restore test to a temporary VM or directory to confirm that data can actually be recovered, not just that backups are being written.
- **Password backup:** The `RESTIC_PASSWORD` must survive independently of the forge server. Store it in an offline password manager or a sealed physical document.
- **Retention tuning:** Review the `--keep-daily / --keep-weekly / --keep-monthly` retention policy as data grows. More retentions cost more storage and more B2/Wasabi bandwidth during prune operations.
- **Monitoring:** Parse `/var/log/restic-backup.log` with a cron-driven log watcher or forward logs to a monitoring system. A backup that silently fails for weeks provides no protection.
