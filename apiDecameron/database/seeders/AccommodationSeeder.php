<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccommodationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // AccommodationSeeder
        DB::table('accommodations')->insert([
            ['name' => 'Sencilla', 'slug' => 'single', 'max_guests' => 1],
            ['name' => 'Doble', 'slug' => 'double', 'max_guests' => 2],
            ['name' => 'Triple', 'slug' => 'triple', 'max_guests' => 3],
            ['name' => 'Cuádruple', 'slug' => 'quad', 'max_guests' => 4],
        ]);
    }
}
