# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Garoon MCP (Model Context Protocol) server that provides tools for interacting with the Garoon API. Garoon is a groupware application by Cybozu used for scheduling, collaboration, and organizational management.
Garoon bundles various applications like the following.

- Scheduler(スケジュール)
- Workflow(ワークフロー)
- E-mail(メール)
- Messages(メッセージ)
- Space(スペース)
- Bulletin Board(掲示板)
- MultiReport(マルチレポート)
- Portal(ポータル)
- Cabinet(ファイル管理)
- Presence indicators(在籍情報)
- and more.

This MCP server mainly uses REST API. Garoon also has SOAP API, but it is legacy and its use is not recommended.

## Development Commands

### Setup

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build the TypeScript project
pnpm run build
```

### Development

```bash
# Run with MCP Inspector for debugging (requires direnv; see CONTRIBUTING.md)
pnpm run dev

# Build TypeScript
pnpm run build

# Start the MCP server
pnpm run start

# Type checking
pnpm run typecheck
```

### Testing

```bash
# Run all tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Watch mode for test development
pnpm run test:watch
```

### Docker

```bash
# Build Docker image
scripts/build-docker.sh

# Run with Docker (configure in .vscode/mcp.json)
docker run --rm -i \
  -e GAROON_BASE_URL \
  -e GAROON_USERNAME \
  -e GAROON_PASSWORD \
  -e https_proxy \  # Optional
  -e http_proxy \   # Optional
  -e GAROON_PFX_FILE_PATH \  # Optional
  -e GAROON_PFX_FILE_PASSWORD \  # Optional
  -e GAROON_BASIC_AUTH_USERNAME \  # Optional
  -e GAROON_BASIC_AUTH_PASSWORD \  # Optional
  -e GAROON_PUBLIC_ONLY \  # Optional
  garoon-mcp-server:latest
```

## Architecture

### Directory Layout

The source tree is organized by Garoon application, mirroring the Garoon REST API namespaces:

```
src/
  index.ts                 # composition only
  config.ts / client.ts / constants.ts
  core/                    # protocol-level infrastructure: register.ts (defineTool/registerTools), error-handler.ts, structured-output.ts
  schemas/                 # cross-application Garoon vocabulary (id, user, organization, datetime, pagination)
  applications/<app>/      # one directory per Garoon application (schedule, bulletin, base), matching Garoon REST API namespaces
    index.ts               # aggregated tool exports
    schemas/               # schemas shared by two or more tools within the application
    tools/<tool>/          # index.ts, handler.ts, input-schema.ts, output-schema.ts, tests/
```

Each tool is defined with `defineTool` and registered via `registerTools()` with input/output schemas.

### Tool Annotations

Every tool must declare `annotations`. Follow these rules for new tools:

- `openWorldHint: false` on all tools (the target is a closed Garoon environment, not the open web).
- Read-only tools (those that do not change Garoon state, including search APIs that use POST): `readOnlyHint: true`. Omit `destructiveHint`/`idempotentHint`, which are only meaningful when `readOnlyHint` is `false`.
- Writing tools: `readOnlyHint: false` plus `destructiveHint` and `idempotentHint` reflecting the actual behavior (e.g. creating an event is non-destructive but non-idempotent).
- Do not repeat `title` inside `annotations`; it is set at the top level of `defineTool`.

### Import Aliases (Subpath Imports)

Imports that reach outside their own tool directory use Node subpath imports (the `imports` field in `package.json`) instead of relative paths:

- `#applications/*.js` — code under `src/applications/` (e.g. an application's shared schemas)
- `#core/*.js` — protocol-level infrastructure under `src/core/`
- `#schemas/*.js` — cross-application vocabulary under `src/schemas/`
- `#client.js` — the Garoon HTTP client
- `#config.js` — configuration loading
- `#constants.js` — shared constants

Rule of thumb: relative specifiers are limited to the same directory (`./`) and to files within the same tool directory; everything else uses an alias. A relative path therefore means "code that shares this directory's fate"; a `#`-prefixed specifier means anything reached across directories. This rule applies to code under `src/applications/`; infrastructure under `src/core/` and files at the src root keep their shallow relative imports.

`#applications/*.js` must not be used to reach another application: cross-application imports still go through `src/schemas/` only.

### Schema Placement Rules

Apply these rules to decide where any schema belongs:

1. A new schema starts inside its tool directory.
2. Promote a schema to `src/applications/<app>/schemas/` when a second tool in the same application needs it, and to `src/schemas/` when a second application needs it.
3. Response/input variant pairs of one concept (e.g. `attendeeSchema` / `attendeeInputSchema`) live together in the location of the more widely shared variant, even if the other variant has a single consumer.
4. Do not demote a schema when its consumption drops back to one tool.
5. Cross-application imports go through `src/schemas/` only; applications must not import from each other.

### Key Files

- `src/index.ts`: Entry point that initializes the MCP server and registers all components
- `src/client.ts`: HTTP client for Garoon API communication with authentication
- `src/config.ts`: Loading and validation of every environment variable, exposed as a single configuration object
- `src/core/register.ts`: Tool-registration system (`defineTool`/`registerTools`) with error handling wrapper
- `src/schemas/`: Zod schemas for cross-application Garoon vocabulary (id, user, organization, datetime, pagination)

### Authentication

The server uses Basic Authentication with the Garoon API:

- Credentials are read from environment variables
- Authentication header is automatically added to all requests via `X-Cybozu-Authorization`
- Basic Authentication via `GAROON_BASIC_AUTH_USERNAME` and `GAROON_BASIC_AUTH_PASSWORD` is supported for sites that require it
- Client certificate authentication is supported via PFX files specified by `GAROON_PFX_FILE_PATH` and `GAROON_PFX_FILE_PASSWORD`
- Supports proxy configuration via `https_proxy`/`http_proxy` environment variables

### Error Handling

- All tools are wrapped with error handlers that catch and format errors
- HTTP errors are captured with status codes and response text
- Structured error outputs are returned to the MCP client

### Public Only Mode

`GAROON_PUBLIC_ONLY=true` (exposed as `getConfig().publicOnly`) promises the operator that the server never returns the content of non-public Garoon data. Today this covers private schedule events; the same promise applies to any other application that has a comparable non-public concept.

The promise must hold for every path that can reach the data, not only for list tools. A tool that takes an ID (comments, attachments, details, search by keyword) is as much in scope as a tool that lists events, because an ID obtained elsewhere must not become an alternative path to the data.

Apply this checklist whenever a tool is added or changed:

1. Decide whether the tool can return, or derive its result from, non-public data.
2. Prefer exclusion on the API side (e.g. forcing `showPrivate=false`). Garoon permissions are not a substitute: the API user may legitimately see private events in which it is an attendee.
3. When the API offers no switch, filter the response by its visibility field and treat only an explicit public value (`visibilityType === "PUBLIC"`) as public; a missing or unrecognised value must be excluded. When the response carries no visibility field, look the parent resource up first and fail with an explicit `Error` whose message names Public Only Mode. Do not return an empty result silently, because the client would read it as "no data".
4. The mode is about not returning the content of non-public data; behaviour that only depends on such data is intentionally unaffected. Availability search still treats private events as busy time, and event creation still accepts `visibilityType: "PRIVATE"`. Record such decisions here so they are not mistaken for omissions.
5. Describe the Public Only behaviour in the tool `description` or the relevant input field description. The `Public Only Mode` rows of `README.md` and `README_en.md` and the `garoon_public_only` description in `manifest.json` are updated in the release task, not with the implementation (see "Documentation Updates").
6. Test both `publicOnly: true` and `publicOnly: false` through `setConfig` from `#config.js`, asserting which endpoints are called and in which order.

### Documentation Updates

User-facing documentation (`README.md`, `README_en.md`, and the user-visible descriptions in `manifest.json`) describes the released behaviour, not the state of the `main` branch. There can be a lag between merging a change and releasing it, and a README that describes an unreleased feature confuses users.

- Do not update these files as part of a feature or fix implementation, even when the change alters documented behaviour.
- The release task checks whether these files reflect every change included in the release and updates them at that point.
- `CLAUDE.md`, code comments, and tool `description` strings are part of the implementation and are updated together with the code.

### Testing Strategy

- Uses Vitest as the test runner
- Mock pattern: API client functions are mocked using `vi.mock()`
- Test structure: Each tool/resource has a corresponding `.test.ts` file
- Test placement: every test file lives in a `tests/` directory adjacent to the code under test (e.g. `src/tests/`, `src/core/tests/`, `src/applications/<app>/tools/<tool>/tests/`)
- Tests validate: tool configuration, schemas, and callback behavior

## Reference site

The Garoon's help site is available at:

- https://jp.cybozu.help/g/ja/

The API documentation is available at:

- https://cybozu.dev/ja/garoon/docs/
- https://cybozu.dev/ja/garoon/docs/rest-api/
