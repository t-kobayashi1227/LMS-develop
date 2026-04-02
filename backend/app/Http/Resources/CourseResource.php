<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $totalLessons = $this->lessons_count ?? 0;
        $completedLessons = $this->completed_lessons_count ?? 0;
        $progress = $totalLessons > 0
            ? round($completedLessons / $totalLessons * 100)
            : 0;

        return [
            'id' => $this->uuid,
            'title' => $this->title,
            'description' => $this->description ?? '',
            'thumbnail' => $this->thumbnail_url,
            'progress' => $progress,
            'totalLessons' => $totalLessons,
            'completedLessons' => $completedLessons,
            'category' => $this->category->name ?? '',
            'studentCount' => $this->enrollments_count ?? 0,
            'status' => $this->status,
        ];
    }
}
