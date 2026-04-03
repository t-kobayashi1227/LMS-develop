<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Http\Resources\EnrollmentResource;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonResource;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCourseController extends Controller
{
    public function categoriesWithId(): JsonResponse
    {
        $categories = CourseCategory::orderBy('sort_order')
            ->get(['id', 'name', 'slug']);

        return response()->json(['data' => $categories]);
    }

    public function index(): AnonymousResourceCollection
    {
        $courses = Course::with('category')
            ->withCount(['enrollments', 'lessons'])
            ->orderByDesc('updated_at')
            ->get();

        return CourseResource::collection($courses);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'description' => 'nullable|string',
            'categoryId' => 'required|exists:course_categories,id',
            'status' => 'in:draft,published,archived',
        ]);

        $course = Course::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
            'description' => $validated['description'] ?? null,
            'course_category_id' => $validated['categoryId'],
            'status' => $validated['status'] ?? 'draft',
            'published_at' => ($validated['status'] ?? 'draft') === 'published' ? now() : null,
        ]);

        return response()->json(['data' => ['id' => $course->uuid]], 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $course = Course::where('uuid', $uuid)
            ->with(['category', 'chapters.lessons.quizQuestions', 'chapters.lessons.resources'])
            ->withCount(['enrollments', 'lessons'])
            ->firstOrFail();

        return response()->json([
            'data' => [
                'id' => $course->uuid,
                'title' => $course->title,
                'description' => $course->description,
                'status' => $course->status,
                'categoryId' => $course->course_category_id,
                'thumbnail' => $course->thumbnail_url,
                'categoryName' => $course->category->name ?? '',
                'totalLessons' => $course->lessons_count,
                'studentCount' => $course->enrollments_count,
                'chapters' => $course->chapters->sortBy('sort_order')->values()->map(fn ($ch) => [
                    'id' => $ch->uuid,
                    'title' => $ch->title,
                    'sortOrder' => $ch->sort_order,
                    'lessons' => $ch->lessons->sortBy('sort_order')->values()->map(fn ($l) => [
                        'id' => $l->uuid,
                        'title' => $l->title,
                        'type' => $l->type,
                        'hasVideo' => $l->has_video,
                        'videoUrl' => $l->video_url,
                        'contentBody' => $l->content_body,
                        'durationSeconds' => $l->duration_seconds,
                        'sortOrder' => $l->sort_order,
                        'quizQuestions' => $l->quizQuestions->sortBy('sort_order')->values()->map(fn ($q) => [
                            'id' => $q->uuid,
                            'type' => $q->type,
                            'questionText' => $q->question_text,
                            'options' => $q->options,
                            'correctOptionIndex' => $q->correct_option_index,
                            'conditions' => $q->conditions,
                            'explanation' => $q->explanation,
                        ]),
                        'resources' => $l->resources->sortBy('sort_order')->values()->map(fn ($r) => [
                            'id' => $r->uuid,
                            'title' => $r->title,
                            'fileOriginalName' => $r->file_original_name,
                            'fileSizeBytes' => $r->file_size_bytes,
                            'mimeType' => $r->mime_type,
                        ]),
                    ]),
                ]),
            ],
        ]);
    }

    public function update(Request $request, string $uuid): JsonResponse
    {
        $course = Course::where('uuid', $uuid)->firstOrFail();

        $validated = $request->validate([
            'title' => 'sometimes|string|max:500',
            'description' => 'nullable|string',
            'categoryId' => 'sometimes|exists:course_categories,id',
            'status' => 'sometimes|in:draft,published,archived',
        ]);

        if (array_key_exists('title', $validated)) $course->title = $validated['title'];
        if (array_key_exists('description', $validated)) $course->description = $validated['description'];
        if (array_key_exists('categoryId', $validated)) $course->course_category_id = $validated['categoryId'];
        if (isset($validated['status'])) {
            $course->status = $validated['status'];
            if ($validated['status'] === 'published' && !$course->published_at) {
                $course->published_at = now();
            }
        }
        $course->save();

        return response()->json(['data' => ['id' => $course->uuid]]);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $course = Course::where('uuid', $uuid)->firstOrFail();
        $course->delete();

        return response()->json(['data' => ['status' => 'deleted']]);
    }

    public function uploadThumbnail(Request $request, string $uuid): JsonResponse
    {
        $course = Course::where('uuid', $uuid)->firstOrFail();

        $request->validate([
            'thumbnail' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($course->thumbnail_path) {
            Storage::disk('public')->delete($course->thumbnail_path);
        }

        $path = $request->file('thumbnail')->store('thumbnails', 'public');
        $course->update(['thumbnail_path' => $path]);

        return response()->json([
            'data' => [
                'thumbnail' => asset('storage/' . $path),
            ],
        ]);
    }

    // ── 受講登録 ──────────────────────────────────

    public function enrollments(string $courseUuid): AnonymousResourceCollection
    {
        $course = Course::where('uuid', $courseUuid)->firstOrFail();

        $enrollments = Enrollment::where('course_id', $course->id)
            ->with('user')
            ->orderByDesc('enrolled_at')
            ->get();

        return EnrollmentResource::collection($enrollments);
    }

    public function enroll(Request $request, string $courseUuid): JsonResponse
    {
        $course = Course::where('uuid', $courseUuid)->firstOrFail();

        $validated = $request->validate([
            'studentId' => 'required|string',
        ]);

        $user = User::where('uuid', $validated['studentId'])
            ->where('role', 'student')
            ->firstOrFail();

        $enrollment = Enrollment::firstOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            ['enrolled_at' => now()],
        );

        return response()->json([
            'data' => new EnrollmentResource($enrollment->load('user')),
        ], 201);
    }

    public function unenroll(string $courseUuid, string $enrollmentUuid): JsonResponse
    {
        $course = Course::where('uuid', $courseUuid)->firstOrFail();

        $enrollment = Enrollment::where('uuid', $enrollmentUuid)
            ->where('course_id', $course->id)
            ->firstOrFail();

        $enrollment->delete();

        return response()->json(['data' => ['status' => 'deleted']]);
    }

    // ── チャプター ──────────────────────────────────

    public function storeChapter(Request $request, string $courseUuid): JsonResponse
    {
        $course = Course::where('uuid', $courseUuid)->firstOrFail();
        $validated = $request->validate([
            'title' => 'required|string|max:500',
        ]);

        $maxOrder = $course->chapters()->max('sort_order') ?? -1;
        $chapter = Chapter::create([
            'course_id' => $course->id,
            'title' => $validated['title'],
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json(['data' => ['id' => $chapter->uuid]], 201);
    }

    public function updateChapter(Request $request, string $chapterUuid): JsonResponse
    {
        $chapter = Chapter::where('uuid', $chapterUuid)->firstOrFail();
        $validated = $request->validate([
            'title' => 'sometimes|string|max:500',
            'sortOrder' => 'sometimes|integer|min:0',
        ]);

        if (isset($validated['title'])) $chapter->title = $validated['title'];
        if (isset($validated['sortOrder'])) $chapter->sort_order = $validated['sortOrder'];
        $chapter->save();

        return response()->json(['data' => ['id' => $chapter->uuid]]);
    }

    public function destroyChapter(string $chapterUuid): JsonResponse
    {
        $chapter = Chapter::where('uuid', $chapterUuid)->firstOrFail();
        $chapter->delete();

        return response()->json(['data' => ['status' => 'deleted']]);
    }

    // ── レッスン ──────────────────────────────────

    public function storeLesson(Request $request, string $chapterUuid): JsonResponse
    {
        $chapter = Chapter::where('uuid', $chapterUuid)->firstOrFail();
        $validated = $request->validate([
            'title' => 'required|string|max:500',
            'type' => 'required|in:video,text,assignment',
            'hasVideo' => 'boolean',
            'videoUrl' => 'nullable|url|max:1000',
            'contentBody' => 'nullable|string',
            'durationSeconds' => 'nullable|integer|min:0',
        ]);

        $maxOrder = $chapter->lessons()->max('sort_order') ?? -1;
        $lesson = Lesson::create([
            'chapter_id' => $chapter->id,
            'title' => $validated['title'],
            'type' => $validated['type'],
            'has_video' => $validated['hasVideo'] ?? false,
            'video_url' => $validated['videoUrl'] ?? null,
            'content_body' => $validated['contentBody'] ?? null,
            'duration_seconds' => $validated['durationSeconds'] ?? null,
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json(['data' => ['id' => $lesson->uuid]], 201);
    }

    public function updateLesson(Request $request, string $lessonUuid): JsonResponse
    {
        $lesson = Lesson::where('uuid', $lessonUuid)->firstOrFail();
        $validated = $request->validate([
            'title' => 'sometimes|string|max:500',
            'type' => 'sometimes|in:video,text,assignment',
            'hasVideo' => 'sometimes|boolean',
            'videoUrl' => 'nullable|url|max:1000',
            'contentBody' => 'nullable|string',
            'durationSeconds' => 'nullable|integer|min:0',
            'sortOrder' => 'sometimes|integer|min:0',
        ]);

        if (array_key_exists('title', $validated)) $lesson->title = $validated['title'];
        if (array_key_exists('type', $validated)) $lesson->type = $validated['type'];
        if (array_key_exists('hasVideo', $validated)) $lesson->has_video = $validated['hasVideo'];
        if (array_key_exists('videoUrl', $validated)) $lesson->video_url = $validated['videoUrl'];
        if (array_key_exists('contentBody', $validated)) $lesson->content_body = $validated['contentBody'];
        if (array_key_exists('durationSeconds', $validated)) $lesson->duration_seconds = $validated['durationSeconds'];
        if (array_key_exists('sortOrder', $validated)) $lesson->sort_order = $validated['sortOrder'];
        $lesson->save();

        return response()->json(['data' => ['id' => $lesson->uuid]]);
    }

    public function destroyLesson(string $lessonUuid): JsonResponse
    {
        $lesson = Lesson::where('uuid', $lessonUuid)->firstOrFail();
        $lesson->delete();

        return response()->json(['data' => ['status' => 'deleted']]);
    }

    // ── クイズ問題 ──────────────────────────────────

    public function storeQuiz(Request $request, string $lessonUuid): JsonResponse
    {
        $lesson = Lesson::where('uuid', $lessonUuid)->firstOrFail();
        $validated = $request->validate([
            'type' => 'required|in:choice,text',
            'questionText' => 'required|string',
            'options' => 'nullable|array',
            'correctOptionIndex' => 'nullable|integer|min:0',
            'conditions' => 'nullable|array',
            'explanation' => 'nullable|string',
        ]);

        $maxOrder = $lesson->quizQuestions()->max('sort_order') ?? -1;
        $question = QuizQuestion::create([
            'lesson_id' => $lesson->id,
            'type' => $validated['type'],
            'question_text' => $validated['questionText'],
            'options' => $validated['options'] ?? null,
            'correct_option_index' => $validated['correctOptionIndex'] ?? null,
            'conditions' => $validated['conditions'] ?? null,
            'explanation' => $validated['explanation'] ?? null,
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json(['data' => ['id' => $question->uuid]], 201);
    }

    public function updateQuiz(Request $request, string $quizUuid): JsonResponse
    {
        $question = QuizQuestion::where('uuid', $quizUuid)->firstOrFail();
        $validated = $request->validate([
            'type' => 'sometimes|in:choice,text',
            'questionText' => 'sometimes|string',
            'options' => 'nullable|array',
            'correctOptionIndex' => 'nullable|integer|min:0',
            'conditions' => 'nullable|array',
            'explanation' => 'nullable|string',
        ]);

        if (isset($validated['type'])) $question->type = $validated['type'];
        if (isset($validated['questionText'])) $question->question_text = $validated['questionText'];
        if (array_key_exists('options', $validated)) $question->options = $validated['options'];
        if (array_key_exists('correctOptionIndex', $validated)) $question->correct_option_index = $validated['correctOptionIndex'];
        if (array_key_exists('conditions', $validated)) $question->conditions = $validated['conditions'];
        if (array_key_exists('explanation', $validated)) $question->explanation = $validated['explanation'];
        $question->save();

        return response()->json(['data' => ['id' => $question->uuid]]);
    }

    public function destroyQuiz(string $quizUuid): JsonResponse
    {
        $question = QuizQuestion::where('uuid', $quizUuid)->firstOrFail();
        $question->delete();

        return response()->json(['data' => ['status' => 'deleted']]);
    }

    // ── レッスン資料 ──────────────────────────────────

    public function storeResource(Request $request, string $lessonUuid): JsonResponse
    {
        $lesson = Lesson::where('uuid', $lessonUuid)->firstOrFail();

        $request->validate([
            'file' => 'required|file|max:20480',
            'title' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        $path = $file->store('lesson-resources', 'public');

        $maxOrder = $lesson->resources()->max('sort_order') ?? -1;
        $resource = LessonResource::create([
            'lesson_id' => $lesson->id,
            'title' => $request->input('title') ?? $file->getClientOriginalName(),
            'file_path' => $path,
            'file_original_name' => $file->getClientOriginalName(),
            'file_size_bytes' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json([
            'data' => [
                'id' => $resource->uuid,
                'title' => $resource->title,
                'fileOriginalName' => $resource->file_original_name,
                'fileSizeBytes' => $resource->file_size_bytes,
                'mimeType' => $resource->mime_type,
                'url' => asset('storage/' . $resource->file_path),
            ],
        ], 201);
    }

    public function destroyResource(string $resourceUuid): JsonResponse
    {
        $resource = LessonResource::where('uuid', $resourceUuid)->firstOrFail();

        if ($resource->file_path) {
            Storage::disk('public')->delete($resource->file_path);
        }

        $resource->delete();

        return response()->json(['data' => ['status' => 'deleted']]);
    }
}
