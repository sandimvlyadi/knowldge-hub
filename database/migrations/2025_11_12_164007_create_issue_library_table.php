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
        Schema::create('issue_library', function (Blueprint $table) {
            $table->string('issue_key');
            $table->string('library_name');

            $table->foreign('issue_key')->references('key')->on('issues');
            $table->foreign('library_name')->references('name')->on('libraries');

            $table->primary(['issue_key', 'library_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('issue_library');
    }
};
