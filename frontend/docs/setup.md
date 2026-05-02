# 開発環境構築手順

## 前提条件

- Docker Desktop がインストール・起動済みであること
- Node.js 18 以上がインストールされていること

---

## 1. バックエンド（Laravel + MySQL）

### 1-1. `.env` ファイルを作成

`backend/.env.example` はデフォルトが SQLite／production 設定のため、そのままでは使えない。
`backend/.env` を新規作成し、以下の内容を記述する。

```env
APP_NAME=LMS
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=ja
APP_FALLBACK_LOCALE=ja
APP_FAKER_LOCALE=ja_JP

LOG_CHANNEL=daily
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=lms
DB_USERNAME=lms_user
DB_PASSWORD=lms_password

SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
CACHE_STORE=file

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

> **注意:** `APP_ENV=local` にしないと `db:seed` が本番環境とみなされてキャンセルされる。

### 1-2. Docker を起動

```bash
cd backend
docker compose up -d
```

### 1-3. vendor ディレクトリを作成（初回のみ）

`docker-compose.yml` のボリュームマウント（`. → /var/www/html`）により、Docker ビルド時に作成された `vendor/` が上書きされる。
そのため、コンテナ起動後に手動で `composer install` を実行する必要がある。

```bash
docker compose exec app composer install
```

### 1-4. APP_KEY を生成

```bash
docker compose exec app php artisan key:generate
```

`backend/.env` の `APP_KEY=` に自動で書き込まれる。

### 1-5. コンテナを再起動

`.env` の変更を反映させるためにコンテナを再起動する。

```bash
docker compose restart app
```

再起動後、コンテナが自動で以下を実行する（`docker-compose.yml` の `command` で定義）：

1. MySQL の起動待機
2. `php artisan migrate --force` — テーブル作成
3. `php artisan db:seed` — 初期データ投入
4. `php artisan storage:link` — ストレージ公開
5. `php artisan serve` — APIサーバー起動

ログで確認：

```bash
docker compose logs -f app
# "Server running on [http://0.0.0.0:8000]" が出れば完了
```

### 1-6. シーダーが実行されなかった場合

`APP_ENV=production` のまま起動すると seed がキャンセルされる。
その場合は `--force` で手動実行する。

```bash
docker compose exec app php artisan db:seed --force
```

---

## 2. DBクライアントで接続確認

任意のDBクライアント（TablePlus / DBeaver / DataGrip 等）で以下の設定で接続する。

| 項目 | 値 |
|------|----|
| Host | `127.0.0.1` |
| Port | `3306` |
| Database | `lms` |
| User | `lms_user` |
| Password | `lms_password` |

`users`, `courses`, `lessons` などのテーブルとシードデータが確認できれば正常。

---

## 3. フロントエンド（Next.js）

### 3-1. `.env.local` ファイルを作成

`frontend/.env.local` を新規作成する。

```env
BACKEND_URL=http://localhost:8000/api/v1
```

`BACKEND_URL` のデフォルト値は `http://localhost:8000/api/v1`（`lib/config.ts` で定義）だが、明示しておくことを推奨。

### 3-2. 依存パッケージをインストール

```bash
cd frontend
npm install
```

### 3-3. 開発サーバーを起動

```bash
npm run dev
```

`http://localhost:3000` でフロントエンドが起動する。

---

## 4. 動作確認

### アクセス先

| URL | 内容 |
|-----|------|
| `http://localhost:3000` | 受講者ログイン画面 |
| `http://localhost:3000/admin` | 管理者ログイン画面 |
| `http://localhost:8000` | Laravel API サーバー |

### シードアカウント（パスワード共通: `password`）

| 役割 | メールアドレス | 氏名 |
|------|--------------|------|
| 管理者 | `yui.sato@example.com` | 佐藤 結衣 |
| 受講者 | `kenta.tanaka@example.com` | 田中 健太 |
| 受講者 | `misaki.suzuki@example.com` | 鈴木 美咲 |
| 受講者 | `daisuke.takahashi@example.com` | 高橋 大輔 |
| 受講者 | `sakura.watanabe@example.com` | 渡辺 さくら |
| 受講者 | `makoto.ito@example.com` | 伊藤 誠 |

---

## トラブルシューティング

### `vendor/autoload.php: No such file or directory`

ボリュームマウントで `vendor/` が消えている。コンテナ内で `composer install` を実行する。

```bash
docker compose exec app composer install
```

### `APP_KEY` が空で 500 エラー

`php artisan key:generate` を実行していないか、`.env` への反映後にコンテナを再起動していない。

```bash
docker compose exec app php artisan key:generate
docker compose restart app
```

### `db:seed` が "Command cancelled" になる

`.env` の `APP_ENV=production` が原因。`APP_ENV=local` に変更してコンテナを再起動するか、`--force` で手動実行する。

```bash
docker compose exec app php artisan db:seed --force
```

### CORS エラー（フロントエンドからAPIが叩けない）

`backend/.env` に `CORS_ALLOWED_ORIGINS=http://localhost:3000` が設定されているか確認する。
