<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lesson_resources', function (Blueprint $table) {
            $table->id();
            $table->char('uuid', 36)->unique();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->string('title', 255);
            $table->string('file_path', 500);
            $table->string('file_original_name', 255);
            $table->unsignedInteger('file_size_bytes')->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->smallInteger('sort_order')->unsigned()->default(0);
            $table->timestamps();

            $table->index(['lesson_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_resources');
    }
};
