# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, **do not open a public issue.** Contact the maintainers privately.

## Security Documentation

Security documentation is maintained in the `.github-nanoclaw-intelligence/docs/` directory.

## Security Model

NanoClaw Intelligence inherits NanoClaw's core security philosophy: **secure by isolation**. Agents run in container-sandboxed environments with filesystem isolation — they can only access explicitly mounted directories. This provides OS-level security rather than application-level permission checks.

## Supported Versions

Only the latest version on the `main` branch is actively supported with security updates.
