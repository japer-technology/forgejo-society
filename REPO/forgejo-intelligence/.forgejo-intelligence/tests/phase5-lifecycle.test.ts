import { describe, expect, it } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import {
  CURRENT_STATE_SCHEMA_VERSION,
  ensureStateSchema,
} from "../state/migrations/github-to-forgejo-v1";
import { createRuntimeApi } from "../lifecycle/runtime";

const repoRoot = resolve(import.meta.dir, "..", "..");

function readRuntimeFile(path: string): string {
  return readFileSync(resolve(repoRoot, path), "utf-8");
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, "utf-8"));
}

describe("Phase 5 state schema migration", () => {
  it("normalizes legacy GitHub session mappings without deleting JSONL sessions", () => {
    const tempRoot = mkdtempSync(resolve(tmpdir(), "forgejo-intelligence-state-"));
    const stateDir = resolve(tempRoot, ".forgejo-intelligence", "state");
    const sessionsDir = resolve(stateDir, "sessions");
    const legacySessionsDir = resolve(tempRoot, ".github-intelligence", "state", "sessions");
    const issuesDir = resolve(stateDir, "issues");
    const pullRequestsDir = resolve(stateDir, "pull-requests");
    const sessionPath = resolve(sessionsDir, "legacy.jsonl");
    const legacySessionPath = resolve(legacySessionsDir, "legacy.jsonl");

    mkdirSync(legacySessionsDir, { recursive: true });
    mkdirSync(issuesDir, { recursive: true });
    mkdirSync(pullRequestsDir, { recursive: true });
    writeFileSync(legacySessionPath, "{\"type\":\"session\"}\n");
    writeFileSync(
      resolve(issuesDir, "42.json"),
      JSON.stringify({
        issueNumber: 42,
        sessionPath: ".github-intelligence/state/sessions/legacy.jsonl",
        updatedAt: "2026-02-22T00:00:00.000Z",
      }) + "\n"
    );
    writeFileSync(
      resolve(pullRequestsDir, "7.json"),
      JSON.stringify({
        prNumber: 7,
        sessionPath: ".forgejo-intelligence/state/sessions/legacy.jsonl",
      }) + "\n"
    );

    const result = ensureStateSchema({
      stateDir,
      now: "2026-05-01T00:00:00.000Z",
    });

    expect(result.schemaVersion).toBe(CURRENT_STATE_SCHEMA_VERSION);
    expect(result.mappingsChecked).toBe(2);
    expect(result.mappingsUpdated).toBe(2);
    expect(result.sessionsChecked).toBe(1);
    expect(existsSync(sessionPath)).toBe(true);
    expect(existsSync(legacySessionPath)).toBe(true);

    const issue = readJson(resolve(issuesDir, "42.json"));
    expect(issue).toMatchObject({
      schemaVersion: 1,
      platform: "forgejo",
      surface: "issue",
      number: 42,
      issueNumber: 42,
      sessionPath: ".forgejo-intelligence/state/sessions/legacy.jsonl",
      migratedFrom: "github-intelligence",
    });

    const pullRequest = readJson(resolve(pullRequestsDir, "7.json"));
    expect(pullRequest).toMatchObject({
      schemaVersion: 1,
      platform: "forgejo",
      surface: "pull-request",
      number: 7,
      pullRequestNumber: 7,
      sessionPath: ".forgejo-intelligence/state/sessions/legacy.jsonl",
    });
  });
});

describe("Phase 5 lifecycle wiring", () => {
  it("keeps the sentinel guard on the Forgejo enabled file", () => {
    const enabled = readRuntimeFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ENABLED.ts");
    expect(enabled).toContain(".forgejo-intelligence/forgejo-intelligence-ENABLED.md");
    expect(enabled).not.toContain(".github-intelligence/github-intelligence-ENABLED.md");
  });

  it("uses mockable Forgejo runtime APIs and offline agent execution", () => {
    const runtime = readRuntimeFile(".forgejo-intelligence/lifecycle/runtime.ts");
    const orchestrator = readRuntimeFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");

    expect(runtime).toContain("FORGEJO_INTELLIGENCE_MOCK_API");
    expect(runtime).toContain("FORGEJO_INTELLIGENCE_OFFLINE");
    expect(runtime).toContain("FORGEJO_INTELLIGENCE_DRY_RUN");
    expect(runtime).toContain("FORGEJO_INTELLIGENCE_MOCK_AGENT_RESPONSE");
    expect(orchestrator).toContain("ensureStateSchema");
    expect(orchestrator).toContain("createRuntimeApi");
    expect(orchestrator).toContain("forgejo-intelligence[bot]");
    expect(orchestrator).toContain("forgejo-intelligence: work on");
    expect(orchestrator).toContain("${forgejoServerUrl}/${repository}/actions");
  });

  it("keeps graceful orchestrator exits inside cleanup flow", () => {
    const orchestrator = readRuntimeFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");

    expect(orchestrator).toContain("GracefulOrchestratorExit");
    expect(orchestrator).toContain("process.exitCode = 0");
    expect(orchestrator).not.toContain("process.exit(0)");
  });

  it("validates every documented provider secret before agent execution", () => {
    const orchestrator = readRuntimeFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");

    for (const secretName of [
      "ANTHROPIC_API_KEY",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "XAI_API_KEY",
      "OPENROUTER_API_KEY",
      "MISTRAL_API_KEY",
      "GROQ_API_KEY",
    ]) {
      expect(orchestrator).toContain(secretName);
    }
  });

  it("falls back from reactions to a progress comment", () => {
    const indicator = readRuntimeFile(".forgejo-intelligence/lifecycle/forgejo-intelligence-INDICATOR.ts");
    expect(indicator).toContain("progress comment");
    expect(indicator).toContain("Forgejo Intelligence is working on this event.");
    expect(indicator).toContain("createRuntimeApi");
  });

  it("provides a no-network mock Forgejo API adapter for fixture runs", async () => {
    const api = createRuntimeApi({
      FORGEJO_INTELLIGENCE_MOCK_API: "1",
      FORGEJO_REPOSITORY: "octo/widgets",
    });

    const comment = await api.createIssueComment("octo", "widgets", 42, "hello");
    const reaction = await api.addIssueReaction("octo", "widgets", 42, "eyes");

    expect(comment.body).toBe("hello");
    expect(reaction.content).toBe("eyes");
  });
});
