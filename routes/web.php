<?php

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

    Route::get('issues', [IssueController::class, 'index'])->name('issues.index');
    Route::get('issues/data', [IssueController::class, 'data'])->name('issues.data');
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
