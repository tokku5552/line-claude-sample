# LINE Claude Bot

LINE Messaging API と Claude AI を使用したシンプルなチャットボットです。

## 機能

- LINE メッセージを Claude AI に送信して応答を取得
- TypeScript 実装による型安全性
- Express.js による Webhook サーバー

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、必要な API キーを設定してください。

```bash
cp .env.example .env
```

`.env`ファイルに以下の値を設定：

```env
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
LINE_CHANNEL_SECRET=your_line_channel_secret_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3000
```

### 3. LINE Bot の設定

1. [LINE Developers Console](https://developers.line.biz/)にアクセス
2. 新しい Provider と Channel を作成
3. Channel Access Token と Channel Secret を取得
4. Webhook URL を設定（例: `https://your-domain.com/webhook`）

### 4. ngrok の設定（開発環境用）

開発環境で LINE Bot をテストするには、ローカルサーバーを外部からアクセス可能にするために ngrok を使用します。

1. ngrok をインストール:

```bash
# Homebrew を使用（macOS）
brew install ngrok

# または npm を使用
npm install -g ngrok
```

2. ngrok でローカルサーバーを公開:

```bash
# ポート3000を公開（アプリケーションのポートに合わせて変更）
ngrok http 3000
```

3. ngrok から提供される HTTPS URL をコピーし、LINE Developers Console で Webhook URL として設定:

```
https://xxxxxxxx.ngrok.io/webhook
```

### 5. Claude API Key の取得

1. [Anthropic Console](https://console.anthropic.com/)にアクセス
2. API Key を作成
3. `.env`ファイルに設定

## 実行方法

### 開発モード

```bash
npm run dev
```

### プロダクションビルド

```bash
npm run build
npm start
```

### TypeScript コンパイルのみ

```bash
npm run build
```

## プロジェクト構成

```text
.
├── src/
│   └── index.ts          # メインアプリケーション
├── dist/                 # コンパイル後のJavaScript
├── package.json
├── tsconfig.json
├── .env.example          # 環境変数のサンプル
└── README.md
```

## 動作確認

1. サーバーが起動したら `http://localhost:3000` にアクセス
2. "LINE Claude Bot is running!" が表示されることを確認
3. LINE Bot にメッセージを送信して応答を確認

## 注意事項

- 本番環境では適切な HTTPS 設定が必要
- API 使用量に応じて課金される可能性があります
- `.env`ファイルは絶対にコミットしないでください
