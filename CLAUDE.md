# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Garoon MCP (Model Context Protocol) server that provides tools, resources, and prompts for interacting with the Garoon API. Garoon is a groupware application by Cybozu used for scheduling, collaboration, and organizational management.
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

### MCP Server Structure

The server follows the MCP (Model Context Protocol) pattern with three main components:

1. **Tools** (`src/tools/`): Active operations that perform actions
   - Each tool is registered via `registerTools()` with input/output schemas

2. **Resources** (`src/resources/`): Read-only data providers
   - Registered via `registerResources()`

3. **Prompts** (`src/prompts/`): Pre-configured prompt templates
   - Registered via `registerPrompts()`

### Key Files

- `src/index.ts`: Entry point that initializes the MCP server and registers all components
- `src/client.ts`: HTTP client for Garoon API communication with authentication
- `src/*/register.ts`: MCP feature-registration system with error handling wrapper
- `src/schemas/`: Zod schemas for data validation (schedule events, users)

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
