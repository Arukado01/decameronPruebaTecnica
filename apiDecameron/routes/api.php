<?php

use App\Http\Controllers\Api\V1\HotelController;
use App\Http\Controllers\Api\V1\InventoryController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::apiResource('hotels', HotelController::class)->except('show');

    // path:  /v1/hotels/{hotel}/inventories
    Route::get('hotels/{hotel}/inventories', [InventoryController::class, 'index']);

    Route::apiResource('inventories', InventoryController::class)
        ->except(['index', 'show']);
});
