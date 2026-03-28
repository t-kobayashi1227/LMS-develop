<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $aiBasics = CourseCategory::where('slug', 'ai-basics')->first();
        $aiApps = CourseCategory::where('slug', 'ai-applications')->first();
        $design = CourseCategory::where('slug', 'design')->first();

        Course::create([
            'uuid' => 'c1000000-0000-0000-0000-000000000001',
            'course_category_id' => $aiBasics->id,
            'title' => 'はじめてのAI：基礎概念と仕組み',
            'slug' => 'ai-introduction',
            'description' => '機械学習・ディープラーニングの基本概念から、AIが動く仕組みまでをわかりやすく学びます。',
            'thumbnail_path' => null,
            'status' => 'published',
            'published_at' => now()->subMonths(3),
        ]);

        Course::create([
            'uuid' => 'c1000000-0000-0000-0000-000000000002',
            'course_category_id' => $aiApps->id,
            'title' => '生成AI活用入門：プロンプトエンジニアリング実践',
            'slug' => 'generative-ai-prompt',
            'description' => 'ChatGPTなどの生成AIを業務で効果的に活用するためのプロンプト設計手法を習得します。',
            'thumbnail_path' => null,
            'status' => 'published',
            'published_at' => now()->subMonths(2),
        ]);

        Course::create([
            'uuid' => 'c1000000-0000-0000-0000-000000000003',
            'course_category_id' => $design->id,
            'title' => 'AI×デザイン：画像生成AIの活用術',
            'slug' => 'ai-design',
            'description' => '画像生成AIを使ったデザインワークフローの効率化と実践テクニック。',
            'thumbnail_path' => null,
            'status' => 'published',
            'published_at' => now()->subMonth(),
        ]);
    }
}
