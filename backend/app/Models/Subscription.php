<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'plan',
        'description',
        'price',
        'status'
    ];

    protected $casts = [
        'description' => 'array'
    ];
}
