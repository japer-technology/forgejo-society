/**
 * forgejo-intelligence-AGENT.ts — Core agent orchestrator for Issue Intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the main entry point for the Issue Intelligence AI coding agent.  It receives
 * a Forgejo issue (or issue comment) event, runs the `pi` AI agent against the
 * user's prompt, and posts the result back as an issue comment.  It also
 * manages all session state so that multi-turn conversations across multiple
 * workflow runs are seamlessly resumed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LIFECYCLE POSITION
 * ─────────────────────────────────────────────────────────────────────────────
 * Workflow step order:
 *   1. Guard       (forgejo-intelligence-ENABLED.ts)   — verify opt-in sentinel exists
 *   2. Preinstall  (forgejo-intelligence-INDICATOR.ts) — add 👀 reaction indicator
 *   3. Install     (bun install)            — install npm/bun dependencies
 *   4. Run         (forgejo-intelligence-AGENT.ts)     ← YOU ARE HERE
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * AGENT EXECUTION PIPELINE
 * ─────────────────────────────────────────────────────────────────────────────
 *   1. Fetch issue title/body from the Forgejo API adapter.
 *   2. Resolve (or create) a conversation session for this issue number.
 *      - New issue  → create a fresh session; record the mapping in state/.
 *      - Follow-up  → load the existing session file for conversation context.
 *   3. Build a prompt string from the event payload.
 *   4. Run the `pi` coding agent binary with the prompt (+ prior session if resuming).
 *      Agent output is streamed through `tee` to provide a live Actions log AND
 *      persist the raw JSONL to `/tmp/agent-raw.jsonl` for post-processing.
 *   5. Extract the assistant's final text reply from the JSONL output using
 *      `tac` (reverse) + `jq` (parse the last `message_end` event).
 *   6. Persist the issue → session mapping so the next run can resume the conversation.
 *   7. Stage, commit, and push all changes (session log, mapping, repo edits)
 *      back to the default branch with an automatic retry-on-conflict loop.
 *   8. Post the extracted reply as a new comment on the originating issue.
 *   9. [finally] Remove the 👀 reaction that `forgejo-intelligence-INDICATOR.ts` added,
 *      guaranteeing cleanup even if the agent threw an unhandled error.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SESSION CONTINUITY
 * ─────────────────────────────────────────────────────────────────────────────
 * Issue Intelligence maintains per-issue session state in:
 *   .forgejo-intelligence/state/issues/<number>.json   — maps issue # → session file path
 *   .forgejo-intelligence/state/sessions/<timestamp>.jsonl — the `pi` session transcript
 *
 * On every run the agent checks for an existing mapping.  If the mapped session
 * file is still present, the run "resumes" by passing `--session <path>` to `pi`,
 * giving the agent full memory of all prior exchanges for that issue.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PUSH CONFLICT RESOLUTION
 * ─────────────────────────────────────────────────────────────────────────────
 * Multiple agents may race to push to the same branch.  To handle this gracefully
 * the script retries a failed `git push` up to 5 times, pulling with `--rebase`
 * between attempts and waiting with exponential back-off plus random jitter to
 * reduce contention.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CONCURRENCY
 * ─────────────────────────────────────────────────────────────────────────────
 * The Forgejo Actions workflow uses a `concurrency` group keyed by the issue
 * number.  This serialises runs for the *same* issue (preventing session-state
 * corruption) while allowing runs for *different* issues to proceed in parallel.
 * The push-retry loop with back-off handles the resulting cross-issue push
 * contention.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FORGEJO COMMENT SIZE LIMIT
 * ─────────────────────────────────────────────────────────────────────────────
 * Forgejo follows the same practical issue-comment envelope as Gitea-style
 * APIs. The agent reply is capped at 60 000 characters to leave a comfortable
 * safety margin.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ─────────────────────────────────────────────────────────────────────────────
 * - Node.js built-in `fs` module  (existsSync, readFileSync, writeFileSync, mkdirSync)
 * - Node.js built-in `path` module (resolve)
 * - Forgejo API adapter           — authenticated with FORGEJO_TOKEN
 * - `pi` binary                   — installed by `bun install` from package.json
 * - System tools: `tee`, `tac`, `jq`, `git`, `bash`
 * - Bun runtime                   — for Bun.spawn and top-level await
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { createForgejoApi } from "../platform/forgejo-api";
import { splitRepository } from "../platform/types";

// ─── Paths and event context ───────────────────────────────────────────────────
// `import.meta.dir` resolves to `.forgejo-intelligence/lifecycle/`; stepping up one level
// gives us the `.forgejo-intelligence/` directory which contains `state/` and `node_modules/`.
const issueIntelligenceDir = resolve(import.meta.dir, "..");
const stateDir = resolve(issueIntelligenceDir, "state");
const issuesDir = resolve(stateDir, "issues");
const sessionsDir = resolve(stateDir, "sessions");
const piSettingsPath = resolve(issueIntelligenceDir, ".pi", "settings.json");

// The `pi` CLI requires a repo-root-relative path for `--session-dir`, not an
// absolute one, so we keep this as a relative string constant.
const sessionsDirRelative = ".forgejo-intelligence/state/sessions";

// Cap comments at 60 000 characters to leave a comfortable safety margin and
// avoid API rejections.
const MAX_COMMENT_LENGTH = 60000;

const eventPath = process.env.FORGEJO_EVENT_PATH;
const eventName = process.env.FORGEJO_EVENT_NAME;
const repository = process.env.FORGEJO_REPOSITORY;
const forgejoServerUrl = process.env.FORGEJO_SERVER_URL ?? process.env.FORGEJO_INSTANCE_URL ?? "";

if (!eventPath) {
  throw new Error("FORGEJO_EVENT_PATH is required.");
}
if (!eventName) {
  throw new Error("FORGEJO_EVENT_NAME is required.");
}
if (!repository) {
  throw new Error("FORGEJO_REPOSITORY is required.");
}

const event = JSON.parse(readFileSync(eventPath, "utf-8"));
const { owner, repo } = splitRepository(repository);
const api = createForgejoApi();

// Fall back to "main" if the repository's default branch is not set in the event.
const defaultBranch = event.repository?.default_branch ?? "main";

// The issue number is present on both the `issues` and `issue_comment` payloads.
const issueNumber: number = event.issue.number;

// Read the committed `.pi` defaults and pass them explicitly to the runtime.
// This prevents provider/model drift from host-level config (for example a
// runner image with a global `~/.pi/settings.json` set to a different provider).
const piSettings = JSON.parse(readFileSync(piSettingsPath, "utf-8"));
const configuredProvider: string = piSettings.defaultProvider;
const configuredModel: string = piSettings.defaultModel;

if (!configuredProvider || !configuredModel) {
  throw new Error(
    `Invalid .pi settings at ${piSettingsPath}: expected defaultProvider and defaultModel`
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Spawn an arbitrary subprocess, capture its stdout, and return both the
 * trimmed output and the process exit code.
 *
 * @param cmd  - Command and arguments array (e.g. ["git", "push", "origin", "main"]).
 * @param opts - Optional options; `stdin` can be piped from another process.
 * @returns    - `{ exitCode, stdout }` after the process has exited.
 */
async function run(cmd: string[], opts?: { stdin?: any }): Promise<{ exitCode: number; stdout: string }> {
  const proc = Bun.spawn(cmd, {
    stdout: "pipe",
    stderr: "inherit",   // surface errors directly in the Actions log
    stdin: opts?.stdin,
  });
  const stdout = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;
  return { exitCode, stdout: stdout.trim() };
}

// ─── Restore reaction state from forgejo-intelligence-INDICATOR.ts ────────────────────────
// `forgejo-intelligence-INDICATOR.ts` runs before dependency installation and writes the 👀
// reaction metadata to `/tmp/reaction-state.json`.  We read it here so the
// `finally` block can delete the reaction when the agent finishes (or errors).
// If the file is absent (e.g., indicator step was skipped), we default to null.
const reactionState = existsSync("/tmp/reaction-state.json")
  ? JSON.parse(readFileSync("/tmp/reaction-state.json", "utf-8"))
  : null;

try {
  // ── Fetch issue title and body ───────────────────────────────────────────────
  // We always fetch the issue content from the API rather than relying solely on
  // the event payload, because the payload body can be truncated for very long issues.
  const issue = await api.getIssue(owner, repo, issueNumber);
  const title = issue.title ?? "";
  const body = issue.body ?? "";

  // ── Resolve or create session mapping ───────────────────────────────────────
  // Each issue maps to exactly one `pi` session file via `state/issues/<n>.json`.
  // If a mapping exists AND the referenced session file is still present, we resume
  // the conversation by passing `--session <path>` to `pi`.  Otherwise we start fresh.
  mkdirSync(issuesDir, { recursive: true });
  mkdirSync(sessionsDir, { recursive: true });

  let mode = "new";
  let sessionPath = "";
  const mappingFile = resolve(issuesDir, `${issueNumber}.json`);

  if (existsSync(mappingFile)) {
    const mapping = JSON.parse(readFileSync(mappingFile, "utf-8"));
    if (existsSync(mapping.sessionPath)) {
      // A prior session exists — resume it to preserve conversation context.
      mode = "resume";
      sessionPath = mapping.sessionPath;
      console.log(`Found existing session: ${sessionPath}`);
    } else {
      // The mapping points to a session file that no longer exists (e.g., cleaned up).
      console.log("Mapped session file missing, starting fresh");
    }
  } else {
    console.log("No session mapping found, starting fresh");
  }

  // ── Configure git identity ───────────────────────────────────────────────────
  // Set the bot identity for all git commits made during this run.
  await run(["git", "config", "user.name", "forgejo-intelligence[bot]"]);
  await run(["git", "config", "user.email", "forgejo-intelligence[bot]@users.noreply.forgejo"]);

  // ── Build prompt from event context ─────────────────────────────────────────
  // For `issue_comment` events, use the new comment body as the full prompt so
  // that follow-up instructions reach the agent verbatim.
  // For `issues` (opened) events, combine the title and body for full context.
  let prompt: string;
  if (eventName === "issue_comment") {
    prompt = event.comment.body;
  } else {
    prompt = `${title}\n\n${body}`;
  }

  // ── Validate provider API key ────────────────────────────────────────────────
  // This check is inside the try block so that the finally clause always runs
  // (removing the 👀 reaction) and a helpful comment can be posted to the issue.
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
  if (requiredKeyName && !process.env[requiredKeyName]) {
    await api.createIssueComment(
      owner,
      repo,
      issueNumber,
      `## ⚠️ Missing API Key: \`${requiredKeyName}\`\n\n` +
      `The configured provider is \`${configuredProvider}\`, but the \`${requiredKeyName}\` secret is not available to this workflow run.\n\n` +
      `### How to fix\n\n` +
      `**Option A — Repository secret** _(simplest)_\n` +
      `1. Go to **Settings → Secrets and variables → Actions → New repository secret**\n` +
      `2. Name: \`${requiredKeyName}\`, Value: your API key\n\n` +
      `**Option B — Organization secret** _(already have one?)_\n` +
      `Organization secrets are only available to workflows if the secret has been explicitly granted to this repository:\n` +
      `1. Go to your **Organization Settings → Secrets and variables → Actions**\n` +
      `2. Click the \`${requiredKeyName}\` secret → **Repository access**\n` +
      `3. Add **this repository** to the selected repositories list\n\n` +
      `Once the secret is accessible, re-trigger this workflow by posting a new comment on this issue.`
    );
    throw new Error(
      `${requiredKeyName} is not available to this workflow run. ` +
      `If you have set it as a repository secret, verify the secret name matches exactly. ` +
      `If you have set it as an organization secret, ensure this repository has been granted access ` +
      `(Organization Settings → Secrets and variables → Actions → ${requiredKeyName} → Repository access).`
    );
  }

  // ── Run the pi agent ─────────────────────────────────────────────────────────
  // Pipe agent output through `tee` so we get:
  //   • a live stream to stdout (visible in the Actions log in real time), and
  //   • a persisted copy at `/tmp/agent-raw.jsonl` for post-processing below.
  const piBin = resolve(issueIntelligenceDir, "node_modules", ".bin", "pi");
  const piArgs = [
    piBin,
    "--mode",
    "json",
    "--provider",
    configuredProvider,
    "--model",
    configuredModel,
    "--session-dir",
    sessionsDirRelative,
    "-p",
    prompt,
  ];
  if (mode === "resume" && sessionPath) {
    // Pass the prior session transcript so the agent can recall earlier context.
    piArgs.push("--session", sessionPath);
  }

  const pi = Bun.spawn(piArgs, { stdout: "pipe", stderr: "inherit" });
  const tee = Bun.spawn(["tee", "/tmp/agent-raw.jsonl"], { stdin: pi.stdout, stdout: "inherit" });
  await tee.exited;

  // Check if the pi agent exited successfully.
  const piExitCode = await pi.exited;
  if (piExitCode !== 0) {
    throw new Error(`pi agent exited with code ${piExitCode}. Check the workflow logs above for details.`);
  }

  // ── Extract final assistant text ─────────────────────────────────────────────
  // The `pi` agent writes newline-delimited JSON events.  We reverse the file
  // with `tac` so the most recent events appear first in the `jq` array.  We
  // then search for the most recent `message_end` where the role is `assistant`
  // AND the content contains at least one `text` block.  This correctly handles
  // cases where the final event has empty content (e.g., a 400 API error after
  // a successful tool call) by falling back to an earlier assistant message.
  const tac = Bun.spawn(["tac", "/tmp/agent-raw.jsonl"], { stdout: "pipe" });
  const jq = Bun.spawn(
    ["jq", "-r", "-s", '[ .[] | select(.type == "message_end" and .message.role == "assistant") | select((.message.content // []) | map(select(.type == "text")) | length > 0) ] | .[0].message.content[] | select(.type == "text") | .text'],
    { stdin: tac.stdout, stdout: "pipe" }
  );
  const agentText = await new Response(jq.stdout).text();
  await jq.exited;

  // ── Determine latest session file ────────────────────────────────────────────
  // After the agent run, the newest `.jsonl` file in the sessions directory is
  // the session transcript that was just written (or extended).
  const { stdout: latestSession } = await run([
    "bash", "-c", `ls -t ${sessionsDirRelative}/*.jsonl 2>/dev/null | head -1`,
  ]);

  // ── Persist issue → session mapping ─────────────────────────────────────────
  // Write (or overwrite) the mapping file so that the next run for this issue
  // can locate the correct session transcript and resume the conversation.
  if (latestSession) {
    writeFileSync(
      mappingFile,
      JSON.stringify({
        issueNumber,
        sessionPath: latestSession,
        updatedAt: new Date().toISOString(),
      }, null, 2) + "\n"
    );
    console.log(`Saved mapping: issue #${issueNumber} -> ${latestSession}`);
  } else {
    console.log("Warning: no session file found to map");
  }

  // ── Commit and push state changes ───────────────────────────────────────────
  // Stage all changes (session log, mapping JSON, any files the agent edited),
  // commit only if the index is dirty, then push with a retry-on-conflict loop.

  // Pull the latest changes first to minimise conflicts when multiple issues
  // are being processed concurrently (each writes to its own session files).
  await run(["git", "pull", "--rebase", "origin", defaultBranch]);

  await run(["git", "add", "-A"]);
  const { exitCode } = await run(["git", "diff", "--cached", "--quiet"]);
  if (exitCode !== 0) {
    // exitCode !== 0 means there are staged changes to commit.
    await run(["git", "commit", "-m", `forgejo-intelligence: work on issue #${issueNumber}`]);
  }

  // Retry push up to 5 times with exponential back-off and jitter.
  // Multiple agents processing *different* issues may race to push to the same
  // branch; extra retries and randomised delays reduce contention.
  for (let i = 1; i <= 5; i++) {
    const push = await run(["git", "push", "origin", `HEAD:${defaultBranch}`]);
    if (push.exitCode === 0) break;
    console.log(`Push failed, rebasing and retrying (${i}/5)...`);
    await run(["git", "pull", "--rebase", "origin", defaultBranch]);
    // Exponential back-off with jitter: ~1s, ~2s, ~4s, ~8s (±50%).
    // Skip the delay after the final attempt to avoid an unnecessary wait.
    if (i < 5) {
      const baseDelay = Math.pow(2, i - 1) * 1000;
      const jitter = baseDelay * (0.5 + Math.random());
      await new Promise((resolve) => setTimeout(resolve, jitter));
    }
  }

  // ── Post reply as issue comment ──────────────────────────────────────────────
  // Guard against empty/null responses — post an error message instead of silence.
  const trimmedText = agentText.trim();
  const commentBody = trimmedText.length > 0
    ? trimmedText.slice(0, MAX_COMMENT_LENGTH)
    : `The agent ran successfully but did not produce a text response. Check the repository for any file changes that were made.\n\nFor full details, see the workflow run logs: ${forgejoServerUrl}/${repository}/actions`;
  await api.createIssueComment(owner, repo, issueNumber, commentBody);

} finally {
  // ── Guaranteed cleanup: remove 👀 reaction ───────────────────────────────────
  // This block always executes — even when the try block throws — ensuring the
  // 👀 activity indicator is always removed so users know the agent has stopped.
  if (reactionState?.reactionId) {
    try {
      const { reactionTarget, commentId, reactionContent = "eyes" } = reactionState;
      const reactionRepo = splitRepository(reactionState.repo ?? repository);
      if (reactionTarget === "comment" && commentId) {
        await api.deleteIssueCommentReaction(reactionRepo.owner, reactionRepo.repo, commentId, reactionContent);
      } else {
        await api.deleteIssueReaction(reactionRepo.owner, reactionRepo.repo, issueNumber, reactionContent);
      }
    } catch (e) {
      // Log but do not re-throw — a failed cleanup should not mask the original error.
      console.error("Failed to remove reaction:", e);
    }
  }
}
