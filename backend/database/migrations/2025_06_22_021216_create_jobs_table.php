<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId(column: 'employeer_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('description');
            $table->string('location');
            $table->string('salary');
            $table->string('company');
            $table->string('contact');
            $table->string('max_applicants')->default('20');
            $table->enum('type', ['full_time', 'part_time', 'order'])->default('full_time');
            $table->enum('life_cycle', allowed: ['active', 'ended'])->default('active');
            $table->date('duration');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
