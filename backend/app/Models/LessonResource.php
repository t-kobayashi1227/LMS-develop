<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonResource extends Model
{
    use HasUuid;

    protected $fillable = [
        'lesson_id', 'title', 'file_path', 'file_original_name',
        'file_size_bytes', 'mime_type', 'sort_order',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}
