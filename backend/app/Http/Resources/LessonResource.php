<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'courseId' => $this->chapter->course->uuid ?? '',
            'chapterId' => $this->chapter->uuid ?? '',
            'title' => $this->title,
            'duration' => $this->formattedDuration(),
            'isCompleted' => $this->is_completed ?? false,
            'isLocked' => $this->is_locked ?? false,
            'type' => $this->type,
        ];
    }
}
