<?php

namespace App\Models\Master;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterReporter extends Model
{
    use Blameable, SoftDeletes;

    protected $table = 'master_reporters';

    protected $fillable = [
        'key',
        'name',
        'display_name',
        'avatar',
        'active',
        'time_zone',
    ];

    protected $hidden = [
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
}
