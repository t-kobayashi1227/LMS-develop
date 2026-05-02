<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CourseCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:course_categories,name',
        ]);

        $maxOrder = CourseCategory::max('sort_order') ?? -1;
        $category = CourseCategory::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'sort_order' => $maxOrder + 1,
        ]);

        return response()->json(['data' => $category], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = CourseCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:course_categories,name,' . $id,
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
        ]);

        return response()->json(['data' => $category]);
    }

    public function destroy(int $id): JsonResponse
    {
        $category = CourseCategory::findOrFail($id);

        if ($category->courses()->count() > 0) {
            return response()->json(
                ['message' => 'このカテゴリは使用中のコースがあるため削除できません'],
                422
            );
        }

        $category->delete();

        return response()->json(['data' => ['status' => 'deleted']]);
    }
}
