<?php

use App\Http\Controllers\Api\V1\AnalyticsController;
use App\Http\Controllers\Api\V1\AssignmentController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CourseController;
use App\Http\Controllers\Api\V1\LessonController;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Middleware\UpdateLastActive;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/course-categories', [CourseController::class, 'categories']);

    // Authenticated
    Route::middleware(['auth:sanctum', UpdateLastActive::class])->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'currentUser']);

        // Student / shared
        Route::get('/courses', [CourseController::class, 'index']);
        Route::get('/courses/{courseUuid}/chapters', [LessonController::class, 'chapters']);
        Route::get('/lessons/{lessonUuid}', [LessonController::class, 'show']);
        Route::post('/lessons/{lessonUuid}/progress', [LessonController::class, 'updateProgress']);
        Route::get('/assignments', [AssignmentController::class, 'index']);

        // Admin only
        Route::middleware(EnsureAdmin::class)->group(function () {
            Route::get('/students', [StudentController::class, 'index']);
            Route::get('/analytics/kpi', [AnalyticsController::class, 'adminKpi']);
            Route::get('/analytics/monthly-students', [AnalyticsController::class, 'monthlyStudents']);
            Route::get('/analytics/course-performance', [AnalyticsController::class, 'coursePerformance']);
            Route::get('/analytics/recent-activity', [AnalyticsController::class, 'recentActivity']);
        });
    });
});
