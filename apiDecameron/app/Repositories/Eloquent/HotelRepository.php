<?php

namespace App\Repositories\Eloquent;

use App\Models\Hotel;
use App\DTO\HotelData;
use App\Repositories\Contracts\HotelRepositoryInterface;
use Illuminate\Support\Collection;

class HotelRepository implements HotelRepositoryInterface
{
    public function all(): Collection
    {
        return Hotel::withCount('inventories')->get();
    }

    public function create(HotelData $data): Hotel
    {
        return Hotel::create($data->toArray());
    }

    public function update(int $id, HotelData $data): Hotel
    {
        $hotel = Hotel::findOrFail($id);
        $hotel->update($data->toArray());
        return $hotel;
    }

    public function delete(int $id): void
    {
        Hotel::findOrFail($id)->delete();
    }
}
