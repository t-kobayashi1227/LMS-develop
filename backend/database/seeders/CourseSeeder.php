<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $aiWriting = CourseCategory::where('slug', 'ai-writing')->first();
        $dataScience = CourseCategory::where('slug', 'data-science')->first();
        $design = CourseCategory::where('slug', 'design')->first();

        Course::create([
            'uuid' => 'c1000000-0000-0000-0000-000000000001',
            'course_category_id' => $aiWriting->id,
            'title' => 'AI時代のデジタル・エディトリアル戦略',
            'slug' => 'ai-editorial-strategy',
            'description' => 'プロンプトエンジニアリングを活用した高度な記事構成案の作成方法について学びます。',
            'thumbnail_path' => null, // courses/course1.jpg',
            'status' => 'published',
            'published_at' => now()->subMonths(3),
        ]);

        Course::create([
            'uuid' => 'c1000000-0000-0000-0000-000000000002',
            'course_category_id' => $dataScience->id,
            'title' => 'データサイエンス入門：Python基礎',
            'slug' => 'data-science-python',
            'description' => 'データ分析に必要なPythonの基本文法とライブラリの使い方を習得します。',
            'thumbnail_path' => null, // courses/course2.jpg',
            'status' => 'published',
            'published_at' => now()->subMonths(2),
        ]);

        Course::create([
            'uuid' => 'c1000000-0000-0000-0000-000000000003',
            'course_category_id' => $design->id,
            'title' => 'UXデザインの極意：プロレベルのUI構築',
            'slug' => 'ux-design-pro',
            'description' => 'ユーザーの心を動かすインターフェース設計の原則と実践。',
            'thumbnail_path' => null, // courses/course3.jpg',
            'status' => 'published',
            'published_at' => now()->subMonth(),
        ]);
    }
}
