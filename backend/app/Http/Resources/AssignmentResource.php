<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'title' => $this->title,
            'dueDate' => $this->due_date
                ? $this->due_date->locale('ja')->diffForHumans()
                : '',
            'status' => $this->student_status ?? 'pending',
            'courseName' => $this->course->title ?? '',
        ];
    }
}
