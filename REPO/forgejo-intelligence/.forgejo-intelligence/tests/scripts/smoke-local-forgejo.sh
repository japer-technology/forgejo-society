#!/usr/bin/env bash
set -euo pipefail

if [[ "${FORGEJO_SMOKE_RUN:-}" != "1" ]]; then
  echo "Skipping local Forgejo smoke test. Set FORGEJO_SMOKE_RUN=1 to run it against a disposable test repository."
  exit 0
fi

for tool in curl git jq; do
  if ! command -v "${tool}" >/dev/null 2>&1; then
    echo "Required tool is missing: ${tool}" >&2
    exit 1
  fi
done

required_env=(
  FORGEJO_SMOKE_URL
  FORGEJO_SMOKE_TOKEN
  FORGEJO_SMOKE_OWNER
  FORGEJO_SMOKE_REPO
)

for name in "${required_env[@]}"; do
  if [[ -z "${!name:-}" ]]; then
    echo "Missing ${name}; refusing to run smoke test." >&2
    exit 1
  fi
done

forgejo_url="${FORGEJO_SMOKE_URL%/}"
api_url="${FORGEJO_SMOKE_API_URL:-${forgejo_url}/api/v1}"
owner="${FORGEJO_SMOKE_OWNER}"
repo="${FORGEJO_SMOKE_REPO}"
token="${FORGEJO_SMOKE_TOKEN}"
run_id="$(date -u '+%Y%m%d%H%M%S')"

api() {
  local method="$1"
  local path="$2"
  local data="${3:-}"

  if [[ -n "${data}" ]]; then
    curl -fsS \
      -X "${method}" \
      -H "Authorization: token ${token}" \
      -H "Accept: application/json" \
      -H "Content-Type: application/json" \
      --data "${data}" \
      "${api_url}${path}"
  else
    curl -fsS \
      -X "${method}" \
      -H "Authorization: token ${token}" \
      -H "Accept: application/json" \
      "${api_url}${path}"
  fi
}

repo_json="$(api GET "/repos/${owner}/${repo}")"
default_branch="$(jq -r '.default_branch // "main"' <<<"${repo_json}")"

echo "Creating smoke issue..."
issue_json="$(
  api POST "/repos/${owner}/${repo}/issues" "$(
    jq -n \
      --arg title "Forgejo Intelligence smoke ${run_id}" \
      --arg body "Phase 8 smoke issue from the local Forgejo harness." \
      '{title: $title, body: $body}'
  )"
)"
issue_number="$(jq -r '.number' <<<"${issue_json}")"

echo "Commenting on smoke issue #${issue_number}..."
api POST "/repos/${owner}/${repo}/issues/${issue_number}/comments" "$(
  jq -n --arg body "Phase 8 smoke follow-up comment." '{body: $body}'
)" >/dev/null

tmpdir="$(mktemp -d)"
cleanup() {
  rm -rf "${tmpdir}"
}
trap cleanup EXIT

remote="${FORGEJO_SMOKE_GIT_REMOTE:-${forgejo_url}/${owner}/${repo}.git}"
if [[ -z "${FORGEJO_SMOKE_GIT_REMOTE:-}" && "${remote}" == https://* ]]; then
  git_user="${FORGEJO_SMOKE_GIT_USERNAME:-oauth2}"
  remote="https://${git_user}:${token}@${remote#https://}"
fi

echo "Cloning disposable test repository..."
git clone --depth 1 --branch "${default_branch}" "${remote}" "${tmpdir}/repo" >/dev/null 2>&1
cd "${tmpdir}/repo"
git config user.name "forgejo-intelligence-smoke"
git config user.email "forgejo-intelligence-smoke@users.noreply.forgejo"

branch="forgejo-intelligence-smoke-${run_id}"
git checkout -b "${branch}" >/dev/null 2>&1
mkdir -p .forgejo-intelligence-smoke
printf 'Phase 8 smoke run %s\n' "${run_id}" > ".forgejo-intelligence-smoke/${run_id}.txt"
git add ".forgejo-intelligence-smoke/${run_id}.txt"
git commit -m "forgejo-intelligence: smoke ${run_id}" >/dev/null

echo "Pushing smoke commit..."
git push "${remote}" "HEAD:${branch}" >/dev/null

echo "Opening smoke pull request..."
pr_json="$(
  api POST "/repos/${owner}/${repo}/pulls" "$(
    jq -n \
      --arg base "${default_branch}" \
      --arg head "${branch}" \
      --arg title "Forgejo Intelligence smoke PR ${run_id}" \
      --arg body "Phase 8 smoke pull request." \
      '{base: $base, head: $head, title: $title, body: $body}'
  )"
)"
pr_number="$(jq -r '.number' <<<"${pr_json}")"

tag="forgejo-intelligence-smoke-${run_id}"
git tag -a "${tag}" -m "Forgejo Intelligence smoke ${run_id}"
git push "${remote}" "${tag}" >/dev/null

echo "Publishing smoke release..."
release_json="$(
  api POST "/repos/${owner}/${repo}/releases" "$(
    jq -n \
      --arg tag_name "${tag}" \
      --arg target_commitish "${branch}" \
      --arg name "Forgejo Intelligence smoke ${run_id}" \
      --arg body "Phase 8 smoke release." \
      '{tag_name: $tag_name, target_commitish: $target_commitish, name: $name, body: $body, draft: false, prerelease: true}'
  )"
)"

cat <<EOF
Local Forgejo smoke completed.
- issue: #${issue_number}
- pull request: #${pr_number}
- release: $(jq -r '.tag_name // .name' <<<"${release_json}")
- branch: ${branch}
- workflow_dispatch: covered by the Forgejo CI workflow manual trigger
EOF
