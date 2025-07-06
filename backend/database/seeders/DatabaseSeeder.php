<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Job;
use App\Models\ApplyJob;
use App\Models\UserPreviousJob;
use App\Models\Rating;
use App\Models\Notification;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(20)->create();
        Job::factory(20)->create();
        ApplyJob::factory(10)->create();
    }
}   
