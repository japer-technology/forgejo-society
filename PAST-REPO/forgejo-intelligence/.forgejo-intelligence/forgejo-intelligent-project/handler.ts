/**
 * handler.ts — Surface handler for Forgejo Project intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides project-specific prompt building and response posting for the
 * orchestrator.  This handler extracts project board context (item changes,
 * field updates, project metadata) and posts the AI response as a comment on
 * the linked issue/PR or logs when no natural target exists.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - projects_v2_item (created, edited, deleted, archived, restored, reordered)
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

/** Build the prompt string from a project board event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Project item ${event.action}: ${event.title}`);

  if (event.metadata.projectName) {
    parts.push(`Project: ${event.metadata.projectName}`);
  }
  if (event.metadata.fieldName) {
    parts.push(`Field: ${event.metadata.fieldName}`);
  }
  if (event.metadata.fieldValue) {
    parts.push(`Value: ${event.metadata.fieldValue}`);
  }
  if (event.metadata.contentType) {
    parts.push(`Content type: ${event.metadata.contentType}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Comments on linked issue/PR when available. */
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
      `[forgejo-intelligent-project] No target issue/PR for project event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-project-item session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const projectId = event.metadata.projectId ?? "unknown";
  const itemId = event.metadata.itemId ?? event.nodeId ?? "unknown";
  return `projects/${projectId}/${itemId}`;
}

/** Return the concurrency key (serializes runs for the same project). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const projectId = event.metadata.projectId ?? "unknown";
  return `project-intelligence-${projectId}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}
