<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lesson extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'chapter_id', 'title', 'type', 'has_video', 'duration_seconds',
        'content_body', 'video_url', 'sort_order', 'is_free_preview',
        'prerequisite_lesson_id',
    ];

    protected function casts(): array
    {
        return [
            'has_video' => 'boolean',
            'is_free_preview' => 'boolean',
        ];
    }

    public function chapter(): BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }

    public function prerequisite(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'prerequisite_lesson_id');
    }

    public function progress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function assignment(): HasOne
    {
        return $this->hasOne(Assignment::class);
    }

    public function quizQuestions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class)->orderBy('sort_order');
    }

    public function resources(): HasMany
    {
        return $this->hasMany(LessonResource::class)->orderBy('sort_order');
    }

    public function formattedDuration(): string
    {
        if (!$this->duration_seconds) {
            return '0:00';
        }
        $minutes = intdiv($this->duration_seconds, 60);
        $seconds = $this->duration_seconds % 60;
        return sprintf('%d:%02d', $minutes, $seconds);
    }
}
