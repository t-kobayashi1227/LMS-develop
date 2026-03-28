<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Course;
use Illuminate\Database\Seeder;

class ChapterSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::all();

        // コース1: はじめてのAI：基礎概念と仕組み（24レッスン → 4章×6レッスン）
        $c1 = $courses->where('slug', 'ai-introduction')->first();
        foreach ([
            'セクション 1: AIの歴史と基本概念',
            'セクション 2: 機械学習の仕組み',
            'セクション 3: ディープラーニング入門',
            'セクション 4: AIの社会実装と倫理',
        ] as $i => $title) {
            Chapter::create(['course_id' => $c1->id, 'title' => $title, 'sort_order' => $i]);
        }

        // コース2: 生成AI活用入門（18レッスン → 3章×6レッスン）
        $c2 = $courses->where('slug', 'generative-ai-prompt')->first();
        foreach ([
            'セクション 1: 生成AIの基礎知識',
            'セクション 2: プロンプト設計の技法',
            'セクション 3: 業務活用の実践',
        ] as $i => $title) {
            Chapter::create(['course_id' => $c2->id, 'title' => $title, 'sort_order' => $i]);
        }

        // コース3: AI×デザイン：画像生成AIの活用術（12レッスン → 2章×6レッスン）
        $c3 = $courses->where('slug', 'ai-design')->first();
        foreach ([
            'セクション 1: 画像生成AIの基礎',
            'セクション 2: デザインワークフローへの統合',
        ] as $i => $title) {
            Chapter::create(['course_id' => $c3->id, 'title' => $title, 'sort_order' => $i]);
        }
    }
}
