# Forgejo Society: bootstrap

A single, self-contained `curl | bash` entry point that brings up a
Forgejo Society forge with one command — a great banner, a short host
preflight, a guided set of options, and a hand-off to the full installer
in [`../scripts/`](../scripts/README.md).

This is the friendly front door. It does not reimplement the installer;
it collects a few choices, downloads the suite, and runs
[`../scripts/install.sh`](../scripts/install.sh) with the options you
picked. Everything the bootstrap asks maps onto an environment variable
that the suite already understands, so the one-liner and the
component-by-component guides stay in sync.

---

## One line

On a fresh Ubuntu 24.04 LTS host:

```bash
curl -fsSL https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY-INSTALLATION/bootstrap/install.sh | bash
```

The bootstrap prints a banner, checks the host, offers a profile
(LAN / public HTTPS / custom), shows a plan, asks you to confirm, then
installs the forge.

### Non-interactive (scripted) use

When stdin is a pipe, prompts read from the terminal at `/dev/tty`. To
skip every prompt and drive the install entirely from the environment,
set `FS_NONINTERACTIVE=1`:

```bash
curl -fsSL <url>/install.sh | FS_NONINTERACTIVE=1 FORGE_PORT=3000 bash
```

Preview without changing the host:

```bash
curl -fsSL <url>/install.sh | FS_NONINTERACTIVE=1 FS_BOOTSTRAP_DRY_RUN=1 bash
```

---

## What it does

1. **Banner and preflight.** Confirms the host is Linux with `apt`, and
   warns if it is not Ubuntu.
2. **Options.** Offers three profiles:
   - **LAN forge** — `http://<ip>:3000`, no TLS.
   - **Public forge** — automatic HTTPS via Caddy for a domain you name.
   - **Custom** — answer every question (port, domain, admin, runner,
     firewall, fail2ban).
3. **Plan and confirm.** Prints the planned URL, admin account, runner,
   firewall, source, and mode, then asks you to type `YES`.
4. **Fetch.** Downloads the repository archive for `FS_REF` and locates
   `FORGEJO-SOCIETY-INSTALLATION/scripts/` within it.
5. **Hand off.** Runs `scripts/install.sh install` (or `--dry-run`),
   forwarding your options as environment variables, with `sudo` when
   not already root.

After the hand-off, the suite's own idempotent install, receipt, and
`verify` / `doctor` / `repair` subcommands take over. See
[`../scripts/README.md`](../scripts/README.md).

---

## Configuration

| Variable | Default | Meaning |
| --- | --- | --- |
| `FS_NONINTERACTIVE` | `0` | Skip all prompts; use defaults and exported variables. |
| `FS_BOOTSTRAP_DRY_RUN` | `0` | Preview the plan; hand off with `--dry-run`. |
| `FS_REPO` | `japer-technology/forgejo-society` | Source repository to download. |
| `FS_REF` | `main` | Branch, tag, or commit to fetch. |
| `FS_LOCAL_SUITE` | _(unset)_ | Path to an existing `scripts/` checkout; skip the download. |
| `FORGE_PORT` | `3000` | Forgejo HTTP port. |
| `FORGE_DOMAIN` | _(unset)_ | If set, enable Caddy + automatic HTTPS for this name. |
| `FORGE_ADMIN_USER` | `forgejo-admin` | Initial admin username. |
| `FORGE_ADMIN_EMAIL` | `admin@example.org` | Initial admin email. |
| `FS_WITH_RUNNER` | `0` | Also install a Forgejo Actions runner here. |
| `FS_RUNNER_LABELS` | `default` | Comma-separated runner labels. |
| `FS_ENABLE_FIREWALL` | `1` | Configure UFW. |
| `FS_ENABLE_FAIL2BAN` | `1` | Enable fail2ban. |
| `FS_COLOR` | `auto` | Colour policy: `auto`, `always`, or `never` (`NO_COLOR` honoured). |

These forge variables are forwarded verbatim to
[`../scripts/install.sh`](../scripts/install.sh); see its README for the
complete list it accepts.

---

## Safety

Piping a script into a shell runs code you have not read. Before
trusting this one-liner:

- Read this file and [`install.sh`](install.sh) first, or
- Download, inspect, then run:

  ```bash
  curl -fsSLO https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY-INSTALLATION/bootstrap/install.sh
  less install.sh
  bash install.sh
  ```

The bootstrap needs `sudo` only at the hand-off, to run the forge
installer; it does no privileged work itself.

---

## Compliance posture

Per the repository's [`WARNING.md`](../../WARNING.md), agent workloads
must execute on **self-hosted Forgejo on owned Ubuntu hardware**. This
bootstrap installs a forge you own and run, on hardware you control. It
downloads only from the project repository, does not push code, secrets,
or runners to shared infrastructure, and does not configure GitHub
Actions for agent workloads.

---

## Relationship to the rest of this folder

- [`../scripts/`](../scripts/README.md) — the installer suite this
  bootstrap downloads and runs (`install` / `verify` / `doctor` /
  `repair` / `uninstall`). Use it directly from a checkout if you prefer.
- [`../easy-install/`](../easy-install/README.md) — the two-script
  Forgejo + runner installer the suite's commands derive from.
- [`../install/`](../install/00-index.md) and
  [`../transition-plan/`](../transition-plan/00-overview.md) — the
  component-by-component guides and the full multi-host rollout plan.
  For a production society, follow those.
