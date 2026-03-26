# Niigata AI Academy LMS

Next.js 15 App Router で構築された学習管理システム（LMS）のフロントエンドです。
現在はダミーデータで動作しており、バックエンドは Laravel で実装予定です。

## セットアップ

**前提条件:** Node.js 18+

```bash
npm install
npm run dev
```

http://localhost:3000 で起動します。

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（ポート3000） |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |

## 技術スタック

- **フレームワーク:** Next.js 15 (App Router)
- **言語:** TypeScript
- **スタイリング:** Tailwind CSS v4
- **アイコン:** Lucide React
- **フォント:** Inter, Plus Jakarta Sans, Noto Sans JP, Noto Serif JP

## ルーティング構成

### 受講者側

| パス | ページ |
|------|--------|
| `/` | ログイン |
| `/student/dashboard` | ホーム（学習中コース、進捗） |
| `/student/courses` | マイコース一覧 |
| `/student/lesson` | レッスン閲覧（動画＋テキスト） |
| `/student/lesson/quiz` | 理解度チェック＆課題 |
| `/student/settings` | 設定 |

### 管理者側

| パス | ページ |
|------|--------|
| `/admin` | 管理者ログイン |
| `/admin/dashboard` | ダッシュボード（KPI、未採点課題） |
| `/admin/users` | 受講者管理 |
| `/admin/courses` | コース管理 |
| `/admin/analytics` | 分析レポート |
| `/admin/settings` | 設定 |

## プロジェクト構成

```
app/
  page.tsx                          # 受講者ログイン
  layout.tsx                        # ルートレイアウト（フォント設定）
  globals.css                       # デザイントークン、ユーティリティ
  admin/
    page.tsx                        # 管理者ログイン
    (panel)/                        # DashboardLayout 適用
      layout.tsx
      dashboard/page.tsx
      users/page.tsx
      courses/page.tsx
      analytics/page.tsx
      settings/page.tsx
  student/
    lesson/                         # サイドバーなし（全画面レイアウト）
      page.tsx
      quiz/page.tsx
    (panel)/                        # DashboardLayout 適用
      layout.tsx
      dashboard/page.tsx
      courses/page.tsx
      settings/page.tsx
components/
  DashboardLayout.tsx               # サイドバー＋トップバー＋モバイルナビ
  LoginForm.tsx                     # ログインフォーム（受講者/管理者共用）
  KPICard.tsx                       # KPI カード
  ProgressBar.tsx                   # プログレスバー
lib/
  types.ts                          # 型定義
  mockData.ts                       # ダミーデータ
  api.ts                            # データ取得抽象化レイヤー
  navigation.ts                     # ナビゲーション設定
```

## データレイヤー

現在は `lib/mockData.ts` のダミーデータを `lib/api.ts` 経由で取得しています。
Laravel バックエンド接続時は `lib/api.ts` の各関数を API コールに差し替えるだけで移行できます。

## デザインシステム

Material Design 3 に準拠した色体系を `globals.css` の `@theme` ブロックで定義しています。

| トークン | 用途 |
|---------|------|
| `primary` | メインカラー（#0040a1） |
| `tertiary` | アクセントカラー（#822800） |
| `on-surface` | テキスト |
| `secondary` | サブテキスト |
| `surface-low` / `surface-high` | 背景バリエーション |
| `outline-variant` | ボーダー |
| `error` | エラー表示 |

カスタムユーティリティ: `primary-gradient`, `glass-panel`, `hairline-t`, `hairline-b`, `hide-scrollbar`
