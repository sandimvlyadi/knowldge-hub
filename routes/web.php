<?php

use App\Http\Controllers\IssueController;
use App\Http\Controllers\Master\MasterProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('issues', [IssueController::class, 'index'])->name('issues.index');
    Route::get('issues/data', [IssueController::class, 'data'])->name('issues.data');
    Route::get('issues/options/project', [IssueController::class, 'projectOptions'])->name('issues.options.project');
    Route::get('issues/options/issuetype', [IssueController::class, 'issueTypeOptions'])->name('issues.options.issuetype');
    Route::get('issues/options/status', [IssueController::class, 'statusOptions'])->name('issues.options.status');
    Route::get('issues/options/priority', [IssueController::class, 'priorityOptions'])->name('issues.options.priority');

    Route::get('master/projects/data', [MasterProjectController::class, 'data'])->name('master.projects.data');
    Route::resource('master/projects', MasterProjectController::class)->parameters([
        'projects' => 'record',
    ])->names('master.projects')->withTrashed();
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
