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
        Schema::create('feature_library', function (Blueprint $table) {
            $table->string('feature_key');
            $table->string('library_name');

            $table->foreign('feature_key')->references('key')->on('features');
            $table->foreign('library_name')->references('name')->on('libraries');

            $table->primary(['feature_key', 'library_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feature_library');
    }
};
