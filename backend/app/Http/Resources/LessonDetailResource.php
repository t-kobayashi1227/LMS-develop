<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locked = $this->is_locked ?? false;

        return [
            'id' => $this->uuid,
            'courseId' => $this->chapter->course->uuid ?? '',
            'courseTitle' => $this->chapter->course->title ?? '',
            'chapterId' => $this->chapter->uuid ?? '',
            'chapterTitle' => $this->chapter->title ?? '',
            'title' => $this->title,
            'type' => $this->type,
            'hasVideo' => $this->has_video,
            'videoUrl' => $locked ? null : $this->video_url,
            'contentBody' => $locked ? null : $this->content_body,
            'duration' => $this->formattedDuration(),
            'durationSeconds' => $this->duration_seconds,
            'isCompleted' => $this->is_completed ?? false,
            'isLocked' => $locked,
            'sortOrder' => $this->sort_order,
            'resources' => $locked ? [] : $this->resources->map(fn ($r) => [
                'id' => $r->uuid,
                'title' => $r->title,
                'fileOriginalName' => $r->file_original_name,
                'fileSizeBytes' => $r->file_size_bytes,
                'mimeType' => $r->mime_type,
                'url' => $r->file_path,
            ]),
            'quizQuestions' => $locked ? [] : QuizQuestionResource::collection($this->quizQuestions),
        ];
    }
}
