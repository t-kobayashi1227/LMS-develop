<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'courseId' => $this->chapter->course->uuid ?? '',
            'courseTitle' => $this->chapter->course->title ?? '',
            'chapterId' => $this->chapter->uuid ?? '',
            'chapterTitle' => $this->chapter->title ?? '',
            'title' => $this->title,
            'type' => $this->type,
            'hasVideo' => $this->has_video,
            'videoUrl' => $this->video_url,
            'contentBody' => $this->content_body,
            'duration' => $this->formattedDuration(),
            'durationSeconds' => $this->duration_seconds,
            'isCompleted' => $this->is_completed ?? false,
            'isLocked' => $this->is_locked ?? false,
            'sortOrder' => $this->sort_order,
            'resources' => $this->resources->map(fn ($r) => [
                'id' => $r->uuid,
                'title' => $r->title,
                'fileOriginalName' => $r->file_original_name,
                'fileSizeBytes' => $r->file_size_bytes,
                'mimeType' => $r->mime_type,
            ]),
            'quizQuestions' => QuizQuestionResource::collection($this->quizQuestions),
        ];
    }
}
