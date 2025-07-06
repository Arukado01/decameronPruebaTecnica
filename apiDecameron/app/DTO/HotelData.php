<?php

namespace App\DTO;

class HotelData
{
    public function __construct(
        public readonly string  $name,
        public readonly string  $nit,
        public readonly string  $address,
        public readonly string  $city,
        public readonly int     $max_rooms,
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
