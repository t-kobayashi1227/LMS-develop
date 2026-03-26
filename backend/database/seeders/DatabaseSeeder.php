<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
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
