<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\CourseCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Course::where('status', 'published')
            ->with('category')
            ->withCount(['enrollments', 'lessons']);

        if ($category = $request->query('category')) {
            if ($category !== 'All') {
                $query->whereHas('category', fn ($q) => $q->where('name', $category));
            }
        }

        $courses = $query->get();

        // 認証ユーザーの進捗を付与
        $user = $request->user();
        if ($user) {
            $completedByCourse = DB::table('enrollments as e')
                ->join('lesson_progress as lp', function ($join) {
                    $join->on('lp.enrollment_id', '=', 'e.id')
                        ->whereNotNull('lp.completed_at');
                })
                ->where('e.user_id', $user->id)
                ->groupBy('e.course_id')
                ->select('e.course_id', DB::raw('COUNT(lp.id) as completed'))
                ->pluck('completed', 'course_id');

            $courses->each(function ($course) use ($completedByCourse) {
                $course->completed_lessons_count = $completedByCourse[$course->id] ?? 0;
            });
        }

        return CourseResource::collection($courses);
    }

    public function categories(): array
    {
        $categories = CourseCategory::orderBy('sort_order')
            ->pluck('name')
            ->toArray();

        return ['data' => array_merge(['All'], $categories)];
    }
}
