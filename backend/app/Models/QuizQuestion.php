<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizQuestion extends Model
{
    use HasUuid;

    protected $fillable = [
        'lesson_id', 'type', 'question_text', 'options',
        'correct_option_index', 'conditions', 'explanation', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'conditions' => 'array',
        ];
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class);
    }
}
