<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'amount', 'level_id', 'due_date', 'description'])]
class Fee extends Model
{
    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
