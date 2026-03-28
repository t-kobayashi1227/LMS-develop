# Niigata AI Academy LMS — データベース設計書

## 概要

Laravel バックエンド用のデータベーススキーマ設計。フロントエンド（Next.js 15）で実装済みの全機能を網羅する。

- **RDBMS:** MySQL 8.0+（Xserver 対応）
- **規約:** Laravel 準拠（snake_case、timestamps、soft deletes）
- **主キー:** BIGINT UNSIGNED AUTO_INCREMENT（内部用）+ CHAR(36) UUID（API公開用、アプリ側で生成）
- **文字セット:** utf8mb4 / utf8mb4_unicode_ci（日本語対応）

---

## ER図

```
users
  ├──< enrollments >──┐
  ├──< lesson_progress >──< lessons >──< chapters >──< courses >── course_categories
  ├──< assignment_submissions >──< assignments ──┘        │
  ├──< quiz_answers >──< quiz_questions ──< lessons       │
  ├──< messages (sender/recipient)                        │
  ├──< activity_logs                                      │
  └──< course_ratings >───────────────────────────────────┘
                                                    lessons >──< lesson_resources
```

**カーディナリティ:**
- User 1:N Enrollments, Enrollment N:1 Course（多対多）
- Course 1:N Chapters 1:N Lessons
- Lesson 1:N LessonProgress（受講者×レッスン）
- Lesson 1:N Assignments 1:N AssignmentSubmissions
- Lesson 1:N QuizQuestions 1:N QuizAnswers
- Lesson 1:N LessonResources
- User 1:N Messages（送信者/受信者）
- User 1:N ActivityLogs

---

## テーブル定義

### 1. `users`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | API公開用。Laravel `Str::uuid()` で生成 |
| name | VARCHAR(255) | NOT NULL | 表示名 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | ログイン用 |
| email_verified_at | TIMESTAMP | NULLABLE | |
| password | VARCHAR(255) | NOT NULL | bcryptハッシュ |
| role | ENUM('student', 'admin') | NOT NULL, DEFAULT 'student' | |
| avatar_path | VARCHAR(500) | NULLABLE | ストレージ相対パス |
| last_active_at | TIMESTAMP | NULLABLE | 認証リクエスト毎に更新 |
| remember_token | VARCHAR(100) | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |
| deleted_at | TIMESTAMP | NULLABLE | ソフトデリート |

**インデックス:**
- `UNIQUE(email)`
- `INDEX(role)`
- `INDEX(last_active_at)` — アクティブ/非アクティブ判定、MAU集計
- `INDEX(deleted_at)`

**受講者ステータスの導出:** フロントエンドの `active` / `inactive` は保存しない。`last_active_at >= NOW() - INTERVAL 2 DAY` で動的に判定する。

---

### 2. `course_categories`

| カラム | 型 | 制約 |
|--------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| uuid | CHAR(36) | UNIQUE, NOT NULL |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| slug | VARCHAR(100) | UNIQUE, NOT NULL |
| sort_order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

**シードデータ:** AI Basics, AI Applications, Design, Marketing

---

### 3. `courses`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| course_category_id | BIGINT UNSIGNED | FK → course_categories.id, NOT NULL | |
| title | VARCHAR(500) | NOT NULL | |
| slug | VARCHAR(500) | UNIQUE, NOT NULL | URL用 |
| description | TEXT | NULLABLE | |
| thumbnail_path | VARCHAR(500) | NULLABLE | |
| status | ENUM('draft', 'published', 'archived') | NOT NULL, DEFAULT 'draft' | |
| published_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |
| deleted_at | TIMESTAMP | NULLABLE | |

**インデックス:**
- `INDEX(course_category_id)`
- `INDEX idx_courses_status_category(status, course_category_id)` — カテゴリ別公開コース一覧
- `INDEX(deleted_at)`

**導出フィールド（保存しない）:**
- `totalLessons` — `COUNT(lessons)` JOIN chapters
- `studentCount` — `COUNT(enrollments)`

---

### 4. `chapters`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| course_id | BIGINT UNSIGNED | FK → courses.id, CASCADE | |
| title | VARCHAR(500) | NOT NULL | 例: "セクション 1: 基礎理論" |
| sort_order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

**インデックス:**
- `INDEX(course_id, sort_order)`

---

### 5. `lessons`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| chapter_id | BIGINT UNSIGNED | FK → chapters.id, CASCADE | |
| title | VARCHAR(500) | NOT NULL | |
| type | ENUM('video', 'text', 'assignment') | NOT NULL | フロントエンド型と一致 |
| has_video | TINYINT(1) | NOT NULL, DEFAULT 0 | 動画+テキスト混在は type='text' + has_video=1 で表現 |
| duration_seconds | INT UNSIGNED | NULLABLE | 動画秒数 or 推定読了秒数 |
| content_body | LONGTEXT | NULLABLE | HTML/Markdown |
| video_url | VARCHAR(1000) | NULLABLE | |
| sort_order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 | |
| is_free_preview | TINYINT(1) | NOT NULL, DEFAULT 0 | 将来: 未登録でもプレビュー可 |
| prerequisite_lesson_id | BIGINT UNSIGNED | FK → lessons.id, SET NULL, NULLABLE | 自己参照。NULLなら前提なし |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |
| deleted_at | TIMESTAMP | NULLABLE | |

**インデックス:**
- `INDEX(chapter_id, sort_order)`
- `INDEX(prerequisite_lesson_id)`
- `INDEX(deleted_at)`

**`type` と `has_video` の使い分け:** フロントエンドの `Lesson.type` は `'video' | 'text' | 'assignment'` の3値。レッスンページは動画＋テキストが混在するため、`type='text'` かつ `has_video=1` で「動画付きテキストレッスン」を表現する。APIはフロントに返す際に `has_video` を参照して動画URLを含めるかを判定する。

**ロック判定ロジック:** `prerequisite_lesson_id IS NOT NULL` かつ、そのレッスンの `lesson_progress.completed_at IS NULL` であればロック。クエリ時に動的に計算する。

---

### 6. `enrollments`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| user_id | BIGINT UNSIGNED | FK → users.id, CASCADE | |
| course_id | BIGINT UNSIGNED | FK → courses.id, CASCADE | |
| enrolled_at | TIMESTAMP | NOT NULL | |
| completed_at | TIMESTAMP | NULLABLE | 全レッスン完了時に設定 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |
**インデックス:**
- `UNIQUE(user_id, course_id)` — 1受講者1コースにつき1登録（下記「再受講の設計」参照）
- `INDEX(course_id)` — コース別受講者数
- `INDEX(user_id)` — 受講者のコース一覧
- `INDEX(completed_at)` — 修了率集計

**再受講の設計:** MySQL 8.0 の UNIQUE 制約は NULL を複数許可するため、`deleted_at` を含めた複合ユニークでは重複を防げない。そのため以下の方式を採用する:

1. `UNIQUE(user_id, course_id)` を通常のユニーク制約として設定
2. 退会時はソフトデリートではなく、**旧 enrollment と関連データを物理削除**する
3. 物理削除前に、関連する `lesson_progress`, `assignment_submissions`, `quiz_answers` を各アーカイブテーブルに退避して学習履歴を保全
4. 再受講時は新しい enrollment 行を INSERT し、全データがゼロからスタート

```php
// App\Services\EnrollmentService
public function unenroll(Enrollment $enrollment): void
{
    DB::transaction(function () use ($enrollment) {
        $userId = $enrollment->user_id;
        $courseId = $enrollment->course_id;
        $now = now();

        // ---- ヘルパー: 全カラムを JSON でアーカイブ ----
        $archive = function (string $tableName, Collection $records) use ($enrollment, $userId, $courseId, $now) {
            $rows = $records->map(fn ($record) => [
                'original_enrollment_id' => $enrollment->id,
                'user_id' => $userId,
                'course_id' => $courseId,
                'table_name' => $tableName,
                'record_id' => $record->id,
                'data' => $record->toJson(), // 全カラムを保存
                'archived_at' => $now,
            ])->all();
            if (!empty($rows)) {
                DB::table('enrollment_archive')->insert($rows);
            }
        };

        // 1. lesson_progress をアーカイブ → CASCADE で自動削除されるため手動削除不要
        $archive('lesson_progress',
            LessonProgress::where('enrollment_id', $enrollment->id)->get());

        // 2. assignment_submissions をアーカイブ → 手動削除
        $assignmentIds = Assignment::where('course_id', $courseId)->pluck('id');
        $submissions = AssignmentSubmission::where('user_id', $userId)
            ->whereIn('assignment_id', $assignmentIds)->get();
        $archive('assignment_submissions', $submissions);
        AssignmentSubmission::whereIn('id', $submissions->pluck('id'))->delete();

        // 3. quiz_answers をアーカイブ → 手動削除
        $lessonIds = Lesson::whereIn('chapter_id',
            Chapter::where('course_id', $courseId)->pluck('id')
        )->pluck('id');
        $questionIds = QuizQuestion::whereIn('lesson_id', $lessonIds)->pluck('id');
        $answers = QuizAnswer::where('user_id', $userId)
            ->whereIn('quiz_question_id', $questionIds)->get();
        $archive('quiz_answers', $answers);
        QuizAnswer::whereIn('id', $answers->pluck('id'))->delete();

        // 4. enrollment を物理削除（FK CASCADE で lesson_progress も削除）
        $enrollment->forceDelete();
    });
}
```

> **注意:** enrollments テーブルはソフトデリートを使用しない。`deleted_at` カラムは不要なため削除する。

---

### 7. `lesson_progress`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| enrollment_id | BIGINT UNSIGNED | FK → enrollments.id, CASCADE, NOT NULL | 主たる所属。user/course は enrollment から導出 |
| lesson_id | BIGINT UNSIGNED | FK → lessons.id, CASCADE, NOT NULL | |
| started_at | TIMESTAMP | NULLABLE | |
| completed_at | TIMESTAMP | NULLABLE | |
| video_position_seconds | INT UNSIGNED | NULLABLE | 動画再開位置 |
| time_spent_seconds | INT UNSIGNED | NOT NULL, DEFAULT 0 | 累計学習時間 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

**インデックス:**
- `UNIQUE(enrollment_id, lesson_id)` — 1登録×1レッスンにつき1レコード
- `INDEX(lesson_id, completed_at)` — レッスン別完了者数

**整合性の設計:** `enrollment_id` を主軸とし、user/course の整合性は enrollment テーブル側で保証する。進捗集計は `GROUP BY enrollment_id` + `SUM(completed_at IS NOT NULL)` で完了数を取得（MySQL では `completed_at IS NOT NULL` が 0/1 を返すため `SUM` で正しくカウントされる。`COUNT` は 0 も非NULLとして数えるため使用不可）。user_id が必要な場合は `JOIN enrollments e ON e.id = lp.enrollment_id` で取得する。

**アプリ層バリデーション:** lesson が enrollment のコースに属することを Laravel の `LessonProgress::creating` オブザーバーで検証する。

---

### 8. `assignments`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| lesson_id | BIGINT UNSIGNED | FK → lessons.id, SET NULL, NULLABLE | NULLならコースレベル課題 |
| course_id | BIGINT UNSIGNED | FK → courses.id, CASCADE | 常に設定（集計用） |
| title | VARCHAR(500) | NOT NULL | |
| description | TEXT | NULLABLE | 課題条件・説明 |
| due_date | TIMESTAMP | NULLABLE | |
| max_score | DECIMAL(5,2) | NULLABLE | NULLなら合否判定のみ |
| sort_order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |
| deleted_at | TIMESTAMP | NULLABLE | |

**インデックス:**
- `INDEX(lesson_id)`
- `INDEX(course_id)`
- `INDEX(due_date)`

---

### 9. `assignment_submissions`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| assignment_id | BIGINT UNSIGNED | FK → assignments.id, CASCADE | |
| user_id | BIGINT UNSIGNED | FK → users.id, CASCADE | |
| content | TEXT | NULLABLE | テキスト回答 |
| file_path | VARCHAR(500) | NULLABLE | アップロードファイル |
| file_original_name | VARCHAR(255) | NULLABLE | 元ファイル名 |
| status | ENUM('submitted', 'graded') | NOT NULL, DEFAULT 'submitted' | |
| score | DECIMAL(5,2) | NULLABLE | 採点後に設定 |
| graded_by | BIGINT UNSIGNED | FK → users.id, SET NULL, NULLABLE | 採点者 |
| graded_at | TIMESTAMP | NULLABLE | |
| feedback | TEXT | NULLABLE | 採点フィードバック |
| submitted_at | TIMESTAMP | NOT NULL | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

**インデックス:**
- `UNIQUE(assignment_id, user_id)` — 再提出は上書き
- `INDEX(user_id)`
- `INDEX(status)` — 未採点課題KPI: `WHERE status = 'submitted'`
- `INDEX(submitted_at)` — 最新提出一覧

**`status` の導出ルール:**
- フロントエンドの `Assignment.status` は `'pending' | 'submitted' | 'graded'` の3値
- `pending` はDBに行が存在しないことで表現する（受講者がまだ提出していない状態）
- `submitted` / `graded` は `assignment_submissions.status` に対応
- APIは assignment 一覧を返す際、その受講者の submission が存在するかを LEFT JOIN で確認し、存在しなければ `pending`、存在すれば submission の `status` をそのまま返す

```sql
SELECT
  a.*,
  COALESCE(s.status, 'pending') AS student_status
FROM assignments a
LEFT JOIN assignment_submissions s
  ON s.assignment_id = a.id AND s.user_id = :user_id
WHERE a.course_id = :course_id AND a.deleted_at IS NULL;
```

---

### 10. `quiz_questions`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| lesson_id | BIGINT UNSIGNED | FK → lessons.id, CASCADE | |
| type | ENUM('choice', 'text') | NOT NULL | 選択式 or 記述式 |
| question_text | TEXT | NOT NULL | |
| options | JSON | NULLABLE | choice型: `["選択肢1", "選択肢2", "選択肢3"]` |
| correct_option_index | SMALLINT UNSIGNED | NULLABLE | choice型: 正解のインデックス（0始まり） |
| conditions | JSON | NULLABLE | text型: 表示条件 `["ターゲット：新入社員", ...]` |
| sort_order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

**インデックス:**
- `INDEX(lesson_id, sort_order)`

---

### 11. `quiz_answers`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| quiz_question_id | BIGINT UNSIGNED | FK → quiz_questions.id, CASCADE | |
| user_id | BIGINT UNSIGNED | FK → users.id, CASCADE | |
| selected_option_index | SMALLINT UNSIGNED | NULLABLE | choice型の回答 |
| answer_text | TEXT | NULLABLE | text型の回答 |
| is_correct | TINYINT(1) | NULLABLE | choice型は自動判定、text型はNULL（手動採点） |
| graded_by | BIGINT UNSIGNED | FK → users.id, SET NULL, NULLABLE | |
| graded_at | TIMESTAMP | NULLABLE | |
| feedback | TEXT | NULLABLE | |
| submitted_at | TIMESTAMP | NOT NULL | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

**インデックス:**
- `UNIQUE(quiz_question_id, user_id)` — 1受講者1問につき1回答
- `INDEX(user_id)`

---

### 12. `messages`（将来フェーズ）

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| sender_id | BIGINT UNSIGNED | FK → users.id, SET NULL, NULLABLE | NULLならシステムメッセージ |
| recipient_id | BIGINT UNSIGNED | FK → users.id, CASCADE | |
| type | ENUM('direct', 'feedback', 'system') | NOT NULL | |
| content | TEXT | NOT NULL | |
| is_read | TINYINT(1) | NOT NULL, DEFAULT 0 | |
| read_at | TIMESTAMP | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |
| deleted_at | TIMESTAMP | NULLABLE | |

**インデックス:**
- `INDEX(recipient_id, is_read, created_at)` — 受信箱: 未読優先+日時順
- `INDEX(sender_id)`
- `INDEX(type)`

**システムメッセージの DTO 変換:** `sender_id IS NULL` の場合、APIは以下の固定値でフロントエンドの `Message` 型を満たす:

```json
{
  "senderId": "system",
  "senderName": "AI 学習アシスタント",
  "senderAvatar": "/default-avatar.svg"
}
```

この変換は Laravel の `MessageResource`（API Resource）で実装する。

---

### 13. `lesson_resources`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| uuid | CHAR(36) | UNIQUE, NOT NULL | |
| lesson_id | BIGINT UNSIGNED | FK → lessons.id, CASCADE | |
| title | VARCHAR(255) | NOT NULL | 例: "プロンプトテンプレート集" |
| file_path | VARCHAR(500) | NOT NULL | |
| file_original_name | VARCHAR(255) | NOT NULL | |
| file_size_bytes | INT UNSIGNED | NULLABLE | |
| mime_type | VARCHAR(100) | NULLABLE | |
| sort_order | SMALLINT UNSIGNED | NOT NULL, DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

**インデックス:**
- `INDEX(lesson_id, sort_order)`

---

### 14. `enrollment_archive`

退会（コース登録解除）時に削除されるデータの履歴保全用テーブル。`lesson_progress`, `assignment_submissions`, `quiz_answers` の全データを JSON で保存する。

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| original_enrollment_id | BIGINT UNSIGNED | NOT NULL | 削除された enrollment の元ID（FKなし、参照先は既に削除済み）|
| user_id | BIGINT UNSIGNED | NOT NULL | 退会した受講者（FKなし、ユーザー削除後も保持）|
| course_id | BIGINT UNSIGNED | NOT NULL | 対象コース（FKなし、コース削除後も保持）|
| table_name | VARCHAR(50) | NOT NULL | 元テーブル名: 'lesson_progress', 'assignment_submissions', 'quiz_answers' |
| record_id | BIGINT UNSIGNED | NOT NULL | 元テーブルでの主キー |
| data | JSON | NOT NULL | 元レコードの全カラムを JSON で保存 |
| archived_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |

**インデックス:**
- `INDEX(user_id, course_id)` — ユーザー×コースの履歴検索
- `INDEX(original_enrollment_id)` — enrollment 単位の履歴検索
- `INDEX(table_name, archived_at)` — テーブル別の時系列検索

**設計方針:**
- 外部キーを持たない（参照先が物理削除されるため）
- 運用データとは分離し、パフォーマンスに影響を与えない
- 管理者が過去の学習履歴を参照する際に使用
- データ保持期間はビジネス要件に応じて定期パージ可能

---

### 15. `activity_logs`

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| user_id | BIGINT UNSIGNED | FK → users.id, SET NULL, NULLABLE | |
| type | ENUM('complete', 'submit', 'enroll', 'warning', 'login') | NOT NULL | フロント表示用4値 + MAU集計用 login |
| subject_type | VARCHAR(255) | NULLABLE | Laravelポリモーフィック |
| subject_id | BIGINT UNSIGNED | NULLABLE | |
| description | TEXT | NOT NULL | 人間可読な日本語テキスト |
| metadata | JSON | NULLABLE | 追加コンテキスト |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |

**`updated_at` なし** — 監査ログは不変。ソフトデリートもなし。

**インデックス:**
- `INDEX(user_id, created_at)` — ユーザー別アクティビティ
- `INDEX(type, created_at)` — タイプ別フィルタ
- `INDEX(created_at)` — 時系列一覧
- `INDEX(subject_type, subject_id)` — ポリモーフィック検索

**`type` のフロント整合性:** ENUM値は5種類。うち `'complete' | 'submit' | 'enroll' | 'warning'` の4値がフロントエンド `ActivityType` と一致する。`'login'` はMAU集計専用でフロントに返さない。APIの「最近のアクティビティ」エンドポイントでは `WHERE type != 'login'` でフィルタする。将来 type を拡張する場合は、フロントの `ActivityType` と `activityDotColor` マップも同時に更新すること。

**login イベントの記録:** Laravel の認証ミドルウェアまたは `Login` イベントリスナーで、認証成功時に `type='login'` の activity_log を記録する。これによりMAU集計が「ログインのみの受講者」も正しくカウントする。

---

### 16. `course_ratings`（将来対応）

| カラム | 型 | 制約 | 備考 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| course_id | BIGINT UNSIGNED | FK → courses.id, CASCADE | |
| user_id | BIGINT UNSIGNED | FK → users.id, CASCADE | |
| rating | DECIMAL(2,1) | NOT NULL | 1.0〜5.0 |
| review_text | TEXT | NULLABLE | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | |

**インデックス:**
- `UNIQUE(course_id, user_id)` — 1受講者1コースにつき1評価
- `INDEX(course_id)` — コース平均評価

---

## 外部キー制約と削除方針

| テーブル | FK | 参照先 | ON DELETE |
|---------|-----|--------|----------|
| courses | course_category_id | course_categories | RESTRICT |
| chapters | course_id | courses | CASCADE |
| lessons | chapter_id | chapters | CASCADE |
| lessons | prerequisite_lesson_id | lessons | SET NULL |
| enrollments | user_id | users | CASCADE |
| enrollments | course_id | courses | CASCADE |
| lesson_progress | enrollment_id | enrollments | CASCADE |
| lesson_progress | lesson_id | lessons | CASCADE |
| assignments | lesson_id | lessons | SET NULL |
| assignments | course_id | courses | CASCADE |
| assignment_submissions | assignment_id | assignments | CASCADE |
| assignment_submissions | user_id | users | CASCADE |
| assignment_submissions | graded_by | users | SET NULL |
| quiz_questions | lesson_id | lessons | CASCADE |
| quiz_answers | quiz_question_id | quiz_questions | CASCADE |
| quiz_answers | user_id | users | CASCADE |
| quiz_answers | graded_by | users | SET NULL |
| messages | sender_id | users | SET NULL |
| messages | recipient_id | users | CASCADE |
| lesson_resources | lesson_id | lessons | CASCADE |
| activity_logs | user_id | users | SET NULL |
| course_ratings | course_id | courses | CASCADE |
| course_ratings | user_id | users | CASCADE |

**方針:**
- **CASCADE** — 親削除時に子も削除（コース→章→レッスン→進捗等）
- **SET NULL** — 参照元を残す（採点者、メッセージ送信者、前提レッスン）
- **RESTRICT** — カテゴリはコースが存在する限り削除不可
- **ソフトデリート対象:** users, courses, lessons, assignments, messages（enrollments はソフトデリート不使用、物理削除+アーカイブ方式）

---

## 主要クエリパターン

全クエリは MySQL 8.0+ 構文で統一。

### コース進捗率（受講者×コース）

```sql
SELECT
  e.id AS enrollment_id,
  COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) AS completed,
  COUNT(DISTINCT l.id) AS total,
  ROUND(
    COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) * 100.0
    / NULLIF(COUNT(DISTINCT l.id), 0), 0
  ) AS progress_pct
FROM enrollments e
JOIN chapters ch ON ch.course_id = e.course_id
JOIN lessons l ON l.chapter_id = ch.id AND l.deleted_at IS NULL
LEFT JOIN lesson_progress lp
  ON lp.lesson_id = l.id AND lp.enrollment_id = e.id
WHERE e.user_id = :user_id AND e.course_id = :course_id GROUP BY e.id;
```

### 管理者KPI

```sql
-- アクティブ受講者数
SELECT COUNT(*) FROM users
WHERE role = 'student' AND deleted_at IS NULL
  AND last_active_at >= NOW() - INTERVAL 30 DAY;

-- 公開コース数
SELECT COUNT(*) FROM courses
WHERE status = 'published' AND deleted_at IS NULL;

-- 未採点課題数
SELECT COUNT(*) FROM assignment_submissions
WHERE status = 'submitted';

-- 平均修了率
SELECT ROUND(AVG(
  CASE WHEN e.completed_at IS NOT NULL THEN 100.0
  ELSE (
    SELECT COUNT(*) FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id AND l.deleted_at IS NULL
    WHERE lp.enrollment_id = e.id AND lp.completed_at IS NOT NULL
  ) * 100.0 / NULLIF((
    SELECT COUNT(*) FROM lessons l
    JOIN chapters ch ON ch.id = l.chapter_id
    WHERE ch.course_id = e.course_id AND l.deleted_at IS NULL
  ), 0)
  END
), 0) AS avg_completion
FROM enrollments e;
```

### 月別アクティブ受講者数（分析チャート）

```sql
SELECT
  DATE_FORMAT(al.created_at, '%Y-%m') AS month,
  COUNT(DISTINCT al.user_id) AS active_students
FROM activity_logs al
JOIN users u ON u.id = al.user_id AND u.role = 'student' AND u.deleted_at IS NULL
WHERE al.created_at >= NOW() - INTERVAL 6 MONTH
  AND al.type IN ('login', 'complete', 'submit', 'enroll')
GROUP BY DATE_FORMAT(al.created_at, '%Y-%m')
ORDER BY month;
```

> **warning 除外の理由:** `warning` はシステムが自動生成するイベント（例: 3日間未ログイン警告）であり、ユーザーの実活動ではない。MAUには `login`（ログイン）, `complete`（レッスン完了）, `submit`（課題提出）, `enroll`（コース登録）のみをカウントする。

### コース別パフォーマンス

```sql
SELECT
  c.id,
  c.title,
  COUNT(DISTINCT e.user_id) AS students,
  ROUND(AVG(sub.progress), 0) AS avg_progress,
  ROUND(
    SUM(CASE WHEN e.completed_at IS NOT NULL THEN 1 ELSE 0 END) * 100.0
    / NULLIF(COUNT(e.id), 0), 0
  ) AS completion_rate,
  COALESCE(ROUND(AVG(cr.rating), 1), 0) AS satisfaction
FROM courses c
LEFT JOIN enrollments e ON e.course_id = c.id
LEFT JOIN (
  -- 分母はコースの全レッスン数（lesson_progress有無に関わらず）
  SELECT
    e2.id AS enrollment_id,
    ROUND(
      COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) * 100.0
      / NULLIF(COUNT(DISTINCT l.id), 0), 0
    ) AS progress
  FROM enrollments e2
  JOIN chapters ch ON ch.course_id = e2.course_id
  JOIN lessons l ON l.chapter_id = ch.id AND l.deleted_at IS NULL
  LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.enrollment_id = e2.id
  GROUP BY e2.id
) sub ON sub.enrollment_id = e.id
LEFT JOIN course_ratings cr ON cr.course_id = c.id
WHERE c.status = 'published' AND c.deleted_at IS NULL
GROUP BY c.id, c.title;
```

> **分母の設計:** サブクエリは `chapters → lessons` を起点にして全レッスンを `COUNT(DISTINCT l.id)` で数える。`lesson_progress` は LEFT JOIN のため、進捗行が存在しないレッスンも分母に含まれる。これにより「10レッスン中1件完了 = 10%」と正しく計算される。

### レッスンのロック判定

```sql
SELECT
  l.*,
  CASE
    WHEN l.prerequisite_lesson_id IS NULL THEN 0
    WHEN EXISTS (
      SELECT 1 FROM lesson_progress lp
      WHERE lp.lesson_id = l.prerequisite_lesson_id
        AND lp.enrollment_id = :enrollment_id
        AND lp.completed_at IS NOT NULL
    ) THEN 0
    ELSE 1
  END AS is_locked
FROM lessons l
JOIN chapters ch ON ch.id = l.chapter_id
WHERE ch.course_id = :course_id AND l.deleted_at IS NULL
ORDER BY ch.sort_order, l.sort_order;
```

### 総学習時間

```sql
SELECT ROUND(SUM(time_spent_seconds) / 3600.0, 0) AS total_hours
FROM lesson_progress;
```

### 課題ステータス導出

```sql
SELECT
  a.*,
  COALESCE(s.status, 'pending') AS student_status
FROM assignments a
LEFT JOIN assignment_submissions s
  ON s.assignment_id = a.id AND s.user_id = :user_id
WHERE a.course_id = :course_id AND a.deleted_at IS NULL
ORDER BY a.sort_order;
```

---

## Laravelマイグレーション順序

依存関係に基づく実行順序:

```
01 create_users_table
02 create_course_categories_table
03 create_courses_table
04 create_chapters_table
05 create_lessons_table
06 create_enrollments_table
07 create_lesson_progress_table
08 create_assignments_table
09 create_assignment_submissions_table
10 create_quiz_questions_table
11 create_quiz_answers_table
12 create_messages_table
13 create_lesson_resources_table
14 create_enrollment_archive_table
15 create_activity_logs_table
16 create_course_ratings_table
```

各マイグレーションは前のマイグレーションで作成されたテーブルのみを参照する。`lessons.prerequisite_lesson_id` の自己参照FKは `create_lessons_table` 内で定義可能。

---

## エッジケース対応方針

### レッスン削除時の進捗データ

レッスンはソフトデリート。`lesson_progress` は残る。進捗率計算では `WHERE l.deleted_at IS NULL` で削除済みレッスンを分母・分子から除外。受講者の進捗率が自動的に上昇する可能性があるが、これは意図した動作。

### コース完了後のレッスン追加

`enrollments.completed_at` はLaravelモデルオブザーバーで管理。レッスン追加時に、そのコースの `completed_at IS NOT NULL` の enrollment を `completed_at = NULL` にリセットするオブザーバーを実装する。

### 退会後の再受講

`enrollments` は `UNIQUE(user_id, course_id)` のユニーク制約を持ち、ソフトデリートは使用しない。退会時は旧 enrollment と関連する全データ（`lesson_progress`, `assignment_submissions`, `quiz_answers`）を `enrollment_archive` テーブルに JSON 退避した後、物理削除する。再受講時は新しい enrollment 行を INSERT し、進捗・課題・クイズすべてゼロからスタートする。詳細は enrollments テーブル定義の「再受講の設計」セクションを参照。

### 月別アクティブユーザー（MAU）

`users.last_active_at` は上書きされるため履歴がない。MAUは `activity_logs` テーブルから `COUNT(DISTINCT user_id)` で集計する。`type='login'` のログを認証成功時に記録することで、ログインのみの受講者（学習アクションなし）もMAUにカウントされる。

### 満足度評価

`course_ratings` テーブルが空の場合、APIはデフォルト値（0 or NULL）を返す。フロントエンドの `satisfaction: 4.8` は将来的にこのテーブルの `AVG(rating)` に置換される。

### 総学習時間KPI（1,240h）

`SUM(lesson_progress.time_spent_seconds)` を秒→時間変換。`time_spent_seconds` はフロントエンドがレッスンページ滞在時間をAPIに送信して加算する方式を想定。

---

## DB → フロントエンド DTO 変換境界

DBスキーマとフロントエンドの型は1:1対応しない。Laravel の API Resource クラスで変換する。

| フロントエンド型 (lib/types.ts) | 主テーブル | API Resource での変換内容 |
|-------------------------------|-----------|--------------------------|
| `User` | users | `avatar_path` → Storage URL に変換 |
| `Course` | courses + enrollments | `progress`, `completedLessons`, `studentCount` を集計クエリで導出 |
| `Lesson` | lessons | `isCompleted` = lesson_progress.completed_at IS NOT NULL, `isLocked` = ロック判定クエリ, `type` はDB値をそのまま返す |
| `Student` | users + enrollments | `enrolledCourses` = COUNT(enrollments), `progress` = AVG(enrollment進捗), `lastActive` = last_active_at の相対時間変換, `status` = last_active_at から導出 |
| `Assignment` | assignments + assignment_submissions | `status` = submission 存在しなければ 'pending'、存在すれば submission.status |
| `Message` | messages + users | `senderName`, `senderAvatar` は JOIN。sender_id IS NULL の場合は固定値（"AI 学習アシスタント"）|
| `MonthlyData` | activity_logs (集計) | DATE_FORMAT + COUNT DISTINCT で導出 |
| `CoursePerformance` | courses + enrollments + course_ratings (集計) | 集計クエリで導出 |
| `RecentActivity` | activity_logs | `type` は4値のみ返す（フロント ActivityType と一致） |
