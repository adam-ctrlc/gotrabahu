<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserPreviousJob extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'job_id',
    ];
}
