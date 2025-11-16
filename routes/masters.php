<?php

use App\Http\Controllers\Master\MasterIssueTypeController;
use App\Http\Controllers\Master\MasterPriorityController;
use App\Http\Controllers\Master\MasterProjectController;
use App\Http\Controllers\Master\MasterReporterController;
use App\Http\Controllers\Master\MasterStatusController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('master/projects/data', [MasterProjectController::class, 'data'])->name('master.projects.data');
    Route::get('master/projects/option', [MasterProjectController::class, 'option'])->name('master.projects.option');
    Route::resource('master/projects', MasterProjectController::class)->parameters([
        'projects' => 'record',
    ])->except(['create', 'show', 'edit'])->names('master.projects')->withTrashed();

    Route::get('master/issuetypes/data', [MasterIssueTypeController::class, 'data'])->name('master.issuetypes.data');
    Route::get('master/issuetypes/option', [MasterIssueTypeController::class, 'option'])->name('master.issuetypes.option');
    Route::resource('master/issuetypes', MasterIssueTypeController::class)->parameters([
        'issuetypes' => 'record',
    ])->except(['create', 'show', 'edit'])->names('master.issuetypes')->withTrashed();

    Route::get('master/priorities/data', [MasterPriorityController::class, 'data'])->name('master.priorities.data');
    Route::get('master/priorities/option', [MasterPriorityController::class, 'option'])->name('master.priorities.option');
    Route::resource('master/priorities', MasterPriorityController::class)->parameters([
        'priorities' => 'record',
    ])->except(['create', 'show', 'edit'])->names('master.priorities')->withTrashed();

    Route::get('master/statuses/data', [MasterStatusController::class, 'data'])->name('master.statuses.data');
    Route::get('master/statuses/option', [MasterStatusController::class, 'option'])->name('master.statuses.option');
    Route::get('master/statuses/categories', [MasterStatusController::class, 'optionCategory'])->name('master.statuses.option.category');
    Route::resource('master/statuses', MasterStatusController::class)->parameters([
        'statuses' => 'record',
    ])->except(['create', 'show', 'edit'])->names('master.statuses')->withTrashed();

    Route::get('master/reporters/data', [MasterReporterController::class, 'data'])->name('master.reporters.data');
    Route::get('master/reporters/option', [MasterReporterController::class, 'option'])->name('master.reporters.option');
    Route::resource('master/reporters', MasterReporterController::class)->parameters([
        'reporters' => 'record',
    ])->except(['create', 'show', 'edit'])->names('master.reporters')->withTrashed();
});
