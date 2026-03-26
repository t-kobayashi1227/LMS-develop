<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['choice', 'text']);
            $table->text('question_text');
            $table->json('options')->nullable();
            $table->smallInteger('correct_option_index')->unsigned()->nullable();
            $table->json('conditions')->nullable();
            $table->smallInteger('sort_order')->unsigned()->default(0);
            $table->timestamps();

            $table->index(['lesson_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
