export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ForgejoFetch = typeof fetch;

export interface ForgejoApiConfig {
  apiUrl: string;
  token: string;
  instanceUrl?: string;
  fetchImpl?: ForgejoFetch;
  defaultLimit?: number;
  userAgent?: string;
}

export interface ForgejoRequestOptions {
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface ForgejoPageInfo {
  page: number;
  limit: number;
  totalCount?: number;
  totalPages?: number;
  nextPage?: number;
}

export interface ForgejoResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  url: string;
  pageInfo?: ForgejoPageInfo;
}

export interface RepositoryRef {
  owner: string;
  repo: string;
}

export interface ForgejoUser {
  id?: number;
  login: string;
  full_name?: string;
  email?: string;
  html_url?: string;
  [key: string]: unknown;
}

export interface ForgejoRepository {
  id?: number;
  name: string;
  full_name: string;
  default_branch?: string;
  html_url?: string;
  owner?: ForgejoUser;
  permissions?: Record<string, boolean>;
  [key: string]: unknown;
}

export interface ForgejoActorPermission {
  permission: string;
  role_name?: string;
  user?: ForgejoUser;
}

export interface ForgejoIssue {
  id?: number;
  number?: number;
  title?: string;
  body?: string;
  state?: string;
  html_url?: string;
  [key: string]: unknown;
}

export interface ForgejoIssuePatch {
  title?: string;
  body?: string;
  state?: "open" | "closed" | string;
  ref?: string;
  assignee?: string;
  assignees?: string[];
  milestone?: number;
  due_date?: string;
  unset_due_date?: boolean;
  updated_at?: string;
}

export interface ForgejoIssueComment {
  id: number;
  body: string;
  html_url?: string;
  issue_url?: string;
  pull_request_url?: string;
  user?: ForgejoUser;
  [key: string]: unknown;
}

export type ForgejoReactionContent =
  | "+1"
  | "-1"
  | "laugh"
  | "hooray"
  | "confused"
  | "heart"
  | "rocket"
  | "eyes"
  | string;

export interface ForgejoReaction {
  content: ForgejoReactionContent;
  created_at?: string;
  user?: ForgejoUser;
  [key: string]: unknown;
}

export interface ForgejoPullRequestFile {
  filename: string;
  status?: string;
  additions?: number;
  deletions?: number;
  changes?: number;
  html_url?: string;
  raw_url?: string;
  previous_filename?: string;
  [key: string]: unknown;
}

export interface ForgejoCreatePullRequestPayload {
  base: string;
  head: string;
  title: string;
  body?: string;
  assignee?: string;
  assignees?: string[];
  labels?: number[];
  milestone?: number;
  due_date?: string;
}

export interface ForgejoPullRequest {
  id?: number;
  number?: number;
  title?: string;
  body?: string;
  state?: string;
  html_url?: string;
  [key: string]: unknown;
}

export interface ForgejoCreateReleasePayload {
  tag_name: string;
  target_commitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  hide_archive_links?: boolean;
}

export interface ForgejoRelease {
  id?: number;
  tag_name?: string;
  name?: string;
  body?: string;
  html_url?: string;
  draft?: boolean;
  prerelease?: boolean;
  [key: string]: unknown;
}

export interface ForgejoLabelPayload {
  name: string;
  color: string;
  description?: string;
  exclusive?: boolean;
  is_archived?: boolean;
}

export interface ForgejoLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
  exclusive?: boolean;
  is_archived?: boolean;
  [key: string]: unknown;
}

export interface ForgejoMilestone {
  id: number;
  title: string;
  description?: string;
  state?: string;
  open_issues?: number;
  closed_issues?: number;
  due_on?: string;
  [key: string]: unknown;
}

export interface ForgejoWikiPage {
  title: string;
  content_base64?: string;
  commit_count?: number;
  html_url?: string;
  [key: string]: unknown;
}

export interface ForgejoWikiPagePayload {
  title?: string;
  content: string;
  message?: string;
}

export interface ForgejoApi {
  request<T>(method: string, path: string, options?: ForgejoRequestOptions): Promise<T>;
  paginate<T>(path: string, query?: ForgejoRequestOptions["query"]): Promise<T[]>;
  getCurrentUser(): Promise<ForgejoUser>;
  getRepository(owner: string, repo: string): Promise<ForgejoRepository>;
  getActorPermission(owner: string, repo: string, actor: string): Promise<ForgejoActorPermission>;
  getIssue(owner: string, repo: string, index: number): Promise<ForgejoIssue>;
  createIssueComment(owner: string, repo: string, index: number, body: string): Promise<ForgejoIssueComment>;
  editIssue(owner: string, repo: string, index: number, patch: ForgejoIssuePatch): Promise<ForgejoIssue>;
  addIssueReaction(
    owner: string,
    repo: string,
    index: number,
    reaction: ForgejoReactionContent
  ): Promise<ForgejoReaction>;
  deleteIssueReaction(owner: string, repo: string, index: number, reaction: ForgejoReactionContent): Promise<void>;
  addIssueCommentReaction(
    owner: string,
    repo: string,
    commentId: number,
    reaction: ForgejoReactionContent
  ): Promise<ForgejoReaction>;
  deleteIssueCommentReaction(
    owner: string,
    repo: string,
    commentId: number,
    reaction: ForgejoReactionContent
  ): Promise<void>;
  listPullRequestFiles(owner: string, repo: string, index: number): Promise<ForgejoPullRequestFile[]>;
  createPullRequest(
    owner: string,
    repo: string,
    payload: ForgejoCreatePullRequestPayload
  ): Promise<ForgejoPullRequest>;
  createRelease(owner: string, repo: string, payload: ForgejoCreateReleasePayload): Promise<ForgejoRelease>;
  upsertLabel(owner: string, repo: string, payload: ForgejoLabelPayload): Promise<ForgejoLabel>;
  listMilestones(owner: string, repo: string): Promise<ForgejoMilestone[]>;
  getWikiPage(owner: string, repo: string, pageName: string): Promise<ForgejoWikiPage>;
  updateWikiPage(owner: string, repo: string, pageName: string, payload: ForgejoWikiPagePayload): Promise<ForgejoWikiPage>;
}

export function splitRepository(repository: string): RepositoryRef {
  const [owner, ...repoParts] = repository.split("/");
  const repo = repoParts.join("/");

  if (!owner || !repo) {
    throw new Error(`Expected repository in "owner/repo" format, got "${repository}"`);
  }

  return { owner, repo };
}
