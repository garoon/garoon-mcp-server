# Garoon MCP Server

[![ci][ci-badge]][ci-url]
[![License][license-badge]][license-url]

[ci-badge]: https://github.com/garoon/garoon-mcp-server/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/garoon/garoon-mcp-server/actions/workflows/ci.yml
[license-badge]: https://img.shields.io/badge/License-Apache_2.0-blue.svg
[license-url]: LICENSE

[日本語](README.md) | English

Official local MCP server for Garoon.

## Installation

### MCPB (formerly DXT)

As of October 2025, MCPB is an installation method supported only by [Claude for desktop](https://claude.ai/download).\
You can install it simply by opening the `.mcpb` file with Claude.

1. Open the [Releases page](https://github.com/garoon/garoon-mcp-server/releases).
2. Download `garoon-mcp-server.mcpb` from Assets.
3. Open the downloaded file with Claude.
4. Select "Install" when the installation confirmation dialog appears.
5. Enter the required information in the settings dialog and save.
6. Enable the Garoon MCP Server toggle switch if it is disabled.

### Docker Image

You need to have [Docker](https://www.docker.com/) installed and available.
After installation, you can pull the Docker image with the following command:

```shell
docker pull ghcr.io/garoon/mcp-server:latest
```

To use this method, you need a configuration file specific to your MCP client.
Please refer to the [Configuration File Examples](#configuration-file-examples) section below.

### npm Package

[Node.js](https://nodejs.org/) needs to be installed and available.
After installation, you can install globally with the following command:

```shell
npm install -g @garoon/mcp-server
```

To use this method, you need a configuration file specific to your MCP client.
Please refer to the [Configuration File Examples](#configuration-file-examples) section below.

## Configuration File Examples

> [!WARNING]
> Saving configuration files containing login information on your computer poses security risks. Please manage them appropriately and use at your own risk.

### File Paths

For details and the latest information, please refer to the official documentation of the MCP client tool you wish to use.

**Cursor \[[ref](https://docs.cursor.com/en/context/mcp)\]:**

Create the following file within your specific workspace:

- `.cursor/mcp.json`

**Visual Studio Code \[[ref](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)\]:**

Create the following file within your specific workspace:

- `.vscode/mcp.json`

### Configuration Content

Configuration is done through environment variables.
You can omit unnecessary environment variables for your environment.
Refer to the [Configuration Items](#configuration-items) section below for details about each environment variable.

#### Cursor

<details>
<summary>Docker Image</summary>

```json
{
  "mcpServers": {
    "garoon-mcp-server": {
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
        "https_proxy",
        "-e",
        "GAROON_BASIC_AUTH_USERNAME",
        "-e",
        "GAROON_BASIC_AUTH_PASSWORD",
        "-e",
        "GAROON_PUBLIC_ONLY",
        "ghcr.io/garoon/mcp-server:latest"
      ],
      "env": {
        "GAROON_BASE_URL": "https://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "https_proxy": "http://proxy.example.com:8080",
        "GAROON_BASIC_AUTH_USERNAME": "username",
        "GAROON_BASIC_AUTH_PASSWORD": "password",
        "GAROON_PUBLIC_ONLY": "false"
      }
    }
  }
}
```

When using a client certificate, you need to mount the `*.pfx` file on the host machine into the container using the `--mount` option[[ref](https://docs.docker.com/storage/bind-mounts/)] of `docker run`.

```json
{
  "mcpServers": {
    "garoon-mcp-server": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "--mount",
        "type=bind,src=/absolute/path/to/pfx_file.pfx,dst=/cert.pfx",
        "-e",
        "GAROON_BASE_URL",
        "-e",
        "GAROON_USERNAME",
        "-e",
        "GAROON_PASSWORD",
        "-e",
        "GAROON_PFX_FILE_PATH",
        "-e",
        "GAROON_PFX_FILE_PASSWORD",
        "-e",
        "GAROON_PUBLIC_ONLY",
        "ghcr.io/garoon/mcp-server:latest"
      ],
      "env": {
        "GAROON_BASE_URL": "https://example.s.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "GAROON_PFX_FILE_PATH": "/cert.pfx",
        "GAROON_PFX_FILE_PASSWORD": "password",
        "GAROON_PUBLIC_ONLY": "false"
      }
    }
  }
}
```

</details>

<details>
<summary>npm Package</summary>

```json
{
  "mcpServers": {
    "garoon-mcp-server": {
      "command": "garoon-mcp-server",
      "env": {
        "GAROON_BASE_URL": "https://example.s.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "https_proxy": "http://proxy.example.com:8080",
        "GAROON_PFX_FILE_PATH": "/absolute/path/to/pfx_file.pfx",
        "GAROON_PFX_FILE_PASSWORD": "pfx_password",
        "GAROON_BASIC_AUTH_USERNAME": "username",
        "GAROON_BASIC_AUTH_PASSWORD": "password",
        "GAROON_PUBLIC_ONLY": "false"
      }
    }
  }
}
```

Depending on your environment, the globally installed `garoon-mcp-server` command may not resolve correctly.
Try using an absolute path or the `npx` command instead.

```json
{
  "mcpServers": {
    "garoon-mcp-server": {
      "command": "npx",
      "args": ["@garoon/mcp-server"],
      "env": {
        "GAROON_BASE_URL": "https://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "GAROON_PUBLIC_ONLY": "false"
      }
    }
  }
}
```

</details>

#### Visual Studio Code

<details>
<summary>Docker Image</summary>

```json
{
  "servers": {
    "garoon-mcp-server": {
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
        "https_proxy",
        "-e",
        "GAROON_BASIC_AUTH_USERNAME",
        "-e",
        "GAROON_BASIC_AUTH_PASSWORD",
        "-e",
        "GAROON_PUBLIC_ONLY",
        "ghcr.io/garoon/mcp-server:latest"
      ],
      "env": {
        "GAROON_BASE_URL": "https://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "https_proxy": "http://proxy.example.com:8080",
        "GAROON_BASIC_AUTH_USERNAME": "username",
        "GAROON_BASIC_AUTH_PASSWORD": "password",
        "GAROON_PUBLIC_ONLY": "false"
      }
    }
  }
}
```

When using a client certificate, you need to mount the `*.pfx` file on the host machine into the container using the `--mount` option[[ref](https://docs.docker.com/storage/bind-mounts/)] of `docker run`.

```json
{
  "servers": {
    "garoon-mcp-server": {
      "type": "stdio",
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "--mount",
        "type=bind,src=/absolute/path/to/pfx_file.pfx,dst=/cert.pfx",
        "-e",
        "GAROON_BASE_URL",
        "-e",
        "GAROON_USERNAME",
        "-e",
        "GAROON_PASSWORD",
        "-e",
        "GAROON_PFX_FILE_PATH",
        "-e",
        "GAROON_PFX_FILE_PASSWORD",
        "-e",
        "GAROON_PUBLIC_ONLY",
        "ghcr.io/garoon/mcp-server:latest"
      ],
      "env": {
        "GAROON_BASE_URL": "https://example.s.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "GAROON_PFX_FILE_PATH": "/cert.pfx",
        "GAROON_PFX_FILE_PASSWORD": "password",
        "GAROON_PUBLIC_ONLY": "false"
      }
    }
  }
}
```

</details>

<details>
<summary>npm Package</summary>

```json
{
  "servers": {
    "garoon-mcp-server": {
      "type": "stdio",
      "command": "garoon-mcp-server",
      "env": {
        "GAROON_BASE_URL": "https://example.s.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "https_proxy": "http://proxy.example.com:8080",
        "GAROON_PFX_FILE_PATH": "/absolute/path/to/pfx_file.pfx",
        "GAROON_PFX_FILE_PASSWORD": "pfx_password",
        "GAROON_BASIC_AUTH_USERNAME": "username",
        "GAROON_BASIC_AUTH_PASSWORD": "password",
        "GAROON_PUBLIC_ONLY": "false"
      }
    }
  }
}
```

Depending on your environment, the globally installed `garoon-mcp-server` command may not resolve correctly.
Try using an absolute path or the `npx` command instead.

```json
{
  "servers": {
    "garoon-mcp-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["@garoon/mcp-server"],
      "env": {
        "GAROON_BASE_URL": "https://example.cybozu.com/g",
        "GAROON_USERNAME": "username",
        "GAROON_PASSWORD": "password",
        "GAROON_PUBLIC_ONLY": "false"
      }
    }
  }
}
```

</details>

## Configuration Items

| MCPB                  | Docker/npm Environment Variable | Description                                                                                                                                   | Required |
| --------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `Garoon Base URL`     | `GAROON_BASE_URL`               | Base URL of Garoon environment<br>Example 1: `https://example.cybozu.com/g`<br>Example 2: `https://example.com/cgi-bin/cbgrn/grn.cgi`         | ✓        |
| `Garoon Username`     | `GAROON_USERNAME`               | Garoon login name                                                                                                                             | ✓        |
| `Garoon Password`     | `GAROON_PASSWORD`               | Garoon login password                                                                                                                         | ✓        |
| `HTTPS Proxy`         | `https_proxy`                   | HTTPS proxy URL<br>Example: `http://proxy.example.com:8080`                                                                                   | -        |
| `PFX File Path`       | `GAROON_PFX_FILE_PATH`          | Absolute path to client certificate (`*.pfx`)                                                                                                 | -        |
| `PFX File Password`   | `GAROON_PFX_FILE_PASSWORD`      | Client certificate password                                                                                                                   | -        |
| `Basic Auth Username` | `GAROON_BASIC_AUTH_USERNAME`    | Basic authentication username                                                                                                                 | -        |
| `Basic Auth Password` | `GAROON_BASIC_AUTH_PASSWORD`    | Basic authentication password                                                                                                                 | -        |
| `Public Only Mode`    | `GAROON_PUBLIC_ONLY`            | Public-only mode to exclude private schedule events<br>When set to `true`, highly confidential private events are excluded (default: `false`) | -        |

**Notes:**

- When using client certificate authentication, the URL domain is `.s.cybozu.com` (Example: `https://example.s.cybozu.com`)

## Tool List

| Tool Name                  | Description                                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Create Schedule Event      | Creates a schedule event.                                                                                      |
| Get Schedule Events        | Retrieves schedule events for specified users, organizations, or facilities.                                   |
| Search Available Times     | Searches for available time slots based on specified conditions such as users and time ranges.                 |
| Get Facilities             | Searches for facility IDs by facility name.                                                                    |
| Garoon Get Facility Groups | Retrieves a list of facility groups.                                                                           |
| Get Facilities In Group    | Retrieves facilities that belong to a specific facility group.                                                 |
| Get Current Datetime       | Gets the current date and time.                                                                                |
| Get Garoon Users           | Searches for user IDs, display names, and login names by name.<br>Also supports prompts like "me" or "myself". |
| Get Organizations          | Searches for organization IDs by organization name.                                                            |
| Get Users In Organization  | Gets users belonging to the specified organization ID.                                                         |

**Notes:**

- Tools internally use Garoon's REST API.
  If you are using the package version, depending on the version, the REST API used by the tools may not exist on the Garoon side.\
  For REST API version compatibility, please refer to the [Garoon API documentation](https://cybozu.dev/en/garoon/docs/rest-api/).
- This MCP server does not support the DB-distributed edition.

## Support Policy

The Garoon local MCP server is not covered by support services.\
Please submit bug reports and feature requests through [Issues](https://github.com/garoon/garoon-mcp-server/issues).

## Contributing

Please refer to the [Contributing Guide](CONTRIBUTING.md).

## License

Copyright 2025 Cybozu, Inc.

Licensed under the [Apache 2.0](LICENSE).
