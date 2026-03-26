<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password',
            'role' => 'student',
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure([
                'data' => ['user' => ['id', 'name', 'role', 'avatar'], 'token'],
            ]);

        // UUID が返される（数値IDではない）
        $this->assertEquals($user->uuid, $response->json('data.user.id'));
    }

    public function test_login_with_invalid_credentials_returns_422(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'wrong',
        ]);

        $response->assertUnprocessable();
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $this->getJson('/api/v1/user')->assertUnauthorized();
        $this->getJson('/api/v1/courses')->assertUnauthorized();
        $this->getJson('/api/v1/assignments')->assertUnauthorized();
        $this->getJson('/api/v1/students')->assertUnauthorized();
        $this->getJson('/api/v1/analytics/kpi')->assertUnauthorized();
    }

    public function test_unauthenticated_request_without_accept_json_returns_401(): void
    {
        // Accept: application/json なしでも 401 JSON が返る
        $response = $this->get('/api/v1/user');
        $response->assertStatus(401);
        $response->assertJson(['message' => 'Unauthenticated.']);
    }

    public function test_student_cannot_access_admin_endpoints(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $this->actingAs($student)
            ->getJson('/api/v1/students')
            ->assertForbidden();

        $this->actingAs($student)
            ->getJson('/api/v1/analytics/kpi')
            ->assertForbidden();
    }

    public function test_admin_can_access_admin_endpoints(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->getJson('/api/v1/students')
            ->assertOk();

        $this->actingAs($admin)
            ->getJson('/api/v1/analytics/kpi')
            ->assertOk();
    }

    public function test_login_updates_last_active_at(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password',
            'last_active_at' => null,
        ]);

        $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $user->refresh();
        $this->assertNotNull($user->last_active_at);
    }

    public function test_login_creates_activity_log(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $this->postJson('/api/v1/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $this->assertDatabaseHas('activity_logs', [
            'type' => 'login',
        ]);
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('api')->plainTextToken;

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/logout')
            ->assertOk();

        // Token count should be 0 after logout
        $this->assertEquals(0, $user->tokens()->count());
    }
}
