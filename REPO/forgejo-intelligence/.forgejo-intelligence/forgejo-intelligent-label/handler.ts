/**
 * handler.ts — Surface handler for Forgejo Label intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides label-specific prompt building and response posting for the
 * orchestrator.  This handler extracts label context (label name, color,
 * associated issue/PR) and posts the AI response back as a comment on the
 * labeled issue or pull request.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - label (created, edited, deleted)
 * - issues / pull_request (labeled, unlabeled)
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import { splitRepository } from "../platform/types";
import type { ForgejoApi } from "../platform/types";

/** Reaction target for the 👀 indicator. */
export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

/** Build the prompt string from a label event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  const labelName = (event.metadata.labelName as string) ?? event.title;

  if (event.action === "labeled" || event.action === "unlabeled") {
    parts.push(`Label "${labelName}" ${event.action} on #${event.number}`);
  } else {
    parts.push(`Label ${event.action}: "${labelName}"`);
    if (event.metadata.color) {
      parts.push(`Color: #${event.metadata.color}`);
    }
    if (event.metadata.description) {
      parts.push(`Description: ${event.metadata.description}`);
    }
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response as a comment on the labeled issue/PR. */
export async function postResponse(
  event: NormalizedEvent,
  response: string,
  api: ForgejoApi
): Promise<void> {
  if (event.number) {
    const { owner, repo } = splitRepository(event.repository);
    await api.createIssueComment(owner, repo, event.number!, response);
  } else {
    console.log(
      `[forgejo-intelligent-label] No target issue/PR for label event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-label session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  if (event.number) {
    return `labels/${event.number}`;
  }
  const labelName = (event.metadata.labelName as string) ?? event.title;
  return `labels/${labelName}`;
}

/** Return the concurrency key (serializes runs for the same issue/label). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  if (event.number) {
    return `label-intelligence-${event.number}`;
  }
  const labelName = (event.metadata.labelName as string) ?? "unknown";
  return `label-intelligence-${labelName}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}
