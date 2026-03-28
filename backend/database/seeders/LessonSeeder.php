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

        $this->seedCourse($chapters, 'ai-introduction', [
            ['AIとは何か：歴史と概要', 'video', 720],
            ['AIの種類と分類', 'text', 600],
            ['機械学習の基本的な考え方', 'video', 900],
            ['教師あり学習と教師なし学習', 'text', 480],
            ['実践演習：AI体験ワーク', 'assignment', 1800],
            ['基礎知識の確認テスト', 'text', 300],

            ['ニューラルネットワークの仕組み', 'video', 840],
            ['学習データの重要性', 'text', 720],
            ['過学習と汎化', 'video', 660],
            ['モデル評価の指標', 'text', 540],
            ['実践演習：モデルの評価体験', 'assignment', 2400],
            ['機械学習の理解度チェック', 'text', 300],

            ['ディープラーニングとは', 'video', 960],
            ['CNN：画像認識の仕組み', 'text', 600],
            ['RNN・Transformer：自然言語処理', 'video', 780],
            ['大規模言語モデル（LLM）の概要', 'text', 540],
            ['実践演習：AIモデル比較', 'assignment', 3600],
            ['ディープラーニング確認テスト', 'text', 300],

            ['AIの社会実装事例', 'video', 1080],
            ['AIと倫理・バイアス問題', 'text', 840],
            ['AI規制と法的枠組み', 'video', 720],
            ['AIの未来と可能性', 'text', 660],
            ['最終課題：AI活用企画書作成', 'assignment', 7200],
            ['総合理解度テスト', 'text', 600],
        ], 6);

        $this->seedCourse($chapters, 'generative-ai-prompt', [
            ['生成AIの種類と特徴', 'video', 600],
            ['ChatGPT・Claude・Geminiの違い', 'text', 480],
            ['生成AIの仕組み：トークンと確率', 'video', 720],
            ['生成AIの得意・不得意', 'text', 600],
            ['実践演習：生成AI体験', 'assignment', 1800],
            ['基礎知識テスト', 'text', 300],

            ['プロンプトの基本構造', 'video', 900],
            ['Zero-shot/Few-shotプロンプティング', 'video', 1080],
            ['Chain of Thought（思考の連鎖）', 'text', 720],
            ['システムプロンプトの設計', 'video', 960],
            ['実践演習：プロンプト改善', 'assignment', 2400],
            ['プロンプト設計テスト', 'text', 300],

            ['文書作成への活用', 'video', 1200],
            ['データ分析・要約への活用', 'text', 840],
            ['プログラミング支援への活用', 'video', 960],
            ['業務プロセスの自動化', 'text', 720],
            ['最終課題：業務改善提案書', 'assignment', 7200],
            ['総合テスト', 'text', 600],
        ], 6);

        $this->seedCourse($chapters, 'ai-design', [
            ['画像生成AIの種類と仕組み', 'video', 720],
            ['Stable Diffusion・DALL-E・Midjourneyの比較', 'text', 600],
            ['プロンプトによる画像生成の基礎', 'video', 840],
            ['スタイル・構図の指定テクニック', 'text', 540],
            ['実践演習：画像生成チャレンジ', 'assignment', 1800],
            ['基礎知識テスト', 'text', 300],

            ['デザインワークフローへのAI統合', 'video', 960],
            ['ブランドガイドラインとAI生成画像', 'text', 720],
            ['画像編集AIの活用（img2img等）', 'video', 840],
            ['著作権・商用利用の注意点', 'text', 600],
            ['最終課題：AIデザインポートフォリオ', 'assignment', 3600],
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
