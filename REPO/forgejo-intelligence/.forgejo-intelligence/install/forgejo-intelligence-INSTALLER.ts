#!/usr/bin/env bun
/**
 * forgejo-intelligence-INSTALLER.ts - one-time setup and migration CLI.
 *
 * The installer is intentionally conservative:
 * - default installs never overwrite existing user files;
 * - `--force` is required to replace managed files;
 * - `--dry-run` prints planned file operations without writing;
 * - `--migrate` moves a legacy dot-git-hosting intelligence install into the
 *   Forgejo paths before installing the current Forgejo-managed files.
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import { dirname, relative, resolve, sep } from "path";
import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline/promises";

const LEGACY_HOSTING_NAME = "git" + "hub";
const LEGACY_INTELLIGENCE_DIR = `.${LEGACY_HOSTING_NAME}-intelligence`;
const LEGACY_INTELLIGENCE_PREFIX = `${LEGACY_HOSTING_NAME}-intelligence`;
const LEGACY_INTELLIGENT_PREFIX = `${LEGACY_HOSTING_NAME}-intelligent`;
const LEGACY_AI_PREFIX = `${LEGACY_HOSTING_NAME}-ai`;
const LEGACY_ARCHIVE_DIR = ".forgejo-intelligence/state/migrations/legacy-source-intelligence";

export const DEFAULT_ACTIVE_SURFACES = [
  "action",
  "branch",
  "commit",
  "dev-environment",
  "fork",
  "issue",
  "label",
  "milestone",
  "notification",
  "package",
  "page",
  "project",
  "pull-request",
  "reaction",
  "release",
  "repository",
  "security",
  "star",
  "team",
  "wiki",
].sort();

export const DEFAULT_LLM_SECRET_NAMES: Record<string, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  google: "GEMINI_API_KEY",
  xai: "XAI_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  mistral: "MISTRAL_API_KEY",
  groq: "GROQ_API_KEY",
};

const TEXT_EXTENSIONS = new Set([
  "",
  ".cjs",
  ".css",
  ".env",
  ".gitignore",
  ".gitattributes",
  ".html",
  ".js",
  ".json",
  ".jsonl",
  ".lock",
  ".md",
  ".mjs",
  ".sh",
  ".toml",
  ".ts",
  ".txt",
  ".yaml",
  ".yml",
]);

export type ApiTokenStrategy =
  | { kind: "actions" }
  | { kind: "secret"; secretName: string };

export interface InstallerConfig {
  forgejoInstanceUrl: string;
  apiTokenStrategy: ApiTokenStrategy;
  llmSecretNames: Record<string, string>;
  enabledSurfaces: string[];
  runnerLabel: string;
  issueTemplatePath: string;
  installerVersion: 1;
  installedAt: string;
}

export interface InstallOptions {
  repoRoot?: string;
  bootstrapDir?: string;
  dryRun?: boolean;
  force?: boolean;
  migrate?: boolean;
  interactive?: boolean;
  config?: Partial<InstallerConfig>;
}

export interface InstallResult {
  config: InstallerConfig;
  operations: string[];
}

interface CliOptions extends InstallOptions {
  help?: boolean;
}

const bootstrapDir = import.meta.dir;
const repoRoot = resolve(bootstrapDir, "..", "..");

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeRepoPath(path: string): string {
  return path.split(sep).join("/");
}

function relativeTo(root: string, path: string): string {
  const rel = normalizeRepoPath(relative(root, path));
  return rel.length > 0 ? rel : ".";
}

function isWithin(root: string, candidate: string): boolean {
  const relativePath = relative(root, candidate);
  return relativePath === "" || (!relativePath.startsWith("..") && !relativePath.startsWith("/"));
}

function resolveInsideRepo(root: string, requestedPath: string): string {
  const absolutePath = resolve(root, requestedPath);
  if (!isWithin(root, absolutePath)) {
    throw new Error(`Refusing to install outside the repository: ${requestedPath}`);
  }
  return absolutePath;
}

function readTextIfExists(path: string): string | null {
  return existsSync(path) ? readFileSync(path, "utf-8") : null;
}

function isSamePath(a: string, b: string): boolean {
  return resolve(a) === resolve(b);
}

function normalizeSurfaceName(surface: string): string {
  return surface.trim().replace(/^forgejo-intelligent-/, "");
}

function parseSurfaceList(inputValue: string | undefined): string[] {
  if (!inputValue || inputValue.trim() === "" || inputValue.trim().toLowerCase() === "all") {
    return [...DEFAULT_ACTIVE_SURFACES];
  }

  const normalized = inputValue
    .split(",")
    .map(normalizeSurfaceName)
    .filter(Boolean);

  const invalid = normalized.filter((surface) => !DEFAULT_ACTIVE_SURFACES.includes(surface));
  if (invalid.length > 0) {
    throw new Error(`Unknown Forgejo surface(s): ${invalid.join(", ")}`);
  }

  return [...new Set(normalized)].sort();
}

function parseSecretMap(inputValue: string | undefined): Record<string, string> {
  const secrets = { ...DEFAULT_LLM_SECRET_NAMES };
  if (!inputValue || inputValue.trim() === "") return secrets;

  for (const pair of inputValue.split(",")) {
    const [providerRaw, secretRaw] = pair.split("=");
    const provider = providerRaw?.trim();
    const secret = secretRaw?.trim();
    if (!provider || !secret) {
      throw new Error(`Invalid LLM secret mapping: ${pair}. Use provider=SECRET_NAME.`);
    }
    secrets[provider] = secret;
  }

  return secrets;
}

function parseApiTokenStrategy(inputValue: string | undefined): ApiTokenStrategy {
  const value = (inputValue ?? "actions").trim();
  if (value === "" || value === "actions" || value === "forgejo-token") {
    return { kind: "actions" };
  }

  const secretMatch = value.match(/^secret(?::|=)([A-Z0-9_]+)$/i);
  if (secretMatch) {
    return { kind: "secret", secretName: secretMatch[1].toUpperCase() };
  }

  if (/^[A-Z0-9_]+$/i.test(value)) {
    return { kind: "secret", secretName: value.toUpperCase() };
  }

  throw new Error(`Invalid API token strategy: ${value}. Use actions or secret:SECRET_NAME.`);
}

function formatApiTokenStrategy(strategy: ApiTokenStrategy): string {
  return strategy.kind === "actions" ? "actions" : `secret:${strategy.secretName}`;
}

function formatSecretMap(secrets: Record<string, string>): string {
  return Object.entries(secrets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([provider, secret]) => `${provider}=${secret}`)
    .join(",");
}

function formatYamlScalar(value: string): string {
  if (/^[A-Za-z0-9_.:/@-]+$/.test(value)) return value;
  return JSON.stringify(value);
}

function formatRunsOn(runnerLabel: string): string {
  const labels = runnerLabel
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);

  if (labels.length === 0) return "docker";
  if (labels.length === 1) return formatYamlScalar(labels[0]);
  return `[${labels.map((label) => JSON.stringify(label)).join(", ")}]`;
}

function workflowSecretExpression(secretName: string): string {
  return "${{ secrets." + secretName + " }}";
}

function buildConfig(partial: Partial<InstallerConfig> = {}): InstallerConfig {
  return {
    forgejoInstanceUrl:
      partial.forgejoInstanceUrl ??
      process.env.FORGEJO_SERVER_URL ??
      "https://forgejo.example.com",
    apiTokenStrategy: partial.apiTokenStrategy ?? { kind: "actions" },
    llmSecretNames: {
      ...DEFAULT_LLM_SECRET_NAMES,
      ...(partial.llmSecretNames ?? {}),
    },
    enabledSurfaces:
      partial.enabledSurfaces && partial.enabledSurfaces.length > 0
        ? parseSurfaceList(partial.enabledSurfaces.join(","))
        : [...DEFAULT_ACTIVE_SURFACES],
    runnerLabel: partial.runnerLabel ?? "docker",
    issueTemplatePath: partial.issueTemplatePath ?? ".forgejo/ISSUE_TEMPLATE",
    installerVersion: 1,
    installedAt: partial.installedAt ?? nowIso(),
  };
}

async function promptForConfig(defaultConfig: InstallerConfig): Promise<InstallerConfig> {
  const rl = createInterface({ input, output });
  try {
    const forgejoInstanceUrl =
      (await rl.question(`Forgejo instance URL [${defaultConfig.forgejoInstanceUrl}]: `)).trim() ||
      defaultConfig.forgejoInstanceUrl;

    const tokenAnswer =
      (await rl.question(
        `API token strategy, actions or secret:NAME [${formatApiTokenStrategy(defaultConfig.apiTokenStrategy)}]: `
      )).trim() || formatApiTokenStrategy(defaultConfig.apiTokenStrategy);

    const secretAnswer =
      (await rl.question(
        `LLM provider secret names, provider=SECRET comma list [${formatSecretMap(defaultConfig.llmSecretNames)}]: `
      )).trim() || formatSecretMap(defaultConfig.llmSecretNames);

    const surfacesAnswer =
      (await rl.question("Enabled surfaces, comma list or all [all]: ")).trim() || "all";

    const runnerLabel =
      (await rl.question(`Runner label [${defaultConfig.runnerLabel}]: `)).trim() ||
      defaultConfig.runnerLabel;

    const issueTemplatePath =
      (await rl.question(
        `Issue template directory [${defaultConfig.issueTemplatePath}]: `
      )).trim() || defaultConfig.issueTemplatePath;

    return buildConfig({
      forgejoInstanceUrl,
      apiTokenStrategy: parseApiTokenStrategy(tokenAnswer),
      llmSecretNames: parseSecretMap(secretAnswer),
      enabledSurfaces: parseSurfaceList(surfacesAnswer),
      runnerLabel,
      issueTemplatePath,
      installedAt: defaultConfig.installedAt,
    });
  } finally {
    rl.close();
  }
}

class FilePlanner {
  readonly operations: string[] = [];

  constructor(
    readonly root: string,
    readonly dryRun: boolean,
    readonly force: boolean
  ) {}

  private log(message: string): void {
    this.operations.push(message);
    console.log(message);
  }

  ensureDir(path: string, label = relativeTo(this.root, path)): void {
    if (existsSync(path)) {
      this.log(`  - ${label} already exists`);
      return;
    }

    this.log(`  ${this.dryRun ? "would create" : "created"} ${label}`);
    if (!this.dryRun) mkdirSync(path, { recursive: true });
  }

  copyPath(src: string, dest: string, label = relativeTo(this.root, dest)): void {
    if (!existsSync(src)) {
      this.log(`  - ${label} source missing, skipping`);
      return;
    }

    if (existsSync(dest)) {
      if (!this.force) {
        const srcStat = statSync(src);
        const destStat = statSync(dest);
        if (srcStat.isFile() && destStat.isFile() && readTextIfExists(src) === readTextIfExists(dest)) {
          this.log(`  - ${label} already up to date`);
        } else {
          this.log(`  - ${label} exists, skipping (use --force to replace)`);
        }
        return;
      }

      this.log(`  ${this.dryRun ? "would replace" : "replaced"} ${label}`);
      if (!this.dryRun) rmSync(dest, { recursive: true, force: true });
    } else {
      this.log(`  ${this.dryRun ? "would install" : "installed"} ${label}`);
    }

    if (!this.dryRun) {
      mkdirSync(dirname(dest), { recursive: true });
      cpSync(src, dest, { recursive: true });
    }
  }

  writeFile(path: string, content: string, label = relativeTo(this.root, path)): void {
    const currentContent = readTextIfExists(path);
    if (currentContent === content) {
      this.log(`  - ${label} already up to date`);
      return;
    }

    if (currentContent !== null && !this.force) {
      this.log(`  - ${label} exists, skipping (use --force to replace)`);
      return;
    }

    this.log(`  ${this.dryRun ? "would write" : "wrote"} ${label}`);
    if (!this.dryRun) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content, "utf-8");
    }
  }

  appendLine(path: string, line: string, label = relativeTo(this.root, path)): void {
    const currentContent = readTextIfExists(path);
    if (currentContent === null) {
      this.writeFile(path, `${line}\n`, label);
      return;
    }

    const activeLines = currentContent
      .split(/\r?\n/)
      .map((currentLine) => currentLine.trim())
      .filter((currentLine) => currentLine.length > 0 && !currentLine.startsWith("#"));

    if (activeLines.includes(line)) {
      this.log(`  - ${label} already contains ${line}`);
      return;
    }

    const separator = currentContent.endsWith("\n") || currentContent.length === 0 ? "" : "\n";
    this.log(`  ${this.dryRun ? "would append" : "appended"} ${line} to ${label}`);
    if (!this.dryRun) {
      writeFileSync(path, `${currentContent}${separator}${line}\n`, "utf-8");
    }
  }

  movePath(src: string, dest: string, label: string): void {
    if (!existsSync(src)) {
      this.log(`  - ${label} source missing, skipping`);
      return;
    }

    if (existsSync(dest)) {
      if (!this.force) {
        this.log(`  - ${label} destination exists, skipping (use --force to replace)`);
        return;
      }
      this.log(`  ${this.dryRun ? "would replace" : "replaced"} ${label}`);
      if (!this.dryRun) rmSync(dest, { recursive: true, force: true });
    } else {
      this.log(`  ${this.dryRun ? "would move" : "moved"} ${label}`);
    }

    if (!this.dryRun) {
      mkdirSync(dirname(dest), { recursive: true });
      try {
        renameSync(src, dest);
      } catch {
        cpSync(src, dest, { recursive: true });
        rmSync(src, { recursive: true, force: true });
      }
    }
  }
}

function renderWorkflowTemplate(template: string, config: InstallerConfig): string {
  let rendered = template.replace(
    /^    runs-on: .+$/m,
    `    runs-on: ${formatRunsOn(config.runnerLabel)}`
  );

  const tokenExpression =
    config.apiTokenStrategy.kind === "actions"
      ? "${{ forgejo.token }}"
      : workflowSecretExpression(config.apiTokenStrategy.secretName);

  rendered = rendered
    .replace(
      /^  FORGEJO_INTELLIGENCE_FORK_PR_POLICY: skip$/m,
      [
        "  FORGEJO_INTELLIGENCE_FORK_PR_POLICY: skip",
        `  FORGEJO_INTELLIGENCE_INSTANCE_URL: ${formatYamlScalar(config.forgejoInstanceUrl)}`,
        `  FORGEJO_INTELLIGENCE_ENABLED_SURFACES: ${formatYamlScalar(config.enabledSurfaces.join(","))}`,
      ].join("\n")
    )
    .replace(
      /^      FORGEJO_TOKEN: .+$/m,
      `      FORGEJO_TOKEN: ${tokenExpression}`
    )
    .replace(/^\s+GITHUB_TOKEN: .+\n?/m, "");

  for (const [provider, defaultSecret] of Object.entries(DEFAULT_LLM_SECRET_NAMES)) {
    const configuredSecret = config.llmSecretNames[provider] ?? defaultSecret;
    rendered = rendered.replace(
      new RegExp(`^(\\s+)${defaultSecret}: \\$\\{\\{ secrets\\.[A-Z0-9_]+ \\}\\}$`, "m"),
      `$1${defaultSecret}: ${workflowSecretExpression(configuredSecret)}`
    );
  }

  return rendered;
}

function shouldCopySurface(entryName: string, enabledSurfaces: string[]): boolean {
  if (!entryName.startsWith("forgejo-intelligent-")) return true;
  return enabledSurfaces.includes(entryName.replace("forgejo-intelligent-", ""));
}

function installIntelligenceTree(
  planner: FilePlanner,
  sourceRoot: string,
  targetRoot: string,
  config: InstallerConfig
): void {
  planner.ensureDir(targetRoot, ".forgejo-intelligence");

  if (isSamePath(sourceRoot, targetRoot) || !existsSync(sourceRoot)) {
    return;
  }

  for (const entry of readdirSync(sourceRoot, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    if (!shouldCopySurface(entry.name, config.enabledSurfaces)) {
      planner.operations.push(`  - .forgejo-intelligence/${entry.name} disabled by surface selection`);
      console.log(`  - .forgejo-intelligence/${entry.name} disabled by surface selection`);
      continue;
    }

    planner.copyPath(
      resolve(sourceRoot, entry.name),
      resolve(targetRoot, entry.name),
      `.forgejo-intelligence/${entry.name}`
    );
  }
}

function installManagedFiles(
  planner: FilePlanner,
  root: string,
  bootstrap: string,
  config: InstallerConfig
): void {
  const targetRoot = resolve(root, ".forgejo-intelligence");
  const sourceRoot = resolve(bootstrap, "..");

  console.log("Runtime tree:");
  installIntelligenceTree(planner, sourceRoot, targetRoot, config);

  console.log("\nState and configuration:");
  planner.ensureDir(resolve(targetRoot, "state"), ".forgejo-intelligence/state");
  planner.ensureDir(resolve(targetRoot, "state", "issues"), ".forgejo-intelligence/state/issues");
  planner.ensureDir(resolve(targetRoot, "state", "pull-requests"), ".forgejo-intelligence/state/pull-requests");
  planner.ensureDir(resolve(targetRoot, "state", "sessions"), ".forgejo-intelligence/state/sessions");
  planner.ensureDir(resolve(targetRoot, "config"), ".forgejo-intelligence/config");
  planner.writeFile(
    resolve(targetRoot, "config", "install.json"),
    JSON.stringify(config, null, 2) + "\n",
    ".forgejo-intelligence/config/install.json"
  );

  console.log("\nWorkflows:");
  const workflowTemplatePath = resolve(bootstrap, "forgejo-intelligence-WORKFLOW-AGENT.yml");
  const workflowTargetPath = resolve(root, ".forgejo", "workflows", "forgejo-intelligence-WORKFLOW-AGENT.yml");
  planner.ensureDir(resolve(root, ".forgejo", "workflows"), ".forgejo/workflows");
  planner.writeFile(
    workflowTargetPath,
    renderWorkflowTemplate(readFileSync(workflowTemplatePath, "utf-8"), config),
    ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml"
  );

  console.log("\nIssue templates:");
  const templateDir = resolveInsideRepo(root, config.issueTemplatePath);
  planner.ensureDir(templateDir, config.issueTemplatePath);
  planner.copyPath(
    resolve(bootstrap, "forgejo-intelligence-TEMPLATE-HATCH.md"),
    resolve(templateDir, "hatch.md"),
    `${normalizeRepoPath(config.issueTemplatePath)}/hatch.md`
  );

  console.log("\nAgent identity:");
  planner.copyPath(
    resolve(bootstrap, "forgejo-intelligence-AGENTS.md"),
    resolve(targetRoot, "AGENTS.md"),
    ".forgejo-intelligence/AGENTS.md"
  );

  console.log("\nGit attributes:");
  planner.appendLine(resolve(root, ".gitattributes"), "memory.log merge=union", ".gitattributes");
}

function extensionOf(path: string): string {
  const basename = path.split(/[\\/]/).pop() ?? "";
  const dot = basename.lastIndexOf(".");
  return dot === -1 ? "" : basename.slice(dot);
}

function isProbablyText(path: string): boolean {
  return TEXT_EXTENSIONS.has(extensionOf(path));
}

function replaceLegacyNames(content: string): string {
  return content
    .split(LEGACY_INTELLIGENCE_DIR).join(".forgejo-intelligence")
    .split(LEGACY_INTELLIGENCE_PREFIX).join("forgejo-intelligence")
    .split(LEGACY_INTELLIGENT_PREFIX).join("forgejo-intelligent")
    .split(LEGACY_AI_PREFIX).join("forgejo-ai");
}

function rewriteLegacyContent(planner: FilePlanner, root: string): void {
  if (!existsSync(root)) return;

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = resolve(root, entry.name);
    if (entry.isDirectory()) {
      rewriteLegacyContent(planner, path);
      continue;
    }

    if (!entry.isFile() || !isProbablyText(path)) continue;
    const currentContent = readFileSync(path, "utf-8");
    const nextContent = replaceLegacyNames(currentContent);
    if (nextContent !== currentContent) {
      planner.writeFile(path, nextContent, relativeTo(planner.root, path));
    }
  }
}

function renameLegacyPaths(planner: FilePlanner, root: string): void {
  if (!existsSync(root)) return;

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = resolve(root, entry.name);
    if (entry.isDirectory()) {
      renameLegacyPaths(planner, path);
    }

    const nextName = replaceLegacyNames(entry.name);
    if (nextName !== entry.name) {
      planner.movePath(path, resolve(dirname(path), nextName), `${relativeTo(planner.root, path)} -> ${nextName}`);
    }
  }
}

function archiveLegacyRoot(planner: FilePlanner, root: string): void {
  const legacyRoot = resolve(root, LEGACY_INTELLIGENCE_DIR);
  if (!existsSync(legacyRoot)) return;

  planner.movePath(
    legacyRoot,
    resolve(root, LEGACY_ARCHIVE_DIR),
    `${LEGACY_INTELLIGENCE_DIR} -> ${LEGACY_ARCHIVE_DIR}`
  );
}

function migrateLegacyInstall(
  planner: FilePlanner,
  root: string
): void {
  const legacyRoot = resolve(root, LEGACY_INTELLIGENCE_DIR);
  const targetRoot = resolve(root, ".forgejo-intelligence");

  if (!existsSync(legacyRoot)) {
    console.log("  - no legacy intelligence directory found");
    return;
  }

  if (!existsSync(targetRoot)) {
    planner.movePath(legacyRoot, targetRoot, `${LEGACY_INTELLIGENCE_DIR} -> .forgejo-intelligence`);
    renameLegacyPaths(planner, targetRoot);
    rewriteLegacyContent(planner, targetRoot);
  } else {
    const portablePaths: Array<[string, string]> = [
      [".pi", ".pi"],
      ["state", "state"],
      ["AGENTS.md", "AGENTS.md"],
      [`${LEGACY_INTELLIGENCE_PREFIX}-ENABLED.md`, "forgejo-intelligence-ENABLED.md"],
    ];

    for (const [legacyPath, targetPath] of portablePaths) {
      planner.movePath(
        resolve(legacyRoot, legacyPath),
        resolve(targetRoot, targetPath),
        `${LEGACY_INTELLIGENCE_DIR}/${legacyPath} -> .forgejo-intelligence/${targetPath}`
      );
    }
    archiveLegacyRoot(planner, root);
  }
}

export async function installForgejoIntelligence(options: InstallOptions = {}): Promise<InstallResult> {
  const root = resolve(options.repoRoot ?? repoRoot);
  const bootstrap = resolve(options.bootstrapDir ?? bootstrapDir);
  const defaultConfig = buildConfig(options.config);
  const shouldPrompt = options.interactive ?? (Boolean(process.stdin.isTTY) && !process.env.CI);
  const config = shouldPrompt ? await promptForConfig(defaultConfig) : defaultConfig;
  const planner = new FilePlanner(root, Boolean(options.dryRun), Boolean(options.force));

  console.log(`${options.dryRun ? "Dry run: planning" : "Installing"} Forgejo Intelligence...\n`);

  if (options.migrate) {
    console.log("Migration:");
    migrateLegacyInstall(planner, root);
    console.log("");
  }

  installManagedFiles(planner, root, bootstrap, config);

  console.log(`\n${options.dryRun ? "Dry run complete." : "Forgejo Intelligence install complete."}`);
  console.log("Next steps:");
  console.log("  1. Add the configured LLM provider secret(s) in Forgejo repository Actions secrets");
  console.log("  2. Run: cd .forgejo-intelligence && bun install");
  console.log("  3. Commit and push the changes");
  console.log("  4. Open an issue to start chatting with the agent\n");

  return { config, operations: planner.operations };
}

function usage(): string {
  return `Usage: bun .forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts [options]

Options:
  --yes                         Use defaults without interactive prompts
  --dry-run                     Print planned file operations without writing
  --force                       Replace managed files that already exist
  --migrate                     Move a legacy dot-git-hosting install first
  --instance-url URL            Forgejo instance URL
  --api-token-strategy VALUE    actions, secret:SECRET_NAME, or SECRET_NAME
  --llm-secret provider=SECRET  LLM secret mapping; repeat or comma-separate
  --surfaces LIST               Enabled surfaces, comma-separated, or all
  --runner-label LABEL          Forgejo Actions runner label, default docker
  --issue-template-path PATH    Template directory, default .forgejo/ISSUE_TEMPLATE
  --help                        Show this help
`;
}

function parseCliArgs(args: string[]): CliOptions {
  const options: CliOptions = { config: {} };
  const llmSecretInputs: string[] = [];
  let explicitYes = false;
  const valueAfterEquals = (arg: string) => arg.slice(arg.indexOf("=") + 1);

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    const nextValue = () => {
      const value = args[++index];
      if (!value) throw new Error(`Missing value for ${arg}`);
      return value;
    };

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--yes" || arg === "-y" || arg === "--non-interactive") {
      explicitYes = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--force" || arg === "--overwrite") {
      options.force = true;
    } else if (arg === "--migrate") {
      options.migrate = true;
    } else if (arg === "--instance-url") {
      options.config!.forgejoInstanceUrl = nextValue();
    } else if (arg.startsWith("--instance-url=")) {
      options.config!.forgejoInstanceUrl = valueAfterEquals(arg);
    } else if (arg === "--api-token-strategy") {
      options.config!.apiTokenStrategy = parseApiTokenStrategy(nextValue());
    } else if (arg.startsWith("--api-token-strategy=")) {
      options.config!.apiTokenStrategy = parseApiTokenStrategy(valueAfterEquals(arg));
    } else if (arg === "--llm-secret") {
      llmSecretInputs.push(nextValue());
    } else if (arg.startsWith("--llm-secret=")) {
      llmSecretInputs.push(valueAfterEquals(arg));
    } else if (arg === "--surfaces") {
      options.config!.enabledSurfaces = parseSurfaceList(nextValue());
    } else if (arg.startsWith("--surfaces=")) {
      options.config!.enabledSurfaces = parseSurfaceList(valueAfterEquals(arg));
    } else if (arg === "--runner-label") {
      options.config!.runnerLabel = nextValue();
    } else if (arg.startsWith("--runner-label=")) {
      options.config!.runnerLabel = valueAfterEquals(arg);
    } else if (arg === "--issue-template-path") {
      options.config!.issueTemplatePath = nextValue();
    } else if (arg.startsWith("--issue-template-path=")) {
      options.config!.issueTemplatePath = valueAfterEquals(arg);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (llmSecretInputs.length > 0) {
    options.config!.llmSecretNames = parseSecretMap(llmSecretInputs.join(","));
  }

  if (explicitYes) {
    options.interactive = false;
  }

  return options;
}

if (import.meta.main) {
  try {
    const options = parseCliArgs(Bun.argv.slice(2));
    if (options.help) {
      console.log(usage());
      process.exit(0);
    }

    await installForgejoIntelligence(options);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
