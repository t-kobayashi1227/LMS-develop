<?php

namespace Database\Seeders;

use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuizAnswerSeeder extends Seeder
{
    public function run(): void
    {
        $tanaka = User::where('email', 'kenta.tanaka@example.com')->first();
        $questions = QuizQuestion::take(3)->get();

        foreach ($questions as $question) {
            if ($question->type === 'choice') {
                $selectedIndex = $question->correct_option_index;
                QuizAnswer::create([
                    'quiz_question_id' => $question->id,
                    'user_id' => $tanaka->id,
                    'selected_option_index' => $selectedIndex,
                    'is_correct' => $selectedIndex === $question->correct_option_index,
                    'submitted_at' => now()->subDays(rand(1, 7)),
                ]);
            } else {
                QuizAnswer::create([
                    'quiz_question_id' => $question->id,
                    'user_id' => $tanaka->id,
                    'answer_text' => 'プロンプトエンジニアリングは、AIとの効果的なコミュニケーション手法です。具体例として、ペルソナを明示することで出力品質が向上します。',
                    'is_correct' => null,
                    'submitted_at' => now()->subDays(rand(1, 7)),
                ]);
            }
        }
    }
}
