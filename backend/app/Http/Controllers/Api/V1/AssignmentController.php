<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssignmentResource;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

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

    public function submit(Request $request, string $assignmentUuid): JsonResponse
    {
        $assignment = Assignment::where('uuid', $assignmentUuid)->firstOrFail();
        $user = $request->user();

        // Verify enrollment
        $enrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $assignment->course_id)
            ->exists();
        if (!$enrolled && !$user->isAdmin()) {
            abort(403, 'このコースに受講登録されていません。');
        }

        $validated = $request->validate([
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:10240',
        ]);

        $filePath = null;
        $fileName = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('submissions', 'public');
            $fileName = $request->file('file')->getClientOriginalName();
        }

        $submission = AssignmentSubmission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'user_id' => $user->id],
            [
                'content' => $validated['content'] ?? null,
                'file_path' => $filePath,
                'file_original_name' => $fileName,
                'status' => 'submitted',
                'submitted_at' => now(),
                'score' => null,
                'feedback' => null,
                'graded_by' => null,
                'graded_at' => null,
            ],
        );

        return response()->json([
            'data' => [
                'id' => $submission->uuid,
                'status' => 'submitted',
            ],
        ]);
    }

    public function showSubmission(string $submissionUuid): JsonResponse
    {
        $submission = AssignmentSubmission::where('uuid', $submissionUuid)
            ->with(['assignment.course', 'user'])
            ->firstOrFail();

        return response()->json([
            'data' => [
                'id' => $submission->uuid,
                'content' => $submission->content,
                'fileName' => $submission->file_original_name,
                'fileUrl' => $submission->file_path ? asset('storage/' . $submission->file_path) : null,
                'status' => $submission->status,
                'score' => $submission->score,
                'feedback' => $submission->feedback,
                'submittedAt' => $submission->submitted_at?->toIso8601String(),
                'gradedAt' => $submission->graded_at?->toIso8601String(),
                'assignmentTitle' => $submission->assignment->title,
                'assignmentDescription' => $submission->assignment->description,
                'maxScore' => $submission->assignment->max_score,
                'courseName' => $submission->assignment->course->title ?? '',
                'studentName' => $submission->user->name,
                'studentEmail' => $submission->user->email,
            ],
        ]);
    }

    public function grade(Request $request, string $submissionUuid): JsonResponse
    {
        $submission = AssignmentSubmission::where('uuid', $submissionUuid)
            ->with(['assignment', 'user'])
            ->firstOrFail();

        $validated = $request->validate([
            'score' => 'nullable|numeric|min:0',
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'status' => 'graded',
            'score' => $validated['score'] ?? null,
            'feedback' => $validated['feedback'] ?? null,
            'graded_by' => $request->user()->id,
            'graded_at' => now(),
        ]);

        return response()->json([
            'data' => [
                'id' => $submission->uuid,
                'status' => 'graded',
            ],
        ]);
    }
}
