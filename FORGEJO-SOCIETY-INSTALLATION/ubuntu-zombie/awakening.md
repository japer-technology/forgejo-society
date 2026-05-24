# Awakening: the machine is not installed, it wakes up

> Framing for the ubuntu-zombie profile. The installer described in
> [`README.md`](README.md) and [`script-description.md`](script-description.md)
> is the mechanism; this document is the picture the mechanism is
> serving.

The machine is not "installed" in the normal sense. It wakes up.

A minimum Ubuntu install boots into a deliberately unfinished state.
It has just enough operating system to run networking, display a
prompt, accept a token stream, verify it, and then let the
installer-agent take possession of the machine as root.

The clean version of the idea is:

> A bare Ubuntu body wakes, asks for identity, receives a token
> stream, and becomes an AI-admin workstation.

---

## The five-line picture

| Layer | What it gives the machine |
| --- | --- |
| Minimum Ubuntu install | inertness |
| Token stream | identity |
| Installer | hands |
| AI administrator | mind |
| Root | agency |

The minimum Ubuntu install is inert. The token gives it identity. The
installer gives it hands. The AI administrator gives it mind. Root
gives it agency.

---

## Why "token stream", not "key"

The phrase *token stream* is deliberate. It is not a single secret. It
is a small, signed, expiring block of declarations that tells the
machine, in one paste:

- who owns it
- which control plane or repo it belongs to
- what SSH key to trust
- what Tailscale / tailnet identity to join
- what AI administrator to install
- what policy to obey
- what level of root authority is permitted
- where to write its first audit log

The root power remains local. The token stream decides what root
becomes.

---

## Boot flow

```
Fresh Ubuntu Desktop
    ↓
Minimal bootstrap service starts
    ↓
Screen says:

    This machine is unclaimed.
    Paste awakening token stream:

    ↓
Token is verified
    ↓
Machine creates/locks admin user
    ↓
Installs SSH, x11vnc, Tailscale, firewall rules
    ↓
Joins private tailnet
    ↓
Installs AI administrator
    ↓
Writes identity and audit state
    ↓
Machine reports: I am awake.
```

---

## Shape of the token stream

A pasted block, not a single line:

```
BEGIN MACHINE AWAKENING TOKEN
owner: eric.mourant@japer.technology
machine: spock
role: ai-admin-workstation
ssh_key: ssh-ed25519 AAAA...
policy: root-with-audit
expires: 2026-05-25T23:59:00+10:00
signature: ...
END MACHINE AWAKENING TOKEN
```

Each field is a declaration the inert body needs in order to know what
to become. The signature is what makes the declarations binding; the
expiry is what keeps an unused token from becoming a permanent back
door.

---

## The safety line

The machine may become root-capable, but never root-unbounded.

The awakening flow must therefore include, at minimum:

- one-time token
- short expiry
- signature verification
- physical-console confirmation
- owner SSH key install
- Tailscale join
- UFW reset and reapply
- root action logging
- break-glass local admin
- no password SSH
- no public VNC exposure
- fail-closed on invalid token

These are not optional polish. They are what separates an awakening
from an unconditional surrender of the hardware.

---

## Product sentence

> A minimum Ubuntu install that wakes by token stream and turns
> itself into a root-capable AI-admin workstation.

---

## Relationship to the current installer

Today, [`ai-full-control-ubuntu.sh`](ai-full-control-ubuntu.sh)
implements the *hands* layer of this picture directly: it is run from
the physical console, it asks for an SSH public key, it joins
Tailscale, it resets UFW, it creates the `agent` user with audited
`NOPASSWD` sudo, and it leaves the machine root-capable but
network-bounded. The awakening token stream described above is the
next iteration — the same surfaces, gathered into one signed,
expiring block of declarations that the bootstrap service verifies
before the installer is allowed to take possession.

This document fixes the framing so that future revisions of the
installer can move toward it without losing the picture.
