<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $tanaka = User::where('email', 'kenta.tanaka@example.com')->first();
        $suzuki = User::where('email', 'misaki.suzuki@example.com')->first();
        $watanabe = User::where('email', 'sakura.watanabe@example.com')->first();
        $takahashi = User::where('email', 'daisuke.takahashi@example.com')->first();
        $ito = User::where('email', 'makoto.ito@example.com')->first();

        $logs = [
            [
                'user_id' => $tanaka->id,
                'type' => 'complete',
                'description' => '田中 健太 がレッスン「プロンプトエンジニアリングの基礎」を完了',
                'created_at' => now()->subMinutes(10),
            ],
            [
                'user_id' => $suzuki->id,
                'type' => 'submit',
                'description' => '鈴木 美咲 が課題「ペルソナ設定プロンプトの作成」を提出',
                'created_at' => now()->subMinutes(30),
            ],
            [
                'user_id' => $watanabe->id,
                'type' => 'enroll',
                'description' => '新規受講者 渡辺 さくら が「UXデザインの極意」に登録',
                'created_at' => now()->subHour(),
            ],
            [
                'user_id' => $takahashi->id,
                'type' => 'warning',
                'description' => '高橋 大輔 が3日間ログインしていません',
                'created_at' => now()->subHours(3),
            ],
            [
                'user_id' => $ito->id,
                'type' => 'enroll',
                'description' => '伊藤 誠 が「データサイエンス入門」の受講を開始',
                'created_at' => now()->subHours(5),
            ],
        ];

        foreach ($logs as $log) {
            ActivityLog::create($log);
        }

        // MAU用のloginログ（過去6ヶ月分）
        $students = User::where('role', 'student')->get();
        for ($m = 5; $m >= 0; $m--) {
            $month = now()->subMonths($m);
            $activeCount = [68, 82, 95, 88, 110, 128][$m] ?? 50;
            // 既存ユーザーのログインを記録
            foreach ($students->take(min($activeCount, $students->count())) as $student) {
                ActivityLog::create([
                    'user_id' => $student->id,
                    'type' => 'login',
                    'description' => $student->name . ' がログインしました',
                    'created_at' => $month->copy()->addDays(rand(0, 27)),
                ]);
            }
        }
    }
}
