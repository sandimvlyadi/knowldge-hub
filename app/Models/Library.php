<?php

namespace App\Models;

use App\Traits\Blameable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Library extends Model
{
    use Blameable, SoftDeletes;

    protected $table = 'libraries';

    protected $fillable = [
        'name',
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

    protected $appends = ['used_in_issues_count'];

    public function issues()
    {
        return $this->belongsToMany(Issue::class, 'issue_library', 'library_name', 'issue_key', 'name', 'key');
    }

    public function getUsedInIssuesCountAttribute(): int
    {
        return $this->issues()->count();
    }
}
