# Garoon MCP Server

## Setup

```bash
# Option-1 (Use Docker)
./scripts/build-docker.sh
# Option-2 (Use Node.js)
pnpm install
pnpm run build
```

## MCP Inspector Usage (Visual testing tool)

Enable environment variables at startup by `.env.local`

```bash
cat << EOS > .env.local
GAROON_BASE_URL=https://example.cybozu.com/g
GAROON_USERNAME=username
GAROON_PASSWORD=password
http_proxy=http://localhost:7890
https_proxy=http://localhost:7890
GAROON_PFX_FILE_PATH=absolute/path/to/pfx_file
GAROON_PFX_FILE_PASSWORD=pfx_password
GAROON_BASIC_AUTH_USERNAME=username
GAROON_BASIC_AUTH_PASSWORD=password
EOS
pnpm run dev
```

If your site doesn't require a client certificate, leave `GAROON_PFX_FILE_PATH` and `GAROON_PFX_FILE_PASSWORD` empty.
If you don't use proxy, leave `http_proxy` or `https_proxy` empty.

If your site uses Basic Authentication, set `GAROON_BASIC_AUTH_USERNAME` and `GAROON_BASIC_AUTH_PASSWORD`.

Reference: https://github.com/modelcontextprotocol/inspector

# Setting Example

## Visual Studio Code

Configure in `.vscode/mcp.json`:
If your site doesn't require a client certificate, leave `GAROON_PFX_FILE_PATH` and `GAROON_PFX_FILE_PASSWORD` empty.
If you don't use proxy, leave `http_proxy` or `https_proxy` empty.

If your site uses Basic Authentication, set `GAROON_BASIC_AUTH_USERNAME` and `GAROON_BASIC_AUTH_PASSWORD`.

```json
{
  "servers": {
    "garoon-mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "GAROON_BASE_URL": "http://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "http_proxy": "http://localhost:7890",
        "https_proxy": "http://localhost:7890",
        "GAROON_PFX_FILE_PATH": "/absolute/path/to/pfx_file",
        "GAROON_PFX_FILE_PASSWORD": "pfx_password",
        "GAROON_BASIC_AUTH_USERNAME": "username",
        "GAROON_BASIC_AUTH_PASSWORD": "password"
      }
    },
    "garoon-mcp-server-docker": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "GAROON_BASE_URL",
        "-e",
        "GAROON_USERNAME",
        "-e",
        "GAROON_PASSWORD",
        "-e",
        "http_proxy",
        "-e",
        "https_proxy",
        "-e",
        "GAROON_PFX_FILE_PATH",
        "-e",
        "GAROON_PFX_FILE_PASSWORD",
        "-e",
        "GAROON_BASIC_AUTH_USERNAME",
        "-e",
        "GAROON_BASIC_AUTH_PASSWORD",
        "garoon-mcp-server:latest"
      ],
      "env": {
        "GAROON_BASE_URL": "http://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "http_proxy": "http://localhost:7890",
        "https_proxy": "http://localhost:7890",
        "GAROON_PFX_FILE_PATH": "/absolute/path/to/pfx_file",
        "GAROON_PFX_FILE_PASSWORD": "pfx_password",
        "GAROON_BASIC_AUTH_USERNAME": "username",
        "GAROON_BASIC_AUTH_PASSWORD": "password"
      }
    }
  }
}
```

## Cursor / Claude Code

Configure in `.cursor/mcp.json`
Configure in `.mcp.json`
If your site doesn't require a client certificate, leave `GAROON_PFX_FILE_PATH` and `GAROON_PFX_FILE_PASSWORD` empty.
If you don't use proxy, leave `http_proxy` or `https_proxy` empty.

If your site uses Basic Authentication, set `GAROON_BASIC_AUTH_USERNAME` and `GAROON_BASIC_AUTH_PASSWORD`.

```json
{
  "mcpServers": {
    "garoon-mcp-server": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "GAROON_BASE_URL": "http://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "http_proxy": "http://localhost:7890",
        "https_proxy": "http://localhost:7890",
        "GAROON_PFX_FILE_PATH": "/absolute/path/to/pfx_file",
        "GAROON_PFX_FILE_PASSWORD": "pfx_password",
        "GAROON_BASIC_AUTH_USERNAME": "username",
        "GAROON_BASIC_AUTH_PASSWORD": "password"
      }
    },
    "garoon-mcp-server-docker": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "-e",
        "GAROON_BASE_URL",
        "-e",
        "GAROON_USERNAME",
        "-e",
        "GAROON_PASSWORD",
        "-e",
        "http_proxy",
        "-e",
        "https_proxy",
        "-e",
        "GAROON_PFX_FILE_PATH",
        "-e",
        "GAROON_PFX_FILE_PASSWORD",
        "-e",
        "GAROON_BASIC_AUTH_USERNAME",
        "-e",
        "GAROON_BASIC_AUTH_PASSWORD",
        "garoon-mcp-server:latest"
      ],
      "env": {
        "GAROON_BASE_URL": "http://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "http_proxy": "http://localhost:7890",
        "https_proxy": "http://localhost:7890",
        "GAROON_PFX_FILE_PATH": "/absolute/path/to/pfx_file",
        "GAROON_PFX_FILE_PASSWORD": "pfx_password",
        "GAROON_BASIC_AUTH_USERNAME": "username",
        "GAROON_BASIC_AUTH_PASSWORD": "password"
      }
    }
  }
}
```
