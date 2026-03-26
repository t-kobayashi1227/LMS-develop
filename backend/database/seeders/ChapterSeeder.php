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

        // コース1: AI時代のデジタル・エディトリアル戦略（24レッスン → 4章×6レッスン）
        $c1 = $courses->where('slug', 'ai-editorial-strategy')->first();
        foreach ([
            'セクション 1: プロンプトエンジニアリングの基礎',
            'セクション 2: 記事構成のフレームワーク',
            'セクション 3: 実践的なコンテンツ制作',
            'セクション 4: 高度な応用テクニック',
        ] as $i => $title) {
            Chapter::create(['course_id' => $c1->id, 'title' => $title, 'sort_order' => $i]);
        }

        // コース2: データサイエンス入門（18レッスン → 3章×6レッスン）
        $c2 = $courses->where('slug', 'data-science-python')->first();
        foreach ([
            'セクション 1: Python環境構築と基本文法',
            'セクション 2: データ分析ライブラリ',
            'セクション 3: 実践データ分析',
        ] as $i => $title) {
            Chapter::create(['course_id' => $c2->id, 'title' => $title, 'sort_order' => $i]);
        }

        // コース3: UXデザインの極意（12レッスン → 2章×6レッスン）
        $c3 = $courses->where('slug', 'ux-design-pro')->first();
        foreach ([
            'セクション 1: UXデザインの原則',
            'セクション 2: UI構築の実践',
        ] as $i => $title) {
            Chapter::create(['course_id' => $c3->id, 'title' => $title, 'sort_order' => $i]);
        }
    }
}
