<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\User;
use Illuminate\Database\Seeder;

class AssignmentSubmissionSeeder extends Seeder
{
    public function run(): void
    {
        $suzuki = User::where('email', 'misaki.suzuki@example.com')->first();
        $admin = User::where('role', 'admin')->first();

        // 鈴木さんの提出済み課題をいくつか作成
        $assignments = Assignment::take(3)->get();
        foreach ($assignments as $i => $assignment) {
            AssignmentSubmission::create([
                'assignment_id' => $assignment->id,
                'user_id' => $suzuki->id,
                'content' => 'サンプル回答です。',
                'status' => $i === 0 ? 'graded' : 'submitted',
                'score' => $i === 0 ? 85.00 : null,
                'graded_by' => $i === 0 ? $admin->id : null,
                'graded_at' => $i === 0 ? now()->subDay() : null,
                'feedback' => $i === 0 ? '良い出来です。具体例をもう少し増やすとさらに良くなります。' : null,
                'submitted_at' => now()->subDays(rand(1, 5)),
            ]);
        }
    }
}
