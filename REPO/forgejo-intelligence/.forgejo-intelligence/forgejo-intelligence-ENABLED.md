# .forgejo-intelligence 🦞 Enabled

### Delete or rename this file to disable .forgejo-intelligence

<p align="center">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-intelligence/main/.forgejo-intelligence/logo.png" alt="Issue Intelligence" width="500">
  </picture>
</p>

## File existence behavior

All `forgejo-intelligence-*` workflows run `.forgejo-intelligence/lifecycle/forgejo-intelligence-ENABLED.ts` as the first blocking guard step. If this file is missing, the guard exits non-zero and prints:

> Issue Intelligence disabled by missing forgejo-intelligence-ENABLED.md

That fail-closed guard blocks all subsequent ISSUE-INTELLIGENCE workflow logic.
