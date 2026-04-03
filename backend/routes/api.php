<?php

use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\AssignmentController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AdminCourseController;
use App\Http\Controllers\Api\V1\CourseController;
use App\Http\Controllers\Api\V1\LessonController;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\UpdateLastActive;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public
    Route::get('/health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()->toIso8601String()]));
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::get('/course-categories', [CourseController::class, 'categories']);

    // Authenticated
    Route::middleware(['auth:sanctum', UpdateLastActive::class])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'currentUser']);
        Route::put('/user', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'changePassword']);

        // Student / shared
        Route::get('/courses', [CourseController::class, 'index']);
        Route::get('/courses/{courseUuid}/chapters', [LessonController::class, 'chapters']);
        Route::get('/lessons/{lessonUuid}', [LessonController::class, 'show']);
        Route::post('/lessons/{lessonUuid}/progress', [LessonController::class, 'updateProgress']);
        Route::post('/lessons/{lessonUuid}/quiz-answers', [LessonController::class, 'submitQuizAnswers']);
        Route::get('/assignments', [AssignmentController::class, 'index']);
        Route::post('/assignments/{uuid}/submit', [AssignmentController::class, 'submit']);

        // Admin only
        Route::middleware(EnsureAdmin::class)->group(function () {
            Route::get('/students', [StudentController::class, 'index']);
            Route::get('/admin/students', [StudentController::class, 'index']);
            Route::delete('/students/{uuid}', [StudentController::class, 'destroy']);
            Route::get('/analytics/kpi', [AnalyticsController::class, 'adminKpi']);
            Route::get('/analytics/monthly-students', [AnalyticsController::class, 'monthlyStudents']);
            Route::get('/analytics/course-performance', [AnalyticsController::class, 'coursePerformance']);
            Route::get('/analytics/recent-activity', [AnalyticsController::class, 'recentActivity']);
            Route::get('/analytics/pending-submissions', [AnalyticsController::class, 'pendingSubmissions']);
            Route::get('/admin/submissions/{uuid}', [AssignmentController::class, 'showSubmission']);
            Route::put('/admin/submissions/{uuid}/grade', [AssignmentController::class, 'grade']);

            // Course CRUD
            Route::get('/admin/categories', [AdminCourseController::class, 'categoriesWithId']);
            Route::get('/admin/courses', [AdminCourseController::class, 'index']);
            Route::post('/admin/courses', [AdminCourseController::class, 'store']);
            Route::get('/admin/courses/{uuid}', [AdminCourseController::class, 'show']);
            Route::put('/admin/courses/{uuid}', [AdminCourseController::class, 'update']);
            Route::delete('/admin/courses/{uuid}', [AdminCourseController::class, 'destroy']);
            Route::post('/admin/courses/{uuid}/thumbnail', [AdminCourseController::class, 'uploadThumbnail']);

            // Enrollment management
            Route::get('/admin/courses/{uuid}/enrollments', [AdminCourseController::class, 'enrollments']);
            Route::post('/admin/courses/{uuid}/enrollments', [AdminCourseController::class, 'enroll']);
            Route::delete('/admin/courses/{uuid}/enrollments/{enrollmentUuid}', [AdminCourseController::class, 'unenroll']);

            // Chapter CRUD
            Route::post('/admin/courses/{courseUuid}/chapters', [AdminCourseController::class, 'storeChapter']);
            Route::put('/admin/chapters/{uuid}', [AdminCourseController::class, 'updateChapter']);
            Route::delete('/admin/chapters/{uuid}', [AdminCourseController::class, 'destroyChapter']);

            // Lesson CRUD
            Route::post('/admin/chapters/{chapterUuid}/lessons', [AdminCourseController::class, 'storeLesson']);
            Route::put('/admin/lessons/{uuid}', [AdminCourseController::class, 'updateLesson']);
            Route::delete('/admin/lessons/{uuid}', [AdminCourseController::class, 'destroyLesson']);

            // Quiz CRUD
            Route::post('/admin/lessons/{lessonUuid}/quiz', [AdminCourseController::class, 'storeQuiz']);
            Route::put('/admin/quiz/{uuid}', [AdminCourseController::class, 'updateQuiz']);
            Route::delete('/admin/quiz/{uuid}', [AdminCourseController::class, 'destroyQuiz']);
        });
    });
});
