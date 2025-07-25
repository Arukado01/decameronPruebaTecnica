<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->string('name', 30)->unique();
            $table->string('slug', 30)->unique();
            $table->unsignedTinyInteger('max_guests');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};
