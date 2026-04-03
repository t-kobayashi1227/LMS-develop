<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'studentId' => $this->user->uuid,
            'studentName' => $this->user->name,
            'studentEmail' => $this->user->email,
            'enrolledAt' => $this->enrolled_at?->toIso8601String(),
            'completedAt' => $this->completed_at?->toIso8601String(),
        ];
    }
}
