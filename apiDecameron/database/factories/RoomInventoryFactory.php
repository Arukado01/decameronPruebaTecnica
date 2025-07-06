<?php

namespace Database\Factories;

use App\Models\Accommodation;
use App\Models\RoomType;
use App\Models\Hotel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RoomInventory>
 */
class RoomInventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'hotel_id'        => Hotel::factory(),
            'room_type_id'    => RoomType::inRandomOrder()->first()->id ?? 1,
            'accommodation_id' => Accommodation::inRandomOrder()->first()->id ?? 1,
            'quantity'        => $this->faker->numberBetween(1, 10),
        ];
    }
}
