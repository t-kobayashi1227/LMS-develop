<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizAnswer extends Model
{
    protected $fillable = [
        'quiz_question_id', 'user_id', 'selected_option_index',
        'answer_text', 'is_correct', 'graded_by', 'graded_at',
        'feedback', 'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
            'submitted_at' => 'datetime',
            'graded_at' => 'datetime',
        ];
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function grader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'graded_by');
    }
}
