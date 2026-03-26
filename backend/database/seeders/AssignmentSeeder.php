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
        $c2 = Course::where('slug', 'data-science-python')->first();
        Assignment::create([
            'lesson_id' => null,
            'course_id' => $c2->id,
            'title' => 'マーケティング分析レポート作成',
            'description' => 'データサイエンスの手法を活用してマーケティングデータを分析し、レポートを作成してください。',
            'due_date' => now(),
            'max_score' => 100.00,
            'sort_order' => 99,
        ]);

        $c3 = Course::where('slug', 'ux-design-pro')->first();
        Assignment::create([
            'lesson_id' => null,
            'course_id' => $c3->id,
            'title' => 'デザインシステムの構築演習',
            'description' => '指定されたブランドに基づいてデザインシステムを構築してください。',
            'due_date' => now()->addDays(3),
            'max_score' => 100.00,
            'sort_order' => 99,
        ]);
    }
}
