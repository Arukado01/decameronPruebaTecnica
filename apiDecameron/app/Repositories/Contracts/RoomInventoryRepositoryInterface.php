<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;
use App\DTO\InventoryData;

interface RoomInventoryRepositoryInterface
{
    public function byHotel(int $hotelId): Collection;
    public function create(InventoryData $data): mixed;
    public function update(int $id, InventoryData $data): mixed;
    public function delete(int $id): void;
}
