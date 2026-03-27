<?php

namespace Database\Factories;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition(): array
    {
        return [
            'chapter_id' => 1,
            'title' => fake()->sentence(2),
            'type' => 'text',
            'sort_order' => 0,
        ];
    }
}
