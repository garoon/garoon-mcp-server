# Garoon MCP Server

## Setup
```bash
# Option-1 (Use Docker)
bin/docker-build.sh
# Option-2 (Use Node.js)
npm install
npm run build
```

## MCP Inspector Usage (Visual testing tool)
Enable environment variables at startup by `.env.local`

```bash
cat << EOS > .env.local
GAROON_BASE_URL=https://example.cybozu.com/g
GAROON_USERNAME=username
GAROON_PASSWORD=password
EOS
npm run dev
```

Reference: https://github.com/modelcontextprotocol/inspector

# Setting Example
## Visual Studio Code
Configure in `.vscode/mcp.json`:
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
        "GAROON_PASSWORD": "password"
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
        "garoon-mcp-server:latest"
      ],
      "env": {
        "GAROON_BASE_URL": "http://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password"
      }
    }
  }
}
```

## Cursor / Claude Code
Configure in `.cursor/mcp.json`
Configure in `.mcp.json`
```json
{
  "mcpServers": {
    "garoon-mcp-server": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "GAROON_BASE_URL": "http://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password"
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
        "garoon-mcp-server:latest"
      ],
      "env": {
        "GAROON_BASE_URL": "http://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password"
      }
    }
  }
}
```
