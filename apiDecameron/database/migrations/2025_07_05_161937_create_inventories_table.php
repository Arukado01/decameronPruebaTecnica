<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('room_inventories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained()->cascadeOnDelete();
            $table->foreignId('room_type_id')->constrained('room_types')->restrictOnDelete();
            $table->foreignId('accommodation_id')->constrained('accommodations')->restrictOnDelete();
            $table->unsignedSmallInteger('quantity');
            $table->timestamps();

            $table->unique(
                ['hotel_id', 'room_type_id', 'accommodation_id'],
                'room_inventories_composite_uid'
            );
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('room_inventories');
    }
};
