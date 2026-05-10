/**
 * handler.ts — Surface handler for Forgejo Deployment intelligence.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides deployment-specific prompt building and response posting for the
 * orchestrator.  This handler extracts deployment context (environment,
 * status, SHA, description) and posts the AI response back as a comment on
 * the associated PR or logs when no natural target exists.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPPORTED EVENTS
 * ─────────────────────────────────────────────────────────────────────────────
 * - deployment (created)
 * - deployment_status (created)
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

/** Build the prompt string from a deployment event for the AI agent. */
export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];

  if (event.platformEvent === "deployment_status") {
    parts.push(`Deployment status: ${event.title}`);
    if (event.metadata.environment) {
      parts.push(`Environment: ${event.metadata.environment}`);
    }
    if (event.metadata.state) {
      parts.push(`State: ${event.metadata.state}`);
    }
    if (event.metadata.description) {
      parts.push(`Description: ${event.metadata.description}`);
    }
  } else {
    parts.push(`Deployment: ${event.title}`);
    if (event.metadata.environment) {
      parts.push(`Environment: ${event.metadata.environment}`);
    }
    if (event.metadata.sha) {
      parts.push(`SHA: ${event.metadata.sha}`);
    }
  }

  if (event.body) {
    parts.push(`\n${event.body}`);
  }
  return parts.join("\n");
}

/** Post the AI response. Comments on associated PR or logs when none exists. */
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
      `[forgejo-intelligent-deployment] No target issue/PR for deployment event; response logged.\n${response}`
    );
  }
}

/** Return the session key for per-deployment session persistence. */
export function getSessionKey(event: NormalizedEvent): string {
  const env = (event.metadata.environment as string) ?? "unknown";
  const id = event.metadata.deploymentId ?? event.nodeId ?? "unknown";
  return `deployments/${env}/${id}`;
}

/** Return the concurrency key (serializes runs for the same environment). */
export function getConcurrencyKey(event: NormalizedEvent): string {
  const env = (event.metadata.environment as string) ?? "default";
  return `deployment-intelligence-${env}`;
}

/** Return the reaction target for the 👀 indicator. */
export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}
