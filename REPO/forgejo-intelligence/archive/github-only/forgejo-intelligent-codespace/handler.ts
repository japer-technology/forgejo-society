/**
 * handler.ts — Surface handler for Forgejo Codespace intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides codespace-specific prompt building and response posting for the
 * orchestrator.  This handler extracts codespace lifecycle context (creation,
 * start, stop, deletion) and logs the AI response since codespace events do
 * not have a natural comment target.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - codespace lifecycle events (created, started, stopped, deleted)
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

/** Build the prompt string from a codespace event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  parts.push(`Codespace ${event.action}: ${event.title}`);

  if (event.metadata.codespaceName) {
    parts.push(`Codespace: ${event.metadata.codespaceName}`);
  }
  if (event.metadata.machine) {
    parts.push(`Machine type: ${event.metadata.machine}`);
  }
  if (event.metadata.owner) {
    parts.push(`Owner: ${event.metadata.owner}`);
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Comments on associated issue when available, otherwise logs. */
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
      `[forgejo-intelligent-codespace] No target issue/PR for codespace event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-codespace session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const name = (event.metadata.codespaceName as string) ?? event.nodeId ?? "unknown";
  return `codespaces/${name}`;
}

/** Return the concurrency key (serializes runs for the same codespace). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const name = (event.metadata.codespaceName as string) ?? "unknown";
  return `codespace-intelligence-${name}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}
