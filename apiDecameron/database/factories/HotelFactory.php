<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hotel>
 */
class HotelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'      => $this->faker->company . ' Hotel',
            'nit'       => $this->faker->unique()->numerify('########-#'),
            'address'   => $this->faker->streetAddress,
            'city'      => $this->faker->city,
            'max_rooms' => $this->faker->numberBetween(10, 50),
        ];
    }
}
