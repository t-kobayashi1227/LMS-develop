<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatarUrl(),
            'enrolledCourses' => $this->enrollments_count ?? 0,
            'progress' => $this->avg_progress ?? 0,
            'lastActive' => $this->last_active_at
                ? $this->last_active_at->locale('ja')->diffForHumans()
                : '未アクティブ',
            'status' => $this->isActive() ? 'active' : 'inactive',
        ];
    }
}
