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
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->string('ref_id')->unique();
            $table->string('key')->unique();
            $table->string('url');
            $table->text('summary')->nullable();
            $table->text('description')->nullable();
            $table->text('components')->nullable();
            $table->timestamp('created')->nullable();
            $table->string('ref_status_id');
            $table->foreign('ref_project_id')->references('ref_id')->on('master_projects');
            $table->string('ref_issue_type_id');
            $table->foreign('ref_issue_type_id')->references('ref_id')->on('master_issue_types');
            $table->string('ref_priority_id');
            $table->foreign('ref_priority_id')->references('ref_id')->on('master_priorities');
            $table->string('ref_status_id');
            $table->foreign('ref_status_id')->references('ref_id')->on('master_statuses');
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
        Schema::dropIfExists('issues');
    }
};
