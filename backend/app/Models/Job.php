<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Job extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'employeer_id',
        'title',
        'description',
        'location',
        'salary',
        'company',
        'contact',
        'life_cycle',
        'status',
        'duration',
    ];

    protected $appends = ['employer_full_name'];

    protected $casts = [
        'duration' => 'date',
    ];

    public function applications()
    {
        return $this->hasMany(ApplyJob::class, 'job_id');
    }

    public function employer()
    {
        return $this->belongsTo(User::class, 'employeer_id');
    }

    public function getEmployerFullNameAttribute()
    {
        return $this->employer ? $this->employer->full_name : null;
    }
}
