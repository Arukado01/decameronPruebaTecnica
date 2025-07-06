<?php

use App\Models\RoomInventory;
use App\Services\InventoryService;
use App\DTO\InventoryData;
use App\Models\Hotel;

it('rechaza crear inventario cuando supera el máximo', function () {

    $hotel = Hotel::factory(['max_rooms' => 5])->create();
    $svc   = app(InventoryService::class);

    // ya hay 5 ocupados
    RoomInventory::factory(['hotel_id' => $hotel->id, 'quantity' => 5])->create();

    $dto = new InventoryData(
        hotel_id: $hotel->id,
        room_type_id: 1,
        accommodation_id: 1,
        quantity: 1
    );

    $this->expectException(\Illuminate\Validation\ValidationException::class);
    $svc->create($dto);
});
