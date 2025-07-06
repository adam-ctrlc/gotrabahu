<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $now = Carbon::now();

        return [
            'employeer_id' => $this->faker->randomElement([1, 2, 3]),
            'title' => $this->faker->jobTitle(),
            'description' => $this->faker->paragraph(),
            'location' => $this->faker->city(),
            'salary' => $this->faker->numberBetween(30000, 120000),
            'company' => $this->faker->company(),
            'contact' => $this->faker->phoneNumber(),
            'max_applicants' => $this->faker->numberBetween(1, 100),
            'type' => $this->faker->randomElement(['full_time', 'part_time', 'order']),
            'life_cycle' => $this->faker->randomElement(['active', 'ended']),
            'duration' => $this->faker->date(),
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
