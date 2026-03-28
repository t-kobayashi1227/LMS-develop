<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        if (User::exists()) {
            $this->command?->info('Database already seeded, skipping.');
            return;
        }

        $this->call([
            UserSeeder::class,
            CourseCategorySeeder::class,
            CourseSeeder::class,
            ChapterSeeder::class,
            LessonSeeder::class,
            EnrollmentSeeder::class,
            LessonProgressSeeder::class,
            AssignmentSeeder::class,
            AssignmentSubmissionSeeder::class,
            QuizQuestionSeeder::class,
            QuizAnswerSeeder::class,
            MessageSeeder::class,
            ActivityLogSeeder::class,
            CourseRatingSeeder::class,
        ]);
    }
}
