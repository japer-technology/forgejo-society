import { describe, expect, it } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { resolve } from "path";
import { installForgejoIntelligence } from "../install/forgejo-intelligence-INSTALLER";

const fixedInstallTime = "2026-05-01T00:00:00.000Z";

function read(path: string): string {
  return readFileSync(path, "utf-8");
}

function makeTempLayout() {
  const tempRoot = mkdtempSync(resolve(tmpdir(), "forgejo-intelligence-phase7-"));
  const repoRoot = resolve(tempRoot, "repo");
  const sourceRoot = resolve(tempRoot, "source", ".forgejo-intelligence");
  const bootstrapDir = resolve(sourceRoot, "install");

  mkdirSync(repoRoot, { recursive: true });
  mkdirSync(bootstrapDir, { recursive: true });
  mkdirSync(resolve(sourceRoot, "forgejo-intelligent-issue"), { recursive: true });
  mkdirSync(resolve(sourceRoot, "forgejo-intelligent-pull-request"), { recursive: true });

  writeFileSync(
    resolve(bootstrapDir, "forgejo-intelligence-WORKFLOW-AGENT.yml"),
    [
      "name: forgejo-intelligence-WORKFLOW-AGENT",
      "env:",
      "  FORGEJO_INTELLIGENCE_FORK_PR_POLICY: skip",
      "jobs:",
      "  run-agent:",
      "    runs-on: docker",
      "    env:",
      "      FORGEJO_TOKEN: ${{ forgejo.token }}",
      "    steps:",
      "      - name: Run",
      "        env:",
      "          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}",
      "          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}",
      "        run: bun .forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts",
      "",
    ].join("\n")
  );
  writeFileSync(resolve(bootstrapDir, "forgejo-intelligence-TEMPLATE-HATCH.md"), "# Hatch\n");
  writeFileSync(resolve(bootstrapDir, "forgejo-intelligence-AGENTS.md"), "# Agent\n");
  writeFileSync(resolve(sourceRoot, "forgejo-intelligent-issue", "README.md"), "# Issue\n");
  writeFileSync(resolve(sourceRoot, "forgejo-intelligent-pull-request", "README.md"), "# Pull Request\n");

  return { tempRoot, repoRoot, sourceRoot, bootstrapDir };
}

describe("Phase 7 installer distribution", () => {
  it("renders a Forgejo install with selected surfaces, custom runner, token, secrets, and issue template path", async () => {
    const { repoRoot, bootstrapDir } = makeTempLayout();

    await installForgejoIntelligence({
      repoRoot,
      bootstrapDir,
      interactive: false,
      config: {
        forgejoInstanceUrl: "https://forgejo.example.test",
        apiTokenStrategy: { kind: "secret", secretName: "FORGEJO_PAT" },
        llmSecretNames: { openai: "OPENAI_FORGEJO_KEY" },
        enabledSurfaces: ["issue"],
        runnerLabel: "docker,gpu",
        issueTemplatePath: ".gitea/ISSUE_TEMPLATE",
        installedAt: fixedInstallTime,
      },
    });

    const workflow = read(resolve(repoRoot, ".forgejo", "workflows", "forgejo-intelligence-WORKFLOW-AGENT.yml"));
    const config = JSON.parse(read(resolve(repoRoot, ".forgejo-intelligence", "config", "install.json")));

    expect(workflow).toContain("runs-on: [\"docker\", \"gpu\"]");
    expect(workflow).toContain("FORGEJO_TOKEN: ${{ secrets.FORGEJO_PAT }}");
    expect(workflow).toContain("OPENAI_API_KEY: ${{ secrets.OPENAI_FORGEJO_KEY }}");
    expect(workflow).toContain("FORGEJO_INTELLIGENCE_INSTANCE_URL: https://forgejo.example.test");
    expect(workflow).toContain("FORGEJO_INTELLIGENCE_ENABLED_SURFACES: issue");
    expect(workflow).toContain(".forgejo-intelligence/lifecycle/forgejo-intelligence-ORCHESTRATOR.ts");
    expect(workflow).not.toContain(".github-intelligence");

    expect(existsSync(resolve(repoRoot, ".forgejo-intelligence", "forgejo-intelligent-issue"))).toBe(true);
    expect(existsSync(resolve(repoRoot, ".forgejo-intelligence", "forgejo-intelligent-pull-request"))).toBe(false);
    expect(existsSync(resolve(repoRoot, ".gitea", "ISSUE_TEMPLATE", "hatch.md"))).toBe(true);
    expect(config.apiTokenStrategy).toEqual({ kind: "secret", secretName: "FORGEJO_PAT" });
    expect(config.enabledSurfaces).toEqual(["issue"]);
  });

  it("is idempotent and does not overwrite existing user files without force", async () => {
    const { repoRoot, bootstrapDir } = makeTempLayout();
    const options = {
      repoRoot,
      bootstrapDir,
      interactive: false,
      config: {
        installedAt: fixedInstallTime,
      },
    };

    await installForgejoIntelligence(options);
    const workflowPath = resolve(repoRoot, ".forgejo", "workflows", "forgejo-intelligence-WORKFLOW-AGENT.yml");
    const firstWorkflow = read(workflowPath);

    await installForgejoIntelligence(options);
    expect(read(workflowPath)).toBe(firstWorkflow);

    writeFileSync(workflowPath, "user-managed workflow\n");
    await installForgejoIntelligence(options);
    expect(read(workflowPath)).toBe("user-managed workflow\n");

    await installForgejoIntelligence({ ...options, force: true });
    expect(read(workflowPath)).toBe(firstWorkflow);
  });

  it("prints dry-run operations without writing files", async () => {
    const { repoRoot, bootstrapDir } = makeTempLayout();

    const result = await installForgejoIntelligence({
      repoRoot,
      bootstrapDir,
      dryRun: true,
      interactive: false,
      config: { installedAt: fixedInstallTime },
    });

    expect(result.operations.join("\n")).toContain("would install .forgejo-intelligence/install");
    expect(result.operations.join("\n")).toContain("would write .forgejo/workflows/forgejo-intelligence-WORKFLOW-AGENT.yml");
    expect(existsSync(resolve(repoRoot, ".forgejo-intelligence"))).toBe(false);
    expect(existsSync(resolve(repoRoot, ".forgejo"))).toBe(false);
  });

  it("moves a legacy dot-git-hosting install into Forgejo paths in migration mode", async () => {
    const { repoRoot, bootstrapDir } = makeTempLayout();
    const legacyRoot = resolve(repoRoot, ".github-intelligence");

    mkdirSync(resolve(legacyRoot, "state", "sessions"), { recursive: true });
    writeFileSync(resolve(legacyRoot, "state", "sessions", "legacy.jsonl"), "{\"type\":\"session\"}\n");
    writeFileSync(resolve(legacyRoot, "AGENTS.md"), "github-intelligence agent\n");
    writeFileSync(resolve(legacyRoot, "github-intelligence-ENABLED.md"), "enabled\n");

    await installForgejoIntelligence({
      repoRoot,
      bootstrapDir,
      migrate: true,
      interactive: false,
      config: { installedAt: fixedInstallTime },
    });

    expect(existsSync(resolve(repoRoot, ".forgejo-intelligence", "state", "sessions", "legacy.jsonl"))).toBe(true);
    expect(read(resolve(repoRoot, ".forgejo-intelligence", "AGENTS.md"))).toContain("forgejo-intelligence agent");
    expect(existsSync(resolve(repoRoot, ".forgejo-intelligence", "forgejo-intelligence-ENABLED.md"))).toBe(true);
    expect(existsSync(resolve(repoRoot, ".github-intelligence"))).toBe(false);
  });
});
