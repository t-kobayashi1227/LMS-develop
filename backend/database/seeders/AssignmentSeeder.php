<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Database\Seeder;

class AssignmentSeeder extends Seeder
{
    public function run(): void
    {
        // assignment タイプのレッスンに対応する課題を作成
        $assignmentLessons = Lesson::where('type', 'assignment')->with('chapter')->get();

        foreach ($assignmentLessons as $lesson) {
            Assignment::create([
                'lesson_id' => $lesson->id,
                'course_id' => $lesson->chapter->course_id,
                'title' => $lesson->title,
                'description' => $lesson->title . 'の課題です。指示に従って提出してください。',
                'due_date' => now()->addDays(rand(1, 14)),
                'max_score' => 100.00,
                'sort_order' => $lesson->sort_order,
            ]);
        }

        // mockData.ts に対応する追加課題
        $c2 = Course::where('slug', 'generative-ai-prompt')->first();
        Assignment::create([
            'lesson_id' => null,
            'course_id' => $c2->id,
            'title' => 'AI活用による業務改善レポート作成',
            'description' => '生成AIを活用して業務プロセスの改善案を分析し、レポートを作成してください。',
            'due_date' => now(),
            'max_score' => 100.00,
            'sort_order' => 99,
        ]);

        $c3 = Course::where('slug', 'ai-design')->first();
        Assignment::create([
            'lesson_id' => null,
            'course_id' => $c3->id,
            'title' => 'AI生成画像を活用したデザイン演習',
            'description' => '画像生成AIを使ってブランドイメージに合ったビジュアルを制作してください。',
            'due_date' => now()->addDays(3),
            'max_score' => 100.00,
            'sort_order' => 99,
        ]);
    }
}
