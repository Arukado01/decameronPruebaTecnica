<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;
use App\DTO\HotelData;

interface HotelRepositoryInterface
{
    public function all(): Collection;
    public function create(HotelData $data): mixed;
    public function update(int $id, HotelData $data): mixed;
    public function delete(int $id): void;
}
