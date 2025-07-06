<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->enum('plan', ['20_token', 'unlimited_token'])->default('20_token');
            $table->json('description');
            $table->string('price');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->softDeletes();
            $table->timestamps();
        });

        $now = Carbon::now();

        DB::table('subscriptions')->insert([
            [
                'plan' => '20_token',
                'description' => json_encode([
                    'Accept up to 3 jobs each month',
                    'Ideal for part-time earners or those exploring opportunities',
                ]),
                'price' => '250',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'plan' => 'unlimited_token',
                'description' => json_encode([
                    'Accept as many jobs as you want with no monthly limits',
                    'Perfect for full-time freelancers or highly active users',
                    'Enjoy peace of mind knowing you’re free to apply anytime',
                ]),
                'price' => '500',
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
