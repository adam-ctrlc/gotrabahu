<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApplyJob>
 */
class ApplyJobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $now = Carbon::now();
        
        // Generate unique combinations to avoid constraint violations
        static $usedCombinations = [];
        
        do {
            $jobId = $this->faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            $userId = $this->faker->randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            $combination = $jobId . '-' . $userId;
        } while (in_array($combination, $usedCombinations));
        
        $usedCombinations[] = $combination;

        return [
            'job_id' => $jobId,
            'user_id' => $userId,
            'status' => $this->faker->randomElement(['applied', 'accepted', 'rejected']),
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
