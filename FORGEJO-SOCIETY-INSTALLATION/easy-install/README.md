# Forgejo Society: easy-install

A two-script installer that brings up a working Forgejo instance and a
Forgejo Actions runner on Ubuntu in a few minutes. Unlike the upstream
`easyforgejo` project, this variant uses **PostgreSQL 16** as the
database backend rather than SQLite.

This folder is the fastest possible path to a working forge for
demos, evaluation, and short-lived test hosts. It is **not** the
production path for a Forgejo-Society deployment — for that, follow
the component-by-component guides in
[`../install/`](../install/00-index.md) and the rollout plan in
[`../transition-plan/`](../transition-plan/00-overview.md).

---

## Files

| File | Purpose |
| --- | --- |
| [`install.sh`](install.sh) | Installs Forgejo, creates a PostgreSQL role and database, writes `app.ini`, registers a systemd unit, creates an admin account, and prints a runner registration command. |
| [`install-runner.sh`](install-runner.sh) | Installs `forgejo-runner`, registers it against the forge using the secret printed by `install.sh`, and starts it under systemd. |
| [`NOTICE`](NOTICE) | Upstream attribution and MIT license notice for `wkoszek/easyforgejo`. |

---

## What `install.sh` does

1. Installs `git`, `git-lfs`, `postgresql`, `postgresql-contrib`, and
   the usual download tooling via `apt`.
2. Creates the `git` system user that will own the Forgejo process and
   data directory.
3. Downloads the latest Forgejo release for the host architecture from
   `codeberg.org` and installs it to `/usr/local/bin/forgejo`.
4. Creates `/var/lib/forgejo` (data) and `/etc/forgejo` (config) with
   the permissions Forgejo expects.
5. Creates a PostgreSQL role `forgejo` with a randomly generated
   password and a database `forgejo` owned by that role. Idempotent:
   safe to re-run.
6. Generates `SECRET_KEY`, `INTERNAL_TOKEN`, and `JWT_SECRET` using
   `forgejo generate secret`, and writes `/etc/forgejo/app.ini` with
   `DB_TYPE = postgres` and the credentials from the previous step.
7. Downloads the upstream `forgejo.service` systemd unit and starts the
   service.
8. Runs `forgejo migrate` against the new PostgreSQL database,
   registers a runner secret, and creates an admin user with a random
   password.

At the end it prints the URL, the admin credentials, the database
password, and the exact command to install a runner.

## What `install-runner.sh` does

1. Installs `docker.io` and `jq` via `apt`.
2. Creates the `runner` system user and adds it to the `docker` group.
3. Downloads the latest `forgejo-runner` release for the host
   architecture.
4. Generates `/home/runner/config.yml` and registers the runner with
   the forge using the IP, port, and secret you pass in.
5. Patches `.runner` so the runner advertises the `default` label and
   matches jobs that target `ubuntu-latest`.
6. Installs a systemd unit and starts the runner.

---

## Quick start

On a fresh Ubuntu 24.04 host:

```bash
# 1. Install the forge (PostgreSQL-backed)
sudo bash install.sh

# 2. Copy the runner command printed at the end, e.g.:
sudo bash install-runner.sh 192.0.2.10 3000 <RUNNER_SECRET>
```

To completely undo what `install.sh` did (stops the service, drops the
database and role, removes the binary, config, data, and `git` user):

```bash
sudo bash install.sh purge
```

---

## Database backend: PostgreSQL instead of SQLite

SQLite is fine for a single developer poking at one repository. The
moment you have multiple concurrent CI runners writing job logs,
issues being updated while pull requests are merging, or anything
resembling load, PostgreSQL is the right backend:

- ACID transactions with row-level locking instead of database-level
  locking.
- A real query planner, real indexes, and `EXPLAIN ANALYZE`.
- A clean backup story (`pg_dump`, WAL archiving, point-in-time
  recovery).
- The same database engine the production Forgejo-Society topology
  uses, so the schema and tuning observations carry across.

For tuning, backup, and operations against this database in a
production setting, see
[`../install/07-postgresql-16.md`](../install/07-postgresql-16.md).

---

## Scope and limits

This installer is intentionally small. It does **not**:

- Configure a reverse proxy or TLS. Forgejo binds HTTP on the port
  given by `PORT` (default 3000). For TLS-terminated access, place
  Caddy in front (see [`../install/08-caddy-web-server.md`](../install/08-caddy-web-server.md)).
- Configure UFW or fail2ban. For hardening, follow
  [`../install/02-ufw-firewall.md`](../install/02-ufw-firewall.md)
  and [`../install/03-fail2ban.md`](../install/03-fail2ban.md).
- Configure off-site backups. For Restic and `pg_dump` rotation, see
  [`../install/05-restic-backup.md`](../install/05-restic-backup.md)
  and [`../install/07-postgresql-16.md`](../install/07-postgresql-16.md).
- Tune PostgreSQL for the forge's working set. The defaults shipped by
  the Ubuntu package are used as-is.
- Match the production runner topology. The Forgejo-Society reference
  deployment runs 16 runners on dedicated Ubuntu hosts; this script
  installs one runner on the host you point it at.

If you need any of the above, treat the easy install as a starting
point and migrate the configuration into the per-component guides.

---

## Compliance posture

Per the repository's [`WARNING.md`](../../WARNING.md), agent workloads
must execute on **self-hosted Forgejo on owned Ubuntu hardware**. This
installer respects that posture: it installs a Forgejo instance and
runner that you own and run, on hardware you control. It does not
push code, secrets, or runners to shared infrastructure.

---

## Upstream

This installer is a derivative of
[`wkoszek/easyforgejo`](https://github.com/wkoszek/easyforgejo) (MIT
License) by Adam Koszek. The substantive changes are:

- The database backend is PostgreSQL 16 instead of SQLite.
- The script is `set -euo pipefail` and idempotent against re-runs.
- The database role and database are created with a randomly generated
  password, written into `app.ini`, and dropped cleanly on `purge`.
- All hard-coded paths and credentials are exposed as environment
  variables for overrideability (`PORT`, `DB_NAME`, `DB_USER`,
  `ADMIN_USER`, `ADMIN_EMAIL`, `IP`).
- Banner output, summary block, and prose are aligned with the
  Forgejo-Society style guide.

See [`NOTICE`](NOTICE) for the full attribution and license text.
