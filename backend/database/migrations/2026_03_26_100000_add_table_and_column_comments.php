<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // コメントは MySQL 固有機能のため、MySQL 以外ではスキップ
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        // ── テーブルコメント ──────────────────────────────────
        $tables = [
            'users' => 'ユーザー（受講者・管理者）',
            'course_categories' => 'コースカテゴリ（AI Writing, Data Science 等）',
            'courses' => 'コース',
            'chapters' => 'コース内の章（セクション）',
            'lessons' => 'レッスン（動画・テキスト・課題）',
            'enrollments' => 'コース登録（受講者×コース）',
            'lesson_progress' => 'レッスン進捗（受講者×レッスン）',
            'assignments' => '課題',
            'assignment_submissions' => '課題提出',
            'quiz_questions' => 'クイズ問題（選択式・記述式）',
            'quiz_answers' => 'クイズ回答',
            'messages' => 'メッセージ（DM・フィードバック・システム通知）',
            'lesson_resources' => 'レッスン添付資料',
            'enrollment_archive' => '退会時の学習履歴アーカイブ',
            'activity_logs' => 'アクティビティログ（学習行動・ログイン記録）',
            'course_ratings' => 'コース評価（1.0〜5.0）',
        ];

        foreach ($tables as $table => $comment) {
            DB::statement("ALTER TABLE `{$table}` COMMENT = '{$comment}'");
        }

        // ── カラムコメント ────────────────────────────────────
        $columns = [
            // users
            ['users', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['users', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['users', 'name', 'VARCHAR(255) NOT NULL', '表示名'],
            ['users', 'email', 'VARCHAR(255) NOT NULL', 'ログイン用メールアドレス'],
            ['users', 'email_verified_at', 'TIMESTAMP NULL DEFAULT NULL', 'メール認証日時'],
            ['users', 'password', 'VARCHAR(255) NOT NULL', 'bcryptハッシュ化パスワード'],
            ['users', 'role', "ENUM('student','admin') NOT NULL DEFAULT 'student'", '権限（student=受講者, admin=管理者）'],
            ['users', 'avatar_path', 'VARCHAR(500) NULL DEFAULT NULL', 'アバター画像のストレージ相対パス'],
            ['users', 'last_active_at', 'TIMESTAMP NULL DEFAULT NULL', '最終アクティブ日時（リクエスト毎に更新）'],
            ['users', 'remember_token', 'VARCHAR(100) NULL DEFAULT NULL', 'Remember Me トークン'],
            ['users', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['users', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],
            ['users', 'deleted_at', 'TIMESTAMP NULL DEFAULT NULL', 'ソフトデリート日時'],

            // course_categories
            ['course_categories', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['course_categories', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['course_categories', 'name', 'VARCHAR(100) NOT NULL', 'カテゴリ名（例: AI Writing）'],
            ['course_categories', 'slug', 'VARCHAR(100) NOT NULL', 'URL用スラッグ'],
            ['course_categories', 'sort_order', 'SMALLINT UNSIGNED NOT NULL DEFAULT 0', '表示順'],
            ['course_categories', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['course_categories', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],

            // courses
            ['courses', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['courses', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['courses', 'course_category_id', 'BIGINT UNSIGNED NOT NULL', 'カテゴリID（FK→course_categories）'],
            ['courses', 'title', 'VARCHAR(500) NOT NULL', 'コースタイトル'],
            ['courses', 'slug', 'VARCHAR(500) NOT NULL', 'URL用スラッグ'],
            ['courses', 'description', 'TEXT NULL', 'コース説明文'],
            ['courses', 'thumbnail_path', 'VARCHAR(500) NULL DEFAULT NULL', 'サムネイル画像パス'],
            ['courses', 'status', "ENUM('draft','published','archived') NOT NULL DEFAULT 'draft'", '公開状態（draft=下書き, published=公開, archived=アーカイブ）'],
            ['courses', 'published_at', 'TIMESTAMP NULL DEFAULT NULL', '公開日時'],
            ['courses', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['courses', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],
            ['courses', 'deleted_at', 'TIMESTAMP NULL DEFAULT NULL', 'ソフトデリート日時'],

            // chapters
            ['chapters', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['chapters', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['chapters', 'course_id', 'BIGINT UNSIGNED NOT NULL', 'コースID（FK→courses）'],
            ['chapters', 'title', 'VARCHAR(500) NOT NULL', '章タイトル（例: セクション 1: 基礎理論）'],
            ['chapters', 'sort_order', 'SMALLINT UNSIGNED NOT NULL DEFAULT 0', '表示順'],
            ['chapters', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['chapters', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],

            // lessons
            ['lessons', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['lessons', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['lessons', 'chapter_id', 'BIGINT UNSIGNED NOT NULL', '章ID（FK→chapters）'],
            ['lessons', 'title', 'VARCHAR(500) NOT NULL', 'レッスンタイトル'],
            ['lessons', 'type', "ENUM('video','text','assignment') NOT NULL", '種別（video=動画, text=テキスト, assignment=課題）'],
            ['lessons', 'has_video', 'TINYINT(1) NOT NULL DEFAULT 0', '動画付きフラグ（type=textでも動画がある場合1）'],
            ['lessons', 'duration_seconds', 'INT UNSIGNED NULL DEFAULT NULL', '所要時間（秒）'],
            ['lessons', 'content_body', 'LONGTEXT NULL', 'コンテンツ本文（HTML/Markdown）'],
            ['lessons', 'video_url', 'VARCHAR(1000) NULL DEFAULT NULL', '動画URL'],
            ['lessons', 'sort_order', 'SMALLINT UNSIGNED NOT NULL DEFAULT 0', '表示順'],
            ['lessons', 'is_free_preview', 'TINYINT(1) NOT NULL DEFAULT 0', '無料プレビュー可否'],
            ['lessons', 'prerequisite_lesson_id', 'BIGINT UNSIGNED NULL DEFAULT NULL', '前提レッスンID（FK→lessons、自己参照）'],
            ['lessons', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['lessons', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],
            ['lessons', 'deleted_at', 'TIMESTAMP NULL DEFAULT NULL', 'ソフトデリート日時'],

            // enrollments
            ['enrollments', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['enrollments', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['enrollments', 'user_id', 'BIGINT UNSIGNED NOT NULL', '受講者ID（FK→users）'],
            ['enrollments', 'course_id', 'BIGINT UNSIGNED NOT NULL', 'コースID（FK→courses）'],
            ['enrollments', 'enrolled_at', 'TIMESTAMP NOT NULL', '登録日時'],
            ['enrollments', 'completed_at', 'TIMESTAMP NULL DEFAULT NULL', '全レッスン完了日時'],
            ['enrollments', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['enrollments', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],

            // lesson_progress
            ['lesson_progress', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['lesson_progress', 'enrollment_id', 'BIGINT UNSIGNED NOT NULL', '登録ID（FK→enrollments）'],
            ['lesson_progress', 'lesson_id', 'BIGINT UNSIGNED NOT NULL', 'レッスンID（FK→lessons）'],
            ['lesson_progress', 'started_at', 'TIMESTAMP NULL DEFAULT NULL', '学習開始日時'],
            ['lesson_progress', 'completed_at', 'TIMESTAMP NULL DEFAULT NULL', '学習完了日時'],
            ['lesson_progress', 'video_position_seconds', 'INT UNSIGNED NULL DEFAULT NULL', '動画再開位置（秒）'],
            ['lesson_progress', 'time_spent_seconds', 'INT UNSIGNED NOT NULL DEFAULT 0', '累計学習時間（秒）'],
            ['lesson_progress', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['lesson_progress', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],

            // assignments
            ['assignments', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['assignments', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['assignments', 'lesson_id', 'BIGINT UNSIGNED NULL DEFAULT NULL', 'レッスンID（FK→lessons、NULLならコースレベル課題）'],
            ['assignments', 'course_id', 'BIGINT UNSIGNED NOT NULL', 'コースID（FK→courses）'],
            ['assignments', 'title', 'VARCHAR(500) NOT NULL', '課題タイトル'],
            ['assignments', 'description', 'TEXT NULL', '課題説明・条件'],
            ['assignments', 'due_date', 'TIMESTAMP NULL DEFAULT NULL', '提出期限'],
            ['assignments', 'max_score', 'DECIMAL(5,2) NULL DEFAULT NULL', '満点（NULLなら合否判定のみ）'],
            ['assignments', 'sort_order', 'SMALLINT UNSIGNED NOT NULL DEFAULT 0', '表示順'],
            ['assignments', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['assignments', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],
            ['assignments', 'deleted_at', 'TIMESTAMP NULL DEFAULT NULL', 'ソフトデリート日時'],

            // assignment_submissions
            ['assignment_submissions', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['assignment_submissions', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['assignment_submissions', 'assignment_id', 'BIGINT UNSIGNED NOT NULL', '課題ID（FK→assignments）'],
            ['assignment_submissions', 'user_id', 'BIGINT UNSIGNED NOT NULL', '提出者ID（FK→users）'],
            ['assignment_submissions', 'content', 'TEXT NULL', 'テキスト回答'],
            ['assignment_submissions', 'file_path', 'VARCHAR(500) NULL DEFAULT NULL', 'アップロードファイルパス'],
            ['assignment_submissions', 'file_original_name', 'VARCHAR(255) NULL DEFAULT NULL', '元ファイル名'],
            ['assignment_submissions', 'status', "ENUM('submitted','graded') NOT NULL DEFAULT 'submitted'", '状態（submitted=提出済, graded=採点済）'],
            ['assignment_submissions', 'score', 'DECIMAL(5,2) NULL DEFAULT NULL', '得点'],
            ['assignment_submissions', 'graded_by', 'BIGINT UNSIGNED NULL DEFAULT NULL', '採点者ID（FK→users）'],
            ['assignment_submissions', 'graded_at', 'TIMESTAMP NULL DEFAULT NULL', '採点日時'],
            ['assignment_submissions', 'feedback', 'TEXT NULL', '採点フィードバック'],
            ['assignment_submissions', 'submitted_at', 'TIMESTAMP NOT NULL', '提出日時'],
            ['assignment_submissions', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['assignment_submissions', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],

            // quiz_questions
            ['quiz_questions', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['quiz_questions', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['quiz_questions', 'lesson_id', 'BIGINT UNSIGNED NOT NULL', 'レッスンID（FK→lessons）'],
            ['quiz_questions', 'type', "ENUM('choice','text') NOT NULL", '問題形式（choice=選択式, text=記述式）'],
            ['quiz_questions', 'question_text', 'TEXT NOT NULL', '問題文'],
            ['quiz_questions', 'options', 'JSON NULL', '選択肢（choice型: JSON配列）'],
            ['quiz_questions', 'correct_option_index', 'SMALLINT UNSIGNED NULL DEFAULT NULL', '正解インデックス（0始まり、choice型のみ）'],
            ['quiz_questions', 'conditions', 'JSON NULL', '回答条件（text型: JSON配列）'],
            ['quiz_questions', 'sort_order', 'SMALLINT UNSIGNED NOT NULL DEFAULT 0', '表示順'],
            ['quiz_questions', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['quiz_questions', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],

            // quiz_answers
            ['quiz_answers', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['quiz_answers', 'quiz_question_id', 'BIGINT UNSIGNED NOT NULL', '問題ID（FK→quiz_questions）'],
            ['quiz_answers', 'user_id', 'BIGINT UNSIGNED NOT NULL', '回答者ID（FK→users）'],
            ['quiz_answers', 'selected_option_index', 'SMALLINT UNSIGNED NULL DEFAULT NULL', '選択した選択肢インデックス（choice型）'],
            ['quiz_answers', 'answer_text', 'TEXT NULL', '記述回答（text型）'],
            ['quiz_answers', 'is_correct', 'TINYINT(1) NULL DEFAULT NULL', '正誤（choice型=自動判定, text型=NULL）'],
            ['quiz_answers', 'graded_by', 'BIGINT UNSIGNED NULL DEFAULT NULL', '採点者ID（FK→users）'],
            ['quiz_answers', 'graded_at', 'TIMESTAMP NULL DEFAULT NULL', '採点日時'],
            ['quiz_answers', 'feedback', 'TEXT NULL', '採点フィードバック'],
            ['quiz_answers', 'submitted_at', 'TIMESTAMP NOT NULL', '回答提出日時'],
            ['quiz_answers', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['quiz_answers', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],

            // messages
            ['messages', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['messages', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['messages', 'sender_id', 'BIGINT UNSIGNED NULL DEFAULT NULL', '送信者ID（FK→users、NULLならシステムメッセージ）'],
            ['messages', 'recipient_id', 'BIGINT UNSIGNED NOT NULL', '受信者ID（FK→users）'],
            ['messages', 'type', "ENUM('direct','feedback','system') NOT NULL", '種別（direct=DM, feedback=フィードバック, system=システム通知）'],
            ['messages', 'content', 'TEXT NOT NULL', 'メッセージ本文'],
            ['messages', 'is_read', 'TINYINT(1) NOT NULL DEFAULT 0', '既読フラグ'],
            ['messages', 'read_at', 'TIMESTAMP NULL DEFAULT NULL', '既読日時'],
            ['messages', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['messages', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],
            ['messages', 'deleted_at', 'TIMESTAMP NULL DEFAULT NULL', 'ソフトデリート日時'],

            // lesson_resources
            ['lesson_resources', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['lesson_resources', 'uuid', "CHAR(36) NOT NULL", 'API公開用UUID'],
            ['lesson_resources', 'lesson_id', 'BIGINT UNSIGNED NOT NULL', 'レッスンID（FK→lessons）'],
            ['lesson_resources', 'title', 'VARCHAR(255) NOT NULL', '資料タイトル'],
            ['lesson_resources', 'file_path', 'VARCHAR(500) NOT NULL', 'ファイルパス'],
            ['lesson_resources', 'file_original_name', 'VARCHAR(255) NOT NULL', '元ファイル名'],
            ['lesson_resources', 'file_size_bytes', 'INT UNSIGNED NULL DEFAULT NULL', 'ファイルサイズ（バイト）'],
            ['lesson_resources', 'mime_type', 'VARCHAR(100) NULL DEFAULT NULL', 'MIMEタイプ'],
            ['lesson_resources', 'sort_order', 'SMALLINT UNSIGNED NOT NULL DEFAULT 0', '表示順'],
            ['lesson_resources', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['lesson_resources', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],

            // enrollment_archive
            ['enrollment_archive', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['enrollment_archive', 'original_enrollment_id', 'BIGINT UNSIGNED NOT NULL', '元のenrollment ID（参照先は削除済み）'],
            ['enrollment_archive', 'user_id', 'BIGINT UNSIGNED NOT NULL', '退会した受講者ID'],
            ['enrollment_archive', 'course_id', 'BIGINT UNSIGNED NOT NULL', '対象コースID'],
            ['enrollment_archive', 'table_name', 'VARCHAR(50) NOT NULL', '元テーブル名（lesson_progress等）'],
            ['enrollment_archive', 'record_id', 'BIGINT UNSIGNED NOT NULL', '元テーブルの主キー'],
            ['enrollment_archive', 'data', 'JSON NOT NULL', '元レコード全カラムのJSONスナップショット'],
            ['enrollment_archive', 'archived_at', "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP", 'アーカイブ日時'],

            // activity_logs
            ['activity_logs', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['activity_logs', 'user_id', 'BIGINT UNSIGNED NULL DEFAULT NULL', 'ユーザーID（FK→users）'],
            ['activity_logs', 'type', "ENUM('complete','submit','enroll','warning','login') NOT NULL", '種別（complete=完了, submit=提出, enroll=登録, warning=警告, login=ログイン）'],
            ['activity_logs', 'subject_type', 'VARCHAR(255) NULL DEFAULT NULL', 'ポリモーフィック対象モデル名'],
            ['activity_logs', 'subject_id', 'BIGINT UNSIGNED NULL DEFAULT NULL', 'ポリモーフィック対象ID'],
            ['activity_logs', 'description', 'TEXT NOT NULL', '人間可読な説明テキスト'],
            ['activity_logs', 'metadata', 'JSON NULL', '追加メタデータ（JSON）'],
            ['activity_logs', 'created_at', "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP", '記録日時'],

            // course_ratings
            ['course_ratings', 'id', 'BIGINT UNSIGNED NOT NULL AUTO_INCREMENT', '内部ID'],
            ['course_ratings', 'course_id', 'BIGINT UNSIGNED NOT NULL', 'コースID（FK→courses）'],
            ['course_ratings', 'user_id', 'BIGINT UNSIGNED NOT NULL', '評価者ID（FK→users）'],
            ['course_ratings', 'rating', 'DECIMAL(2,1) NOT NULL', '評価スコア（1.0〜5.0）'],
            ['course_ratings', 'review_text', 'TEXT NULL', 'レビューコメント'],
            ['course_ratings', 'created_at', 'TIMESTAMP NULL DEFAULT NULL', '作成日時'],
            ['course_ratings', 'updated_at', 'TIMESTAMP NULL DEFAULT NULL', '更新日時'],
        ];

        foreach ($columns as [$table, $column, $definition, $comment]) {
            $escaped = addslashes($comment);
            DB::statement("ALTER TABLE `{$table}` MODIFY COLUMN `{$column}` {$definition} COMMENT '{$escaped}'");
        }
    }

    public function down(): void
    {
        // コメント削除は不要（スキーマに影響しない）
    }
};
