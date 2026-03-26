<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\LessonDetailResource;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    /**
     * コースのチャプター構造（プレイリスト用）
     * GET /api/v1/courses/{courseUuid}/chapters
     */
    public function chapters(Request $request, string $courseUuid): JsonResponse
    {
        $course = Course::where('uuid', $courseUuid)->firstOrFail();
        $user = $request->user();

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        $chapters = $course->chapters()
            ->with(['lessons' => fn ($q) => $q->whereNull('deleted_at')->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        // 進捗・ロック状態を付与
        $completedLessonIds = [];
        if ($enrollment) {
            $completedLessonIds = LessonProgress::where('enrollment_id', $enrollment->id)
                ->whereNotNull('completed_at')
                ->pluck('lesson_id')
                ->toArray();
        }

        $chapters->each(function ($chapter) use ($completedLessonIds, $enrollment) {
            $chapter->lessons->each(function ($lesson) use ($completedLessonIds, $enrollment) {
                $lesson->is_completed = in_array($lesson->id, $completedLessonIds);
                $lesson->is_locked = $this->isLocked($lesson, $completedLessonIds, $enrollment);
            });
        });

        return response()->json([
            'data' => [
                'courseId' => $course->uuid,
                'courseTitle' => $course->title,
                'totalLessons' => $chapters->flatMap(fn ($ch) => $ch->lessons)->count(),
                'completedLessons' => count($completedLessonIds),
                'chapters' => ChapterResource::collection($chapters),
            ],
        ]);
    }

    /**
     * レッスン詳細
     * GET /api/v1/lessons/{lessonUuid}
     */
    public function show(Request $request, string $lessonUuid): LessonDetailResource
    {
        $lesson = Lesson::where('uuid', $lessonUuid)
            ->with(['chapter.course', 'resources', 'quizQuestions'])
            ->firstOrFail();

        $user = $request->user();
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $lesson->chapter->course_id)
            ->first();

        $completedLessonIds = [];
        if ($enrollment) {
            $completedLessonIds = LessonProgress::where('enrollment_id', $enrollment->id)
                ->whereNotNull('completed_at')
                ->pluck('lesson_id')
                ->toArray();
        }

        $lesson->is_completed = in_array($lesson->id, $completedLessonIds);
        $lesson->is_locked = $this->isLocked($lesson, $completedLessonIds, $enrollment);

        return new LessonDetailResource($lesson);
    }

    /**
     * レッスン進捗を記録
     * POST /api/v1/lessons/{lessonUuid}/progress
     */
    public function updateProgress(Request $request, string $lessonUuid): JsonResponse
    {
        $lesson = Lesson::where('uuid', $lessonUuid)
            ->with('chapter')
            ->firstOrFail();

        $user = $request->user();
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $lesson->chapter->course_id)
            ->firstOrFail();

        $progress = LessonProgress::firstOrCreate(
            ['enrollment_id' => $enrollment->id, 'lesson_id' => $lesson->id],
            ['started_at' => now()]
        );

        if ($request->boolean('completed') && !$progress->completed_at) {
            $progress->update(['completed_at' => now()]);
        }

        if ($request->has('timeSpentSeconds')) {
            $progress->increment('time_spent_seconds', (int) $request->input('timeSpentSeconds'));
        }

        return response()->json(['data' => ['status' => 'ok']]);
    }

    private function isLocked(Lesson $lesson, array $completedLessonIds, ?Enrollment $enrollment): bool
    {
        if (!$enrollment) {
            return true;
        }
        if (!$lesson->prerequisite_lesson_id) {
            return false;
        }
        return !in_array($lesson->prerequisite_lesson_id, $completedLessonIds);
    }
}
