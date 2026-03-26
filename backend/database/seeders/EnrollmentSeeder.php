<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'student')->get();
        $courses = Course::all();

        $c1 = $courses->where('slug', 'ai-editorial-strategy')->first();
        $c2 = $courses->where('slug', 'data-science-python')->first();
        $c3 = $courses->where('slug', 'ux-design-pro')->first();

        // 田中 健太: 3コース登録
        $tanaka = $students->where('email', 'kenta.tanaka@example.com')->first();
        foreach ([$c1, $c2, $c3] as $course) {
            Enrollment::create([
                'user_id' => $tanaka->id,
                'course_id' => $course->id,
                'enrolled_at' => now()->subMonths(2),
            ]);
        }

        // 鈴木 美咲: 3コース登録（+追加2コース分は将来対応）
        $suzuki = $students->where('email', 'misaki.suzuki@example.com')->first();
        foreach ([$c1, $c2, $c3] as $course) {
            Enrollment::create([
                'user_id' => $suzuki->id,
                'course_id' => $course->id,
                'enrolled_at' => now()->subMonths(3),
            ]);
        }

        // 高橋 大輔: 2コース登録
        $takahashi = $students->where('email', 'daisuke.takahashi@example.com')->first();
        foreach ([$c1, $c2] as $course) {
            Enrollment::create([
                'user_id' => $takahashi->id,
                'course_id' => $course->id,
                'enrolled_at' => now()->subMonths(1),
            ]);
        }

        // 渡辺 さくら: 3コース登録
        $watanabe = $students->where('email', 'sakura.watanabe@example.com')->first();
        foreach ([$c1, $c2, $c3] as $course) {
            Enrollment::create([
                'user_id' => $watanabe->id,
                'course_id' => $course->id,
                'enrolled_at' => now()->subWeeks(3),
            ]);
        }

        // 伊藤 誠: 1コース登録
        $ito = $students->where('email', 'makoto.ito@example.com')->first();
        Enrollment::create([
            'user_id' => $ito->id,
            'course_id' => $c2->id,
            'enrolled_at' => now()->subDays(5),
        ]);
    }
}
