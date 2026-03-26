<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assignment extends Model
{
    use HasUuid, SoftDeletes;

    protected $fillable = [
        'lesson_id', 'course_id', 'title', 'description',
        'due_date', 'max_score', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'datetime',
            'max_score' => 'decimal:2',
        ];
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(AssignmentSubmission::class);
    }
}
