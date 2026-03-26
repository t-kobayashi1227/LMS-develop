<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $students = User::where('role', 'student')
            ->withCount('enrollments')
            ->get();

        // 各受講者の平均進捗をDB集計で一括取得
        $progressByUser = DB::table('enrollments as e')
            ->join('chapters as ch', 'ch.course_id', '=', 'e.course_id')
            ->join('lessons as l', function ($join) {
                $join->on('l.chapter_id', '=', 'ch.id')
                    ->whereNull('l.deleted_at');
            })
            ->leftJoin('lesson_progress as lp', function ($join) {
                $join->on('lp.lesson_id', '=', 'l.id')
                    ->on('lp.enrollment_id', '=', 'e.id');
            })
            ->select(
                'e.user_id',
                DB::raw('ROUND(AVG(
                    COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) * 100.0
                    / NULLIF(COUNT(DISTINCT l.id), 0)
                ) OVER (PARTITION BY e.user_id), 0) as avg_progress')
            )
            ->groupBy('e.user_id', 'e.id')
            ->get()
            ->groupBy('user_id')
            ->map(fn ($rows) => round($rows->avg('avg_progress')));

        $students->each(function ($student) use ($progressByUser) {
            $student->avg_progress = $progressByUser[$student->id] ?? 0;
        });

        return StudentResource::collection($students);
    }
}
