# PostgreSQL Database

PostgreSQL 16 is the Forgejo database backend. This guide covers installation,
configuration, tuning for the primary server hardware, backup, and restore.

**Complete [01 — Ubuntu foundation](01-ubuntu-foundation.md) before starting this guide.**

---

## Phase 1 — Install PostgreSQL 16

Ubuntu 24.04 LTS ships PostgreSQL 16 in its main package archive.

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Verify the service is running
sudo systemctl status postgresql
sudo -u postgres psql --version
```

The default data directory is `/var/lib/postgresql/16/main`.

---

## Phase 2 — Create the Forgejo database and user

```bash
sudo -u postgres psql <<'SQL'
-- Create the Forgejo application user
CREATE USER forgejo WITH
  PASSWORD 'CHANGE_ME_STRONG_PASSWORD'
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE;

-- Create the database
CREATE DATABASE forgejo
  OWNER forgejo
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE   'en_US.UTF-8'
  TEMPLATE template0;

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE forgejo TO forgejo;

-- Confirm
\l forgejo
\du forgejo
SQL
```

> Use a strong, randomly generated password. Store it in your password vault and
> also paste it into `/etc/forgejo/app.ini` as `PASSWD`.

---

## Phase 3 — Tune PostgreSQL for the forge server

The primary server has a 20-core i9 with 64 GB RAM. Apply these settings to
`/etc/postgresql/16/main/postgresql.conf`:

```bash
sudo tee /etc/postgresql/16/main/conf.d/forgejo-tuning.conf > /dev/null <<'EOF'
# Memory
shared_buffers            = 16GB       # ~25% of total RAM
effective_cache_size      = 48GB       # ~75% of total RAM
work_mem                  = 64MB       # per sort/hash operation
maintenance_work_mem      = 2GB        # for VACUUM, CREATE INDEX

# Parallelism
max_worker_processes      = 16
max_parallel_workers      = 16
max_parallel_workers_per_gather = 8

# WAL and checkpoints
wal_buffers               = 64MB
checkpoint_completion_target = 0.9
wal_compression           = on

# Connections
max_connections           = 100        # Forgejo + admin tooling

# Logging
log_min_duration_statement = 500       # log queries taking > 500 ms
log_checkpoints           = on
log_connections           = off
log_disconnections        = off

# Autovacuum
autovacuum                = on
autovacuum_vacuum_scale_factor   = 0.05
autovacuum_analyze_scale_factor  = 0.025
EOF

sudo systemctl reload postgresql
```

Verify the settings are active:

```bash
sudo -u postgres psql -c "SHOW shared_buffers;"
sudo -u postgres psql -c "SHOW work_mem;"
```

---

## Phase 4 — Restrict network access

By default PostgreSQL only listens on localhost, which is correct. Confirm:

```bash
sudo -u postgres psql -c "SHOW listen_addresses;"
# Should return: localhost
```

If you ever need to allow remote connections (for example, from a separate backup
host), restrict by IP in `/etc/postgresql/16/main/pg_hba.conf`:

```
# Only allow forgejo user from localhost
host  forgejo  forgejo  127.0.0.1/32  scram-sha-256
```

And update `listen_addresses` to the specific interface IP, not `*`.

---

## Phase 5 — Backup and restore

### 5.1 Daily logical backup with pg_dump

```bash
sudo tee /usr/local/bin/pg-backup-forgejo.sh > /dev/null <<'SCRIPT'
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/backup/postgresql"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILE="$BACKUP_DIR/forgejo-$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

sudo -u postgres pg_dump \
  --format=custom \
  --compress=9 \
  --file="$FILE" \
  forgejo

# Remove backups older than 14 days
find "$BACKUP_DIR" -name "forgejo-*.sql.gz" -mtime +14 -delete

echo "PostgreSQL backup complete: $FILE"
SCRIPT

sudo chmod +x /usr/local/bin/pg-backup-forgejo.sh
sudo mkdir -p /backup/postgresql
```

Schedule in cron (runs at 01:30 nightly, before the Forgejo backup at 02:00):

```bash
sudo crontab -e
# 30 1 * * * /usr/local/bin/pg-backup-forgejo.sh >> /var/log/pg-backup.log 2>&1
```

### 5.2 Restore from a pg_dump backup

```bash
# Stop Forgejo first
sudo systemctl stop forgejo

# Drop and recreate the database
sudo -u postgres psql <<SQL
DROP DATABASE IF EXISTS forgejo;
CREATE DATABASE forgejo
  OWNER forgejo
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE   'en_US.UTF-8'
  TEMPLATE template0;
GRANT ALL PRIVILEGES ON DATABASE forgejo TO forgejo;
SQL

# Restore
sudo -u postgres pg_restore \
  --dbname=forgejo \
  --no-privileges \
  --no-owner \
  /backup/postgresql/forgejo-TIMESTAMP.sql.gz

# Start Forgejo
sudo systemctl start forgejo
sudo systemctl status forgejo
```

### 5.3 Physical base backup with pg_basebackup

For a warm standby or faster full restores:

```bash
# Run as postgres user; stores a base backup in /backup/pg-base
sudo -u postgres pg_basebackup \
  --pgdata=/backup/pg-base \
  --format=tar \
  --gzip \
  --progress \
  --checkpoint=fast
```

---

## Phase 6 — Monitoring PostgreSQL

### 6.1 Basic health checks

```bash
# Connection count
sudo -u postgres psql -c \
  "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"

# Database size
sudo -u postgres psql -c \
  "SELECT pg_size_pretty(pg_database_size('forgejo'));"

# Table sizes
sudo -u postgres psql -d forgejo -c \
  "SELECT relname, pg_size_pretty(pg_total_relation_size(oid))
   FROM pg_class WHERE relkind = 'r'
   ORDER BY pg_total_relation_size(oid) DESC LIMIT 20;"

# Long-running queries
sudo -u postgres psql -c \
  "SELECT pid, now() - pg_stat_activity.query_start AS duration, query
   FROM pg_stat_activity
   WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';"
```

### 6.2 Enable pg_stat_statements

```bash
sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"

# Then in postgresql.conf:
echo "shared_preload_libraries = 'pg_stat_statements'" \
  | sudo tee -a /etc/postgresql/16/main/conf.d/forgejo-tuning.conf

sudo systemctl restart postgresql
```

Query the top slow queries:

```bash
sudo -u postgres psql -c \
  "SELECT query, calls, total_exec_time/calls AS avg_ms, rows
   FROM pg_stat_statements
   ORDER BY total_exec_time DESC LIMIT 10;"
```

---

## Phase 7 — Maintenance

```bash
# Manual vacuum and analyze
sudo -u postgres vacuumdb --all --analyze --verbose

# Reindex the forgejo database
sudo -u postgres reindexdb --dbname=forgejo

# Check for bloat
sudo -u postgres psql -d forgejo -c \
  "SELECT schemaname, tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
   LIMIT 20;"
```

---

## Continuity controls

- Logical backup runs nightly at 01:30 via cron.
- Physical base backup runs weekly via a separate cron job.
- Both backups are synced off-machine via `restic` to the designated backup destination.
- Test a full restore to a clean PostgreSQL instance at least once per quarter.
- Keep the PostgreSQL major version in sync with the latest Ubuntu 24.04 LTS package.

---

## Open decisions

- [ ] Is a PostgreSQL standby replica needed for high-availability?
- [ ] Which off-machine backup destination is used: local NAS, S3-compatible, or cloud?
- [ ] What is the maximum acceptable recovery point objective (RPO)?
