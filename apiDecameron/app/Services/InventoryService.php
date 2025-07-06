<?php

namespace App\Services;

use App\DTO\InventoryData;
use App\Repositories\Contracts\RoomInventoryRepositoryInterface;
use App\Models\Hotel;
use Illuminate\Validation\ValidationException;

class InventoryService
{
    public function __construct(
        private readonly RoomInventoryRepositoryInterface $repo
    ) {}

    public function listByHotel(int $hotelId)
    {
        return $this->repo->byHotel($hotelId);
    }

    public function create(InventoryData $data)
    {
        $hotel = Hotel::findOrFail($data->hotel_id);
        $current = $hotel->inventories()->sum('quantity');

        if ($current + $data->quantity > $hotel->max_rooms) {
            throw ValidationException::withMessages([
                'quantity' => "Supera el máximo permitido ({$hotel->max_rooms})"
            ]);
        }

        return $this->repo->create($data);
    }

    public function update(int $id, InventoryData $data)
    {
        // regla de negocio idéntica — calcular total excluyendo registro actual
        $inv   = $this->repo->update($id, $data);   // actualizamos
        $hotel = $inv->hotel;
        $total = $hotel->inventories()->sum('quantity');

        if ($total > $hotel->max_rooms) {
            throw ValidationException::withMessages([
                'quantity' => "Supera el máximo permitido ({$hotel->max_rooms})"
            ]);
        }
        return $inv;
    }

    public function delete(int $id): void
    {
        $this->repo->delete($id);
    }
}
