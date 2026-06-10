# Forgejo Society: scripts

A small, self-contained installer suite that brings up a single-host
Forgejo Society forge on Ubuntu and keeps it healthy. It pairs the
proven Forgejo + PostgreSQL commands from
[`../easy-install/`](../easy-install/README.md) with the operator
experience of the `ubuntu-zombie` installer: one subcommand-driven
entry point, a dry-run plan, idempotent re-runs, a read-only health
check, and a guided uninstall.

This folder is a fast, opinionated path to a working forge that you own
and run. It is **not** a replacement for the component-by-component
guides in [`../install/`](../install/00-index.md) or the full rollout
plan in [`../transition-plan/`](../transition-plan/00-overview.md). For a
production society, follow those.

---

## Files

| File | Purpose |
| --- | --- |
| [`install.sh`](install.sh) | Orchestrator. Subcommands: `install`, `verify`, `doctor`, `repair`, `uninstall`. Installs Forgejo, PostgreSQL, systemd, an admin account, optional Caddy + HTTPS, UFW, and fail2ban. |
| [`install-runner.sh`](install-runner.sh) | Installs a Forgejo Actions runner and registers it against the forge. Invoked standalone or by `install.sh` when `FS_WITH_RUNNER=1`. |
| [`uninstall.sh`](uninstall.sh) | Reverses the install. Supports `--dry-run`, `--archive`, `--keep-data`, and `--yes`. |
| [`lib.sh`](lib.sh) | Shared output library (status vocabulary, retries, step spinner). Sourced by the others; not run directly. |
| [`build-deb.sh`](build-deb.sh) | Packages the suite as a `.deb` with a `forgejo-society` wrapper. Installing the package does **not** install the forge. |
| [`completions/`](completions/) | Bash and zsh completion for the subcommands and flags. |
| [`VERSION`](VERSION) | Suite version string. |

---

## Quick start

On a fresh Ubuntu 24.04 host:

```bash
# Preview the plan without touching the host:
sudo ./install.sh install --dry-run

# Plain LAN forge on http://<ip>:3000 :
sudo ./install.sh install

# Public forge with automatic HTTPS and a co-located runner:
sudo FORGE_DOMAIN=git.example.org FS_WITH_RUNNER=1 ./install.sh install
```

After an install, check health at any time:

```bash
./install.sh verify          # read-only state check
./install.sh verify --json   # the same, machine-readable
./install.sh doctor          # explain failures and likely fixes
sudo ./install.sh repair     # re-assert permissions, firewall, services
```

To reverse the install:

```bash
sudo ./install.sh uninstall            # guided, with a confirmation gate
sudo ./uninstall.sh --dry-run          # preview exactly what would be removed
sudo ./uninstall.sh --archive --yes    # back up data first, then remove
```

The admin password, database password, and runner secret are written
once to a receipt at `${FS_DIR}/secrets/install-receipt.txt` (mode
`600`). Read it, store the secrets in your password manager, then
delete it.

---

## What `install.sh install` does

1. Installs `git`, `git-lfs`, `postgresql`, `postgresql-contrib`, and
   the usual download and hardening tooling via `apt`.
2. Creates the `git` system user that owns the Forgejo process and data.
3. Downloads the latest Forgejo release for the host architecture from
   `codeberg.org` and installs it to `/usr/local/bin/forgejo`.
4. Creates the data and config directories with the permissions Forgejo
   expects.
5. Creates a PostgreSQL role and database with a randomly generated
   password. Idempotent: safe to re-run.
6. Generates `SECRET_KEY`, `INTERNAL_TOKEN`, and `JWT_SECRET`, and writes
   `/etc/forgejo/app.ini` with `DB_TYPE = postgres`.
7. Installs and starts the `forgejo` systemd unit, runs `forgejo
   migrate`, registers a runner secret, and creates the admin account.
8. If `FORGE_DOMAIN` is set, installs Caddy for automatic HTTPS and binds
   Forgejo to loopback behind it.
9. If enabled, configures UFW (default deny inbound, allow SSH and the
   forge or web ports) and fail2ban.
10. If `FS_WITH_RUNNER=1`, installs a Forgejo Actions runner on the same
    host.

Each step records whether it changed anything, so a second run reports
"already satisfied" instead of redoing work.

---

## Configuration

All behaviour is controlled by environment variables; there are no
positional arguments to memorise. The common ones:

| Variable | Default | Meaning |
| --- | --- | --- |
| `FORGE_PORT` | `3000` | Forgejo HTTP port. |
| `FORGE_DB_NAME` | `forgejo` | PostgreSQL database name. |
| `FORGE_DB_USER` | `forgejo` | PostgreSQL role name. |
| `FORGE_ADMIN_USER` | `forgejo-admin` | Initial admin username. |
| `FORGE_ADMIN_EMAIL` | `admin@example.org` | Initial admin email. |
| `FORGE_DOMAIN` | _(unset)_ | If set, enable Caddy + automatic HTTPS for this name; Forgejo binds loopback only. |
| `FS_ENABLE_CADDY` | auto | Force Caddy off/on. Defaults on when a domain is set. |
| `FS_ENABLE_FIREWALL` | `1` | Configure UFW. |
| `FS_ENABLE_FAIL2BAN` | `1` | Enable fail2ban. |
| `FS_WITH_RUNNER` | `0` | Also install a Forgejo Actions runner here. |
| `FS_RUNNER_LABELS` | `default` | Comma-separated runner labels. |
| `FS_DIR` | `/opt/forgejo-society` | Suite state and receipt directory. |
| `FS_COLOR` | `auto` | Colour policy: `auto`, `always`, or `never`. `NO_COLOR` is honoured. |
| `FS_RECEIPT` | `1` | Write the credentials receipt. |

Run `./install.sh --help` for the full list.

---

## Scope and limits

This suite installs a single-host forge. It does **not**:

- Match the production runner topology. The Forgejo Society reference
  deployment runs many runners on dedicated Ubuntu hosts; this installs
  at most one runner, on the host you point it at. See
  [`../transition-plan/09-runner-scale-strategy.md`](../transition-plan/09-runner-scale-strategy.md).
- Configure off-site backups. For Restic and `pg_dump` rotation, see
  [`../install/05-restic-backup.md`](../install/05-restic-backup.md) and
  [`../install/07-postgresql-16.md`](../install/07-postgresql-16.md).
- Tune PostgreSQL for the forge's working set. The Ubuntu package
  defaults are used as-is.
- Configure federation, mirrors, or the multi-host network. Those belong
  to the [`../transition-plan/`](../transition-plan/00-overview.md).

If you need any of the above, treat this as a starting point and migrate
the configuration into the per-component guides.

---

## Compliance posture

Per the repository's [`WARNING.md`](../../WARNING.md), agent workloads
must execute on **self-hosted Forgejo on owned Ubuntu hardware**. This
suite respects that posture: it installs a Forgejo instance and runner
that you own and run, on hardware you control. It does not push code,
secrets, or runners to shared infrastructure, and it does not configure
GitHub Actions for agent workloads.

---

## Upstream and attribution

The operator experience — the subcommand dispatch, dry-run plan, status
vocabulary, step spinner, and guided uninstall — is adapted from the
[`japer-technology/ubuntu-zombie`](https://github.com/japer-technology/ubuntu-zombie/tree/main/scripts)
installer scripts.

The Forgejo, PostgreSQL, and runner install commands are carried over
from [`../easy-install/`](../easy-install/README.md), which is itself a
derivative of
[`wkoszek/easyforgejo`](https://github.com/wkoszek/easyforgejo) (MIT
License) by Adam Koszek. See
[`../easy-install/NOTICE`](../easy-install/NOTICE) for the full
attribution and license text.
