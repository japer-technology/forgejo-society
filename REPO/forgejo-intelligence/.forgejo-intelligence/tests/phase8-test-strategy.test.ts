import { describe, expect, it } from "bun:test";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "fs";
import { resolve } from "path";
import { normalizeEvent } from "../forgejo-intelligence-bridge/bridge";
import * as issueHandler from "../forgejo-intelligent-issue/handler";
import * as pullRequestHandler from "../forgejo-intelligent-pull-request/handler";
import type { ForgejoApi } from "../platform/types";

const repoRoot = resolve(import.meta.dir, "..", "..");
const intelligenceRoot = resolve(repoRoot, ".forgejo-intelligence");
const fixtureRoot = resolve(intelligenceRoot, "tests", "fixtures", "forgejo");

const phaseTests = [
  "tests/phase0.test.js",
  "tests/phase3-forgejo-api.test.ts",
  "tests/phase4-bridge.test.ts",
  "tests/phase5-lifecycle.test.ts",
  "tests/phase6-surfaces.test.ts",
  "tests/phase7-installer.test.ts",
  "tests/phase8-test-strategy.test.ts",
];

const activeRuntimeFiles = [
  ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml",
  ".forgejo/workflows/forgejo-intelligence-CI.yml",
  ".forgejo-intelligence/install/forgejo-intelligence-WORKFLOW-AGENT.yml",
  ...collectFiles(".forgejo-intelligence/lifecycle", (path) => path.endsWith(".ts")),
  ...collectFiles(".forgejo-intelligence/platform", (path) => path.endsWith(".ts")),
  ".forgejo-intelligence/forgejo-intelligence-bridge/bridge.ts",
  ".forgejo-intelligence/forgejo-intelligence-guardrail/guardrail.ts",
  ...readdirSync(intelligenceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("forgejo-intelligent-"))
    .map((entry) => `.forgejo-intelligence/${entry.name}/handler.ts`)
    .filter((path) => existsSync(resolve(repoRoot, path))),
].sort();

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

function read(path: string): string {
  return readFileSync(resolve(repoRoot, path), "utf-8");
}

function readFixture(path: string): Record<string, any> {
  return JSON.parse(readFileSync(resolve(fixtureRoot, path), "utf-8"));
}

function makeCommentCaptureApi(calls: Array<{ owner: string; repo: string; index: number; body: string }>): ForgejoApi {
  return {
    async createIssueComment(owner: string, repo: string, index: number, body: string) {
      calls.push({ owner, repo, index, body });
      return { id: calls.length, body };
    },
  } as unknown as ForgejoApi;
}

function unexpectedRuntimeResidue(): string[] {
  const residues: string[] = [];
  const residuePattern = /github|GitHub|\.github|GITHUB_|\bgh\b|api\.github\.com|github-actions\[bot\]/;
  const allowedMigrationPatterns = [
    "github-to-forgejo-v1",
  ];

  for (const file of activeRuntimeFiles) {
    const lines = read(file).split("\n");
    lines.forEach((line, index) => {
      if (!residuePattern.test(line)) return;
      if (allowedMigrationPatterns.some((allowed) => line.includes(allowed))) return;
      residues.push(`${file}:${index + 1}: ${line.trim()}`);
    });
  }

  return residues;
}

describe("Phase 8 local test entrypoints", () => {
  it("declares one command that runs all executable phase tests with Bun", () => {
    const packageJson = JSON.parse(read(".forgejo-intelligence/package.json"));
    expect(packageJson.scripts.test).toContain("bun test");

    for (const testPath of phaseTests) {
      expect(packageJson.scripts.test).toContain(testPath);
      expect(existsSync(resolve(intelligenceRoot, testPath.replace(/^tests\//, "tests/")))).toBe(true);
    }
  });

  it("keeps a Node-compatible structural test command for runners without Bun", () => {
    const packageJson = JSON.parse(read(".forgejo-intelligence/package.json"));
    expect(packageJson.scripts["test:node"]).toBe("node --test tests/phase0.test.js tests/phase8-node.test.js");
    expect(existsSync(resolve(intelligenceRoot, "tests", "phase8-node.test.js"))).toBe(true);
  });

  it("keeps each Phase 8 test category represented", () => {
    const test = read(".forgejo-intelligence/tests/phase8-test-strategy.test.ts");

    for (const category of [
      "Structural",
      "Bridge",
      "API adapter",
      "Handler",
      "Installer",
      "End-to-end smoke",
      "residue",
    ]) {
      expect(test).toContain(category);
    }
  });
});

describe("Phase 8 Forgejo Actions CI", () => {
  const ci = read(".forgejo/workflows/forgejo-intelligence-CI.yml");

  it("runs the local test suite on Forgejo Actions", () => {
    expect(ci).toContain("name: forgejo-intelligence-CI");
    expect(ci).toContain("uses: https://code.forgejo.org/actions/checkout@v4");
    expect(ci).toContain("cd .forgejo-intelligence && bun install");
    expect(ci).toContain("bun test");
    expect(ci).toContain("check-phase8.sh");
    expect(ci).toContain("check-phase9.sh");
    expect(ci).toContain("check-phase10.sh");
  });

  it("does not rely on ignored workflow permission declarations", () => {
    expect(ci).not.toContain("permissions:");
  });
});

describe("Phase 8 Structural residue gate", () => {
  it("keeps active runtime code free of forbidden GitHub-specific residue", () => {
    expect(unexpectedRuntimeResidue()).toEqual([]);
  });

  it("keeps legacy runtime paths out of the active workflow tree", () => {
    expect(existsSync(resolve(repoRoot, ".forgejo-intelligence", "forgejo-intelligence-ENABLED.md"))).toBe(true);
    expect(existsSync(resolve(repoRoot, ".forgejo", "workflows", "forgejo-intelligence-WORKFLOW-AGENT.yml"))).toBe(true);
    expect(existsSync(resolve(repoRoot, ".forgejo", "workflows", "forgejo-intelligence-CI.yml"))).toBe(true);
    expect(existsSync(resolve(repoRoot, ".github", "workflows"))).toBe(false);
    expect(existsSync(resolve(repoRoot, ".github-intelligence"))).toBe(false);
  });
});

describe("Phase 8 Bridge and API adapter suite coverage", () => {
  it("keeps fixture-driven bridge tests and mocked adapter tests in the main suite", () => {
    const packageJson = JSON.parse(read(".forgejo-intelligence/package.json"));
    expect(packageJson.scripts.test).toContain("phase3-forgejo-api.test.ts");
    expect(packageJson.scripts.test).toContain("phase4-bridge.test.ts");
    expect(read(".forgejo-intelligence/tests/phase3-forgejo-api.test.ts")).toContain("authentication headers");
    expect(read(".forgejo-intelligence/tests/phase3-forgejo-api.test.ts")).toContain("paginates");
    expect(read(".forgejo-intelligence/tests/phase3-forgejo-api.test.ts")).toContain("structured errors");
    expect(read(".forgejo-intelligence/tests/phase4-bridge.test.ts")).toContain("captures unknown events");
    expect(read(".forgejo-intelligence/tests/phase4-bridge.test.ts")).toContain("comment edits");
  });
});

describe("Phase 8 Handler tests", () => {
  it("builds issue prompts, session keys, reaction targets, and response API calls", async () => {
    const opened = normalizeEvent("issues", readFixture("actions/issues-opened-event.json"), "octo/widgets");
    const editedComment = normalizeEvent("issues", readFixture("phase4/issue-comment-edited.json"), "octo/widgets");
    const calls: Array<{ owner: string; repo: string; index: number; body: string }> = [];

    expect(issueHandler.buildPrompt(opened)).toContain("Widget cache misses after restart");
    expect(issueHandler.buildPrompt(opened)).toContain("After restarting the service, cached widgets are recomputed on every request.");
    expect(issueHandler.buildPrompt(editedComment)).toBe("I can reproduce this on the staging instance.");
    expect(issueHandler.getSessionKey(opened)).toBe("issues/42");
    expect(issueHandler.getConcurrencyKey(opened)).toBe("issue-intelligence-42");
    expect(issueHandler.getReactionTarget(opened)).toEqual({ type: "issue", issueNumber: 42 });
    expect(issueHandler.getReactionTarget(editedComment)).toEqual({
      type: "comment",
      issueNumber: 42,
      commentId: 8100,
    });

    await issueHandler.postResponse(opened, "Issue response", makeCommentCaptureApi(calls));

    expect(calls).toEqual([{ owner: "octo", repo: "widgets", index: 42, body: "Issue response" }]);
  });

  it("builds pull request prompts, session keys, reaction targets, and response API calls", async () => {
    const opened = normalizeEvent("pull_request", readFixture("actions/pull-request-opened-event.json"), "octo/widgets");
    const comment = normalizeEvent("pull_request", readFixture("phase4/pull-request-comment-edited.json"), "octo/widgets");
    const calls: Array<{ owner: string; repo: string; index: number; body: string }> = [];

    expect(pullRequestHandler.buildPrompt(opened)).toContain("PR #17: Persist widget cache between restarts");
    expect(pullRequestHandler.buildPrompt(opened)).toContain("Branch: cache-persistence");
    expect(pullRequestHandler.buildPrompt(comment)).toContain("Review comment on PR #17");
    expect(pullRequestHandler.buildPrompt(comment)).toContain("File: internal/cache/store.go");
    expect(pullRequestHandler.buildPrompt(comment)).toContain("Can we add a small migration note");
    expect(pullRequestHandler.getSessionKey(opened)).toBe("pull-requests/17");
    expect(pullRequestHandler.getConcurrencyKey(opened)).toBe("pr-intelligence-17");
    expect(pullRequestHandler.getReactionTarget(opened)).toEqual({ type: "issue", issueNumber: 17 });
    expect(pullRequestHandler.getReactionTarget(comment)).toEqual({
      type: "comment",
      issueNumber: 17,
      commentId: 8200,
    });

    await pullRequestHandler.postResponse(opened, "PR response", makeCommentCaptureApi(calls));

    expect(calls).toEqual([{ owner: "octo", repo: "widgets", index: 17, body: "PR response" }]);
  });
});

describe("Phase 8 Installer and End-to-end smoke coverage", () => {
  it("keeps installer acceptance tests in the main suite", () => {
    const packageJson = JSON.parse(read(".forgejo-intelligence/package.json"));
    expect(packageJson.scripts.test).toContain("phase7-installer.test.ts");
    expect(packageJson.scripts["check:phase8"]).toContain("check-phase8.sh");
  });

  it("provides a gated local Forgejo smoke harness for issue, comment, PR, push, and release events", () => {
    const smoke = read(".forgejo-intelligence/tests/scripts/smoke-local-forgejo.sh");

    for (const needle of [
      "FORGEJO_SMOKE_RUN",
      "/issues",
      "/comments",
      "/pulls",
      "/releases",
      "git push",
      "workflow_dispatch",
    ]) {
      expect(smoke).toContain(needle);
    }
  });
});
