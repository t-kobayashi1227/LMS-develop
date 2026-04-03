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
                'url' => $r->file_path ? asset('storage/' . $r->file_path) : null,
            ]),
            'quizQuestions' => $locked ? [] : QuizQuestionResource::collection($this->quizQuestions),
            'assignment' => $locked ? null : $this->whenLoaded('assignment', function () {
                $assignment = $this->assignment;
                if (!$assignment) return null;
                return [
                    'id' => $assignment->uuid,
                    'title' => $assignment->title,
                    'description' => $assignment->description,
                    'dueDate' => $assignment->due_date?->toIso8601String(),
                    'maxScore' => $assignment->max_score,
                ];
            }),
            'submission' => $locked ? null : $this->whenLoaded('assignment', function () {
                $submission = $this->submission_data;
                if (!$submission) return null;
                return [
                    'id' => $submission->uuid,
                    'content' => $submission->content,
                    'fileName' => $submission->file_original_name,
                    'status' => $submission->status,
                    'score' => $submission->score,
                    'feedback' => $submission->feedback,
                    'submittedAt' => $submission->submitted_at?->toIso8601String(),
                    'gradedAt' => $submission->graded_at?->toIso8601String(),
                ];
            }),
        ];
    }
}
