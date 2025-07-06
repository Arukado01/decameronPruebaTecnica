<?php

use App\Http\Controllers\Api\V1\AccommodationController;
use App\Http\Controllers\Api\V1\HotelController;
use App\Http\Controllers\Api\V1\InventoryController;
use App\Http\Controllers\Api\V1\RoomTypeController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::apiResource('hotels', HotelController::class)->except('show');

    // path:  /v1/hotels/{hotel}/inventories
    Route::get('hotels/{hotel}/inventories', [InventoryController::class, 'index']);

    Route::apiResource('inventories', InventoryController::class)
        ->except(['index', 'show']);

    Route::get('room-types', [RoomTypeController::class, 'index']);
    Route::get('accommodations', [AccommodationController::class, 'index']);
});
