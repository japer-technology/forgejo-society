/**
 * handler.ts - Surface handler for Forgejo developer environment intelligence.
 *
 * Forgejo does not provide a hosted codespace product. This surface is deliberately
 * narrower: it handles repository-owned developer environment metadata emitted
 * by a target instance or external integration, and otherwise logs safely.
 */

import type { NormalizedEvent } from "../forgejo-intelligence-bridge/bridge";
import { splitRepository } from "../platform/types";
import type { ForgejoApi } from "../platform/types";

export interface ReactionTarget {
  type: "issue" | "comment";
  issueNumber: number;
  commentId?: number;
}

export function buildPrompt(event: NormalizedEvent): string {
  const parts: string[] = [];
  const name = (event.metadata.devEnvironmentName as string) ?? event.title;

  parts.push(`Developer environment ${event.action || "event"}: ${name}`);
  if (event.metadata.machine) {
    parts.push(`Machine: ${event.metadata.machine}`);
  }
  if (event.metadata.owner) {
    parts.push(`Owner: ${event.metadata.owner}`);
  }
  if (event.body) {
    parts.push(`\n${event.body}`);
  }

  return parts.join("\n");
}

export async function postResponse(
  event: NormalizedEvent,
  response: string,
  api: ForgejoApi
): Promise<void> {
  if (event.number) {
    const { owner, repo } = splitRepository(event.repository);
    await api.createIssueComment(owner, repo, event.number, response);
    return;
  }

  console.log(
    `[forgejo-intelligent-dev-environment] No target issue/PR for developer environment event; response logged.\n${response}`
  );
}

export function getSessionKey(event: NormalizedEvent): string {
  const name = (event.metadata.devEnvironmentName as string) ?? event.nodeId ?? "unknown";
  return `dev-environments/${name}`;
}

export function getConcurrencyKey(event: NormalizedEvent): string {
  const name = (event.metadata.devEnvironmentName as string) ?? "unknown";
  return `dev-environment-intelligence-${name}`;
}

export function getReactionTarget(event: NormalizedEvent): ReactionTarget {
  return {
    type: "issue",
    issueNumber: event.number ?? 0,
  };
}
