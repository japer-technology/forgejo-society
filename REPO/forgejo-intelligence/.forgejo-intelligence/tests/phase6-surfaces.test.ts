import { describe, expect, it } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { normalizeEvent, resolveSurface } from "../forgejo-intelligence-bridge/bridge";

const repoRoot = resolve(import.meta.dir, "..", "..");
const intelligenceRoot = resolve(repoRoot, ".forgejo-intelligence");
const fixtureRoot = resolve(intelligenceRoot, "tests", "fixtures", "forgejo");
const repository = "octo/widgets";

const expectedActiveSurfaces = [
  "forgejo-intelligent-action",
  "forgejo-intelligent-branch",
  "forgejo-intelligent-commit",
  "forgejo-intelligent-dev-environment",
  "forgejo-intelligent-fork",
  "forgejo-intelligent-issue",
  "forgejo-intelligent-label",
  "forgejo-intelligent-milestone",
  "forgejo-intelligent-notification",
  "forgejo-intelligent-package",
  "forgejo-intelligent-page",
  "forgejo-intelligent-project",
  "forgejo-intelligent-pull-request",
  "forgejo-intelligent-reaction",
  "forgejo-intelligent-release",
  "forgejo-intelligent-repository",
  "forgejo-intelligent-security",
  "forgejo-intelligent-star",
  "forgejo-intelligent-team",
  "forgejo-intelligent-wiki",
].sort();

const expectedActiveCoordinators = [
  "forgejo-intelligence-analytics",
  "forgejo-intelligence-bridge",
  "forgejo-intelligence-cron",
  "forgejo-intelligence-dashboard",
  "forgejo-intelligence-guardrail",
  "forgejo-intelligence-health",
  "forgejo-intelligence-knowledge",
  "forgejo-intelligence-plugin",
  "forgejo-intelligence-swarm",
].sort();

const archivedGitHubOnlyModules = [
  "forgejo-intelligent-code-review",
  "forgejo-intelligent-codespace",
  "forgejo-intelligent-deployment",
  "forgejo-intelligent-discussion",
  "forgejo-intelligent-mention",
  "forgejo-intelligent-sponsor",
];

function activeFolders(prefix: string): string[] {
  return readdirSync(intelligenceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => entry.name)
    .sort();
}

function read(path: string): string {
  return readFileSync(resolve(repoRoot, path), "utf-8");
}

function readFixture(path: string): Record<string, any> {
  return JSON.parse(readFileSync(resolve(fixtureRoot, path), "utf-8"));
}

describe("Phase 6 active surface set", () => {
  it("activates only Forgejo-supported and fixture-backed surface folders", () => {
    expect(activeFolders("forgejo-intelligent-")).toEqual(expectedActiveSurfaces);
    expect(activeFolders("forgejo-intelligence-")).toEqual(expectedActiveCoordinators);
  });

  it("archives GitHub-only or unproven surfaces outside the runtime tree", () => {
    for (const module of archivedGitHubOnlyModules) {
      expect(existsSync(resolve(intelligenceRoot, module))).toBe(false);
      expect(existsSync(resolve(repoRoot, "archive", "github-only", module))).toBe(true);
    }

    expect(existsSync(resolve(intelligenceRoot, "forgejo-intelligence-emergency"))).toBe(false);
    expect(existsSync(resolve(repoRoot, "archive", "deferred", "forgejo-intelligence-emergency"))).toBe(true);
  });

  it("documents every active surface contract", () => {
    for (const module of expectedActiveSurfaces) {
      const readme = read(`.forgejo-intelligence/${module}/README.md`);

      expect(readme).toContain("## Forgejo Trigger");
      expect(readme).toContain("## API Calls");
      expect(readme).toContain("## State Files");
      expect(readme).toContain("## Unsupported GitHub Behaviors");
      expect(readme).toContain(`Surface folder: \`${module}\``);
    }
  });

  it("documents every active coordinator contract", () => {
    for (const module of expectedActiveCoordinators) {
      const readme = read(`.forgejo-intelligence/${module}/README.md`);

      expect(readme).toContain("## Forgejo Trigger");
      expect(readme).toContain("## API Calls");
      expect(readme).toContain("## State Files");
      expect(readme).toContain("## Unsupported GitHub Behaviors");
    }
  });
});

describe("Phase 6 surface routing", () => {
  it("folds code review comments into pull request intelligence", () => {
    const payload = readFixture("phase4/code-review-comment.json");
    const event = normalizeEvent("code_review_comment", payload, repository);

    expect(resolveSurface("code_review_comment")).toBe("pull-request");
    expect(event.surface).toBe("pull-request");
    expect(event.surfaceFolder).toBe("forgejo-intelligent-pull-request");
    expect(event.metadata.eventKind).toBe("pull-request-comment");
  });

  it("routes developer environment payloads to the replacement surface", () => {
    const payload = readFixture("phase4/dev-environment-started.json");
    const event = normalizeEvent("dev_environment", payload, repository);

    expect(resolveSurface("dev_environment")).toBe("dev-environment");
    expect(event.surface).toBe("dev-environment");
    expect(event.surfaceFolder).toBe("forgejo-intelligent-dev-environment");
    expect(event.metadata.devEnvironmentName).toBe("cache-debug-workspace");
  });

  it("parses mentions on issue and pull request surfaces instead of routing a mention event", () => {
    const issuePayload = readFixture("phase4/issue-comment-edited.json");
    issuePayload.comment.body = "@linus can you check this?";
    const issueEvent = normalizeEvent("issues", issuePayload, repository);

    expect(issueEvent.surface).toBe("issue");
    expect(issueEvent.metadata.mentions).toEqual(["linus"]);

    const pullRequestPayload = readFixture("phase4/pull-request-comment-edited.json");
    pullRequestPayload.comment.body = "@grace can you review the migration note?";
    const pullRequestEvent = normalizeEvent("pull_request", pullRequestPayload, repository);

    expect(pullRequestEvent.surface).toBe("pull-request");
    expect(pullRequestEvent.metadata.mentions).toEqual(["grace"]);
    expect(resolveSurface("mention")).toBe("unknown");
  });

  it("leaves retired GitHub-only events unmapped", () => {
    for (const platformEvent of ["deployment_status", "discussion", "funding", "sponsorship"]) {
      expect(resolveSurface(platformEvent)).toBe("unknown");
    }
  });
});
