# PostgreSQL 16

PostgreSQL 16 is the production relational database that backs the Forgejo forge. It stores all Forgejo metadata: user accounts, repositories, issues, pull requests, comments, CI job records, release assets, and access control entries. PostgreSQL's ACID guarantees, robust transaction model, and mature tooling make it the correct choice for a forge serving a fleet of 16 CI runners. This guide covers installation from the Ubuntu APT repository, creation of the `forgejo` database user and database, performance tuning for the forge server's 64 GB RAM / 20-core CPU profile, and a nightly `pg_dump` backup script.

---

## Prerequisites

- [Ubuntu 24.04 LTS](01-ubuntu-24-lts.md) — the host OS must be fully configured, including the `forgejo` system account created in guide 01.

---

## Installation

### 1. Install PostgreSQL 16

Ubuntu 24.04's default APT repository ships PostgreSQL 16. Install it along with the contrib extensions:

```bash
sudo apt install -y postgresql postgresql-contrib

# Verify the service started automatically
sudo systemctl status postgresql
# Expected: active (running)

# Check the installed version
sudo -u postgres psql --version
# Expected: psql (PostgreSQL) 16.x
```

The APT package:
- Creates the `postgres` OS user
- Creates the initial `postgres` superuser role inside the database cluster
- Places the data directory at `/var/lib/postgresql/16/main/`
- Places configuration files at `/etc/postgresql/16/main/`
- Enables and starts `postgresql.service`

### 2. Create the Forgejo Database User and Database

Connect as the `postgres` superuser and create the Forgejo-specific role and database:

```bash
sudo -u postgres psql <<'SQL'
-- Create the database user for Forgejo
-- Use a strong, random password stored in your password manager
CREATE USER forgejo WITH PASSWORD 'REPLACE_WITH_STRONG_PASSWORD' LOGIN;

-- Create the database owned by the forgejo user
CREATE DATABASE forgejo
  OWNER forgejo
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8'
  TEMPLATE template0;

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE forgejo TO forgejo;

-- Verify
\l forgejo
SQL
```

Expected output of `\l forgejo`:

```
   Name   |  Owner  | Encoding |   Collate   |    Ctype    | ...
----------+---------+----------+-------------+-------------+
 forgejo  | forgejo | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
```

### 3. Restrict PostgreSQL to Localhost

PostgreSQL must not be accessible from the network — Forgejo connects to it over the local UNIX socket or the loopback interface.

Edit `/etc/postgresql/16/main/postgresql.conf`:

```bash
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" \
  /etc/postgresql/16/main/postgresql.conf

# Verify
grep "^listen_addresses" /etc/postgresql/16/main/postgresql.conf
# Expected: listen_addresses = 'localhost'
```

Edit `/etc/postgresql/16/main/pg_hba.conf` to allow only the forgejo OS user over the local socket:

```bash
# The default pg_hba.conf already allows local connections via peer/md5.
# Verify the relevant lines are present:
sudo grep -E "^local|^host.*127" /etc/postgresql/16/main/pg_hba.conf
```

Ensure there is a line allowing the `forgejo` user to connect to the `forgejo` database:

```bash
sudo tee -a /etc/postgresql/16/main/pg_hba.conf > /dev/null <<'EOF'
# Forgejo application database access
host    forgejo         forgejo         127.0.0.1/32            scram-sha-256
host    forgejo         forgejo         ::1/128                 scram-sha-256
EOF
```

Reload PostgreSQL to apply the change:

```bash
sudo systemctl reload postgresql
```

### 4. Performance Tuning for the Forge Server

The forge server has 64 GB RAM and a 20-core CPU. The following settings are tuned for this hardware profile. They go in a drop-in conf file so they survive PostgreSQL package upgrades.

```bash
sudo mkdir -p /etc/postgresql/16/main/conf.d

sudo tee /etc/postgresql/16/main/conf.d/forgejo-tuning.conf > /dev/null <<'EOF'
# Forgejo-Mind PostgreSQL performance tuning
# Hardware: i9 20-core @ 5 GHz, 64 GB RAM, 2 TB NVMe

# Memory
shared_buffers             = 16GB      # 25% of total RAM
effective_cache_size       = 48GB      # 75% of total RAM (advisory, not allocated)
work_mem                   = 64MB      # Per sort/hash operation; adjust if OOM
maintenance_work_mem       = 2GB       # For VACUUM, CREATE INDEX, etc.
huge_pages                 = try       # Use huge pages if the OS allows

# Parallelism
max_worker_processes       = 16        # Match the physical core count
max_parallel_workers       = 16
max_parallel_workers_per_gather = 8

# WAL
wal_buffers                = 64MB
checkpoint_completion_target = 0.9
wal_compression            = on

# Connections
max_connections            = 100       # Forgejo default pool is well within this

# Logging
log_min_duration_statement = 500       # Log queries slower than 500 ms
log_line_prefix            = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_checkpoints            = on
log_connections            = off
log_disconnections         = off

# Autovacuum
autovacuum                 = on
autovacuum_vacuum_scale_factor  = 0.05
autovacuum_analyze_scale_factor = 0.02
EOF
```

Verify the drop-in is included by checking `include_dir` in the main config:

```bash
grep "include_dir" /etc/postgresql/16/main/postgresql.conf
# Expected: include_dir = 'conf.d'
# If not present, add it:
echo "include_dir = 'conf.d'" | sudo tee -a /etc/postgresql/16/main/postgresql.conf
```

Restart PostgreSQL to apply the tuning:

```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

### 5. Test the Connection from the forgejo OS User

Forgejo will connect as the `forgejo` OS user. Verify the connection works:

```bash
# Run as the forgejo user to confirm local authentication
sudo -u forgejo psql -h 127.0.0.1 -U forgejo -d forgejo -c "SELECT current_database(), current_user;"
# Enter the password set in step 2 when prompted
# Expected: forgejo | forgejo
```

### 6. Nightly pg_dump Backup Script

Create a script that dumps the Forgejo database to a compressed SQL file. These dumps are the target for the Restic off-site backup (see [Restic Backup](05-restic-backup.md)).

```bash
sudo mkdir -p /var/backups/postgres

sudo tee /usr/local/bin/pg-backup-forgejo.sh > /dev/null <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/postgres"
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
FILENAME="forgejo_${TIMESTAMP}.sql.gz"
LOG="/var/log/pg-backup-forgejo.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting pg_dump of forgejo database" >> "$LOG"

sudo -u postgres pg_dump forgejo \
  --no-password \
  --format=plain \
  --no-acl \
  | gzip -9 > "${BACKUP_DIR}/${FILENAME}"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup written to ${BACKUP_DIR}/${FILENAME}" >> "$LOG"

# Retain only the 14 most recent dumps on disk
ls -1t "${BACKUP_DIR}"/forgejo_*.sql.gz | tail -n +15 | xargs -r rm -v >> "$LOG" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] pg_dump complete" >> "$LOG"
SCRIPT

sudo chmod 755 /usr/local/bin/pg-backup-forgejo.sh
```

Schedule with cron at 01:30 daily:

```bash
sudo crontab -e
```

Add:

```bash
30 1 * * * /usr/local/bin/pg-backup-forgejo.sh >> /var/log/pg-backup-forgejo.log 2>&1
```

Test the script immediately:

```bash
sudo /usr/local/bin/pg-backup-forgejo.sh
ls -lh /var/backups/postgres/
# Expected: one .sql.gz file with today's timestamp
```

---

## Validation

- [ ] **PostgreSQL service is running**

```bash
sudo systemctl status postgresql
# Expected: active (running)
```

- [ ] **Correct PostgreSQL version**

```bash
sudo -u postgres psql --version
# Expected: psql (PostgreSQL) 16.x
```

- [ ] **Forgejo database exists with correct ownership**

```bash
sudo -u postgres psql -c "\l forgejo"
# Expected: forgejo database, Owner: forgejo, Encoding: UTF8
```

- [ ] **Shared buffers matches the tuning config**

```bash
sudo -u postgres psql -c "SHOW shared_buffers;"
# Expected: 16GB
```

- [ ] **Effective cache size is set**

```bash
sudo -u postgres psql -c "SHOW effective_cache_size;"
# Expected: 48GB
```

- [ ] **Connection count is configured**

```bash
sudo -u postgres psql -c "SHOW max_connections;"
# Expected: 100
```

- [ ] **Active connections are visible**

```bash
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
# Expected: 1 or 2 (background autovacuum workers)
```

- [ ] **forgejo OS user can connect to the database**

```bash
sudo -u forgejo psql -h 127.0.0.1 -U forgejo -d forgejo -c "SELECT 1;"
# Expected: ?column? = 1
```

- [ ] **PostgreSQL is listening on localhost only**

```bash
ss -tlnp | grep 5432
# Expected: 127.0.0.1:5432 only, NOT 0.0.0.0:5432
```

- [ ] **Backup script runs without errors**

```bash
sudo /usr/local/bin/pg-backup-forgejo.sh
ls -lh /var/backups/postgres/
# Expected: .sql.gz file present
```

- [ ] **Backup cron job is scheduled**

```bash
sudo crontab -l | grep pg-backup
# Expected: the 30 1 * * * line
```

---

## Deinstallation

> **Warning:** Removing PostgreSQL while Forgejo is running will break Forgejo immediately. Always stop Forgejo first.

```bash
# Step 1: Stop Forgejo (see guide 09)
sudo systemctl stop forgejo

# Step 2: Stop PostgreSQL
sudo systemctl stop postgresql

# Step 3: Remove packages
sudo apt remove --purge postgresql postgresql-contrib postgresql-16
sudo apt autoremove -y

# Step 4: Remove the data directory (ALL DATABASE DATA IS LOST)
sudo rm -rf /var/lib/postgresql

# Step 5: Remove the configuration directory
sudo rm -rf /etc/postgresql

# Step 6: Remove the backup script and scheduled job
sudo rm -f /usr/local/bin/pg-backup-forgejo.sh
sudo crontab -e
# Remove the pg-backup-forgejo.sh line

# Step 7: Optionally remove local backup files
sudo rm -rf /var/backups/postgres

# Step 8: Remove the postgres OS user (created by the package)
sudo userdel -r postgres 2>/dev/null || true

# Step 9: Confirm PostgreSQL is gone
psql --version
# Expected: command not found
```

---

## Continuity Controls

- **Backup verification:** Run `sudo /usr/local/bin/pg-backup-forgejo.sh` manually after any major change to the Forgejo database schema and confirm the dump file is non-zero in size.
- **VACUUM schedule:** Autovacuum is enabled and tuned. Monitor `pg_stat_user_tables` for tables with high `n_dead_tup` counts. If dead tuples accumulate faster than autovacuum can clean them, increase `autovacuum_vacuum_cost_delay`.
- **Connection pooling:** At scale, add PgBouncer in front of PostgreSQL to reduce connection overhead. Forgejo supports connecting through a pooler.
- **WAL archiving:** For point-in-time recovery (PITR), enable `archive_mode` and configure `archive_command` to copy WAL segments to a remote location. This provides recovery granularity beyond what nightly dumps offer.
- **Major version upgrades:** PostgreSQL major versions (e.g., 16 → 17) require a `pg_upgrade` migration, not a simple package upgrade. Plan this as a maintenance window operation with Forgejo stopped and a full backup verified.
