# 本番環境デプロイガイド

Next.js (Vercel) + Laravel (Xserver) 構成の本番環境構築マニュアル。

---

## 全体構成

```
GitHub (main branch)
  ├─ CI: テスト (GitHub Actions)
  ├─ Backend CD:  rsync → Xserver (自動 / 手動)
  └─ Frontend CD: Vercel 自動デプロイ (GitHub連携)
```

| サービス | ホスティング | URL |
|---|---|---|
| フロントエンド (Next.js) | Vercel | `https://your-app.vercel.app` |
| バックエンド API (Laravel) | Xserver | `https://api.stage-site.net/api/v1` |
| データベース (MySQL 5.7) | Xserver | `mysql8030.xserver.jp` |

---

## 1. SSH鍵の作成

ローカルでデプロイ用のSSH鍵ペアを生成する。

```bash
ssh-keygen -t ed25519 -f ~/.ssh/xserver_deploy -C "github-actions-deploy" -N ""
```

- 秘密鍵: `~/.ssh/xserver_deploy` → GitHub Secrets に登録
- 公開鍵: `~/.ssh/xserver_deploy.pub` → Xserver に登録

---

## 2. Xserver 側の設定

### 2-1. SSH を有効化

サーバーパネル → 「SSH設定」→「ONにする」

- ポートは **10022**（Xserver 固定）

### 2-2. 公開鍵の登録

サーバーパネル → 「SSH設定」→「公開鍵登録・更新」

```bash
# 公開鍵の内容を確認してコピー
cat ~/.ssh/xserver_deploy.pub
```

### 2-3. SSH 接続確認

```bash
ssh -p 10022 -i ~/.ssh/xserver_deploy hirasyatyo@hirasyatyo.xsrv.jp
```

### 2-4. PHP バージョンの切り替え

サーバーパネル → 「PHP Ver.切替」→ 対象ドメインで **PHP 8.3** を選択。

> **注意: Web と SSH で PHP が別**
> サーバーパネルで切り替えるのは Apache (Web) 経由の PHP。
> SSH 経由で artisan コマンドを実行する場合はフルパス `/opt/php-8.3/bin/php` を使う必要がある。
> デフォルトの `php` コマンドは古いバージョン (5.4) を指しているため、そのまま使うとエラーになる。

### 2-5. API 用サブドメインの作成

サーバーパネル → 「サブドメイン設定」→ `api.stage-site.net` を追加。

作成されるディレクトリ:
```
/home/hirasyatyo/stage-site.net/public_html/api.stage-site.net/
```

> **メールへの影響なし**
> サブドメイン追加は A レコードの追加のみ。MX レコードには影響しないため、
> 既存のメール送受信には一切影響しない。

### 2-6. .htaccess の作成

サーバーパネル → 「.htaccess編集」で `api.stage-site.net` のドキュメントルートに作成:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

これにより全リクエストが Laravel の `public/` ディレクトリに転送される。

> **rsync で消える問題に注意**
> デプロイの `rsync --delete` はサーバー上の余分なファイルを削除する。
> `.htaccess` や `.env` は rsync の `--exclude` で除外設定済みだが、
> 初回はこの除外設定がないと消えるため注意。

### 2-7. MySQL データベースの作成

サーバーパネル → 「MySQL設定」:

1. 「MySQL追加」→ DB名: `hirasyatyo_lms`
2. 「MySQLユーザ追加」→ ユーザ名: `hirasyatyo_lms`、パスワード設定
3. 「MySQL一覧」→ 作成した DB にユーザのアクセス権を追加

MySQL ホスト名は「MySQL一覧」下部に記載されている（例: `mysql8030.xserver.jp`）。

> **ホスト名の違いに注意**
> - `sv8291.xserver.jp` → Web サーバーのホスト名（SSH 接続先）
> - `mysql8030.xserver.jp` → MySQL サーバーのホスト名（DB 接続先）
> この2つは別物。`.env` の `DB_HOST` には MySQL ホスト名を書く。

### 2-8. 国外アクセス制限の解除

サーバーパネル → 「WordPressセキュリティ設定」または該当する制限設定で、
SSH への国外アクセス制限を解除する。

> **GitHub Actions からの SSH 接続がブロックされる**
> Xserver はデフォルトで海外 IP からの SSH をブロックしている。
> GitHub Actions のランナーは海外 IP のため、この制限を解除しないと
> デプロイ時に `Connection closed` エラーになる。

---

## 3. GitHub Secrets の登録

リポジトリ → Settings → Secrets and variables → Actions → 「New repository secret」

| Secret | 値 | 取得方法 |
|---|---|---|
| `XSERVER_SSH_KEY` | SSH 秘密鍵の中身 | `cat ~/.ssh/xserver_deploy` |
| `XSERVER_SSH_HOST` | `hirasyatyo.xsrv.jp` | サーバーパネル「サーバー情報」 |
| `XSERVER_SSH_PORT` | `10022` | Xserver 固定 |
| `XSERVER_SSH_USER` | `hirasyatyo` | サーバーパネル上部のサーバーID |
| `XSERVER_SSH_KNOWN_HOSTS` | (未使用) | ワークフロー内で `ssh-keyscan` により自動取得 |
| `XSERVER_DEPLOY_PATH` | `/home/hirasyatyo/stage-site.net/public_html/api.stage-site.net` | サブドメインのパス |

> **`XSERVER_SSH_KNOWN_HOSTS` について**
> 当初は `ssh-keyscan` の出力を Secret に保存する方式だったが、
> 改行の処理問題で `Host key verification failed` が発生したため、
> ワークフロー内で動的に `ssh-keyscan` を実行する方式に変更した。

---

## 4. .env の配置（Xserver）

SSH で接続して `.env` を作成する。**rsync で上書きされないよう手動配置**。

```bash
ssh -p 10022 -i ~/.ssh/xserver_deploy hirasyatyo@hirasyatyo.xsrv.jp
vi ~/stage-site.net/public_html/api.stage-site.net/.env
```

```env
APP_NAME=LMS
APP_ENV=production
APP_KEY=base64:xxxxxxxxxx
APP_DEBUG=false
APP_URL=https://api.stage-site.net

DB_CONNECTION=mysql
DB_HOST=mysql8030.xserver.jp
DB_PORT=3306
DB_DATABASE=hirasyatyo_lms
DB_USERNAME=hirasyatyo_lms
DB_PASSWORD=設定したパスワード

SESSION_DRIVER=database
SESSION_LIFETIME=120
CACHE_STORE=database
QUEUE_CONNECTION=database

LOG_CHANNEL=daily
LOG_LEVEL=error

MAIL_MAILER=log

CORS_ALLOWED_ORIGINS=*
```

APP_KEY はローカルで生成:

```bash
cd backend && php artisan key:generate --show
```

> **DB パスワードに特殊文字が含まれる場合**
> `sed` コマンドで `.env` を編集すると `&`, `^`, `;` 等の文字で構文エラーになる。
> 特殊文字を含むパスワードは `vi` で直接編集すること。

---

## 5. 初回デプロイ

### 5-1. ワークフローを push

```bash
git add .github/workflows/deploy-backend.yml
git commit -m "ci: add Xserver backend deploy workflow"
git push origin main
```

- `backend/` に変更がなければデプロイジョブはスキップされる
- 手動実行: GitHub Actions タブ →「Deploy Backend to Xserver」→「Run workflow」

### 5-2. 初回マイグレーション

初回は `migrate:fresh` でテーブルを作成する（ワークフロー内で自動実行、または手動）:

```bash
ssh -p 10022 -i ~/.ssh/xserver_deploy hirasyatyo@hirasyatyo.xsrv.jp \
  "cd ~/stage-site.net/public_html/api.stage-site.net && /opt/php-8.3/bin/php artisan migrate:fresh --force"
```

> **MySQL 5.7 の互換性問題**
> `timestamp not null` カラムにデフォルト値がないとエラーになる。
> MySQL 8.0 では許容されるが、5.7 では `->useCurrent()` または
> `DEFAULT CURRENT_TIMESTAMP` の明示が必要。
> `ALTER TABLE ... MODIFY COLUMN` でも同様の制約がある。

### 5-3. シーダー実行

```bash
ssh -p 10022 -i ~/.ssh/xserver_deploy hirasyatyo@hirasyatyo.xsrv.jp \
  "cd ~/stage-site.net/public_html/api.stage-site.net && /opt/php-8.3/bin/php artisan db:seed --force"
```

### 5-4. storage ディレクトリの権限設定

```bash
ssh -p 10022 -i ~/.ssh/xserver_deploy hirasyatyo@hirasyatyo.xsrv.jp \
  "cd ~/stage-site.net/public_html/api.stage-site.net && chmod -R 775 storage bootstrap/cache && /opt/php-8.3/bin/php artisan storage:link"
```

---

## 6. Vercel（フロントエンド）の設定

### 6-1. プロジェクト作成

1. Vercel で GitHub リポジトリをインポート
2. **Framework Preset**: `Next.js` を選択
3. **Root Directory**: `frontend` を設定

> **Framework Preset が「Other」のまま変更できない場合**
> 初回インポート時に正しく設定しないと後から変更できないことがある。
> その場合はプロジェクトを削除して再インポートする。
> または Settings → Build & Development Settings から手動で設定する。

> **`output: 'standalone'` の問題**
> `next.config.ts` に `output: 'standalone'` があると Vercel で 404 になる。
> これは Docker 用の設定で、Vercel では不要。
> `process.env.VERCEL ? undefined : 'standalone'` で環境を分岐させる。

### 6-2. 環境変数の設定

Vercel ダッシュボード → Settings → Environment Variables:

| Key | Value |
|---|---|
| `BACKEND_URL` | `https://api.stage-site.net/api/v1` |

> **`/api/v1` まで必要**
> Laravel 側で `Route::prefix('v1')` を設定しているため、
> `https://api.stage-site.net/api` ではなく `/api/v1` まで含める。

### 6-3. デプロイ

`main` への push で自動デプロイ。手動の場合は Vercel ダッシュボードから Redeploy。

---

## 7. 本番データベースへの接続（DBクライアント）

Xserver の MySQL は外部から直接接続できないため、SSH トンネル経由で接続する。

### 7-1. SSH トンネルを開く

```bash
ssh -p 10022 -i ~/.ssh/xserver_deploy -L 13306:mysql8030.xserver.jp:3306 -N hirasyatyo@hirasyatyo.xsrv.jp
```

このコマンドはターミナルを占有する。終了は `Ctrl+C`。

### 7-2. DB クライアントで接続

**接続タイプ: Standard (TCP/IP)**（SSH タブではなく通常接続）

| 項目 | 値 |
|---|---|
| Host | `127.0.0.1` |
| Port | `13306` |
| User | `hirasyatyo_lms` |
| Password | (別途管理) |
| Database | `hirasyatyo_lms` |

> **Host が `127.0.0.1` の理由**
> SSH トンネルがローカルの 13306 番ポートを Xserver 経由で
> `mysql8030.xserver.jp:3306` に転送している。
> DB クライアントからは「ローカルに繋ぐ」だけでよい。
> `localhost` ではなく `127.0.0.1` を使うこと（ソケット接続を回避するため）。

---

## デプロイフロー（通常運用）

### バックエンド

`backend/` 配下を変更して `main` に push → GitHub Actions が自動で:

1. テスト実行
2. `composer install --no-dev` で依存関係をビルド
3. `rsync` で Xserver に転送（`.env`, `.htaccess`, `storage/` 等は除外）
4. `php artisan migrate --force` + キャッシュ生成

### フロントエンド

`main` に push → Vercel が自動デプロイ。

### 手動デプロイ（バックエンド）

GitHub Actions タブ →「Deploy Backend to Xserver」→「Run workflow」

---

## トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| `Host key verification failed` | known_hosts の不一致 | ワークフローで `ssh-keyscan` を動的実行に変更 |
| `Connection closed by ...` | Xserver の国外アクセス制限 | サーバーパネルで SSH の国外制限を解除 |
| `PHP 5.4.16 / Composer dropped support` | SSH の `php` が古いバージョン | `/opt/php-8.3/bin/php` をフルパスで指定 |
| `Your Composer dependencies require PHP >= 8.3.0` | Web の PHP バージョンが古い | サーバーパネルで PHP Ver. を 8.3 に切替 |
| `Invalid default value for 'submitted_at'` | MySQL 5.7 の timestamp 制約 | `->useCurrent()` / `DEFAULT CURRENT_TIMESTAMP` を付与 |
| Vercel で 404 | `output: 'standalone'` が有効 | Vercel 環境では undefined にする |
| Vercel で 404 | Framework Preset が Other | Next.js に変更、または再インポート |
| ログインで「サーバーに接続できません」 | `BACKEND_URL` 未設定 | Vercel 環境変数に設定して Redeploy |
| rsync 後に API 404 | `.htaccess` が rsync で削除された | rsync の `--exclude` に `.htaccess` を追加 |
| DB クライアントで接続できない | SSH トンネルが未起動 | トンネルコマンドを実行してから接続 |
