<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
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
            'role' => $this->faker->randomElement(['admin', 'employeer', 'employee']),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'birth_date' => $this->faker->date(),
            'username' => $this->faker->unique()->userName(),
            'password' => Hash::make('password'),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'city' => $this->faker->city(),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'profile_picture' => $this->faker->imageUrl(),
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
