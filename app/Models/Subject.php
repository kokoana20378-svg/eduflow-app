<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'level_id', 'code'])]
class Subject extends Model
{
    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }
}
