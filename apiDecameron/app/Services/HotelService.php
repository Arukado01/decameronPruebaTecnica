<?php

namespace App\Services;

use App\DTO\HotelData;
use App\Repositories\Contracts\HotelRepositoryInterface;

class HotelService
{
    public function __construct(
        private readonly HotelRepositoryInterface $repo
    ) {}

    public function list()
    {
        return $this->repo->all();
    }

    public function create(HotelData $data)
    {
        return $this->repo->create($data);
    }

    public function update(int $id, HotelData $data)
    {
        return $this->repo->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->repo->delete($id);
    }
}
