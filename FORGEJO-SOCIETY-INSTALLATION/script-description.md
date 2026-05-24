# Ubuntu Zombie

A Ubuntu PC managed by AI SysOps.

Run it on the fresh Ubuntu machine from the physical console:

```bash
chmod +x ai-full-control-ubuntu.sh
sudo ./ai-full-control-ubuntu.sh
```

After it finishes:

```bash
sudo reboot
```

Then connect only through Tailscale:

```bash
ssh agent@<tailscale-ip-or-name>
```

Verify the install:

```bash
/opt/ai-full-control/bin/verify
```

Add your cloud LLM keys here:

```bash
nano /opt/ai-full-control/secrets/env
```

Emergency desktop access stays private:

```bash
ssh -L 5900:localhost:5900 agent@<tailscale-ip-or-name>
```

Then connect your VNC viewer to:

```text
localhost:5900
```

This script sets up the machine for full AI control across terminal, OS, apps, browser, GUI, Docker, and networking while keeping inbound access private to Tailscale.

