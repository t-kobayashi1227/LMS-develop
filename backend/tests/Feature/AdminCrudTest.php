<?php

namespace Tests\Feature;

use App\Models\Chapter;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $student;
    private CourseCategory $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->student = User::factory()->create(['role' => 'student']);
        $this->category = CourseCategory::create(['name' => 'Test', 'slug' => 'test', 'sort_order' => 0]);
    }

    private function createCourse(): Course
    {
        return Course::factory()->create(['course_category_id' => $this->category->id]);
    }

    private function createLesson(): array
    {
        $course = $this->createCourse();
        $chapter = Chapter::factory()->create(['course_id' => $course->id]);
        $lesson = Lesson::factory()->create(['chapter_id' => $chapter->id]);
        return [$course, $chapter, $lesson];
    }

    // ── Course CRUD ──────────────────────────────

    public function test_admin_can_create_course(): void
    {
        $this->actingAs($this->admin)
            ->postJson('/api/v1/admin/courses', [
                'title' => 'New Course',
                'categoryId' => $this->category->id,
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.id', fn ($id) => is_string($id) && strlen($id) === 36);
    }

    public function test_student_cannot_create_course(): void
    {
        $this->actingAs($this->student)
            ->postJson('/api/v1/admin/courses', ['title' => 'X', 'categoryId' => $this->category->id])
            ->assertStatus(403);
    }

    public function test_admin_can_update_course(): void
    {
        $course = $this->createCourse();

        $this->actingAs($this->admin)
            ->putJson("/api/v1/admin/courses/{$course->uuid}", ['title' => 'Updated'])
            ->assertOk()
            ->assertJsonPath('data.id', $course->uuid);

        $this->assertEquals('Updated', $course->fresh()->title);
    }

    public function test_admin_can_delete_course(): void
    {
        $course = $this->createCourse();

        $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/courses/{$course->uuid}")
            ->assertOk();

        $this->assertSoftDeleted('courses', ['id' => $course->id]);
    }

    // ── Chapter CRUD ──────────────────────────────

    public function test_admin_can_add_chapter(): void
    {
        $course = $this->createCourse();

        $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/courses/{$course->uuid}/chapters", ['title' => 'Chapter 1'])
            ->assertStatus(201);

        $this->assertDatabaseHas('chapters', ['course_id' => $course->id, 'title' => 'Chapter 1']);
    }

    public function test_admin_can_delete_chapter(): void
    {
        $course = $this->createCourse();
        $chapter = Chapter::factory()->create(['course_id' => $course->id]);

        $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/chapters/{$chapter->uuid}")
            ->assertOk();

        $this->assertDatabaseMissing('chapters', ['id' => $chapter->id]);
    }

    // ── Lesson CRUD ──────────────────────────────

    public function test_admin_can_add_lesson(): void
    {
        $course = $this->createCourse();
        $chapter = Chapter::factory()->create(['course_id' => $course->id]);

        $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/chapters/{$chapter->uuid}/lessons", [
                'title' => 'Lesson 1',
                'type' => 'text',
            ])
            ->assertStatus(201);

        $this->assertDatabaseHas('lessons', ['chapter_id' => $chapter->id, 'title' => 'Lesson 1']);
    }

    public function test_admin_can_delete_lesson(): void
    {
        [, , $lesson] = $this->createLesson();

        $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admin/lessons/{$lesson->uuid}")
            ->assertOk();

        $this->assertSoftDeleted('lessons', ['id' => $lesson->id]);
    }

    // ── Quiz CRUD ──────────────────────────────

    public function test_admin_can_add_quiz(): void
    {
        [, , $lesson] = $this->createLesson();

        $this->actingAs($this->admin)
            ->postJson("/api/v1/admin/lessons/{$lesson->uuid}/quiz", [
                'type' => 'choice',
                'questionText' => 'Test question?',
                'options' => ['A', 'B', 'C'],
                'correctOptionIndex' => 0,
            ])
            ->assertStatus(201);

        $this->assertDatabaseHas('quiz_questions', ['lesson_id' => $lesson->id]);
    }

    // ── Student delete ──────────────────────────

    public function test_admin_can_delete_student(): void
    {
        $this->actingAs($this->admin)
            ->deleteJson("/api/v1/students/{$this->student->uuid}")
            ->assertOk();

        $this->assertSoftDeleted('users', ['id' => $this->student->id]);
    }

    public function test_cannot_delete_admin_via_student_endpoint(): void
    {
        $otherAdmin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($this->admin)
            ->deleteJson("/api/v1/students/{$otherAdmin->uuid}")
            ->assertStatus(404);
    }

    // ── Password change ──────────────────────────

    public function test_user_can_change_password(): void
    {
        $this->actingAs($this->student)
            ->putJson('/api/v1/user/password', [
                'currentPassword' => 'password',
                'newPassword' => 'newpassword123',
                'newPassword_confirmation' => 'newpassword123',
            ])
            ->assertOk();
    }

    public function test_wrong_current_password_rejected(): void
    {
        $this->actingAs($this->student)
            ->putJson('/api/v1/user/password', [
                'currentPassword' => 'wrong',
                'newPassword' => 'newpassword123',
                'newPassword_confirmation' => 'newpassword123',
            ])
            ->assertStatus(422);
    }

    // ── Enrollment authorization ──────────────────

    public function test_unenrolled_user_cannot_access_chapters(): void
    {
        $course = $this->createCourse();

        $this->actingAs($this->student)
            ->getJson("/api/v1/courses/{$course->uuid}/chapters")
            ->assertStatus(403);
    }

    public function test_unenrolled_user_cannot_access_lesson(): void
    {
        [, , $lesson] = $this->createLesson();

        $this->actingAs($this->student)
            ->getJson("/api/v1/lessons/{$lesson->uuid}")
            ->assertStatus(403);
    }
}
