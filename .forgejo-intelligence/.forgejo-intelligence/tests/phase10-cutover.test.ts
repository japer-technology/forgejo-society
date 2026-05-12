import { describe, expect, it } from "bun:test";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "fs";
import { resolve } from "path";
import { normalizeEvent } from "../forgejo-intelligence-bridge/bridge";
import { validateEvent } from "../forgejo-intelligence-guardrail/guardrail";
import * as issueHandler from "../forgejo-intelligent-issue/handler";
import * as pullRequestHandler from "../forgejo-intelligent-pull-request/handler";
import type { ForgejoApi } from "../platform/types";

const repoRoot = resolve(import.meta.dir, "..", "..");
const intelligenceRoot = resolve(repoRoot, ".forgejo-intelligence");
const fixtureRoot = resolve(intelligenceRoot, "tests", "fixtures", "forgejo");

function read(path: string): string {
  return readFileSync(resolve(repoRoot, path), "utf-8");
}

function readFixture(path: string): Record<string, any> {
  return JSON.parse(readFileSync(resolve(fixtureRoot, path), "utf-8"));
}

function collectFiles(relativeDir: string, predicate: (path: string) => boolean): string[] {
  const absoluteDir = resolve(repoRoot, relativeDir);
  const files: string[] = [];

  for (const entry of readdirSync(absoluteDir)) {
    const relativePath = `${relativeDir}/${entry}`;
    const absolutePath = resolve(repoRoot, relativePath);
    if (statSync(absolutePath).isDirectory()) {
      files.push(...collectFiles(relativePath, predicate));
    } else if (predicate(relativePath)) {
      files.push(relativePath);
    }
  }

  return files;
}

function activeRuntimeFiles(): string[] {
  const surfaceHandlers = readdirSync(intelligenceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("forgejo-intelligent-"))
    .map((entry) => `.forgejo-intelligence/${entry.name}/handler.ts`)
    .filter((path) => existsSync(resolve(repoRoot, path)));

  return [
    ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml",
    ".forgejo/workflows/forgejo-intelligence-CI.yml",
    ".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml",
    ...collectFiles(".forgejo-intelligence/lifecycle", (path) => path.endsWith(".ts")),
    ...collectFiles(".forgejo-intelligence/platform", (path) => path.endsWith(".ts")),
    ".forgejo-intelligence/forgejo-intelligence-bridge/bridge.ts",
    ".forgejo-intelligence/forgejo-intelligence-guardrail/guardrail.ts",
    ...surfaceHandlers,
  ].sort();
}

function unexpectedRuntimeResidue(): string[] {
  const residues: string[] = [];
  const residuePattern = /github|GitHub|\.github|GITHUB_|\bgh\b|api\.github\.com|github-actions\[bot\]/;
  const allowedMigrationPatterns = ["github-to-forgejo-v1"];

  for (const file of activeRuntimeFiles()) {
    read(file).split("\n").forEach((line, index) => {
      if (!residuePattern.test(line)) return;
      if (allowedMigrationPatterns.some((allowed) => line.includes(allowed))) return;
      residues.push(`${file}:${index + 1}: ${line.trim()}`);
    });
  }

  return residues;
}

function makeCommentCaptureApi(calls: Array<{ owner: string; repo: string; index: number; body: string }>): ForgejoApi {
  return {
    async createIssueComment(owner: string, repo: string, index: number, body: string) {
      calls.push({ owner, repo, index, body });
      return { id: calls.length, body };
    },
  } as unknown as ForgejoApi;
}

describe("Phase 10 cutover", () => {
  it("removes legacy active runtime paths and keeps Forgejo paths active", () => {
    expect(existsSync(resolve(repoRoot, ".github-intelligence"))).toBe(false);
    expect(existsSync(resolve(repoRoot, ".github", "workflows", "github-intelligence-WORKFLOW-AGENT.yml"))).toBe(false);
    expect(existsSync(resolve(repoRoot, ".github", "workflows"))).toBe(false);
    expect(existsSync(resolve(repoRoot, ".forgejo-intelligence"))).toBe(true);
    expect(existsSync(resolve(repoRoot, ".forgejo", "workflows", "forgejo-intelligence-WORKFLOW-AGENT.yml"))).toBe(true);
    expect(existsSync(resolve(repoRoot, ".forgejo", "workflows", "forgejo-intelligence-CI.yml"))).toBe(true);
  });

  it("keeps active runtime files free of GitHub-specific execution residue", () => {
    expect(unexpectedRuntimeResidue()).toEqual([]);
  });

  it("uses Forgejo-only workflow environment variables after cutover", () => {
    const workflow = read(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
    const template = read(".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml");

    for (const content of [workflow, template]) {
      expect(content).toContain("FORGEJO_EVENT_PATH");
      expect(content).toContain("FORGEJO_EVENT_NAME");
      expect(content).toContain("FORGEJO_REPOSITORY");
      expect(content).toContain("FORGEJO_TOKEN");
      expect(content).not.toContain("GITHUB_EVENT_PATH");
      expect(content).not.toContain("GITHUB_EVENT_NAME");
      expect(content).not.toContain("GITHUB_REPOSITORY");
      expect(content).not.toContain("GITHUB_TOKEN");
      expect(content).not.toContain("${{ github.");
    }
  });

  it("routes opened issues and follow-up comments to one resumable session", () => {
    const opened = normalizeEvent("issues", readFixture("actions/issues-opened-event.json"), "octo/widgets");
    const comment = normalizeEvent("issues", readFixture("phase4/issue-comment-edited.json"), "octo/widgets");
    const activeSurfaces = new Set(["forgejo-intelligent-issue"]);

    expect(opened.surface).toBe("issue");
    expect(comment.surface).toBe("issue");
    expect(issueHandler.getSessionKey(opened)).toBe("issues/42");
    expect(issueHandler.getSessionKey(comment)).toBe("issues/42");
    expect(validateEvent(opened, activeSurfaces).allowed).toBe(true);
    expect(validateEvent(comment, activeSurfaces).allowed).toBe(true);
  });

  it("routes opened and synchronized pull requests to PR intelligence", () => {
    const openedPayload = readFixture("actions/pull-request-opened-event.json");
    const syncPayload = JSON.parse(JSON.stringify(openedPayload));
    syncPayload.action = "synchronize";

    const opened = normalizeEvent("pull_request", openedPayload, "octo/widgets");
    const synchronized = normalizeEvent("pull_request", syncPayload, "octo/widgets");
    const activeSurfaces = new Set(["forgejo-intelligent-pull-request"]);

    expect(read(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml")).toContain("synchronize");
    expect(opened.surface).toBe("pull-request");
    expect(synchronized.surface).toBe("pull-request");
    expect(pullRequestHandler.getSessionKey(opened)).toBe("pull-requests/17");
    expect(pullRequestHandler.getSessionKey(synchronized)).toBe("pull-requests/17");
    expect(validateEvent(opened, activeSurfaces).allowed).toBe(true);
    expect(validateEvent(synchronized, activeSurfaces).allowed).toBe(true);
  });

  it("posts issue and PR responses through the Forgejo API adapter contract", async () => {
    const issue = normalizeEvent("issues", readFixture("actions/issues-opened-event.json"), "octo/widgets");
    const pr = normalizeEvent("pull_request", readFixture("actions/pull-request-opened-event.json"), "octo/widgets");
    const calls: Array<{ owner: string; repo: string; index: number; body: string }> = [];
    const api = makeCommentCaptureApi(calls);

    await issueHandler.postResponse(issue, "Issue cutover response", api);
    await pullRequestHandler.postResponse(pr, "PR cutover response", api);

    expect(calls).toEqual([
      { owner: "octo", repo: "widgets", index: 42, body: "Issue cutover response" },
      { owner: "octo", repo: "widgets", index: 17, body: "PR cutover response" },
    ]);
  });

  it("keeps state commit and push behavior wired into the orchestrator", () => {
    const orchestrator = read(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");

    expect(orchestrator).toContain("buildSessionMapping");
    expect(orchestrator).toContain('"git", "add", "-A"');
    expect(orchestrator).toContain('"git", "commit"');
    expect(orchestrator).toContain('"git", "push"');
  });

  it("keeps the disabled sentinel as the first execution gate", () => {
    const guard = read(".forgejo-intelligence/lifecycle/forgejo-intelligence-ENABLED.ts");
    const workflow = read(".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
    const guardIdx = workflow.indexOf("name: Guard");
    const runIdx = workflow.indexOf("name: Run");

    expect(guard).toContain(".forgejo-intelligence/forgejo-intelligence-ENABLED.md");
    expect(guard).toContain("process.exit(1)");
    expect(guardIdx).toBeGreaterThan(0);
    expect(runIdx).toBeGreaterThan(guardIdx);
  });

  it("treats a missing surface folder as disabled", () => {
    const opened = normalizeEvent("issues", readFixture("actions/issues-opened-event.json"), "octo/widgets");
    const result = validateEvent(opened, new Set());

    expect(result.allowed).toBe(false);
    expect(result.failedCheck).toBe("inactive-surface");
  });

  it("makes Phase 10 the default local and CI acceptance gate", () => {
    const packageJson = JSON.parse(read(".forgejo-intelligence/package.json"));
    const ci = read(".forgejo/workflows/forgejo-intelligence-CI.yml");

    expect(packageJson.scripts.test).toContain("tests/phase10-cutover.test.ts");
    expect(packageJson.scripts.check).toBe("bash tests/scripts/check-phase10.sh");
    expect(packageJson.scripts["check:phase10"]).toBe("bash tests/scripts/check-phase10.sh");
    expect(ci).toContain("tests/phase10-cutover.test.ts");
    expect(ci).toContain("check-phase10.sh");
  });
});
