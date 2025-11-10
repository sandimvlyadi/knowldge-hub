<?php

namespace App\Models;

use App\Models\Master\MasterIssueType;
use App\Models\Master\MasterPriority;
use App\Models\Master\MasterProject;
use App\Models\Master\MasterReporter;
use App\Models\Master\MasterStatus;
use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Issue extends Model
{
    use Blameable, SoftDeletes;

    protected $table = 'issues';

    protected $fillable = [
        'ref_id',
        'key',
        'url',
        'summary',
        'description',
        'components',
        'created',
        'ref_project_id',
        'ref_issue_type_id',
        'ref_priority_id',
        'ref_status_id',
        'ref_reporter_key',
    ];

    protected $hidden = [
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function project()
    {
        return $this->belongsTo(MasterProject::class, 'ref_project_id', 'ref_id');
    }

    public function issueType()
    {
        return $this->belongsTo(MasterIssueType::class, 'ref_issue_type_id', 'ref_id');
    }

    public function priority()
    {
        return $this->belongsTo(MasterPriority::class, 'ref_priority_id', 'ref_id');
    }

    public function status()
    {
        return $this->belongsTo(MasterStatus::class, 'ref_status_id', 'ref_id');
    }

    public function reporter()
    {
        return $this->belongsTo(MasterReporter::class, 'ref_reporter_key', 'key');
    }
}
