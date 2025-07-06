<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Contracts\HotelRepositoryInterface::class,
            \App\Repositories\Eloquent\HotelRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\RoomInventoryRepositoryInterface::class,
            \App\Repositories\Eloquent\RoomInventoryRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
