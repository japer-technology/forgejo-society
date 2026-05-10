import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import {
  getEventSurfaceMap,
  normalizeEvent,
  resolveSurface,
} from "../forgejo-intelligence-bridge/bridge";
import { validateEvent } from "../forgejo-intelligence-guardrail/guardrail";

const repoRoot = resolve(import.meta.dir, "..", "..");
const fixtureRoot = resolve(repoRoot, ".forgejo-intelligence", "tests", "fixtures", "forgejo");
const repository = "octo/widgets";

function readFixture(path: string): Record<string, any> {
  return JSON.parse(readFileSync(resolve(fixtureRoot, path), "utf-8"));
}

describe("Phase 4 Forgejo event normalization", () => {
  const cases = [
    {
      platformEvent: "workflow_run",
      fixture: "phase4/workflow-run-completed.json",
      surface: "action",
      eventKind: "action",
      title: "forgejo-intelligence-WORKFLOW-AGENT",
      number: 17,
      metadata: { runId: 9100, runNumber: 24, conclusion: "success", branch: "main" },
    },
    {
      platformEvent: "create",
      fixture: "phase4/branch-created.json",
      surface: "branch",
      eventKind: "branch",
      title: "cache-persistence",
      number: null,
      metadata: { ref: "cache-persistence", refType: "branch" },
    },
    {
      platformEvent: "code_review_comment",
      fixture: "phase4/code-review-comment.json",
      surface: "pull-request",
      eventKind: "pull-request-comment",
      title: "Persist widget cache between restarts",
      body: "This lock should be held for the shortest possible scope.",
      number: 17,
      metadata: { commentId: 8300, path: "internal/cache/store.go" },
    },
    {
      platformEvent: "dev_environment",
      fixture: "phase4/dev-environment-started.json",
      surface: "dev-environment",
      eventKind: "dev-environment",
      title: "Cache debug workspace",
      number: null,
      metadata: { devEnvironmentName: "cache-debug-workspace", machine: "standard-2", owner: "ada" },
    },
    {
      platformEvent: "push",
      fixture: "actions/push-event.json",
      surface: "commit",
      eventKind: "push",
      title: "Cache widget metadata on disk",
      number: null,
      metadata: { branch: "main", commitCount: 1, headCommit: "c0ffee00c0ffee00c0ffee00c0ffee00c0ffee00" },
    },
    {
      platformEvent: "fork",
      fixture: "phase4/fork-created.json",
      surface: "fork",
      eventKind: "fork",
      title: "grace/widgets",
      number: null,
      metadata: { forkFullName: "grace/widgets", parentFullName: "octo/widgets" },
    },
    {
      platformEvent: "issues",
      fixture: "actions/issues-opened-event.json",
      surface: "issue",
      eventKind: "issue",
      title: "Widget cache misses after restart",
      number: 42,
      metadata: { state: "open", labels: ["bug"] },
    },
    {
      platformEvent: "issues",
      fixture: "phase4/issue-comment-edited.json",
      surface: "issue",
      eventKind: "issue-comment",
      title: "Widget cache misses after restart",
      body: "I can reproduce this on the staging instance.",
      number: 42,
      metadata: { commentId: 8100, changedFields: ["body"] },
    },
    {
      platformEvent: "label",
      fixture: "phase4/label-created.json",
      surface: "label",
      eventKind: "label",
      title: "cache",
      number: null,
      metadata: { labelName: "cache", color: "1d76db" },
    },
    {
      platformEvent: "milestone",
      fixture: "phase4/milestone-opened.json",
      surface: "milestone",
      eventKind: "milestone",
      title: "1.4 cache hardening",
      number: 14,
      metadata: { milestoneNumber: 14, openIssues: 3, closedIssues: 1 },
    },
    {
      platformEvent: "notification",
      fixture: "phase4/notification-created.json",
      surface: "notification",
      eventKind: "notification",
      title: "Widget cache misses after restart",
      number: null,
      metadata: { threadId: 8800, reason: "mention", subjectType: "Issue" },
    },
    {
      platformEvent: "package",
      fixture: "phase4/package-published.json",
      surface: "package",
      eventKind: "package",
      title: "widget-cache",
      number: null,
      metadata: { packageName: "widget-cache", packageVersion: "1.4.0", packageType: "container" },
    },
    {
      platformEvent: "page_build",
      fixture: "phase4/page-build.json",
      surface: "page",
      eventKind: "page",
      title: "octo/widgets",
      number: null,
      metadata: { buildId: 9900, status: "success", pusher: "grace" },
    },
    {
      platformEvent: "project",
      fixture: "phase4/project-item-edited.json",
      surface: "project",
      eventKind: "project",
      title: "Cache stabilization",
      number: null,
      metadata: { projectId: 6100, projectName: "Cache stabilization", itemId: 6101 },
    },
    {
      platformEvent: "pull_request",
      fixture: "actions/pull-request-opened-event.json",
      surface: "pull-request",
      eventKind: "pull-request",
      title: "Persist widget cache between restarts",
      number: 17,
      metadata: { head: "cache-persistence", base: "main", draft: false },
    },
    {
      platformEvent: "pull_request",
      fixture: "phase4/pull-request-comment-edited.json",
      surface: "pull-request",
      eventKind: "pull-request-comment",
      title: "Persist widget cache between restarts",
      body: "Can we add a small migration note for existing cache files?",
      number: 17,
      metadata: { commentId: 8200, path: "internal/cache/store.go", changedFields: ["body"] },
    },
    {
      platformEvent: "reaction",
      fixture: "phase4/reaction-created.json",
      surface: "reaction",
      eventKind: "reaction",
      title: "Widget cache misses after restart",
      body: "I can reproduce this on the staging instance.",
      number: 42,
      metadata: { reactionContent: "eyes", targetType: "comment", commentId: 8100 },
    },
    {
      platformEvent: "release",
      fixture: "actions/release-published-event.json",
      surface: "release",
      eventKind: "release",
      title: "Widget Cache 1.4.0",
      number: null,
      metadata: { tagName: "v1.4.0", targetCommitish: "main", prerelease: false },
    },
    {
      platformEvent: "repository",
      fixture: "phase4/repository-edited.json",
      surface: "repository",
      eventKind: "repository",
      title: "octo/widgets",
      number: null,
      metadata: { visibility: "public", oldName: "old-widgets" },
    },
    {
      platformEvent: "security_alert",
      fixture: "phase4/security-alert.json",
      surface: "security",
      eventKind: "security",
      title: "Container image includes vulnerable cache library",
      number: 3,
      metadata: { alertNumber: 3, alertState: "open", severity: "high", packageName: "libcache" },
    },
    {
      platformEvent: "star",
      fixture: "phase4/star-created.json",
      surface: "star",
      eventKind: "star",
      title: "octo/widgets",
      number: null,
      metadata: { starredAt: "2026-04-24T06:00:00Z" },
    },
    {
      platformEvent: "member",
      fixture: "phase4/member-added.json",
      surface: "team",
      eventKind: "team",
      title: "grace",
      number: null,
      metadata: { memberLogin: "grace", permission: "write" },
    },
    {
      platformEvent: "wiki",
      fixture: "phase4/wiki-updated.json",
      surface: "wiki",
      eventKind: "wiki",
      title: "Cache Operations",
      number: null,
      metadata: { pageName: "Cache Operations", sha: "abc123abc123abc123abc123abc123abc123abc1" },
    },
    {
      platformEvent: "workflow_dispatch",
      fixture: "actions/workflow-dispatch-event.json",
      surface: "action",
      eventKind: "action",
      title: "Manual workflow dispatch",
      number: null,
      metadata: { inputs: { run_agent: "false" } },
    },
  ];

  for (const spec of cases) {
    it(`normalizes ${spec.platformEvent} from ${spec.fixture}`, () => {
      const payload = readFixture(spec.fixture);
      const event = normalizeEvent(spec.platformEvent, payload, repository);

      expect(event.platform).toBe("forgejo");
      expect(event.platformEvent).toBe(spec.platformEvent);
      expect(event.surface).toBe(spec.surface);
      expect(event.surfaceFolder).toBe(`forgejo-intelligent-${spec.surface}`);
      expect(event.repository).toBe(repository);
      expect(event.actor).toBe(payload.sender?.login ?? payload.pusher?.login ?? "");
      expect(event.title).toBe(spec.title);
      expect(event.number).toBe(spec.number);
      expect(event.metadata.eventKind).toBe(spec.eventKind);
      expect(event.raw).toBe(payload);

      if ("body" in spec) {
        expect(event.body).toBe(spec.body);
      }

      for (const [key, value] of Object.entries(spec.metadata)) {
        expect(event.metadata[key]).toEqual(value);
      }
    });
  }

  it("has fixture-backed coverage for every active surface folder", () => {
    const activeSurfaces = readdirSync(resolve(repoRoot, ".forgejo-intelligence"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("forgejo-intelligent-"))
      .map((entry) => entry.name.replace(/^forgejo-intelligent-/, ""))
      .sort();
    const coveredSurfaces = [...new Set(cases.map((spec) => spec.surface))].sort();

    expect(coveredSurfaces).toEqual(activeSurfaces);
  });

  it("routes issue-shaped pull request comment edits to pull request intelligence", () => {
    const payload = readFixture("phase4/issue-comment-edited.json");
    payload.issue.pull_request = {
      html_url: "https://forgejo.example.test/octo/widgets/pulls/42",
    };

    const event = normalizeEvent("issues", payload, repository);

    expect(event.surface).toBe("pull-request");
    expect(event.metadata.eventKind).toBe("pull-request-comment");
    expect(event.metadata.commentId).toBe(8100);
  });

  it("parses mentions as metadata on issue and pull request events", () => {
    const issuePayload = readFixture("phase4/issue-comment-edited.json");
    issuePayload.comment.body = "@linus can you check the restart path?";

    const issueEvent = normalizeEvent("issues", issuePayload, repository);

    expect(issueEvent.surface).toBe("issue");
    expect(issueEvent.metadata.mentions).toEqual(["linus"]);

    const pullRequestPayload = readFixture("phase4/pull-request-comment-edited.json");
    pullRequestPayload.comment.body = "@grace can we add a migration note?";

    const pullRequestEvent = normalizeEvent("pull_request", pullRequestPayload, repository);

    expect(pullRequestEvent.surface).toBe("pull-request");
    expect(pullRequestEvent.metadata.mentions).toEqual(["grace"]);
  });

  it("keeps retired GitHub-only surfaces inactive and diagnostic-only", () => {
    const retiredCases = [
      ["deployment_status", "phase4/deployment-status.json"],
      ["discussion", "phase4/discussion-created.json"],
      ["funding", "phase4/funding-updated.json"],
      ["mention", "phase4/mention-detected.json"],
    ] as const;

    for (const [platformEvent, fixture] of retiredCases) {
      const payload = readFixture(fixture);
      const event = normalizeEvent(platformEvent, payload, repository);
      const guardrail = validateEvent(event, new Set(["forgejo-intelligent-issue"]));

      expect(event.surface).toBe("unknown");
      expect(event.metadata.ignored).toBe(true);
      expect(event.raw).toBe(payload);
      expect(guardrail.allowed).toBe(false);
      expect(guardrail.failedCheck).toBe("unknown-surface");
    }
  });

  it("captures unknown events with raw diagnostics and guardrail ignores them", () => {
    const payload = {
      action: "delivered",
      repository: {
        full_name: repository,
        html_url: "https://forgejo.example.test/octo/widgets",
        default_branch: "main",
      },
      sender: { login: "ada" },
      reason: "fixture-only event",
    };

    const event = normalizeEvent("unmapped_webhook", payload, repository);
    const guardrail = validateEvent(event, new Set(["forgejo-intelligent-issue"]));

    expect(event.platform).toBe("forgejo");
    expect(event.surface).toBe("unknown");
    expect(event.metadata.ignored).toBe(true);
    expect(event.raw).toBe(payload);
    expect(guardrail.allowed).toBe(false);
    expect(guardrail.failedCheck).toBe("unknown-surface");
  });
});

describe("Phase 4 Forgejo event map", () => {
  it("resolves supported Forgejo surfaces", () => {
    const map = getEventSurfaceMap();

    expect(resolveSurface("issues")).toBe("issue");
    expect(resolveSurface("pull_request")).toBe("pull-request");
    expect(resolveSurface("code_review_comment")).toBe("pull-request");
    expect(resolveSurface("push")).toBe("commit");
    expect(resolveSurface("label")).toBe("label");
    expect(resolveSurface("milestone")).toBe("milestone");
    expect(resolveSurface("release")).toBe("release");
    expect(resolveSurface("wiki")).toBe("wiki");
    expect(resolveSurface("repository")).toBe("repository");
    expect(resolveSurface("package")).toBe("package");
    expect(resolveSurface("dev_environment")).toBe("dev-environment");
    expect(resolveSurface("workflow_run")).toBe("action");
    expect(map.issue_comment).toBe("issue");
    expect(resolveSurface("unmapped_webhook")).toBe("unknown");
  });
});
