<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnalyticsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_monthly_students_only_counts_students(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['role' => 'student']);

        // Admin login log — should NOT be counted
        ActivityLog::create([
            'user_id' => $admin->id,
            'type' => 'login',
            'description' => 'Admin logged in',
            'created_at' => now(),
        ]);

        // Student login log — should be counted
        ActivityLog::create([
            'user_id' => $student->id,
            'type' => 'login',
            'description' => 'Student logged in',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($admin)->getJson('/api/v1/analytics/monthly-students');

        $response->assertOk();
        $data = $response->json('data');

        // Only the student should be counted
        $totalStudents = collect($data)->sum('students');
        $this->assertEquals(1, $totalStudents);
    }

    public function test_kpi_returns_expected_structure(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->getJson('/api/v1/analytics/kpi');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'activeStudents',
                    'publishedCourses',
                    'pendingSubmissions',
                    'avgCompletion',
                    'totalHours',
                ],
            ]);
    }

    public function test_recent_activity_excludes_login_type(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['role' => 'student']);

        ActivityLog::create([
            'user_id' => $student->id,
            'type' => 'login',
            'description' => 'Login event',
            'created_at' => now(),
        ]);

        ActivityLog::create([
            'user_id' => $student->id,
            'type' => 'complete',
            'description' => 'Completed lesson',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($admin)->getJson('/api/v1/analytics/recent-activity');

        $response->assertOk();
        $types = collect($response->json('data'))->pluck('type');
        $this->assertNotContains('login', $types);
        $this->assertContains('complete', $types);
    }
}
