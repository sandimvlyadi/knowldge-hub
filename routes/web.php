<?php

use App\Http\Controllers\FeatureController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\LibraryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('features', [FeatureController::class, 'index'])->name('features.index');
    Route::get('features/data', [FeatureController::class, 'data'])->name('features.data');
    Route::get('features/all-graphs', [FeatureController::class, 'allGraphs'])->name('features.allGraphs');
    Route::get('features/generate-key', [FeatureController::class, 'generateKey'])->name('features.generateKey');
    Route::get('features/{key}', [FeatureController::class, 'key'])->name('features.key');
    Route::resource('features', FeatureController::class)->parameters([
        'features' => 'record',
    ])->except(['create', 'show', 'edit'])->names('features')->withTrashed();

    Route::get('issues', [IssueController::class, 'index'])->name('issues.index');
    Route::get('issues/data', [IssueController::class, 'data'])->name('issues.data');
    Route::get('issues/all-graphs', [IssueController::class, 'allGraphs'])->name('issues.allGraphs');
    Route::get('issues/{key}', [IssueController::class, 'key'])->name('issues.key');

    Route::get('libraries/data', [LibraryController::class, 'data'])->name('libraries.data');
    Route::get('libraries/option', [LibraryController::class, 'option'])->name('libraries.option');
    Route::resource('libraries', LibraryController::class)->parameters([
        'libraries' => 'record',
    ])->except(['create', 'show', 'edit'])->names('libraries')->withTrashed();
});

require __DIR__.'/masters.php';
require __DIR__.'/externals.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
