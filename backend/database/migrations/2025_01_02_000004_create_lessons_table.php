<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->foreignId('chapter_id')->constrained()->cascadeOnDelete();
            $table->string('title', 500);
            $table->enum('type', ['video', 'text', 'assignment']);
            $table->boolean('has_video')->default(false);
            $table->unsignedInteger('duration_seconds')->nullable();
            $table->longText('content_body')->nullable();
            $table->string('video_url', 1000)->nullable();
            $table->smallInteger('sort_order')->unsigned()->default(0);
            $table->boolean('is_free_preview')->default(false);
            $table->foreignId('prerequisite_lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['chapter_id', 'sort_order']);
            $table->index('prerequisite_lesson_id');
            $table->index('deleted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
