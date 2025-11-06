<?php

namespace App\Models\Master;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MasterStatus extends Model
{
    use Blameable, SoftDeletes;

    protected $table = 'master_statuses';

    protected $fillable = [
        'ref_id',
        'name',
        'icon_url',
        'description',
        'ref_status_category_id',
    ];

    protected $hidden = [
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function statusCategory()
    {
        return $this->belongsTo(MasterStatusCategory::class, 'ref_status_category_id', 'ref_id');
    }
}
