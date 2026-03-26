<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 管理者
        User::create([
            'uuid' => 'a1000000-0000-0000-0000-000000000001',
            'name' => '佐藤 結衣',
            'email' => 'yui.sato@example.com',
            'password' => 'password',
            'role' => 'admin',
            'last_active_at' => now(),
        ]);

        // 受講者（mockData.ts の mockStudents に対応）
        User::create([
            'uuid' => 's1000000-0000-0000-0000-000000000001',
            'name' => '田中 健太',
            'email' => 'kenta.tanaka@example.com',
            'password' => 'password',
            'role' => 'student',
            'last_active_at' => now(),
        ]);

        User::create([
            'uuid' => 's1000000-0000-0000-0000-000000000002',
            'name' => '鈴木 美咲',
            'email' => 'misaki.suzuki@example.com',
            'password' => 'password',
            'role' => 'student',
            'last_active_at' => now()->subHours(15),
        ]);

        User::create([
            'uuid' => 's1000000-0000-0000-0000-000000000003',
            'name' => '高橋 大輔',
            'email' => 'daisuke.takahashi@example.com',
            'password' => 'password',
            'role' => 'student',
            'last_active_at' => now()->subDays(3),
        ]);

        User::create([
            'uuid' => 's1000000-0000-0000-0000-000000000004',
            'name' => '渡辺 さくら',
            'email' => 'sakura.watanabe@example.com',
            'password' => 'password',
            'role' => 'student',
            'last_active_at' => now()->subHours(4),
        ]);

        User::create([
            'uuid' => 's1000000-0000-0000-0000-000000000005',
            'name' => '伊藤 誠',
            'email' => 'makoto.ito@example.com',
            'password' => 'password',
            'role' => 'student',
            'last_active_at' => now()->subDays(7),
        ]);
    }
}
