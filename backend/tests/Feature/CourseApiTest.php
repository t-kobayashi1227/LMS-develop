<?php

namespace Tests\Feature;

use App\Models\Chapter;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_courses_returns_uuid_not_numeric_id(): void
    {
        $category = CourseCategory::create(['name' => 'Test', 'slug' => 'test']);
        $course = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Test Course',
            'slug' => 'test-course',
            'status' => 'published',
        ]);

        $user = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($user)->getJson('/api/v1/courses');

        $response->assertOk();
        $courseData = $response->json('data.0');
        $this->assertEquals($course->uuid, $courseData['id']);
        $this->assertNotEquals($course->id, $courseData['id']);
    }

    public function test_courses_includes_authenticated_user_progress(): void
    {
        $category = CourseCategory::create(['name' => 'Test', 'slug' => 'test']);
        $course = Course::create([
            'course_category_id' => $category->id,
            'title' => 'Test Course',
            'slug' => 'test-course',
            'status' => 'published',
        ]);
        $chapter = Chapter::create(['course_id' => $course->id, 'title' => 'Ch1']);
        $lesson1 = Lesson::create(['chapter_id' => $chapter->id, 'title' => 'L1', 'type' => 'text']);
        $lesson2 = Lesson::create(['chapter_id' => $chapter->id, 'title' => 'L2', 'type' => 'text']);

        $user = User::factory()->create(['role' => 'student']);
        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'enrolled_at' => now(),
        ]);

        LessonProgress::create([
            'enrollment_id' => $enrollment->id,
            'lesson_id' => $lesson1->id,
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($user)->getJson('/api/v1/courses');

        $response->assertOk();
        $courseData = $response->json('data.0');
        $this->assertEquals(2, $courseData['totalLessons']);
        $this->assertEquals(1, $courseData['completedLessons']);
        $this->assertEquals(50, $courseData['progress']);
    }

    public function test_course_thumbnail_uses_placeholder_when_null(): void
    {
        $category = CourseCategory::create(['name' => 'Test', 'slug' => 'test']);
        Course::create([
            'course_category_id' => $category->id,
            'title' => 'Test Course',
            'slug' => 'test-course',
            'status' => 'published',
            'thumbnail_path' => null,
        ]);

        $user = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($user)->getJson('/api/v1/courses');

        $thumbnail = $response->json('data.0.thumbnail');
        $this->assertStringContainsString('placehold.co', $thumbnail);
    }
}
