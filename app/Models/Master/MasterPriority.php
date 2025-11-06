<?php

namespace App\Models\Master;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterPriority extends Model
{
    use Blameable, SoftDeletes;

    protected $table = 'master_priorities';

    protected $fillable = [
        'ref_id',
        'name',
        'icon_url',
        'status_color',
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
}
