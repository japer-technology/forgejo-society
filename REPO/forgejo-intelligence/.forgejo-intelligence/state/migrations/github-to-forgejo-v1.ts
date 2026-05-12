import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "fs";
import { basename, dirname, resolve } from "path";

export const CURRENT_STATE_SCHEMA_VERSION = 1;
export const STATE_SCHEMA_FILE = "schema-version.json";

export interface StateMigrationOptions {
  stateDir?: string;
  now?: string;
}

export interface StateMigrationResult {
  schemaVersion: number;
  schemaPath: string;
  mappingsChecked: number;
  mappingsUpdated: number;
  sessionsChecked: number;
  sessionFilesMissing: string[];
}

interface SessionMapping {
  schemaVersion?: number;
  platform?: string;
  surface?: string;
  number?: number | null;
  issueNumber?: number;
  pullRequestNumber?: number;
  prNumber?: number;
  sessionPath?: string;
  migratedFrom?: string;
  migratedAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export function ensureStateSchema(options: StateMigrationOptions = {}): StateMigrationResult {
  const stateDir = options.stateDir ?? resolve(import.meta.dir, "..");
  const now = options.now ?? new Date().toISOString();

  mkdirSync(stateDir, { recursive: true });
  mkdirSync(resolve(stateDir, "issues"), { recursive: true });
  mkdirSync(resolve(stateDir, "pull-requests"), { recursive: true });
  mkdirSync(resolve(stateDir, "sessions"), { recursive: true });

  const issueResult = migrateMappingDirectory(resolve(stateDir, "issues"), "issue", now);
  const pullRequestResult = migrateMappingDirectory(resolve(stateDir, "pull-requests"), "pull-request", now);
  const sessionFilesMissing = [
    ...issueResult.sessionFilesMissing,
    ...pullRequestResult.sessionFilesMissing,
  ];

  const schemaPath = resolve(stateDir, STATE_SCHEMA_FILE);
  const existingSchema = readJsonIfPresent(schemaPath) as { schemaVersion?: number; updatedAt?: string } | null;
  const schemaUpdatedAt =
    existingSchema?.schemaVersion === CURRENT_STATE_SCHEMA_VERSION && existingSchema.updatedAt
      ? existingSchema.updatedAt
      : now;
  const schemaDocument = {
    schemaVersion: CURRENT_STATE_SCHEMA_VERSION,
    platform: "forgejo",
    migration: "github-to-forgejo-v1",
    stateRoot: ".forgejo-intelligence/state",
    sessionRoot: ".forgejo-intelligence/state/sessions",
    mappingRoots: {
      issues: ".forgejo-intelligence/state/issues",
      pullRequests: ".forgejo-intelligence/state/pull-requests",
    },
    updatedAt: schemaUpdatedAt,
  };

  writeJsonIfChanged(schemaPath, schemaDocument);

  return {
    schemaVersion: CURRENT_STATE_SCHEMA_VERSION,
    schemaPath,
    mappingsChecked: issueResult.checked + pullRequestResult.checked,
    mappingsUpdated: issueResult.updated + pullRequestResult.updated,
    sessionsChecked: countSessionFiles(resolve(stateDir, "sessions")),
    sessionFilesMissing,
  };
}

export function normalizeSessionPath(sessionPath: string | undefined): string | undefined {
  if (!sessionPath) return sessionPath;
  return sessionPath.replace(/\.github-intelligence\/state\/sessions\//g, ".forgejo-intelligence/state/sessions/");
}

function migrateMappingDirectory(
  directory: string,
  surface: "issue" | "pull-request",
  now: string
): { checked: number; updated: number; sessionFilesMissing: string[] } {
  let checked = 0;
  let updated = 0;
  const sessionFilesMissing: string[] = [];

  if (!existsSync(directory)) {
    return { checked, updated, sessionFilesMissing };
  }

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;

    checked += 1;
    const path = resolve(directory, entry.name);
    const original = JSON.parse(readFileSync(path, "utf-8")) as SessionMapping;
    const number = resolveMappingNumber(original, entry.name, surface);
    const normalizedSessionPath = normalizeSessionPath(original.sessionPath);
    copyLegacySessionIfPresent(directory, original.sessionPath, normalizedSessionPath);
    const migrated: SessionMapping = {
      ...original,
      schemaVersion: CURRENT_STATE_SCHEMA_VERSION,
      platform: "forgejo",
      surface,
      number,
      sessionPath: normalizedSessionPath,
      updatedAt: String(original.updatedAt ?? now),
    };

    if (surface === "issue" && number !== null) {
      migrated.issueNumber = number;
    }

    if (surface === "pull-request" && number !== null) {
      migrated.pullRequestNumber = number;
      delete migrated.prNumber;
    }

    if (original.sessionPath?.includes(".github-intelligence/")) {
      migrated.migratedFrom = "github-intelligence";
      migrated.migratedAt = now;
    }

    if (normalizedSessionPath && !sessionPathExists(directory, normalizedSessionPath)) {
      sessionFilesMissing.push(normalizedSessionPath);
    }

    if (JSON.stringify(original) !== JSON.stringify(migrated)) {
      writeFileSync(path, JSON.stringify(migrated, null, 2) + "\n");
      updated += 1;
    }
  }

  return { checked, updated, sessionFilesMissing };
}

function resolveMappingNumber(
  mapping: SessionMapping,
  filename: string,
  surface: "issue" | "pull-request"
): number | null {
  const value =
    mapping.number ??
    (surface === "issue" ? mapping.issueNumber : mapping.pullRequestNumber ?? mapping.prNumber) ??
    Number.parseInt(basename(filename, ".json"), 10);

  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sessionPathExists(mappingDirectory: string, sessionPath: string): boolean {
  if (existsSync(sessionPath)) return true;

  return existsSync(resolveRepoRelativePath(mappingDirectory, sessionPath));
}

function copyLegacySessionIfPresent(
  mappingDirectory: string,
  originalSessionPath: string | undefined,
  normalizedSessionPath: string | undefined
): void {
  if (!originalSessionPath || !normalizedSessionPath) return;
  if (originalSessionPath === normalizedSessionPath) return;
  if (!originalSessionPath.includes(".github-intelligence/")) return;

  const source = resolveRepoRelativePath(mappingDirectory, originalSessionPath);
  const target = resolveRepoRelativePath(mappingDirectory, normalizedSessionPath);
  if (!existsSync(source) || existsSync(target)) return;

  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}

function resolveRepoRelativePath(mappingDirectory: string, path: string): string {
  const stateDir = resolve(mappingDirectory, "..");
  const repoRoot = resolve(stateDir, "..", "..");
  return resolve(repoRoot, path);
}

function countSessionFiles(sessionsDir: string): number {
  if (!existsSync(sessionsDir)) return 0;
  return readdirSync(sessionsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl"))
    .length;
}

function writeJsonIfChanged(path: string, value: unknown): void {
  const next = JSON.stringify(value, null, 2) + "\n";
  if (existsSync(path) && readFileSync(path, "utf-8") === next) {
    return;
  }

  writeFileSync(path, next);
}

function readJsonIfPresent(path: string): unknown | null {
  if (!existsSync(path)) return null;

  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

if (import.meta.main) {
  const result = ensureStateSchema();
  console.log(JSON.stringify(result, null, 2));
}
