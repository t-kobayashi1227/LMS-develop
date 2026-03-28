<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseRating;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseRatingSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $courses = Course::all();

        // mockData.ts の satisfaction に近い平均評価を生成
        $targetRatings = [
            'ai-introduction' => 4.8,
            'generative-ai-prompt' => 4.5,
            'ai-design' => 4.7,
        ];

        foreach ($courses as $course) {
            $target = $targetRatings[$course->slug] ?? 4.5;
            foreach ($students->take(3) as $student) {
                // ±0.3 の範囲でランダム
                $rating = min(5.0, max(1.0, $target + (rand(-3, 3) / 10)));
                CourseRating::create([
                    'course_id' => $course->id,
                    'user_id' => $student->id,
                    'rating' => round($rating, 1),
                ]);
            }
        }
    }
}
