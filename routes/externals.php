<?php

use App\Http\Controllers\ExternalController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('external/getOptions', [ExternalController::class, 'getOptions'])->name('external.getOptions');
});
