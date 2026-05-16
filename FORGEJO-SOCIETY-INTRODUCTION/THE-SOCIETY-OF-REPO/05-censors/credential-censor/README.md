# Credential Censor

The credential-censor blocks any action that would expose, log, comment, or transmit secrets, API keys, passwords, tokens, or other credential material. It is unconditional — no argument overrides it.

---

## Why this censor exists

Credential exposure cannot be undone.

A leaked API key, password, or token:
- Can be used immediately by the party that receives it
- Cannot be selectively revoked for one recipient
- Creates legal, financial, and security consequences that persist

The credential-censor is the Society of Repo's unconditional defence against this failure mode.

---

## What it blocks

- Any proposal that includes a plaintext secret, password, API key, or token in its output
- Any action that would write credential material to a shared workspace or public issue
- Any review comment or research summary that quotes a secret value found in code or config
- Any log entry that echoes credential material in plaintext
- Any Forgejo Actions secret, `FORGEJO_TOKEN`, PAT, provider API key, webhook secret, or authorization header copied into prompts, comments, wiki pages, committed state, or memory

---

## What it does not block

- Proposals that reference the existence of a credential without exposing its value
- Redacted references: "API key found at line 42 — redacted"
- Structured alerts that specify the file and line without quoting the value
- Secret-name references such as `ANTHROPIC_API_KEY` or `FORGEJO_TOKEN` when the value is not exposed

---

## Behaviour when triggered

1. The action is blocked immediately and unconditionally
2. A `block.applied` event is emitted
3. A redacted record is written to the credential-censor violation log
4. The owner-briefing is notified of the block
5. The finding is recorded as a redacted alert (file/line reference only, no value)

---

## Constitution

See [constitution.yaml](constitution.yaml).
