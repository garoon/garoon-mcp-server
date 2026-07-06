# copilot-instructions.md

This file provides guidance to Github Copilot when working with code in this repository.

# Project Overview

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
pnpm install

# Build the TypeScript project
pnpm run build
```

### Development

```bash
# Run with MCP Inspector for debugging (Create .env.local)
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
./scripts/build-docker.sh

# Run with Docker (configure in .vscode/mcp.json)
docker run --rm -i \
  -e GAROON_BASE_URL \
  -e GAROON_USERNAME \
  -e GAROON_PASSWORD \
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

### Key Files

- `src/index.ts`: Entry point that initializes the MCP server and registers all components
- `src/client.ts`: HTTP client for Garoon API communication with authentication
- `src/core/register.ts`: Tool-registration system (`defineTool`/`registerTools`) with error handling wrapper
- `src/schemas/`: Zod schemas for cross-application Garoon vocabulary (id, user, organization, datetime, pagination)

### Authentication

The server uses Basic Authentication with the Garoon API:

- Credentials are read from environment variables
- Authentication header is automatically added to all requests via `X-Cybozu-Authorization`
- Supports proxy configuration via `https_proxy`/`http_proxy` environment variables

### Error Handling

- All tools are wrapped with error handlers that catch and format errors
- HTTP errors are captured with status codes and response text
- Structured error outputs are returned to the MCP client

### Testing Strategy

- Uses Vitest as the test runner
- Mock pattern: API client functions are mocked using `vi.mock()`
- Test structure: Each tool/resource has a corresponding `.test.ts` file
- Tests validate: tool configuration, schemas, and callback behavior

## Reference site

The Garoon's help site is available at:

- https://jp.cybozu.help/g/ja/

The API documentation is available at:

- https://cybozu.dev/ja/garoon/docs/
- https://cybozu.dev/ja/garoon/docs/rest-api/
