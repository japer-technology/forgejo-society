/**
 * forgejo-intelligence-INDICATOR.ts — Adds a 👀 reaction to signal that the agent is working.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * This script serves as the "activity indicator" for Forgejo Intelligence.  It runs
 * *before* dependency installation (hence "pre-install") so that users
 * receive immediate visual feedback on the triggering issue, PR, or comment —
 * in the form of a 👀 (eyes) emoji reaction — the moment the workflow starts.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LIFECYCLE POSITION
 * ─────────────────────────────────────────────────────────────────────────────
 * Workflow step order:
 *   1. Guard       (forgejo-intelligence-ENABLED.ts)        — verify opt-in sentinel exists
 *   2. Preinstall  (forgejo-intelligence-INDICATOR.ts)      ← YOU ARE HERE
 *   3. Install     (bun install)                           — install npm/bun dependencies
 *   4. Run         (forgejo-intelligence-ORCHESTRATOR.ts)   — orchestrate the AI agent
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * REACTION STATE HANDOFF
 * ─────────────────────────────────────────────────────────────────────────────
 * After adding the reaction this script persists the reaction metadata
 * (reaction ID, target type, comment ID if applicable) to a temporary JSON
 * file at `/tmp/reaction-state.json`.
 *
 * The orchestrator reads that file in its `finally` block and uses the
 * stored IDs to DELETE the 👀 reaction once the agent finishes — regardless
 * of whether the run succeeded or failed.  This guarantees the indicator is
 * always cleaned up.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MULTI-SURFACE EVENT HANDLING
 * ─────────────────────────────────────────────────────────────────────────────
 * The script handles multiple Forgejo event types:
 *
 *   issue_comment                → reacts to the COMMENT (issues/comments/{id}/reactions)
 *   issues                       → reacts to the ISSUE (issues/{number}/reactions)
 *   pull_request                 → reacts to the PR (issues/{number}/reactions — PRs share the issue API)
 *   other events                 → no reaction (graceful no-op)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FAULT TOLERANCE
 * ─────────────────────────────────────────────────────────────────────────────
 * Failures to add the reaction are caught and logged but do NOT abort the
 * workflow — a missing indicator emoji is not a critical error.  The state
 * file is always written (with `reactionId: null` on failure) so that
 * the orchestrator does not crash when it tries to read it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DEPENDENCIES
 * ─────────────────────────────────────────────────────────────────────────────
 * - Node.js built-in `fs` module  (readFileSync, writeFileSync)
 * - Forgejo API adapter           — authenticated with FORGEJO_TOKEN
 * - Bun runtime                   — for Bun.spawn and top-level await
 */

import { readFileSync, writeFileSync } from "fs";
import { splitRepository } from "../platform/types";
import { createRuntimeApi } from "./runtime";
import type { ForgejoApi } from "../platform/types";

// ─── Read Forgejo Actions event context ───────────────────────────────────────
const eventPath = process.env.FORGEJO_EVENT_PATH;
const eventName = process.env.FORGEJO_EVENT_NAME;
const repository = process.env.FORGEJO_REPOSITORY;

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

// Resolve the target number — issues and PRs share the `issue.number` field,
// but PR-specific events use `pull_request.number`.
const issueNumber: number | null =
  event.issue?.number ?? event.pull_request?.number ?? null;

// ─── Add 👀 reaction ──────────────────────────────────────────────────────────
// Track three pieces of information that the orchestrator needs for cleanup:
//   reactionId     — retained as a truthy success marker for the orchestrator
//   reactionTarget — "comment" or "issue" (determines which API endpoint to DELETE)
//   commentId      — the comment's ID, only set when reactionTarget === "comment"
let reactionId: string | null = null;
let reactionTarget: "comment" | "issue" = "issue";
let commentId: number | null = null;
let indicatorMode: "reaction" | "progress-comment" | "noop" = "noop";
const reactionContent = "eyes";
let api: ForgejoApi | null = null;

try {
  api = createRuntimeApi();

  if (eventName === "issue_comment") {
    // ── React to the comment that triggered the workflow ─────────────────────
    commentId = event.comment.id;
    const reaction = await api.addIssueCommentReaction(owner, repo, commentId, reactionContent);
    reactionId = reaction.content;
    reactionTarget = "comment";
    indicatorMode = "reaction";
  } else if (eventName === "pull_request_review_comment") {
    // ── React to the PR review comment ──────────────────────────────────────
    commentId = event.comment.id;
    const reaction = await api.addIssueCommentReaction(owner, repo, commentId, reactionContent);
    reactionId = reaction.content;
    reactionTarget = "comment";
    indicatorMode = "reaction";
  } else if (issueNumber) {
    // ── React to the issue or PR itself ─────────────────────────────────────
    const reaction = await api.addIssueReaction(owner, repo, issueNumber, reactionContent);
    reactionId = reaction.content;
    indicatorMode = "reaction";
  } else {
    // ── No reaction target for this event type (e.g. discussion, push) ──────
    console.log(`No reaction target for event type "${eventName}" — skipping indicator.`);
  }
} catch (e) {
  // A failed reaction is non-fatal. Some Forgejo instances disable reaction
  // endpoints; fall back to a compact progress comment where there is a natural
  // issue or PR target.
  console.error("Failed to add reaction:", e);
  if (api && issueNumber) {
    try {
      await api.createIssueComment(
        owner,
        repo,
        issueNumber,
        "Forgejo Intelligence is working on this event."
      );
      indicatorMode = "progress-comment";
      console.log("Posted progress comment because reaction indicator was unavailable.");
    } catch (fallbackError) {
      console.error("Failed to post progress comment fallback:", fallbackError);
    }
  }
}

// ─── Persist reaction state for orchestrator cleanup ────────────────────────
// Write all fields to a well-known temp path.  The orchestrator reads this
// file inside its `finally` block and uses the IDs to DELETE the reaction
// once the agent finishes — ensuring the indicator is always cleaned up,
// even if the agent itself throws an error.
writeFileSync("/tmp/reaction-state.json", JSON.stringify({
  reactionId,
  reactionTarget,
  reactionContent,
  indicatorMode,
  commentId,
  issueNumber,
  repo: repository,
}));
