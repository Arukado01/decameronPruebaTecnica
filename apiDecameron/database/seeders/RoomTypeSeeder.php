<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // RoomTypeSeeder
        DB::table('room_types')->insert([
            ['name' => 'Estándar', 'slug' => 'standard'],
            ['name' => 'Junior', 'slug' => 'junior'],
            ['name' => 'Suite', 'slug' => 'suite'],
        ]);
    }
}
