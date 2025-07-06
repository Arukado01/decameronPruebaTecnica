<?php

namespace App\DTO;

class InventoryData
{
    public function __construct(
        public readonly int $hotel_id,
        public readonly int $room_type_id,
        public readonly int $accommodation_id,
        public readonly int $quantity,
    ) {}

    public static function fromArray(array $a): self
    {
        return new self(...$a);
    }

    public function toArray(): array
    {
        return (array) $this;
    }
}
