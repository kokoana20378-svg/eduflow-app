<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['type', 'recipient_type', 'recipient_id', 'title', 'message', 'status', 'sent_at'])]
class Notification extends Model
{
    //
}
