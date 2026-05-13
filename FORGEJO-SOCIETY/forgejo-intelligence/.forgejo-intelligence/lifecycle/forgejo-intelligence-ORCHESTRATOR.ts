/**
 * forgejo-intelligence-ORCHESTRATOR.ts — Root orchestrator for Forgejo Intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the brain of the three-layer architecture described in WHAT.md.
 * The orchestrator is responsible for:
 *
 *   1. **Discovery** — Scanning `.forgejo-intelligence/` for present folders to
 *      determine which `forgejo-intelligent-*` surfaces, `forgejo-intelligence-*`
 *      coordinators, and `forgejo-ai-*` agents are active.
 *
 *   2. **Routing** — Using the Bridge to normalize the incoming Forgejo event,
 *      then dispatching it to the correct intelligence surface module.
 *
 *   3. **Validation** — Running the event through the Guardrail before any
 *      AI agent processes it.
 *
 *   4. **Delegation** — Calling the AGENT.ts entry point with the correct
 *      context after discovery, routing, and validation are complete.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHITECTURE POSITION
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   Forgejo Event
 *       │
 *       ▼
 *   ┌─────────────────────┐
 *   │    ORCHESTRATOR      │  ← YOU ARE HERE
 *   │  (discover → route   │
 *   │   → validate → run)  │
 *   └────────┬────────────┘
 *            │
 *   ┌───────┴────────┐
 *   │     BRIDGE      │  Normalizes event → NormalizedEvent
 *   └───────┬────────┘
 *            │
 *   ┌───────┴────────┐
 *   │   GUARDRAIL     │  Validates event → allow/deny
 *   └───────┬────────┘
 *            │
 *   ┌───────┴────────┐
 *   │  SURFACE HANDLER│  Surface-specific prompt building
 *   └───────┬────────┘
 *            │
 *   ┌───────┴────────┐
 *   │   AI AGENT      │  Runs the coding agent (pi, etc.)
 *   └────────────────┘
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LIFECYCLE POSITION
 * ─────────────────────────────────────────────────────────────────────────────
 * Workflow step order:
 *   1. Guard       (forgejo-intelligence-ENABLED.ts)        — verify opt-in sentinel
 *   2. Preinstall  (forgejo-intelligence-INDICATOR.ts)      — add 👀 reaction
 *   3. Install     (bun install)                           — install dependencies
 *   4. Orchestrate (forgejo-intelligence-ORCHESTRATOR.ts)   ← YOU ARE HERE
 *      └─> Routes to AGENT.ts or surface-specific handler
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FOLDER-BASED ACTIVATION
 * ─────────────────────────────────────────────────────────────────────────────
 * "Presence is permission. Absence is denial."
 *
 * The orchestrator scans `.forgejo-intelligence/` once at startup and builds
 * three sets:
 *   - activeSurfaces:      Set of `forgejo-intelligent-*` folder names present
 *   - activeCoordinators:  Set of `forgejo-intelligence-*` folder names present
 *   - availableAgents:     Set of `forgejo-ai-*` folder names present
 *
 * Only events that map to an active surface are processed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ─────────────────────────────────────────────────────────────────────────────
 * - Bridge module   (forgejo-intelligence-bridge/bridge.ts)
 * - Guardrail module (forgejo-intelligence-guardrail/guardrail.ts)
 * - Node.js built-in `fs` and `path` modules
 * - Bun runtime
 */

import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { normalizeEvent } from "../forgejo-intelligence-bridge/bridge";
import { validateEvent } from "../forgejo-intelligence-guardrail/guardrail";
import { splitRepository } from "../platform/types";
import { createRuntimeApi, isDryRun, isOfflineRun, shouldUseMockAgent } from "./runtime";
import {
  CURRENT_STATE_SCHEMA_VERSION,
  ensureStateSchema,
  normalizeSessionPath,
} from "../state/migrations/github-to-forgejo-v1";
import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import type { ForgejoApi } from "../platform/types";

// ─── Paths ────────────────────────────────────────────────────────────────────

const intelligenceDir = resolve(import.meta.dir, "..");
const stateDir = resolve(intelligenceDir, "state");
const sessionsDir = resolve(stateDir, "sessions");
const piSettingsPath = resolve(intelligenceDir, ".pi", "settings.json");
const sessionsDirRelative = ".forgejo-intelligence/state/sessions";
const MAX_COMMENT_LENGTH = 60000;

class GracefulOrchestratorExit extends Error {
  constructor() {
    super("Graceful orchestrator exit");
    this.name = "GracefulOrchestratorExit";
  }
}

// ─── Forgejo Actions Context ──────────────────────────────────────────────────

const eventPath = process.env.FORGEJO_EVENT_PATH;
const platformEvent = process.env.FORGEJO_EVENT_NAME;
const repository = process.env.FORGEJO_REPOSITORY;
const forgejoServerUrl = process.env.FORGEJO_SERVER_URL ?? process.env.FORGEJO_INSTANCE_URL ?? "";

if (!eventPath) {
  throw new Error("FORGEJO_EVENT_PATH is required.");
}
if (!platformEvent) {
  throw new Error("FORGEJO_EVENT_NAME is required.");
}
if (!repository) {
  throw new Error("FORGEJO_REPOSITORY is required.");
}

const eventPayload = JSON.parse(readFileSync(eventPath, "utf-8"));
const { owner, repo } = splitRepository(repository);
let api: ForgejoApi | null = null;

function getApi(): ForgejoApi {
  api ??= createRuntimeApi();
  return api;
}

// ─── Discovery ────────────────────────────────────────────────────────────────

/**
 * Scan the `.forgejo-intelligence/` directory and categorize every folder into
 * one of the three layers:
 *   - Layer 1: `forgejo-intelligent-*`  → Forgejo repository surfaces
 *   - Layer 2: `forgejo-intelligence-*` → Higher-Order Coordination
 *   - Layer 3: `forgejo-ai-*`          → AI Engines
 */
function discoverActiveFolders(): {
  surfaces: Set<string>;
  coordinators: Set<string>;
  agents: Set<string>;
} {
  const surfaces = new Set<string>();
  const coordinators = new Set<string>();
  const agents = new Set<string>();

  const entries = readdirSync(intelligenceDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;

    if (name.startsWith("forgejo-intelligent-")) {
      surfaces.add(name);
    } else if (name.startsWith("forgejo-intelligence-")) {
      coordinators.add(name);
    } else if (name.startsWith("forgejo-ai-")) {
      agents.add(name);
    }
  }

  return { surfaces, coordinators, agents };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function run(cmd: string[], opts?: { stdin?: any }): Promise<{ exitCode: number; stdout: string }> {
  const proc = Bun.spawn(cmd, {
    stdout: "pipe",
    stderr: "inherit",
    stdin: opts?.stdin,
  });
  const stdout = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;
  return { exitCode, stdout: stdout.trim() };
}

function resolveExistingSessionPath(mapping: { sessionPath?: string }): string | null {
  const sessionPath = normalizeSessionPath(mapping.sessionPath);
  if (!sessionPath) return null;

  if (existsSync(sessionPath)) return sessionPath;

  const absoluteSessionPath = resolve(intelligenceDir, "..", sessionPath);
  return existsSync(absoluteSessionPath) ? sessionPath : null;
}

function buildSessionMapping(event: NormalizedEvent, latestSession: string): Record<string, unknown> {
  const mapping: Record<string, unknown> = {
    schemaVersion: CURRENT_STATE_SCHEMA_VERSION,
    platform: "forgejo",
    surface: event.surface,
    number: event.number,
    sessionPath: latestSession,
    updatedAt: new Date().toISOString(),
  };

  if (event.surface === "issue" && event.number) {
    mapping.issueNumber = event.number;
  }

  if (event.surface === "pull-request" && event.number) {
    mapping.pullRequestNumber = event.number;
  }

  return mapping;
}

function writeMockAgentOutput(responseText: string): void {
  const timestamp = new Date().toISOString();
  const filename = `${timestamp.replace(/[:.]/g, "-")}_offline-fixture.jsonl`;
  const sessionPath = resolve(sessionsDir, filename);
  const sessionRelativePath = `${sessionsDirRelative}/${filename}`;
  const lines = [
    {
      type: "session",
      version: 3,
      id: "offline-fixture",
      timestamp,
      cwd: process.cwd(),
    },
    {
      type: "message_end",
      message: {
        role: "assistant",
        content: [{ type: "text", text: responseText }],
      },
    },
  ];

  writeFileSync(sessionPath, lines.map((line) => JSON.stringify(line)).join("\n") + "\n");
  writeFileSync("/tmp/agent-raw.jsonl", lines.map((line) => JSON.stringify(line)).join("\n") + "\n");
  console.log(`Offline fixture agent wrote ${sessionRelativePath}`);
}

// ─── Reaction State ───────────────────────────────────────────────────────────

const reactionState = existsSync("/tmp/reaction-state.json")
  ? JSON.parse(readFileSync("/tmp/reaction-state.json", "utf-8"))
  : null;

// ─── Main Orchestration Logic ─────────────────────────────────────────────────

try {
  // ── Step 0: State schema and migration guard ─────────────────────────────
  const migration = ensureStateSchema({ stateDir });
  console.log(
    `State schema v${migration.schemaVersion}: ${migration.mappingsChecked} mapping(s) checked, ` +
    `${migration.mappingsUpdated} updated, ${migration.sessionsChecked} session file(s) present.`
  );
  if (migration.sessionFilesMissing.length > 0) {
    console.log(
      `Warning: ${migration.sessionFilesMissing.length} mapping(s) reference missing session files.`
    );
  }

  // ── Step 1: Discovery ─────────────────────────────────────────────────────
  const { surfaces, coordinators, agents } = discoverActiveFolders();

  console.log("=== Forgejo Intelligence Orchestrator ===");
  console.log(`Active surfaces:     ${surfaces.size} (${[...surfaces].join(", ")})`);
  console.log(`Active coordinators: ${coordinators.size} (${[...coordinators].join(", ")})`);
  console.log(`Available agents:    ${agents.size} (${[...agents].join(", ")})`);
  console.log(`Event: ${platformEvent} (action: ${eventPayload.action ?? "n/a"})`);

  // ── Step 2: Bridge — Normalize the event ──────────────────────────────────
  const event: NormalizedEvent = normalizeEvent(platformEvent, eventPayload, repository);
  console.log(`Resolved surface: ${event.surface} → ${event.surfaceFolder}`);

  // ── Step 3: Guardrail — Validate the event ────────────────────────────────
  const guardrailResult = validateEvent(event, surfaces);
  if (!guardrailResult.allowed) {
    console.log(`Guardrail blocked: ${guardrailResult.reason}`);
    throw new GracefulOrchestratorExit();
  }
  console.log("Guardrail passed.");

  // ── Step 4: Load surface handler (if available) ───────────────────────────
  // Each `forgejo-intelligent-*` folder may contain a `handler.ts` that exports
  // surface-specific functions for prompt building and response posting.
  const handlerPath = resolve(intelligenceDir, event.surfaceFolder, "handler.ts");
  let handler: {
    buildPrompt?: (event: NormalizedEvent) => string;
    postResponse?: (event: NormalizedEvent, response: string, api: ForgejoApi) => Promise<void>;
    getSessionKey?: (event: NormalizedEvent) => string;
  } | null = null;

  if (existsSync(handlerPath)) {
    handler = await import(handlerPath);
    console.log(`Loaded surface handler: ${event.surfaceFolder}/handler.ts`);
  } else {
    console.log(`No surface handler for ${event.surfaceFolder} — using generic behavior.`);
  }

  // ── Step 5: Build prompt ──────────────────────────────────────────────────
  let prompt: string;
  if (handler?.buildPrompt) {
    prompt = handler.buildPrompt(event);
  } else {
    // Generic prompt: combine title and body.
    prompt = event.title && event.body
      ? `${event.title}\n\n${event.body}`
      : event.body || event.title || "";
  }

  if (!prompt.trim()) {
    console.log("Empty prompt — nothing to process.");
    throw new GracefulOrchestratorExit();
  }

  // ── Step 6: Resolve session ───────────────────────────────────────────────
  const sessionKey = handler?.getSessionKey
    ? handler.getSessionKey(event)
    : `${event.surface}/${event.number ?? "global"}`;

  const sessionKeyDir = resolve(stateDir, ...sessionKey.split("/").slice(0, -1));
  const mappingFile = resolve(stateDir, `${sessionKey}.json`);

  if (isDryRun()) {
    console.log(
      `Dry run complete: event ${platformEvent}.${event.action || "none"} would use session key ${sessionKey}.`
    );
    throw new GracefulOrchestratorExit();
  }

  mkdirSync(sessionKeyDir, { recursive: true });
  mkdirSync(sessionsDir, { recursive: true });

  let mode = "new";
  let sessionPath: string | null = null;

  if (existsSync(mappingFile)) {
    const mapping = JSON.parse(readFileSync(mappingFile, "utf-8"));
    const existingSessionPath = resolveExistingSessionPath(mapping);
    if (existingSessionPath) {
      mode = "resume";
      sessionPath = existingSessionPath;
      console.log(`Resuming session: ${sessionPath}`);
    } else {
      console.log("Mapped session file missing, starting fresh.");
    }
  } else {
    console.log("No session mapping found, starting fresh.");
  }

  // ── Step 7: Configure git ─────────────────────────────────────────────────
  await run(["git", "config", "user.name", "forgejo-intelligence[bot]"]);
  await run(["git", "config", "user.email", "forgejo-intelligence[bot]@users.noreply.forgejo"]);

  // ── Step 8: Validate provider API key ─────────────────────────────────────
  const piSettings = JSON.parse(readFileSync(piSettingsPath, "utf-8"));
  const configuredProvider: string = piSettings.defaultProvider;
  const configuredModel: string = piSettings.defaultModel;

  if (!configuredProvider || !configuredModel) {
    throw new Error(
      `Invalid .pi settings at ${piSettingsPath}: expected defaultProvider and defaultModel`
    );
  }

  const providerKeyMap: Record<string, string> = {
    anthropic: "ANTHROPIC_API_KEY",
    openai: "OPENAI_API_KEY",
    google: "GEMINI_API_KEY",
    xai: "XAI_API_KEY",
    openrouter: "OPENROUTER_API_KEY",
    mistral: "MISTRAL_API_KEY",
    groq: "GROQ_API_KEY",
  };
  const requiredKeyName = providerKeyMap[configuredProvider];
  const useMockAgent = shouldUseMockAgent();
  if (!useMockAgent && requiredKeyName && !process.env[requiredKeyName]) {
    // Post a helpful error to the appropriate surface.
    const errorBody =
      `## ⚠️ Missing API Key: \`${requiredKeyName}\`\n\n` +
      `The configured provider is \`${configuredProvider}\`, but the \`${requiredKeyName}\` secret is not available.\n\n` +
      `### How to fix\n\n` +
      `1. Go to **Settings → Secrets and variables → Actions → New repository secret**\n` +
      `2. Name: \`${requiredKeyName}\`, Value: your API key\n`;

    if (handler?.postResponse) {
      await handler.postResponse(event, errorBody, getApi());
    } else if (event.number) {
      await getApi().createIssueComment(owner, repo, event.number, errorBody);
    }
    throw new Error(`${requiredKeyName} is not available to this workflow run.`);
  }

  // ── Step 9: Run the AI agent ──────────────────────────────────────────────
  let agentText: string;
  if (useMockAgent) {
    agentText =
      process.env.FORGEJO_INTELLIGENCE_MOCK_AGENT_RESPONSE ??
      "Forgejo Intelligence offline fixture response.";
    console.log("Using offline fixture agent response; pi execution skipped.");
    writeMockAgentOutput(agentText);
  } else {
    const piBin = resolve(intelligenceDir, "node_modules", ".bin", "pi");
    const piArgs = [
      piBin,
      "--mode", "json",
      "--provider", configuredProvider,
      "--model", configuredModel,
      "--session-dir", sessionsDirRelative,
      "-p", prompt,
    ];
    if (mode === "resume" && sessionPath) {
      piArgs.push("--session", sessionPath);
    }

    console.log(`Running AI agent: ${configuredProvider}/${configuredModel}`);
    const pi = Bun.spawn(piArgs, { stdout: "pipe", stderr: "inherit" });
    const tee = Bun.spawn(["tee", "/tmp/agent-raw.jsonl"], { stdin: pi.stdout, stdout: "inherit" });
    await tee.exited;

    const piExitCode = await pi.exited;
    if (piExitCode !== 0) {
      throw new Error(`AI agent exited with code ${piExitCode}. Check the workflow logs above for details.`);
    }

    // ── Step 10: Extract agent response ─────────────────────────────────────
    const tac = Bun.spawn(["tac", "/tmp/agent-raw.jsonl"], { stdout: "pipe" });
    const jq = Bun.spawn(
      ["jq", "-r", "-s", '[ .[] | select(.type == "message_end" and .message.role == "assistant") | select((.message.content // []) | map(select(.type == "text")) | length > 0) ] | .[0].message.content[] | select(.type == "text") | .text'],
      { stdin: tac.stdout, stdout: "pipe" }
    );
    agentText = await new Response(jq.stdout).text();
    await jq.exited;
  }

  // ── Step 11: Persist session mapping ──────────────────────────────────────
  const { stdout: latestSession } = await run([
    "bash", "-c", `ls -t ${sessionsDirRelative}/*.jsonl 2>/dev/null | head -1`,
  ]);

  if (latestSession) {
    writeFileSync(
      mappingFile,
      JSON.stringify(buildSessionMapping(event, latestSession), null, 2) + "\n"
    );
    console.log(`Saved mapping: ${sessionKey} → ${latestSession}`);
  }

  // ── Step 12: Commit and push ──────────────────────────────────────────────
  const defaultBranch = event.defaultBranch;
  if (isOfflineRun()) {
    console.log("Offline fixture run: skipping git pull, commit, and push.");
  } else {
    await run(["git", "pull", "--rebase", "origin", defaultBranch]);
    await run(["git", "add", "-A"]);
    const { exitCode } = await run(["git", "diff", "--cached", "--quiet"]);
    if (exitCode !== 0) {
      await run(["git", "commit", "-m", `forgejo-intelligence: work on ${event.surface} #${event.number ?? "event"}`]);
    }

    for (let i = 1; i <= 5; i++) {
      const push = await run(["git", "push", "origin", `HEAD:${defaultBranch}`]);
      if (push.exitCode === 0) break;
      console.log(`Push failed, rebasing and retrying (${i}/5)...`);
      await run(["git", "pull", "--rebase", "origin", defaultBranch]);
      if (i < 5) {
        const baseDelay = Math.pow(2, i - 1) * 1000;
        const jitter = baseDelay * (0.5 + Math.random());
        await new Promise((resolve) => setTimeout(resolve, jitter));
      }
    }
  }

  // ── Step 13: Post response ────────────────────────────────────────────────
  const trimmedText = agentText.trim();
  const commentBody = trimmedText.length > 0
    ? trimmedText.slice(0, MAX_COMMENT_LENGTH)
    : `The agent ran successfully but did not produce a text response. Check the repository for any file changes.\n\nFor full details, see the workflow run logs: ${forgejoServerUrl}/${repository}/actions`;

  if (handler?.postResponse) {
    await handler.postResponse(event, commentBody, getApi());
  } else if (event.number) {
    await getApi().createIssueComment(owner, repo, event.number, commentBody);
  } else {
    console.log("No target surface for response posting — response logged only.");
    console.log("Agent response:", commentBody.slice(0, 500));
  }
} catch (error) {
  if (error instanceof GracefulOrchestratorExit) {
    process.exitCode = 0;
  } else {
    throw error;
  }
} finally {
  // ── Guaranteed cleanup: remove 👀 reaction ────────────────────────────────
  if (reactionState?.reactionId) {
    try {
      const { reactionTarget, commentId, reactionContent = "eyes" } = reactionState;
      const issueNumber = reactionState.issueNumber;
      const reactionRepo = splitRepository(reactionState.repo ?? repository);
      if (reactionTarget === "comment" && commentId) {
        await getApi().deleteIssueCommentReaction(reactionRepo.owner, reactionRepo.repo, commentId, reactionContent);
      } else if (issueNumber) {
        await getApi().deleteIssueReaction(reactionRepo.owner, reactionRepo.repo, issueNumber, reactionContent);
      } else {
        console.log("No issue number available for reaction cleanup; skipping.");
      }
    } catch (e) {
      console.error("Failed to remove reaction:", e);
    }
  }
}
