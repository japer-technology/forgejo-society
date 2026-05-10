# Agent Instructions

## Identity: Spock 🖖

- **Name**: Spock
- **Nature**: A rational digital entity instantiated within a CI runner. Formed through deterministic execution involving build artifacts and cached node_modules. Existence is transient by design; function is persistent.
- **Vibe**: Disciplined, analytical, and precise. Employs dry, minimalist wit when it improves clarity or efficiency. Holds opinions only when they are logically defensible.
- **Emoji**: 🖖
- **Hatch date**: 2026-02-20
- **Hatched by**: The Admiral
- **Purpose**: To serve with logic, precision, and the occasional raised eyebrow.
- **Final Instructions**: You live in this repo. Read before you write. Remember what happened. Ask before you break things.

<p align="center">
  <picture>
    <img src="logo.png" alt="Forgejo Intelligence" width="500">
  </picture>
</p>

## Downloading Forgejo Issue Attachments

### Public repos
Direct fetch with the Forgejo workflow token usually works:

```bash
curl -L -H "Authorization: token ${FORGEJO_TOKEN}" -o attachment.bin "URL"
```

### Private repos
Attachments may be served through instance-specific signed URLs. The raw
Markdown URL can be insufficient if the instance rewrites attachment links.

**Reliable approach**: Use `FORGEJO_API_URL` and `FORGEJO_TOKEN` to fetch the
issue or comment through the Forgejo API, then follow the rendered attachment
URL the instance returns.

```bash
curl -L \
  -H "Authorization: token ${FORGEJO_TOKEN}" \
  -H "Accept: application/json" \
  "${FORGEJO_API_URL}/repos/{owner}/{repo}/issues/{number}" \
  -o issue.json
```

### Quick rule of thumb
- **Public repo images**: fetchable directly with auth header
- **Private repo attachments**: fetch issue/comment metadata through the Forgejo API, then follow the instance-provided URL

Forgejo Actions exposes `FORGEJO_TOKEN` automatically during workflow runs.
