<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizQuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'type' => $this->type,
            'questionText' => $this->question_text,
            'options' => $this->options,
            'conditions' => $this->conditions,
            'sortOrder' => $this->sort_order,
        ];
    }
}
