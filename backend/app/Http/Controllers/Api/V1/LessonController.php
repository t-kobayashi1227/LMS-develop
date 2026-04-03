<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChapterResource;
use App\Http\Resources\LessonDetailResource;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    private function getCompletedLessonIds(?Enrollment $enrollment): array
    {
        if (!$enrollment) {
            return [];
        }

        return LessonProgress::where('enrollment_id', $enrollment->id)
            ->whereNotNull('completed_at')
            ->pluck('lesson_id')
            ->toArray();
    }

    /**
     * 受講登録を取得。管理者はenrollmentなしでもアクセス可。
     */
    private function resolveEnrollment($user, int $courseId): ?Enrollment
    {
        if ($user->isAdmin()) {
            return null;
        }

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            abort(403, 'このコースに受講登録されていません。');
        }

        return $enrollment;
    }

    /**
     * コースのチャプター構造（プレイリスト用）
     * GET /api/v1/courses/{courseUuid}/chapters
     */
    public function chapters(Request $request, string $courseUuid): JsonResponse
    {
        $course = Course::where('uuid', $courseUuid)->firstOrFail();
        $user = $request->user();
        $enrollment = $this->resolveEnrollment($user, $course->id);

        $chapters = $course->chapters()
            ->with(['lessons' => fn ($q) => $q->whereNull('deleted_at')->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        $completedLessonIds = $this->getCompletedLessonIds($enrollment);

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

        // Load assignment + user's submission in a single eager load
        if ($lesson->type === 'assignment') {
            $lesson->load([
                'assignment.submissions' => fn ($q) => $q->where('user_id', $user->id),
            ]);
            if ($lesson->assignment) {
                $lesson->submission_data = $lesson->assignment->submissions->first();
            }
        }

        $enrollment = $this->resolveEnrollment($user, $lesson->chapter->course_id);

        $completedLessonIds = $this->getCompletedLessonIds($enrollment);
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
        $enrollment = $this->resolveEnrollment($user, $lesson->chapter->course_id);

        if (!$enrollment) {
            return response()->json(['data' => ['status' => 'ok']]);
        }

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

    public function submitQuizAnswers(Request $request, string $lessonUuid): JsonResponse
    {
        $lesson = Lesson::where('uuid', $lessonUuid)->with('chapter')->firstOrFail();
        $user = $request->user();
        $enrollment = $this->resolveEnrollment($user, $lesson->chapter->course_id);

        if ($enrollment && $lesson->prerequisite_lesson_id) {
            $prerequisiteCompleted = LessonProgress::where('enrollment_id', $enrollment->id)
                ->where('lesson_id', $lesson->prerequisite_lesson_id)
                ->whereNotNull('completed_at')
                ->exists();

            if (!$prerequisiteCompleted) {
                return response()->json(['message' => 'Lesson is locked'], 403);
            }
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.*.questionId' => 'required|string',
            'answers.*.answer' => 'required|string',
        ]);

        $submittedIds = array_column($request->input('answers'), 'questionId');
        $questions = QuizQuestion::whereIn('uuid', $submittedIds)
            ->where('lesson_id', $lesson->id)
            ->get()
            ->keyBy('uuid');

        if ($questions->count() !== count($submittedIds)) {
            return response()->json(['message' => 'Invalid question IDs'], 422);
        }

        $results = [];

        foreach ($request->input('answers') as $answer) {
            $question = $questions[$answer['questionId']] ?? null;
            if (!$question) continue;

            $data = [
                'answer_text' => $answer['answer'],
                'selected_option_index' => null,
                'is_correct' => null,
                'submitted_at' => now(),
            ];

            $isCorrect = false;
            if ($question->type === 'choice') {
                $selectedIndex = array_search($answer['answer'], $question->options ?? []);
                $isCorrect = ($selectedIndex !== false && $selectedIndex === $question->correct_option_index);
                $data['selected_option_index'] = $selectedIndex !== false ? $selectedIndex : null;
                $data['is_correct'] = $isCorrect;
            }

            QuizAnswer::updateOrCreate(
                ['user_id' => $user->id, 'quiz_question_id' => $question->id],
                $data
            );

            $result = [
                'questionId' => $question->uuid,
                'type' => $question->type,
                'explanation' => $question->explanation,
            ];

            if ($question->type === 'choice') {
                $result['isCorrect'] = $isCorrect;
                $result['correctOptionIndex'] = $question->correct_option_index;
            }

            $results[] = $result;
        }

        return response()->json(['data' => ['status' => 'submitted', 'results' => $results]]);
    }

    private function isLocked(Lesson $lesson, array $completedLessonIds, ?Enrollment $enrollment): bool
    {
        if (!$enrollment) {
            return false;
        }
        if (!$lesson->prerequisite_lesson_id) {
            return false;
        }
        return !in_array($lesson->prerequisite_lesson_id, $completedLessonIds);
    }
}
