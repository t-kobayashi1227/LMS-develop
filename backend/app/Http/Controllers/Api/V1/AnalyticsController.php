<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\RecentActivityResource;
use App\Models\ActivityLog;
use App\Models\AssignmentSubmission;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function adminKpi(): array
    {
        $activeStudents = User::where('role', 'student')
            ->whereNull('deleted_at')
            ->where('last_active_at', '>=', now()->subDays(30))
            ->count();

        $publishedCourses = Course::where('status', 'published')
            ->whereNull('deleted_at')
            ->count();

        $pendingSubmissions = AssignmentSubmission::where('status', 'submitted')->count();

        $avgCompletion = (int) DB::table(
            DB::raw('(' . DB::table('enrollments as e')
                ->join('chapters as ch', 'ch.course_id', '=', 'e.course_id')
                ->join('lessons as l', function ($join) {
                    $join->on('l.chapter_id', '=', 'ch.id')
                        ->whereNull('l.deleted_at');
                })
                ->leftJoin('lesson_progress as lp', function ($join) {
                    $join->on('lp.lesson_id', '=', 'l.id')
                        ->on('lp.enrollment_id', '=', 'e.id');
                })
                ->groupBy('e.id')
                ->selectRaw('ROUND(
                    COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) * 100.0
                    / NULLIF(COUNT(DISTINCT l.id), 0), 0
                ) as progress')
                ->toRawSql() . ') as sub')
        )->selectRaw('ROUND(AVG(progress), 0) as avg_completion')->value('avg_completion') ?? 0;

        $totalHours = (int) round(
            DB::table('lesson_progress')->sum('time_spent_seconds') / 3600
        );

        return [
            'data' => [
                'activeStudents' => $activeStudents,
                'publishedCourses' => $publishedCourses,
                'pendingSubmissions' => $pendingSubmissions,
                'avgCompletion' => $avgCompletion,
                'totalHours' => $totalHours,
            ],
        ];
    }

    public function monthlyStudents(): array
    {
        $rows = DB::table('activity_logs as al')
            ->join('users as u', function ($join) {
                $join->on('u.id', '=', 'al.user_id')
                    ->where('u.role', '=', 'student')
                    ->whereNull('u.deleted_at');
            })
            ->whereIn('al.type', ['login', 'complete', 'submit', 'enroll'])
            ->where('al.created_at', '>=', now()->subMonths(6))
            ->select('al.user_id', 'al.created_at')
            ->get();

        // PHP 側で月別に集計（DB方言非依存）
        $data = $rows->groupBy(fn ($row) => substr($row->created_at, 0, 7))
            ->map(fn ($group, $key) => [
                'month' => ((int) substr($key, 5)) . '月',
                'students' => $group->unique('user_id')->count(),
            ])
            ->sortKeys()
            ->values();

        return ['data' => $data];
    }

    public function coursePerformance(): array
    {
        // enrollment 別の進捗をサブクエリで取得
        $progressSub = DB::table('enrollments as e2')
            ->join('chapters as ch', 'ch.course_id', '=', 'e2.course_id')
            ->join('lessons as l', function ($join) {
                $join->on('l.chapter_id', '=', 'ch.id')
                    ->whereNull('l.deleted_at');
            })
            ->leftJoin('lesson_progress as lp', function ($join) {
                $join->on('lp.lesson_id', '=', 'l.id')
                    ->on('lp.enrollment_id', '=', 'e2.id');
            })
            ->groupBy('e2.id')
            ->selectRaw('e2.id as enrollment_id, ROUND(
                COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) * 100.0
                / NULLIF(COUNT(DISTINCT l.id), 0), 0
            ) as progress');

        $courseStats = DB::table('courses as c')
            ->leftJoin('enrollments as e', 'e.course_id', '=', 'c.id')
            ->leftJoinSub($progressSub, 'sub', 'sub.enrollment_id', '=', 'e.id')
            ->leftJoin('course_ratings as cr', 'cr.course_id', '=', 'c.id')
            ->where('c.status', 'published')
            ->whereNull('c.deleted_at')
            ->groupBy('c.id', 'c.title')
            ->select(
                'c.title as name',
                DB::raw('COUNT(DISTINCT e.user_id) as students'),
                DB::raw('COALESCE(ROUND(AVG(sub.progress), 0), 0) as avgProgress'),
                DB::raw('ROUND(
                    SUM(CASE WHEN e.completed_at IS NOT NULL THEN 1 ELSE 0 END) * 100.0
                    / NULLIF(COUNT(DISTINCT e.id), 0), 0
                ) as completionRate'),
                DB::raw('COALESCE(ROUND(AVG(cr.rating), 1), 0) as satisfaction')
            )
            ->get();

        return ['data' => $courseStats];
    }

    public function pendingSubmissions(): JsonResponse
    {
        $submissions = AssignmentSubmission::where('status', 'submitted')
            ->with(['assignment', 'user'])
            ->orderByDesc('submitted_at')
            ->limit(10)
            ->get()
            ->map(fn ($s) => [
                'id' => $s->uuid,
                'assignmentTitle' => $s->assignment->title ?? '',
                'studentName' => $s->user->name ?? '',
                'studentAvatar' => $s->user->avatarUrl(),
                'submittedAt' => $s->submitted_at->locale('ja')->diffForHumans(),
            ]);

        return response()->json(['data' => $submissions]);
    }

    public function recentActivity(): AnonymousResourceCollection
    {
        $activities = ActivityLog::whereIn('type', ['complete', 'submit', 'enroll', 'warning'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return RecentActivityResource::collection($activities);
    }
}
