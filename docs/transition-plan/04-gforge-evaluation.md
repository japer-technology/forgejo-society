# GForge Evaluation

GForge is an older open-source project forge that was widely used in institutional
and enterprise settings. Treat it as an evaluated option, not the default path.

---

## Role in the exit plan

- Candidate for institutional or specialized hosting requirements.
- Reference point for comparing governance, project management, and compliance needs.

---

## Evaluation questions

| Question | Notes |
|---|---|
| Does GForge solve a requirement that Forgejo, Codeberg, GitLab, or Bitbucket cannot? | Identify the specific gap before proceeding. |
| Is its operational cost (hosting, licensing, maintenance) justified? | Compare against Forgejo, which is free and self-hosted. |
| Does it improve long-term independence or increase vendor dependence? | Evaluate export and migration paths out of GForge. |
| Does it have active development and security updates? | Check the upstream project activity before committing. |

---

## Evaluation checklist

- [ ] Compare repository, issue, release, and permission models against Forgejo.
- [ ] Confirm Git-compatible clone, push, and pull URLs work with standard `git`.
- [ ] Compare migration effort and data fidelity when importing from GitHub.
- [ ] Compare hosting, licensing, and maintenance costs over a 3-year horizon.
- [ ] Evaluate export paths: can you extract all data from GForge cleanly?
- [ ] Check whether GForge supports CI/CD or runner integrations.

---

## Decision rule

Use GForge only if it clearly satisfies a requirement that the simpler open path
cannot cover. The default answer is **no** — use Forgejo.

---

## Open decisions

- [ ] Has a specific institutional requirement been identified that mandates GForge evaluation?
