<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $students = User::where('role', 'student')
            ->withCount('enrollments')
            ->get();

        // 各受講者の平均進捗をDB集計で一括取得（MySQL 5.7互換）
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
                DB::raw('ROUND(
                    COUNT(DISTINCT CASE WHEN lp.completed_at IS NOT NULL THEN lp.lesson_id END) * 100.0
                    / NULLIF(COUNT(DISTINCT l.id), 0)
                , 0) as course_progress')
            )
            ->groupBy('e.user_id', 'e.id')
            ->get()
            ->groupBy('user_id')
            ->map(fn ($rows) => (int) round($rows->avg('course_progress')));

        $students->each(function ($student) use ($progressByUser) {
            $student->avg_progress = $progressByUser[$student->id] ?? 0;
        });

        return StudentResource::collection($students);
    }

    public function destroy(string $uuid): JsonResponse
    {
        $user = User::where('uuid', $uuid)->where('role', 'student')->firstOrFail();
        $user->delete();

        return response()->json(['data' => ['status' => 'deleted']]);
    }
}
