<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(3),
            'slug' => Str::slug(fake()->sentence(3)) . '-' . Str::random(6),
            'description' => fake()->paragraph(),
            'course_category_id' => 1,
            'status' => 'published',
            'published_at' => now(),
        ];
    }
}
