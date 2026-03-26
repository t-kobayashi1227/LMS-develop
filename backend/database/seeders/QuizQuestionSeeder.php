<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\QuizQuestion;
use Illuminate\Database\Seeder;

class QuizQuestionSeeder extends Seeder
{
    public function run(): void
    {
        // テストタイプのレッスンにクイズ問題を追加
        $testLessons = Lesson::where('title', 'like', '%テスト%')
            ->orWhere('title', 'like', '%チェック%')
            ->get();

        foreach ($testLessons as $lesson) {
            // 選択式問題
            QuizQuestion::create([
                'lesson_id' => $lesson->id,
                'type' => 'choice',
                'question_text' => 'このレッスンで学んだ内容について、正しいものを選んでください。',
                'options' => ['選択肢A', '選択肢B（正解）', '選択肢C', '選択肢D'],
                'correct_option_index' => 1,
                'sort_order' => 0,
            ]);

            QuizQuestion::create([
                'lesson_id' => $lesson->id,
                'type' => 'choice',
                'question_text' => '次のうち、適切な手法はどれですか？',
                'options' => ['手法A', '手法B', '手法C（正解）', '手法D'],
                'correct_option_index' => 2,
                'sort_order' => 1,
            ]);

            // 記述式問題
            QuizQuestion::create([
                'lesson_id' => $lesson->id,
                'type' => 'text',
                'question_text' => '学んだ内容を踏まえて、あなたの考えを200字以内で述べてください。',
                'conditions' => ['200字以内', '具体例を1つ以上含めること'],
                'sort_order' => 2,
            ]);
        }
    }
}
