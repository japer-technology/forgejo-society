import { describe, expect, it } from "bun:test";
import { ForgejoApiClient, readForgejoApiConfig } from "../platform/forgejo-api";
import { ForgejoConfigError } from "../platform/errors";
import type { ForgejoApiError } from "../platform/errors";

type MockResponse = {
  status?: number;
  statusText?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

function response(spec: MockResponse): Response {
  const status = spec.status ?? 200;
  const body = spec.body === undefined ? undefined : JSON.stringify(spec.body);
  return new Response(body, {
    status,
    statusText: spec.statusText,
    headers: {
      "content-type": "application/json",
      ...(spec.headers ?? {}),
    },
  });
}

function makeClient(responses: MockResponse[]) {
  const calls: { url: string; init: RequestInit }[] = [];
  const queue = [...responses];
  const fetchImpl = async (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
    calls.push({ url: String(url), init: init ?? {} });
    const next = queue.shift();
    if (!next) throw new Error(`Unexpected request to ${url}`);
    return response(next);
  };

  return {
    api: new ForgejoApiClient({
      apiUrl: "https://forgejo.example/api/v1",
      token: "test-token",
      fetchImpl,
      defaultLimit: 2,
    }),
    calls,
  };
}

function requestBody(call: { init: RequestInit }) {
  return JSON.parse(String(call.init.body ?? "{}"));
}

describe("Forgejo API configuration", () => {
  it("derives FORGEJO_API_URL from FORGEJO_SERVER_URL", () => {
    const config = readForgejoApiConfig({
      FORGEJO_SERVER_URL: "https://forgejo.example/",
      FORGEJO_TOKEN: "secret",
    });

    expect(config.apiUrl).toBe("https://forgejo.example/api/v1");
    expect(config.token).toBe("secret");
  });

  it("supports FORGEJO_INSTANCE_URL for local testing", () => {
    const config = readForgejoApiConfig({
      FORGEJO_INSTANCE_URL: "http://localhost:3000",
      FORGEJO_TOKEN: "secret",
    });

    expect(config.apiUrl).toBe("http://localhost:3000/api/v1");
  });

  it("fails clearly when the token is missing", () => {
    expect(() => readForgejoApiConfig({ FORGEJO_API_URL: "https://forgejo.example/api/v1" })).toThrow(
      ForgejoConfigError
    );
  });
});

describe("Forgejo API requests", () => {
  it("uses Forgejo token authentication headers", async () => {
    const { api, calls } = makeClient([{ body: { login: "octo" } }]);

    await api.getCurrentUser();

    const headers = calls[0].init.headers as Headers;
    expect(headers.get("Authorization")).toBe("token test-token");
    expect(headers.get("Accept")).toBe("application/json");
  });

  it("paginates list endpoints with page and limit", async () => {
    const { api, calls } = makeClient([
      {
        body: [{ filename: "a.ts" }, { filename: "b.ts" }],
        headers: { "x-total-count": "3" },
      },
      {
        body: [{ filename: "c.ts" }],
        headers: { "x-total-count": "3" },
      },
    ]);

    const files = await api.listPullRequestFiles("acme", "repo", 7);

    expect(files.map((file) => file.filename)).toEqual(["a.ts", "b.ts", "c.ts"]);
    expect(calls[0].url).toContain("/repos/acme/repo/pulls/7/files?page=1&limit=2");
    expect(calls[1].url).toContain("/repos/acme/repo/pulls/7/files?page=2&limit=2");
  });

  it("throws structured errors for 401, 403, and 404 responses", async () => {
    for (const status of [401, 403, 404]) {
      const { api } = makeClient([
        {
          status,
          statusText: "Nope",
          body: { message: `status-${status}` },
        },
      ]);

      await expect(api.getRepository("acme", "repo")).rejects.toMatchObject({
        name: "ForgejoApiError",
        status,
        responseBody: { message: `status-${status}` },
      } satisfies Partial<ForgejoApiError>);
    }
  });
});

describe("Forgejo write operations", () => {
  it("creates issue comments and edits issues", async () => {
    const { api, calls } = makeClient([
      { status: 201, body: { id: 1, body: "hello" } },
      { body: { number: 12, title: "Edited" } },
    ]);

    await api.createIssueComment("acme", "repo", 12, "hello");
    await api.editIssue("acme", "repo", 12, { title: "Edited", state: "closed" });

    expect(calls[0].init.method).toBe("POST");
    expect(calls[0].url).toContain("/repos/acme/repo/issues/12/comments");
    expect(requestBody(calls[0])).toEqual({ body: "hello" });
    expect(calls[1].init.method).toBe("PATCH");
    expect(requestBody(calls[1])).toEqual({ title: "Edited", state: "closed" });
  });

  it("adds and removes issue reactions using Forgejo reaction content", async () => {
    const { api, calls } = makeClient([
      { status: 201, body: { content: "eyes" } },
      { body: undefined },
    ]);

    await api.addIssueReaction("acme", "repo", 12, "eyes");
    await api.deleteIssueReaction("acme", "repo", 12, "eyes");

    expect(calls[0].init.method).toBe("POST");
    expect(requestBody(calls[0])).toEqual({ content: "eyes" });
    expect(calls[1].init.method).toBe("DELETE");
    expect(requestBody(calls[1])).toEqual({ content: "eyes" });
  });

  it("creates pull requests and releases", async () => {
    const { api, calls } = makeClient([
      { status: 201, body: { number: 4, title: "PR" } },
      { status: 201, body: { id: 5, tag_name: "v1.0.0" } },
    ]);

    await api.createPullRequest("acme", "repo", { base: "main", head: "feature", title: "PR" });
    await api.createRelease("acme", "repo", { tag_name: "v1.0.0", name: "One" });

    expect(calls[0].url).toContain("/repos/acme/repo/pulls");
    expect(requestBody(calls[0])).toEqual({ base: "main", head: "feature", title: "PR" });
    expect(calls[1].url).toContain("/repos/acme/repo/releases");
    expect(requestBody(calls[1])).toEqual({ tag_name: "v1.0.0", name: "One" });
  });

  it("upserts labels by listing existing labels first", async () => {
    const create = makeClient([
      { body: [], headers: { "x-total-count": "0" } },
      { status: 201, body: { id: 9, name: "triage", color: "00aabb" } },
    ]);

    await create.api.upsertLabel("acme", "repo", { name: "triage", color: "00aabb" });
    expect(create.calls[1].init.method).toBe("POST");

    const update = makeClient([
      { body: [{ id: 9, name: "triage", color: "cccccc" }], headers: { "x-total-count": "1" } },
      { body: { id: 9, name: "triage", color: "00aabb" } },
    ]);

    await update.api.upsertLabel("acme", "repo", { name: "triage", color: "00aabb" });
    expect(update.calls[1].init.method).toBe("PATCH");
    expect(update.calls[1].url).toContain("/repos/acme/repo/labels/9");
  });

  it("lists milestones and updates wiki pages", async () => {
    const { api, calls } = makeClient([
      { body: [{ id: 1, title: "v1" }], headers: { "x-total-count": "1" } },
      { body: { title: "Home", content_base64: "aGVsbG8=" } },
      { body: { title: "Home", content_base64: "bmV3" } },
    ]);

    await api.listMilestones("acme", "repo");
    await api.getWikiPage("acme", "repo", "Home");
    await api.updateWikiPage("acme", "repo", "Home", {
      content: "new",
      message: "Update Home",
      title: "Home",
    });

    expect(calls[0].url).toContain("/repos/acme/repo/milestones?page=1&limit=2");
    expect(calls[1].url).toContain("/repos/acme/repo/wiki/page/Home");
    expect(calls[2].init.method).toBe("PATCH");
    expect(requestBody(calls[2])).toEqual({
      content_base64: "bmV3",
      message: "Update Home",
      title: "Home",
    });
  });
});
