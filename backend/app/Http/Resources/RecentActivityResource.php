<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecentActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'action' => $this->description,
            'time' => $this->created_at->locale('ja')->diffForHumans(),
            'type' => $this->type,
        ];
    }
}
