<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->foreignId('lesson_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title', 500);
            $table->text('description')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->decimal('max_score', 5, 2)->nullable();
            $table->smallInteger('sort_order')->unsigned()->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('lesson_id');
            $table->index('course_id');
            $table->index('due_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
