<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $tanaka = User::where('email', 'kenta.tanaka@example.com')->first();

        // メンターからのフィードバック
        Message::create([
            'sender_id' => $admin->id,
            'recipient_id' => $tanaka->id,
            'type' => 'feedback',
            'content' => '前回の課題のフィードバックを送りました。構成案の視点が非常に鋭いです。具体例をもう少し増やすとさらに説得力が増します。',
            'is_read' => false,
        ]);

        // システムメッセージ
        Message::create([
            'sender_id' => null,
            'recipient_id' => $tanaka->id,
            'type' => 'system',
            'content' => '✨ あなたの学習傾向を分析しました。週末にまとめて学習する傾向があるため、平日に15分の復習時間を設けることをお勧めします。',
            'is_read' => true,
            'read_at' => now()->subDay(),
        ]);
    }
}
