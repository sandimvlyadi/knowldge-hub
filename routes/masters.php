<?php

use App\Http\Controllers\Master\MasterIssueTypeController;
use App\Http\Controllers\Master\MasterProjectController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('master/projects/data', [MasterProjectController::class, 'data'])->name('master.projects.data');
    Route::resource('master/projects', MasterProjectController::class)->parameters([
        'projects' => 'record',
    ])->except(['create', 'show', 'edit'])->names('master.projects')->withTrashed();

    Route::get('master/issuetypes/data', [MasterIssueTypeController::class, 'data'])->name('master.issuetypes.data');
    Route::resource('master/issuetypes', MasterIssueTypeController::class)->parameters([
        'issuetypes' => 'record',
    ])->except(['create', 'show', 'edit'])->names('master.issuetypes')->withTrashed();

    Route::get('master/priorities/data', [MasterProjectController::class, 'data'])->name('master.priorities.data');
    Route::resource('master/priorities', MasterProjectController::class)->parameters([
        'priorities' => 'record',
    ])->except(['create', 'show', 'edit'])->names('master.priorities')->withTrashed();

    Route::get('master/statuses/data', [MasterProjectController::class, 'data'])->name('master.statuses.data');
    Route::resource('master/statuses', MasterProjectController::class)->parameters([
        'statuses' => 'record',
    ])->except(['create', 'show', 'edit'])->names('master.statuses')->withTrashed();
});
