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
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('summary')->nullable();
            $table->text('description')->nullable();
            $table->text('components')->nullable();
            $table->foreignId('ref_project_id')->constrained('master_projects', 'ref_id');
            $table->foreignId('ref_issue_type_id')->constrained('master_issue_types', 'ref_id');
            $table->foreignId('ref_priority_id')->constrained('master_priorities', 'ref_id');
            $table->foreignId('ref_status_id')->constrained('master_statuses', 'ref_id');
            $table->string('ref_reporter_key');
            $table->foreign('ref_reporter_key')->references('key')->on('master_reporters');
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->foreignId('deleted_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('features');
    }
};
