<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Lesson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class LessonSeeder extends Seeder
{
    public function run(): void
    {
        $chapters = Chapter::with('course')->orderBy('course_id')->orderBy('sort_order')->get();

        $this->seedCourse($chapters, 'ai-editorial-strategy', [
            ['プロンプトエンジニアリングの基礎', 'video', 720],
            ['効果的なプロンプトの構造', 'text', 600],
            ['プロンプトテンプレートの活用', 'video', 900],
            ['AI出力の品質評価', 'text', 480],
            ['実践演習：基礎プロンプト作成', 'assignment', 1800],
            ['基礎知識の確認テスト', 'text', 300],

            ['記事構成の基本パターン', 'video', 840],
            ['ペルソナ設定とターゲティング', 'text', 720],
            ['SEOを意識した見出し設計', 'video', 660],
            ['コンテンツカレンダーの作成', 'text', 540],
            ['実践演習：構成案作成', 'assignment', 2400],
            ['フレームワーク理解度チェック', 'text', 300],

            ['ブログ記事の制作ワークフロー', 'video', 960],
            ['SNS投稿コンテンツの最適化', 'text', 600],
            ['メールマーケティング文面の生成', 'video', 780],
            ['プレスリリースの自動生成', 'text', 540],
            ['実践演習：コンテンツ制作', 'assignment', 3600],
            ['制作スキル確認テスト', 'text', 300],

            ['マルチモーダルAIの活用', 'video', 1080],
            ['AIと人間の協業フレームワーク', 'text', 840],
            ['品質管理とファクトチェック', 'video', 720],
            ['大規模コンテンツ運用の自動化', 'text', 660],
            ['最終課題：総合コンテンツ戦略', 'assignment', 7200],
            ['総合理解度テスト', 'text', 600],
        ], 6);

        $this->seedCourse($chapters, 'data-science-python', [
            ['Python環境のセットアップ', 'video', 600],
            ['変数とデータ型', 'text', 480],
            ['制御構文（if/for/while）', 'video', 720],
            ['関数とモジュール', 'text', 600],
            ['実践演習：基本プログラム作成', 'assignment', 1800],
            ['基礎文法テスト', 'text', 300],

            ['NumPy入門', 'video', 900],
            ['Pandas入門', 'video', 1080],
            ['データクリーニング手法', 'text', 720],
            ['Matplotlib/Seabornで可視化', 'video', 960],
            ['実践演習：データ可視化', 'assignment', 2400],
            ['ライブラリ活用テスト', 'text', 300],

            ['探索的データ分析（EDA）', 'video', 1200],
            ['統計的仮説検定', 'text', 840],
            ['回帰分析の基礎', 'video', 960],
            ['分類問題入門', 'text', 720],
            ['最終課題：データ分析レポート', 'assignment', 7200],
            ['総合テスト', 'text', 600],
        ], 6);

        $this->seedCourse($chapters, 'ux-design-pro', [
            ['UXデザインとは何か', 'video', 720],
            ['ユーザーリサーチの方法', 'text', 600],
            ['ペルソナとユーザージャーニー', 'video', 840],
            ['情報アーキテクチャ', 'text', 540],
            ['実践演習：ペルソナ設定', 'assignment', 1800],
            ['UX原則テスト', 'text', 300],

            ['UIコンポーネント設計', 'video', 960],
            ['デザインシステムの構築', 'text', 720],
            ['レスポンシブデザインの実装', 'video', 840],
            ['アクセシビリティ対応', 'text', 600],
            ['最終課題：UIプロトタイプ制作', 'assignment', 3600],
            ['総合テスト', 'text', 600],
        ], 6);
    }

    private function seedCourse(Collection $chapters, string $courseSlug, array $lessons, int $perChapter): void
    {
        $courseChapters = $chapters->where('course.slug', $courseSlug);
        $lessonIndex = 0;
        $prevLesson = null;

        foreach ($courseChapters as $chapter) {
            $prevLesson = null;
            for ($i = 0; $i < $perChapter; $i++) {
                $l = $lessons[$lessonIndex];
                $prevLesson = Lesson::create([
                    'chapter_id' => $chapter->id,
                    'title' => $l[0],
                    'type' => $l[1],
                    'has_video' => $l[1] === 'video',
                    'duration_seconds' => $l[2],
                    'sort_order' => $i,
                    'prerequisite_lesson_id' => ($i > 0) ? $prevLesson->id : null,
                ]);
                $lessonIndex++;
            }
        }
    }
}
