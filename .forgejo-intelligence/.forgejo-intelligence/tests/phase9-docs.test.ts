import { describe, expect, it } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { resolve } from "path";

const repoRoot = resolve(import.meta.dir, "..", "..");
const intelligenceRoot = resolve(repoRoot, ".forgejo-intelligence");

function read(path: string): string {
  return readFileSync(resolve(repoRoot, path), "utf-8");
}

function exists(path: string): boolean {
  return existsSync(resolve(repoRoot, path));
}

function collectMarkdown(relativeDir: string): string[] {
  const absoluteDir = resolve(repoRoot, relativeDir);
  const files: string[] = [];

  for (const entry of readdirSync(absoluteDir)) {
    const relativePath = `${relativeDir}/${entry}`;
    const absolutePath = resolve(repoRoot, relativePath);
    if (statSync(absolutePath).isDirectory()) {
      files.push(...collectMarkdown(relativePath));
    } else if (relativePath.endsWith(".md")) {
      files.push(relativePath);
    }
  }

  return files;
}

const requiredDocs = [
  "README.md",
  "WHAT.md",
  ".ASPIRATION.md",
  ".forgejo-intelligence/AGENTS.md",
  ".forgejo-intelligence/README.md",
  ".forgejo-intelligence/.pi/APPEND_SYSTEM.md",
  ".forgejo-intelligence/.pi/README.md",
  ".forgejo-intelligence/forgejo-intelligence-QUICKSTART.md",
  ".forgejo-intelligence/help/README.md",
  ".forgejo-intelligence/help/install.md",
  ".forgejo-intelligence/help/configure.md",
  ".forgejo-intelligence/help/action-management.md",
  ".forgejo-intelligence/help/issues-management.md",
  ".forgejo-intelligence/help/security.md",
  ".forgejo-intelligence/help/migration.md",
  ".forgejo-intelligence/help/local-development.md",
  ".forgejo-intelligence/help/surfaces.md",
  ".forgejo-intelligence/help/unsupported-github-surfaces.md",
  ".forgejo-intelligence/install/README.md",
  ".forgejo-intelligence/lifecycle/README.md",
  ".forgejo-intelligence/platform/README.md",
  "CONVERSION/reports/phase9-status-report.md",
];

const runtimeDocs = [
  "README.md",
  "WHAT.md",
  ".ASPIRATION.md",
  ".forgejo-intelligence/AGENTS.md",
  ".forgejo-intelligence/README.md",
  ".forgejo-intelligence/.pi/APPEND_SYSTEM.md",
  ".forgejo-intelligence/.pi/README.md",
  ".forgejo-intelligence/forgejo-intelligence-QUICKSTART.md",
  ".forgejo-intelligence/help/README.md",
  ".forgejo-intelligence/help/install.md",
  ".forgejo-intelligence/help/configure.md",
  ".forgejo-intelligence/help/action-management.md",
  ".forgejo-intelligence/help/issues-management.md",
  ".forgejo-intelligence/help/security.md",
  ".forgejo-intelligence/help/local-development.md",
  ".forgejo-intelligence/help/surfaces.md",
  ".forgejo-intelligence/install/README.md",
  ".forgejo-intelligence/lifecycle/README.md",
  ".forgejo-intelligence/platform/README.md",
  ".forgejo-intelligence/forgejo-intelligent-issue/HELP.md",
  ".forgejo-intelligence/forgejo-intelligent-issue/HELP-v2.md",
  ".forgejo-intelligence/forgejo-intelligent-pull-request/HELP.md",
  ".forgejo-intelligence/forgejo-intelligent-fork/HELP.md",
];

describe("Phase 9 documentation cutover", () => {
  it("provides the required Forgejo-native user and operator docs", () => {
    for (const doc of requiredDocs) {
      expect(exists(doc), `Missing ${doc}`).toBe(true);
    }
  });

  it("documents installation from Forgejo paths alone", () => {
    const docs = [
      read("README.md"),
      read(".forgejo-intelligence/forgejo-intelligence-QUICKSTART.md"),
      read(".forgejo-intelligence/help/install.md"),
    ].join("\n");

    for (const needle of [
      ".forgejo-intelligence/install/forgejo-intelligence-INSTALLER.ts --yes",
      ".forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml",
      ".forgejo/ISSUE_TEMPLATE/hatch.md",
      ".forgejo-intelligence/config/install.json",
      "FORGEJO_TOKEN",
      "ANTHROPIC_API_KEY",
      ".gitea/ISSUE_TEMPLATE",
    ]) {
      expect(docs).toContain(needle);
    }

    const agentInstructions = read(".forgejo-intelligence/AGENTS.md");
    expect(agentInstructions).toContain("Downloading Forgejo Issue Attachments");
    expect(agentInstructions).toContain("FORGEJO_TOKEN");
    expect(agentInstructions).toContain("FORGEJO_API_URL");
  });

  it("documents migration, unsupported surfaces, security, and local Forgejo development", () => {
    const migration = read(".forgejo-intelligence/help/migration.md");
    const unsupported = read(".forgejo-intelligence/help/unsupported-github-surfaces.md");
    const security = read(".forgejo-intelligence/help/security.md");
    const local = read(".forgejo-intelligence/help/local-development.md");

    expect(migration).toContain("--migrate");
    expect(migration).toContain("legacy-source-intelligence");
    expect(migration).toContain("test ! -e .github-intelligence");
    expect(unsupported).toContain("Codespaces");
    expect(unsupported).toContain("Sponsors");
    expect(unsupported).toContain("Discussions");
    expect(security).toContain("Who Can Trigger The Agent");
    expect(security).toContain("Fork Pull Requests");
    expect(security).toContain("Secrets");
    expect(local).toContain("FORGEJO_SMOKE_RUN=1");
    expect(local).toContain("bun run smoke:local-forgejo");
  });

  it("lets maintainers infer enabled modules by listing .forgejo-intelligence", () => {
    const docs = [
      read("README.md"),
      read(".forgejo-intelligence/README.md"),
      read(".forgejo-intelligence/help/surfaces.md"),
    ].join("\n");

    expect(docs).toContain("find .forgejo-intelligence -maxdepth 1 -type d -name 'forgejo-intelligent-*'");

    const activeSurfaceFolders = readdirSync(intelligenceRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.startsWith("forgejo-intelligent-"))
      .map((entry) => entry.name)
      .sort();

    for (const folder of activeSurfaceFolders) {
      expect(docs).toContain(folder);
    }
  });

  it("keeps active runtime docs from describing GitHub as infrastructure", () => {
    const forbidden = [
      ".github/workflows",
      "GITHUB_TOKEN",
      "github-actions[bot]",
      "api.github.com",
      "raw.githubusercontent.com",
      "gh issue",
      "gh pr",
      "GitHub Actions outage",
    ];

    for (const doc of runtimeDocs) {
      const content = read(doc);
      for (const needle of forbidden) {
        expect(content.includes(needle), `${doc} contains ${needle}`).toBe(false);
      }
    }
  });

  it("keeps the help index linked to every Phase 9 help page", () => {
    const helpIndex = read(".forgejo-intelligence/help/README.md");
    const helpDocs = collectMarkdown(".forgejo-intelligence/help")
      .filter((path) => path !== ".forgejo-intelligence/help/README.md")
      .map((path) => path.replace(".forgejo-intelligence/help/", ""))
      .sort();

    for (const doc of helpDocs) {
      expect(helpIndex).toContain(`](${doc})`);
    }
  });
});
