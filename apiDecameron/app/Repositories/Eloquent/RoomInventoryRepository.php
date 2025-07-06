<?php

namespace App\Repositories\Eloquent;

use App\Models\RoomInventory;
use App\DTO\InventoryData;
use App\Repositories\Contracts\RoomInventoryRepositoryInterface;
use Illuminate\Support\Collection;

class RoomInventoryRepository implements RoomInventoryRepositoryInterface
{
    public function byHotel(int $hotelId): Collection
    {
        return RoomInventory::whereHotelId($hotelId)
            ->with(['type', 'accommodation'])
            ->get();
    }

    public function create(InventoryData $data): RoomInventory
    {
        return RoomInventory::create($data->toArray());
    }

    public function update(int $id, InventoryData $data): RoomInventory
    {
        $inv = RoomInventory::findOrFail($id);
        $inv->update($data->toArray());
        return $inv;
    }

    public function delete(int $id): void
    {
        RoomInventory::findOrFail($id)->delete();
    }
}
