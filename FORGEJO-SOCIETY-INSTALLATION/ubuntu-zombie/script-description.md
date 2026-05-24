# Ubuntu Zombie: installer quick reference

A short operator quick-reference for `ai-full-control-ubuntu.sh`. For
the full description of what the script does, the security posture,
and how to undo it, see [`README.md`](README.md).

Run on a fresh Ubuntu Desktop, from the **physical** console:

```bash
chmod +x ai-full-control-ubuntu.sh
sudo ./ai-full-control-ubuntu.sh
```

When it finishes:

```bash
sudo reboot
```

Connect over Tailscale only:

```bash
ssh agent@<tailscale-ip-or-name>
```

Verify the install:

```bash
/opt/ai-full-control/bin/verify
```

Add your cloud LLM keys:

```bash
nano /opt/ai-full-control/secrets/env
```

Start the persistent agent shell:

```bash
/opt/ai-full-control/bin/agent-shell
```

Emergency real-desktop access stays private — open an SSH tunnel,
then point a VNC viewer at `localhost:5900`:

```bash
ssh -L 5900:localhost:5900 agent@<tailscale-ip-or-name>
```

The script provisions one machine for AI control across terminal, OS,
apps, browser, GUI, Docker, and networking while keeping all inbound
access private to Tailscale. The machine is the operator workstation
from which a Forgejo Society deployment — forge, runner fleet,
agencies — is shepherded.
