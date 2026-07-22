# Forgejo Intelligence Aspiration

Forgejo Intelligence exists to make a repository feel quietly more capable
without moving trust outside the repository.

The aspiration is not to bolt a chatbot onto Forgejo. It is to let an agent
participate through the same surfaces humans already use: issues, pull
requests, labels, releases, wiki pages, commits, and Actions runs. The agent
should leave normal, reviewable traces.

## Design Commitments

Presence is permission.

If a capability folder exists under `.forgejo-intelligence/`, the repository is
declaring that capability. The enabled set should be readable with `ls`, not
hidden in an external dashboard.

Absence is denial.

Removing a folder should be enough to remove that class of behavior. Removing
the sentinel file should stop all automation.

State lives in git.

Conversation memory, session mappings, configuration, and capability choices
belong in the repository history. That makes behavior reviewable, portable, and
recoverable.

The repository is the audit trail.

The agent should act through Forgejo APIs, normal comments, ordinary commits,
and visible workflow logs. When it changes something, maintainers should be
able to see what changed and why.

Forgejo is not a fallback target.

The runtime should be shaped around Forgejo Actions, Forgejo event payloads,
Forgejo repository units, and Forgejo API authentication. GitHub compatibility
is a migration concern, not the product identity.

## Human Shape

The best version of this system does not ask maintainers to learn a strange new
control panel. They keep opening issues, reviewing pull requests, tagging
releases, writing wiki pages, and pushing commits. The agent listens where
those activities already happen and responds in place.

That means the agent should be legible:

- It should say what it did.
- It should keep state where maintainers can inspect it.
- It should decline work when a surface is disabled.
- It should fail closed when configuration is incomplete.
- It should treat fork pull requests and secrets with real suspicion.

## Boundaries

Forgejo Intelligence should be honest about instance differences. Some Forgejo
installations expose different repository units, API behavior, or Actions
configuration. A surface should only claim support when the runtime has a
fixture, handler path, and clear API behavior for that feature.

Unsupported GitHub-only surfaces should stay archived or be replaced by
Forgejo-native workflows. False parity is worse than a clear boundary.
