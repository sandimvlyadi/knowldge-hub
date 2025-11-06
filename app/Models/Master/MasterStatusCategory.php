<?php

namespace App\Models\Master;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterStatusCategory extends Model
{
    use Blameable, SoftDeletes;

    protected $table = 'master_status_categories';

    protected $fillable = [
        'ref_id',
        'key',
        'name',
        'color_name',
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
