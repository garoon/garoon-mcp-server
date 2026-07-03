---
name: smoke-test-mcp-tools
description: >-
  Smoke-test every Garoon MCP tool against a live Garoon environment by actually
  invoking it. For each tool the agent generates a sample-prompt-equivalent input,
  calls the `mcp__garoon__*` tool, and reports PASS / FAIL / BLOCKED. Use for
  requests such as "verify all tools work", "smoke test the MCP tools",
  "全ツールの動作確認", "スモークテスト".
---

# Garoon MCP tool smoke test

## Purpose

Verify that every tool of the Garoon MCP server under development executes without
error against a live Garoon environment. For each tool, the agent derives a
sample-prompt-equivalent input, actually invokes the corresponding `mcp__garoon__*`
tool, and judges the result. This is a live smoke test (real API calls), not a
static argument-validation check.

## Prerequisites

1. `.envrc` (gitignored) exports `GAROON_BASE_URL`, `GAROON_USERNAME`,
   `GAROON_PASSWORD`, and any optional variables (proxy, PFX, basic auth,
   `GAROON_PUBLIC_ONLY`). See CONTRIBUTING.md for the setup.
2. direnv has loaded those variables into the `claude` process environment
   (`direnv allow` was run and `claude` was started from the repository root).
3. `dist/` is up to date (`pnpm run build`).
4. The `garoon` server from `.mcp.json` is connected in Claude Code
   (`claude mcp list` shows `garoon` as `✔ Connected`).

Changing `.mcp.json`, env vars, or the build usually requires reconnecting
(restarting the Claude Code session). If no `mcp__garoon__*` tools are visible,
satisfy the prerequisites above and reconnect before retrying.

## Procedure

### Step 0: Readiness check

- Confirm `dist/` is current; run `pnpm run build` if unsure.
- Enumerate the available `mcp__garoon__*` tools. If none exist, return to the
  prerequisites.
- **Do not hardcode the tool list.** Target whatever `mcp__garoon__*` tools are
  enumerable at runtime, so newly added tools are covered without editing this skill.

### Sample-prompt generation

For each tool, derive one natural sample prompt from its `title` / `description` /
`inputSchema`, record it in the report, and call the tool with arguments that
satisfy that intent (e.g. `garoon-get-current-time` → "What is the current time in
Garoon?").

### Dependency-aware execution order

Some tools require IDs returned by other tools. Execute in the phases below, and
infer dependencies from each tool's input field names (e.g. if `organizationId`
is required, collect an organization ID first).

**Phase 1 (independent / ID collection)** — run tools that need no input, only
optional input, or just a search term, and collect IDs for later phases.

- `garoon-get-current-time`: no input; also use it as the basis for datetime ranges.
- `garoon-get-garoon-users`: omit `name` to fetch "me"; collect the current user ID.
- `garoon-get-organizations`: pass a common search term to `name`; collect an organization ID.
- `garoon-get-bulletin-categories`: collect a category ID.
- `garoon-get-facility-groups`: collect a facility group ID.
- `garoon-get-facilities`: pass a search term to `name`; collect a facility ID.

**Phase 2 (dependent)** — use the IDs collected in Phase 1.

- `garoon-get-users-in-organization`: `organizationId` ← collected organization ID.
- `garoon-get-bulletin-topics`: `categoryId` ← collected category ID.
- `garoon-get-bulletin-topic`: `topicId` ← from the `get-bulletin-topics` result.
- `garoon-get-facilities-in-group`: `facilityGroupId` ← collected facility group ID.
- `garoon-get-schedule-events`: `target` ← current user ID; `rangeStart` / `rangeEnd`
  ← derived from the current time.
- `garoon-search-available-times`: `timeRanges` ← derived from the current time;
  `attendees` ← current user ID.

**Phase 3 (mutating)** — actually creates data in Garoon.

- `garoon-create-schedule-event`: create a real event.
  - Prefix the subject with an identifiable marker, e.g.
    `[MCP-SMOKE-TEST] safe to delete <ISO datetime>`.
  - Set `start` sufficiently in the future.
  - On success, record the returned event ID as **requiring manual deletion**.
  - **No delete tool exists, so no automatic cleanup is performed.** Surface the
    created event in the report and prompt for manual deletion.

If a dependent tool cannot obtain a valid ID/input (e.g. a search returns zero
results), mark it **BLOCKED** (not FAIL) and record the reason.

### Verdicts

- **PASS**: the tool returned a result without error (an empty result still passes).
- **FAIL**: the call errored (exception / `isError` / output-schema validation failure / HTTP error).
- **BLOCKED**: a required dependent ID/input could not be prepared, so the tool was not run.

### Execution tips

- Tool outputs can be large, so delegate each Phase 2 / 3 call to a subagent that
  returns only PASS/FAIL and a minimal summary, keeping the main context clean.
  Pass the IDs collected in Phase 1 into the subagent prompt.
- Run Phase 1 in the main context, since its collected IDs must be retained.

## Report

Finish by emitting:

1. **Summary**: counts of PASS / FAIL / BLOCKED.
2. **Detail table**:

   | Tool | Sample prompt | Verdict | Notes (error / collected ID) |
   | ---- | ------------- | ------- | ---------------------------- |

3. **Manual cleanup**: the events created in Phase 3 (subject / event ID / URL if
   available), noting that manual deletion is required because no delete tool exists.

## Maintenance

- The target tool set is enumerated at runtime from `mcp__garoon__*`, so adding a
  tool requires no change to this skill.
- Only extend the Phase 1 / 2 descriptions when a new dependency (a new kind of
  required ID input) is introduced.
- This skill is committed to a public repository. Never record credentials,
  absolute paths, or literal environment-variable values here.
