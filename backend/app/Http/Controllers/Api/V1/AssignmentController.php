<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AssignmentController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $enrolledCourseIds = Enrollment::where('user_id', $user->id)->pluck('course_id');
        $assignments = Assignment::with('course')
            ->whereIn('course_id', $enrolledCourseIds)
            ->get();

        $submissions = AssignmentSubmission::where('user_id', $user->id)
            ->pluck('status', 'assignment_id');

        $assignments->each(function ($assignment) use ($submissions) {
            $assignment->student_status = $submissions[$assignment->id] ?? 'pending';
        });

        return AssignmentResource::collection($assignments);
    }
}
