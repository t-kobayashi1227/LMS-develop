<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->foreignId('course_category_id')->constrained()->restrictOnDelete();
            $table->string('title', 500);
            $table->string('slug', 500)->unique();
            $table->text('description')->nullable();
            $table->string('thumbnail_path', 500)->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'course_category_id'], 'idx_courses_status_category');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
