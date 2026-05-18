# Security Policy

Forgejo Society is documentation-first, but it describes and contains a
write-capable Forgejo runtime. Security reports are therefore handled carefully,
even when the affected file is prose.

Before testing or reporting anything runtime-related, read [WARNING.md](WARNING.md)
and the four linked compliance and warning documents. Do not enable workflows,
attach runners, configure secrets, or exercise agent behaviour on GitHub or on a
shared Forgejo instance.

---

## Private Disclosure Channel

Do not report vulnerabilities involving credentials, private data, bypasses,
runner access, or executable agent behaviour in a public issue.

Use a private report on the maintainers' self-hosted Forgejo instance when that
surface is available. If you are reading this repository from a mirror that does
not provide private reporting, contact the maintainers through the private
contact method listed on the canonical Forgejo project profile and include
`Forgejo Society security disclosure` in the subject or opening line.

If no private contact channel is available to you, open a public issue that says
only that you need a private security contact. Do not include exploit details,
secrets, logs, personal data, screenshots, or reproduction steps in that public
issue.

---

## In Scope

Security reports are in scope when they concern:

- The runnable Forgejo runtime under
  [FORGEJO-SOCIETY/forgejo-intelligence/](FORGEJO-SOCIETY/forgejo-intelligence/),
  including `.forgejo/workflows/` and `.forgejo-intelligence/`.
- Workflow, runner, token, secret, or permission boundaries described in this
  repository.
- Censor, critic, agency, rights, approval-gate, or authority bypasses that
  would allow an action outside the Society of Repo model.
- Data egress, credential exposure, log exposure, or private-record handling in
  the planned or implemented runtime.
- Documentation that could cause a maintainer to run the system on the wrong
  forge, configure unsafe secrets, attach an unsafe runner, or weaken the
  warning and compliance posture.

---

## Out of Scope

The following are usually out of scope for private security handling:

- Spelling, grammar, broken links, or ordinary documentation corrections that do
  not create an unsafe operational instruction.
- Vulnerabilities in upstream Forgejo, Git, Bun, TypeScript, Ubuntu, or hosted
  forge platforms unless this repository adds a project-specific unsafe
  configuration.
- Historical precursor material under
  [FORGEJO-SOCIETY-INTRODUCTION/precursors/](FORGEJO-SOCIETY-INTRODUCTION/precursors/)
  unless it is being reactivated or copied into the Forgejo runtime.
- Reports based only on social engineering, spam, denial-of-service, or testing
  against infrastructure you do not own or have explicit permission to test.
- Findings that require enabling prohibited runtime surfaces on GitHub or shared
  Forgejo infrastructure.

When in doubt, report privately with minimal detail first and wait for
maintainer guidance.

---

## Response SLAs

Maintainers aim to follow these response targets:

| Stage | Target |
| --- | --- |
| Acknowledge receipt | Within 3 business days |
| Initial triage | Within 7 calendar days |
| Severity and scope decision | Within 14 calendar days |
| Critical or high remediation target | Within 30 calendar days, where a fix is within project control |
| Medium or low remediation target | Within 90 calendar days, where a fix is within project control |

Some reports may depend on upstream projects, local hardware access, or a
governance settlement. In those cases, maintainers will provide a status update
and identify the blocking dependency rather than treating the SLA as silent
permission to publish details.

---

## Coordinated Disclosure

Please give maintainers a reasonable opportunity to investigate and remediate
before public disclosure. Do not publish exploit details, proof-of-concept code,
private logs, or secret material until maintainers have confirmed that public
disclosure is appropriate or the coordinated disclosure timeline has been
agreed.

Maintainers may publish a security note, changelog entry, governance record, or
settlement summary after remediation. Private details that are not needed for
public understanding should remain private.

---

## Safe Research Rules

- Test only systems you own or have explicit permission to test.
- Do not run agent workloads on GitHub or shared Forgejo infrastructure.
- Do not attempt to access private data, secrets, tokens, or maintainer
  infrastructure.
- Stop testing and report privately if you encounter credentials, personal data,
  or a plausible authority bypass.
- Preserve enough detail for reproduction, but redact secrets and personal data.

<p align="right">
  <picture>
    <img src="https://raw.githubusercontent.com/japer-technology/forgejo-society/main/FORGEJO-SOCIETY/FORGEJO-SOCIETY.png" alt="Forgejo Society" width="80" title="Forgejo Society">
  </picture>
</p>
