# 運用手順書

## インフラ構成

| サービス | ホスティング |
|---|---|
| フロントエンド (Next.js) | Vercel |
| バックエンド (Laravel) | Xserver |
| データベース (MySQL 5.7) | Xserver |

## 本番データベースへの接続

Xserver の MySQL は外部からの直接接続ができないため、SSH トンネル経由で接続する。

### 1. SSH トンネルを開く

ターミナルで以下を実行（接続中は開いたままにする）:

```bash
ssh -p 10022 -i ~/.ssh/xserver_deploy -L 13306:mysql8030.xserver.jp:3306 -N hirasyatyo@hirasyatyo.xsrv.jp
```

### 2. DB クライアントで接続

SSH トンネルが開いている状態で、DB クライアント（Sequel Ace 等）から以下の設定で接続:

| 項目 | 値 |
|---|---|
| Host | `127.0.0.1` |
| Port | `13306` |
| User | `hirasyatyo_lms` |
| Password | (別途管理) |
| Database | `hirasyatyo_lms` |

### 注意事項

- SSH 秘密鍵 (`~/.ssh/xserver_deploy`) がローカルに必要
- DB パスワードはリポジトリに含めないこと。パスワードマネージャー等で管理する
- トンネル接続を終了するには `Ctrl+C`

## デプロイ

### バックエンド (自動)

`main` ブランチに `backend/` 配下の変更を push すると GitHub Actions が自動デプロイ。

- ワークフロー: `.github/workflows/deploy-backend.yml`
- 手動実行: GitHub Actions タブ → "Deploy Backend to Xserver" → "Run workflow"

### フロントエンド (自動)

`main` ブランチへの push で Vercel が自動デプロイ。

## Xserver SSH 接続

```bash
ssh -p 10022 -i ~/.ssh/xserver_deploy hirasyatyo@hirasyatyo.xsrv.jp
```

Laravel のルートディレクトリ:

```
~/stage-site.net/public_html/api.stage-site.net/
```
