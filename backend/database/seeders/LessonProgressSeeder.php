<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Database\Seeder;

class LessonProgressSeeder extends Seeder
{
    public function run(): void
    {
        $enrollments = Enrollment::with(['user', 'course.chapters.lessons'])->get();

        foreach ($enrollments as $enrollment) {
            $lessons = $enrollment->course->chapters
                ->sortBy('sort_order')
                ->flatMap(fn ($ch) => $ch->lessons->sortBy('sort_order'));

            $total = $lessons->count();
            $completedCount = $this->getCompletedCount($enrollment);

            foreach ($lessons->take($completedCount) as $lesson) {
                LessonProgress::create([
                    'enrollment_id' => $enrollment->id,
                    'lesson_id' => $lesson->id,
                    'started_at' => $enrollment->enrolled_at->addDays(rand(0, 14)),
                    'completed_at' => now()->subDays(rand(0, 7)),
                    'time_spent_seconds' => $lesson->duration_seconds ?: rand(300, 1800),
                ]);
            }

            // 現在進行中のレッスン（次の1件）
            $nextLesson = $lessons->skip($completedCount)->first();
            if ($nextLesson && $completedCount > 0) {
                LessonProgress::create([
                    'enrollment_id' => $enrollment->id,
                    'lesson_id' => $nextLesson->id,
                    'started_at' => now()->subHours(rand(1, 48)),
                    'completed_at' => null,
                    'time_spent_seconds' => rand(60, $nextLesson->duration_seconds ?: 600),
                ]);
            }
        }
    }

    private function getCompletedCount(Enrollment $enrollment): int
    {
        $email = $enrollment->user->email;
        $slug = $enrollment->course->slug;

        // mockData.ts の進捗率に合わせる
        $progressMap = [
            'kenta.tanaka@example.com' => [
                'ai-introduction' => 15,         // 65% of 24
                'generative-ai-prompt' => 2,     // 12% of 18
                'ai-design' => 0,                // 0%
            ],
            'misaki.suzuki@example.com' => [
                'ai-introduction' => 20,
                'generative-ai-prompt' => 15,
                'ai-design' => 10,
            ],
            'daisuke.takahashi@example.com' => [
                'ai-introduction' => 3,
                'generative-ai-prompt' => 1,
            ],
            'sakura.watanabe@example.com' => [
                'ai-introduction' => 10,
                'generative-ai-prompt' => 8,
                'ai-design' => 5,
            ],
            'makoto.ito@example.com' => [
                'generative-ai-prompt' => 0,
            ],
        ];

        return $progressMap[$email][$slug] ?? 0;
    }
}
