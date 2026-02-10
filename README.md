# Garoon MCP Server

[![ci][ci-badge]][ci-url]
[![License][license-badge]][license-url]

[ci-badge]: https://github.com/garoon/garoon-mcp-server/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/garoon/garoon-mcp-server/actions/workflows/ci.yml
[license-badge]: https://img.shields.io/badge/License-Apache_2.0-blue.svg
[license-url]: LICENSE

日本語 | [English](README_en.md)

Garoonの公式ローカルMCPサーバーです。

## インストール

### MCPB (旧称: DXT)

MCPBは、2025年10月時点では、[Claude for desktop](https://claude.ai/download)のみがサポートしているインストール方式です。\
`.mcpb`ファイルをClaudeで開くだけでインストールすることができます。

1. [リリース一覧](https://github.com/garoon/garoon-mcp-server/releases)を開く。
2. Assetsにある`garoon-mcp-server.mcpb`をダウンロードする。
3. ダウンロードしたファイルをClaudeで開く。
4. インストール確認ダイアログが表示されるのでインストールを選択する。
5. 設定ダイアログが表示されるので、必要な情報を入力して保存する。
6. トグルスイッチでGaroon MCP Serverが無効になっていれば有効にする。

### Dockerイメージ

[Docker](https://www.docker.com/)をインストールして使える状態にする必要があります。
インストール後、以下のコマンドでDockerイメージをプルできます。

```shell
docker pull ghcr.io/garoon/mcp-server:latest
```

この方法で利用するにはMCPクライアントに応じた設定ファイルが必要です。
後述の[設定ファイルの例](#設定ファイルの例)をご参考ください。

### npmパッケージ

[Node.js](https://nodejs.org/ja)をインストールして使える状態にする必要があります。
インストール後、以下のコマンドでグローバルインストールできます。

```shell
npm install -g @garoon/mcp-server
```

この方法で利用するにはMCPクライアントに応じた設定ファイルが必要です。
後述の[設定ファイルの例](#設定ファイルの例)をご参考ください。

## 設定ファイルの例

> [!WARNING]
> ログイン情報を含む設定ファイルをコンピュータ上に保存することはセキュリティ上のリスクがあります。適切に管理していただき、ご利用は自己責任でお願いいたします。

### ファイルパス

詳細や最新情報については、利用したいMCPクライアントツールの公式ドキュメントをご参照ください。

**Cursorの例\[[ref](https://docs.cursor.com/ja/context/mcp)\]:**

特定のワークスペース内で以下のファイルを作成します。

- `.cursor/mcp.json`

**Visual Studio Codeの例\[[ref](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)\]:**

特定のワークスペース内で以下のファイルを作成します。

- `.vscode/mcp.json`

### 設定内容

設定は環境変数で行います。
不要な環境変数については省略できるため、ご利用の環境に合わせて削除してください。
環境変数の意味については後述の[設定項目](#設定項目)をご参照ください。

#### Cursor

<details>
<summary>Dockerイメージの場合</summary>

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

クライアント証明書を利用する場合は、`docker run`の`--mount`オプション\[[ref](https://docs.docker.com/storage/bind-mounts/)\]でホストマシン上の`*.pfx`ファイルをコンテナ内にマウントする必要があります。

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
<summary>npmパッケージの場合</summary>

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

お使いの環境によっては、グローバルインストールした`garoon-mcp-server`コマンドのPATHが正しく解決されない場合があります。
コマンドを絶対パスで指定するか、`npx`コマンドをお試しください。

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
<summary>Dockerイメージの場合</summary>

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

クライアント証明書を利用する場合は、`docker run`の`--mount`オプション\[[ref](https://docs.docker.com/storage/bind-mounts/)\]でホストマシン上の`*.pfx`ファイルをコンテナ内にマウントする必要があります。

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
<summary>npmパッケージの場合</summary>

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

お使いの環境によっては、グローバルインストールした`garoon-mcp-server`コマンドのPATHが正しく解決されない場合があります。
コマンドを絶対パスで指定するか、`npx`コマンドをお試しください。

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

## 設定項目

| MCPB                  | Docker/npmの環境変数         | 説明                                                                                                                    | 必須 |
| --------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---- |
| `Garoon Base URL`     | `GAROON_BASE_URL`            | Garoon環境のベースURL<br>例1: `https://example.cybozu.com/g`<br>例2: `https://example.com/cgi-bin/cbgrn/grn.cgi`        | ✓    |
| `Garoon Username`     | `GAROON_USERNAME`            | Garoonのログイン名                                                                                                      | ✓    |
| `Garoon Password`     | `GAROON_PASSWORD`            | Garoonのログインパスワード                                                                                              | ✓    |
| `HTTPS Proxy`         | `https_proxy`                | HTTPSプロキシのURL<br>例: `http://proxy.example.com:8080`                                                               | -    |
| `PFX File Path`       | `GAROON_PFX_FILE_PATH`       | クライアント証明書（`*.pfx`）の絶対パス                                                                                 | -    |
| `PFX File Password`   | `GAROON_PFX_FILE_PASSWORD`   | クライアント証明書のパスワード                                                                                          | -    |
| `Basic Auth Username` | `GAROON_BASIC_AUTH_USERNAME` | Basic認証のユーザー名                                                                                                   | -    |
| `Basic Auth Password` | `GAROON_BASIC_AUTH_PASSWORD` | Basic認証のパスワード                                                                                                   | -    |
| `Public Only Mode`    | `GAROON_PUBLIC_ONLY`         | プライベート予定を除外するモード<br>`true`に設定すると機密性の高いプライベート予定が除外されます（デフォルト: `false`） | -    |

**注意事項:**

- クライアント証明書認証を使用する場合、URLのドメインは `.s.cybozu.com` となります（例: `https://example.s.cybozu.com`）

## ツール一覧

| ツール名                   | 説明                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| Create Schedule Event      | スケジュールを作成します。                                                                             |
| Get Schedule Events        | ユーザー/組織/施設を指定し、対象の予定を取得します。                                                   |
| Search Available Times     | ユーザーや時間範囲などの条件を指定して空き時間を検索します。                                           |
| Get Facilities             | 施設名から施設IDを検索します。                                                                         |
| Garoon Get Facility Groups | 施設グループの一覧を取得します。                                                                       |
| Get Facilities In Group    | 指定した施設グループに所属する施設を取得します。                                                       |
| Get Current Datetime       | 現在の日時を取得します。                                                                               |
| Get Garoon Users           | 名前からユーザーID/表示名/ログイン名を検索します。<br>「私」「自分」等のプロンプトにも対応しています。 |
| Get Organizations          | 組織名から組織IDを検索します。                                                                         |
| Get Users In Organization  | 指定した組織IDに所属するユーザーを取得します。                                                         |

**注意事項:**

- ツールは内部的にGaroonのREST APIを使用しています。
  パッケージ版をご利用の場合、バージョンによってはツールが使用するREST APIがGaroon側に存在しない場合がございます。\
  REST APIの対応バージョンについては[Garoon APIドキュメント](https://cybozu.dev/ja/garoon/docs/rest-api/)をご参照ください。
- 本MCPサーバーはDB分割構成には対応していません。

## サポート方針

GaroonローカルMCPサーバーは、サポート窓口の対象外です。\
バグ報告や機能要望は[Issues](https://github.com/garoon/garoon-mcp-server/issues)から登録をお願いします。

## コントリビューション

[Contributing Guide](CONTRIBUTING.md) を参照してください。

## ライセンス

Copyright 2025 Cybozu, Inc.

Licensed under the [Apache 2.0](LICENSE).
