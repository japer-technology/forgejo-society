# Phase 9 Status Report

- Date: 2026-07-22
- Scope: documentation cutover for the Forgejo-native runtime
- Gate: `.forgejo-intelligence/tests/scripts/check-phase9.sh`,
  `.forgejo-intelligence/tests/phase9-docs.test.ts`

## Outcome

Phase 9 is complete. The repository documents the Forgejo Intelligence
runtime from Forgejo paths alone.

## What changed

- The root `README.md` carries a Forgejo Intelligence quick start: the
  installer command, the live workflow path, the enable sentinel, the
  install config, token wiring, and the active surface list.
- `WHAT.md` and `.ASPIRATION.md` exist at the repository root and describe
  the operational model and design commitments without treating any
  external code-hosting platform as infrastructure.
- `.forgejo-intelligence/help/` covers installation, configuration,
  migration, unsupported GitHub-only surfaces, security, and local
  development against a disposable Forgejo instance.
- GitHub-only capabilities are documented as archived under
  `archive/github-only/`, with outcomes recorded in
  `.forgejo-intelligence/help/unsupported-github-surfaces.md`.
- Documentation no longer references `raw.githubusercontent.com` for
  repository assets; the logo is referenced by relative path so the
  repository renders identically on any forge.

## Verification

- `bun test tests/phase9-docs.test.ts` passes.
- `bash .forgejo-intelligence/tests/scripts/check-phase9.sh` passes.
