# コース編集画面 — プレビューボタン追加

## 概要

コース編集画面（`/admin/courses/[courseId]`）の上部バーに「プレビュー」ボタンを追加する。
プレビューからの「戻る」ボタンはコース編集画面に戻るようにする。

## ステータス

✅ 実装完了

## 背景・課題

- プレビューはコース管理ページ（`/admin/courses`）の各行からのみ行える
- コース編集中にプレビューしたい場合、一度コース管理ページに戻る必要がある

## UI 仕様

### ボタン配置

編集画面上部バーの「下書き」ステータス選択の左隣に追加。

```
[ コースタイトル（入力） ]  [目 プレビュー]  [ 下書き ▼ ]  [💾 保存]
```

### ボタンデザイン

Eye アイコン＋「プレビュー」テキスト。保存ボタンと同様のスタイル（アイコン＋テキスト）で統一する。
配色は保存ボタン（primary）と区別するためセカンダリスタイル（枠線付き）にする。


### 戻るボタンの動作

| 遷移元 | プレビューURL | 戻り先 |
|--------|------------|--------|
| コース管理ページ | `?preview=true` | `/admin/courses`（既存動作） |
| コース編集画面 | `?preview=true&from=editor` | `/admin/courses/{courseId}`（編集画面） |

`from=editor` は固定の文字列キー。URLを直接渡す方式ではなく、`editor` という値をトリガーに `lesson/[courseId]/page.tsx` 内で `backHref` の生成先を切り替える。
- `from === 'editor'` のとき → `backHref = /admin/courses/${courseId}`（URLパラメータの `courseId` を使って編集画面URLを構築）
- それ以外 → `backHref = /admin/courses`（既存動作）

## 変更ファイル一覧

| ファイル | 変更種別 | 内容 |
|---------|---------|------|
| `frontend/app/admin/(panel)/courses/[courseId]/CourseEditor.tsx` | 既存ファイルを修正 | プレビューボタンを追加 |
| `frontend/app/student/lesson/[courseId]/page.tsx` | 既存ファイルを修正 | `from=editor` のとき `backHref` を編集画面に変更 |

## 経過ログ

| 日付 | 内容 |
|------|------|
| 2026-05-01 | 設計完了。実装開始前 |
| 2026-05-01 | 実装完了 |
