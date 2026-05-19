# Git hosts with native CI/CD execution capability

## Strong match: Git forge + native CI/CD runners/agents

| Platform                          | CI/CD system                                             | Runner / agent model                             | Notes                                                                                                                                                         |
| --------------------------------- | -------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub**                        | GitHub Actions                                           | GitHub-hosted runners + self-hosted runners      | Baseline model: workflow files in repo, jobs executed by runners. GitHub documents both hosted and self-hosted runners. ([GitHub Docs][1])                    |
| **GitLab**                        | GitLab CI/CD                                             | GitLab-hosted runners + self-managed runners     | Very mature. Jobs run from `.gitlab-ci.yml` through GitLab Runner. ([GitLab Documentation][2])                                                                |
| **Bitbucket Cloud**               | Bitbucket Pipelines                                      | Atlassian-hosted Pipelines + self-hosted Runners | Native CI/CD inside Bitbucket; self-hosted runners run Pipelines on your infrastructure. ([Atlassian Support][3])                                             |
| **Azure DevOps / Azure Repos**    | Azure Pipelines                                          | Microsoft-hosted agents + self-hosted agents     | Git repos plus YAML pipelines; Microsoft calls the execution machines “agents,” not runners. ([Microsoft Learn][4])                                           |
| **Codeberg**                      | Codeberg CI / Woodpecker CI; Forgejo Actions self-hosted | Woodpecker agents; Forgejo self-hosted runners   | Codeberg documents Woodpecker-based CI and also Forgejo Actions for self-hosted CI/CD. ([Codeberg Documentation][5])                                          |
| **Forgejo**                       | Forgejo Actions                                          | Forgejo Runner                                   | Strong sovereign/self-hosted match. Forgejo Actions reads workflows from `.forgejo/workflows`, while Forgejo Runner fetches and executes them. ([Forgejo][6]) |
| **Gitea**                         | Gitea Actions                                            | Act Runner / Gitea Runner                        | Built-in CI/CD since Gitea 1.19; jobs are delegated to runners. ([Gitea Documentation][7])                                                                    |
| **SourceHut**                     | builds.sr.ht                                             | SourceHut build jobs / build manifests           | Not branded as “runners,” but functionally similar: repo-triggered builds from `.build.yml` manifests on SourceHut build infrastructure. ([SourceHut][8])     |
| **Harness Open Source / Gitness** | Harness / Gitness pipelines                              | Integrated pipeline engine                       | Open-source Git forge with code hosting, CI/CD pipelines, dev environments, and artifact registries. ([Harness Developer Hub][9])                             |

## Partial / adjacent match

| Platform                                      | Why partial                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AWS CodeCommit + CodeBuild + CodePipeline** | CodeCommit is the Git repo host; CodeBuild is the managed build executor. Together they form a CI/CD stack, but CodeCommit itself does not have a GitHub Actions-style runner layer built directly into the forge UI. CodeBuild is a managed build service that runs tests/builds and removes the need to manage build servers. ([Amazon Web Services, Inc.][10]) |
| **Amazon CodeCatalyst**                       | It had integrated repos and CI/CD workflows, but AWS closed new customer access from **7 November 2025** and says it does not plan new features. Treat as legacy, not a greenfield choice. ([AWS Documentation][11])                                                                                                                                              |
| **Launchpad**                                 | Has a build farm that can run package/snap-related builds from Git changes, but it is not a general-purpose GitHub Actions-like runner platform. ([Ubuntu Documentation][12])                                                                                                                                                                                     |

## Not a strong match

These are Git/repo hosting or forge-adjacent platforms, but I would **not** count them as having native GitHub-like runners:

| Platform                        | Reason                                                                                                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SourceForge**                 | Git hosting/project hosting, but no current native GitHub Actions-like runner model verified.                                                                                      |
| **GNU Savannah**                | Free-software forge, but no native general CI/CD runner layer verified. ([Savannah][13])                                                                                           |
| **RhodeCode**                   | Supports CI integrations via Jenkins, Bamboo, TeamCity, Travis CI, CircleCI-style webhooks, but that is integration with external CI rather than native runners. ([RhodeCode][14]) |
| **Assembla**                    | Repo/project hosting, but no native GitHub Actions-like runner system verified.                                                                                                    |
| **Perforce Helix TeamHub**      | Git/SVN/Mercurial repository hosting, but no native runner model verified. ([Perforce][15])                                                                                        |
| **JetBrains Space / SpaceCode** | Space had CI/CD historically, but JetBrains discontinued Space/SpaceCode paths; not a current candidate. ([devclass][16])                                                          |

## Clean definitive shortlist

For a Forgejo Society-style architecture, the meaningful set is:

**GitHub, GitLab, Bitbucket, Azure DevOps, Codeberg, Forgejo, Gitea, SourceHut, Harness Open Source/Gitness, AWS CodeCommit+CodeBuild, Amazon CodeCatalyst legacy, Launchpad specialized.**

For **sovereign / owned hardware / owned forge / owned runners**, the best-fit subset is:

**Forgejo, Gitea, GitLab Self-Managed, SourceHut self-hosted components, Harness Open Source/Gitness, Codeberg with self-hosted Forgejo Actions runners.**

[1]: https://docs.github.com/en/actions/concepts/runners?utm_source=chatgpt.com "GitHub Actions Runners"
[2]: https://docs.gitlab.com/ci/runners/?utm_source=chatgpt.com "Runners | GitLab Docs"
[3]: https://support.atlassian.com/bitbucket-cloud/docs/runners/?utm_source=chatgpt.com "Runners | Bitbucket Cloud | Atlassian Support"
[4]: https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/agents?view=azure-devops&utm_source=chatgpt.com "Azure Pipelines Agents - Azure Pipelines | Microsoft Learn"
[5]: https://docs.codeberg.org/ci/?utm_source=chatgpt.com "Working with Codeberg's CI | Codeberg Documentation"
[6]: https://forgejo.org/docs/latest/admin/runner-installation/?utm_source=chatgpt.com "Forgejo Actions administrator guide | Forgejo – Beyond coding. We forge."
[7]: https://docs.gitea.com/usage/actions/?utm_source=chatgpt.com "Actions | Gitea Documentation"
[8]: https://srht.site/automating-deployments/?utm_source=chatgpt.com "Automating deployments | sourcehut pages"
[9]: https://developer.harness.io/docs/open-source/?utm_source=chatgpt.com "Open Source | Harness Developer Hub"
[10]: https://aws.amazon.com/blogs/devops/aws-codecommit-returns-to-general-availability/?utm_source=chatgpt.com "The Future of AWS CodeCommit | AWS DevOps & Developer Productivity Blog"
[11]: https://docs.aws.amazon.com/codecatalyst/latest/userguide/workflow.html?utm_source=chatgpt.com "Build, test, and deploy with workflows - Amazon CodeCatalyst"
[12]: https://documentation.ubuntu.com/launchpad/developer/reference/services/build-farm/?utm_source=chatgpt.com "Build farm - Launchpad Manual"
[13]: https://savannah.gnu.org/?utm_source=chatgpt.com "GNU Savannah"
[14]: https://rhodecode.com/integrations?utm_source=chatgpt.com "RhodeCode › Integrations Directory"
[15]: https://www.perforce.com/products/helix-teamhub?utm_source=chatgpt.com "Source Code Repository Software | Perforce TeamHub | Perforce Software"
[16]: https://www.devclass.com/ci-cd/2024/05/28/customers-protest-as-jetbrains-ends-space-collaboration-platform-intros-spacecode-as-partial-alternative/1631438?utm_source=chatgpt.com "Customers protest as JetBrains ends Space collaboration ... - DEVCLASS"
