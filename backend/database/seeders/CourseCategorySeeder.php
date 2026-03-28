<?php

namespace Database\Seeders;

use App\Models\CourseCategory;
use Illuminate\Database\Seeder;

class CourseCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'AI Basics', 'slug' => 'ai-basics', 'sort_order' => 1],
            ['name' => 'AI Applications', 'slug' => 'ai-applications', 'sort_order' => 2],
            ['name' => 'Design', 'slug' => 'design', 'sort_order' => 3],
            ['name' => 'Marketing', 'slug' => 'marketing', 'sort_order' => 4],
        ];

        foreach ($categories as $category) {
            CourseCategory::create($category);
        }
    }
}
