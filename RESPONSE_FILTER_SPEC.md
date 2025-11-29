# レスポンスフィルタリング機能 仕様書

## 概要

MCPサーバーが返すレスポンスから秘密情報を削除し、LLMに学習されることを防ぐ機能。環境変数で指定されたフィルター設定ファイルに基づいて、レスポンスのフィールドを選別的に削除する。

## フィルター設定ファイル

### ファイル形式

JSON形式で以下の構造を持つ：

```json
{
  "version": "1.0",
  "tools": {
    "tool-name": ["field-path1", "field-path2"],
    "get-schedule-events": ["events[].notes", "events[].visibilityType", "events[].attendees[].email"],
    "get-garoon-users": ["users", "users[].phone"]
  }
}
```

### パス指定ルール

| パターン | 説明 | 例 |
|---------|------|-----|
| `fieldName` | 親フィールド全体を削除 | `users` で users フィールド全体を削除 |
| `fieldName[]` | 配列内のすべての要素を削除 | `users[]` で users 配列全体を削除 |
| `fieldName[].subfield` | 配列要素内の特定フィールドを削除 | `users[].phone` で各user要素の phone フィールドのみ削除 |
| `fieldName[].subfield[]` | ネストされた配列要素を削除 | `events[].attendees[]` で各event要素の attendees 配列全体を削除 |
| `fieldName[].subfield[].subfield2` | 深いネストも対応 | `events[].attendees[].email` で attendees 配列内の email フィールド削除 |

**注意:**
- `result` プリフィックスは不要（structuredContent.result の中身を対象）
- フィールドパスは大文字小文字を区別する

### 設定例

```json
{
  "version": "1.0",
  "tools": {
    "get-schedule-events": [
      "events[].notes",
      "events[].visibilityType",
      "events[].attendees[].attendanceResponse"
    ],
    "get-garoon-users": [
      "users"
    ],
    "create-schedule-event": [
      "event.notes"
    ]
  }
}
```

## 環境変数

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `GAROON_FILTER_PATH` | フィルター設定ファイルのパス | いいえ |

## 動作仕様

### 初期化フロー（アプリケーション起動時）

```
1. src/index.ts で initializeFilterConfig() を呼び出し
2. GAROON_FILTER_PATH 環境変数を確認
3. ファイルが指定されている場合：
   a. ファイルを読み込む
   b. JSON をパース
   c. validateFilterConfig() で検証
   d. メモリに保持
4. ファイルが指定されていない場合：
   フィルタリング機能は無効（すべてのデータを返す）
```

### レスポンス処理フロー

```
handler.ts が実行
  ├─ Garoon API からデータ取得
  ├─ Zod で検証
  └─ structuredContent と content を構築
  ↓
wrapWithFiltering() が実行
  ├─ getFilterConfig() からメモリの設定を取得
  ├─ ツール名に該当するフィルター設定があるか確認
  ├─ あれば applyResponseFilter() を呼び出し
  │  ├─ structuredContent.result に対してフィルタリング適用
  │  └─ 削除済みデータを返す
  ├─ 削除済みデータを使って JSON を再生成
  └─ レスポンスを LLM に返却
  ↓
エラー発生時：
  ├─ フィルタリング失敗 → console.error()、元のデータを返す
  └─ ファイル読み込み失敗 → console.warn()、フィルタリングなし
```

### エラーハンドリング

| シナリオ | ログレベル | 動作 |
|---------|-----------|------|
| GAROON_FILTER_PATH 未設定 | INFO | フィルタリングなし、すべてのデータを返す |
| ファイルが見つからない | WARN | フィルタリングなし、すべてのデータを返す |
| JSON パース失敗 | WARN | フィルタリングなし、すべてのデータを返す |
| 設定フォーマット不正 | WARN | フィルタリングなし、すべてのデータを返す |
| ツール実行中のフィルタリング失敗 | ERROR | 元のデータを返す |

## ログ出力例

### 正常系

```
[INFO] Filter config loaded from /path/to/filter.json
[INFO] Filters applied to 3 tools: get-schedule-events, get-garoon-users, create-schedule-event
```

### エラー系

```
[WARN] [Filter] Filter config file not found: /path/to/filter.json
[WARN] [Filter] Invalid filter config format: Unexpected token in JSON
[ERROR] [Filter] Failed to filter response for tool "get-schedule-events": Invalid field path
```

## 実装詳細

### ファイル構成

```
src/
├── utils/
│   └── response-filter.ts          ← 新規作成
│       ├── initializeFilterConfig()
│       ├── getFilterConfig()
│       ├── validateFilterConfig()
│       ├── applyResponseFilter()
│       └── removeFieldByPath()
├── tools/
│   └── register.ts                 ← 修正
│       └── wrapWithFiltering() を追加
└── index.ts                        ← 修正
    └── initializeFilterConfig() を起動時に呼び出し
```

### 型定義（TypeScript）

```typescript
interface FilterConfig {
  version: string;
  tools: Record<string, string[]>;
}

// 例：
// {
//   version: "1.0",
//   tools: {
//     "get-schedule-events": ["events[].notes", "events[].attendees[].email"],
//     "get-garoon-users": ["users"]
//   }
// }
```

### 主要関数シグネチャ

#### `initializeFilterConfig(): void`
- アプリケーション起動時に呼び出し
- GAROON_FILTER_PATH から設定ファイルを読み込みメモリに保持
- ファイルが見つからない場合は警告ログを出力

#### `getFilterConfig(): FilterConfig | null`
- メモリから設定を取得
- 設定が読み込まれていない場合は null を返す

#### `validateFilterConfig(config: FilterConfig): void`
- フィルター設定の基本検証を行う
- 不正な場合は警告ログを出力

#### `applyResponseFilter(response: unknown, toolName: string): unknown`
- レスポンスに対してフィルタリングを適用
- 指定フィールドを削除したオブジェクトを返す
- エラー時は例外をスロー

#### `removeFieldByPath(obj: unknown, path: string): unknown`
- JSONPath ライクなパス記法でフィールドを削除
- ネストされたオブジェクト・配列に対応
- 削除後のオブジェクトを返す

## テスト方針

### response-filter.test.ts

各パターンのフィルタリング動作確認：

1. **単純なフィールド削除**
   - `users` → users フィールド全体を削除

2. **配列全体削除**
   - `users[]` → users 配列全体を削除

3. **配列内のサブフィールド削除**
   - `events[].attendees[].attendanceResponse` → attendees 配列内の各要素の attendanceResponse フィールドのみ削除
   - `events[].attendees[].code` と `events[].attendees[].name` を指定した場合、id のみ残る

4. **ネストされた配列**
   - `events[].attendees[]` → attendees 配列全体を削除
   - `events[].attendees[].email` → email フィールドのみ削除

5. **複数フィールド削除**
   - 複数パスを指定した場合の削除確認

6. **存在しないパス**
   - フィールドが存在しない場合のハンドリング

7. **エラーハンドリング**
   - 不正なパス形式
   - null/undefined 値の処理

### register.test.ts

統合テスト：

1. **フィルタリングの適用確認**
   - ツール実行時にフィルタリングが適用されること
   - structuredContent と content の両方が更新されること

2. **エラー時の動作**
   - フィルタリング失敗時に元のデータを返すこと

3. **フィルター設定がない場合**
   - フィルタリング設定がないツールはフィルタリングされないこと

## 使用方法

### 1. フィルター設定ファイルを作成

`filter.json`:
```json
{
  "version": "1.0",
  "tools": {
    "get-schedule-events": ["events[].notes", "events[].visibilityType"],
    "get-garoon-users": ["users"]
  }
}
```

### 2. 環境変数を設定

```bash
export GAROON_FILTER_PATH=/path/to/filter.json
```

### 3. MCPサーバーを起動

```bash
pnpm run start
```

ログに以下が表示されれば正常：
```
[INFO] Filter config loaded from /path/to/filter.json
[INFO] Filters applied to 2 tools: get-schedule-events, get-garoon-users
```

### 実装時の注意

実装する際は、必ず実際のスキーマ定義を確認してください。フィルター対象のフィールドが実際に存在するかどうかを確認しましょう。

**例:**
- `get-garoon-users` の users 配列は id, code, name フィールドのみ持つ（phone フィールドは存在しない）
- `get-schedule-events` の attendees 配列は id, code, name, type, attendanceResponse を持つ（email フィールドは存在しない）

## 実装上の注意事項

1. **パフォーマンス**: フィルター設定はメモリに保持し、リクエストごとにファイル読み込みしない

2. **安全性**: フィルタリング失敗時も元のデータを返すことで、機能障害を回避

3. **デバッグ**: console.warn/error で詳細なログを出力し、ユーザーが問題を特定できるようにする

4. **後方互換性**: GAROON_FILTER_PATH が未設定の場合は現在の動作（フィルタリングなし）を継続

## 将来の拡張可能性

現在の設計で以下の拡張に対応可能：

1. **複数プロファイル対応**
   - `profiles` キーで異なるフィルター設定を管理

2. **条件付きフィルタリング**
   - `rules` で条件付きフィルタリングを実装

3. **ホットリロード**
   - SIGHUP シグナル受信時に設定をリロード

4. **フィールド値の難読化**
   - 削除ではなく、値をマスキングするオプション
