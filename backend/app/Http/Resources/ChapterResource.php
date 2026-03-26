<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChapterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'title' => $this->title,
            'sortOrder' => $this->sort_order,
            'lessons' => LessonResource::collection($this->whenLoaded('lessons')),
        ];
    }
}
