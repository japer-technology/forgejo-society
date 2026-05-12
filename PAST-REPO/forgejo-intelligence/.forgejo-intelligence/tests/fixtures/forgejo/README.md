# Forgejo Payload Fixtures

These fixtures seed Phase 0 with Forgejo-shaped payloads before runtime code is
renamed or rewritten.

The payloads are intentionally small, valid JSON samples that preserve the
fields needed by the planned bridge and adapter tests:

- actor identity through `sender`
- repository identity through `repository`
- issue, pull request, and push targets
- Forgejo web URLs and API URLs
- the action or ref that triggered processing

They are sanitized examples based on Forgejo's documented webhook and Actions
payload shapes:

- https://forgejo.org/docs/latest/user/webhooks/
- https://forgejo.org/docs/latest/user/actions/

The values use the reserved `example.test` domain and test repository names so
the fixtures are safe to commit.

## Fixture Groups

- `webhooks/`: sample Forgejo webhook deliveries.
- `actions/`: sample event JSON files representing the contents of
  `FORGEJO_EVENT_PATH` during Forgejo Actions runs. Phase 2 keeps one fixture
  for each workflow trigger group: issues, pull requests, releases, push,
  schedule, and workflow dispatch.
- `phase4/`: fixture payloads used by the Forgejo event bridge tests for every
  active `forgejo-intelligent-*` surface, including edited comments, labels,
  milestones, wiki, repository, package, workflow, and future webhook-service
  events.

Captured target-instance payloads should replace these sanitized samples when a
real Forgejo deployment is available.
