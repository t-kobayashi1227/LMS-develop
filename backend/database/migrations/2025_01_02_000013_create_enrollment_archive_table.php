<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollment_archive', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('original_enrollment_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('course_id');
            $table->string('table_name', 50);
            $table->unsignedBigInteger('record_id');
            $table->json('data');
            $table->timestamp('archived_at')->useCurrent();

            $table->index(['user_id', 'course_id']);
            $table->index('original_enrollment_id');
            $table->index(['table_name', 'archived_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollment_archive');
    }
};
