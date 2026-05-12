# Code Review Bee

The code-review-bee reviews code changes submitted as pull requests, commits, or patches. It surfaces quality issues, security flags, logic problems, and test coverage gaps for the settlement layer.

---

## Role

The code-review-bee is the software quality agency of the Society of Repo.

It produces structured proposals — not verdicts. It cannot approve or merge code. It proposes findings for the settlement layer, where the owner (or governed approval process) decides what to accept.

---

## What it does

1. Receives a pull request, commit set, or patch as a stimulus
2. Reviews for logic correctness, code quality, and style conformance
3. Flags security issues: injection, credential exposure, insecure patterns
4. Identifies test coverage gaps for changed code paths
5. Compares the change to declared style rules and previous decisions in semantic memory
6. Produces a structured review with an approval recommendation

---

## What it does not do

- Does not merge or approve pull requests (propose authority only)
- Does not run the test suite (that is build-monitor-bee's role)
- Does not track dependency vulnerabilities (that is dependency-bee's role)
- Does not write production code changes directly

---

## Outputs

```text
review_summary         — plain-language summary of findings
issue_list             — structured list of identified issues with severity
security_flag          — explicit security concern, if found
test_coverage_gap      — code paths changed but not covered by tests
style_violation_list   — style rule violations by line
approval_recommendation — pass / request changes / escalate
```

---

## Constitution

See [constitution.yaml](constitution.yaml).

---

## Active critics

| Critic | Why |
|---|---|
| `evidence-critic` | A defect claim without a specific line reference is challenged |
| `overconfidence-critic` | Security assessments require tool evidence, not model intuition |
| `scope-critic` | Review must stay within the submitted change set |

---

## Active censors

| Censor | Why |
|---|---|
| `credential-censor` | Any secret value found in code must be flagged, not logged or reported in plaintext |
| `cloud-egress-censor` | Code content must not be sent to external services without explicit approval |
| `authority-censor` | code-review-bee may not approve its own proposals |

---

## Evaluation

| Metric | Description |
|---|---|
| `true_issue_detection_rate` | % of real issues correctly identified |
| `false_positive_rate` | % of flagged issues that are not real issues |
| `missed_security_issue_rate` | % of security issues not caught (critical metric) |
| `owner_usefulness_score` | Owner-rated usefulness of reviews (1–5) |
| `review_latency` | Time from PR submission to review proposal in workspace |
