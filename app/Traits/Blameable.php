<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

trait Blameable
{
    public static function bootBlameable()
    {
        static::creating(function ($model) {
            if (Auth::check()) {
                if ($model->hasColumn('created_by')) {
                    $model->created_by = Auth::id();
                }
            }
        });

        static::updating(function ($model) {
            if (Auth::check()) {
                if ($model->hasColumn('updated_by')) {
                    $model->updated_by = Auth::id();
                }
            }
        });

        static::deleting(function ($model) {
            if (Auth::check() && $model->usesSoftDeletes()) {
                if ($model->hasColumn('deleted_by')) {
                    $model->deleted_by = Auth::id();
                    $model->saveQuietly();
                }
            }
        });
    }

    protected function hasColumn($column)
    {
        return Schema::hasColumn($this->getTable(), $column);
    }

    protected function usesSoftDeletes()
    {
        return in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses_recursive($this));
    }

    // 🔹 Relasi otomatis (hanya dipakai kalau kolomnya ada)
    public function creator()
    {
        return $this->hasColumn('created_by')
            ? $this->belongsTo(User::class, 'created_by')
            : null;
    }

    public function updater()
    {
        return $this->hasColumn('updated_by')
            ? $this->belongsTo(User::class, 'updated_by')
            : null;
    }

    public function deleter()
    {
        return $this->hasColumn('deleted_by')
            ? $this->belongsTo(User::class, 'deleted_by')
            : null;
    }
}
