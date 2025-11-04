<?php

namespace App\Models\Master;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterProject extends Model
{
    use Blameable, SoftDeletes;

    protected $table = 'master_projects';

    protected $fillable = [
        'ref_id',
        'key',
        'name',
        'avatar',
        'archived',
        'url',
        'description',
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
        'archived' => 'boolean',
    ];
}
