<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventoryRequest;
use App\DTO\InventoryData;
use App\Services\InventoryService;
use Symfony\Component\HttpFoundation\Response;

class InventoryController extends Controller
{
    public function __construct(private readonly InventoryService $svc) {}

    /**
     * Display a listing of the resource.
     */
    public function index(int $hotelId)
    {
        return response()->json($this->svc->listByHotel($hotelId));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInventoryRequest $req)
    {
        $inv = $this->svc->create(InventoryData::fromArray($req->validated()));
        return response()->json($inv, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreInventoryRequest $req, int $id)
    {
        return $this->svc->update($id, InventoryData::fromArray($req->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->svc->delete($id);
        return response()->noContent();
    }
}
